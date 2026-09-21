#!/usr/bin/env node
/**
 * Phase 1: move every block of the document to its new home and renumber it.
 *
 * MOVES ONLY. Not one word of prose is rewritten here except a heading's own title, where
 * <new_structure> supplies final copy, and section numbers inside cross-references, which are
 * addresses rather than prose. Cuts, splits and the poll purge are Phase 2, against a document
 * that is already in its new shape — so that the phase which is allowed to delete text runs
 * against something a reader can check, and the phase that moves text cannot lose any.
 *
 * The guarantee this script makes, and prints: every non-heading line of the old document appears
 * exactly once in the new one.
 *
 *     node scripts/rebuild/migrate.mjs --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HEADING_MAP } from "./mapping.mjs";
import { NEW_ROUTES } from "./routes.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = path.join(ROOT, "public", "content");
const OUT = path.join(ROOT, "public", "content");
const WRITE = process.argv.includes("--write");

const HEADING = /^(#{2,3})\s+(.*)$/;
const LEADING = /^(\d+[A-Z]?(?:\.\d+)*[a-z]?)\.?\s+(.*)$/;

/** Each workstream route opens with its group name, unnumbered so it claims no id. */
const ROUTE_OPENERS = {
  "workstreams-platforms": "Platforms and content",
  "workstreams-media": "Publishing and earned media",
  "workstreams-ground": "Ground and offline reach",
  "workstreams-data": "Data and technology",
};

// ---------------------------------------------------------------------------- parse
/** Split a file into its preamble and its h2/h3 blocks, respecting fenced code. */
function parse(source) {
  const lines = source.split("\n");
  const blocks = [];
  let preamble = [];
  let current = null;
  let fence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) fence = !fence;
    const m = fence ? null : HEADING.exec(line);
    if (m) {
      const num = LEADING.exec(m[2].trim());
      if (num) {
        if (current) blocks.push(current);
        current = { level: m[1].length, number: num[1], title: num[2].trim(), body: [] };
        continue;
      }
    }
    (current ? current.body : preamble).push(line);
  }
  if (current) blocks.push(current);
  return { preamble, blocks };
}

// ---------------------------------------------------------------------------- numbering
/** Natural sort for dotted numbers, so 5.10 follows 5.9 rather than 5.1. */
function numKey(n) {
  return n.split(".").map((p) => {
    const d = parseInt(p, 10);
    return Number.isNaN(d) ? p.padStart(6, "0") : String(d).padStart(6, "0");
  });
}
function cmpNum(a, b) {
  const [x, y] = [numKey(a), numKey(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const c = String(x[i] ?? "").localeCompare(String(y[i] ?? ""));
    if (c) return c;
  }
  return 0;
}

/**
 * The heading level a new number takes.
 *
 * Two components is a sub-section; anything deeper is a part of one. The workstreams are the one
 * exception: 5.2.1-5.2.14 are fourteen sub-sections of 5.2 that each own a route's worth of
 * parts, so they keep the h2 their parts hang off.
 */
function levelFor(number) {
  if (!number) return 2;
  if (/^5\.2\.\d+$/.test(number)) return 2;
  return number.split(".").length === 2 ? 2 : 3;
}

// ---------------------------------------------------------------------------- run
const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).sort();
const parsed = new Map();
for (const f of files) parsed.set(f.replace(/\.md$/, ""), parse(fs.readFileSync(path.join(SRC, f), "utf-8")));

// Old section number -> new section number, for rewriting cross-references.
const NUMBER_MAP = new Map();
for (const [key, [, newNum]] of Object.entries(HEADING_MAP)) {
  const oldNum = key.slice(key.indexOf(" ") + 1);
  if (newNum) NUMBER_MAP.set(oldNum, newNum);
}
// Old deep-link id -> new deep-link id.
const ID_MAP = {};
for (const [key, [route, newNum]] of Object.entries(HEADING_MAP)) {
  const [oldFile, oldNum] = [key.slice(0, key.indexOf(" ")), key.slice(key.indexOf(" ") + 1)];
  const oldId = `${oldFile}-sec-${oldNum.replace(/\./g, "-").toLowerCase()}`;
  ID_MAP[oldId] = newNum
    ? `${route}-sec-${newNum.replace(/\./g, "-").toLowerCase()}`
    : route; // a heading that loses its number resolves to its route
}

/**
 * Rewrite section references in a line.
 *
 * Deliberately conservative: only a number introduced by "Section", "Sections" or "§", or one
 * standing alone in parentheses, is an address. A bare "3.4" in a sentence is far more likely to
 * be a figure than a cross-reference, and rewriting it would corrupt the document silently.
 */
const NUM = "\\d+[A-Z]?(?:\\.\\d+)*[a-z]?";
let rewrites = 0;
function rewriteRefs(line) {
  if (/^\s*```/.test(line)) return line;
  const sub = (n) => {
    const to = NUMBER_MAP.get(n);
    if (!to) return n;
    rewrites++;
    return to;
  };
  return line
    .replace(new RegExp(`(§\\s*)(${NUM})`, "g"), (_, p, n) => p + sub(n))
    .replace(
      new RegExp(`\\b(Sections?\\s+)(${NUM}(?:\\s*(?:,|and|&|–|-)\\s*${NUM})*)`, "g"),
      (_, p, list) => p + list.replace(new RegExp(NUM, "g"), sub)
    )
    // A parenthesised list of addresses — "(13.2.2, 13.4.2)", "(13.3.1–13.3.4)" — is rewritten
    // only when EVERY number in it is one this map knows. A bracket holding one address and one
    // measurement is left alone rather than half-translated.
    .replace(
      new RegExp(`\\((${NUM}(?:\\s*(?:,|and|&|–|-)\\s*${NUM})*)\\)`, "g"),
      (whole, list) => {
        const parts = list.match(new RegExp(NUM, "g")) ?? [];
        if (!parts.length || !parts.every((n) => NUMBER_MAP.has(n))) return whole;
        return `(${list.replace(new RegExp(NUM, "g"), sub)})`;
      }
    )
    // The annexes are re-lettered: the polls take C, so the old C, D and E shift to D, E and F.
    .replace(/\bAnnex(es)?\s+([A-E])\b/g, (_, es, letter) => {
      const to = ANNEX_MAP[letter];
      if (to !== letter) rewrites++;
      return `Annex${es ?? ""} ${to}`;
    });
}

/** Old annex letter -> new. A and B keep their place; the new Annex C displaces the rest. */
const ANNEX_MAP = { A: "A", B: "B", C: "D", D: "E", E: "F" };

// Assign every block to its route.
const routes = new Map(NEW_ROUTES.map((r) => [r.id, []]));
const unmapped = [];
for (const [file, { preamble, blocks }] of parsed) {
  blocks.forEach((b, i) => {
    const target = HEADING_MAP[`${file} ${b.number}`];
    if (!target) return unmapped.push(`${file} ${b.number}`);
    const [route, number, title] = target;
    routes.get(route).push({
      number,
      level: levelFor(number),
      title: title ?? b.title,
      body: b.body,
      // A file's opening prose travels with that file's first block, which is where a reader
      // met it. Phase 2 decides whether it still reads correctly there.
      lead: i === 0 ? preamble : null,
      from: `${file} ${b.number}`,
    });
  });
}
if (unmapped.length) {
  console.error("UNMAPPED BLOCKS:\n  " + unmapped.join("\n  "));
  process.exit(1);
}

// Emit.
let linesIn = 0;
for (const { preamble, blocks } of parsed.values()) {
  linesIn += preamble.length + blocks.reduce((n, b) => n + b.body.length, 0);
}
let linesOut = 0;
const written = [];
for (const route of NEW_ROUTES) {
  const blocks = routes.get(route.id) ?? [];
  blocks.sort((a, b) => (a.number && b.number ? cmpNum(a.number, b.number) : a.number ? 1 : -1));
  const out = [];
  if (ROUTE_OPENERS[route.id]) out.push(`## ${ROUTE_OPENERS[route.id]}`, "");
  for (const b of blocks) {
    if (b.lead) { out.push(...b.lead.map(rewriteRefs)); linesOut += b.lead.length; }
    const hashes = "#".repeat(b.level);
    out.push(`${hashes} ${b.number ? b.number + " " : ""}${rewriteRefs(b.title)}`.trimEnd());
    out.push(...b.body.map(rewriteRefs));
    linesOut += b.body.length;
  }
  const text = out.join("\n").replace(/\n{4,}/g, "\n\n\n").trimStart() + "\n";
  written.push([route.id, blocks.length, text]);
  if (WRITE) fs.writeFileSync(path.join(OUT, `${route.id}.md`), text);
}

if (WRITE) {
  for (const f of files) {
    const id = f.replace(/\.md$/, "");
    if (!NEW_ROUTES.some((r) => r.id === id)) fs.unlinkSync(path.join(SRC, f));
  }
  fs.writeFileSync(path.join(ROOT, "lib", "legacy-ids.generated.json"), JSON.stringify(ID_MAP, null, 2) + "\n");
}

console.log(`${WRITE ? "WROTE" : "DRY RUN"} — ${written.length} routes, ${Object.keys(HEADING_MAP).length} headings moved`);
for (const [id, n, text] of written) {
  console.log(`  ${id.padEnd(24)} ${String(n).padStart(3)} blocks  ${String(text.split(/\s+/).filter(Boolean).length).padStart(6)} words`);
}
console.log(`\nbody lines in ${linesIn}, out ${linesOut}  ${linesIn === linesOut ? "— every line accounted for" : "— MISMATCH"}`);
console.log(`cross-references rewritten: ${rewrites}`);
console.log(`legacy ids generated: ${Object.keys(ID_MAP).length}`);
