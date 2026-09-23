#!/usr/bin/env node
/**
 * One-off, Phase 2: replace every numeric literal in content/*.md with a `{{figure-id}}` token.
 *
 * A literal is replaced only when exactly one figure prints as it, or when the line's own words
 * pick one of several (a ward's name, a phase, a constituency). Everything else is reported, not
 * guessed, and resolved by hand or by adding the figure it names to lib/data/figures.ts.
 *
 *     node --experimental-strip-types scripts/rebuild/tokenize.ts            # report
 *     node --experimental-strip-types scripts/rebuild/tokenize.ts --write    # apply
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FIGURES } from "../../lib/data/figures.ts";
import { formatFigure } from "../../lib/data/format.ts";
import { ALLOW } from "../../lib/data/allow.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = path.join(ROOT, "content");
const WRITE = process.argv.includes("--write");

const LITERAL = /(?<![\w.,{|])\d{1,3}(?:,\d{3})+(?:\.\d+)?(?![\d}])|(?<![\w.,{|])\d{3,}(?:\.\d+)?(?![\d}])/g;

// literal text -> figure ids that print as it (sign dropped; the sentence keeps its own "−")
const BY_TEXT = new Map<string, string[]>();
for (const [id, f] of Object.entries(FIGURES)) {
  if (f.value === null || f.unit === "percent") continue;
  const text = formatFigure({ ...f, value: Math.abs(f.value) });
  BY_TEXT.set(text, [...(BY_TEXT.get(text) ?? []), id]);
}

const NAMES: Record<string, string[]> = {};
for (const id of Object.keys(FIGURES)) {
  const m = /^(ward|con|sub)\.(.+?)(\.|$)/.exec(id);
  if (m) NAMES[id] = [m[2].replace(/-/g, "[ /-]?")];
}

/** Words in a line that pick one figure among several with the same printed value. */
const PREFER: [RegExp, string][] = [
  [/supporters/, "target.supporters"],
  [/engaged followers/, "target.followers.phase-2"],
  [/followers|facebook presence/, "channel.fb.followers"],
  [/consented sms contacts|sms contacts/, "target.sms.phase-1"],
  [/ussd unique sessions/, "target.ussd.phase-1"],
  [/subscribers/, "target.subscribers.phase-1"],
  [/volunteer/, "target.volunteers.phase-2"],
  [/contact universe/, "target.contact-universe.standard"],
];

/** Prefer the candidate the line itself names. */
function pick(ids: string[], line: string): string | null {
  if (ids.length === 1) return ids[0];
  const low = line.toLowerCase();
  for (const [re, id] of PREFER) {
    if (!re.test(low)) continue;
    // The same row can hold several phases' values; the value decides which of the family it is.
    const family = id.replace(/\.(phase-\d|lean|standard|premium)$/, "");
    const hits = ids.filter((c) => c.startsWith(family));
    if (hits.length === 1) return hits[0];
    if (ids.includes(id)) return id;
  }
  if (ids.includes("benchmark")) return "benchmark";
  const preferred = ids.filter((c) => !c.startsWith("path."));
  if (preferred.length === 1) return preferred[0];
  const named = ids.filter((id) => (NAMES[id] ?? []).some((re) => new RegExp(re).test(low)));
  if (named.length === 1) return named[0];
  const phase = /phase 1\b|phase 1 /.test(low) ? "phase-1" : /phase 2/.test(low) ? "phase-2" : /phase 3/.test(low) ? "phase-3" : null;
  if (phase) {
    const p = ids.filter((id) => id.includes(phase));
    if (p.length === 1) return p[0];
  }
  // Prefer a sourced register figure over a derived one with the same value.
  const reg = ids.filter((id) => /^(con|ward|register|result|census)\./.test(id));
  if (reg.length === 1) return reg[0];
  return null;
}

const unmatched: string[] = [];
const ambiguous: string[] = [];
let replaced = 0;
for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).sort()) {
  const lines = fs.readFileSync(path.join(SRC, file), "utf8").split("\n");
  let fence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    if (ALLOW.some((re) => re.test(line) && !line.replace(re, "").match(LITERAL))) continue;
    lines[i] = line.replace(LITERAL, (lit, offset: number) => {
      if (/^(19|20)\d\d$/.test(lit)) return lit;
      const around = line.slice(Math.max(0, offset - 12), offset + lit.length + 12);
      if (ALLOW.some((re) => re.test(around))) return lit;
      const ids = BY_TEXT.get(lit);
      if (!ids) { unmatched.push(`${file}:${i + 1} ${lit}  | ${line.trim().slice(0, 110)}`); return lit; }
      const id = pick(ids, line);
      if (!id) { ambiguous.push(`${file}:${i + 1} ${lit} -> ${ids.join(" / ")}  | ${line.trim().slice(0, 90)}`); return lit; }
      replaced++;
      const neg = (FIGURES[id].value ?? 0) < 0;
      return `{{${id}${neg ? "|abs" : ""}}}`;
    });
  }
  if (WRITE) fs.writeFileSync(path.join(SRC, file), lines.join("\n"));
}
console.log(`tokenize: ${replaced} replaced, ${ambiguous.length} ambiguous, ${unmatched.length} unmatched`);
for (const a of ambiguous) console.log("  ? " + a);
for (const u of unmatched) console.log("  ! " + u);
