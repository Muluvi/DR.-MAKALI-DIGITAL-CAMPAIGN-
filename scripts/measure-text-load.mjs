#!/usr/bin/env node
/**
 * How much reading the site asks for, per tab, at phone width.
 *
 *     node scripts/measure-text-load.mjs http://localhost:3100 baseline
 *     node scripts/measure-text-load.mjs http://localhost:3100 after --single   # once Brief/Full is removed
 *
 * Writes docs/declutter/metrics-<label>.json and prints a table. For each tab and each reading mode
 * (Brief, Full) it records the page height in 390x844 phone screens and the words in the rendered
 * page (innerText of <main>). Folded prose that stays in the DOM is still counted, so Brief and Full
 * differ less than the eye suggests; compare like with like (baseline Brief against after Brief).
 *
 * It also splits the Full-mode words into figures, component panels and running prose, and lists
 * the wordiest figures, which is where figure-text slimming should start.
 *
 * Tabs are read from lib/content-files.ts so the list cannot drift from the site.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const label = process.argv[3] || "run";
// --single: the site has one version (no Brief/Full). Measure once, labelled "site".
const SINGLE = process.argv.includes("--single");
const MODES = SINGLE ? ["site"] : ["brief", "full"];
const src = fs.readFileSync("lib/content-files.ts", "utf8");
const TABS = [...src.matchAll(/^\s*"?([a-z-]+)"?:\s*"[a-z-]+\.md"/gm)].map((m) => m[1]);
if (!TABS.length) throw new Error("No tabs parsed from lib/content-files.ts");

const SCREEN = 844;
async function settle(p) {
  let last = 0;
  for (let i = 0; i < 80; i++) {
    const h = await p.evaluate(() => { window.scrollBy(0, 3000); return document.documentElement.scrollHeight; });
    await p.waitForTimeout(120);
    if (h === last && i > 5) break;
    last = h;
  }
  await p.waitForTimeout(400);
}

const browser = await chromium.launch();
const out = { label, base, at: new Date().toISOString(), tabs: [], figures: [] };
for (const mode of MODES) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: SCREEN }, reducedMotion: "reduce" });
  if (!SINGLE) await ctx.addInitScript((m) => { try { localStorage.setItem("kitui2027:reading-mode", m); } catch {} }, mode);
  const p = await ctx.newPage();
  for (const tab of TABS) {
    await p.goto(`${base}/${tab}`, { waitUntil: "networkidle" });
    await settle(p);
    const r = await p.evaluate(({ tab, withBlocks }) => {
      const W = (s) => ((s || "").match(/[A-Za-z0-9][A-Za-z0-9'’,.%-]*/g) || []).length;
      const main = document.querySelector("main") || document.body;
      const figs = [...main.querySelectorAll("figure")].filter((f) => !f.parentElement.closest("figure"));
      const panels = [...main.querySelectorAll(".not-prose")].filter((x) => !x.closest("figure") && !x.querySelector("figure") && !x.parentElement.closest(".not-prose"));
      const sum = (els) => els.reduce((a, e) => a + W(e.textContent), 0);
      const total = W(main.innerText);
      const res = {
        tab, height: document.documentElement.scrollHeight, words: total,
        figureWords: sum(figs), panelWords: sum(panels), figureCount: figs.length,
        conflictMarkersVisible: (main.innerText.match(/\[CONFLICT C\d/g) || []).length,
        checkRefVisible: (main.innerText.match(/CHECK REF/g) || []).length,
        tierParentheticals: (main.innerText.match(/\(Tier [123]/g) || []).length,
        foldedWords: [...main.querySelectorAll("[hidden], [inert]")].filter((e) => !e.parentElement.closest("[hidden], [inert]")).reduce((a, e) => a + W(e.textContent), 0),
        longParagraphs: [...main.querySelectorAll("p")].filter((x) => !x.closest("figure") && !x.closest("[hidden], [inert]") && W(x.textContent) > 60).length,
      };
      if (withBlocks) {
        res.blocks = figs.map((f) => ({ tab, id: f.getAttribute("data-figure") || f.id || (f.querySelector("figcaption,h3,h4")?.textContent || "").slice(0, 60), words: W(f.textContent) }));
      }
      return res;
    }, { tab, withBlocks: mode === "full" || mode === "site" });
    if (r.blocks) { out.figures.push(...r.blocks); delete r.blocks; }
    out.tabs.push({ mode, ...r, screens: +(r.height / SCREEN).toFixed(1) });
  }
  await ctx.close();
}
await browser.close();

fs.mkdirSync("docs/declutter", { recursive: true });
out.figures.sort((a, b) => b.words - a.words);
fs.writeFileSync(`docs/declutter/metrics-${label}.json`, JSON.stringify(out, null, 1));

const pad = (s, n) => String(s).padStart(n);
for (const mode of MODES) {
  const rows = out.tabs.filter((t) => t.mode === mode);
  console.log(`\n${mode.toUpperCase()}  tab                      screens   words  fig-words  >60w-paras  conflict-raw  tier-parens`);
  for (const t of rows) console.log(`       ${t.tab.padEnd(24)} ${pad(t.screens, 7)} ${pad(t.words, 7)} ${pad(t.figureWords, 10)} ${pad(t.longParagraphs, 11)} ${pad(t.conflictMarkersVisible, 13)} ${pad(t.tierParentheticals, 12)}`);
  const s = (k) => rows.reduce((a, t) => a + t[k], 0);
  console.log(`       ${"TOTAL".padEnd(24)} ${pad(s("screens").toFixed(0), 7)} ${pad(s("words"), 7)} ${pad(s("figureWords"), 10)} ${pad(s("longParagraphs"), 11)} ${pad(s("conflictMarkersVisible"), 13)} ${pad(s("tierParentheticals"), 12)}`);
}
console.log("\nWordiest figures (Full mode):");
for (const f of out.figures.slice(0, 15)) console.log(`  ${pad(f.words, 5)}  ${f.tab.padEnd(22)} ${f.id}`);
