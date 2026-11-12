#!/usr/bin/env node
/**
 * Sign-in removal (November 2026). The site no longer has a sign-in or any editing, so every
 * passage that said the team signs in, or that team accounts exist, is reworded to say what is
 * true. The rewrites are in ./rewrites.mjs; every change to content/ is logged in
 * docs/signin-2026-11/ledger.json in the format check:content reads.
 *
 *     node scripts/signin-2026-11/content-fixes.mjs          apply, and rewrite the ledger
 *     node scripts/signin-2026-11/content-fixes.mjs --check  fail if any rewrite is not applied
 *
 * The engine below is the toc-2026-11 pass's, unchanged apart from its list, ledger and note.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REWRITES } from "./rewrites.mjs";

export { REWRITES };

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const LEDGER = path.join(ROOT, "docs", "signin-2026-11", "ledger.json");
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

if (import.meta.url === `file://${process.argv[1]}`) {
  const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, "utf8")) : [];
  const logged = new Set(ledger.map((e) => `${e.file}|${e.text}|${e.at}`));
  let applied = 0, skipped = 0;
  const missing = [];

  for (const r of REWRITES) {
    const file = path.join(ROOT, r.f);
    let text = fs.readFileSync(file, "utf8");
    const count = text.split(r.from).length - 1;
    if (count === 0) {
      if (text.includes(r.to)) { skipped++; continue; }
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
        // A heading is not weighed (sections are keyed by number), nor is a lead, which repeats its
        // section's first sentence; only body copy and visual text are.
        const weighed = w.fence !== "lead" && !r.from.startsWith("```lead") && !r.from.startsWith("## ");
        ledger.push({
          file: tab,
          section: w.section,
          first12: r.from.replace(/\s+/g, " ").split(" ").slice(0, 12).join(" "),
          words: weighed ? words(r.from) - words(r.to) : 0,
          kind: "replaced",
          note: "Sign-in removal (docs/signin-2026-11): the site has no sign-in and no editing, so the passage that said the team signs in, or that team accounts exist, now says what is true.",
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
    console.error(`content fixes: ${missing.length} problem(s)\n${missing.map((m) => "  - " + m).join("\n")}`);
    process.exit(1);
  }
  console.log(`content fixes: ${applied} applied, ${skipped} already in place, ${ledger.length} content changes in the ledger`);
}
