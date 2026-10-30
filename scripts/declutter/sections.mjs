/**
 * The content, read as sections, before and after (brief 2026-10 declutter, section 10).
 *
 * Every check in scripts/declutter reads content/*.md through this module, so they agree on what a
 * section is, what a word is, and what counts as running prose:
 *
 *   SECTION   a numbered h2 or h3 and its body up to the next h2 or h3, keyed "<file>:<number>";
 *             the text before a file's first heading is "<file>:(intro)".
 *   WORD      a whitespace-separated run with a letter or digit in it. A {{token}} is one word;
 *             a bullet, a list ordinal ("1."), a table pipe or a dash is not.
 *   PROSE     the body outside every fence, plus every string in every ```visual fence that was
 *             moved there: a string found word for word in the section's text at 4bfc078. A string
 *             a visual adds (a tile's label, a card's badge) is counted apart, as ADDED, so a gain
 *             can never mask a loss. A ```lead is excluded: it restates text that is still there. Figure and text-version fences
 *             count as their own words, unchanged on both sides.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
/**
 * The commit a content pass is measured from, and the ledger its cuts, moves and additions are logged
 * in. The declutter ran from 4bfc078 with docs/declutter/cuts.json; a later pass sets CONTENT_BASE
 * and CONTENT_LEDGER (package.json, "check:content") so its own changes are what the checks weigh.
 */
export const BASE = process.env.CONTENT_BASE ?? "4bfc078";
export const LEDGER = process.env.CONTENT_LEDGER ?? path.join("docs", "declutter", "cuts.json");
const CONTENT = path.join(ROOT, "content");

const HEADING = /^(#{2,3})\s+((?:\d+(?:\.\d+)*|[A-H](?:\.\d+)+))\s+(.*)$/;
const FENCE = /^\s*```/;

export function baseFiles() {
  return execFileSync("git", ["ls-tree", "--name-only", BASE, "content/"], { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.basename(f, ".md"));
}

export function readBase(name) {
  return execFileSync("git", ["show", `${BASE}:content/${name}.md`], { cwd: ROOT, encoding: "utf8" });
}

export function readNow(name) {
  return fs.readFileSync(path.join(CONTENT, `${name}.md`), "utf8");
}

export function nowFiles() {
  return fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md")).map((f) => path.basename(f, ".md")).sort();
}

/** Sections of one file, in order: { key, file, number, title, lines }. */
export function sectionsOf(name, text) {
  const out = [];
  let cur = { key: `${name}:(intro)`, file: name, number: "(intro)", title: "", lines: [] };
  let inFence = false;
  for (const line of text.split("\n")) {
    if (FENCE.test(line)) inFence = !inFence;
    const m = inFence ? null : HEADING.exec(line);
    if (m) {
      out.push(cur);
      cur = { key: `${name}:${m[2]}`, file: name, number: m[2], title: m[3], lines: [] };
      continue;
    }
    cur.lines.push(line);
  }
  out.push(cur);
  return out;
}

/** Whitespace-separated runs with a letter or digit in them: markdown's bullets, pipes and dashes are not words. */
export const words = (s) => (s.match(/\S+/g) ?? []).filter((t) => /[A-Za-z0-9]/.test(t) && !/^\d+\.$/.test(t)).length;

const META = new Set(["kind", "id", "preset", "tier"]);

/** Every string in a visual spec a reader can reach (layout keys excluded). */
export function visualStrings(spec) {
  const out = [];
  const walk = (v, key = "") => {
    if (typeof v === "string") {
      if (!META.has(key)) out.push(v);
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k);
  };
  walk(spec, "");
  return out;
}

/**
 * A section body split into its parts: prose lines, lead text, visual specs, other fences.
 * Visual YAML is parsed here; a fence that does not parse throws, as the content build would.
 */
export function partsOf(lines) {
  const prose = [];
  const leads = [];
  const visuals = [];
  const fences = [];
  let fence = null;
  let buf = [];
  for (const line of lines) {
    if (FENCE.test(line)) {
      if (fence === null) {
        fence = (/^\s*```([A-Za-z0-9_-]*)/.exec(line)?.[1] ?? "").toLowerCase();
        buf = [];
        continue;
      }
      const body = buf.join("\n");
      if (fence === "lead") leads.push(body);
      else if (fence === "visual") visuals.push(yaml.load(body));
      else fences.push({ kind: fence, body });
      fence = null;
      continue;
    }
    if (fence !== null) buf.push(line);
    else if (!/^\s*<!--\s*keep\s*-->\s*$/.test(line)) prose.push(line);
  }
  return { prose: prose.join("\n"), leads, visuals, fences };
}

/** A word as compared for "was it in the original?": lower case, punctuation and markup stripped. */
const norm = (t) => t.toLowerCase().replace(/^[^a-z0-9{]+|[^a-z0-9}%]+$/g, "");
const tokens = (s) => (s.match(/\S+/g) ?? []).filter((t) => /[A-Za-z0-9]/.test(t) && !/^\d+\.$/.test(t)).map(norm);

/**
 * Words counted for conservation: prose, moved visual text, and figure/text-version fences.
 *
 * With `base` (the section's text at 4bfc078), each word of a visual is matched against the
 * section's original words that the prose no longer holds: a match is a moved word; a word with no
 * match is counted as added and returned separately, so a gain cannot offset a loss.
 */
export function conservedWords(lines, base = null) {
  const p = partsOf(lines);
  const kept = words(p.prose) + p.fences.reduce((n, f) => n + words(f.body), 0);
  const visualTokens = p.visuals.flatMap((v) => visualStrings(v).flatMap(tokens));
  if (base === null) return kept + visualTokens.length;
  const bag = new Map();
  const bp = partsOf(base.split("\n"));
  for (const t of [bp.prose, ...bp.visuals.flatMap((v) => visualStrings(v)), ...bp.fences.map((f) => f.body)].flatMap(tokens)) bag.set(t, (bag.get(t) ?? 0) + 1);
  for (const t of [p.prose, ...p.fences.map((f) => f.body)].flatMap(tokens)) if (bag.get(t)) bag.set(t, bag.get(t) - 1);
  let moved = 0;
  let added = 0;
  for (const t of visualTokens) {
    if (bag.get(t)) {
      bag.set(t, bag.get(t) - 1);
      moved += 1;
    } else added += 1;
  }
  return { total: kept + moved, added };
}

/** All the text of a section a reader can still reach: prose, visual text and fences, not leads. */
export function reachableText(lines) {
  const p = partsOf(lines);
  return [p.prose, ...p.visuals.flatMap((v) => visualStrings(v)), ...p.fences.map((f) => f.body)].join("\n");
}

export function loadCuts() {
  const file = path.join(ROOT, LEDGER);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
}
