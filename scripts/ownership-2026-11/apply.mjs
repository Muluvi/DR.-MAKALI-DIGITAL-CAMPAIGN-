#!/usr/bin/env node
/**
 * Applies the platform-ownership rewrites (roles.mjs) and logs every change to content/ in
 * docs/ownership-2026-11/ledger.json, in the ledger format check:content reads ("replaced": the
 * words before, the words after, and the section they sit in), so the content guards account for
 * every word moved.
 *
 *     node scripts/ownership-2026-11/apply.mjs          apply, and rewrite the ledger
 *     node scripts/ownership-2026-11/apply.mjs --check  fail if any rewrite is not applied
 *
 * Each rewrite must match exactly once (or, with `all`, at least once). A rewrite already applied
 * is skipped, so the script is safe to run again.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { superseded } from "../value-2026-11/superseded.mjs";
import { REWRITES } from "./roles.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const LEDGER = path.join(ROOT, "docs", "ownership-2026-11", "ledger.json");
const CHECK = process.argv.includes("--check");
const FENCE = /^\s*```/;
const HEADING = /^(#{2,3})\s+((?:\d+(?:\.\d+)*|[A-H](?:\.\d+)+))\s+(.*)$/; // as scripts/declutter/sections.mjs

// Words as check-content counts them: whitespace runs with a letter or digit, YAML keys not counted.
const words = (s) =>
  (s.replace(/\b(?:kind|preset|title|note|items|label|text|head|fields|body|tier|when|value|badge|chips|caption)\s*:/g, " ").match(/\S+/g) ?? [])
    .filter((t) => /[A-Za-z0-9]/.test(t) && !/^\d+\.$/.test(t)).length;

/** The section number ("13.2", or "(intro)") and fence kind at a character offset. */
function where(text, at) {
  const before = text.slice(0, at).split("\n");
  let section = "(intro)";
  let fence = null;
  for (const line of before.slice(0, -1)) {
    if (FENCE.test(line)) { fence = fence ? null : (line.trim().slice(3) || "code"); continue; }
    const m = fence ? null : HEADING.exec(line);
    if (m) section = m[2];
  }
  return { section, fence };
}

const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, "utf8")) : [];
const logged = new Set(ledger.map((e) => `${e.file}|${e.text}|${e.at}`));
let applied = 0, skipped = 0;
const missing = [];

for (const r of REWRITES) {
  const file = path.join(ROOT, r.f);
  let text = fs.readFileSync(file, "utf8");
  const count = text.split(r.from).length - 1;
  if (count === 0) {
    if (text.includes(r.to) || superseded(r.f, r.to, text)) { skipped++; continue; }
    missing.push(`${r.f}: not found: ${r.from.slice(0, 80)}`);
    continue;
  }
  if (count > 1 && !r.all) { missing.push(`${r.f}: ${count} matches, expected one: ${r.from.slice(0, 80)}`); continue; }
  if (CHECK) { missing.push(`${r.f}: not applied: ${r.from.slice(0, 80)}`); continue; }
  if (r.f.startsWith("content/")) {
    const tab = path.basename(r.f, ".md");
    let at = -1;
    while ((at = text.indexOf(r.from, at + 1)) !== -1) {
      const w = where(text, at);
      const key = `${tab}|${r.from}|${at}`;
      if (logged.has(key)) continue;
      ledger.push({
        file: tab,
        section: w.section,
        first12: r.from.replace(/\s+/g, " ").split(" ").slice(0, 12).join(" "),
        // A lead repeats its section's first sentence and is not weighed; only the body copy is.
        words: w.fence === "lead" ? 0 : words(r.from) - words(r.to),
        kind: "replaced",
        note: "Platform-ownership pass (November 2026): the campaign duty this passage gave Firefly is reassigned to Dr. Mulu's team, working on the platform; Firefly's part is the platform itself (docs/ownership-2026-11/PHASE-1-2-REPORT.md, task-to-function map).",
        text: r.from,
        replacement: r.to,
        at,
      });
    }
  }
  text = text.split(r.from).join(r.to);
  fs.writeFileSync(file, text);
  applied++;
}

if (!CHECK) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + "\n");
}
if (missing.length) {
  console.error(`ownership rewrites: ${missing.length} problem(s)\n${missing.map((m) => "  - " + m).join("\n")}`);
  process.exit(1);
}
console.log(`ownership rewrites: ${applied} applied, ${skipped} already in place, ${ledger.length} content changes in the ledger`);
