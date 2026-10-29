#!/usr/bin/env node
/**
 * Check 17 (brief 2026-10 declutter, section 10): the top of every tab at 390 and 1280 px, from a
 * running build, into docs/declutter/screenshots/<label>/<tab>-<width>.jpg.
 *
 *     node scripts/declutter/screenshots.mjs http://localhost:3300 before
 *     node scripts/declutter/screenshots.mjs http://localhost:3100 after
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "after";
const out = path.join("docs", "declutter", "screenshots", label);
fs.mkdirSync(out, { recursive: true });
const src = fs.readFileSync("lib/content-files.ts", "utf8");
const TABS = [...src.matchAll(/^\s*"?([a-z-]+)"?:\s*"[a-z-]+\.md"/gm)].map((m) => m[1]);

const browser = await chromium.launch();
for (const width of [390, 1280]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: "reduce" });
  for (const tab of TABS) {
    await page.goto(`${base}/${tab}`, { waitUntil: "networkidle", timeout: 120000 });
    // The tab's own first section, not the page's top: every tab route opens at its section.
    await page.evaluate((t) => document.getElementById(`section-${t}`)?.scrollIntoView(), tab);
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(out, `${tab}-${width}.jpg`), type: "jpeg", quality: 70 });
  }
  await page.close();
}
await browser.close();
console.log(`screenshots: ${TABS.length * 2} written to ${out}`);
