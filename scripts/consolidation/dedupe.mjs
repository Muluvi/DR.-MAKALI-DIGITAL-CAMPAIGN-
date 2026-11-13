#!/usr/bin/env node
/**
 * Where two copies of the same fact meet after a merge, keeps one and turns the other into a
 * one-line pointer written in words, logged as kind "duplicate" with the kept copy as its home.
 * check-content check 5 then verifies that every {{token}} and every name in the removed copy is at
 * that home.
 *
 *   node scripts/consolidation/dedupe.mjs <file> "<duplicate text>" "<pointer>" <home file:number> "<note>"
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, sectionsOf, words } from "../declutter/sections.mjs";

const [file, text, pointer, home, note] = process.argv.slice(2);
const p = path.join(ROOT, "content", `${file}.md`);
const t = fs.readFileSync(p, "utf8");
const at = t.indexOf(text);
if (at < 0 || t.indexOf(text, at + 1) >= 0) throw new Error("dedupe: the text must occur exactly once");
const line = t.slice(0, at).split("\n").length;
let count = 0;
let section = "(intro)";
for (const s of sectionsOf(file, t)) {
  count += s.lines.length + (s.number === "(intro)" ? 0 : 1);
  if (count >= line) { section = s.number; break; }
}
fs.writeFileSync(p, t.replace(text, pointer));
const LEDGER = path.join(ROOT, "docs", "consolidation-2026-11", "ledger.json");
const ledger = JSON.parse(fs.readFileSync(LEDGER, "utf8"));
const first12 = (s) => s.replace(/\s+/g, " ").trim().split(" ").slice(0, 12).join(" ");
ledger.push({ file, section, first12: first12(text), words: words(text) - words(pointer), kind: "duplicate", home, note, text, replacement: pointer });
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1) + "\n");
console.log(`dedupe: ${file}:${section} -> pointer to ${home}`);
