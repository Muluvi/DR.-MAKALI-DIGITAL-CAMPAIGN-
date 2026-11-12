#!/usr/bin/env node
/**
 * The value-proposition pass (November 2026, docs/value-2026-11/README.md): the decision part of
 * the story, the case on one screen and the fine print rewritten around the first phase and the
 * four layers of the offer, and the timeline re-anchored. Every change to content/ is logged in
 * docs/value-2026-11/ledger.json in the format check:content reads ("replaced": the words before,
 * the words after, and the section they sit in).
 *
 *     node scripts/value-2026-11/content-fixes.mjs          apply, and rewrite the ledger
 *     node scripts/value-2026-11/content-fixes.mjs --check  fail if any rewrite is not applied
 *
 * What changes, and why:
 *   1. The ask (In brief, The ask, its decision figure): one decision, the first phase. The offer is
 *      a platform that is already built; each later phase starts only once the one before it is
 *      accepted, and the campaign can stop at any of them. The scope level is set after Discovery.
 *   2. What you get and what you provide: opens on the four layers of the offer (the platform as it
 *      stands, making it dependable, running it with the campaign, new development); Firefly's own
 *      deliverable now names the service around the platform; what must be true before Discovery.
 *   3. The platform in one view: the Models area, and what is live, what switches on and what is
 *      still to build. The open-view message is unchanged: the site stays open to anyone with the link.
 *   4. Fine print: an open site cannot be confidential, so the wording says what is true. The request
 *      not to republish stays.
 *   5. Timeline: the September 2026 signature it counted from has passed. The campaign's own phases
 *      keep their dates; the platform's rollout moves to its own chapter, How the platform reaches
 *      all 40 wards (content/rollout.md, written whole, so not logged here: no base text to weigh).
 *   6. The nine models, each embedded in the chapters it belongs to (fifteen places).
 *   11. No sign-in: the platform chapter says anyone with the link can add and change records.
 *   7–10. Who does what names the service around the platform; Lawful and ethical names what the
 *      platform itself holds; Measuring success adds the platform's own measures; Risks and response
 *      adds the platform's risks and the election-day fallbacks.
 *
 * Earlier passes' --check scripts accept text this pass replaced (scripts/value-2026-11/superseded.mjs).
 * Each rewrite must match exactly once (or, with `all`, at least once). A rewrite already applied is
 * skipped, so the script is safe to run again.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const LEDGER = path.join(ROOT, "docs", "value-2026-11", "ledger.json");
const CHECK = process.argv.includes("--check");
const FENCE = /^\s*```/;
const HEADING = /^(#{2,3})\s+((?:\d+(?:\.\d+)*|[A-H](?:\.\d+)+))\s+(.*)$/; // as scripts/declutter/sections.mjs
const NOTE = "Value-proposition pass (docs/value-2026-11): the decision is the first phase, the offer is set out in four layers, the site stays open, and the timeline no longer counts from a signature date that has passed.";

const ASK_OLD = "**Firefly Management offers a platform and asks for one decision: approve it, and his team runs the campaign through it.**";
const ASK_NEW = "**Firefly Management offers a platform that is already built, and asks for one decision: approve its first phase.**";

const LAYERS_LEAD = "**What Firefly offers comes in four layers: the platform as it stands, the work of making it dependable, running it with the campaign, and new development.** Only the first exists today; each of the others is accepted when it is shown to work.";


/** A live model inside a chapter: rendered by components/models/ModelEmbed.tsx. */
// The opening tag alone on its line makes it an HTML block, not inline HTML inside a paragraph.
const embed = (slug) => `<model-embed slug="${slug}">\n</model-embed>\n`;

export const REWRITES = [
  // 1. In brief
  { f: "content/brief.md", from: "```lead\n**Firefly Management offers a platform and asks him to approve it.**", to: "```lead\n**Firefly asks him to approve the first phase of a built platform.**" },
  { f: "content/brief.md", from: ASK_OLD, to: ASK_NEW },
  {
    f: "content/brief.md",
    from: "Firefly recommends Level 2, Standard, and commits to the platform, its data checks and its upkeep, not to an electoral outcome.",
    to: "The first phase ends in an executed audit of the platform and a plan; each later phase starts only once the one before it is accepted, and the campaign can stop at any of them. Firefly commits to the platform, its availability and its data checks, not to an electoral outcome.",
  },

  // 1. The ask
  { f: "content/ask.md", all: true, from: ASK_OLD, to: ASK_NEW },
  { f: "content/ask.md", from: "approve its first phase.** Everything after that is evidence.\n```", to: "approve its first phase.** Everything after it follows proof.\n```" },
  {
    f: "content/ask.md",
    from: "Firefly asks him to approve the platform at the recommended Standard level. His team then enters its own ninety-day export, and everything after that is evidence for the team to act on.",
    to: "Firefly asks him to approve the first phase, Discovery, and nothing beyond it; everything after it follows proof. Discovery ends in an executed audit of the platform, every user mapped to a role, the team's phones and connectivity checked, and the legal position scoped, with the campaign's sponsor signing the requirements. Five phases follow, and each starts only when the one before it has been accepted: readiness, a pilot with the centre and two constituencies, county rollout, optimisation and election-day readiness. The campaign can stop after any of them and keep what it has. If it stops after the first, it keeps the audit, the plan and the public tools, which are open today. The scope level in Section 21.1 is set once Discovery is complete, not in this decision; his team then enters its own ninety-day export, and everything after that is evidence for the team to act on.",
  },

  // 1. The decision figure
  { f: "lib/register/specs/s6-nextsteps.ts", from: "import { NOMINATION_WINDOW } from \"../../phases.ts\";\n", to: "" },
  { f: "lib/register/specs/s6-nextsteps.ts", from: "title: \"The ask is one decision, to approve the platform, because the nomination window sets the clock\",", to: "title: \"The ask is one decision, to approve the first phase; every later phase follows proof\"," },
  {
    f: "lib/register/specs/s6-nextsteps.ts",
    from: "  takeaway: `Each week of delay is a week less of directed output before a window reported for late October; the ${fmt(\"pool\")}-voter pool is where that output goes.`,\n  sources: [{ name: NOMINATION_WINDOW.source, tier: NOMINATION_WINDOW.tier }, { name: \"This proposal\", tier: null, state: \"target\" }],",
    to: "  takeaway: `Each phase starts only once the one before it is accepted, so the campaign never commits beyond what has been shown to work, and the ${fmt(\"pool\")}-voter pool is where the work goes.`,\n  sources: [{ name: \"This proposal\", tier: null, state: \"target\" }],",
  },
  {
    f: "lib/register/specs/s6-nextsteps.ts",
    from: "            { kicker: \"The ask\", title: \"Approve the platform\", body: \"At the recommended Standard level. His team runs the campaign through it; Firefly runs the platform.\", tone: \"accent\" },\n            { kicker: \"What it starts\", title: \"The presence audit, then the first brief\", body: \"About six weeks for a first directed cycle, the first of them the audit that sets its targets.\" },",
    to: "            { kicker: \"The ask\", title: \"Approve the first phase\", body: \"Discovery: an executed audit, every user mapped to a role, the legal position scoped. Nothing beyond it is committed.\", tone: \"accent\" },\n            { kicker: \"What follows\", title: \"Proof, then the next decision\", body: \"Each later phase starts once the one before it is accepted, and the campaign can stop at any of them.\" },",
  },
  {
    f: "lib/register/specs/s6-nextsteps.ts",
    from: "        heading: \"Week 1\",\n        chart: {\n          type: \"steps\",\n          horizontal: true,\n          steps: [\n            { when: \"Day 1\", title: \"The team signs in\", body: \"Team accounts opened on the platform; Firefly holds no credentials to his channels.\" },\n            { when: \"Days 1–2\", title: \"The export\", body: \"His team enters ninety days of reach, engagement, language and geography from its own accounts; the Page-or-profile question settled.\" },\n            { when: \"Days 2–4\", title: \"Against the field\", body: \"The same window for the two nomination rivals, on public data.\" },\n            { when: \"Day 5\", title: \"The read\", body: \"The four audit figures filled, the diagnosis tested, the first brief drafted for Week 2.\" },\n          ],",
    to: "        heading: \"Six implementation phases, each accepted before the next\",\n        chart: {\n          type: \"steps\",\n          steps: [\n            { when: \"1\", title: \"Discovery\", body: \"If it stops here, the campaign keeps the audit, the plan and the public tools.\", current: true },\n            { when: \"2\", title: \"Readiness\", body: \"The live database proven, backups and monitoring; the central team starts entering.\" },\n            { when: \"3\", title: \"Pilot\", body: \"The centre and two contrasting constituencies run the weekly cycle on the platform.\" },\n            { when: \"4\", title: \"County rollout\", body: \"All 40 wards reporting; every coordinator trained on their own phone.\" },\n            { when: \"5\", title: \"Optimisation\", body: \"Monthly service reports, patching, restore tests and the weekly management pack.\" },\n            { when: \"6\", title: \"Election-day readiness\", body: \"Change freeze, rehearsed fallbacks and on-call cover to the close of polling-day support.\" },\n          ],",
  },
  {
    f: "lib/register/specs/s6-nextsteps.ts",
    from: "  columns: [{ key: \"when\", label: \"When\" }, { key: \"what\", label: \"What happens\" }],\n  rows: [\n    { cells: { when: \"Day 1\", what: \"Team accounts opened on the platform\" } },\n    { cells: { when: \"Days 1–2\", what: \"Ninety-day export entered by the team; Page-or-profile settled\" } },\n    { cells: { when: \"Days 2–4\", what: \"Same window for the two nomination rivals, public data\" } },\n    { cells: { when: \"Day 5\", what: \"Audit read; diagnosis tested; first brief drafted\" } },\n  ],",
    to: "  columns: [{ key: \"when\", label: \"Phase\" }, { key: \"what\", label: \"What the campaign can do at the end\" }],\n  rows: [\n    { cells: { when: \"1. Discovery\", what: \"Decide on facts: an executed audit, every user mapped to a role, the legal position scoped\" } },\n    { cells: { when: \"2. Readiness\", what: \"Let the central team start entering, on a proven database with backups and monitoring\" } },\n    { cells: { when: \"3. Pilot\", what: \"Run the weekly cycle on the platform with the centre and two constituencies\" } },\n    { cells: { when: \"4. County rollout\", what: \"See all 40 wards reporting, every coordinator trained\" } },\n    { cells: { when: \"5. Optimisation\", what: \"Rely on it: monthly service reports, patching, restore tests\" } },\n    { cells: { when: \"6. Election-day readiness\", what: \"Know its own operation is in place on the day: rehearsed fallbacks, change freeze, on-call cover\" } },\n  ],",
  },

  // 2. What you get and what you provide
  {
    f: "content/receives.md",
    from: "```lead\n**Firefly recommends Level 2, Standard.** It is the level at which all 40 wards carry both reach reporting and an active SMS and USSD layer, and reaching the arid belt is the whole argument.\n```",
    to: "```lead\n" + LAYERS_LEAD + "\n```",
  },
  {
    f: "content/receives.md",
    from: "**Firefly recommends Level 2, Standard.** It is the level at which all 40 wards carry both reach reporting and an active SMS and USSD layer, and reaching the arid belt is the whole argument. This chapter sets out what Dr. Makali Mulu receives at each of the three scope levels, and how often, and then the full schedule of deliverables.",
    to:
      LAYERS_LEAD +
      " This chapter sets out the four layers, then what the campaign's own operation carries at each of the three scope levels, and how often, and then the full schedule of deliverables. The scope level is the campaign's to set once the first phase is complete; Firefly's recommendation, Level 2, Standard, is in Section 21.1.2, where all 40 wards carry both reach reporting and an active SMS and USSD layer, and reaching the arid belt is the whole argument.\n\n" +
      "```visual\nkind: cards\ntitle: \"The four layers\"\nitems:\n" +
      "  - { title: \"The platform as it stands\", text: \"Live today: the story, the figure registry, the electoral data, the reference tools and the models. The team workspace is written, and switches on when the engagement starts\" }\n" +
      "  - { title: \"Making it dependable\", text: \"Security hardening, the live database, backups, monitoring, a staging site, guides in English and Kiswahili, training by role and a help desk\" }\n" +
      "  - { title: \"Running it with the campaign\", text: \"A weekly management pack, dashboards shaped to the leadership's questions, inputs for the data-protection paperwork, a named incident lead and a monthly service report\" }\n" +
      "  - { title: \"New development\", text: \"Offline entry with sync, coordinator roll-ups, escalation alerts, Kiswahili field forms and saved model scenarios\" }\n" +
      "```",
  },
  {
    f: "content/receives.md",
    from: "Firefly's own deliverable is the platform: hosting, upkeep, the data checks and new features.",
    to: "Firefly's own deliverable is the platform and the service around it: hosting, upkeep, the data checks, hardening, training by role, support, a monthly service report, the models and new features.",
  },
  {
    f: "content/receives.md",
    from: "| The platform: hosting, upkeep, data checks, new features | Continuous | **Firefly** | The live site, its explorer, dashboards and workspace; every edit checked before it goes live | 13.2 |",
    to: "| The platform: hosting, upkeep, data checks, hardening, training, support, service reporting, the models, new features | Continuous | **Firefly** | The live site, its explorer, dashboards, models and workspace; every edit checked before it goes live | 13.2 |",
  },
  {
    f: "content/receives.md",
    from: "  - label: \"sign-language interpretation on flagship content depends on the interpreter or service named in the figure above\"\n```",
    to:
      "  - label: \"sign-language interpretation on flagship content depends on the interpreter or service named in the figure above\"\n```\n\n" +
      "#### What must be true before the first phase starts\n\n" +
      "Four of these are the campaign's, and the platform cannot be accepted, or the team's records entered, without them. The last is Firefly's.\n\n" +
      "```visual\nkind: checklist\nitems:\n" +
      "  - label: \"A sponsor, an operational lead and a data-protection lead, named by the campaign\"\n" +
      "  - label: \"Counsel engaged on registration, the impact assessment and the processing agreement\"\n" +
      "  - label: \"Agreement that the team's records are open to anyone with the link, as the whole site is\"\n" +
      "  - label: \"A mandate that the weekly cycle runs on the platform, not beside it\"\n" +
      "  - label: \"On Firefly's side: the source repository made private, and the live services the workspace needs set up\"\n" +
      "```",
  },
  { f: "lib/heading-slug.ts", from: "blurb: \"Three scope levels, the deliverables, and both sides' commitments\"", to: "blurb: \"Four layers, three scope levels, the deliverables and both sides' commitments\"" },

  // 3. The platform in one view
  { f: "content/platform.md", from: "  - { title: \"Analyse\", text: \"Explore data and Dashboards\" }\n", to: "  - { title: \"Analyse\", text: \"Explore data and Dashboards\" }\n  - { title: \"Test a scenario\", text: \"Models: set the options or type an instruction, and see the outcome\" }\n" },
  {
    f: "content/platform.md",
    from: "  - { label: \"Team accounts: adding and removing them\" }\n```",
    to:
      "  - { label: \"Watching the change history, and putting back unwanted changes\" }\n```\n\n" +
      "```visual\nkind: cards\ntitle: \"What is live, what switches on, what is still to build\"\nitems:\n" +
      "  - { title: \"Live\", text: \"The story, Explore data, Dashboards, the reference tools and nine models: open now, with no account\" }\n" +
      "  - { title: \"Switches on\", text: \"The workspace, the data editor and the change history, open to anyone with the link: written, and proven on live services before the team relies on them\" }\n" +
      "  - { title: \"Still to build\", text: \"Offline entry, Kiswahili field forms, roll-up dashboards and saved model scenarios\" }\n" +
      "```",
  },
  { f: "content/platform.md", from: "[Explore the data](/explore) · [Dashboards](/dashboards) · ", to: "[Explore the data](/explore) · [Dashboards](/dashboards) · [Models](/models) · " },

  // 4. Fine print, and the same claim in the page chrome
  {
    f: "content/annex-terms.md",
    from: "It is open to anyone with the link, but it should not be circulated beyond the campaign's decision-making group, published, or disclosed\nto any third party — including any other aspirant, party organ or media house — without Firefly\nManagement's written consent.",
    to: "It is open to anyone with the link, and so is the platform it describes: anything the team enters\nthere can be read by anyone who has the link, rivals and the press included, so nothing that must\nstay private is entered on it. Firefly asks readers not to republish this proposal or pass it to\nanother aspirant, party organ or media house; nothing in it depends on its being kept secret.",
  },
  { f: "components/ClientPage.tsx", from: " — open to anyone with the link. Please do not circulate it further.</span>", to: " — open to anyone with the link. Please do not republish it.</span>" },

  // 5. Timeline
  {
    f: "content/timeline.md",
    from: "Phases −1 and 0 are counted from signature; Phases 1 to 3 keep their calendar dates, because the electoral calendar sets them, not the start of this engagement.",
    to: "Phases −1 and 0 are counted from signature, which this plan assumed for September 2026; Phases 1 to 3 keep their calendar dates, because the electoral calendar sets them, not the start of this engagement. That assumed date has passed, so the platform's own rollout no longer counts from it: Section 24.1, in How the platform reaches all 40 wards, lays its six implementation phases from the week the first phase is approved, against the gazetted dates.",
  },
  // 11. No sign-in (Firefly's decision): everything open to view and to edit, with no account
  {
    f: "content/platform.md",
    all: true,
    from: "**Anyone with the link sees everything. Once the engagement starts, Dr. Mulu's team signs in to change it. Firefly keeps it running.**",
    to: "**Anyone with the link sees everything and can add to it, with no account. Every change can be put back. Firefly keeps it running.**",
  },
  { f: "content/platform.md", from: "  title: \"Sign in to edit\"", to: "  title: \"Open to edit\"" },
  {
    f: "content/platform.md",
    from: "    - { label: \"Dr. Mulu's team\", text: \"adds and changes records and data, from a phone, once team sign-in is switched on at the start of the engagement\" }",
    to: "    - { label: \"Anyone with the link\", text: \"adds and changes records and data, from a phone, with no account and no sign-in\" }",
  },

  { f: "components/DecisionPanel.tsx", from: "text: \"Sign-off on the service level, and the names of the team accounts to create\" }", to: "text: \"Sign-off on the service level, and who on the team is trained first\" }" },

  // 6. The models, inside the chapters they belong to (components/models/ModelEmbed.tsx)
  { f: "content/votes.md", append: "\n" + embed("winning-number") },
  { f: "content/voters.md", from: "## 11.2 The six voter segments", to: embed("ward-priority") + "\n## 11.2 The six voter segments" },
  { f: "content/channels.md", from: "## 12.2 Which channel does which job", to: embed("reach-by-channel") + "\n## 12.2 Which channel does which job" },
  { f: "content/channels.md", from: "## 12.5 Register, dialect and quality control", to: embed("send-check") + "\n## 12.5 Register, dialect and quality control" },
  { f: "content/message.md", from: "## 10.5 Countering disinformation", to: embed("brief-mix") + "\n## 10.5 Countering disinformation" },
  { f: "content/record.md", from: "## 6.2 Where he is known, and where not", to: embed("record-finder") + "\n## 6.2 Where he is known, and where not" },
  { f: "content/response.md", from: "## F.2 Response times by channel", to: embed("response-tier") + "\n## F.2 Response times by channel" },
  { f: "content/news.md", from: "## 4.4 Reaching the offline majority", to: embed("reach-by-channel") + "\n## 4.4 Reaching the offline majority" },
  { f: "content/goal.md", from: "## 8.2 Five objectives", to: embed("winning-number") + "\n## 8.2 Five objectives" },
  { f: "content/diagnosis.md", from: "## 7.2 What could overturn it", to: embed("ward-priority") + "\n## 7.2 What could overturn it" },
  { f: "content/engagement.md", from: "## 13.5 Meetings and escalation", to: embed("brief-mix") + "\n## 13.5 Meetings and escalation" },
  { f: "content/lawful.md", from: "## 19.3 The Digital Ethics and Data Charter", to: embed("send-check") + "\n## 19.3 The Digital Ethics and Data Charter" },
  { f: "content/annex-runbooks.md", from: "## F.4 Monitoring tools", to: embed("response-tier") + "\n## F.4 Monitoring tools" },
  { f: "content/workstreams.md", from: "### 15.3.2 Workstream 8 — The field-to-digital loop", to: embed("polling-agents") + "\n### 15.3.2 Workstream 8 — The field-to-digital loop" },

  // 7. Who does what: what "Firefly runs the platform" now covers
  {
    f: "content/engagement.md",
    from: "separates the platform, its hosting, upkeep and data checks, which Firefly provides, from analysis",
    to: "separates the platform and the service around it (hosting, upkeep, the data checks, security hardening, training by role, support, a monthly service report and the models), which Firefly provides, from analysis",
  },

  // 8. Lawful and ethical: what the platform itself holds, and how the models treat what is typed
  {
    f: "content/lawful.md",
    from: "| Supporter CRM and voter model | Your team, on the campaign's own systems | The campaign as controller. No supporter record goes on Firefly's platform, which holds counts only; for those, Firefly is processor under a written processing agreement. |\n",
    to:
      "| Supporter CRM and voter model | Your team, on the campaign's own systems | The campaign as controller. No supporter record goes on Firefly's platform, which holds counts only; for those, Firefly is processor under a written processing agreement. |\n" +
      "| Edits on the platform | Firefly | There are no accounts, so the platform holds no name, email address or password for anyone who edits; each change is logged with its time and content only. The campaign is controller of the records themselves, and Firefly processor. |\n" +
      "| The models | Firefly | Nothing typed into a model is stored. The instruction box reads it in the visitor's own browser; only wording it cannot place, and only when Firefly has switched the AI step on, is sent to Anthropic's Claude service to be reworded, never with a phone number, ID or email address. Assessed by the Section 19.2 reviewer before the AI step is switched on. |\n",
  },

  // 9. Measuring success: the platform's own measures, kept apart from the campaign's
  {
    f: "content/success.md",
    newSection: true,
    append:
      "\n## 18.6 The platform's own measures, kept apart\n\n" +
      "```lead\nThe platform is measured on its own terms, apart from the campaign's indicators: whether it is available, whether its data checks pass, whether it can be restored, and whether the team uses it.\n```\n\n" +
      "The platform is measured on its own terms, apart from the campaign's indicators: whether it is available, whether its data checks pass, whether it can be restored, and whether the team uses it. A platform measure is never counted as a campaign result, and a campaign result is never credited to the platform. Firefly reports these each month in its service report to the campaign's counterpart; the targets are agreed in Discovery, and none is set here.\n\n" +
      "```visual\nkind: checklist\ntitle: \"What the monthly service report measures\"\nitems:\n" +
      "  - { label: \"Availability\", body: \"the share of the month the site and the workspace were up, against the agreed target\" }\n" +
      "  - { label: \"Data checks\", body: \"every change to the data pack passed the site's own checks before it went live\" }\n" +
      "  - { label: \"Restore\", body: \"the last restore test, and whether it finished within the agreed time\" }\n" +
      "  - { label: \"Support\", body: \"requests answered and closed within the agreed response targets\" }\n" +
      "  - { label: \"Use\", body: \"wards with a trained, active account, and whether the weekly cycle ran on the platform\" }\n" +
      "  - { label: \"Security\", body: \"open findings by severity, and the access review\" }\n" +
      "```\n",
  },

  // 10. Risks and response: the platform's own risks, and the fallbacks rehearsed before polling day
  {
    f: "content/response.md",
    newSection: true,
    append:
      "\n## 20.6 Platform risks and election-day fallbacks\n\n" +
      "```lead\nThe platform carries risks of its own: an outage, a lost record, a wrong edit, a name typed where it should not be. Each has a fallback the team rehearses before polling day.\n```\n\n" +
      "The platform carries risks of its own: an outage, a lost record, a wrong edit, a name typed where it should not be. Each has a fallback the team rehearses before polling day, and none of them depends on the platform being up.\n\n" +
      "| Risk | What guards against it | The fallback |\n|---|---|---|\n" +
      "| The site or the workspace is down | Monitoring and alerts; every change tried on a staging site first | Pages already opened stay readable offline; ward reports go to the constituency coordinator by phone and are entered once the site is back |\n" +
      "| A record is lost or damaged | Daily backups, and a restore test each month | Restore from the last backup; the change history puts back any single edit exactly |\n" +
      "| A wrong figure or record is saved | The data checks run before anything is saved | Revert it from the change history |\n" +
      "| A name, phone or ID number is typed into a form | Forms refuse phone and ID numbers; training says why | Firefly removes it at once, and the data-protection lead decides whether it must be reported |\n" +
      "| Someone alters or defaces the records | Every change is logged and nothing can be deleted; each visitor's saves are rate limited | Each change is put back from the change history; Firefly can pause saving for everyone while it is cleaned up |\n" +
      "| A late change breaks something | A change freeze before polling day | Nothing ships in the freeze except a fix the on-call lead approves |\n\n" +
      "```visual\nkind: checklist\ntitle: \"In place before polling day\"\nitems:\n" +
      "  - { label: \"Two rehearsals\", body: \"of the fallbacks above, with the people who will use them\" }\n" +
      "  - { label: \"A restore\", body: \"finished within the agreed time\" }\n" +
      "  - { label: \"An access review\", body: \"every account checked against the campaign's current list\" }\n" +
      "  - { label: \"Named decision-makers\", body: \"on the day, on the campaign's side and on Firefly's\" }\n" +
      "  - { label: \"On-call cover\", body: \"to the close of polling-day support\" }\n" +
      "```\n",
  },
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
    // An appended passage: applied once the file ends with it.
    if (r.append !== undefined) {
      if (text.endsWith(r.append)) { skipped++; continue; }
      if (CHECK) { missing.push(`${r.f}: not appended: ${r.append.trim().slice(0, 80)}`); continue; }
      const tab = path.basename(r.f, ".md");
      const w = where(text + "\n", text.length + 1);
      ledger.push({ file: tab, section: w.section, first12: r.append.trim().replace(/\s+/g, " ").split(" ").slice(0, 12).join(" "), words: r.newSection ? 0 : -words(r.append), kind: "replaced", note: NOTE, text: "", replacement: r.append, at: text.length });
      fs.writeFileSync(file, text + r.append);
      applied++;
      continue;
    }
    // An addition keeps the words it is anchored to, so it is applied once its whole new text is there.
    if (r.to.includes(r.from) && text.includes(r.to)) { skipped++; continue; }
    const count = text.split(r.from).length - 1;
    if (count === 0) {
      if (r.to === "" || text.includes(r.to)) { skipped++; continue; }
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
        const weighed = !r.newSection && w.fence !== "lead" && !r.from.startsWith("```lead") && !r.from.startsWith("## ");
        ledger.push({
          file: tab,
          section: w.section,
          first12: r.from.replace(/\s+/g, " ").split(" ").slice(0, 12).join(" "),
          words: weighed ? words(r.from) - words(r.to) : 0,
          kind: "replaced",
          note: NOTE,
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
    console.error(`value content fixes: ${missing.length} problem(s)\n${missing.map((m) => "  - " + m).join("\n")}`);
    process.exit(1);
  }
  console.log(`value content fixes: ${applied} applied, ${skipped} already in place, ${ledger.length} content changes in the ledger`);
}
