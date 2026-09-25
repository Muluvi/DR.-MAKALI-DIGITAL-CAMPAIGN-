/**
 * Section 6, Next Steps: what the campaign provides, what is still open, and the decision.
 */
import type { FigureSpec } from "../types.ts";
import { fmt } from "./_util.ts";

const DEPS: { item: string; gating: boolean; why: string }[] = [
  { item: "One named counterpart who approves, and one named lead on the digital team who receives the brief", gating: true, why: "Decisions in one place" },
  { item: "Read-only analytics access on every channel: Analyst role, no publishing rights", gating: true, why: "Without it there is nothing to analyse and the engagement cannot start" },
  { item: "Appointment of the data-protection reviewer (Section 5.7.9)", gating: true, why: "The long-lead item; gates the voter-file work and the offline layer" },
  { item: "About three hours a week of candidate time", gating: false, why: "One Facebook Live, one voice-note session, one interview or content block" },
  { item: "Daily photo and video uploads from the ground team", gating: false, why: "The raw material of Pillar 4" },
  { item: "The IEBC 2026 register, county total then ward", gating: false, why: `The highest-priority data request: it re-bases every ward figure in Section 3. The county total, ${fmt("register.2026")}, is Tier 3 and unconfirmed until IEBC's own July figure is in hand` },
  { item: "Access to the NG-CDF project record, not the beneficiary list", gating: false, why: "Verified proof points; beneficiary data is off-limits" },
  { item: "Sign-off on the engagement level", gating: false, why: "So the team can be assembled" },
  { item: "Wiper's 2027 nomination rules and timetable, or the NEC resolution, as soon as the party issues them", gating: false, why: "The document that confirms or overturns the Phase −1 plan (Section 2.3.2)" },
];

export const FIG_6_1: FigureSpec = {
  id: "fig-6-1-dependencies",
  section: "6.1",
  title: `The campaign provides ${DEPS.length} things, and three of them gate everything else`,
  question: "What does the campaign provide?",
  takeaway: "A counterpart, read-only access and the data-protection reviewer come first; the rest follow once the engagement is running.",
  sources: [{ name: "This proposal, Section 6.1", tier: null, state: "target" }],
  chart: { type: "steps", steps: DEPS.map((d, i) => ({ when: d.gating ? `${i + 1} · gating` : `${i + 1}`, title: d.item, body: d.why, current: d.gating })) },
  columns: [{ key: "n", label: "#", numeric: true }, { key: "item", label: "Dependency" }, { key: "gating", label: "Gates the rest" }, { key: "why", label: "Why" }],
  rows: DEPS.map((d, i) => ({ cells: { n: i + 1, item: d.item, gating: d.gating ? "Yes" : "No", why: d.why } })),
};

export const FIG_6_3: FigureSpec = {
  id: "fig-6-3-decision",
  section: "6.3",
  title: "The ask is one week and one export, because the nomination window sets the clock",
  question: "What is being asked?",
  takeaway: `Each week of delay is a week less of directed output before a window reported for late October; the ${fmt("pool")}-voter pool is where that output goes.`,
  sources: [{ name: "Nomination window: single-source report", tier: "T3" }, { name: "This proposal", tier: null, state: "target" }],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "The decision",
        chart: {
          type: "cards",
          columns: 2,
          cards: [
            { kicker: "The ask", title: "One week and one export", body: "Read-only analytics access and the ninety-day export. Everything after that is evidence.", tone: "accent" },
            { kicker: "What it starts", title: "The presence audit, then the first brief", body: "About six weeks for a first directed cycle, the first of them the audit that sets its targets." },
          ],
        },
      },
      {
        heading: "Week 1",
        chart: {
          type: "steps",
          horizontal: true,
          steps: [
            { when: "Day 1", title: "Access granted", body: "Analyst role on Meta and equivalents; no publishing rights change hands." },
            { when: "Days 1–2", title: "The export", body: "Ninety days of reach, engagement, language and geography; the Page-or-profile question settled." },
            { when: "Days 2–4", title: "Against the field", body: "The same window for the two nomination rivals, on public data." },
            { when: "Day 5", title: "The read", body: "The four audit figures filled, the diagnosis tested, the first brief drafted for Week 2." },
          ],
        },
      },
    ],
  },
  columns: [{ key: "when", label: "When" }, { key: "what", label: "What happens" }],
  rows: [
    { cells: { when: "Day 1", what: "Read-only analytics access granted" } },
    { cells: { when: "Days 1–2", what: "Ninety-day export pulled; Page-or-profile settled" } },
    { cells: { when: "Days 2–4", what: "Same window for the two nomination rivals, public data" } },
    { cells: { when: "Day 5", what: "Audit read; diagnosis tested; first brief drafted" } },
  ],
};

export const S6: FigureSpec[] = [FIG_6_1, FIG_6_3];
