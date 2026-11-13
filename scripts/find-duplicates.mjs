#!/usr/bin/env node
/**
 * Finds paragraphs that say the same thing twice, and checks the declared list against them.
 *
 *     node scripts/find-duplicates.mjs           # report what is in the content now
 *     node scripts/find-duplicates.mjs --check   # fail if the declared list disagrees
 *
 * WHY THIS IS DERIVED AND NOT A LIST. DECISIONS.md D-1 carried a hand-written table of eleven
 * repetitions. By the time anyone came to collapse them, the restructure and the ASCII retirement
 * had removed most: re-derived from the content, three survive. A hand-kept list of duplicates in
 * a document that is being restructured is a list of things that used to be true.
 *
 * HOW IT MATCHES. Trigram overlap over case- and punctuation-folded words, scored against the
 * SHORTER paragraph so a restatement inside a longer passage still registers. Both sides must
 * carry at least MIN_WORDS: a short paragraph shares trigrams with almost anything, and an early
 * draft of this script duly reported a 25-word narrative line as a duplicate of a 184-word bullet
 * block it had nothing to do with.
 *
 * Fenced blocks, headings and table rows are excluded. Fences are retired figures now, and a
 * figure's data table legitimately restates numbers that appear in prose.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");
const DECLARED = path.join(ROOT, "data", "duplicates.json");

/**
 * Below this, a paragraph is too short for trigram overlap to mean anything.
 *
 * Tuned, not guessed. At 25 a 184-word bullet block in §6 matched a 25-word narrative line it had
 * nothing to do with, because a short paragraph shares trigrams with almost anything. At 40 the
 * genuine “does not commit to an electoral outcome” pair dropped out, its shorter side being 29
 * words. 28 keeps every real repetition and admits no false one, on this document.
 */
const MIN_WORDS = 28;
/** Overlap against the shorter paragraph, above which two paragraphs are saying one thing. */
const THRESHOLD = 0.6;

const fold = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const trigrams = (words) => {
  const out = new Set();
  for (let i = 0; i + 2 < words.length; i++) out.add(words.slice(i, i + 3).join(" "));
  return out;
};

function paragraphs(file) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const kept = [];
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) kept.push(line);
  }
  return kept
    .join("\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#") && !p.startsWith("|"));
}

const files = fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md")).sort();
const items = [];
for (const f of files) {
  for (const text of paragraphs(path.join(CONTENT, f))) {
    const words = fold(text);
    if (words.length < MIN_WORDS) continue;
    items.push({ chapter: f.replace(/\.md$/, ""), text, words: words.length, grams: trigrams(words) });
  }
}

const found = [];
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const a = items[i];
    const b = items[j];
    if (a.chapter === b.chapter) continue; // a section restating its own lead is the Brief fold's job
    let shared = 0;
    for (const g of a.grams) if (b.grams.has(g)) shared++;
    const score = shared / Math.min(a.grams.size, b.grams.size);
    if (score >= THRESHOLD) {
      // An UNORDERED pair. Which side is canonical is a reading-order judgement the declaration
      // makes — the duplicate is the one the reader meets second — and this file walks the
      // chapters alphabetically, which is not reading order. Emitting a direction here would be
      // emitting a guess, and for the §8.0 / §10.1 pair it would be the wrong one.
      found.push({
        score: Number(score.toFixed(2)),
        sides: [
          { chapter: a.chapter, opening: a.text.slice(0, 60), words: a.words },
          { chapter: b.chapter, opening: b.text.slice(0, 60), words: b.words },
        ],
      });
    }
  }
}
found.sort((x, y) => y.score - x.score);

const check = process.argv.includes("--check");
if (!check) {
  console.log(`${items.length} paragraphs of ${MIN_WORDS}+ words across ${files.length} chapters.\n`);
  for (const f of found) {
    const [x, y] = f.sides;
    console.log(`${f.score}  ${x.chapter} (${x.words}w) ↔ ${y.chapter} (${y.words}w)`);
    console.log(`      "${x.opening}…"`);
  }
  console.log(`\n${found.length} cross-chapter repetition(s).`);
  process.exit(0);
}

const declared = JSON.parse(fs.readFileSync(DECLARED, "utf8")).duplicates;
/** Both chapters and both openings, sorted, so the declaration's direction is not part of the key. */
const keyOf = (sides) =>
  sides
    .map((s) => `${s.chapter}:${s.opening.slice(0, 40)}`)
    .sort()
    .join(" ↔ ");
const foundKeys = new Set(found.map((f) => keyOf(f.sides)));
const declaredKeys = new Set(declared.map((d) => keyOf([d.canonical, d.duplicate])));

const missing = [...declaredKeys].filter((k) => !foundKeys.has(k));
const undeclared = [...foundKeys].filter((k) => !declaredKeys.has(k));

if (missing.length || undeclared.length) {
  console.error("\nDUPLICATES DECLARATION FAILED — data/duplicates.json disagrees with the content:\n");
  for (const k of missing) console.error(`  declared, no longer present:  ${k}`);
  for (const k of undeclared) console.error(`  present, not declared:        ${k}`);
  console.error(
    "\nA collapsed cross-reference points at a paragraph that must still be there. Re-run without\n" +
      "--check to see what the content now holds, and update data/duplicates.json to match.\n"
  );
  process.exit(1);
}

console.log(
  `Duplicates check passed: ${declared.length} declared repetition(s), all still present and none undeclared.`
);
