/**
 * Section 1, Objectives: the clock, the five objectives, how the engagement runs, and the scorecard.
 */
import type { FigureSpec } from "../types.ts";
import { fmt, secHref } from "./_util.ts";
import { ELECTION_DAY, NOMINATION_WINDOW, inSentence } from "../../phases.ts";

/* ------------------------------------------------------------------ the calendar, shared with 5.4 */

/** Where the reader stands on the timelines: the month this proposal was last revised. */
export const TODAY = "2026-11";
/** When the proposal was first prepared, kept on the timeline as its own event. */
const PREPARED = "2026-09";
/** The election and the nomination decision window, read from lib/phases.ts (the one calendar). */
export const ELECTION = ELECTION_DAY;
export const NOMINATION = { date: NOMINATION_WINDOW.date, end: NOMINATION_WINDOW.end, whenText: NOMINATION_WINDOW.whenText };
/** The legal deadline for party primaries (IEBC Gazette Notice 13501), drawn as its own event. */
export const PRIMARIES_DEADLINE = {
  date: NOMINATION_WINDOW.deadline,
  label: "Deadline for party primaries",
  state: "sourced" as const,
  whenText: NOMINATION_WINDOW.deadlineText,
  note: "The latest Wiper's decision can come, by law.",
};

/** Whole months from TODAY to election day, in words, so the clock never goes stale in a title. */
const MONTH_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const monthsLeft = (() => {
  const [ty, tm] = TODAY.split("-").map(Number);
  const [ey, em] = ELECTION_DAY.split("-").map(Number);
  return (ey - ty) * 12 + (em - tm);
})();
const MONTHS_LEFT = MONTH_WORDS[monthsLeft] ?? String(monthsLeft);

export const FIG_1_1: FigureSpec = {
  id: "fig-1-1-timeline",
  section: "1.2",
  title: `There are about ${MONTHS_LEFT} months to the election, and the Wiper decision comes first: reported for now, and due by ${NOMINATION_WINDOW.deadlineText} at the latest`,
  question: "How long is there?",
  takeaway: `The Wiper ticket is reported to be settled in ${inSentence(NOMINATION_WINDOW.whenText)}, and by law it is settled by ${NOMINATION_WINDOW.deadlineText} at the latest; everything the engagement does before then is aimed at it.`,
  sources: [{ name: NOMINATION_WINDOW.source, tier: NOMINATION_WINDOW.tier }, { name: NOMINATION_WINDOW.deadlineSource, tier: NOMINATION_WINDOW.deadlineTier }, { name: "General election date: Constitution of Kenya, Article 101", tier: "T1" }],
  chart: {
    type: "timeline",
    countdown: { date: ELECTION, label: "general election" },
    from: "2026-09-01",
    to: "2027-08-31",
    today: TODAY,
    events: [
      { date: PREPARED, label: "This proposal", state: "sourced", whenText: "September 2026, revised November 2026" },
      { ...NOMINATION, label: "Wiper nomination window", state: "sourced", reported: true, note: "Reported, not confirmed by the party." },
      PRIMARIES_DEADLINE,
      { date: ELECTION, label: "General election", state: "sourced", note: "The second Tuesday of August, fixed by the Constitution." },
    ],
  },
  columns: [
    { key: "event", label: "Event" },
    { key: "when", label: "When" },
    { key: "tier", label: "Tier" },
  ],
  rows: [
    { cells: { event: "This proposal", when: "September 2026, revised November 2026", tier: "—" } },
    { cells: { event: "Wiper nomination window (reported)", when: NOMINATION.whenText, tier: NOMINATION_WINDOW.tier } },
    { cells: { event: "Deadline for party primaries", when: NOMINATION_WINDOW.deadlineText, tier: NOMINATION_WINDOW.deadlineTier } },
    { cells: { event: "General election", when: "10 August 2027", tier: "T1" } },
  ],
};

/* ------------------------------------------------------------------ the five objectives */

const OBJECTIVES = [
  {
    n: "1", title: "Be known where he isn't yet",
    target: `At least ${fmt("pool.share")}% of his reach landing in the ${fmt("pool")}-voter pool`,
    finding: "2.7", measure: "5.1.1", measureLabel: "NW-01, R-02", serves: "3.3.1",
  },
  {
    n: "2", title: "Turn his record into visible proof",
    target: "Ward-specific achievement briefs for every ward, distributed where he is least known",
    finding: "2.6", measure: "5.1.2", measureLabel: "R-03", serves: "3.1",
  },
  {
    n: "3", title: "A direct line to the voters the internet doesn't reach",
    target: `${fmt("target.sms")} consented SMS/USSD subscribers by 30 June 2027`,
    finding: "2.9.3", measure: "5.1.1", measureLabel: "NW-03, R-04", serves: "3.3.2",
  },
  {
    n: "4", title: "Give every post a voter, a ward and a reason",
    target: "Every briefed post coded with segment, ward and pillar",
    finding: "2.3", measure: "5.1.2", measureLabel: "R-05", serves: "3.7",
  },
  {
    n: "5", title: "Hold the home base while Kitui Central runs its own race",
    target: "Reach and engagement in Kitui Central at or above the Week 1 baseline",
    finding: "2.7.2", measure: "1.5.3", measureLabel: "Monthly report", serves: "3.3.1",
  },
];

export const FIG_1_3: FigureSpec = {
  id: "fig-1-3-objectives",
  section: "1.3",
  title: "Each of the five objectives answers one finding and is judged by one observable measure",
  question: "What are the five objectives, and what does each serve?",
  takeaway: "No objective stands on its own: each starts from a finding in Section 2 and ends in an indicator in Section 18.1.",
  sources: [{ name: "This proposal, Sections 2 and 5.1", tier: null, state: "target" }],
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
  section: "1.4.1",
  title: "His team analyses, sets the strategy and directs on the platform, and keeps publishing throughout",
  question: "How does the work run?",
  takeaway: "Firefly publishes nothing on his accounts and operates no channel: it runs the platform the team works on.",
  sources: [{ name: "This proposal, Sections 14.1 and 13.4", tier: null, state: "target" }],
  chart: {
    type: "steps",
    horizontal: true,
    lanes: ["Strategy core", "His team"],
    steps: [
      { lane: "Strategy core", when: "Week 1", title: "Analyse", body: "Audits ninety days of his channels against the same window for the two nomination rivals." },
      { lane: "Strategy core", when: "Weeks 2–3", title: "Strategise", body: "Defines what to post, for whom, in which language, on which channel, and why." },
      { lane: "Strategy core", when: "Week 4 on", title: "Direct", body: "Issues the weekly brief, approves the calendar, reviews performance on the dashboards. Operates the WhatsApp and USSD line." },
      { lane: "His team", when: "Week 1", title: "Enters its analytics", body: "Insights exports, entered on the platform; no publishing credentials change hands." },
      { lane: "His team", when: "Weeks 2–3", title: "Keeps publishing", body: "Current output continues while the strategy is set." },
      { lane: "His team", when: "Week 4 on", title: "Publishes to the brief", body: "Produces and posts against the weekly brief; the Monday review closes the loop." },
    ],
  },
  columns: [
    { key: "phase", label: "Phase" },
    { key: "firefly", label: "Strategy core" },
    { key: "team", label: "His team" },
  ],
  rows: [
    { cells: { phase: "Analyse (Week 1)", firefly: "Audits his channels against the two nomination rivals", team: "Enters its analytics on the platform" } },
    { cells: { phase: "Strategise (Weeks 2–3)", firefly: "Defines what to post, for whom, where and why", team: "Keeps publishing" } },
    { cells: { phase: "Direct (Week 4 on)", firefly: "Weekly brief, calendar approval, performance review; operates WhatsApp and USSD", team: "Publishes to the brief" } },
  ],
};

/* ------------------------------------------------------------------ the scorecard */

export const FIG_1_5: FigureSpec = {
  id: "fig-1-5-scorecard",
  section: "1.9",
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
