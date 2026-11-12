#!/usr/bin/env node
/**
 * The six content conflicts found by the table-of-contents restructure (docs/toc-2026-11/
 * RESTRUCTURED-TOC.md, tag [CONTENT CONFLICT]), reworded so the site says nothing its build
 * contradicts. Every change to content/ is logged in docs/toc-2026-11/ledger.json in the format
 * check:content reads ("replaced": the words before, the words after, and the section they sit in).
 *
 *     node scripts/toc-2026-11/content-fixes.mjs          apply, and rewrite the ledger
 *     node scripts/toc-2026-11/content-fixes.mjs --check  fail if any rewrite is not applied
 *
 * The conflicts, and the reader each fix serves:
 *   1. Cover: "Confidential, shared by link only" and "six Parts and eight annexes". The site is
 *      open to anyone with the link and its source is public, so the cover says who it is for and
 *      how it is reached instead. The same claim on the hero seal, the footer and the share card.
 *   2. In brief, and 5. The ask: "one week, one export" and read-only analytics access. Firefly holds
 *      no credentials to his accounts (How it works), so the ask is the decision the analysis names:
 *      approve the platform, at the recommended Standard level, and his team runs the campaign
 *      through it. The decision figure follows.
 *   3. Measuring success, and 4. The platform in one view: they described team entry while team
 *      sign-in is switched off. Sign-in switches on when the engagement starts, and they now say so.
 *   6. Fine print: "submitted in confidence". The request not to circulate stays; the false claim goes.
 *
 * Then the four items left after those six:
 *   7. What the campaign provides listed read-only analytics access as a gating dependency, which How
 *      it works contradicts (Firefly needs no access; the team enters its own analytics). Settled as
 *      C9 in docs/disputes-resolved.json, which also logs the one text-version edit it needs.
 *   8. The openings of Platform playbooks and Runbooks pointed to where their moved sections used to be.
 *   9. The cover date: "September 2026, revised November 2026", so the original date stays on record.
 *  10. The ward dossier showed campaign spending limits, which the site's rules exclude ("No
 *      campaign-finance ceilings", docs/consolidation-2026-11/HOW-TO-UPDATE.md). They leave the
 *      pages; the Gazette data stays in data/public-2026-11/, unchanged.
 *
 * Each rewrite must match exactly once (or, with `all`, at least once). A rewrite already applied
 * is skipped, so the script is safe to run again.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { superseded } from "../value-2026-11/superseded.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const LEDGER = path.join(ROOT, "docs", "toc-2026-11", "ledger.json");
const CHECK = process.argv.includes("--check");
const FENCE = /^\s*```/;
const HEADING = /^(#{2,3})\s+((?:\d+(?:\.\d+)*|[A-H](?:\.\d+)+))\s+(.*)$/; // as scripts/declutter/sections.mjs

const ASK_OLD = "**Firefly Management offers a platform and asks for one week, one export.**";
const ASK_NEW = "**Firefly Management offers a platform and asks for one decision: approve it, and his team runs the campaign through it.**";
// A lead holds at most 45 words (scripts/declutter/check-leads.mjs), so In brief's lead carries the
// short form; the body beneath it carries the full sentence.
const ASK_LEAD = "**Firefly Management offers a platform and asks him to approve it.**";

export const REWRITES = [
  // 1. Cover
  { f: "content/cover.md", from: "and the order of the six Parts and eight annexes that follow.", to: "and the order of the parts that follow." },
  { f: "content/cover.md", from: "**Confidential.** Prepared for Hon. Dr. Benson Makali Mulu personally, and shared by link only. The full terms are in Annex G.", to: "**Prepared for Hon. Dr. Benson Makali Mulu personally.** It is open to anyone with the link and kept out of search engines. The terms of use are in the fine print." },
  { f: "components/premium/CoverHero.tsx", from: "<strong>Confidential</strong> — personal, link-only.", to: "<strong>Prepared for Dr. Mulu</strong> — open to anyone with the link." },
  { f: "components/ClientPage.tsx", from: "<strong>Confidential</strong>\n            <span className=\"opacity-85\"> — link-only, prepared for Hon. Dr. Benson Makali Mulu personally. Not for circulation.</span>", to: "<strong>Prepared for Hon. Dr. Benson Makali Mulu personally</strong>\n            <span className=\"opacity-85\"> — open to anyone with the link. Please do not circulate it further.</span>" },
  // (These two also carry fix 9's date.)
  { f: "app/layout.tsx", from: "Prepared by Firefly Management, September 2026. Confidential.';", to: "Prepared by Firefly Management, September 2026, revised November 2026.';" },
  { f: "app/layout.tsx", from: "Firefly Management, September 2026. Confidential.',", to: "Firefly Management, September 2026, revised November 2026.'," },

  // 2. In brief
  { f: "content/brief.md", from: "```lead\n" + ASK_OLD, to: "```lead\n" + ASK_LEAD },
  { f: "content/brief.md", from: ASK_OLD, to: ASK_NEW },

  // 3. Measuring success
  { f: "content/success.md", from: "```lead\nSuccess is judged on measures his team can observe on Dr. Makali Mulu's own channels and on the SMS list it operates, entered on Firefly's platform, and", to: "```lead\nSuccess is judged on measures his team can observe on Dr. Makali Mulu's own channels and on the SMS list it operates, entered once the engagement starts, and" },
  { f: "content/success.md", from: "on the SMS list it operates, entered on Firefly's platform, and the one that matters most", to: "on the SMS list it operates, entered on Firefly's platform once the engagement starts, and the one that matters most" },
  { f: "content/success.md", from: "or on the SMS list it operates, and enters in the platform's KPI tracker,", to: "or on the SMS list it operates, and, once the engagement starts, enters in the platform's KPI tracker," },

  // 4. The platform in one view
  { f: "content/platform.md", all: true, from: "**Anyone with the link sees everything. Dr. Mulu's team signs in to change it. Firefly keeps it running.**", to: "**Anyone with the link sees everything. Once the engagement starts, Dr. Mulu's team signs in to change it. Firefly keeps it running.**" },
  { f: "content/platform.md", from: "text: \"adds and changes records and data, from a phone\"", to: "text: \"adds and changes records and data, from a phone, once team sign-in is switched on at the start of the engagement\"" },

  // 5. The ask, and its decision figure
  { f: "content/ask.md", all: true, from: ASK_OLD, to: ASK_NEW },
  { f: "content/ask.md", from: "Firefly would like one week and one export to load the platform. Everything after that is evidence, and the team's to act on.", to: "Firefly asks him to approve the platform at the recommended Standard level. His team then enters its own ninety-day export, and everything after that is evidence for the team to act on." },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "title: \"The ask is one week and one export, because the nomination window sets the clock\",", to: "title: \"The ask is one decision, to approve the platform, because the nomination window sets the clock\"," },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "{ kicker: \"The ask\", title: \"One week and one export\", body: \"Read-only analytics access and the ninety-day export. Everything after that is evidence.\", tone: \"accent\" },", to: "{ kicker: \"The ask\", title: \"Approve the platform\", body: \"At the recommended Standard level. His team runs the campaign through it; Firefly runs the platform.\", tone: \"accent\" }," },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "{ when: \"Day 1\", title: \"Access granted\", body: \"Analyst role on Meta and equivalents; no publishing rights change hands.\" },", to: "{ when: \"Day 1\", title: \"The team signs in\", body: \"Team accounts opened on the platform; Firefly holds no credentials to his channels.\" }," },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "{ when: \"Days 1–2\", title: \"The export\", body: \"Ninety days of reach, engagement, language and geography; the Page-or-profile question settled.\" },", to: "{ when: \"Days 1–2\", title: \"The export\", body: \"His team enters ninety days of reach, engagement, language and geography from its own accounts; the Page-or-profile question settled.\" }," },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "{ cells: { when: \"Day 1\", what: \"Read-only analytics access granted\" } },", to: "{ cells: { when: \"Day 1\", what: \"Team accounts opened on the platform\" } }," },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "{ cells: { when: \"Days 1–2\", what: \"Ninety-day export pulled; Page-or-profile settled\" } },", to: "{ cells: { when: \"Days 1–2\", what: \"Ninety-day export entered by the team; Page-or-profile settled\" } }," },

  // 6. Fine print
  { f: "content/annex-terms.md", from: "## G.1 Confidentiality and use", to: "## G.1 Who it is for, and how it may be used" },
  { f: "content/annex-terms.md", from: "It is submitted in confidence to him and to those he authorises to review it.", to: "It is submitted to him and to those he authorises to review it." },
  { f: "content/annex-terms.md", from: "It should not be circulated beyond the campaign's decision-making group,", to: "It is open to anyone with the link, but it should not be circulated beyond the campaign's decision-making group," },
  { f: "lib/heading-slug.ts", from: "blurb: \"Confidentiality, use, and the terms used throughout\"", to: "blurb: \"Who it is for, how it may be used, and the terms used throughout\"" },

  // 7. What the campaign provides (C9)
  { f: "content/receives.md", all: true, from: "three of them gate everything else: a named counterpart, read-only analytics access and the appointment of the data-protection reviewer.", to: "three of them gate everything else: a named counterpart, the team's own analytics exports and the appointment of the data-protection reviewer." },
  { f: "content/receives.md", from: "*   **Read-only analytics access** on the existing accounts — Analyst role, no publishing rights.\n    Without it there is nothing to analyse, and the engagement cannot start.", to: "*   **The team's own analytics exports** from the existing accounts, entered on the platform; no\n    access to the accounts changes hands. Without them there is nothing to analyse, and the engagement cannot start." },
  { f: "content/receives.md", from: "label: \"**the presence audit cannot start until read-only analytics access is granted**\"", to: "label: \"**the presence audit cannot start until the team enters its analytics exports**\"" },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "{ item: \"Read-only analytics access on every channel: Analyst role, no publishing rights\", gating: true, why: \"Without it there is nothing to analyse and the engagement cannot start\" },", to: "{ item: \"The team's own analytics exports from every channel, entered on the platform: no access to the accounts changes hands\", gating: true, why: \"Without them there is nothing to analyse and the engagement cannot start\" }," },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "takeaway: \"A counterpart, read-only access and the data-protection reviewer come first;", to: "takeaway: \"A counterpart, the team's analytics exports and the data-protection reviewer come first;" },

  // 8. The openings of the two reference chapters that received moved sections
  { f: "content/annex-playbooks.md", from: "It is reference the main text points to, not argues from; the volunteer programme is in Annex D and the technology in Annex E.", to: "It is reference the main text points to, not argues from; the volunteer programme reference is at its end, and the technology is in Technology." },
  { f: "content/annex-runbooks.md", from: "the red-team drills, the threat model, incident response and the competitor-monitoring outputs. The rapid-response protocol itself is in Risks & response, and account security and phishing are in Lawful & ethical.", to: "the red-team drills, the threat model, the account security baseline, phishing awareness, incident response and the competitor-monitoring outputs. The rapid-response protocol itself is in Risks and response." },

  { f: "content/response.md", from: "(F.11); account security and phishing are\n> in Lawful & ethical. They are operational detail:", to: "(F.11), with account security and phishing\n> awareness. They are operational detail:" },
  { f: "content/annex-runbooks.md", from: "Account security and phishing awareness are in Lawful & ethical, with the law and the charter they serve.", to: "Account security and phishing awareness follow; the law and the charter they serve are in Lawful and ethical." },
  { f: "content/annex-technology.md", from: "The technical risk and security protocols for these systems are in Lawful & ethical, with account security and the data law they serve.", to: "The security protocols for these systems are in Runbooks, under the account security baseline; the data law they serve is in Lawful and ethical." },

  // 9. The cover date
  { f: "content/cover.md", from: "**Date:** September 2026\n", to: "**Date:** September 2026, revised November 2026\n" },
  { f: "components/ClientPage.tsx", from: "<dd>September 2026</dd>", to: "<dd>September 2026, revised November 2026</dd>" },

  // 10. Spending limits leave the ward dossier
  { f: "app/(platform)/tools/ward-dossier/page.tsx", from: "import { COUNTY_LIMITS, countyTotals, PUBLIC_CONSTITUENCIES, PUBLIC_SOURCES, PUBLIC_WARDS } from \"@/lib/public-data\";", to: "import { countyTotals, PUBLIC_CONSTITUENCIES, PUBLIC_SOURCES, PUBLIC_WARDS } from \"@/lib/public-data\";" },
  { f: "app/(platform)/tools/ward-dossier/page.tsx", from: "lead=\"Official register and spending-limit figures for the county, its constituencies and every ward.\"", to: "lead=\"Official register and Gazette figures for the county, its constituencies and every ward.\"" },
  { f: "app/(platform)/tools/ward-dossier/page.tsx", from: "    <section className=\"mt-8\"><h2 className=\"font-serif text-2xl text-ink\">Spending limits, 2027 General Election</h2>\n      <ul className=\"mt-2 space-y-1 text-ink\">{COUNTY_LIMITS.map((l) => <li key={l.office}>{l.office}: <span className=\"font-mono\">KSh {n(l.limit)}</span></li>)}</ul>\n    </section>\n", to: "" },
  { f: "app/(platform)/tools/ward-dossier/page.tsx", from: "<th className=\"py-2 pr-3 text-right\">Voters 2022</th><th className=\"py-2 text-right\">MP limit (KSh)</th>", to: "<th className=\"py-2 text-right\">Voters 2022</th>" },
  { f: "app/(platform)/tools/ward-dossier/page.tsx", from: "<td className=\"py-2 pr-3 text-right font-mono\">{n(c.voters)}</td><td className=\"py-2 text-right font-mono\">{n(c.mpLimit)}</td>", to: "<td className=\"py-2 text-right font-mono\">{n(c.voters)}</td>" },
  { f: "app/(platform)/tools/ward-dossier/page.tsx", from: "min-w-[34rem]", to: "min-w-[28rem]" },
  { f: "app/(platform)/tools/ward-dossier/page.tsx", from: "Population, area and limits come from the August 2026 Gazette.", to: "Population and area come from the August 2026 Gazette." },
  { f: "app/(platform)/tools/ward-dossier/[code]/page.tsx", from: "[\"MCA spending limit, 2027\", `KSh ${n(ward.mcaLimit)}`], ", to: "" },
  { f: "lib/public-data.ts", from: "label: \"Gazette Notice 12251, 7 August 2026: spending limits\"", to: "label: \"Gazette Notice 12251, 7 August 2026: ward population and area\"" },
];

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
        // A heading is not weighed (sections are keyed by number), nor is a lead, which repeats its
        // section's first sentence; only body copy and visual text are.
        const weighed = w.fence !== "lead" && !r.from.startsWith("```lead") && !r.from.startsWith("## ");
        ledger.push({
          file: tab,
          section: w.section,
          first12: r.from.replace(/\s+/g, " ").split(" ").slice(0, 12).join(" "),
          words: weighed ? words(r.from) - words(r.to) : 0,
          kind: "replaced",
          note: "Content-conflict fix (table-of-contents restructure, docs/toc-2026-11): the passage claimed something the build contradicts (confidentiality, the one-week-one-export ask, or team editing while sign-in is off) and now says what is true.",
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
