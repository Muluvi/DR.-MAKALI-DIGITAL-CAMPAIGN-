#!/usr/bin/env node
/**
 * Re-measures data/section-heights.json against a built copy of the site.
 *
 * WHY MEASURED AND NOT ESTIMATED. The flow reserves space for sections that have not streamed in
 * yet, and reserves layout for sections outside the viewport through `contain-intrinsic-size`. If
 * those reservations are wrong the page's total height is wrong, and a deep link into §13 lands
 * thousands of pixels from its target while the document settles under the reader.
 *
 * A formula was tried first — words, table rows, fenced lines and heading count, fitted by least
 * squares against the real thing. It came out at 24% mean error and 294% on Annex C, whose one
 * enormous table collapses into a disclosure panel. Layout is not a function of word count, and
 * pretending it is costs the reader the exact thing the reservation exists to protect.
 *
 * So the heights are measured from the rendered document and checked in. They only have to be
 * close: a stale height costs one scroll correction, never a wrong figure or a broken link.
 * Re-run this after any change that moves a lot of prose.
 *
 *     npm run build && npx next start -p 3210 &
 *     node scripts/measure-section-heights.mjs http://localhost:3210
 *
 * Playwright is not a dependency of this project — install it in a scratch directory and point
 * NODE_PATH at it, or run this from a checkout that has it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "data", "section-heights.json");
const BASE = process.argv[2] ?? "http://localhost:3000";

/**
 * Resolve playwright from wherever it happens to be.
 *
 * A bare `import("playwright")` ignores NODE_PATH — ESM resolution does not consult it — so the
 * instruction at the top of this file was a lie for anyone who followed it. Fall back to
 * CommonJS resolution, which does honour NODE_PATH, before giving up.
 */
const { chromium } = await (async () => {
  try {
    return await import("playwright");
  } catch {
    const { createRequire } = await import("node:module");
    const req = createRequire(import.meta.url);
    for (const dir of (process.env.NODE_PATH ?? "").split(path.delimiter).filter(Boolean)) {
      try { return req(path.join(dir, "playwright")); } catch { /* try the next one */ }
      try { return req(path.join(dir, "playwright-core")); } catch { /* try the next one */ }
    }
    console.error("measure-section-heights: playwright is not installed. See the note at the top of this file.");
    process.exit(1);
  }
})();

// The container ships Chromium at a fixed path with PLAYWRIGHT_BROWSERS_PATH pointing at it;
// honour an explicit override so this runs wherever the browser actually is.
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? process.env.PLAYWRIGHT_CHROMIUM
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? process.env.PLAYWRIGHT_CHROMIUM }
    : {}
);
// 390px is the reference phone width the flow is designed against — the reservation only has to
// be right for the readers it protects, and they are on phones.
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(`${BASE}/full`, { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(4000);

// `content-visibility: auto` sections report their reserved height until they have been laid out
// once, and the reservation is each section's own previous measurement, so a section the walk
// never reached reports last time's number as if it were new. Content visibility is therefore
// switched off for the measurement, and the walk (which still wakes lazily mounted figures)
// repeats until two passes measure the same heights.
const measure = () =>
  page.evaluate(() => {
    const out = {};
    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      out[el.id.replace("section-", "")] = Math.round(el.getBoundingClientRect().height);
    });
    return out;
  });
// Measure layout, not the reservation: lay every section out for real while measuring.
await page.addStyleTag({ content: '[id^="section-"]{content-visibility:visible!important;contain-intrinsic-size:none!important}' });
await page.waitForTimeout(1500);
let heights = await measure();
for (let pass = 0; pass < 14; pass++) {
  await page.evaluate(async () => {
    for (const el of document.querySelectorAll('[id^="section-"]')) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      for (let y = top; y < top + el.getBoundingClientRect().height; y += 800) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 8));
      }
    }
  });
  await page.waitForTimeout(1200);
  const next = await measure();
  const stable = Object.keys(next).every((k) => next[k] === heights[k]);
  heights = next;
  if (stable) break;
}
await browser.close();

const sorted = Object.fromEntries(Object.entries(heights).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 1) + "\n");
console.log(`section-heights: ${Object.keys(sorted).length} sections measured at 390px.`);
