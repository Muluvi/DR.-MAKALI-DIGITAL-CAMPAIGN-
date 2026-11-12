/**
 * Section 1, Next Steps: what the campaign provides, what is still open, and the decision.
 */
import type { FigureSpec } from "../types.ts";
import { fmt } from "./_util.ts";

const DEPS: { item: string; gating: boolean; why: string }[] = [
  { item: "One named counterpart who approves, and one named lead on the digital team who receives the brief", gating: true, why: "Decisions in one place" },
  { item: "The team's own analytics exports from every channel, entered on the platform: no access to the accounts changes hands", gating: true, why: "Without them there is nothing to analyse and the engagement cannot start" },
  { item: "Appointment of the data-protection reviewer", gating: true, why: "The long-lead item; gates the voter-file work and the offline layer" },
  { item: "About three hours a week of candidate time", gating: false, why: "One Facebook Live, one voice-note session, one interview or content block" },
  { item: "Daily photo and video uploads from the ground team", gating: false, why: "The raw material of Pillar 4" },
  { item: "The IEBC 2026 register, county total then ward", gating: false, why: `The highest-priority data request: it re-bases every ward figure in Section 3. The county total, ${fmt("register.2026")}, is Tier 3 and unconfirmed until IEBC's own July figure is in hand` },
  { item: "Access to the NG-CDF project record, not the beneficiary list", gating: false, why: "Verified proof points; beneficiary data is off-limits" },
  { item: "Sign-off on the engagement level", gating: false, why: "So the team can be assembled" },
  { item: "Wiper's 2027 nomination rules and timetable, or the NEC resolution, as soon as the party issues them", gating: false, why: "The document that confirms or overturns the Phase −1 plan" },
];

export const FIG_6_1: FigureSpec = {
  id: "fig-6-1-dependencies",
  section: "1.7",
  title: `The campaign provides ${DEPS.length} things, and three of them gate everything else`,
  question: "What does the campaign provide?",
  takeaway: "A counterpart, the team's analytics exports and the data-protection reviewer come first; the rest follow once the engagement is running.",
  sources: [{ name: "This proposal, Section 22.2", tier: null, state: "target" }],
  chart: { type: "steps", steps: DEPS.map((d, i) => ({ when: d.gating ? `${i + 1} · gating` : `${i + 1}`, title: d.item, body: d.why, current: d.gating })) },
  columns: [{ key: "n", label: "#", numeric: true }, { key: "item", label: "Dependency" }, { key: "gating", label: "Gates the rest" }, { key: "why", label: "Why" }],
  rows: DEPS.map((d, i) => ({ cells: { n: i + 1, item: d.item, gating: d.gating ? "Yes" : "No", why: d.why } })),
};

export const FIG_6_3: FigureSpec = {
  id: "fig-6-3-decision",
  section: "1.1",
  title: "The ask is one decision, to approve the first phase; every later phase follows proof",
  question: "What is being asked?",
  takeaway: `Each phase starts only once the one before it is accepted, so the campaign never commits beyond what has been shown to work, and the ${fmt("pool")}-voter pool is where the work goes.`,
  sources: [{ name: "This proposal", tier: null, state: "target" }],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "The decision",
        chart: {
          type: "cards",
          columns: 2,
          cards: [
            { kicker: "The ask", title: "Approve the first phase", body: "Discovery: an executed audit, every user mapped to a role, the legal position scoped. Nothing beyond it is committed.", tone: "accent" },
            { kicker: "What follows", title: "Proof, then the next decision", body: "Each later phase starts once the one before it is accepted, and the campaign can stop at any of them." },
          ],
        },
      },
      {
        heading: "Six implementation phases, each accepted before the next",
        chart: {
          type: "steps",
          steps: [
            { when: "1", title: "Discovery", body: "If it stops here, the campaign keeps the audit, the plan and the public tools.", current: true },
            { when: "2", title: "Readiness", body: "The live database proven, backups and monitoring; the central team starts entering." },
            { when: "3", title: "Pilot", body: "The centre and two contrasting constituencies run the weekly cycle on the platform." },
            { when: "4", title: "County rollout", body: "All 40 wards reporting; every coordinator trained on their own phone." },
            { when: "5", title: "Optimisation", body: "Monthly service reports, patching, restore tests and the weekly management pack." },
            { when: "6", title: "Election-day readiness", body: "Change freeze, rehearsed fallbacks and on-call cover to the close of polling-day support." },
          ],
        },
      },
    ],
  },
  columns: [{ key: "when", label: "Phase" }, { key: "what", label: "What the campaign can do at the end" }],
  rows: [
    { cells: { when: "1. Discovery", what: "Decide on facts: an executed audit, every user mapped to a role, the legal position scoped" } },
    { cells: { when: "2. Readiness", what: "Let the central team start entering, on a proven database with backups and monitoring" } },
    { cells: { when: "3. Pilot", what: "Run the weekly cycle on the platform with the centre and two constituencies" } },
    { cells: { when: "4. County rollout", what: "See all 40 wards reporting, every coordinator trained" } },
    { cells: { when: "5. Optimisation", what: "Rely on it: monthly service reports, patching, restore tests" } },
    { cells: { when: "6. Election-day readiness", what: "Know its own operation is in place on the day: rehearsed fallbacks, change freeze, on-call cover" } },
  ],
};

export const S6: FigureSpec[] = [FIG_6_1, FIG_6_3];
