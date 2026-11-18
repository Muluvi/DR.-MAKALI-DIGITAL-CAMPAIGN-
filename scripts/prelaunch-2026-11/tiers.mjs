/**
 * Section 3 of the pre-launch pass: the inline tier tags leave the chapters' prose. "(Tier 1, KNBS
 * 2019 Census)" reads "(KNBS 2019 Census)". A tag is never allowed to take a hedge with it, so a tier
 * that carried one becomes the site's own plain word for it (lib/reader-text.ts, tierWord):
 *
 *   Tier 1   dropped: the source named beside it is the record
 *   Tier 2   dropped where the parenthesis names a source (that source is the report); alone, "reported"
 *   Tier 3   "unconfirmed", unless the parenthesis already says so
 *   a tier followed by its own qualifier ("Tier 3 until its line items are in hand") becomes the
 *   word ("unconfirmed until its line items are in hand")
 *
 * Left exactly as they are: Evidence and sources, Fine print and Technology (the reference shelf,
 * where every tier is kept); figure and text-version fences (protected word for word); a visual's
 * `tier:` field (data, not prose); "volunteer Tier 3" (a volunteer level, not a source grade); and
 * the tier words in running prose, which are reworded one by one in rewrites-s3.json.
 *
 * Returns rewrites in the shape apply.mjs takes: { f, from, to, at, auto: "tiers" }.
 */
import fs from "node:fs";
import path from "node:path";
import { CONTENT, contentFiles, where } from "./lib.mjs";

const SKIP_FILES = new Set(["annex-evidence", "annex-terms", "annex-technology"]);
const PROTECTED = new Set(["figure", "textversion"]);
const WORD = { 1: "official", 2: "reported", 3: "unconfirmed" };
const TIERS = String.raw`Tier ([123])(?:\s*(?:\/|and|or)\s*Tier ([123]))?`;

/** The parenthesis around an offset on one line, nested parentheses allowed one level deep. */
function parenAround(text, at) {
  const lineStart = text.lastIndexOf("\n", at) + 1;
  let depth = 0;
  let open = -1;
  for (let i = at; i >= lineStart; i--) {
    if (text[i] === ")") depth++;
    else if (text[i] === "(") { if (depth === 0) { open = i; break; } depth--; }
  }
  if (open < 0) return null;
  depth = 0;
  for (let i = open; i < text.length && text[i] !== "\n"; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")") { depth--; if (depth === 0) return { open, close: i }; }
  }
  return null;
}

/** The inside of one parenthesis with its tier tags taken out, or null to drop the parenthesis. */
/** Tiers that open a phrase of their own, worded by hand. */
const OVERRIDE = [["Tier 1 as a record of what the county claims", "a record of what the county claims"]];

export function untier(inner) {
  for (const [a, b] of OVERRIDE) inner = inner.split(a).join(b);
  // "a named data gap (Tier 1 gap)": the gap is named in the sentence; the grade of the record that
  // would close it is in Evidence and sources.
  if (/^Tier [123] gaps?$/.test(inner)) return null;
  const hasSource = (s) => /[A-Za-z]{2,}/.test(s.replace(new RegExp(TIERS, "g"), "").replace(/\b(unconfirmed|respectively|both|and|or|an estimate)\b/g, ""));
  const already = /\bunconfirmed\b/i.test(inner);
  const sourced = hasSource(inner);
  const word = (a, b) => {
    const tiers = [a, b].filter(Boolean).map(Number);
    if (tiers.length === 2 && /\brespectively\b/.test(inner)) return tiers.map((t) => WORD[t]).join(" and ");
    const worst = Math.max(...tiers);
    return WORD[worst];
  };
  let out = inner;
  // A tier with a qualifier of its own ("Tier 3 until …", "Tier 3 and Tier 2 respectively; …")
  // keeps its meaning as a word.
  out = out.replace(new RegExp(String.raw`${TIERS}(?=\s+(?:until|unless|respectively|pending|as|on|for|in|at|pre-|from|because|while)\b)`, "g"), (_, a, b) => word(a, b));
  // A bare tag: dropped, or its plain word where it is the only hedge left.
  out = out.replace(new RegExp(String.raw`(^|[,;]\s*)${TIERS}(?=\s*(?:[,;]|$))`, "g"), (m, lead, a, b) => {
    const worst = Math.max(...[a, b].filter(Boolean).map(Number));
    if (worst === 3 && !already) return `${lead}unconfirmed`;
    if (worst === 2 && !sourced) return `${lead}reported`;
    return lead;
  });
  // One hedge word is enough ("unconfirmed; OAG …, unconfirmed"), and it follows the source it
  // qualifies: "(constituency records, unconfirmed)", not "(unconfirmed, constituency records)".
  for (const w of Object.values(WORD)) {
    const re = new RegExp(String.raw`(^|[,;]\s*)${w}(?=\s*(?:[,;]|$))`, "g");
    let seen = 0;
    out = out.replace(re, (m, lead) => (seen++ ? lead : m));
  }
  const [head, ...tail] = out.split(/;\s*/);
  const lead = /^(unconfirmed|reported),\s+(?!and\b)(.+)$/.exec(head);
  if (lead) out = [`${lead[2]}, ${lead[1]}`, ...tail].join("; ");
  out = out
    .replace(/^\s*[,;]\s*/, "")
    .replace(/\s*[,;]\s*$/, "")
    .replace(/([,;])\s*[,;]/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
  return out ? out : null;
}

export function tierRewrites({ files = contentFiles() } = {}) {
  const rewrites = [];
  const left = [];
  for (const tab of files) {
    if (SKIP_FILES.has(tab)) continue;
    const f = `content/${tab}.md`;
    const text = fs.readFileSync(path.join(CONTENT, `${tab}.md`), "utf8");
    const done = new Set();
    for (const m of text.matchAll(/Tier [123]/g)) {
      const at = m.index;
      const w = where(text, at);
      if (w.fence && PROTECTED.has(w.fence)) continue;
      if (/volunteer\s+$/i.test(text.slice(Math.max(0, at - 12), at))) continue;
      const lineStart = text.lastIndexOf("\n", at) + 1;
      // A visual's tier: field is data.
      if (/^\s*(?:-\s*)?tier:\s*/.test(text.slice(lineStart, at))) continue;
      const p = parenAround(text, at);
      if (!p) { left.push({ f, at, section: w.section, ctx: text.slice(Math.max(0, at - 60), at + 60).replace(/\s+/g, " ") }); continue; }
      if (done.has(p.open)) continue;
      done.add(p.open);
      const inner = text.slice(p.open + 1, p.close);
      const next = untier(inner);
      // Drop a whole parenthesis with the space before it; a link's own parenthesis is never touched.
      if (text[p.open - 1] === "]") continue;
      const spaceBefore = next === null && /[ \t]/.test(text[p.open - 1]) ? 1 : 0;
      const from = text.slice(p.open - spaceBefore, p.close + 1);
      const to = next === null ? "" : `(${next})`;
      if (from === to) continue;
      rewrites.push({ f, from, to, at: p.open - spaceBefore, section: w.section, fence: w.fence, auto: "tiers" });
    }
  }
  return { rewrites, left };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { rewrites, left } = tierRewrites();
  console.log(`${rewrites.length} tier parentheses rewritten; ${left.length} tier words in running prose, listed for rewording`);
  if (process.argv.includes("--samples")) for (const r of rewrites) console.log(`  ${r.f}:${r.section}${r.fence ? ` [${r.fence}]` : ""}  ${r.from.trim()}  =>  ${r.to || "(dropped)"}`);
  if (process.argv.includes("--left")) for (const l of left) console.log(`  PROSE ${l.f}:${l.section}  …${l.ctx}…`);
}

/** A string as it reads once its tier parentheses are rewritten: what an earlier rewrite became. */
export function afterTiers(str) {
  return str.replace(/ ?\(([^()]*Tier [123][^()]*)\)/g, (m, inner) => {
    const next = untier(inner);
    return next === null ? "" : `${m.startsWith(" ") ? " " : ""}(${next})`;
  });
}
