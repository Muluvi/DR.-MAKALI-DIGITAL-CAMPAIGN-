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
 * Each rewrite must match exactly once (or, with `all`, at least once). A rewrite already applied
 * is skipped, so the script is safe to run again.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
  { f: "app/layout.tsx", from: "Prepared by Firefly Management, September 2026. Confidential.';", to: "Prepared by Firefly Management, September 2026.';" },
  { f: "app/layout.tsx", from: "Firefly Management, September 2026. Confidential.',", to: "Firefly Management, September 2026.'," },

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
