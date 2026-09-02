#!/usr/bin/env node
/**
 * Build guard: no campaign figure may appear in the UI unless it appears in the source.
 *
 * This exists because the UI layer had drifted badly from the proposal it renders — ward voter
 * counts inflated up to 81% over the IEBC register that ships in this repo, budget tier
 * envelopes filled in where the proposal deliberately left placeholders, progress rings at 85%
 * for work that has not started. The proposal's own Appendix A is headed "No figure has been
 * invented to fill any of these", and Appendix §14 forbids fabricating performance results, the
 * spending ceiling and the ward register. This script makes that promise mechanical.
 *
 * How it works: scan every .tsx/.ts under components/ for numeric literals that look like
 * campaign figures (percentages, thousands, KSh amounts, vote counts). Check each against a
 * corpus built from public/content/*.md plus everything in data/. Anything not found is
 * reported and fails the build.
 *
 * Run as a `prebuild` step alongside verify-ward-register.mjs.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "public", "content");
const DATA_DIR = path.join(ROOT, "data");
const SCAN_DIRS = [path.join(ROOT, "components")];

/** Numbers that are layout, not data: spacing, opacity, sizes, durations, colour channels. */
const STRUCTURAL = new Set([
  "100", "50", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "14", "15", "16",
  "18", "20", "24", "25", "28", "30", "32", "35", "36", "40", "45", "48", "60", "64", "70",
  "75", "80", "90", "95", "96", "120", "128", "150", "180", "200", "240", "256", "270", "300",
  "320", "360", "400", "420", "450", "480", "500", "512", "520", "540", "560", "600", "620",
  "640", "700", "720", "768", "800", "900", "1000", "1024", "1200", "1440",
]);

function readCorpus() {
  const parts = [];
  for (const f of fs.readdirSync(CONTENT_DIR)) {
    if (f.endsWith(".md")) parts.push(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8"));
  }
  const walkData = (dir) => {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) walkData(p);
      else if (/\.(ts|json)$/.test(f)) parts.push(fs.readFileSync(p, "utf8"));
    }
  };
  walkData(DATA_DIR);
  // Strip separators so "532,758" in prose matches "532758" in code, and vice versa.
  return parts.join("\n").replace(/[\s,]/g, "");
}

function collectFiles(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) collectFiles(p, out);
    else if (/\.tsx?$/.test(f)) out.push(p);
  }
  return out;
}

/**
 * Pull candidate campaign figures out of a line of source. Deliberately narrow: only string
 * literals and JSX text, never bare numeric expressions, so Tailwind classes and transform
 * values don't generate noise.
 */
/**
 * SVG path data. A `d` attribute is geometry — every coordinate in a drawn icon would otherwise
 * be reported as an invented campaign figure, which is 150 false positives from one icon set and
 * would train everyone to ignore this script.
 */
function isSvgPath(text) {
  return /^[MmLlHhVvCcSsQqTtAaZz][\dMmLlHhVvCcSsQqTtAaZz\s,.\-eE]*$/.test(text.trim());
}

/**
 * A bare number in an attribute or style position — `r="1.15"`, `left: "58.5%"`, `viewBox="0 0
 * 24 24"`. Exempted only when the preceding characters name a geometry attribute or CSS
 * property, so a displayed string that merely looks numeric is still checked.
 */
const GEOMETRY_KEY =
  /\b(d|cx|cy|r|rx|ry|x|y|x1|y1|x2|y2|width|height|viewBox|points|offset|strokeWidth|stroke-width|strokeDasharray|left|right|top|bottom|inset|fontSize|letterSpacing|lineHeight|aspectRatio|opacity|transform|transformOrigin|gap|padding|margin|borderRadius|size)\s*[:=]\s*\{?\s*$/;

function candidatesIn(source) {
  const found = [];
  // Quoted strings and JSX text nodes. Indexes are kept so an attribute's context can be read.
  const zones = [
    ...source.matchAll(/"([^"\n]*)"/g),
    ...source.matchAll(/'([^'\n]*)'/g),
    // Text immediately before a tag, whether it follows a tag or a {expression}. The original
    // form only matched after ">", so a figure typed after an interpolation — "{x} · 74.9%
    // approval <span>" — was invisible to this scan. Requiring the closing "<" keeps ordinary
    // code ("}, 2600);") out.
    ...source.matchAll(/[>}]([^<>{}\n]*)</g),
  ];

  // Bare numeric literals assigned to a data-shaped property (budget: 4800000, voters: 22105).
  // An earlier version scanned only strings, which let object literals carrying invented budget
  // allocations and voter counts through untouched.
  const DATA_KEYS = /\b(budget|voters|value|amount|total|count|votes|share|percentage|percent|reach|target|pool|population|spend|cost|price|size)\s*:\s*(\d[\d_]*\.?\d*)/g;
  for (const m of source.matchAll(DATA_KEYS)) {
    const bare = m[2].replace(/_/g, "");
    if (bare.length < 4 && !bare.includes(".")) continue;
    if (STRUCTURAL.has(bare)) continue;
    found.push({ bare, display: `${m[1]}: ${m[2]}`, context: m[0].slice(0, 90) });
  }
  for (const z of zones) {
    const text = z[1];
    if (!text || !/\d/.test(text)) continue;
    if (isSvgPath(text)) continue;
    // Bare numeric strings are geometry only where a geometry key introduces them.
    if (/^[-\d][\d\s.,%-]*$/.test(text.trim()) && GEOMETRY_KEY.test(source.slice(0, z.index))) continue;
    // Skip anything that is obviously CSS, a path, a URL or a class list.
    if (/^(https?:|\/|#|[a-z-]+:)/.test(text.trim())) continue;
    // Hex colours, Tailwind arbitrary values and CSS var fallbacks are structure, not data.
    if (/#[0-9a-fA-F]{3,8}\b/.test(text)) continue;
    if (/\[[^\]]*\]/.test(text) && /^[a-z0-9\s:_\-[\]/.%#()]+$/i.test(text)) continue;
    if (/(px|rem|em|vh|vw|fr|deg|ms|\bcubic-bezier|rgba?\(|translate|scale|rotate|\bhsl)/i.test(text)) continue;
    if (/^[a-z0-9\s:_\-[\]/.]+$/.test(text) && /\b(flex|grid|text|bg|border|rounded|gap|p|m|w|h)-/.test(text)) continue;

    for (const m of text.matchAll(/(\d[\d,]*\.?\d*)\s*(%|k\b|K\b|m\b|M\b|bn\b|million|billion)?/g)) {
      const raw = m[1];
      const unit = m[2] ?? "";
      const bare = raw.replace(/,/g, "");
      if (!bare || bare.length < 2) continue;
      if (STRUCTURAL.has(bare) && !unit) continue;
      // A figure is interesting if it carries a unit, or is 4+ digits, or has a decimal.
      const interesting = unit !== "" || bare.replace(".", "").length >= 4 || bare.includes(".");
      if (!interesting) continue;
      found.push({ bare, display: (raw + unit).trim(), context: text.trim().slice(0, 90) });
    }
  }
  return found;
}

const corpus = readCorpus();
const violations = [];

for (const file of SCAN_DIRS.flatMap((d) => collectFiles(d))) {
  const src = fs.readFileSync(file, "utf8");
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    // Honour an explicit opt-out for genuinely non-campaign numbers.
    if (/verify-figures-ignore/.test(line)) return;
    for (const c of candidatesIn(line)) {
      if (corpus.includes(c.bare)) continue;
      // A decimal like 15.3 may legitimately appear as "15.3-point"; the bare check covers it.
      // Try without trailing zeros too (37.40 -> 37.4).
      const trimmed = c.bare.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
      if (corpus.includes(trimmed)) continue;
      violations.push({
        file: path.relative(ROOT, file),
        line: i + 1,
        figure: c.display,
        context: c.context,
      });
    }
  });
}

/**
 * Second check: the phone showcase config.
 *
 * The main scan covers components/ and treats data/ as corpus, which leaves a hole — a config in
 * lib/ is neither scanned nor sourced, so an invented follower count sitting there would render
 * on screen with nothing to catch it. The phone screens structurally need numbers, so the rule
 * is not "no numbers" but "every number is either in the proposal or in the illustrative
 * register", and the register is the thing a reviewer reads.
 */
const PHONE_CONFIG = path.join(ROOT, "lib", "phone-showcase.ts");

function checkIllustrativeRegister() {
  if (!fs.existsSync(PHONE_CONFIG)) return [];
  const src = fs.readFileSync(PHONE_CONFIG, "utf8");

  const open = src.indexOf("export const ILLUSTRATIVE_COUNTS");
  if (open === -1) {
    return [{ line: 0, figure: "ILLUSTRATIVE_COUNTS", context: "register missing from lib/phone-showcase.ts" }];
  }
  const close = src.indexOf("} as const;", open);
  const registerStart = src.slice(0, open).split("\n").length;
  const registerEnd = src.slice(0, close).split("\n").length;

  const bad = [];
  src.split("\n").forEach((line, i) => {
    const n = i + 1;
    if (n >= registerStart && n <= registerEnd) return;      // inside the register: that is the point
    if (/verify-figures-ignore/.test(line)) return;
    if (/^\s*(\*|\/\/|\/\*)/.test(line)) return;                 // comments and doc blocks
    for (const c of candidatesIn(line)) {
      if (corpus.includes(c.bare)) continue;
      const trimmed = c.bare.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
      if (corpus.includes(trimmed)) continue;
      bad.push({ line: n, figure: c.display, context: c.context });
    }
  });
  return bad;
}

const unregistered = checkIllustrativeRegister();
if (unregistered.length > 0) {
  console.error(
    `\nFigure verification FAILED — ${unregistered.length} number(s) in lib/phone-showcase.ts neither trace to the proposal nor sit in ILLUSTRATIVE_COUNTS.\n`
  );
  console.error(
    "The phone screens may show illustrative interface numbers, but every one of them must be\n" +
      "declared in the ILLUSTRATIVE_COUNTS register so a reviewer can see the whole set at once.\n" +
      "Move the number into that register, or source it from the proposal.\n"
  );
  for (const v of unregistered) console.error(`    line ${v.line}: ${v.figure}  —  "${v.context}"`);
  console.error("");
  process.exit(1);
}

if (violations.length > 0) {
  console.error(
    `\nFigure verification FAILED — ${violations.length} numeric literal(s) in the UI do not appear in public/content/*.md or data/.\n`
  );
  console.error(
    "Every campaign figure the site displays must trace to the proposal or to a verified data module.\n" +
      "Fix by sourcing the figure, deriving it from data/, or removing it. If a number is genuinely\n" +
      "structural (a viewBox, a duration), append a `verify-figures-ignore` comment to that line.\n"
  );
  const byFile = violations.reduce((acc, v) => {
    (acc[v.file] ??= []).push(v);
    return acc;
  }, {});
  for (const [file, vs] of Object.entries(byFile)) {
    console.error(`  ${file}`);
    for (const v of vs) console.error(`    line ${v.line}: ${v.figure}  —  "${v.context}"`);
  }
  console.error("");
  process.exit(1);
}

console.log(
  "Figure verification passed: every numeric literal in the UI traces to the source,\n" +
    "and every illustrative interface number is declared in the phone-showcase register."
);
