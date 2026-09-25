#!/usr/bin/env node
/**
 * The brief's copy gates (§S), enforced at build rather than by review:
 *
 *   Polling   no poll, pollster, survey or focus group anywhere: not as evidence, not "for
 *             reference only", not as a promise, not as the thing a measure is "not". Firefly works
 *             from existing records and its own analysis only (the September 2026 audit). Checked
 *             in content and in the copy that components, figure specs and data modules carry.
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

const POLL = /\b(poll|polls|polled|polling|pollster|pollsters|survey|surveys|mizani|infotrak|tifa|ipsos|politrack|(?<!fx-)focus[- ]groups?|message lab)\b/gi;
/** The only uses of these words that are not opinion research. Each is listed with its reason. */
const POLL_OK = [
  /polling[- ](station|stations|agent|agents|day|stream|streams|information|centre|centres|clerk|clerks)/gi, // election-day infrastructure, as the Elections Act names it
  /polling_station/g, // the IEBC register's field name
  /(Household|Housing|Demographic and Health|Integrated Household Budget|Labour Force) Survey/gi, // KNBS statistical instruments, cited as official sources
  /Survey of Kenya/g, // the national mapping agency
  /https?:\/\/\S+/g, // a source's URL is an address, not copy
  /Polls (open|close)/g, // election-day voter information: when voting opens and closes
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
        // One allowance, with its reason: a ```textversion fence is not a code block but prose a
        // figure has taken over (premium brief §12), kept word for word under the figure. Its
        // lines are still scanned below by every rule here, exactly as they were before they moved.
        if (fence !== "figure" && fence !== "textversion") errors.push(`${at}: code block "${fence || "plain"}" — ASCII diagrams become figures (brief §D.4)`);
      } else fence = null;
      return;
    }
    if (fence === "figure") return;
    if (BOX.test(line)) errors.push(`${at}: box-drawing characters — an ASCII diagram`);
    {
      const left = residue(line, POLL_OK);
      for (const m of left.matchAll(POLL)) errors.push(`${at}: "${m[0]}" — opinion research has no place in the proposal — ${line.trim().slice(0, 90)}`);
    }
    if (ENGAGEMENT.has(file)) {
      const left = residue(line, MONEY_OK);
      for (const m of left.matchAll(MONEY)) errors.push(`${at}: "${m[0]}" in an engagement section — ${line.trim().slice(0, 90)}`);
    }
    for (const m of line.matchAll(REMOTE)) errors.push(`${at}: "${m[0]}" — remote framing`);
  });
}

/**
 * The same money rule, over the copy components and data modules carry (O-4, approved 24 September
 * 2026). The markdown gate above could not see a hosting price in ReachSplit, a per-send cost in the
 * feature-phone panel or a cost-per-contact row in the benchmark ladder, and all three reached the
 * page. Component files are full of the county's own money (the budget, the audit), so this scan is
 * narrower than MONEY: a line fails when it prices something in shillings AND names a unit of the
 * engagement's own spending — per month, per message, per send, per contact, cost per, hosting.
 * Comments are skipped: a line that explains the rule is not the rule being broken.
 */
const ENGAGEMENT_PRICE = /\bKSh\s*[\d~≤.,$]|KSh\$\{/i;
const ENGAGEMENT_UNIT = /\b(per month|a month|per message|a message|per send|one send|send ?cost|sendCost|per contact|consented contact|cost per|costs? KSh|hosting|per persuaded)\b/i;
const isComment = (t: string) => t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("{/*");
function walk(dir: string, out: string[] = []): string[] {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|json)$/.test(f) && !f.endsWith(".generated.json")) out.push(p);
  }
  return out;
}
for (const file of [...walk(path.join(ROOT, "components")), ...walk(path.join(ROOT, "data"))]) {
  const rel = path.relative(ROOT, file);
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((raw, i) => {
    const t = raw.trim();
    if (isComment(t) || !ENGAGEMENT_PRICE.test(raw)) return;
    // A price and its unit are often a few lines apart (a label above, a unit below, a row's
    // metric three fields up), so the unit is looked for in a small window, comments excluded.
    const window = lines.slice(Math.max(0, i - 4), i + 3).filter((l) => !isComment(l.trim())).join(" ");
    if (ENGAGEMENT_UNIT.test(window)) {
      errors.push(`${rel}:${i + 1}: an engagement price in component or data copy — ${t.slice(0, 90)}`);
    }
  });
}

/**
 * The polling rule, over the copy that components, figure specs and data modules render. Comments
 * are skipped for the same reason as above; so are test files, which assert arithmetic rather than
 * render copy.
 */
const COPY_ROOTS = ["components", "data", "lib", "app", "hooks"];
for (const file of COPY_ROOTS.flatMap((d) => walk(path.join(ROOT, d)))) {
  // Tests assert arithmetic, and lib/anchors holds retired heading ids (addresses, not copy).
  if (/\.test\.tsx?$/.test(file) || file.includes(`${path.sep}anchors${path.sep}`)) continue;
  const rel = path.relative(ROOT, file);
  fs.readFileSync(file, "utf8").split("\n").forEach((raw, i) => {
    const t = raw.trim();
    if (isComment(t)) return;
    const code = raw.replace(/\s\/\/ .*$/, "");
    const left = residue(code, POLL_OK);
    for (const m of left.matchAll(POLL)) errors.push(`${rel}:${i + 1}: "${m[0]}" in rendered copy — ${t.slice(0, 90)}`);
  });
}

if (errors.length) {
  console.error(`check-copy: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("check-copy: no poll, survey or focus group anywhere, no engagement money (content, components or data), no remote framing, no ASCII");
