/**
 * The content, read as sections, before and after (brief 2026-10 declutter, section 10).
 *
 * Every check in scripts/declutter reads content/*.md through this module, so they agree on what a
 * section is, what a word is, and what counts as running prose:
 *
 *   SECTION   a numbered h2 or h3 and its body up to the next h2 or h3, keyed "<file>:<number>";
 *             the text before a file's first heading is "<file>:(intro)".
 *   WORD      a whitespace-separated run. A {{token}} is one word.
 *   PROSE     the body outside every fence, plus the text of every ```visual fence (moved prose,
 *             brief 10 check 4) except the framing a visual adds (title, note, source). A ```lead
 *             is excluded: it restates text that is still there. Figure and text-version fences
 *             count as their own words, unchanged on both sides.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const BASE = "4bfc078";
const CONTENT = path.join(ROOT, "content");

const HEADING = /^(#{2,3})\s+((?:\d+(?:\.\d+)*|[A-G](?:\.\d+)+))\s+(.*)$/;
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

export const words = (s) => (s.match(/\S+/g) ?? []).length;

/** The visual's own framing: authored, so not counted as moved prose. */
const FRAMING = new Set(["title", "note", "source"]);
const META = new Set(["kind", "id", "preset", "tier"]);

/** Every moved string in a visual spec (its text, minus its framing). */
export function visualStrings(spec) {
  const out = [];
  const walk = (v, key = "", depth = 0) => {
    if (typeof v === "string") {
      if (!META.has(key) && !(depth === 1 && FRAMING.has(key))) out.push(v);
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, key, depth + 1));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k, depth + 1);
  };
  walk(spec, "", 0);
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

/** Words counted for conservation: prose, moved visual text, and figure/text-version fences. */
export function conservedWords(lines) {
  const p = partsOf(lines);
  return (
    words(p.prose) +
    p.visuals.reduce((n, v) => n + visualStrings(v).reduce((a, s) => a + words(s), 0), 0) +
    p.fences.reduce((n, f) => n + words(f.body), 0)
  );
}

/** All the text of a section a reader can still reach: prose, visual text and fences, not leads. */
export function reachableText(lines) {
  const p = partsOf(lines);
  return [p.prose, ...p.visuals.flatMap((v) => visualStrings(v)), ...p.fences.map((f) => f.body)].join("\n");
}

export function loadCuts() {
  const file = path.join(ROOT, "docs", "declutter", "cuts.json");
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
}
