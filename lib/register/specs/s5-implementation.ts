/**
 * Section 5, Implementation: who owns what, what each group produces, the first four weeks, the
 * phases, the cadence, the measures, the decision path, the risks and the team.
 */
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS } from "../../../data/kpis.ts";
import type { FigureSpec } from "../types.ts";
import { ELECTION, NOMINATION, TODAY } from "./s1-objectives.ts";
import { bar, fmt } from "./_util.ts";

const PROPOSAL = { name: "This proposal, Sections 5.1–5.9", tier: null, state: "target" as const };

/* ------------------------------------------------------------------ fig-5-1-workstreams */

type Owner = "firefly" | "team" | "outside";
const WS: { n: number; name: string; owner: Owner; ownerText: string; sec: string }[] = [
  { n: 1, name: "Service-delivery tracker; owned platform operation", owner: "firefly", ownerText: "Firefly builds the tracker; your team runs the platforms, directed", sec: "5.2.1.1" },
  { n: 2, name: "Content production and asset governance", owner: "team", ownerText: "Your team, directed", sec: "5.2.1.2" },
  { n: 3, name: "Creative testing and AI assistance", owner: "firefly", ownerText: "Firefly", sec: "5.2.1.3" },
  { n: 4, name: "Accessibility and inclusion", owner: "firefly", ownerText: "Firefly standard, team-executed", sec: "5.2.1.4" },
  { n: 5, name: "Platform tactics and paid media", owner: "team", ownerText: "Your team, directed", sec: "5.2.2.1" },
  { n: 6, name: "Earned media, journalists and debates", owner: "team", ownerText: "Your team, directed", sec: "5.2.2.2" },
  { n: 7, name: "Ground-digital integration", owner: "team", ownerText: "Campaign-owned", sec: "5.2.3.1" },
  { n: 8, name: "The field-to-digital loop", owner: "team", ownerText: "Campaign-owned", sec: "5.2.3.2" },
  { n: 9, name: "Offline reach: SMS, USSD and voice", owner: "firefly", ownerText: "Firefly operates directly", sec: "5.2.3.3" },
  { n: 10, name: "Digital organising and volunteers", owner: "outside", ownerText: "Outside scope", sec: "5.2.3.4" },
  { n: 11, name: "The data layer", owner: "firefly", ownerText: "Firefly", sec: "5.2.4.1" },
  { n: 12, name: "Predictive voter modelling", owner: "firefly", ownerText: "Firefly, gated on the compliance review", sec: "5.2.4.2" },
  { n: 13, name: "The technology stack", owner: "outside", ownerText: "Outside scope: he already holds it", sec: "5.2.4.3" },
  { n: 14, name: "Analytics and attribution", owner: "firefly", ownerText: "Firefly", sec: "5.2.4.4" },
];
const OWNER_LABEL: Record<Owner, string> = { firefly: "Firefly operates", team: "Your team runs, to a brief", outside: "Outside this engagement" };

export const FIG_5_1: FigureSpec = {
  id: "fig-5-1-workstreams",
  section: "5.1",
  title: "Of the fourteen workstreams, Firefly operates the analysis, the data and the offline layer, and your team keeps publishing",
  question: "Who owns what?",
  takeaway: "Workstream 9, the offline layer, is the one Firefly runs directly and the one the race turns on; two workstreams sit outside the engagement.",
  sources: [PROPOSAL],
  chart: {
    type: "cards",
    columns: 3,
    cards: WS.map((w) => ({ kicker: `WS ${w.n} · ${OWNER_LABEL[w.owner]}`, title: w.name, body: w.ownerText, meta: `Section ${w.sec}`, tone: w.owner === "firefly" ? ("accent" as const) : w.owner === "outside" ? ("outside" as const) : undefined })),
  },
  notes: ["Solid accent border: Firefly operates. Plain: your team, directed. Dashed: outside this engagement."],
  columns: [{ key: "ws", label: "WS", numeric: true }, { key: "name", label: "Workstream" }, { key: "owner", label: "Owner" }, { key: "sec", label: "Section" }],
  rows: WS.map((w) => ({ cells: { ws: w.n, name: w.name, owner: w.ownerText, sec: w.sec } })),
};

/* ------------------------------------------------------------------ fig-5-2-workstream-panels */

const GROUPS = [
  { title: "Platforms and content (WS 1–4)", produces: "Daily multilingual posts, flagship video, the Kikamba voice note, the tracker", owner: "Your team produces; Firefly briefs, tests and builds the tracker", often: "Daily; video 2–3 a week; voice note weekly" },
  { title: "Publishing and earned media (WS 5–6)", produces: "Targeting plans, placements, briefing notes, debate preparation", owner: "Your team places; Firefly plans and reads", often: "Weekly plan; placements as booked" },
  { title: "Ground and offline reach (WS 7–10)", produces: "SMS touches, the USSD menu, field reports into the CRM", owner: "Firefly dispatches SMS and USSD; the ground team reports", often: "SMS fortnightly, rising to a GOTV surge; field reports daily" },
  { title: "Data and technology (WS 11–14)", produces: "The data layer, the scored voter file, the weekly read and the monthly report", owner: "Firefly", often: "Weekly read; monthly report; audit refreshed monthly" },
];

export const FIG_5_2: FigureSpec = {
  id: "fig-5-2-workstream-panels",
  section: "5.2",
  title: "Four groups of work, each with one product, one owner and one rhythm",
  question: "What does each group produce?",
  takeaway: "Most of the output is your team's existing work, now directed; Firefly's own products are the brief, the analysis and the offline dispatch.",
  sources: [PROPOSAL],
  chart: { type: "cards", columns: 2, cards: GROUPS.map((g) => ({ title: g.title, body: g.produces, meta: `Owner: ${g.owner} · ${g.often}` })) },
  columns: [{ key: "group", label: "Group" }, { key: "produces", label: "Produces" }, { key: "owner", label: "Owner" }, { key: "often", label: "How often" }],
  rows: GROUPS.map((g) => ({ cells: { group: g.title, produces: g.produces, owner: g.owner, often: g.often } })),
};

/* ------------------------------------------------------------------ fig-5-3-four-weeks */

const WEEKS = [
  { when: "Week 1", title: "The presence audit", body: "Ninety days of his channels against the rivals; the Page-or-profile question; 2FA applied by your team." },
  { when: "Weeks 1–2", title: "Foundations", body: "Capability map, compliance review commissioned, Kikamba reviewer confirmed; the six profile fixes shipped." },
  { when: "Weeks 2–6", title: "First directed cycles", body: `The weekly brief from Week 2; output weighted ${fmt("effort.p-1.mwingi")}% Mwingi, ${fmt("effort.p-1.arid")}% arid belt, ${fmt("effort.p-1.anchor")}% anchor, ${fmt("effort.p-1.rotating")}% testing; SMS opt-in drive.` },
  { when: "Weeks 6–8", title: "Consolidation", body: "Red-team drill before the nomination decision; coalition roundtables; ward champions in the highest-priority wards." },
];

export const FIG_5_3: FigureSpec = {
  id: "fig-5-3-four-weeks",
  section: "5.3",
  title: "The first week measures, and nothing is committed against the diagnosis until it has",
  question: "What happens in the first four weeks?",
  takeaway: "Week 1 is the audit; the brief starts in Week 2, weighted to the pool, and the six fixes ship by the end of it.",
  sources: [PROPOSAL, { name: "The audit runs on his Insights export, Week 1", tier: null, state: "target" }],
  chart: {
    type: "composite",
    parts: [
      { heading: "The strip", chart: { type: "steps", horizontal: true, steps: WEEKS.map((w, i) => ({ ...w, current: i === 0 })) } },
      {
        heading: "The Week 1 method, condensed",
        chart: {
          type: "cards",
          columns: 3,
          cards: [
            { title: "The window", body: "The ninety days before signature, on every channel he runs." },
            { title: "What is measured", body: "Reach by ward, engagement on reach, language mix, format mix, cadence." },
            { title: "Against", body: "The same window for Dr. Kasalu, Sen. Wambua and Hon. Ngilu, on public data." },
          ],
        },
      },
    ],
  },
  columns: [{ key: "when", label: "When" }, { key: "what", label: "What" }, { key: "detail", label: "Detail" }],
  rows: WEEKS.map((w) => ({ cells: { when: w.when, what: w.title, detail: w.body } })),
};

/* ------------------------------------------------------------------ fig-5-4-phases */

const PHASE_EVENTS = [
  { date: TODAY, end: NOMINATION.end, label: "Phase −1: the nomination", note: "From signature through the reported window." },
  { date: "2026-10-01", end: "2026-12-31", label: "Phase 1: awareness and community building", whenText: "October–December 2026" },
  { date: "2027-01-01", end: "2027-03-31", label: "Phase 2: engagement and persuasion", whenText: "January–March 2027" },
  { date: "2027-04-01", end: ELECTION, label: "Phase 3: mobilisation and GOTV", whenText: "April–August 2027" },
];

export const FIG_5_4: FigureSpec = {
  id: "fig-5-4-phases",
  section: "5.4",
  title: "Four phases run to the election, and the nomination phase overlaps the first",
  question: "How does the plan run to August 2027?",
  takeaway: "Phase −1 is aimed at a window reported for late October to November; the three general-election phases follow it to 10 August 2027.",
  sources: [PROPOSAL, { name: "Nomination window: single-source report", tier: "T3" }],
  chart: {
    type: "timeline",
    from: "2026-09-01",
    to: "2027-08-31",
    today: TODAY,
    events: [
      ...PHASE_EVENTS.map((e) => ({ ...e, state: "target" as const, whenText: e.whenText ?? (e.date === TODAY ? "September to November 2026" : undefined) })),
      { ...NOMINATION, label: "Wiper nomination window", state: "sourced" as const, reported: true },
      { date: ELECTION, label: "General election", state: "sourced" as const },
    ],
  },
  notes: ["Same date axis as Figure fig-1-1-timeline."],
  columns: [{ key: "phase", label: "Phase" }, { key: "when", label: "When" }],
  rows: [
    { cells: { phase: "Phase −1: the nomination", when: "September to November 2026" }, state: "target" },
    { cells: { phase: "Phase 1: awareness", when: "October–December 2026" }, state: "target" },
    { cells: { phase: "Phase 2: persuasion", when: "January–March 2027" }, state: "target" },
    { cells: { phase: "Phase 3: mobilisation and GOTV", when: "April–August 2027" }, state: "target" },
    { cells: { phase: "General election", when: "10 August 2027" } },
  ],
};

/* ------------------------------------------------------------------ fig-5-4-ladder */

/** The three phases' KPI tables (Sections 5.4.1–5.4.3) as one ladder (brief §12). */
const PHASE_LABELS = ["Phase 1 · Oct–Dec 2026", "Phase 2 · Jan–Mar 2027", "Phase 3 · Apr–Aug 2027"];
const CLIMB: { title: string; ids: [string, string, string] }[] = [
  { title: "Consented SMS contacts", ids: ["target.sms.phase-1b", "target.sms.phase-2", "target.sms"] },
  { title: "USSD unique sessions", ids: ["target.ussd.phase-1", "target.ussd.phase-2", "target.ussd.phase-3"] },
  { title: "Tracker reports received", ids: ["target.tracker.phase-1", "target.tracker.phase-2", "target.tracker.phase-3"] },
];
/** Every other target, in the phase that sets it. "°" marks an operational diagnostic. */
const PHASE_TARGETS: [string, string, string, string][] = [
  ["Social reach ° (combined in Phase 1, cumulative after)", fmt("target.reach.phase-1"), fmt("target.reach.phase-2"), fmt("target.reach.phase-3")],
  ["Engaged followers °", fmt("target.followers.phase-1"), fmt("target.followers.phase-2"), fmt("target.followers.phase-3")],
  ["Email/SMS subscribers", fmt("target.subscribers.phase-1"), fmt("target.subscribers.phase-2"), "—"],
  ["Digital volunteer sign-ups", fmt("target.volunteers.phase-1"), fmt("target.volunteers.phase-2"), "—"],
  ["Facebook engagement rate", "≥ 5%", "—", "—"],
  ["Earned media items per month", "≥ 8", "—", "—"],
  ["Opt-out rate", "< 2%", "—", "—"],
  ["Positive sentiment", "—", "≥ 50%", "≥ 80%"],
  ["Viral content pieces (>100,000 views) °", "—", "≥ 10", "—"],
  ["Red-team response times meeting target", "—", "≥ 90%", "—"],
  ["Digital pledges to vote", "—", "—", fmt("target.pledges")],
  ["Voter registration lift in target wards", "—", "—", "≥ 10%"],
  ["GOTV contact rate", "—", "—", "≥ 70%"],
  [`Contact share of the ~${fmt("benchmark")} win threshold`, "—", "—", "≥ 75%"],
  ["Misinformation incidents answered within their severity target", "—", "—", "100%"],
];

export const FIG_5_4_LADDER: FigureSpec = {
  id: "fig-5-4-ladder",
  section: "5.4",
  title: "Three indicators climb through every phase, and every other target belongs to one phase",
  question: "What does each phase have to deliver?",
  takeaway: `Consented SMS contacts rise from ${fmt("target.sms.phase-1b")} in Phase 1 to ${fmt("target.sms")} by Phase 3; rows marked ° are operational diagnostics, not performance indicators (Section 5.6.7).`,
  sources: [PROPOSAL],
  chart: {
    type: "composite",
    parts: [
      ...CLIMB.map((c) => ({
        heading: `${c.title}, by phase`,
        chart: { type: "bars" as const, bars: c.ids.map((id, i) => bar(id, PHASE_LABELS[i])) },
      })),
      { heading: "Every other target, in the phase that sets it", chart: { type: "matrix" as const, header: ["Target", "Phase 1", "Phase 2", "Phase 3"], rows: PHASE_TARGETS.map(([h, ...cells]) => ({ head: h, cells })), cards: false } },
    ],
  },
  notes: [
    `° an operational diagnostic: what the team steers ad delivery and creative by, published so the campaign can see what is optimised, and kept out of executive dashboards, reporting meetings and vendor performance contracts. Section 5.6.7 gives the reasons: a ${fmt("ict.offline")}% offline population, diaspora-skewed interaction, and no demonstrated link to turnout.`,
    `The three climbing indicators, and the contact share of the ~${fmt("benchmark")} threshold, are performance indicators: each traces to the nomination objectives in Section 1.3 or to the benchmark, and performance is judged on the Section 5.6 set.`,
  ],
  columns: [{ key: "target", label: "Target" }, { key: "p1", label: "Phase 1" }, { key: "p2", label: "Phase 2" }, { key: "p3", label: "Phase 3" }],
  rows: [
    ...CLIMB.map((c) => ({ cells: { target: c.title, p1: fmt(c.ids[0]), p2: fmt(c.ids[1]), p3: fmt(c.ids[2]) }, state: "target" as const })),
    ...PHASE_TARGETS.map(([t, a, b, c]) => ({ cells: { target: t, p1: a, p2: b, p3: c }, state: "target" as const })),
  ],
};

/* ------------------------------------------------------------------ fig-5-5-cadence */

const CADENCE: [string, string[]][] = [
  ["Daily", ["Multilingual social (your team)", "Ward field reports (ground team)"]],
  ["Weekly", ["The weekly brief, Thursday (Firefly)", "Content calendar, Friday (your team; Firefly approves)", "Kikamba voice note", "Facebook Live", "Creative test cycle (Firefly reads)"]],
  ["Fortnightly", ["SMS touch to the consented list (Firefly), rising to a GOTV surge"]],
  ["Monthly", ["Presence audit refresh (Firefly)", "Performance report (Firefly)", "Sentiment report (Firefly)", "Competitive brief (Firefly)", "Kitui Economic Brief (your team)"]],
  ["Quarterly", ["Red-team drill (Firefly and your team)"]],
];
const LEVELS: [string, string, string, string][] = [
  ["Presence audit", "Once, at start", "Refreshed monthly", "Refreshed fortnightly"],
  ["Wards with reach reporting", "12 decisive", "All 40", "All 40 + diaspora"],
  ["Wards with active SMS/USSD", "Partial", "All 40", "All 40 + diaspora"],
  ["Creative testing", "Monthly", "Weekly", "Weekly"],
  ["Predictive scoring and attribution", "No", "Yes", "Yes"],
  ["Phase 3 contact universe", `≈${fmt("target.contact-universe.lean")}`, `≈${fmt("target.contact-universe.standard")}`, `≈${fmt("target.contact-universe.premium")}`],
];

export const FIG_5_5: FigureSpec = {
  id: "fig-5-5-cadence",
  section: "5.5",
  title: "He receives a brief every week and a read every month, and the level sets how deep each goes",
  question: "What does he receive, and how often?",
  takeaway: "Standard, the recommended level, is the one at which all 40 wards carry reach reporting and an active SMS and USSD layer.",
  sources: [PROPOSAL],
  chart: {
    type: "composite",
    parts: [
      { heading: "The cadence, at Level 2", chart: { type: "matrix", header: ["Cadence", "What arrives"], rows: CADENCE.map(([c, items]) => ({ head: c, cells: [items.join(" · ")] })) } },
      { heading: "Depth, by level", chart: { type: "matrix", header: ["Item", "Lean", "Standard (recommended)", "Premium"], rows: LEVELS.map(([h, ...c]) => ({ head: h, cells: c })) } },
    ],
  },
  notes: ["Levels differ in the depth of the intelligence, not the volume of output. Commercial terms appear nowhere in this document."],
  columns: [{ key: "item", label: "Item" }, { key: "lean", label: "Lean" }, { key: "standard", label: "Standard" }, { key: "premium", label: "Premium" }],
  rows: LEVELS.map(([h, a, b, c]) => ({ cells: { item: h, lean: a, standard: b, premium: c }, state: h.startsWith("Phase 3") ? ("target" as const) : undefined })),
};

/* ------------------------------------------------------------------ fig-5-6-kpis */

const KPIS = [...NOMINATION_KPIS, ...GENERAL_ELECTION_KPIS];
const baselineText = (k: (typeof KPIS)[number]) => (k.baseline.kind === "measured" ? k.baseline.display : k.baseline.kind === "unmeasured" ? "set in Week 1" : k.baseline.note);

export const FIG_5_6: FigureSpec = {
  id: "fig-5-6-kpis",
  section: "5.6",
  title: "Nine indicators judge the work, four for the nomination and five for the election, each observable on his own channels or lists",
  question: "How is progress measured?",
  takeaway: "Every indicator is observable on his channels, the SMS list or the field record, and each stays empty until its baseline is taken.",
  sources: [PROPOSAL, { name: "Baselines: set in Week 1 from his Insights export", tier: null, state: "target" }],
  chart: {
    type: "composite",
    parts: [
      { heading: "The ladder", chart: { type: "gauges", items: KPIS.map((k) => ({ code: k.code, title: k.title, target: k.target, baseline: baselineText(k), share: null })) } },
      { heading: "Reach share by ward, against the pool's share of the register", chart: { type: "tilemap", layers: ["reach-targets"], initial: "reach-targets" } },
    ],
  },
  columns: [{ key: "code", label: "Code" }, { key: "title", label: "Indicator" }, { key: "baseline", label: "Baseline" }, { key: "target", label: "Target" }, { key: "cadence", label: "Cadence" }],
  rows: KPIS.map((k) => ({ cells: { code: k.code, title: k.title, baseline: k.baseline.kind === "unmeasured" ? "Set in Week 1" : baselineText(k), target: k.target, cadence: k.cadence }, state: "target" as const })),
};

/* ------------------------------------------------------------------ fig-5-7-approval */

export const FIG_5_7: FigureSpec = {
  id: "fig-5-7-approval",
  section: "5.7",
  title: "Your team drafts and publishes, one named counterpart approves, and an attack climbs three levels in hours",
  question: "How are decisions made?",
  takeaway: "Firefly approves new claims and Kikamba output and publishes only the offline broadcasts; a Level 3 attack reaches the candidate within thirty minutes.",
  sources: [PROPOSAL],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "The approval path",
        chart: {
          type: "steps",
          horizontal: true,
          steps: [
            { title: "The brief", body: "Firefly issues it on Thursday: pillar weights, must-post items, ward priority, language rule." },
            { title: "Draft", body: "Your team drafts; the Kikamba reviewer signs off anything in Kikamba." },
            { title: "Approve", body: "Routine posts: your team lead. A new policy claim or figure: Firefly and the campaign counterpart, 24 hours." },
            { title: "Publish", body: "Your team publishes. Firefly publishes only SMS, USSD and WhatsApp broadcasts, after the counterpart approves." },
          ],
        },
      },
      {
        heading: "The escalation ladder",
        chart: {
          type: "decision",
          question: "When an attack lands",
          rules: [
            { if: "Level 1", then: "your team drafts; your team lead approves, Firefly notified; within 4 hours" },
            { if: "Level 2", then: "Firefly drafts; the Communications Director approves; within 2 hours" },
            { if: "Level 3", then: "Firefly drafts; the candidate and senior leadership approve; within 30 minutes" },
          ],
        },
      },
    ],
  },
  columns: [{ key: "type", label: "Content" }, { key: "draft", label: "Drafted by" }, { key: "approve", label: "Approved by" }, { key: "publish", label: "Published by" }, { key: "time", label: "Turnaround" }],
  rows: [
    { cells: { type: "Routine post in an approved brief", draft: "Your team", approve: "Your team lead", publish: "Your team", time: "Same day" } },
    { cells: { type: "New policy claim or figure", draft: "Your team", approve: "Firefly + campaign counterpart", publish: "Your team", time: "24 hours" } },
    { cells: { type: "Kikamba voice note", draft: "Your team + Kikamba reviewer", approve: "Firefly", publish: "Your team", time: "48 hours" } },
    { cells: { type: "Attack, Level 1", draft: "Your team", approve: "Your team lead", publish: "Your team", time: "≤4 hours" } },
    { cells: { type: "Attack, Level 2", draft: "Firefly", approve: "Communications Director", publish: "Your team", time: "≤2 hours" } },
    { cells: { type: "Attack, Level 3", draft: "Firefly", approve: "Candidate + senior leadership", publish: "Your team", time: "≤30 minutes" } },
    { cells: { type: "SMS / USSD / WhatsApp broadcast", draft: "Firefly", approve: "Campaign counterpart", publish: "Firefly", time: "24 hours" } },
    { cells: { type: "Any voter-file-based targeting", draft: "—", approve: "Compliance gate (Section 5.7.9)", publish: "—", time: "Before launch, no exceptions" } },
    { cells: { type: "Paid targeting plan and reallocation within the agreed weighting", draft: "Firefly proposes", approve: "Campaign counterpart", publish: "Your team executes", time: "24 hours" } },
  ],
};

/* ------------------------------------------------------------------ fig-5-8-risk */

const RISKS: { code: string; label: string; likelihood: 1 | 2 | 3; impact: 1 | 2 | 3; owner: string; why: string; mitigation: string }[] = [
  { code: "R1", label: "Nomination decided by delegates, not the reported countywide selection", likelihood: 2, impact: 3, owner: "Firefly Director + campaign", why: "The reported selection method is Tier 3 and unconfirmed; the targeting model changes wholesale", mitigation: "Section 5.8.14's delegate whip contingency; Section 2.3.2 names the party documents that would close this" },
  { code: "R2", label: "The recognition hypothesis is wrong", likelihood: 2, impact: 3, owner: "Head of Research", why: "The deficit may be about perceived distance, not unfamiliarity; the Phase −1 channel mix is built on it", mitigation: "Tested in Week 1 by the presence audit, and against the IEBC ward-level results once in hand, before anything is committed against it (Section 3.11)" },
  { code: "R3", label: "Data-protection reviewer not appointed in time", likelihood: 2, impact: 2, owner: "Campaign", why: "The long-lead appointment; gates the voter-file work and the mass SMS layer", mitigation: "Section 5.7.9's compliance gate; named as a gating dependency in Section 6.1" },
  { code: "R4", label: "ODPC guidance prohibits the SMS approach", likelihood: 1, impact: 2, owner: "Campaign Legal Director", why: "The political-campaigning circular could not be retrieved; Workstream 9 is the layer the race turns on", mitigation: "Section 6.2's three mandatory actions, before Phase −1 broadcasting" },
  { code: "R5", label: "Manipulated-media attack in the nomination window", likelihood: 2, impact: 2, owner: "Digital Director", why: "A compressed window leaves no time to recover", mitigation: "Section 5.8.7's protocol; hardware-key 2FA from day one (Section 5.3)" },
  { code: "R6", label: "The brief and the team's judgement disagree", likelihood: 3, impact: 2, owner: "Firefly Director + team lead", why: "It will happen, and should: moderate if handled, severe if suppressed", mitigation: "The brief states intent and the rule, never the caption; overrides are logged and read monthly as data, not as non-compliance" },
];
const LEVEL = ["", "Low", "Medium", "High"];
const IMPACT = ["", "Moderate", "High", "Severe"];

export const FIG_5_8: FigureSpec = {
  id: "fig-5-8-risk",
  section: "5.8",
  title: "Two of the six risks would change the plan rather than damage it, and both are settled by measurement early",
  question: "What could go wrong?",
  takeaway: "R1 closes with the party's 2027 nomination rules, R2 with the Week 1 audit; the incumbent's eligibility stays open, so its two branches are drawn.",
  sources: [PROPOSAL, { name: "Article 180(7): published commentary reads it both ways; no court has ruled", tier: "T2" }],
  chart: {
    type: "risk",
    items: RISKS.map(({ code, label, likelihood, impact }) => ({ code, label, likelihood, impact })),
    branches: [
      {
        title: "If it becomes a delegate primary",
        question: "Does Wiper move to a delegates' vote?",
        rules: [
          { if: "yes, delegates decide", then: "map the delegate register, move ward captains to peer lobbying, open a dedicated SMS channel to delegates" },
          { if: "no, the reported countywide selection stands", then: "the Phase −1 plan runs as written" },
        ],
      },
      {
        title: "If the incumbent's eligibility is contested",
        question: "Is Governor Malombe barred by Article 180(7)?",
        rules: [
          { if: "barred (Branch A, cumulative reading)", then: "an open-seat election: incumbency dissolves, Wiper realigns, and he runs as the successor" },
          { if: "eligible (Branch B, the limit read as consecutive)", then: "a direct anti-incumbency campaign against a seated executive" },
        ],
      },
    ],
  },
  notes: [
    "R1 and R2 change the plan rather than damage it, and both resolve inside the first weeks, by measurement rather than contingency: the argument for starting there.",
    "R6 is specific to this engagement's shape: a direction model with no disagreement protocol fails on its first collision, and quietly, because a team overruled once stops raising the objection rather than stopping the behaviour. The override log makes friction surface as evidence instead of as attrition.",
  ],
  columns: [{ key: "code", label: "#" }, { key: "risk", label: "Risk" }, { key: "l", label: "Likelihood" }, { key: "i", label: "Impact" }, { key: "owner", label: "Owner" }, { key: "why", label: "Why it matters" }, { key: "mitigation", label: "Mitigation" }],
  rows: RISKS.map((r) => ({ cells: { code: r.code, risk: r.label, l: LEVEL[r.likelihood], i: IMPACT[r.impact], owner: r.owner, why: r.why, mitigation: r.mitigation } })),
};

/* ------------------------------------------------------------------ fig-5-9-team */

export const FIG_5_9: FigureSpec = {
  id: "fig-5-9-team",
  section: "5.9",
  title: "Firefly adds three people and removes none, with five surge roles each tied to a trigger",
  question: "What shape is the team?",
  takeaway: "The campaign's command structure and his publishing team stay as they are; Firefly reports to one named counterpart and briefs one named lead.",
  sources: [PROPOSAL],
  chart: {
    type: "composite",
    parts: [
      { heading: "The campaign's command structure (Firefly works to it)", chart: { type: "cards", columns: 4, cards: ["Campaign Manager", "Communications and media lead", "Field operations and logistics lead", "Data, tech and compliance lead"].map((r) => ({ title: r, body: "Campaign role", tone: "outside" as const })) } },
      {
        heading: "Firefly's core, retained throughout",
        chart: {
          type: "cards",
          columns: 3,
          cards: [
            { title: "Strategy Director", body: "Analysis, strategy, the weekly brief; Level 2 drafting. Publishes nothing; holds no credentials.", tone: "accent" as const },
            { title: "Analyst", body: "Presence audit, measurement, attribution, the weekly read; data-governance owner for the audit.", tone: "accent" as const },
            { title: "Offline-layer Operator", body: "SMS, USSD and WhatsApp dispatch; consent ledger; compliance logging.", tone: "accent" as const },
          ],
        },
      },
      {
        heading: "Surge roles, each with a named trigger",
        chart: {
          type: "cards",
          columns: 3,
          cards: [
            { title: "Kikamba Reviewer", body: "Week 1 onward, mandatory at every level." },
            { title: "Data Analyst / Modeller", body: "Phase 1 onward, Standard and Premium." },
            { title: "Earned Media Officer", body: "Phase −1 onward, Standard and Premium." },
            { title: "Volunteer and Ward Champion Coordinator", body: "Phase 1 onward." },
            { title: "Crisis Communications Lead", body: "Phase 2 onward, or on trigger." },
          ],
        },
      },
    ],
  },
  notes: ["Roles only: no names, biographies or credentials. Community management and video editing are not added; your team already fills them."],
  columns: [{ key: "role", label: "Role" }, { key: "group", label: "Group" }, { key: "when", label: "Active" }],
  rows: [
    ...["Campaign Manager", "Communications and media lead", "Field operations and logistics lead", "Data, tech and compliance lead"].map((r) => ({ cells: { role: r, group: "Campaign command", when: "Throughout" } })),
    ...["Strategy Director", "Analyst", "Offline-layer Operator"].map((r) => ({ cells: { role: r, group: "Firefly core", when: "Throughout" } })),
    { cells: { role: "Kikamba Reviewer", group: "Surge", when: "Week 1 onward" } },
    { cells: { role: "Data Analyst / Modeller", group: "Surge", when: "Phase 1 onward" } },
    { cells: { role: "Earned Media Officer", group: "Surge", when: "Phase −1 onward" } },
    { cells: { role: "Volunteer and Ward Champion Coordinator", group: "Surge", when: "Phase 1 onward" } },
    { cells: { role: "Crisis Communications Lead", group: "Surge", when: "Phase 2 onward, or on trigger" } },
  ],
};

export const S5: FigureSpec[] = [FIG_5_1, FIG_5_2, FIG_5_3, FIG_5_4, FIG_5_4_LADDER, FIG_5_5, FIG_5_6, FIG_5_7, FIG_5_8, FIG_5_9];
