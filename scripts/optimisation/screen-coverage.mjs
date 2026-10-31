// Prose-only phone screens, per section, as a reader meets each section route with every fold
// in its default state. A screen counts as "visual" when a chart SVG, image, canvas or data table
// of at least 120x60 px, visible, intersects it: marks, not a closed figure's title card.
//
//   node scripts/optimisation/screen-coverage.mjs http://localhost:3100 > coverage.json
//
// Needs Playwright (npm i --no-save playwright, or a global install on NODE_PATH via a .cjs copy).
import { chromium } from "playwright";
import fs from "node:fs";

const base = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const src = fs.readFileSync("lib/content-files.ts", "utf8");
const TABS = [...src.matchAll(/^\s*"?([a-z-]+)"?:\s*"[a-z-]+\.md"/gm)].map((m) => m[1]);
const H = 844;
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: H } })).newPage();
const out = {};
for (const tab of TABS) {
  await p.goto(`${base}/${tab}`, { waitUntil: "networkidle", timeout: 120000 });
  await p.waitForTimeout(400);
  out[tab] = await p.evaluate((H) => {
    const main = document.querySelector("main") || document.body;
    const top = main.getBoundingClientRect().top + scrollY;
    const bottom = main.getBoundingClientRect().bottom + scrollY;
    const vis = [];
    const sel = 'svg, img, canvas, table, [role=img]';
    for (const e of main.querySelectorAll(sel)) {
      const r = e.getBoundingClientRect();
      if (r.width < 120 || r.height < 60 || !e.checkVisibility()) continue;
      vis.push([r.top + scrollY, r.bottom + scrollY]);
    }
    let screens = 0, bare = 0;
    for (let y = top; y < bottom; y += H) {
      screens++;
      if (!vis.some(([a, z]) => z > y && a < y + H)) bare++;
    }
    return { screens, bare, height: Math.round(bottom - top) };
  }, H);
}
await b.close();
console.log(JSON.stringify(out));
