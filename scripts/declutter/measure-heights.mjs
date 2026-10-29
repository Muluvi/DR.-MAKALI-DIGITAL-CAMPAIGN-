// The tallest figures, visuals and panels on every tab at 390px, from a running build on :3100.
// node scripts/declutter/measure-heights.mjs
import { chromium } from "playwright";
import fs from "node:fs";
const src = fs.readFileSync("lib/content-files.ts", "utf8");
const TABS = [...src.matchAll(/^\s*"?([a-z-]+)"?:\s*"[a-z-]+\.md"/gm)].map((m) => m[1]);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const rows = [];
for (const tab of TABS) {
  await p.goto(`http://localhost:3100/${tab}`, { waitUntil: "networkidle" });
  for (let i = 0; i < 40; i++) { await p.evaluate(() => window.scrollBy(0, 3000)); await p.waitForTimeout(60); }
  await p.waitForTimeout(400);
  const r = await p.evaluate((tab) => {
    const main = document.querySelector("main");
    const out = [];
    const W = (s) => ((s || "").match(/[A-Za-z0-9][A-Za-z0-9'’,.%-]*/g) || []).length;
    for (const el of main.querySelectorAll("figure, .pv-slot, [data-insert], .not-prose")) {
      if (el.parentElement.closest("figure, .pv-slot, .not-prose")) continue;
      const h = el.getBoundingClientRect().height;
      if (h < 250) continue;
      const id = el.getAttribute("data-figure") || el.getAttribute("data-visual") || el.id || el.className.toString().slice(0, 40);
      out.push({ tab, id, h: Math.round(h), w: W(el.innerText) });
    }
    return out;
  }, tab);
  rows.push(...r);
}
rows.sort((a, b) => b.h - a.h);
console.log("total tall-element height", rows.reduce((a, r) => a + r.h, 0), "px =", (rows.reduce((a, r) => a + r.h, 0) / 844).toFixed(0), "screens");
for (const r of rows.slice(0, 60)) console.log(String(r.h).padStart(6), String(r.w).padStart(5), r.tab.padEnd(22), r.id);
await b.close();
