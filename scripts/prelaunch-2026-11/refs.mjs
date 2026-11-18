/**
 * Section 1 of the pre-launch pass: every in-text "Section 3.7", "§3.6.2" or "Annex G" reference in
 * content/*.md, rewritten as a link that carries the heading's own words, so no reader meets a
 * document number. Figure and text-version fences are protected word for word (check-content, 3)
 * and are left as they are; what they print is turned into words on the page (lib/reader-text.ts).
 *
 * Returns rewrites in the shape apply.mjs takes: { f, from, to, at, auto: "refs" }.
 */
import fs from "node:fs";
import path from "node:path";
import { CONTENT, contentFiles, sectionIndex, where } from "./lib.mjs";

const NUM = String.raw`(?:\d+[A-Z]?(?:\.\d+){0,3}|[A-H](?:\.\d+){0,3})`;
const LEAD = String.raw`(?:Sections?\s+|Chapters?\s+|§\s?|Annex(?:es)?\s+)`;
export const REF = new RegExp(String.raw`${LEAD}${NUM}\b(?:\s*(?:,|and|or|&|–|-|to|/)\s*(?:${LEAD})?${NUM}\b)*(?:\s*\[CHECK REF\])?`, "g");
const PROTECTED = new Set(["figure", "textversion"]);
/**
 * Annexes that left the document as numbered chapters: where their content is today. Annex B, the
 * 40-ward register, is the Ward Dossier tool; Annex D, the volunteer programme, is the reference at
 * the end of the workstreams chapter.
 */
const MOVED = {
  B: { href: "/tools/ward-dossier", title: "the Ward Dossier" },
  D: { href: "/#workstreams-sec-d-1", title: "the volunteer programme reference" },
};

/** Words that open a heading and read better in lower case mid-sentence. */
const COMMON = new Set("the a an what where who how why when which one two three four five six seven eight nine ten every each his its your our their this that these those reaching measuring making turning holding finding naming setting building running testing keeping winning reading choosing working where's after before from from by on in at for of with without".split(" "));

function linkText(title, sentenceStart) {
  const first = title.split(/\s+/)[0].toLowerCase().replace(/[^a-z']/g, "");
  if (!sentenceStart && COMMON.has(first) && /^[A-Z][a-z]/.test(title)) return title[0].toLowerCase() + title.slice(1);
  return title;
}

/** The links that replace one reference, given its resolved parts and where it sits. */
function linked(hits, text, at) {
  const before = text.slice(Math.max(0, at - 4), at);
  const sentenceStart = /(?:^|[.!?:]\s+|\n\s*(?:[-*]\s+)?|\|\s*|"\s*|\*\*\s*)$/.test(before) || at === 0;
  let to = "";
  hits.forEach((h, i) => {
    const j = h.joiner === "–" || h.joiner === "-" || h.joiner === "to" ? " to " : h.joiner === "/" ? " / " : h.joiner === "," ? ", " : h.joiner ? ` ${h.joiner} ` : "";
    to += (i ? j : "") + `[${linkText(h.hit.title, sentenceStart && i === 0)}](${h.hit.href})`;
  });
  return to;
}

const resolve = (raw, index) =>
  parts(raw).map((p) => {
    const moved = /^Annex/.test(raw) ? MOVED[p.n] : undefined;
    const hit = moved ?? index.get(p.n) ?? index.get(p.n.toUpperCase());
    return { ...p, hit: hit && { href: hit.href ?? `/#${hit.id}`, title: hit.title.replace(/^Workstream \d+\s*[—–-]\s*/, "") } };
  });

/**
 * The same rewrite over a generated markdown region (scripts/build-source-table.ts writes figure
 * notes into Evidence and sources): every reference that names a heading becomes its link.
 */
export function linkRefs(text, index = sectionIndex()) {
  return text.replace(REF, (raw, at) => {
    const hits = resolve(raw, index);
    return hits.some((h) => !h.hit) ? raw : linked(hits, text, at);
  });
}

/** Split the number list of one matched reference: "Sections 2.5 and 2.6" -> ["2.5", "2.6"], with joiners. */
function parts(raw) {
  const body = raw.replace(/\s*\[CHECK REF\]$/, "");
  const out = [];
  const re = new RegExp(String.raw`(?:${LEAD})?(${NUM})\b`, "g");
  let last = 0;
  let joiner = "";
  for (const m of body.matchAll(re)) {
    if (out.length) joiner = body.slice(last, m.index).replace(/\s+/g, " ").trim();
    out.push({ n: m[1], joiner });
    last = m.index + m[0].length;
  }
  return out;
}

export function refRewrites({ index = sectionIndex(), files = contentFiles() } = {}) {
  const rewrites = [];
  const unresolved = [];
  for (const tab of files) {
    const f = `content/${tab}.md`;
    const text = fs.readFileSync(path.join(CONTENT, `${tab}.md`), "utf8");
    for (const m of text.matchAll(REF)) {
      const at = m.index;
      const w = where(text, at);
      if (w.fence && PROTECTED.has(w.fence)) continue;
      const line = text.slice(text.lastIndexOf("\n", at) + 1, text.indexOf("\n", at) === -1 ? undefined : text.indexOf("\n", at));
      if (/^#{1,6}\s/.test(line)) continue; // headings carry their own number; the renderer drops it
      // The citation of the content checks' own working, in backticks, is code.
      const hits = resolve(m[0], index);
      if (hits.some((h) => !h.hit)) {
        unresolved.push({ f, at, raw: m[0], section: w.section, fence: w.fence, ctx: text.slice(Math.max(0, at - 70), at + m[0].length + 50).replace(/\s+/g, " ") });
        continue;
      }
      let to = linked(hits, text, at);
      if (w.fence === "visual" && to.includes('"')) to = to.replace(/"/g, "'");
      rewrites.push({ f, from: m[0], to, at, section: w.section, fence: w.fence, auto: "refs" });
    }
  }
  // A table column that holds nothing but section numbers ("Where it is set" in the deliverables
  // schedule): each cell becomes links named for the headings.
  for (const tab of files) {
    const f = `content/${tab}.md`;
    const text = fs.readFileSync(path.join(CONTENT, `${tab}.md`), "utf8");
    let header = null;
    let offset = 0;
    for (const line of text.split("\n")) {
      if (/^\|/.test(line)) {
        if (!header) header = line;
        const m = /\|\s*((?:\d+(?:\.\d+)*|[A-H]\.[\d.]+)(?:,\s*(?:\d+(?:\.\d+)*|[A-H]\.[\d.]+))*)\s*\|\s*$/.exec(line);
        if (m && /\|\s*Where it is set\s*\|\s*$/.test(header)) {
          const nums = m[1].split(/,\s*/);
          const hits = nums.map((n) => index.get(n));
          const at = offset + m.index + m[0].indexOf(m[1]);
          const w = where(text, at);
          if (hits.some((h) => !h)) unresolved.push({ f, at, raw: m[1], section: w.section, fence: w.fence, ctx: line.slice(0, 120) });
          else rewrites.push({ f, from: m[1], to: hits.map((h) => `[${h.title.replace(/^Workstream \d+\s*[—–-]\s*/, "")}](/#${h.id})`).join(", "), at, section: w.section, fence: w.fence, auto: "refs" });
        }
      } else header = null;
      offset += line.length + 1;
    }
  }
  return { rewrites, unresolved };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { rewrites, unresolved } = refRewrites();
  console.log(`${rewrites.length} references resolve; ${unresolved.length} do not`);
  for (const u of unresolved) console.log(`  UNRESOLVED ${u.f}:${u.section}${u.fence ? ` [${u.fence}]` : ""}  ${u.raw}  …${u.ctx}…`);
  if (process.argv.includes("--samples")) for (const r of rewrites.slice(0, +process.argv[process.argv.indexOf("--samples") + 1] || 30)) console.log(`  ${r.f}:${r.section}${r.fence ? ` [${r.fence}]` : ""}  ${r.from}  =>  ${r.to}`);
}
