#!/usr/bin/env node
/**
 * The rivals pass (November 2026): Dr. Mulu's 2027 rivals are no longer named, profiled, compared or
 * monitored anywhere on the site, and the attack-response material (the race chapter, Risks and
 * response, the runbooks, the rapid-response desk) is removed. Firefly's decision, recorded in
 * docs/rivals-2026-11/DECISION.md. Results of past elections stay, with the candidates' names.
 *
 * This script writes docs/rivals-2026-11/ledger.json: one entry per section the pass changed, in the
 * format check:content reads, with the words removed and the removed text itself, so every content
 * guard can account for what left. Base: the commit the pass started from.
 *
 *     node scripts/rivals-2026-11/build-ledger.mjs           write the ledger
 *     node scripts/rivals-2026-11/build-ledger.mjs --check   fail if it would change
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT, sectionsOf, conservedWords, partsOf } from "../declutter/sections.mjs";

export const RIVALS_BASE = "d034eb1";
const OUT = path.join(ROOT, "docs", "rivals-2026-11", "ledger.json");
const FENCES_OUT = path.join(ROOT, "docs", "rivals-2026-11", "fences.json");
const NOTE = "Rivals pass (November 2026): no 2027 rival is named, profiled, compared or monitored, and the attack-response material is removed, by Firefly's decision (docs/rivals-2026-11/DECISION.md). Past election results stay.";
const CHECK = process.argv.includes("--check");

const git = (args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
const baseNames = git(["ls-tree", "--name-only", RIVALS_BASE, "content/"]).split("\n").filter((f) => f.endsWith(".md")).map((f) => path.basename(f, ".md"));
const nowPath = (n) => path.join(ROOT, "content", `${n}.md`);

/**
 * Figure and text-version fences may not change (check:content, check 3). The pass changed some:
 * a fence removed with its section is listed under `removed`; a text-version fence the pass edited
 * (a rival's name or an attack-response line taken out of it) is listed under `edits` as the old
 * body and the new one, applied to the base before it is weighed, exactly like a settled dispute's
 * fence edit (docs/disputes-resolved.json). Nothing else in a fence can change and pass.
 */
const fenceBodies = (lines) => partsOf(lines).fences.filter((f) => f.kind === "figure" || f.kind === "textversion").map((f) => f.body);
function fenceChanges(linesB, linesA) {
  const b = fenceBodies(linesB);
  const a = fenceBodies(linesA);
  const restB = b.filter((x) => !a.includes(x));
  const restA = a.filter((x) => !b.includes(x));
  const edits = restB.slice(0, restA.length).map((from, i) => ({ from, to: restA[i] }));
  return { edits, removed: restB.slice(restA.length) };
}

const entries = [];
const fenceEdits = [];
const fenceRemoved = [];
for (const name of baseNames) {
  const raw = git(["show", `${RIVALS_BASE}:content/${name}.md`]);
  const after = fs.existsSync(nowPath(name)) ? fs.readFileSync(nowPath(name), "utf8") : null;
  if (after === raw) continue;
  // Fence edits first, so the words below are weighed on the same settled base check:content uses.
  const fc = fenceChanges(raw.split("\n"), after === null ? [] : after.split("\n"));
  fenceEdits.push(...fc.edits);
  fenceRemoved.push(...fc.removed);
  let before = raw;
  for (const e of fc.edits) before = before.split(e.from).join(e.to);
  const secsB = sectionsOf(name, before);
  const secsA = after === null ? [] : sectionsOf(name, after);
  const byKey = Object.fromEntries(secsA.map((s) => [s.key, s]));
  for (const s of secsB) {
    const a = byKey[s.key];
    const textB = s.lines.join("\n");
    if (a && a.lines.join("\n") === textB) continue;
    const wb = conservedWords(s.lines);
    const wa = a ? conservedWords(a.lines, textB).total : 0;
    const kept = new Set(a ? a.lines : []);
    const removed = a ? s.lines.filter((l) => l.trim() && !kept.has(l)) : s.lines;
    const added = a ? a.lines.filter((l) => l.trim() && !new Set(s.lines).has(l)) : [];
    const text = (a ? removed : [`## ${s.number} ${s.title}`.trim(), ...s.lines]).join("\n").trim();
    entries.push({
      file: name,
      section: s.number,
      first12: text.replace(/\s+/g, " ").split(" ").slice(0, 12).join(" "),
      words: wb - wa,
      kind: "removed",
      whole: !a,
      note: NOTE,
      text,
      ...(added.length ? { replacement: added.join("\n") } : {}),
      at: 0,
    });
  }
}
const out = JSON.stringify(entries, null, 1) + "\n";
const fencesOut = JSON.stringify({ edits: fenceEdits, removed: fenceRemoved }, null, 1) + "\n";
if (CHECK) {
  const stale = (f, t) => !fs.existsSync(f) || fs.readFileSync(f, "utf8") !== t;
  if (stale(OUT, out) || stale(FENCES_OUT, fencesOut)) {
    console.error("rivals ledger: docs/rivals-2026-11/ledger.json or fences.json is stale. Run: node scripts/rivals-2026-11/build-ledger.mjs");
    process.exit(1);
  }
  console.log(`rivals ledger: ${entries.length} sections, current`);
} else {
  fs.writeFileSync(OUT, out);
  fs.writeFileSync(FENCES_OUT, fencesOut);
  console.log(`rivals ledger: ${entries.length} sections, ${entries.reduce((n, e) => n + e.words, 0)} words removed net`);
}
