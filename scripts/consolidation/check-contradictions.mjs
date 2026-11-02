#!/usr/bin/env node
/**
 * Counted phrases and windows must match their data (consolidation pass, Step 6).
 *
 * The seven contradictions this pass resolved were all one kind: a count or a window typed into
 * prose or a figure title, drifting from the list it described ("four pillars" over three, "four
 * phases" over five, "these five indicators" with nine on the page). This check reads each count
 * from its data source and fails if any counted phrase in content/ or in a figure's source states a
 * number the data does not allow.
 *
 * A phrase may state the whole list or a named part of it (the three general-election phases among
 * the five; the four workstreams in a group among the fourteen), and every allowed number is
 * computed from the data, never typed here.
 *
 *     node --no-warnings --experimental-strip-types scripts/consolidation/check-contradictions.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PHASES, NOMINATION_WINDOW } from "../../lib/phases.ts";
import { PILLARS, CONTENT_TYPES } from "../../data/message-architecture.ts";
import { SEGMENTS } from "../../data/segments.ts";
import { RISKS } from "../../data/risks.ts";
import { SEVERITY_TIERS } from "../../data/escalation.ts";
import { NOMINATION_KPIS, GENERAL_ELECTION_KPIS, RECOGNITION_INDICATORS } from "../../data/kpis.ts";
import { USSD_MENU } from "../../data/ussd-specimen.ts";
import { WS } from "../../lib/register/specs/s5-implementation.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"];
// A count word, or a bare number that is not part of a heading number ("20.1 Risks").
const NUM = `(?<![\\d.])(${WORDS.join("|")}|\\d+)`;
const toNumber = (w) => (/^\d+$/.test(w) ? Number(w) : WORDS.indexOf(w.toLowerCase()));

const groupSizes = [[1, 4], [5, 6], [7, 10], [11, 14]].map(([a, b]) => WS.filter((w) => w.n >= a && w.n <= b).length);
const RULES = [
  { what: "phases", re: new RegExp(`\\b${NUM} phases\\b`, "gi"), allowed: [PHASES.length, PHASES.filter((p) => p.dates).length, PHASES.filter((p) => p.weeks).length], source: "lib/phases.ts" },
  { what: "pillars", re: new RegExp(`\\b${NUM} pillars\\b`, "gi"), allowed: [PILLARS.length], source: "data/message-architecture.ts" },
  { what: "content types", re: new RegExp(`\\b${NUM} content types\\b`, "gi"), allowed: [CONTENT_TYPES.length], source: "data/message-architecture.ts" },
  { what: "segments", re: new RegExp(`\\b${NUM} segments\\b`, "gi"), allowed: [SEGMENTS.length, SEGMENTS.filter((s) => s.size).length, SEGMENTS.filter((s) => !s.size).length], source: "data/segments.ts" },
  { what: "risks", re: new RegExp(`\\b${NUM} risks\\b`, "gi"), allowed: [RISKS.length, 2], source: "data/risks.ts (and the two that change the plan, R1 and R2)" },
  { what: "severity tiers", re: new RegExp(`\\b${NUM}(?: severity tiers|-tier response)\\b`, "gi"), allowed: [SEVERITY_TIERS.length], source: "data/escalation.ts" },
  { what: "indicators", re: new RegExp(`\\b${NUM} (?:recognition |scorecard )?indicators\\b`, "gi"), allowed: [NOMINATION_KPIS.length, GENERAL_ELECTION_KPIS.length, NOMINATION_KPIS.length + GENERAL_ELECTION_KPIS.length, RECOGNITION_INDICATORS.length, 3], source: "data/kpis.ts (and the three that climb every phase)" },
  { what: "workstreams", re: new RegExp(`\\b${NUM} workstreams\\b`, "gi"), allowed: [WS.length, ...groupSizes, WS.filter((w) => w.owner === "outside").length], source: "lib/register/specs/s5-implementation.ts WS" },
  { what: "USSD options", re: new RegExp(`\\b${NUM} (?:USSD |menu )?options(?= on any phone| in the menu|, and the third)`, "gi"), allowed: [USSD_MENU.length], source: "data/ussd-specimen.ts" },
];

/** The nomination window, stated any other way next to the nomination, is a second version of it. */
const WINDOW = /\b(?:early|mid|late)[- ](?:August|September|October|November|December)(?: to | ?– ?)(?:September|October|November|December|January)(?: 2026)?\b/gi;
const windowOk = (s) => s.toLowerCase().replace(/\s*–\s*/, " to ").startsWith(NOMINATION_WINDOW.whenText.toLowerCase().replace(/ 2026$/, ""));

const files = [
  ...fs.readdirSync(path.join(ROOT, "content")).filter((f) => f.endsWith(".md")).map((f) => `content/${f}`),
  ...fs.readdirSync(path.join(ROOT, "lib", "register", "specs")).filter((f) => f.endsWith(".ts")).map((f) => `lib/register/specs/${f}`),
  ...fs.readdirSync(path.join(ROOT, "lib", "figures")).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts")).map((f) => `lib/figures/${f}`),
];

const errors = [];
let checked = 0;
for (const file of files) {
  // Code comments describe history and are not shown to readers; generated tables are not prose.
  let text = fs.readFileSync(path.join(ROOT, file), "utf8");
  text = file.endsWith(".md")
    ? text.replace(/<!--[\s\S]*?-->/g, "").replace(/<!-- source-table:start[\s\S]*?source-table:end -->/g, "")
    : text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      for (const m of line.matchAll(rule.re)) {
        checked += 1;
        const n = toNumber(m[1]);
        // Earlier drafts' groupings are history the prose states as such ("the four campaign pillars of earlier drafts").
        if (/earlier|previous|retired|folded/i.test(line.slice(Math.max(0, (m.index ?? 0) - 80), (m.index ?? 0) + 80))) continue;
        if (!rule.allowed.includes(n)) errors.push(`${file}:${i + 1}: "${m[0]}" — the data has ${[...new Set(rule.allowed)].join(" or ")} ${rule.what} (${rule.source})`);
      }
    }
    for (const m of line.matchAll(WINDOW)) {
      checked += 1;
      if (!/nominat|Wiper|window|decision/i.test(line)) continue;
      if (!windowOk(m[0])) errors.push(`${file}:${i + 1}: "${m[0]}" — the nomination window is "${NOMINATION_WINDOW.whenText}" (lib/phases.ts)`);
    }
  });
}

if (errors.length) {
  console.error(`check-contradictions: ${errors.length} counted phrase(s) or window(s) disagree with their data:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`check-contradictions: ${checked} counted phrases and windows in ${files.length} files agree with their data`);
