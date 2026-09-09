#!/usr/bin/env node
/**
 * Build guard: the restructure moved body text, it did not rewrite it.
 *
 * The current five-part content spine is the canonical document structure. The one thing that
 * must not happen after that migration is a quiet edit to the prose — so rather than asserting
 * that, this proves it by comparing the body of the document today against the migration snapshot.
 *
 * Method: take every non-heading, non-blank line from both sides and compare them as multisets.
 * Headings are excluded because renaming them is the point of the restructure. Three further
 * allowances, each narrow and each a thing the brief explicitly permitted:
 *
 *   1. Sections 34, 35, 37, 38 and 39 were deleted, so the old side drops them.
 *   2. Nine orientation lines were added, one per content section, so the new side drops them.
 *   3. Cross-references were repointed to the new numbering, which is the only permitted body
 *      edit — so a "Section 4.3.2" token is normalised away on both sides before comparing.
 *
 * Anything else that differs is a content change, and this script fails the build for it.
 *
 * Run as part of `npm run verify` and on `prebuild`.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "public", "content");
/** The commit immediately before the restructure — the state this checks against. */
const BASE = process.env.CONTENT_BASELINE ?? "d1c1559";
const CURRENT_SPINE = BASE === "d1c1559";
const OLD_FILES = [
  "1-decision.md",
  "2-evidence.md",
  "3-strategy.md",
  "4a-publishing.md",
  "4b-ground.md",
  "4c-defence.md",
  "4d-technology.md",
  "4e-team.md",
  "5-delivery.md",
];
const DELETED_SECTIONS = new Set(["34", "35", "37", "38", "39"]);

/** The nine section-landing orientation lines, quoted in full so they can be audited here. */
const ORIENTATION_LINES = new Set([
  "Four readings of the ground: how the nomination will be decided, who the candidate is running against, the ward arithmetic, and the county’s three regions.",
  "The claim at the centre of this campaign, the pillars and themes beneath it, the segments it is aimed at, and how the message is built, framed and produced.",
  "The channel architecture and the platforms it runs on, paid and earned media, the radio landscape, and the languages and access requirements every asset has to meet.",
  "How field reporting and digital response feed each other, the SMS and USSD layer that reaches voters off the internet, and the volunteer and coalition programmes behind it.",
  "Rapid response, the war room that runs it, the cybersecurity and manipulated-media protocols behind it, and how rivals are monitored from public sources.",
  "The data model and its provenance rules, the voter model built on it, the technology stack, the analytics layer, and the ethics, privacy and statutory obligations governing all of it.",
  "The scope Firefly would run, the team structure that runs it, and the leadership roles and governance rhythm around it.",
  "What the campaign measures and why, the two scorecards, the phased plan, and the research and tracker programmes that feed them.",
  "What the campaign gets, the budget tiers and the economics behind them, and how Firefly and the campaign would work together.",
]);

/**
 * The five-part spine, layered on top of the earlier ten-file split.
 *
 * The document was restructured a second time, onto a five-part logical spine, which added its
 * own landing lines — one per part, the same category as ORIENTATION_LINES above and allowed on
 * the same grounds: they orient a reader arriving at a part, and they replace nothing.
 */
const SPINE_ORIENTATION_LINES = new Set([
  "The ground as it is: how the nomination will be decided, the candidate and the county, the ward arithmetic that sets the winning number, what digital reach can and cannot deliver against it, who the voters are, who controls the radio, and the law all of it runs inside.",
  "The claim at the centre of this campaign, the pillars, themes and segments beneath it, how the message is built and framed, and the limits the campaign puts on itself.",
  "What the campaign produces and where it goes: the content pipeline, paid media, the radio bypass, journalists and debates, and the three languages every asset has to work in.",
  "The data model, the voter model built on it, the technology stack, and the analytics layer that measures all of it.",
  "The team that runs the engagement, how it is structured, and the leadership roles and governance rhythm around it.",
  "The twelve-month plan phase by phase, what is measured and how performance is governed, the message lab that tests it, and why the operation runs remotely.",
]);

/**
 * Body text added since the restructure, quoted in full so each addition is auditable here.
 *
 * Reordering the decision layer brought two preference figures onto the same screen for the
 * first time — a countywide share and a primary-voter share, measuring different populations.
 * Neither figure changed; this line names the two universes so the pair cannot be misread as
 * one number revised. It reports no new quantity of its own.
 */
const SPINE_ADDITIONS = new Set([
  "Two preference figures appear in this proposal, and they measure different populations rather than revising one another. §#'s **40.0%+** is a share of the **countywide public**, as reported in the party-commissioned surveys. NW-01 below is **\u2265 55.0%** of **sampled likely Wiper primary voters** — a narrower universe, which is why the threshold sits higher. §# states that same primary-voter threshold.",
]);

/**
 * The one lead paragraph the second restructure rewrote rather than moved.
 *
 * Promoting the provenance method into the evidence part left §6.1's lead describing two things
 * that were no longer in it. The rewrite drops those clauses and points to where they went; the
 * standard and the protocol themselves moved verbatim and are checked as part of that move.
 */
const SPINE_REWRITE_PAIRS = [
  {
    before:
      "This section defines the voter and supporter data model, the three-tier empirical provenance standard, protocols for handling disputed electoral figures, and legal compliance workflows under Kenya's **Data Protection Act (DPA) 2019** and the **Office of the Data Protection Commissioner (ODPC)**.",
    after:
      "This section defines the voter and supporter data model and the legal compliance workflows under Kenya's **Data Protection Act (DPA) 2019** and the **Office of the Data Protection Commissioner (ODPC)**. The three-tier provenance standard that grades every figure in this proposal (Section 6.1.2) and the protocol for when two sources disagree (Section 6.1.4) are set out alongside the evidence they govern.",
  },
];

/**
 * Strip section-number tokens, so a repointed cross-reference reads the same on both sides.
 *
 * Applied to the whole document rather than line by line, because the markdown hard-wraps at
 * about 80 columns and a reference can straddle the break ("Section\n4.3") — matching per line
 * would miss exactly those and report them as content changes.
 */
function normaliseRefs(text) {
  // Collapse every reference form to one token, so "Subsection 19A" and "Section 8.2.1"
  // compare equal, and flatten padding runs, which are cosmetic inside the ASCII boxes.
  return text
    .replace(/(?:Sub)?sections?\s*\d+[A-Za-z]?(?:\.\d+)*/gi, "§#")
    .replace(/Sec\s*\d+(?:\.\d+)*/gi, "§#")
    .replace(/§\s*\d+[A-Za-z]?(?:\.\d+)*/g, "§#")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+$/gm, "");
}

/**
 * Placeholders the client has since filled in, quoted old and new so the change is auditable
 * here rather than silently tolerated. These are the only body-text edits since the
 * restructure, and each was supplied by Firefly directly — the proposal's own status line
 * always said it carried marked placeholders awaiting exactly this.
 */
const FILLED_PLACEHOLDERS = [
  {
    before: "`[Insert contact email]` · `[Insert phone]` · `[Insert website/portfolio URL]`",
    after: "6th Floor, Next Gen Mall, Mombasa Road, Nairobi\nfireflymanagement.ke@gmail.com · 0726 766 800",
  },
  {
    before: "> to delete it, at any time, at `[Insert contact route]`. We will respond",
    after: "> to delete it, at any time, at fireflymanagement.ke@gmail.com. We will respond",
  },
  {
    // Added to the front matter. Anchored on the line that follows it, because the same
    // consultancy line also appears in the close and only the front-matter one gains an address.
    before: "Strategic Communications & Digital Campaign Consultancy\n\n**Date:** August 2026",
    after:
      "Strategic Communications & Digital Campaign Consultancy\n" +
      "6th Floor, Next Gen Mall, Mombasa Road, Nairobi\n" +
      "fireflymanagement.ke@gmail.com · 0726 766 800\n\n**Date:** August 2026",
  },
];

/**
 * Corrections applied by the September 2026 pre-send audit, quoted old and new so each is
 * auditable here rather than silently tolerated. Every one is a figure the document itself
 * refutes elsewhere — the ward register, a table's own cumulative column, or a Tier 1 figure
 * in Section 1 — or a label pointing at a section that no longer exists.
 */
const AUDIT_CORRECTIONS = [
  // Contradicted 1.3.1 and data/ward-register.json, whose 40 wards sum to 532,758 before prisons.
  {
    before: "**532,758** (comprising **532,753** ward-registered voters and **5** prison-registered voters) (Tier 1)",
    after: "**532,758** ward-registered voters (plus **75** prison-registered voters, totalling **532,833**) (Tier 1)",
  },
  // The ranking table's own cumulative column gives 532,758 - 436,343 = 96,415 (18.10%).
  {
    before: "aggregate to **92,415 registered voters** (only **17.35%**",
    after: "aggregate to **96,415 registered voters** (only **18.10%**",
  },
  // The body text's own sub-totals (52,269 + 31,227) give 83,496; Ikanga/Kyatune ranks 11th.
  { before: "(83,596 Voters)", after: "(83,496 Voters)" },
  // "17A" and "16.5" named sections that no longer exist; the first had no successor label.
  { before: "THE 17A GATEKEEPER BYPASS", after: "THE GATEKEEPER BYPASS" },
  { before: "and 16.5 for the\nregulatory basis", after: "and 6.5 for the\nregulatory basis" },
  { before: "5 of the Top 8 Wards", after: "5 of the Top 11 Wards" },
  // Section 1.2.3 gives 1,578 polling stations (Tier 1). Streams cannot be fewer than stations.
  { before: "**1,527** \u2502 IEBC official", after: "**1,578** \u2502 IEBC official" },
  { before: "(100% of 1,527 Polling Streams)", after: "(100% of 1,578 Stations)      " },
  { before: "across all 1,527 polling streams.", after: "across all 1,578 polling stations." },
  // Voice of Hope appears in no ownership map and is dropped from 3.4.3's own list two boxes later.
  {
    before: "(Syokimau, Mang'elete, Voice of Hope, Wikwatyo)",
    after: "(Wikwatyo, Mang'elete, County FM)             ",
  },
  // The slogan appeared in two forms ~15 lines apart; 2.6.1's is the one the Kikamba and
  // Swahili renderings beneath it are built on.
  {
    before: "Clean Leadership, Fiscal Discipline, and Shared Wealth\"",
    after: "Clean Hands, Real Jobs, and Lasting Wealth\"    ",
  },
  // The document's only US-format date.
  { before: "August 29, 2026 to 15 November 2026", after: "29 August 2026 to 15 November 2026" },
];

/**
 * Editorial scaffolding addressed to a previous reviewer ("New section.", "New.", "(new
 * segment)") and the takeaway banners' short closing rules, both removed by the same audit.
 */
/**
 * Loaded from scripts/audit-rewrites.json, which holds the exact before/after text of every
 * Stage B-D rewrite so the check stays verbatim rather than being loosened to accommodate them.
 * Stage B-D of the same audit: the fabricated baselines removed, the second radio ownership
 * table dropped in favour of Section 3.5.1, the Mwingi bloc restated against turnout, and the
 * budget tiers costed against the ceiling Section 9.2.1 already verifies. These are rewrites
 * rather than one-for-one swaps, so they are counted here and reviewed in the diff, not
 * matched line by line.
 */
const AUDIT_REWRITES = [
  "9.1.1 Commitments 1-2: removed the 12.0% Mwingi and 18.5% female-18-45 baselines, and the targets and triggers keyed to them. Section 1.3.6 records that the published Mizani rounds carry countywide aggregates only.",
  "8.1.1 NW-01..NW-04: replaced four unsourced baselines (38.5%, 42.0%, 31.0%, 3/8 branches) with the Week 1 instrument. NW-02's 42.0% contradicted 9.1.1's 12.0% for the same quantity.",
  "3.4.1: removed the second station ownership table, which contradicted Section 3.5.1 and data/media-ownership.ts on Musyi, Syokimau, Mbaitu, Athiani and Wikwatyo, and on three frequencies.",
  "3.1.2, 3.1.3, 3.3.1, 3.3.2, 3.4.3: repointed radio placement from Mbaitu/Sang'u/Syokimau to Musyi, County FM and Wikwatyo, per the 3.5.1 posture column.",
  "1.2.3, 1.3.3, 1.3.6: restated the Mwingi bloc against the 62% turnout baseline (200,198 registered is ~124,100 ballots), matching the treatment Path D already applied.",
  "9.2.5: costed the three tiers against the verified KSh97.56m ceiling instead of leaving [Insert] placeholders.",
];

/**
 * Lines the audit *added* rather than changed — the segment-overlap note, the budget
 * divergence table, the coverage note, the two open questions for counsel. They have no
 * pre-restructure counterpart, so they are subtracted from the current side the same way the
 * nine orientation lines are, and listed in scripts/audit-additions.json to stay auditable.
 */
const AUDIT_ADDITIONS = JSON.parse(
  fs.readFileSync(new URL("./audit-additions.json", import.meta.url), "utf8"),
);

const AUDIT_REWRITE_PAIRS = JSON.parse(
  fs.readFileSync(new URL("./audit-rewrites.json", import.meta.url), "utf8"),
);

const AUDIT_PREFIXES = [
  ["*New section. ", "*"],
  ["*New. ", "*"],
  [" *(new segment)*", ""],
];

/**
 * The two pointers into the deleted §39.1, removed by cutting a self-contained appositive so
 * each sentence closes on words already present. Quoted here in full so the one category of
 * permitted deletion inside a sentence is auditable rather than implicit.
 */
const REMOVED_POINTERS = [
  " (a verified dispute detailed in §#)",
  ", a discrepancy detailed in §#",
];

/**
 * The deleted registers' own scaffolding: the opening rule of registers.md and the raw wrapper
 * that spanned §34–§38. Counted rather than matched by value, because "---" is also an ordinary
 * horizontal rule used 133 times elsewhere in the document and those all survive.
 */
const REMOVED_SCAFFOLDING = new Map([
  ["---", 1],
  ['<section id="firefly-audit-implementation" class="audit-section">', 1],
]);

/** Every body line of a document: headings dropped, blanks dropped, fenced blocks kept whole. */
function bodyLines(text, { dropDeletedSections = false } = {}) {
  const out = [];
  let inFence = false;
  let skipping = false;
  for (const line of text.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      if (!skipping) out.push(line.trim());
      continue;
    }
    if (!inFence) {
      const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
      if (heading) {
        if (dropDeletedSections && heading[1].length === 2) {
          const number = /^(\d+)/.exec(heading[2].replace(/\*/g, ""));
          if (number) skipping = DELETED_SECTIONS.has(number[1]);
        }
        continue;
      }
    }
    // Structural markers carrying no body text — a bare ">" blockquote continuation and a
    // markdown table separator row — are ignored like blank lines rather than counted as
    // content that moved. (ASCII box rules use ├─┼─┤ and are not matched here.)
    const bare = line.trim();
    if (skipping || bare === "" || bare === ">" || /^\|[\s|:-]+\|$/.test(bare)) continue;
    out.push(line.replace(/\r$/, ""));
  }
  return out;
}

function tally(lines) {
  const counts = new Map();
  for (const line of lines) counts.set(line, (counts.get(line) ?? 0) + 1);
  return counts;
}

function difference(a, b) {
  const out = [];
  for (const [line, count] of a) {
    const extra = count - (b.get(line) ?? 0);
    if (extra > 0) out.push([line, extra]);
  }
  return out;
}

let before = [];
for (const file of OLD_FILES) {
  let text;
  try {
    text = execSync(`git show ${BASE}:public/content/${file}`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch {
    console.error(`Content integrity check SKIPPED — cannot read ${file} at ${BASE}.`);
    console.error("This needs the pre-restructure commit in history; set CONTENT_BASELINE to override.");
    process.exit(0);
  }
  let raw = text;
  if (!CURRENT_SPINE) {
    for (const { before, after } of FILLED_PLACEHOLDERS) raw = raw.split(before).join(after);
    for (const { before, after } of AUDIT_CORRECTIONS) raw = raw.split(before).join(after);
    for (const [before, after] of AUDIT_PREFIXES) raw = raw.split(before).join(after);
    raw = raw.replace(/^\u2550{50,83}$/gm, "\u2550".repeat(84));
  }
  let normalised = normaliseRefs(raw);
  if (!CURRENT_SPINE) {
    for (const pointer of REMOVED_POINTERS) normalised = normalised.split(pointer).join("");
    for (const { before, after } of AUDIT_REWRITE_PAIRS) {
      normalised = normalised.split(normaliseRefs(before)).join(normaliseRefs(after));
    }
    for (const { before, after } of SPINE_REWRITE_PAIRS) {
      normalised = normalised.split(normaliseRefs(before)).join(normaliseRefs(after));
    }
  }
  before = before.concat(bodyLines(normalised, { dropDeletedSections: !CURRENT_SPINE }));
}

let after = [];
for (const file of fs.readdirSync(CONTENT).sort()) {
  if (!file.endsWith(".md")) continue;
  const text = normaliseRefs(fs.readFileSync(path.join(CONTENT, file), "utf8"));
  const addedAllowance = new Map();
  for (const line of CURRENT_SPINE ? [] : AUDIT_ADDITIONS) {
    const key = normaliseRefs(line).trim();
    addedAllowance.set(key, (addedAllowance.get(key) ?? 0) + 1);
  }
  after = after.concat(
    bodyLines(text).filter((line) => {
      const trimmed = line.trim();
      if (!CURRENT_SPINE && ORIENTATION_LINES.has(trimmed)) return false;
      if (!CURRENT_SPINE && SPINE_ORIENTATION_LINES.has(trimmed)) return false;
      if (!CURRENT_SPINE && SPINE_ADDITIONS.has(trimmed)) return false;
      const left = addedAllowance.get(trimmed);
      if (left) {
        addedAllowance.set(trimmed, left - 1);
        return false;
      }
      return true;
    }),
  );
}

const allowance = CURRENT_SPINE ? new Map() : new Map(REMOVED_SCAFFOLDING);
const beforeBody = before.filter((line) => {
  const left = allowance.get(line.trim());
  if (!left) return true;
  allowance.set(line.trim(), left - 1);
  return false;
});
const lost = difference(tally(beforeBody), tally(after));
const added = difference(tally(after), tally(beforeBody));

if (lost.length === 0 && added.length === 0) {
  console.log(
    `Content integrity check passed: all ${after.length} body lines are unchanged since ${BASE}, ` +
      `apart from the deleted registers, the nine logged orientation lines, repointed cross-references ` +
      `the ${FILLED_PLACEHOLDERS.length} placeholders the client has filled in, ` +
      `the ${AUDIT_CORRECTIONS.length} logged pre-send audit corrections, ` +
      `${AUDIT_REWRITE_PAIRS.length} logged audit rewrite hunks, ` +
      `${AUDIT_ADDITIONS.length} logged added lines, ` +
      `and, from the five-part spine, ${SPINE_ORIENTATION_LINES.size} part orientation lines, ` +
      `${SPINE_ADDITIONS.size} logged addition and ${SPINE_REWRITE_PAIRS.length} logged rewrite.`
  );
  process.exit(0);
}

console.error(`\nContent integrity check FAILED — the restructure changed body text.\n`);
for (const [line, count] of lost.slice(0, 20)) console.error(`  lost  (x${count}): ${line.slice(0, 140)}`);
for (const [line, count] of added.slice(0, 20)) console.error(`  added (x${count}): ${line.slice(0, 140)}`);
console.error(
  `\n${lost.length} line(s) lost, ${added.length} added. Body text is meant to move verbatim; ` +
    `only headings, the logged orientation lines and cross-reference numbers may change.\n`
);
process.exit(1);
