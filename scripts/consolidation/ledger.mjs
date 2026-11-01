#!/usr/bin/env node
/**
 * Applies one logged content change and appends it to docs/consolidation-2026-11/ledger.json, so a
 * change to content/ and its ledger entry are made in the same step and cannot drift apart.
 *
 *   node scripts/consolidation/ledger.mjs replace <file> "<old text>" "<new text>" "<note>" [home]
 *   node scripts/consolidation/ledger.mjs move <from-file> "<text>" <to-file> "<anchor text to insert after>" "<pointer left behind>" "<note>"
 *
 * `replace` logs kind "replaced": the words removed, net of the replacement, and the replacement.
 * `move` logs kind "moved" with `to` set to the destination section key, and the pointer it leaves
 * behind as kind "added" in the source section.
 * The section is found from the numbered heading above the text, exactly as
 * scripts/declutter/sections.mjs keys it ("<file>:<number>").
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, conservedWords, sectionsOf, words } from "../declutter/sections.mjs";

/** Words as check-content counts them: a whole ```visual fence counts its strings, not its YAML keys. */
const count = (t) => (/^\s*```/m.test(t) ? conservedWords(t.split("\n")) : words(t));

const LEDGER = path.join(ROOT, "docs", "consolidation-2026-11", "ledger.json");
const read = (f) => fs.readFileSync(path.join(ROOT, "content", `${f}.md`), "utf8");
const write = (f, t) => fs.writeFileSync(path.join(ROOT, "content", `${f}.md`), t);

function sectionOf(file, text, needle) {
  const at = text.indexOf(needle);
  if (at < 0) throw new Error(`ledger: text not found in ${file}: ${needle.slice(0, 60)}`);
  if (text.indexOf(needle, at + 1) >= 0) throw new Error(`ledger: text occurs more than once in ${file}: ${needle.slice(0, 60)}`);
  const line = text.slice(0, at).split("\n").length;
  let count = 0;
  for (const s of sectionsOf(file, text)) {
    count += s.lines.length + (s.number === "(intro)" ? 0 : 1);
    if (count >= line) return s.number;
  }
  throw new Error("ledger: section not found");
}

const first12 = (t) => t.replace(/\s+/g, " ").trim().split(" ").slice(0, 12).join(" ");
const ledger = JSON.parse(fs.readFileSync(LEDGER, "utf8"));
const [cmd, ...args] = process.argv.slice(2);

if (cmd === "replace") {
  const [file, oldText, newText, note, home = ""] = args;
  const t = read(file);
  const section = sectionOf(file, t, oldText);
  write(file, t.replace(oldText, newText));
  ledger.push({ file, section, first12: first12(oldText), words: count(oldText) - count(newText), kind: "replaced", home, note, text: oldText, replacement: newText });
} else if (cmd === "move") {
  const [from, text, to, anchor, pointer, note] = args;
  const src = read(from);
  const section = sectionOf(from, src, text);
  const dst = from === to ? src.replace(text, pointer) : read(to);
  const toSection = sectionOf(to, dst, anchor);
  if (from === to) write(from, dst.replace(anchor, `${anchor}\n\n${text}`));
  else {
    write(from, src.replace(text, pointer));
    write(to, dst.replace(anchor, `${anchor}\n\n${text}`));
  }
  // Two entries, so both sections balance exactly: the move carries the whole passage's words from
  // source to destination, and the pointer left behind is logged as an addition to the source.
  ledger.push({ file: from, section, first12: first12(text), words: count(text), kind: "moved", to: `${to}:${toSection}`, home: `${to}:${toSection}`, note, text });
  if (pointer.trim()) ledger.push({ file: from, section, first12: first12(pointer), words: 0, kind: "added", home: `${to}:${toSection}`, note: "The pointer left where the passage was.", text: pointer });
} else {
  console.error("usage: ledger.mjs replace|move …");
  process.exit(1);
}
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1) + "\n");
console.log(`ledger: ${cmd} logged (${ledger.length} entries)`);
