/**
 * Section 9 of the pre-launch pass: one style for his name. In each chapter the first mention reads
 * "Hon. Dr. Benson Makali Mulu" and every later one "Dr. Mulu". A chapter's lead restates its first
 * sentence, so the lead's first mention takes the full name too. Left as written: direct quotations,
 * the title of the "Dr. Mulu Explains" series, code, link addresses, and figure and text-version
 * fences (protected word for word).
 *
 * Returns rewrites in the shape apply.mjs takes: { f, from, to, at, auto: "names" }.
 */
import fs from "node:fs";
import path from "node:path";
import { CONTENT, contentFiles, where } from "./lib.mjs";

const FULL = "Hon. Dr. Benson Makali Mulu";
const SHORT = "Dr. Mulu";
const NAME = /(?:Hon\. )?Dr\. (?:Benson )?Makali Mulu|Dr\. Mulu(?! Explains)/g;
const PROTECTED = new Set(["figure", "textversion"]);
/**
 * Leads that would pass the 45-word limit with the full name (scripts/declutter/check-leads.mjs):
 * they keep "Dr. Mulu", and the chapter's body carries the full name at its first mention.
 */
const SHORT_LEADS = new Set(["success"]);

/** Inside a quotation on its line: an odd number of quote marks before it. */
function quoted(line, col, yaml) {
  const before = line.slice(0, col);
  if (yaml) return ((before.match(/\\"/g) ?? []).length % 2 === 1) || (before.split("“").length > before.split("”").length);
  if (before.split("“").length > before.split("”").length) return true;
  return (before.match(/(?<!\\)"/g) ?? []).length % 2 === 1;
}

export function nameRewrites({ files = contentFiles() } = {}) {
  const rewrites = [];
  const skipped = [];
  for (const tab of files) {
    const f = `content/${tab}.md`;
    const text = fs.readFileSync(path.join(CONTENT, `${tab}.md`), "utf8");
    let seenLead = false;
    let seenBody = false;
    for (const m of text.matchAll(NAME)) {
      const at = m.index;
      const w = where(text, at);
      const lineStart = text.lastIndexOf("\n", at) + 1;
      const lineEnd = text.indexOf("\n", at);
      const line = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
      const col = at - lineStart;
      const inLead = w.fence === "lead";
      const isFirst = inLead ? !seenLead : !seenBody;
      if (inLead) seenLead = true; else seenBody = true;
      if (w.fence && PROTECTED.has(w.fence)) { skipped.push({ f, why: w.fence, ctx: line.slice(Math.max(0, col - 40), col + 40) }); continue; }
      if (/`[^`]*$/.test(line.slice(0, col)) && (line.slice(0, col).match(/`/g) ?? []).length % 2 === 1) { skipped.push({ f, why: "code", ctx: line.slice(Math.max(0, col - 40), col + 40) }); continue; }
      if (quoted(line, col, w.fence === "visual")) { skipped.push({ f, why: "quote", ctx: line.slice(Math.max(0, col - 50), col + 50) }); continue; }
      const to = isFirst && !(inLead && SHORT_LEADS.has(tab)) ? FULL : SHORT;
      if (m[0] === to) continue;
      rewrites.push({ f, from: m[0], to, at, section: w.section, fence: w.fence, auto: "names" });
    }
  }
  return { rewrites, skipped };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { rewrites, skipped } = nameRewrites();
  console.log(`${rewrites.length} mentions restyled; ${skipped.length} left as written`);
  if (process.argv.includes("--samples")) for (const r of rewrites) console.log(`  ${r.f}:${r.section}${r.fence ? ` [${r.fence}]` : ""}  ${r.from} => ${r.to}`);
  if (process.argv.includes("--skipped")) for (const s of skipped) console.log(`  SKIP ${s.f} (${s.why}) …${s.ctx}…`);
}
