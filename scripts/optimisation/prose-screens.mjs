// Prose-only phone screens, per section: the brief's rule that every screen-height of scroll on a
// phone carries a visual. A screen is prose-only when free-flowing prose (paragraphs, list items
// and quotes that sit outside every figure, panel, card, table, visual block and fold control)
// covers more than 60% of its height. Cards, step lists, card-rendered tables and open panels are
// visuals here, as they are to the reader; the strict marks-only measure is screen-coverage.mjs.
//
//   node scripts/optimisation/prose-screens.mjs http://localhost:3100 > prose.json
//
// Needs Playwright (npm i --no-save playwright).
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
    // A container that makes its contents a visual: it has a border or a fill of its own.
    const boxed = (el) => {
      for (let e = el.parentElement; e && e !== main; e = e.parentElement) {
        if (e.matches("figure, table, .pf-panel, [class*='vz'], [data-visual], details, button, [role=group], [role=region]")) return true;
        const cs = getComputedStyle(e);
        const border = ["Top", "Right", "Bottom", "Left"].filter((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none").length;
        const fill = cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent";
        if (border >= 3 || (fill && e.getBoundingClientRect().width < main.getBoundingClientRect().width + 1)) return true;
      }
      return false;
    };
    const prose = [];
    for (const e of main.querySelectorAll("p, li, blockquote")) {
      if (!e.checkVisibility() || e.closest("li, blockquote") !== e && e.closest("li, blockquote")) continue;
      if (boxed(e)) continue;
      const r = e.getBoundingClientRect();
      if (r.height > 0) prose.push([r.top + scrollY, r.bottom + scrollY]);
    }
    let screens = 0, proseOnly = 0;
    for (let y = top; y < bottom; y += H) {
      screens++;
      let covered = 0;
      for (const [a, z] of prose) covered += Math.max(0, Math.min(z, y + H) - Math.max(a, y));
      if (covered > 0.6 * H) proseOnly++;
    }
    return { screens, proseOnly };
  }, H);
}
await b.close();
console.log(JSON.stringify(out));
