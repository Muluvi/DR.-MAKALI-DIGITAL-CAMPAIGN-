#!/usr/bin/env node
/**
 * Moves a whole chapter file into another chapter's file, word for word, and logs the move.
 *
 *   node scripts/consolidation/merge-chapter.mjs <from> <to> "<insert-after text>|BEFORE:<text>|END" "<heading for the moved chapter>|-"
 *
 * The moved chapter keeps its own section numbers, so every heading's number (and therefore its
 * position in check-content's section keys and in the anchor map) travels with it. Its opening text
 * (what came before its first numbered heading) goes under a new heading, "## <N> <title>", where N
 * is the chapter's number; that heading's words are logged as an addition. With "-" as the title
 * (needed for an annex, whose letter alone is not a heading number), no heading is added and the
 * opening text joins the section it lands in.
 *
 * The ledger gets one "moved" entry per section, carrying the section's words as check-content
 * counts them, from "<from>:<number>" to "<to>:<number>". content/<from>.md is deleted.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, conservedWords, sectionsOf, words } from "../declutter/sections.mjs";

const [from, to, after, title] = process.argv.slice(2);
if (!from || !to || !after || !title) {
  console.error('usage: merge-chapter.mjs <from> <to> "<insert-after text>|END" "<title>"');
  process.exit(1);
}
const LEDGER = path.join(ROOT, "docs", "consolidation-2026-11", "ledger.json");
const file = (f) => path.join(ROOT, "content", `${f}.md`);
const src = fs.readFileSync(file(from), "utf8").replace(/\s+$/, "");
let dst = fs.readFileSync(file(to), "utf8").replace(/\s+$/, "");

const sections = sectionsOf(from, src);
const firstNumbered = sections.find((s) => s.number !== "(intro)");
if (!firstNumbered) throw new Error(`merge-chapter: ${from} has no numbered heading`);
const chapter = firstNumbered.number.split(".")[0];
const noHeading = title === "-";
const heading = noHeading ? "" : `## ${chapter} ${title}`;
const block = noHeading ? src : `${heading}\n\n${src}`;

if (after === "END") dst = `${dst}\n\n${block}\n`;
else if (after.startsWith("BEFORE:")) {
  const marker = after.slice("BEFORE:".length);
  const at = dst.indexOf(marker);
  if (at < 0 || dst.indexOf(marker, at + 1) >= 0) throw new Error(`merge-chapter: BEFORE marker must occur exactly once in ${to}`);
  dst = `${dst.slice(0, at).replace(/\s+$/, "")}\n\n${block}\n\n${dst.slice(at)}\n`;
} else {
  const at = dst.indexOf(after);
  if (at < 0) throw new Error(`merge-chapter: anchor not found in ${to}: ${after.slice(0, 60)}`);
  if (dst.indexOf(after, at + 1) >= 0) throw new Error(`merge-chapter: anchor occurs twice in ${to}`);
  const end = at + after.length;
  dst = `${dst.slice(0, end)}\n\n${block}\n\n${dst.slice(end).replace(/^\s+/, "")}\n`;
}
dst = dst.replace(/\n{3,}/g, "\n\n");
fs.writeFileSync(file(to), dst);
fs.rmSync(file(from));
// Where the opening text landed, when no heading was added: the section that holds its first line.
const introLanding = (() => {
  if (!noHeading) return chapter;
  const intro = sections.find((x) => x.number === "(intro)")?.lines.join("\n").trim();
  if (!intro) return chapter;
  // The first line of prose, not a fence marker, which every chapter's opening shares.
  const probe = intro.split("\n").find((l) => l.trim() && !/^\s*```/.test(l)) ?? intro;
  const at = dst.indexOf(probe);
  const line = dst.slice(0, at).split("\n").length;
  let count = 0;
  for (const x of sectionsOf(to, dst)) {
    count += x.lines.length + (x.number === "(intro)" ? 0 : 1);
    if (count >= line) return x.number;
  }
  return "(intro)";
})();

const first12 = (t) => t.replace(/\s+/g, " ").trim().split(" ").slice(0, 12).join(" ");
const ledger = JSON.parse(fs.readFileSync(LEDGER, "utf8"));
for (const s of sections) {
  const text = s.lines.join("\n").trim();
  if (!text) continue;
  const toKey = `${to}:${s.number === "(intro)" ? introLanding : s.number}`;
  ledger.push({
    file: from, section: s.number, first12: first12(text), words: conservedWords(s.lines), kind: "moved", whole: true,
    to: toKey, home: toKey,
    note: `Chapter merge (consolidation Step 4): ${from} moved into ${to}, word for word, under "${title}".`,
    text,
  });
}
if (!noHeading) ledger.push({ file: to, section: chapter, first12: first12(heading), words: 0, kind: "added", home: `${to}:${chapter}`, note: `The heading the merged ${from} chapter sits under.`, text: heading.replace(/^## \S+ /, "") });
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1) + "\n");
console.log(`merge-chapter: ${from} -> ${to} (${sections.length} sections, ${words(src)} words), heading "${heading}"`);
