#!/usr/bin/env node
/**
 * The brief's copy gates (§S), enforced at build rather than by review:
 *
 *   Polling   no pollster, poll or survey used as evidence outside Annex C, and no promise of one.
 *   Money     no budget, spend, cost, fee or price language in the engagement sections. Section 2.5
 *             and 2.8 are exempt (the county's money), and so are the phrases below that name the
 *             county's money or a county policy instrument rather than the engagement's.
 *   Remote    no "remote" framing of how the work is done.
 *   ASCII     no text diagram in a code block, and no box-drawing characters, in any content file.
 *
 * Every allowed phrase is listed with its reason. A new use has to be argued into this file.
 *
 *     node --experimental-strip-types scripts/check-copy.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "content");

const POLL = /\b(poll|polls|polling|pollster|pollsters|survey|surveys|mizani|infotrak|tifa|ipsos|politrack)\b/gi;
/** Uses of the words that are not a poll used as evidence. */
const POLL_OK = [
  /polling (station|stations|agent|agents|day|stream)/gi, // election-day infrastructure
  /opinion[- ]poll (mechanism|rather than|, not a delegates|not a delegates)/gi, // the party's nomination method (Section 2.3)
  /by (countywide )?opinion poll/gi, // likewise: how the ticket is decided
  /opinion[- ]poll mechanism/gi,
  /departs from the opinion-poll/gi,
  /decided by delegates, not an opinion poll|The poll mechanism is Tier 3/gi, // risk R1
  /the pollster's terms of reference|commissioned pollster's terms of reference|nomination-poll terms/gi, // the party's instrument, which the campaign asks to see
  /a party (poll|nomination)/gi,
  /(Household|Housing|Demographic and Health) Survey/gi, // KNBS/CA survey names as sources
  /no survey|no polling|commissions no (polling|survey)|none is commissioned from a pollster|not a poll|never solicited as a survey|without a survey|None of the three is a poll or a survey|no poll share|not on poll shares|none is closed by new polling|commissions no survey|with no polling and no survey|None is a poll share|waits on a survey|not poll shares|nomination KPI rests on a poll/gi, // stating the absence
  /published polls? (log|round)/gi, // monitoring, logged for Annex C
  /Annex C/g,
  /published polling, public records/gi, // the public sources competitor monitoring may read
  /not from a survey|rather than against a poll|No new polling|published opinion polls report countywide aggregates/gi, // stating what the evidence is not
  /nomination-poll|via a countywide opinion poll|use polling rather than delegates|opinion poll in the final quarter|method, pollster, timing/gi, // the party's nomination method
  /polling-station|polling information/gi, // election-day infrastructure
];

const ENGAGEMENT = new Set([
  "cover.md", "objectives.md", "strategy.md", "implementation.md", "workstreams-platforms.md",
  "workstreams-media.md", "workstreams-ground.md", "workstreams-data.md", "delivery.md", "nextsteps.md",
]);
const MONEY = /\b(budget|budgets|spend|spending|spent|cost|costs|costed|costing|fee|fees|price|prices|pricing|fundrais\w*|donor|donors|donation|donations)\b/gi;
/** County money and county policy instruments, not the engagement's money. */
const MONEY_OK = [
  /Budget (and|&) Appropriations/gi, // his parliamentary committee
  /Budget Committee/gi,
  /Controller of Budget/gi, // an office of state
  /county('s)? budgets?|budget (execution|matters|priorities|documents|pledge|explorer)|county budget|Budget & Appropriations/gi, // the county's own budget as content
  /budget oversight|budgeting influence|budget wins|annual budget|translate this budget/gi, // his record, and the county envelope
  /(floor|farm-gate|ndengu|mango) prices?|price floor|floor price/gi, // a county agricultural policy
  /market fees|fee waivers|school fees/gi, // county charges and household costs as issues
  /costs? the voter|contract values/gi,
  /Ndengu price/gi,
  /National Budget Seat/gi, // his committee seat
  /household spending|a household spending|county spending|funeral costs|throwaway prices|floor-price|borehole location, cost|prove it was spent/gi, // household and county money as issues, not the engagement's
];

const REMOTE = /\bremote(ly)?\s+(team|work|working|engagement|delivery|management|operation|agency|basis|support)\b/gi;
const BOX = /[─-╿]/;

const errors: string[] = [];
const residue = (line: string, allow: RegExp[]) => allow.reduce((l, re) => l.replace(re, " "), line);

for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).sort()) {
  const lines = fs.readFileSync(path.join(SRC, file), "utf8").split("\n");
  let fence: string | null = null;
  lines.forEach((raw, i) => {
    const at = `content/${file}:${i + 1}`;
    // A figure token's name is an address, not prose: "{{register.polling-stations}}" is a number.
    const line = raw.replace(/\{\{[^}]*\}\}/g, "#");
    const opener = /^\s*```(\S*)/.exec(line);
    if (opener) {
      if (fence === null) {
        fence = opener[1];
        if (fence !== "figure") errors.push(`${at}: code block "${fence || "plain"}" — ASCII diagrams become figures (brief §D.4)`);
      } else fence = null;
      return;
    }
    if (fence === "figure") return;
    if (BOX.test(line)) errors.push(`${at}: box-drawing characters — an ASCII diagram`);
    if (file !== "annex-polls.md") {
      const left = residue(line, POLL_OK);
      for (const m of left.matchAll(POLL)) errors.push(`${at}: "${m[0]}" outside Annex C — ${line.trim().slice(0, 90)}`);
    }
    if (ENGAGEMENT.has(file)) {
      const left = residue(line, MONEY_OK);
      for (const m of left.matchAll(MONEY)) errors.push(`${at}: "${m[0]}" in an engagement section — ${line.trim().slice(0, 90)}`);
    }
    for (const m of line.matchAll(REMOTE)) errors.push(`${at}: "${m[0]}" — remote framing`);
  });
}

if (errors.length) {
  console.error(`check-copy: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("check-copy: no poll evidence outside Annex C, no engagement money, no remote framing, no ASCII");
