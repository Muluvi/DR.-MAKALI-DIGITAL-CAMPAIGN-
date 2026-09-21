#!/usr/bin/env node
/**
 * app/apple-icon.png, 180x180 — the home-screen icon.
 *
 * WHY A SCRIPT AND NOT A FILE CONVENTION. `app/icon.svg` is served as-is by Next and needs no
 * build step, which is why the favicon is an SVG committed in place. Apple's touch icon is not
 * so accommodating: iOS ignores SVG, so this one has to be a PNG, and a PNG in a repository is
 * a thing that drifts from the mark it was made from unless the command that made it is here too.
 *
 * It renders the same geometry as app/icon.svg at 180px. If the mark changes, change both and
 * re-run this.
 *
 *     node scripts/build-app-icon.mjs
 *
 * Playwright is not a dependency of this project — same NODE_PATH arrangement as
 * scripts/build-og-image.mjs. The PNG is committed, so this only runs when the mark changes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "app", "apple-icon.png");

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const { createRequire } = await import("node:module");
    const req = createRequire(import.meta.url);
    for (const dir of (process.env.NODE_PATH ?? "").split(path.delimiter).filter(Boolean)) {
      try { return req(path.join(dir, "playwright")); } catch { /* next */ }
    }
    console.error("build-app-icon: playwright is not installed. See the note at the top of this file.");
    process.exit(1);
  }
}

/** The mark, at 180px. Same colours and same order as app/icon.svg and the share card. */
const MARK = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0 }
  body { width: 180px; height: 180px; overflow: hidden }
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#f3f5f9"/>
  <rect width="180" height="18" fill="url(#edge)"/>
  <defs>
    <linearGradient id="edge" x1="0" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2b3ea8"/><stop offset="1" stop-color="#a9151f"/>
    </linearGradient>
  </defs>
  <path d="M34 58h20v29.7L83.4 58h25L76.4 92 110 132H85.2L62.4 103.7 54 112.4V132H34z" fill="#2b3ea8"/>
  <text x="118" y="132" font-family="Georgia, 'DejaVu Serif', serif" font-size="42" font-weight="700" fill="#a9151f">27</text>
</svg></body></html>`;

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
await page.setContent(MARK, { waitUntil: "load" });
fs.mkdirSync(path.dirname(OUT), { recursive: true });
await page.screenshot({ path: OUT, omitBackground: false });
await browser.close();
console.log(`build-app-icon: ${path.relative(ROOT, OUT)} written, 180x180.`);
