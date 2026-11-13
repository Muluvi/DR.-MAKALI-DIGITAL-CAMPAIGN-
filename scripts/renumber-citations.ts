#!/usr/bin/env node
/**
 * Rewrites every cross-reference in the proposal from the old section numbers to the new ones,
 * mechanically, from docs/restructure-2026-10/mapping.json (the October 2026 restructure).
 *
 * WHAT COUNTS AS A CITATION.
 *   Section 3.4 · Sections 2.8 and 4.1.1 · Sections 5.3.1–5.3.5 · §5.2.3.3 · Section 3 (a part)
 *   Annex E.11 · (E.4, E.11) · (16.4) · a bare three-level number in prose ("4.4.1 above")
 *   a table cell that opens with section numbers ("5.2.1.2", "5.2.3.3: … by Phase 3")
 * A citation may break across a line ("Section\n4.3"). Heading numbers, {{tokens}} and figure
 * fences are never touched, and nor are the lines the layout script wrote itself (pointers and
 * purpose lines), which already carry new numbers.
 *
 * WHERE A CITATION GOES. The old number's mapping row names the new heading that now holds the
 * text: a run-in goes to its parent, a merge to its target, a removal to its canonical home. A
 * citation that names a section that never existed, or one preview section 3.3 lists as already
 * wrong, is not guessed at: the number stays and "[CHECK REF]" follows it.
 *
 * WHY IT IS IDEMPOTENT. Old and new numbers overlap (old 3.1 is now 2.1, and 3.1 is now the
 * position), so rewriting the content in place twice would move a citation twice. Instead the
 * content is always derived from the baseline: the layout is regenerated into a scratch directory
 * by scripts/restructure-2026-10/build-layout.py and renumbered from there. For the TypeScript
 * files (figure captions and comments in lib/figures and lib/register/specs) each baseline line
 * that carries a citation is rewritten, and the rewrite is applied only where the baseline line
 * still stands, so a second run finds nothing left to do.
 *
 *     node --experimental-strip-types scripts/renumber-citations.ts          # rewrite, and write citations.csv
 *     node --experimental-strip-types scripts/renumber-citations.ts --check  # fail if a run would change anything
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "docs", "restructure-2026-10");
const CONTENT = path.join(ROOT, "content");
const BASE = "9681948";
const CHECK = process.argv.includes("--check");

interface Row { file: string; oldRef: string | null; disposition: string; newRef: string }
const MAPPING = JSON.parse(fs.readFileSync(path.join(DOCS, "mapping.json"), "utf8")) as Row[];

/** Old number -> new number, for every numbered heading at the baseline. */
const NUM = new Map<string, string>();
for (const r of MAPPING) {
  if (!r.oldRef) continue;
  let target = r.newRef.replace(" (run-in)", "").trim();
  if (target === "5.3.6 / 1.8") target = "5.3.6"; // 6.2 split: its own text (the ODPC box) is 5.3.6
  if (target === "Cover") target = ""; // F.2: no numbered home; any citation of it is checked
  NUM.set(r.oldRef, target);
}
/** Part-level citations ("Section 3"). Old Part 5 split across four new parts, so it is checked. */
const PART: Record<string, string> = { "1": "1", "2": "2", "3": "2", "4": "3", "6": "1" };

/**
 * Citations preview section 3.3 found wrong before the restructure (rows 1 to 8), and the brief's
 * own traps. Each names the exact context it applies to. `to` is a target the brief gives; `check`
 * leaves the number and flags it.
 */
const RULES: { ref: string; context: RegExp; to?: string; check?: true; why: string }[] = [
  { ref: "1.5", context: /the phasing in Section\s+1\.5/, to: "4.3", why: "Legacy numbering: 'the phasing in Section 1.5' is the phases (preview 3.3 row 1; brief §5)" },
  { ref: "3.3.3", context: /constituency figures in 3\.3\.3/, check: true, why: "3.3 had no subsections (preview 3.3 row 2)" },
  { ref: "4.3", context: /SMS\/USSD \(Section\s+4\.3\)/, check: true, why: "4.3 was the voter segments; SMS/USSD is elsewhere (preview 3.3 row 2)" },
  { ref: "4.3", context: /already deploying \(Section\s+4\.3\)/, check: true, why: "'Build' cites 4.3 for the USSD/SMS layer (preview 3.3 row 4)" },
  { ref: "5.2.1.4", context: /Section 5\.2\.1\.4 of the DPA/, check: true, why: "5.2.1.4 was Accessibility, not a section of the DPA (preview 3.3 row 5)" },
  { ref: "5.2.3.4", context: /personal data \(Section 5\.2\.3\.4\)|Compliant with Section 5\.2\.3\.4/, check: true, why: "5.2.3.4 was Volunteers, cited as the DPA (preview 3.3 row 6)" },
  { ref: "5.2.4", context: /Section 5\.2\.4 Digital Charter Platform/, check: true, why: "No 'Section 5.2.4 Digital Charter Platform' exists (preview 3.3 row 6)" },
  { ref: "4.4.11", context: /Sections 4\.4\.11 and 5\.7\.4 for the regulatory basis/, check: true, why: "4.4.11 is channel-by-language deployment, not a regulatory basis (preview 3.3 row 7)" },
  { ref: "5.7.4", context: /Sections 4\.4\.11 and 5\.7\.4 for the regulatory basis/, check: true, why: "5.7.4 was an empty heading (preview 3.3 row 7)" },
  { ref: "16.4", context: /deletion schedule \(16\.4\)/, check: true, why: "No section 16.4 exists (preview 3.3 row 8)" },
  { ref: "A.1.1", context: /Defamation Law Safeguards \(Section A\.1\.1\)/, check: true, why: "A.1.1 is provenance; the safeguards were 5.8.3, now 6.2.3 (preview 3.3 row 9)" },
];

export interface Change { file: string; line: number; form: string; before: string; after: string; note: string }

const REF = String.raw`(?:[A-G](?:\.\d+)+|\d+(?:\.\d+)+)`;
const SEP = String.raw`\s*(?:,|and|or|to|&|–|-)\s*`;

function target(ref: string, context: string, form: string): { to: string; note: string } {
  // A rule's context is written on one line; the prose it matches may wrap.
  const flat = context.replace(/\s+/g, " ");
  for (const r of RULES) if (r.ref === ref && r.context.test(flat)) return r.check ? { to: `${ref} [CHECK REF]`, note: r.why } : { to: r.to!, note: r.why };
  if (!ref.includes(".")) {
    const p = PART[ref];
    return p ? { to: p, note: `part ${ref} -> part ${p}` } : { to: `${ref} [CHECK REF]`, note: `old Part ${ref} split across new Parts 1, 4, 5 and 6` };
  }
  const n = NUM.get(ref);
  if (n === undefined) return { to: `${ref} [CHECK REF]`, note: `${form}: no section ${ref} existed at the baseline` };
  if (n === "") return { to: `${ref} [CHECK REF]`, note: `${ref} has no numbered home after the restructure` };
  return { to: n, note: "" };
}

/** Rewrite the refs inside one matched citation, keeping every other character. */
function rewriteList(list: string, context: string, form: string, notes: string[]): string {
  return list.replace(new RegExp(String.raw`(?<![\w.])(${REF}|\d+)(?![\w.])`, "g"), (ref) => {
    const t = target(ref, context, form);
    if (t.note) notes.push(`${ref}: ${t.note}`);
    return t.to;
  });
}

/**
 * Rewrite every citation in a text. `protect` masks spans that must not change (heading numbers,
 * tokens, figure fences, authored lines). Returns the new text and one Change per citation edited.
 */
export function renumber(text: string, file: string, protect: RegExp[]): { text: string; changes: Change[] } {
  const masks: string[] = [];
  let work = text;
  for (const re of protect) work = work.replace(re, (m) => `\u0000${masks.push(m) - 1}\u0000`);
  const changes: Change[] = [];
  const restore = (s: string): string => s.replace(/\u0000(\d+)\u0000/g, (_m, i) => restore(masks[Number(i)]));
  const lineOf = (idx: number) => restore(work.slice(0, idx)).split("\n").length;
  // Every citation a pass has handled is masked as it is written, so a later pass can never read a
  // new number as an old one (the bare pass would otherwise re-map the "3.2.1" in "Sections 2.8
  // and 3.2.1" after the first pass had already renumbered it).
  const edit = (form: string) => (m: string, ...args: unknown[]) => {
    const idx = args[args.length - 2] as number;
    const context = restore(work.slice(Math.max(0, idx - 80), idx + m.length + 80));
    const notes: string[] = [];
    const out = m.replace(/^(\(?)(Sections?\s*|§\s*|Annex\s+)?([\s\S]*)$/, (_a, open: string, kw: string | undefined, rest: string) => `${open}${kw ?? ""}${rewriteList(rest, context, form, notes)}`);
    if (out !== m) changes.push({ file, line: lineOf(idx), form, before: m.replace(/\s+/g, " "), after: out.replace(/\s+/g, " "), note: notes.join("; ") });
    return `\u0000${masks.push(out) - 1}\u0000`;
  };
  // Section / § citations, with lists and ranges, across a line break.
  work = work.replace(new RegExp(String.raw`(?:Sections?|§)\s*\**(?:${REF}|\d+(?![\d.]))\**(?:${SEP}\**${REF}\**)*`, "g"), edit("section"));
  // Annex X.n (only E.11 changes; the rest are carried as they are).
  work = work.replace(new RegExp(String.raw`Annex\s+[A-G](?:\.\d+)+(?:${SEP}[A-G](?:\.\d+)+)*`, "g"), edit("annex"));
  // A parenthesis holding nothing but section or annex numbers: (E.4, E.11), (E.7–E.10), (16.4).
  work = work.replace(new RegExp(String.raw`\((?:${REF})(?:${SEP}${REF})*\)`, "g"), edit("parenthesis"));
  // A table cell that opens with section numbers: "| 5.2.1.2, 5.7.1 |", "| 5.2.3.3: … |".
  work = work.replace(new RegExp(String.raw`(?<=\|\s*)\**\d+(?:\.\d+){1,3}\**(?:\s*,\s*\d+(?:\.\d+){1,3})*(?=\**\s*(?:\||:|\s[A-Z]))`, "g"), (m, ...args) => {
    // Only when every number is a section the baseline had: a cell like "| 1.0 |" is data.
    const refs = m.replace(/\*/g, "").split(/\s*,\s*/);
    return refs.every((r) => NUM.has(r)) ? edit("table cell")(m, ...args) : m;
  });
  // A bare three-level number in prose ("4.4.1 above"): nothing else in this document has that shape.
  work = work.replace(/(?<![\w.§\/-]|Sections?\s|\d\s)\d+\.\d+\.\d+(?:\.\d+)?(?![\w%\/]|\.\d)/g, edit("bare"));
  return { text: restore(work), changes };
}

/* ------------------------------------------------------------------ content */

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "renumber-"));
execFileSync("python3", ["-I", path.join(ROOT, "scripts", "restructure-2026-10", "build-layout.py"), `--out=${tmp}`], { stdio: "pipe" });
const authored = JSON.parse(fs.readFileSync(path.join(tmp, "authored-lines.json"), "utf8")) as Record<string, string[]>;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const all: Change[] = [];
const stale: string[] = [];
for (const name of fs.readdirSync(tmp).filter((f) => f.endsWith(".md")).sort()) {
  const route = name.replace(/\.md$/, "");
  const source = fs.readFileSync(path.join(tmp, name), "utf8");
  const protect = [
    /```figure[\s\S]*?```/g,
    /\{\{[^}]*\}\}/g,
    /^#{2,6}\s+(?:\d+(?:\.\d+)+|[A-G](?:\.\d+)+)(?=\s)/gm,
    /\[CONFLICT C\d+: see open items\]/g,
    ...(authored[route] ?? []).filter(Boolean).map((l) => new RegExp(`^${esc(l)}$`, "gm")),
  ];
  const { text, changes } = renumber(source, `content/${name}`, protect);
  all.push(...changes);
  const target = path.join(CONTENT, name);
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (current !== text) {
    if (CHECK) stale.push(`content/${name}`);
    else fs.writeFileSync(target, text);
  }
}
fs.rmSync(tmp, { recursive: true, force: true });

/* ---------------------------------------------------------- TypeScript files */

/**
 * The code that carries reader-facing citations: figure captions and notes (lib/figures,
 * lib/register/specs, components/figures/registry.tsx and the other components), the data modules'
 * method and source strings, and lib's own copy. lib/anchors (ids, not citations) and generated
 * files are left alone.
 */
const walk = (dir: string): string[] =>
  fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(dir, e.name)] : []
  );
const tsFiles = [...walk("lib"), ...walk("components"), ...walk("data"), ...walk("app")]
  .filter((f) => !f.startsWith(path.join("lib", "anchors")) && !f.includes("generated"))
  .sort();
const unapplied: string[] = [];
/** The brief's own scope: comments and captions alike. Elsewhere only the copy a reader sees. */
const allLines = (rel: string) => rel.startsWith(path.join("lib", "figures")) || rel.startsWith(path.join("lib", "register", "specs"));
const isComment = (line: string) => /^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line);
for (const rel of tsFiles) {
  let baseline: string;
  try {
    baseline = execFileSync("git", ["show", `${BASE}:${rel}`], { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString();
  } catch {
    continue; // a file added after the baseline has no old citations
  }
  const lines = baseline.split("\n");
  const original = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const current = original.split("\n");
  lines.forEach((line, i) => {
    if (!/Sections?\s*\d|§\s*\d|Annex\s+[A-G]\.\d/.test(line)) return;
    if (!allLines(rel) && isComment(line)) return;
    // Section/§/Annex forms only: a parenthesised or bare number in code is not a citation.
    const { text: after, changes } = renumberCode(line, `${rel}`, i + 1);
    if (after === line) return;
    all.push(...changes);
    // Whole lines only: a rewritten line can contain its baseline line ("§13" in "§13 [CHECK REF]").
    let hit = false;
    current.forEach((l, k) => {
      if (l === line) {
        current[k] = after;
        hit = true;
      } else if (l === after) hit = true;
    });
    if (!hit) unapplied.push(`${rel}:${i + 1}: the baseline line was edited since; renumber by hand if it still cites old numbers: ${line.trim().slice(0, 100)}`);
  });
  if (current.join("\n") !== original) {
    if (CHECK) stale.push(rel);
    else fs.writeFileSync(path.join(ROOT, rel), current.join("\n"));
  }
}

function renumberCode(line: string, file: string, lineNo: number): { text: string; changes: Change[] } {
  const changes: Change[] = [];
  const text = line.replace(new RegExp(String.raw`(?:Sections?|§)\s*(?:${REF}|\d+(?![\d.]))(?:${SEP}${REF})*|Annex\s+[A-G](?:\.\d+)+`, "g"), (m) => {
    const notes: string[] = [];
    const out = m.replace(/^(Sections?\s*|§\s*|Annex\s+)([\s\S]*)$/, (_a, kw: string, rest: string) => `${kw}${rewriteList(rest, line, "code", notes)}`);
    if (out !== m) changes.push({ file, line: lineNo, form: "code", before: m, after: out, note: notes.join("; ") });
    return out;
  });
  return { text, changes };
}

/* ------------------------------------------------------------------ report */

if (CHECK) {
  if (stale.length) {
    console.error(`renumber-citations: a run would change ${stale.join(", ")}`);
    process.exit(1);
  }
  console.log(`renumber-citations: nothing to change (${all.length} citations already renumbered)`);
  process.exit(0);
}
const csv = (s: string) => `"${s.replace(/"/g, '""')}"`;
fs.writeFileSync(
  path.join(DOCS, "citations.csv"),
  ["file,line,form,before,after,note", ...all.map((c) => [c.file, c.line, c.form, c.before, c.after, c.note].map((v) => csv(String(v))).join(","))].join("\n") + "\n",
);
const checks = all.filter((c) => c.after.includes("[CHECK REF]"));
const targets = new Set(all.flatMap((c) => c.after.match(new RegExp(REF, "g")) ?? []));
console.log(`renumber-citations: ${all.length} citations rewritten (${all.filter((c) => c.file.startsWith("content/")).length} in content, ${all.length - all.filter((c) => c.file.startsWith("content/")).length} in code) to ${targets.size} distinct targets; ${checks.length} marked [CHECK REF]`);
for (const u of unapplied) console.log(`  not applied: ${u}`);
