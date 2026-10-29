#!/usr/bin/env node
/**
 * Content safety checks 3, 4, 5 and 9 (brief 2026-10 declutter, section 10), against 4bfc078.
 *
 *   3  Every ```figure fence (92) and ```textversion fence (5) is present, its body unchanged.
 *   4  Word conservation. Per section: words after (prose, plus the text moved into ```visual
 *      fences; leads excluded) plus the words logged in docs/declutter/cuts.json for that section
 *      equals the words before. The total must hold within ±1%, and no section may lose more than 2%
 *      without a logged cut. Text a visual adds (a label, a badge, a title written for it) is
 *      reported separately and does not count towards the balance, so it cannot hide a loss.
 *   5  Duplicate cuts are real. For every cut logged as a duplicate (or replaced by a chip), every {{token}} and every
 *      capitalised name in the cut text appears at the logged canonical home.
 *   9  Conflicts C1 to C8: the same 27 `[CONFLICT Cn` markers, each still after the words it
 *      followed at 4bfc078 (so still inside the passage it marked).
 *
 *     node scripts/declutter/check-content.mjs            # report and fail on a breach
 *     node scripts/declutter/check-content.mjs --sections # also print every section's balance
 */
import fs from "node:fs";
import path from "node:path";
import {
  ROOT, baseFiles, nowFiles, readBase, readNow, sectionsOf, conservedWords, partsOf, reachableText, loadCuts, words,
} from "./sections.mjs";

const errors = [];
const SHOW = process.argv.includes("--sections");

const before = Object.fromEntries(baseFiles().map((f) => [f, readBase(f)]));
const after = Object.fromEntries(nowFiles().map((f) => [f, readNow(f)]));
const secBefore = Object.values(Object.fromEntries(Object.entries(before).map(([f, t]) => [f, sectionsOf(f, t)]))).flat();
const secAfter = Object.values(Object.fromEntries(Object.entries(after).map(([f, t]) => [f, sectionsOf(f, t)]))).flat();
const byKeyAfter = Object.fromEntries(secAfter.map((s) => [s.key, s]));
const byNumberAfter = Object.fromEntries(secAfter.filter((s) => s.number !== "(intro)").map((s) => [s.number, s]));
const cuts = loadCuts();

/* ---------------------------------------------------------------- 3: fences */
const fenceBodies = (texts, kind) => {
  const out = [];
  for (const t of Object.values(texts)) {
    const re = new RegExp("^```" + kind + "\\n([\\s\\S]*?)^```", "gm");
    for (const m of t.matchAll(re)) out.push(m[1].trim());
  }
  return out.sort();
};
for (const kind of ["figure", "textversion"]) {
  const b = fenceBodies(before, kind);
  const a = fenceBodies(after, kind);
  const missing = b.filter((x) => !a.includes(x));
  if (missing.length || a.length !== b.length) errors.push(`3: ${kind} fences ${b.length} before, ${a.length} after; missing or changed: ${missing.map((x) => x.slice(0, 40)).join(" | ")}`);
  else console.log(`3. ${kind} fences: ${a.length} of ${b.length} present, unchanged`);
}

/* ---------------------------------------------------------------- 4: conservation */
const cutWords = {};
for (const c of cuts) {
  cutWords[`${c.file}:${c.section}`] = (cutWords[`${c.file}:${c.section}`] ?? 0) + c.words;
  // A move takes words from one section to another: the source is credited, the destination debited.
  if (c.kind === "moved") cutWords[c.to] = (cutWords[c.to] ?? 0) - c.words;
}
let totalBefore = 0;
let totalAfter = 0;
let totalCut = 0;
let totalAdded = 0;
const rows = [];
for (const s of secBefore) {
  const a = byKeyAfter[s.key];
  const wb = conservedWords(s.lines);
  // Text moved into this section counts as its own: a visual built from it is matched against it too.
  const movedIn = cuts.filter((c) => c.kind === "moved" && c.to === s.key).map((c) => c.text ?? "");
  const counted = a ? conservedWords(a.lines, [s.lines.join("\n"), ...movedIn].join("\n")) : { total: 0, added: 0 };
  const wa = counted.total;
  totalAdded += counted.added;
  const wc = cutWords[s.key] ?? 0;
  totalBefore += wb;
  totalAfter += wa;
  totalCut += wc;
  const loss = wb - (wa + wc);
  rows.push({ key: s.key, wb, wa, wc, loss });
  if (!a) errors.push(`4: section ${s.key} is gone`);
  else if (wb > 0 && loss / wb > 0.02 && loss > 2) errors.push(`4: ${s.key} loses ${loss} of ${wb} words (${((loss / wb) * 100).toFixed(1)}%) without a logged cut`);
}
const drift = (totalAfter + totalCut - totalBefore) / totalBefore;
if (Math.abs(drift) > 0.01) errors.push(`4: words after ${totalAfter} + cut ${totalCut} = ${totalAfter + totalCut} against ${totalBefore} before (${(drift * 100).toFixed(2)}%)`);
console.log(`4. words: ${totalBefore} before; ${totalAfter} after + ${totalCut} logged cuts = ${totalAfter + totalCut} (${(drift * 100).toFixed(2)}%); ${totalAdded} words added by visuals (labels, titles), counted apart`);
if (SHOW) for (const r of rows) if (r.wb !== r.wa || r.wc) console.log(`   ${r.key.padEnd(34)} ${String(r.wb).padStart(5)} → ${String(r.wa).padStart(5)} + cut ${String(r.wc).padStart(4)}  ${r.loss > 0 ? `loss ${r.loss}` : ""}`);

/* ---------------------------------------------------------------- 5: duplicate cuts */
const SENTENCE_START = /(?:^\s*|[.!?:;]\s+|\n\s*[-*]?\s*|\*\*|["“(])$/;
function capitalisedNames(text) {
  const clean = text.replace(/\{\{[^}]*\}\}/g, " ").replace(/[*_`>#|]/g, " ");
  const out = new Set();
  for (const m of clean.matchAll(/\b[A-Z][A-Za-z'’.-]*[A-Za-z]/g)) {
    const at = m.index ?? 0;
    if (SENTENCE_START.test(clean.slice(Math.max(0, at - 4), at))) continue;
    out.add(m[0].replace(/['’]s$/, ""));
  }
  return [...out];
}
function homeText(home) {
  return String(home)
    .split("|")
    .map((h) => h.trim())
    .map((h) => {
      if (h.startsWith("nav-blurb:")) {
        const src = fs.readFileSync(path.join(ROOT, "lib", "heading-slug.ts"), "utf8");
        const tab = h.slice("nav-blurb:".length);
        const m = new RegExp(`id: "${tab}"[\\s\\S]*?blurb:\\s*"([^"]*)"`).exec(src);
        return m ? m[1] : "";
      }
      const sec = byKeyAfter[h] ?? byNumberAfter[h];
      return sec ? [reachableText(sec.lines), ...partsOf(sec.lines).leads].join("\n") : "";
    })
    .join("\n");
}
let dupChecked = 0;
for (const c of cuts.filter((x) => x.kind === "duplicate" || x.kind === "blurb" || x.kind === "chip")) {
  const home = homeText(c.home);
  if (!home) {
    errors.push(`5: cut in ${c.file}:${c.section} names a home that does not exist: ${c.home}`);
    continue;
  }
  const tokens = c.text.match(/\{\{[^}]*\}\}/g) ?? [];
  const missingTokens = tokens.filter((t) => !home.includes(t));
  const missingNames = capitalisedNames(c.text).filter((n) => !home.includes(n) && !(c.allow ?? []).includes(n));
  if (missingTokens.length || missingNames.length) {
    errors.push(`5: cut in ${c.file}:${c.section} ("${c.first12}") has facts its home ${c.home} lacks: ${[...missingTokens, ...missingNames].join(", ")}`);
  }
  dupChecked += 1;
}
console.log(`5. duplicate cuts: ${dupChecked} checked against their canonical homes`);

/* ---------------------------------------------------------------- 9: conflicts */
const MARK = /\[CONFLICT (C\d+): see open items\]/g;
const plain = (s) => s.replace(/<!--\s*keep\s*-->/g, " ").toLowerCase().replace(/\{\{[^}]*\}\}/g, " tok ").replace(/[^a-z0-9]+/g, " ").trim();
const contextsBefore = [];
for (const [f, t] of Object.entries(before)) {
  for (const m of t.matchAll(MARK)) contextsBefore.push({ f, id: m[1], ctx: plain(t.slice(Math.max(0, (m.index ?? 0) - 160), m.index)).split(" ").slice(-5).join(" ") });
}
const markersAfter = Object.values(after).reduce((n, t) => n + [...t.matchAll(MARK)].length, 0);
if (markersAfter !== contextsBefore.length) errors.push(`9: ${contextsBefore.length} conflict markers before, ${markersAfter} after`);
let placed = 0;
for (const c of contextsBefore) {
  const t = after[c.f] ?? "";
  const ok = [...t.matchAll(MARK)].some((m) => m[1] === c.id && plain(t.slice(Math.max(0, (m.index ?? 0) - 200), m.index)).endsWith(c.ctx));
  if (ok) placed += 1;
  else errors.push(`9: ${c.id} in ${c.f} no longer follows "${c.ctx}"`);
}
console.log(`9. conflict markers: ${markersAfter} (was ${contextsBefore.length}); ${placed} still follow the words they marked`);

if (errors.length) {
  console.log("\ncheck-content: FAILED");
  for (const e of errors) console.log("  - " + e);
  process.exit(1);
}
console.log("\ncheck-content: checks 3, 4, 5 and 9 pass");
