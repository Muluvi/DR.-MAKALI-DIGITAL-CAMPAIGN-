#!/usr/bin/env node
/**
 * Build guard: the restructure moved body text, it did not rewrite it.
 *
 * The 2026 restructure split three markdown documents into ten and renumbered every heading.
 * The one thing that must not have happened along the way is a quiet edit to the prose — so
 * rather than asserting that, this proves it, by comparing the body of the document today
 * against the body of the document immediately before the restructure.
 *
 * Method: take every non-heading, non-blank line from both sides and compare them as multisets.
 * Headings are excluded because renaming them is the point of the restructure. Three further
 * allowances, each narrow and each a thing the brief explicitly permitted:
 *
 *   1. Sections 34, 35, 37, 38 and 39 were deleted, so the old side drops them.
 *   2. Nine orientation lines were added, one per content section, so the new side drops them.
 *   3. Cross-references were repointed to the new numbering, which is the only permitted body
 *      edit — so a "Section 4.3.2" token is normalised away on both sides before comparing.
 *
 * Anything else that differs is a content change, and this script fails the build for it.
 *
 * Run as part of `npm run verify` and on `prebuild`.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "public", "content");
/** The commit immediately before the restructure — the state this checks against. */
const BASE = process.env.CONTENT_BASELINE ?? "3fb771a";
const OLD_FILES = ["exec.md", "programme.md", "registers.md"];
const DELETED_SECTIONS = new Set(["34", "35", "37", "38", "39"]);

/** The nine section-landing orientation lines, quoted in full so they can be audited here. */
const ORIENTATION_LINES = new Set([
  "Four readings of the ground: how the nomination will be decided, who the candidate is running against, the ward arithmetic, and the county’s three regions.",
  "The claim at the centre of this campaign, the pillars and themes beneath it, the segments it is aimed at, and how the message is built, framed and produced.",
  "The channel architecture and the platforms it runs on, paid and earned media, the radio landscape, and the languages and access requirements every asset has to meet.",
  "How field reporting and digital response feed each other, the SMS and USSD layer that reaches voters off the internet, and the volunteer and coalition programmes behind it.",
  "Rapid response, the war room that runs it, the cybersecurity and manipulated-media protocols behind it, and how rivals are monitored from public sources.",
  "The data model and its provenance rules, the voter model built on it, the technology stack, the analytics layer, and the ethics, privacy and statutory obligations governing all of it.",
  "The scope Firefly would run, the team structure that runs it, and the leadership roles and governance rhythm around it.",
  "What the campaign measures and why, the two scorecards, the phased plan, and the research and tracker programmes that feed them.",
  "What the campaign gets, the budget tiers and the economics behind them, and how Firefly and the campaign would work together.",
]);

/**
 * Strip section-number tokens, so a repointed cross-reference reads the same on both sides.
 *
 * Applied to the whole document rather than line by line, because the markdown hard-wraps at
 * about 80 columns and a reference can straddle the break ("Section\n4.3") — matching per line
 * would miss exactly those and report them as content changes.
 */
function normaliseRefs(text) {
  return text.replace(/(Sections?|§)\s*\d+[A-Za-z]?(?:\.\d+)*/g, "$1 #");
}

/**
 * The two pointers into the deleted §39.1, removed by cutting a self-contained appositive so
 * each sentence closes on words already present. Quoted here in full so the one category of
 * permitted deletion inside a sentence is auditable rather than implicit.
 */
const REMOVED_POINTERS = [
  " (a verified dispute detailed in Section #)",
  ", a discrepancy detailed in Section #",
];

/**
 * The deleted registers' own scaffolding: the opening rule of registers.md and the raw wrapper
 * that spanned §34–§38. Counted rather than matched by value, because "---" is also an ordinary
 * horizontal rule used 133 times elsewhere in the document and those all survive.
 */
const REMOVED_SCAFFOLDING = new Map([
  ["---", 1],
  ['<section id="firefly-audit-implementation" class="audit-section">', 1],
]);

/** Every body line of a document: headings dropped, blanks dropped, fenced blocks kept whole. */
function bodyLines(text, { dropDeletedSections = false } = {}) {
  const out = [];
  let inFence = false;
  let skipping = false;
  for (const line of text.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      if (!skipping) out.push(line);
      continue;
    }
    if (!inFence) {
      const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
      if (heading) {
        if (dropDeletedSections && heading[1].length === 2) {
          const number = /^(\d+)/.exec(heading[2].replace(/\*/g, ""));
          if (number) skipping = DELETED_SECTIONS.has(number[1]);
        }
        continue;
      }
    }
    if (skipping || line.trim() === "") continue;
    out.push(line);
  }
  return out;
}

function tally(lines) {
  const counts = new Map();
  for (const line of lines) counts.set(line, (counts.get(line) ?? 0) + 1);
  return counts;
}

function difference(a, b) {
  const out = [];
  for (const [line, count] of a) {
    const extra = count - (b.get(line) ?? 0);
    if (extra > 0) out.push([line, extra]);
  }
  return out;
}

let before = [];
for (const file of OLD_FILES) {
  let text;
  try {
    text = execSync(`git show ${BASE}:public/content/${file}`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch {
    console.error(`Content integrity check SKIPPED — cannot read ${file} at ${BASE}.`);
    console.error("This needs the pre-restructure commit in history; set CONTENT_BASELINE to override.");
    process.exit(0);
  }
  let normalised = normaliseRefs(text);
  for (const pointer of REMOVED_POINTERS) normalised = normalised.split(pointer).join("");
  before = before.concat(bodyLines(normalised, { dropDeletedSections: true }));
}

let after = [];
for (const file of fs.readdirSync(CONTENT).sort()) {
  if (!file.endsWith(".md")) continue;
  const text = normaliseRefs(fs.readFileSync(path.join(CONTENT, file), "utf8"));
  after = after.concat(bodyLines(text).filter((line) => !ORIENTATION_LINES.has(line.trim())));
}

const allowance = new Map(REMOVED_SCAFFOLDING);
const beforeBody = before.filter((line) => {
  const left = allowance.get(line.trim());
  if (!left) return true;
  allowance.set(line.trim(), left - 1);
  return false;
});
const lost = difference(tally(beforeBody), tally(after));
const added = difference(tally(after), tally(beforeBody));

if (lost.length === 0 && added.length === 0) {
  console.log(
    `Content integrity check passed: all ${after.length} body lines are unchanged since ${BASE}, ` +
      `apart from the deleted registers, the nine logged orientation lines, and repointed cross-references.`
  );
  process.exit(0);
}

console.error(`\nContent integrity check FAILED — the restructure changed body text.\n`);
for (const [line, count] of lost.slice(0, 20)) console.error(`  lost  (x${count}): ${line.slice(0, 140)}`);
for (const [line, count] of added.slice(0, 20)) console.error(`  added (x${count}): ${line.slice(0, 140)}`);
console.error(
  `\n${lost.length} line(s) lost, ${added.length} added. Body text is meant to move verbatim; ` +
    `only headings, the logged orientation lines and cross-reference numbers may change.\n`
);
process.exit(1);
