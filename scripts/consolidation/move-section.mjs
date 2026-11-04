#!/usr/bin/env node
/**
 * Moves one numbered section (its heading, its body and every sub-section under it) from one
 * chapter file to another, word for word, and logs the move.
 *
 *   node scripts/consolidation/move-section.mjs <from> <number> <to> "BEFORE:<text>|END" "<pointer>"
 *
 * The section keeps its number, so its anchor id and its check-content key travel with it
 * (scripts/consolidation/anchor-moves.mjs maps the old id to the new one). Every section moved is
 * logged as `moved` with `whole: true`. The pointer, a one-line sentence written in words that names
 * where the text now lives, is left at the end of the section before it in <from>, and is logged as
 * `added`.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, conservedWords, sectionsOf, words } from "../declutter/sections.mjs";

const [from, number, to, where, pointer] = process.argv.slice(2);
if (!from || !number || !to || !where) {
  console.error('usage: move-section.mjs <from> <number> <to> "BEFORE:<text>|END" "<pointer>"');
  process.exit(1);
}
const LEDGER = path.join(ROOT, "docs", "consolidation-2026-11", "ledger.json");
const file = (f) => path.join(ROOT, "content", `${f}.md`);
let src = fs.readFileSync(file(from), "utf8");
let dst = from === to ? null : fs.readFileSync(file(to), "utf8");

// The block: from the section's heading to the next heading at its own level or above.
const lines = src.split("\n");
const HEAD = /^(#{2,3})\s+((?:\d+(?:\.\d+)*|[A-H](?:\.\d+)+))\s/;
let start = -1;
let level = 0;
let fence = false;
for (let i = 0; i < lines.length; i++) {
  if (/^\s*```/.test(lines[i])) fence = !fence;
  if (fence) continue;
  const m = HEAD.exec(lines[i]);
  if (m && m[2] === number) { start = i; level = m[1].length; break; }
}
if (start < 0) throw new Error(`move-section: no heading numbered ${number} in ${from}`);
let end = lines.length;
fence = false;
for (let i = start + 1; i < lines.length; i++) {
  if (/^\s*```/.test(lines[i])) fence = !fence;
  if (fence) continue;
  const m = HEAD.exec(lines[i]);
  if (m && m[1].length <= level && !m[2].startsWith(`${number}.`)) { end = i; break; }
}
const block = lines.slice(start, end).join("\n").replace(/\s+$/, "");
const movedSections = sectionsOf(from, block).filter((s) => s.number !== "(intro)");

// Take it out, and leave the pointer at the end of what now precedes it.
const before = lines.slice(0, start).join("\n").replace(/\s+$/, "");
const after = lines.slice(end).join("\n");
const precedingSection = (() => {
  const secs = sectionsOf(from, before).filter((s) => s.number !== "(intro)");
  return secs.length ? secs[secs.length - 1].number : "(intro)";
})();
src = `${before}${pointer ? `\n\n${pointer}` : ""}\n\n${after}`.replace(/\n{3,}/g, "\n\n");

// Put it in.
const insert = (text) => {
  if (where === "END") return `${text.replace(/\s+$/, "")}\n\n${block}\n`;
  if (!where.startsWith("BEFORE:")) throw new Error("move-section: where must be BEFORE:<text> or END");
  const marker = where.slice("BEFORE:".length);
  const at = text.indexOf(marker);
  if (at < 0 || text.indexOf(marker, at + 1) >= 0) throw new Error(`move-section: BEFORE marker must occur exactly once in ${to}: ${marker.slice(0, 60)}`);
  return `${text.slice(0, at).replace(/\s+$/, "")}\n\n${block}\n\n${text.slice(at)}`;
};
if (dst === null) src = insert(src);
else dst = insert(dst);
fs.writeFileSync(file(from), src.replace(/\n{3,}/g, "\n\n"));
if (dst !== null) fs.writeFileSync(file(to), dst.replace(/\n{3,}/g, "\n\n"));

const first12 = (t) => t.replace(/\s+/g, " ").trim().split(" ").slice(0, 12).join(" ");
const ledger = JSON.parse(fs.readFileSync(LEDGER, "utf8"));
for (const s of movedSections) {
  const text = s.lines.join("\n").trim();
  ledger.push({
    file: from, section: s.number, first12: first12(text || s.title), words: conservedWords(s.lines), kind: "moved", whole: true,
    to: `${to}:${s.number}`, home: `${to}:${s.number}`,
    note: `Section move (consolidation, passage-level merges): ${from} ${s.number} moved into ${to}, word for word, heading and all.`,
    text,
  });
}
if (pointer) ledger.push({ file: from, section: precedingSection, first12: first12(pointer), words: 0, kind: "added", home: `${to}:${number}`, note: "The pointer left where the section was.", text: pointer });
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1) + "\n");
console.log(`move-section: ${from} ${number} -> ${to} (${movedSections.length} section(s), ${words(block)} words)`);
