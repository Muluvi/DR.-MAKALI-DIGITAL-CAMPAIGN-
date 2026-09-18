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

const { chromium } = await import("playwright").catch(() => {
  console.error("measure-section-heights: playwright is not installed. See the note at the top of this file.");
  process.exit(1);
});

// The container ships Chromium at a fixed path with PLAYWRIGHT_BROWSERS_PATH pointing at it;
// honour an explicit override so this runs wherever the browser actually is.
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {}
);
// 390px is the reference phone width the flow is designed against — the reservation only has to
// be right for the readers it protects, and they are on phones.
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(`${BASE}/full`, { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(4000);

// `content-visibility: auto` sections report their placeholder height until they have been laid
// out once, and laying one out lengthens the page, which reveals the next. Walk until none is
// still reporting a placeholder.
for (let pass = 0; pass < 14; pass++) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 8));
    }
  });
  await page.waitForTimeout(1200);
  const pending = await page.evaluate(() =>
    [...document.querySelectorAll('[id^="section-"]')].filter((e) => Math.round(e.getBoundingClientRect().height) === 1400).length
  );
  if (pending === 0) break;
}

const heights = await page.evaluate(() => {
  const out = {};
  document.querySelectorAll('[id^="section-"]').forEach((el) => {
    out[el.id.replace("section-", "")] = Math.round(el.getBoundingClientRect().height);
  });
  return out;
});
await browser.close();

const sorted = Object.fromEntries(Object.entries(heights).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 1) + "\n");
console.log(`section-heights: ${Object.keys(sorted).length} sections measured at 390px.`);
