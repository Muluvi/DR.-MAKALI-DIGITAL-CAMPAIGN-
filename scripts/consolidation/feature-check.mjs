#!/usr/bin/env node
/**
 * The consolidation pass's interactive features, checked in a real browser against a running copy
 * of the site:
 *
 *   1. The workstreams' tabs: one panel shows; a tab click switches it; an old deep link
 *      ("/workstreams#workstreams-media-sec-15-2-1", and "/workstreams-media") opens the right tab;
 *      with JavaScript off and in print, all four panels show.
 *   2. The ward map: six layers; choosing one repaints the tiles; "#ward-map-footprint" opens it
 *      on that layer.
 *   3. The data explorer: search and filters narrow the list; the CSV downloads; "#data-<id>"
 *      opens it on one figure.
 *   4. Merged routes redirect: /commitments, /team, /coalitions, /annex-county, /annex-glossary.
 *
 *     node scripts/consolidation/feature-check.mjs http://localhost:3100
 */
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)("playwright");
const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const fails = [];
const ok = (cond, msg) => { if (cond) console.log(`  ok  ${msg}`); else { console.log(`  FAIL ${msg}`); fails.push(msg); } };
const settle = async (page) => {
  for (let i = 0; i < 60; i++) { await page.evaluate(() => window.scrollBy(0, 900)); await page.waitForTimeout(30); }
  await page.waitForTimeout(600);
};
/** The groups whose opening heading is on the page and not hidden. */
const visiblePanels = (page) => page.evaluate(() => [["platforms", "15-1"], ["media", "15-2"], ["ground", "15-3"], ["data", "15-4"]]
  .filter(([, n]) => { const h = document.getElementById(`workstreams-sec-${n}`); return !!h && h.getClientRects().length > 0; })
  .map(([t]) => t));

const browser = await chromium.launch();
for (const width of [390, 1280]) {
  console.log(`\n@${width}px`);
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage();

  // 1. tabs
  await page.goto(`${BASE}/workstreams`, { waitUntil: "networkidle" });
  await settle(page);
  ok(JSON.stringify(await visiblePanels(page)) === '["platforms"]', "workstreams: one panel (Platforms & content) shows by default");
  await page.click('a[role="tab"][href="#ws-ground"]');
  await page.waitForTimeout(300);
  ok(JSON.stringify(await visiblePanels(page)) === '["ground"]', "workstreams: the Ground & offline tab switches the panel");
  await page.goto(`${BASE}/workstreams#workstreams-media-sec-15-2-1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  ok(JSON.stringify(await visiblePanels(page)) === '["media"]', "workstreams: an old Media anchor opens the Media tab");
  const inView = await page.evaluate(() => { const el = document.getElementById("workstreams-sec-15-2-1"); if (!el) return false; const r = el.getBoundingClientRect(); return r.top > -50 && r.top < window.innerHeight; });
  ok(inView, "workstreams: the old anchor's heading is in view");
  const r = await page.goto(`${BASE}/workstreams-ground`, { waitUntil: "networkidle" });
  ok(new URL(r.url()).pathname === "/workstreams", "workstreams: /workstreams-ground redirects to /workstreams");
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await page.waitForTimeout(200);
  ok((await visiblePanels(page)).length === 4, "workstreams: print shows all four panels");
  await page.emulateMedia({ media: "screen" });

  // 2. ward map
  await page.goto(`${BASE}/votes`, { waitUntil: "networkidle" });
  await settle(page);
  const radios = await page.locator('input[name="fig-3-2-register-map-layer"]').count();
  ok(radios === 6, `ward map: six layers (found ${radios})`);
  const fillOf = () => page.evaluate(() => getComputedStyle(document.querySelector("#fig-3-2-register-map .tm-fill")).fill);
  const before = await fillOf();
  await page.locator('#fig-3-2-register-map input[value="zones"]').check({ force: true });
  await page.waitForTimeout(400);
  ok((await fillOf()) !== before, "ward map: choosing Zones repaints the tiles");
  await page.goto(`${BASE}/votes#ward-map-footprint`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  ok(await page.locator('#fig-3-2-register-map input[value="footprint"]').isChecked(), "ward map: #ward-map-footprint opens the footprint layer");

  // 3. explorer
  await page.goto(`${BASE}/annex-evidence`, { waitUntil: "networkidle" });
  await settle(page);
  await page.waitForSelector("#data-explorer", { timeout: 15000 });
  const count = () => page.locator("#data-explorer [aria-live]").innerText();
  const all = await count();
  await page.fill('#data-explorer input[type="search"]', "ward.kyuso");
  await page.waitForTimeout(300);
  ok(/^1 figures? match/.test(await count()), `explorer: search narrows to one figure (${await count()})`);
  await page.fill('#data-explorer input[type="search"]', "");
  await page.locator("#data-explorer select").nth(2).selectOption("target");
  await page.waitForTimeout(300);
  ok((await count()) !== all && /match/.test(await count()), `explorer: the state filter narrows the list (${await count()})`);
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#data-explorer button:has-text('Download')")]);
  ok(dl.suggestedFilename() === "kitui-2027-registry.csv", "explorer: the CSV downloads");
  await page.goto(`${BASE}/annex-evidence#data-register.2022`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  ok(/^1 figures? match/.test(await count().catch(() => "")), "explorer: #data-register.2022 opens on that figure");

  await ctx.close();
}

// JavaScript off: every panel and the static source table are on the page.
const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
const p2 = await noJs.newPage();
await p2.goto(`${BASE}/workstreams`, { waitUntil: "load" });
ok((await p2.locator("[data-ws-mark]").count()) === 4 && (await visiblePanels(p2)).length === 4, "JavaScript off: all four workstream groups render");
await p2.goto(`${BASE}/votes`, { waitUntil: "load" });
ok((await p2.locator('input[name="fig-3-2-register-map-layer"]').count()) === 6, "JavaScript off: the ward map's layer switch renders");
await noJs.close();

// 4. merged routes
const ctx2 = await browser.newContext();
const p3 = await ctx2.newPage();
for (const [from, to] of [["commitments", "receives"], ["team", "engagement"], ["coalitions", "timeline"], ["annex-county", "votes"], ["annex-glossary", "annex-terms"]]) {
  const res = await p3.goto(`${BASE}/${from}`, { waitUntil: "domcontentloaded" });
  ok(new URL(res.url()).pathname === `/${to}`, `route: /${from} redirects to /${to}`);
}
await browser.close();

if (fails.length) { console.log(`\nfeature-check: ${fails.length} failure(s)`); process.exit(1); }
console.log("\nfeature-check: pass");
