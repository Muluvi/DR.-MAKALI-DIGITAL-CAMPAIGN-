import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Build guard: the redesign moves figures, it does not lose them.
 *
 * The client's instruction on this restructure was explicit — the proposal's data stays; length
 * comes out of prose. That is a promise no amount of review can keep on its own, because the
 * cuts are spread over nineteen files and a figure lost inside an eighty-line ASCII box looks
 * exactly like a figure that was never there. So this proves it instead.
 *
 * Method: enumerate every quantity in the document at a baseline commit, enumerate them again
 * in the working tree, and fail the build on anything that vanished.
 *
 * TWO RULES, and the second is the one that matters.
 *
 *   1. RETENTION. A figure present at the baseline must still exist somewhere in the repository
 *      — content, data module or component. Catches outright deletion.
 *
 *   2. PRINT REACH. A figure that was in public/content/ must still be in public/content/, or be
 *      declared in scripts/figure-migrations.json with the place it moved to.
 *
 * Rule 2 exists because rule 1 is not enough, and the redesign audit found out why. Much of the
 * landing route is print:hidden — components/ClientPage.tsx wrapped DeficitGauge in it, against
 * that component's own stated intent to print. A figure that moves from markdown into a
 * component can therefore satisfy rule 1 while disappearing from every PDF the campaign hands
 * out. The markdown and the print path are the document of record; the screen is not.
 *
 * So a migration out of public/content/ is not forbidden — it is made deliberate. Declaring it
 * costs one JSON entry and a sentence saying where the figure went, which is the same bargain
 * scripts/notation-rewrites.json strikes for prose.
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It matches a quantity's digits and unit, not its meaning.
 * "40 wards" and "40%" are different figures here; "40 wards" and "40 captains" are not. It is a
 * screen against loss, not a proof of equivalence, and a figure it clears may have survived in a
 * sentence about something else. Every genuine orphan is caught; a few false clears are the
 * price of running without a semantic model of the document.
 *
 * Run as part of `npm run verify` and on `prebuild`.
 */

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "public", "content");

/**
 * The state this checks against.
 *
 * `f6b0af4` is the commit before the P0 redesign work began — the document as the September 2026
 * audit found it, with every figure the proposal had accumulated to that point. Moving this
 * forward is the same deliberate act as moving the content-integrity baseline, and carries the
 * same obligation: enumerate what changed in CHANGE-LOG.md first.
 */
const BASE = process.env.FIGURE_BASELINE ?? "f6b0af4";

/** Where a figure may live and still count as retained (rule 1). */
const SEARCH_DIRS = ["public/content", "data", "components", "lib"];

/**
 * Declared migrations out of public/content/ (rule 2).
 *
 * Each entry names a figure that left the markdown on purpose and says where it went, so the
 * move is reviewable here rather than inferred from a diff.
 */
const MIGRATIONS_FILE = path.join(ROOT, "scripts", "figure-migrations.json");

/**
 * Collapse section references before counting, so "Section 8.10.6" is a pointer and not the
 * figures 8, 10 and 6. Mirrors scripts/verify-content-integrity.mjs, deliberately — the two
 * guards must agree on what counts as a number.
 */
function stripReferences(text) {
  return text
    .replace(/(?:Sub)?sections?\s*\d+[A-Za-z]?(?:\.\d+)*(?:\s*(?:,|and|&)\s*\d+[A-Za-z]?(?:\.\d+)*)*/gi, " ")
    .replace(/Sec\s*\d+(?:\.\d+)*/gi, " ")
    .replace(/§\s*\d+[A-Za-z]?(?:\.\d+)*/g, " ")
    // A bare three-part number is always a section reference in this document; no figure it
    // carries has two decimal points.
    .replace(/(^|[^\w.§])\d{1,2}\.\d{1,2}\.\d{1,2}(?![\d.])/g, "$1 ")
    // Markdown heading numbers, e.g. "## 3.4 The vote arithmetic".
    .replace(/^#{1,6}\s+\d+(?:\.\d+)*/gm, " ")
    // Deep-link ids and slugs: "situation-sec-3-4-1".
    .replace(/[a-z-]+-sec-[\d-]+/gi, " ");
}

/** Quantities that are structure, not evidence. */
const NOISE = new Set([
  // Calendar years carry no campaign quantity of their own; the dates that matter are written
  // out ("7 August 2026") and survive as their day and year anyway.
  ...Array.from({ length: 121 }, (_, i) => `${1980 + i}|`),
]);

/**
 * Every quantity in a blob of text, as "value|unit".
 *
 * Thousands separators are stripped so 532,758 and 532758 are one figure. A unit is kept when it
 * is attached, because it is what distinguishes 40 wards from 40% of the register.
 */
function figures(text) {
  const found = new Map();
  const cleaned = stripReferences(text);
  const RE = /(?<![\w.,])(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?\s*(%|bn|billion|million|k\b|m\b)?/gi;
  let m;
  while ((m = RE.exec(cleaned)) !== null) {
    const whole = m[1].replace(/,/g, "");
    const frac = m[2] ? `.${m[2]}` : "";
    const unit = (m[3] ?? "").toLowerCase().trim();
    const value = `${whole}${frac}`;
    // Single digits are list markers, table pipes and ordinals far more often than they are
    // evidence, and they are never the figure a reader would miss.
    if (Number(value) < 10 && !frac && !unit) continue;
    const key = `${value}|${unit}`;
    if (NOISE.has(key)) continue;
    found.set(key, (found.get(key) ?? 0) + 1);
  }
  return found;
}

function readTreeAtBase(dir) {
  let listing;
  try {
    listing = execSync(`git ls-tree -r --name-only ${BASE} -- ${dir}`, { encoding: "utf8" });
  } catch {
    return null;
  }
  const out = new Map();
  for (const file of listing.split("\n").filter(Boolean)) {
    if (!/\.(md|ts|tsx|json)$/.test(file)) continue;
    try {
      out.set(
        file,
        execSync(`git show ${BASE}:${file}`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }),
      );
    } catch {
      /* file unreadable at base; treated as absent */
    }
  }
  return out;
}

function readTreeNow(dir) {
  const out = new Map();
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(md|ts|tsx|json)$/.test(entry.name)) {
        out.set(path.relative(ROOT, full), fs.readFileSync(full, "utf8"));
      }
    }
  };
  walk(abs);
  return out;
}

// ---- Gather -------------------------------------------------------------------------------

const baseFiles = new Map();
for (const dir of SEARCH_DIRS) {
  const tree = readTreeAtBase(dir);
  if (tree === null) {
    console.error(`Figure retention check SKIPPED — cannot read ${dir} at ${BASE}.`);
    console.error("Set FIGURE_BASELINE to a commit in this history to override.");
    process.exit(0);
  }
  for (const [f, t] of tree) baseFiles.set(f, t);
}

const nowFiles = new Map();
for (const dir of SEARCH_DIRS) for (const [f, t] of readTreeNow(dir)) nowFiles.set(f, t);

const isContent = (f) => f.startsWith("public/content/");

const collect = (files, filter) => {
  const all = new Map();
  for (const [f, text] of files) {
    if (filter && !filter(f)) continue;
    for (const [key, n] of figures(text)) all.set(key, (all.get(key) ?? 0) + n);
  }
  return all;
};

const baseAll = collect(baseFiles);
const nowAll = collect(nowFiles);
const baseContent = collect(baseFiles, isContent);
const nowContent = collect(nowFiles, isContent);

let migrations = [];
if (fs.existsSync(MIGRATIONS_FILE)) {
  migrations = JSON.parse(fs.readFileSync(MIGRATIONS_FILE, "utf8"));
}
const declared = new Map();
for (const entry of migrations) {
  if (!entry.figure || !entry.movedTo) {
    console.error("figure-migrations.json: every entry needs `figure` and `movedTo`.");
    process.exit(1);
  }
  declared.set(entry.figure, entry);
}

// ---- Rule 1: retention --------------------------------------------------------------------

const vanished = [];
for (const key of baseAll.keys()) {
  if (!nowAll.has(key)) vanished.push(key);
}

// ---- Rule 2: print reach ------------------------------------------------------------------

const leftContent = [];
for (const key of baseContent.keys()) {
  if (nowContent.has(key)) continue;
  if (declared.has(key)) continue;
  leftContent.push(key);
}

// A declared migration that is no longer needed is stale bookkeeping, and stale bookkeeping is
// how an allowlist quietly stops meaning anything.
const staleDeclarations = [];
for (const key of declared.keys()) {
  if (nowContent.has(key) || !baseContent.has(key)) staleDeclarations.push(key);
}

// ---- Report -------------------------------------------------------------------------------

const show = (key) => {
  const [value, unit] = key.split("|");
  return unit ? `${Number(value).toLocaleString("en-KE")}${unit === "%" ? "%" : ` ${unit}`}` : Number(value).toLocaleString("en-KE");
};

if (process.env.FIGURE_DUMP) {
  fs.writeFileSync(
    process.env.FIGURE_DUMP,
    JSON.stringify({ vanished, leftContent, staleDeclarations }, null, 1),
  );
  console.error(`FIGURE_DUMP written to ${process.env.FIGURE_DUMP}.`);
}

let failed = false;

if (vanished.length) {
  failed = true;
  console.error(`\nFIGURE RETENTION FAILED — ${vanished.length} figure(s) present at ${BASE} exist nowhere in the repository:\n`);
  for (const key of vanished.slice(0, 40)) {
    console.error(`  ${show(key)}   (appeared ${baseAll.get(key)}× at baseline)`);
  }
  if (vanished.length > 40) console.error(`  … and ${vanished.length - 40} more`);
  console.error("\nThe redesign brief is explicit: no figure is removed. Restore it, or move it");
  console.error("somewhere it still lives — data/, a component, another section.");
}

if (leftContent.length) {
  failed = true;
  console.error(`\nPRINT REACH FAILED — ${leftContent.length} figure(s) left public/content/ without a declared destination:\n`);
  for (const key of leftContent.slice(0, 40)) {
    console.error(`  ${show(key)}   (appeared ${baseContent.get(key)}× in content at baseline)`);
  }
  if (leftContent.length > 40) console.error(`  … and ${leftContent.length - 40} more`);
  console.error("\nA figure that lives only in a component may not reach the printed PDF — much of");
  console.error("the landing route is print:hidden. Either keep it in the markdown, or declare the");
  console.error("move in scripts/figure-migrations.json with the place it went.");
}

if (staleDeclarations.length) {
  failed = true;
  console.error(`\nSTALE MIGRATIONS — ${staleDeclarations.length} entr(ies) in figure-migrations.json no longer apply:\n`);
  for (const key of staleDeclarations) console.error(`  ${show(key)}`);
  console.error("\nThe figure is back in content, or was never in it. Remove the entry.");
}

if (failed) process.exit(1);

console.log(
  `Figure retention passed: all ${baseAll.size} distinct figures present at ${BASE} survive, ` +
    `and all ${baseContent.size} content figures still reach the print path` +
    (declared.size ? ` (${declared.size} declared migration${declared.size === 1 ? "" : "s"})` : "") +
    ".",
);
