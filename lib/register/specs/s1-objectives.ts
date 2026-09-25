/**
 * Section 1, Objectives: the clock, the five objectives, how the engagement runs, and the scorecard.
 */
import type { FigureSpec } from "../types.ts";
import { fmt, secHref } from "./_util.ts";

/* ------------------------------------------------------------------ the calendar, shared with 5.4 */

export const TODAY = "2026-09";
export const ELECTION = "2027-08-10";
export const NOMINATION = { date: "2026-10-20", end: "2026-11-30", whenText: "Late October to November 2026" };

export const FIG_1_1: FigureSpec = {
  id: "fig-1-1-timeline",
  section: "1.1–1.2",
  title: "There are about eleven months to the election, and the nomination window comes first, within weeks",
  question: "How long is there?",
  takeaway: "The Wiper ticket is settled in a window reported for late October to November 2026; everything the engagement does before then is aimed at it.",
  sources: [{ name: "Nomination window: a single-source campaign report (Section 2.3)", tier: "T3" }, { name: "General election date: Constitution of Kenya, Article 101", tier: "T1" }],
  chart: {
    type: "timeline",
    countdown: { date: ELECTION, label: "general election" },
    from: "2026-09-01",
    to: "2027-08-31",
    today: TODAY,
    events: [
      { date: TODAY, label: "This proposal", state: "sourced", whenText: "September 2026" },
      { ...NOMINATION, label: "Wiper nomination window", state: "sourced", reported: true, note: "Reported, not confirmed by the party (Section 2.3)." },
      { date: ELECTION, label: "General election", state: "sourced", note: "The second Tuesday of August, fixed by the Constitution." },
    ],
  },
  columns: [
    { key: "event", label: "Event" },
    { key: "when", label: "When" },
    { key: "tier", label: "Tier" },
  ],
  rows: [
    { cells: { event: "This proposal", when: "September 2026", tier: "—" } },
    { cells: { event: "Wiper nomination window (reported)", when: NOMINATION.whenText, tier: "T3" } },
    { cells: { event: "General election", when: "10 August 2027", tier: "T1" } },
  ],
};

/* ------------------------------------------------------------------ the five objectives */

const OBJECTIVES = [
  {
    n: "1", title: "Be known where he isn't yet",
    target: `At least ${fmt("pool.share")}% of his reach landing in the ${fmt("pool")}-voter pool`,
    finding: "3.4", measure: "5.6.1", measureLabel: "NW-01, R-02", serves: "4.2",
  },
  {
    n: "2", title: "Turn his record into visible proof",
    target: "Ward-specific achievement briefs for every ward, distributed where he is least known",
    finding: "3.5", measure: "5.6.4", measureLabel: "R-03", serves: "4.1",
  },
  {
    n: "3", title: "A direct line to the voters the internet doesn't reach",
    target: `${fmt("target.sms")} consented SMS/USSD subscribers by 30 June 2027`,
    finding: "3.8", measure: "5.6.1", measureLabel: "NW-03, R-04", serves: "4.6",
  },
  {
    n: "4", title: "Give every post a voter, a ward and a reason",
    target: "Every briefed post coded with segment, ward and pillar",
    finding: "3.2", measure: "5.6.4", measureLabel: "R-05", serves: "4.5",
  },
  {
    n: "5", title: "Hold the home base while Kitui Central runs its own race",
    target: "Reach and engagement in Kitui Central at or above the Week 1 baseline",
    finding: "3.6", measure: "5.5.3", measureLabel: "Monthly report", serves: "4.2",
  },
];

export const FIG_1_3: FigureSpec = {
  id: "fig-1-3-objectives",
  section: "1.3",
  title: "Each of the five objectives answers one finding and is judged by one observable measure",
  question: "What are the five objectives, and what does each serve?",
  takeaway: "No objective stands on its own: each starts from a finding in Section 3 and ends in an indicator in Section 5.6.",
  sources: [{ name: "This proposal, Sections 3 and 5.6", tier: null, state: "target" }],
  chart: {
    type: "cards",
    columns: 3,
    cards: OBJECTIVES.map((o) => ({
      kicker: `Objective ${o.n}`,
      title: o.title,
      body: o.target,
      meta: `Target, set by this proposal`,
      links: [
        { label: `Finding ${o.finding}`, href: secHref(o.finding) },
        { label: `Strategy ${o.serves}`, href: secHref(o.serves) },
        { label: `Measure: ${o.measureLabel}`, href: secHref(o.measure) },
      ],
    })),
  },
  columns: [
    { key: "objective", label: "Objective" },
    { key: "target", label: "Target" },
    { key: "finding", label: "Finding" },
    { key: "strategy", label: "Strategy" },
    { key: "measure", label: "Measured by" },
  ],
  rows: OBJECTIVES.map((o) => ({ cells: { objective: `${o.n}. ${o.title}`, target: o.target, finding: `Section ${o.finding}`, strategy: `Section ${o.serves}`, measure: o.measureLabel }, state: "target" as const })),
};

/* ------------------------------------------------------------------ how the engagement runs */

export const FIG_1_4: FigureSpec = {
  id: "fig-1-4-flow",
  section: "1.4",
  title: "Firefly analyses, sets the strategy and directs; his team keeps publishing throughout",
  question: "How does the engagement run?",
  takeaway: "Firefly publishes nothing on his accounts: the only channel it operates directly is the WhatsApp and USSD line it already holds.",
  sources: [{ name: "This proposal, Sections 5.3 and 5.7", tier: null, state: "target" }],
  chart: {
    type: "steps",
    horizontal: true,
    lanes: ["Firefly", "His team"],
    steps: [
      { lane: "Firefly", when: "Week 1", title: "Analyse", body: "Audits ninety days of his channels against the same window for the two nomination rivals." },
      { lane: "Firefly", when: "Weeks 2–3", title: "Strategise", body: "Defines what to post, for whom, in which language, on which channel, and why." },
      { lane: "Firefly", when: "Week 4 on", title: "Direct", body: "Issues the weekly brief, approves the calendar, reviews performance. Operates the WhatsApp and USSD line: the only channel it runs directly." },
      { lane: "His team", when: "Week 1", title: "Grants read-only analytics", body: "Insights exports only; no publishing credentials change hands." },
      { lane: "His team", when: "Weeks 2–3", title: "Keeps publishing", body: "Current output continues while the strategy is set." },
      { lane: "His team", when: "Week 4 on", title: "Publishes to the brief", body: "Produces and posts against the weekly brief; the Monday review closes the loop." },
    ],
  },
  columns: [
    { key: "phase", label: "Phase" },
    { key: "firefly", label: "Firefly" },
    { key: "team", label: "His team" },
  ],
  rows: [
    { cells: { phase: "Analyse (Week 1)", firefly: "Audits his channels against the two nomination rivals", team: "Grants read-only analytics" } },
    { cells: { phase: "Strategise (Weeks 2–3)", firefly: "Defines what to post, for whom, where and why", team: "Keeps publishing" } },
    { cells: { phase: "Direct (Week 4 on)", firefly: "Weekly brief, calendar approval, performance review; operates WhatsApp and USSD", team: "Publishes to the brief" } },
  ],
};

/* ------------------------------------------------------------------ the scorecard */

export const FIG_1_5: FigureSpec = {
  id: "fig-1-5-scorecard",
  section: "1.5",
  title: "Every measure of success is observable on his channels or the SMS list, and each baseline is set in Week 1",
  question: "How will success be judged?",
  takeaway: "The scorecard starts empty by design: the Week 1 export sets each baseline from his own channels and the SMS list.",
  sources: [{ name: "Baselines: set in Week 1 from his Insights export", tier: null, state: "target" }, { name: "Targets: this proposal", tier: null, state: "target" }],
  chart: {
    type: "gauges",
    items: OBJECTIVES.map((o) => ({ code: `Objective ${o.n} · ${o.measureLabel}`, title: o.title, target: o.target, baseline: "set in Week 1", share: null })),
  },
  columns: [
    { key: "objective", label: "Objective" },
    { key: "baseline", label: "Baseline" },
    { key: "target", label: "Target" },
    { key: "indicator", label: "Indicator" },
  ],
  rows: OBJECTIVES.map((o) => ({ cells: { objective: `${o.n}. ${o.title}`, baseline: "Set in Week 1", target: o.target, indicator: o.measureLabel }, state: "target" as const })),
};

export const S1: FigureSpec[] = [FIG_1_1, FIG_1_3, FIG_1_4, FIG_1_5];
