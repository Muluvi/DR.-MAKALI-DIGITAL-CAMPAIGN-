#!/usr/bin/env node
/**
 * Registry values retyped as literals (consolidation pass, November 2026).
 *
 * The registry, lib/data/figures.ts, is meant to be the one place a number lives. This scan lists
 * every numeric literal in site code and prose (content/, data/, lib/, components/, app/) whose
 * value equals a registry figure, so a copy that can drift from its source is visible.
 *
 * What counts as a literal:
 *   - in .ts/.tsx/.mjs/.js: a number in code (447_007, 447007) or inside a string ("447,007")
 *   - in .md: a number in prose (a {{token}} is not a literal; it is the registry read)
 * What is skipped, and why:
 *   - comments (// and block comments in code, HTML comments in Markdown): not shown to readers
 *   - tests (*.test.ts): they pin values on purpose
 *   - the registry's own source files: lib/data/figures.ts and data/ward-register.json
 *   - generated output (public/, lib/register/generated/, data/*.generated.json, data/analysis/,
 *     and the source table scripts/build-source-table.ts writes into content/annex-evidence.md)
 *   - years (1900–2100) and numbers below 1,000: a year, a CSS weight, a percentage or a small
 *     count matches too many unrelated things to be evidence of a copy
 *
 * Matches are graded:
 *   exact    the literal equals a registry value
 *   rounded  the literal equals a registry value rounded to the nearest thousand (only for
 *            values of 10,000 or more), the usual way a figure is retyped as "~72,000"
 *
 * scripts/consolidation/literals-allow.json lists literals that may stay (illustrative mock data
 * marked with IllustrativeTag, or a number that only coincides with a registry value); each entry
 * gives the file, the literal and the reason.
 *
 *     node --experimental-strip-types scripts/consolidation/scan-literals.mjs              # print a summary
 *     node --experimental-strip-types scripts/consolidation/scan-literals.mjs --json FILE  # write the full list
 *     node --experimental-strip-types scripts/consolidation/scan-literals.mjs --check      # fail on any exact match not allowed
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FIGURES } from "../../lib/data/figures.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIRS = ["content", "data", "lib", "components", "app"];
const EXT = new Set([".ts", ".tsx", ".mjs", ".js", ".md"]);
const SKIP_FILES = new Set(["lib/data/figures.ts", "data/ward-register.json"]);
const SKIP_PATH = [/\.test\.ts$/, /^lib\/register\/generated\//, /\.generated\./, /^data\/analysis\//, /^lib\/anchors\//];

/* ------------------------------------------------------------ registry values */
const exact = new Map();
const rounded = new Map();
const push = (m, k, id) => m.set(k, [...(m.get(k) ?? []), id]);
for (const [id, f] of Object.entries(FIGURES)) {
  if (f.value === null || !Number.isFinite(f.value)) continue;
  const val = f.value;
  const decimals = f.decimals ?? (f.unit === "percent" ? 1 : 0);
  const shown = Number(val.toFixed(decimals));
  if (Math.abs(shown) < 1000) continue;
  if (Number.isInteger(shown) && shown >= 1900 && shown <= 2100) continue;
  push(exact, String(shown), id);
  if (Math.abs(val) >= 10_000) {
    const r = Math.round(val / 1000) * 1000;
    if (r !== shown) push(rounded, String(r), id);
  }
}

/* ------------------------------------------------------------ comment stripping */
/** Code with comments blanked (newlines kept, so line numbers hold). Strings are left in place. */
function stripCode(src) {
  let out = "";
  let i = 0;
  let quote = null;
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (quote) {
      out += c;
      if (c === "\\") { out += n ?? ""; i += 2; continue; }
      if (c === quote) quote = null;
      i += 1;
      continue;
    }
    if (c === "/" && n === "/") {
      while (i < src.length && src[i] !== "\n") i += 1;
      continue;
    }
    if (c === "/" && n === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) { if (src[i] === "\n") out += "\n"; i += 1; }
      i += 2;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") quote = c;
    out += c;
    i += 1;
  }
  return out;
}
/** Markdown with comments, {{tokens}} and the generated source table blanked (newlines kept). */
const blank = (m) => m.replace(/[^\n]/g, " ");
const stripMd = (src) => src.replace(/<!-- source-table:start[\s\S]*?<!-- source-table:end -->/g, blank).replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " ")).replace(/\{\{[^}]*\}\}/g, (m) => " ".repeat(m.length));

/* ------------------------------------------------------------ literals */
const LITERAL = /(?<![\w.$#-])(\d{1,3}(?:[,_]\d{3})+|\d+)(\.\d+)?(?![\w%]*[A-Za-z_]|\d)/g;
const toNumber = (int, frac) => Number(int.replace(/[,_]/g, "") + (frac ?? ""));

function walk(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((e) => {
    const rel = path.posix.join(dir, e.name);
    if (e.isDirectory()) return e.name === "node_modules" ? [] : walk(rel);
    return EXT.has(path.extname(e.name)) ? [rel] : [];
  });
}

const allowFile = path.join(ROOT, "scripts", "consolidation", "literals-allow.json");
const ALLOW = fs.existsSync(allowFile) ? JSON.parse(fs.readFileSync(allowFile, "utf8")).allow : [];
const allowed = (file, literal) => ALLOW.some((a) => a.file === file && a.literal === literal);

const hits = [];
const files = DIRS.flatMap(walk).filter((f) => !SKIP_FILES.has(f) && !SKIP_PATH.some((r) => r.test(f))).sort();
for (const file of files) {
  const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
  const text = file.endsWith(".md") ? stripMd(raw) : stripCode(raw);
  text.split("\n").forEach((line, idx) => {
    for (const m of line.matchAll(LITERAL)) {
      const value = toNumber(m[1], m[2]);
      if (!Number.isFinite(value) || value < 1000) continue;
      if (Number.isInteger(value) && value >= 1900 && value <= 2100) continue;
      const key = String(value);
      const grade = exact.has(key) ? "exact" : rounded.has(key) ? "rounded" : null;
      if (!grade) continue;
      const literal = m[0];
      hits.push({ file, line: idx + 1, literal, value, grade, ids: (grade === "exact" ? exact : rounded).get(key), allowed: allowed(file, literal) });
    }
  });
}

/* ------------------------------------------------------------ report */
const byFile = {};
for (const h of hits) {
  byFile[h.file] ??= { exact: 0, rounded: 0, allowed: 0 };
  if (h.allowed) byFile[h.file].allowed += 1;
  else byFile[h.file][h.grade] += 1;
}
const open = hits.filter((h) => !h.allowed);
const summary = {
  filesScanned: files.length,
  registryValues: exact.size,
  exact: open.filter((h) => h.grade === "exact").length,
  rounded: open.filter((h) => h.grade === "rounded").length,
  allowed: hits.filter((h) => h.allowed).length,
  filesWithHits: Object.keys(byFile).length,
  distinctValues: new Set(open.map((h) => h.value)).size,
};

const jsonAt = process.argv.indexOf("--json");
if (jsonAt > -1) {
  const out = path.resolve(ROOT, process.argv[jsonAt + 1]);
  const ranked = Object.fromEntries(Object.entries(byFile).sort((a, b) => b[1].exact + b[1].rounded - (a[1].exact + a[1].rounded)));
  fs.writeFileSync(out, JSON.stringify({ summary, byFile: ranked, hits }, null, 1) + "\n");
}

console.log(
  `scan-literals: ${summary.filesScanned} files, ${summary.registryValues} registry values; ` +
    `${summary.exact} exact and ${summary.rounded} rounded copies in ${summary.filesWithHits} files (${summary.allowed} allowed)`,
);
if (process.argv.includes("--check")) {
  const bad = open.filter((h) => h.grade === "exact");
  if (bad.length) {
    console.error("scan-literals: registry values retyped as literals (read them with {{token}} or fig()/fmt() instead):");
    for (const h of bad.slice(0, 60)) console.error(`  ${h.file}:${h.line}  ${h.literal}  = ${h.ids.join(", ")}`);
    if (bad.length > 60) console.error(`  … and ${bad.length - 60} more`);
    process.exit(1);
  }
}
