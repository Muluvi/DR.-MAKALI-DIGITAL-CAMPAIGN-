#!/usr/bin/env node
/**
 * The pre-launch pass (November 2026, docs/prelaunch-2026-11/README.md): what the site says to a
 * reader before it launches. Every change to content/ is logged in docs/prelaunch-2026-11/ledger.json
 * in the format check:content reads, as the table-of-contents fixes were (scripts/toc-2026-11):
 *
 *   replaced   the words before and the words after, and the section they sit in
 *   moved      text taken word for word from one section to another (`to`)
 *
 *     node scripts/prelaunch-2026-11/apply.mjs          apply, and add what it changed to the ledger
 *     node scripts/prelaunch-2026-11/apply.mjs --check  fail if any rewrite is not applied, or if a
 *                                                       numbered reference is left in reader text
 *
 * The rewrites, by section of the brief (docs/prelaunch-2026-11/README.md):
 *   1. Every in-text "Section 3.7", "§3.6.2" or "Annex B" reference becomes a link that carries the
 *      heading's own words (refs.mjs). Generated, not listed: --check fails if any is left.
 *   2. Draft history leaves the chapters, word for word, for the source notes in Evidence and sources.
 *   3. Inline tier tags leave the prose; the source each one names stays (tiers.mjs).
 *   5. Copy that promises editing follows the sign-in switch.
 *   7-9. The headline register figure, the Kikamba review label, one style for his name.
 *
 * Each listed rewrite must match exactly once (or, with `all`, at least once). One already applied is
 * skipped, so the script is safe to run again.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, where, words } from "./lib.mjs";
import { refRewrites } from "./refs.mjs";
import { afterTiers, tierRewrites } from "./tiers.mjs";
import { REWRITES } from "./rewrites.mjs";

const LEDGER = path.join(ROOT, "docs", "prelaunch-2026-11", "ledger.json");
const CHECK = process.argv.includes("--check");

const NOTE = {
  refs: "Pre-launch pass, section 1 (docs/prelaunch-2026-11): a numbered cross-reference becomes a link that carries the heading's own words; no reader meets a document number.",
  tiers: "Pre-launch pass, section 3 (docs/prelaunch-2026-11): the inline tier tag leaves the prose; the source it names stays, and the tier stays in Evidence and sources and in the figure registry.",
};

/** One ledger entry for a rewrite at an offset in a content file. */
function entry(r, text, at) {
  const tab = path.basename(r.f, ".md");
  const w = where(text, at);
  const section = r.section ?? w.section;
  const fence = r.fence ?? w.fence;
  // A heading is not weighed (sections are keyed by number), nor is a lead, which repeats its
  // section's first sentence; only body copy and visual text are.
  const weighed = fence !== "lead" && !r.from.startsWith("```lead") && !/^#{2,6} /.test(r.from);
  const base = {
    file: tab,
    section,
    first12: r.from.replace(/\s+/g, " ").trim().split(" ").slice(0, 12).join(" "),
  };
  if (r.kind === "moved") {
    return { ...base, words: weighed ? words(r.from) - words(r.to) : 0, kind: "moved", to: r.dest, home: r.dest, note: r.note, text: r.from.trim() };
  }
  return { ...base, words: weighed ? words(r.from) - words(r.to) : 0, kind: "replaced", home: "", note: r.note ?? NOTE[r.auto] ?? "", text: r.from, replacement: r.to };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, "utf8")) : [];
  let applied = 0;
  let skipped = 0;
  const problems = [];

  // ---------------------------------------------------------------- the listed rewrites
  // What a rewrite's result reads as once the pass's later rewrites have run over it.
  const settled = (i) => REWRITES.slice(i + 1).reduce((t, q) => (q.from && t.includes(q.from) ? t.split(q.from).join(q.to) : t), afterTiers(REWRITES[i].to));
  for (const [i, r] of REWRITES.entries()) {
    const file = path.join(ROOT, r.f);
    let text = fs.readFileSync(file, "utf8");
    // Applied already: the result is there (an insertion keeps its anchor, so this is asked first),
    // or, for a deletion, the text is gone.
    if (r.to && r.to.includes(r.from) && text.includes(r.to)) { skipped++; continue; }
    const count = text.split(r.from).length - 1;
    if (count === 0) {
      // A later section of the pass may have rewritten this one's result again (section 3 takes the
      // tier tags out of text section 2 left): that counts as applied.
      if (!r.to || text.includes(r.to) || text.includes(settled(i))) { skipped++; continue; }
      problems.push(`${r.f}: not found: ${r.from.slice(0, 90)}`);
      continue;
    }
    if (count > 1 && !r.all) { problems.push(`${r.f}: ${count} matches, expected one: ${r.from.slice(0, 90)}`); continue; }
    if (CHECK) { problems.push(`${r.f}: not applied: ${r.from.slice(0, 90)}`); continue; }
    if (r.f.startsWith("content/") && !r.unlogged) {
      let at = -1;
      while ((at = text.indexOf(r.from, at + 1)) !== -1) ledger.push(entry(r, text, at));
    }
    text = text.split(r.from).join(r.to);
    fs.writeFileSync(file, text);
    applied++;
  }

  // ---------------------------------------------------------------- generated: section 1
  const { rewrites, unresolved } = refRewrites();
  for (const u of unresolved) problems.push(`${u.f}:${u.section}: a reference with no heading to name: ${u.raw}`);
  if (CHECK) {
    for (const r of rewrites) problems.push(`${r.f}:${r.section}: a numbered reference is left in reader text: ${r.from}`);
  } else {
    const byFile = new Map();
    for (const r of rewrites) byFile.set(r.f, [...(byFile.get(r.f) ?? []), r]);
    for (const [f, rs] of byFile) {
      const file = path.join(ROOT, f);
      let text = fs.readFileSync(file, "utf8");
      for (const r of rs) ledger.push(entry(r, text, r.at));
      // From the end, so every earlier offset still holds.
      for (const r of [...rs].sort((a, b) => b.at - a.at)) text = text.slice(0, r.at) + r.to + text.slice(r.at + r.from.length);
      fs.writeFileSync(file, text);
      applied += rs.length;
    }
  }

  // ---------------------------------------------------------------- generated: section 3
  const tiers = tierRewrites();
  if (CHECK) {
    for (const r of tiers.rewrites) problems.push(`${r.f}:${r.section}: a tier tag is left in the prose: ${r.from.trim()}`);
  } else {
    const byFile = new Map();
    for (const r of tiers.rewrites) byFile.set(r.f, [...(byFile.get(r.f) ?? []), r]);
    for (const [f, rs] of byFile) {
      const file = path.join(ROOT, f);
      let text = fs.readFileSync(file, "utf8");
      for (const r of rs) ledger.push(entry(r, text, r.at));
      for (const r of [...rs].sort((a, b) => b.at - a.at)) text = text.slice(0, r.at) + r.to + text.slice(r.at + r.from.length);
      fs.writeFileSync(file, text);
      applied += rs.length;
    }
  }

  if (!CHECK) {
    fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
    fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + "\n");
  }
  if (problems.length) {
    console.error(`prelaunch: ${problems.length} problem(s)\n${problems.map((m) => "  - " + m).join("\n")}`);
    process.exit(1);
  }
  console.log(`prelaunch: ${applied} applied, ${skipped} already in place, ${ledger.length} content changes in the ledger`);
}
