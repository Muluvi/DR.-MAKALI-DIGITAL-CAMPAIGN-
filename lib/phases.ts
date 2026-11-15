/**
 * The campaign calendar, in one file: the five phases, the nomination decision window, and the
 * election. Every figure, rail and chip that names a phase or the window reads it from here
 * (consolidation pass, Step 1: docs/consolidation-2026-11/DECISIONS.md D1.3).
 *
 * Two things that used to be confused, kept apart:
 *
 *   NOMINATION_WINDOW  when Wiper decides its candidate. Not Firefly's: reported for late October to
 *                      November 2026 by a single source (Tier 3). Shown only in the Timeline's
 *                      milestone, "Securing the ballot line" (timeline-sec-14-0; flow pass, Q5).
 *   The Ballot line (phase "neg1")
 *                      the team's own work period aimed at that decision: Weeks 1–6 from the go-ahead.
 *
 * The Ballot line and Set-up are counted from the go-ahead; Awareness, Persuasion and Turnout keep
 * their calendar dates, because the electoral calendar sets them (Timeline to Aug 2027).
 *
 * To edit: change a window here. `start`/`end` place a phase on the dated timeline (fig-5-4); for
 * the two phases counted from the go-ahead they are computed from PLANNING_SIGNATURE, an assumed
 * start kept until the go-ahead date is known. No date computed from it is shown: the reader sees
 * the weeks (`window`), not those dates (Firefly's decision Q5, docs/flow-2026-11/FLOW-PLAN.md).
 */

export interface Phase {
  id: string;
  label: string;
  /** The window as a reader sees it. */
  window: string;
  /** What the phase is for, in a few words. */
  focus: string;
  colorVar: string; // CSS custom property name, e.g. "--phase-1"
  /** Weeks from the go-ahead, for the two phases counted that way. */
  weeks?: { from: number; to: number };
  /** Calendar dates (ISO), for the three phases the electoral calendar sets. */
  dates?: { start: string; end: string };
}

/** The assumed go-ahead: the origin of "Week 1" on the dated timeline only. A planning assumption, never shown as a date. */
export const PLANNING_SIGNATURE = "2026-09-01";

/** Election day: the second Tuesday of August, fixed by the Constitution (Article 101). */
export const ELECTION_DAY = "2027-08-10";

export const PHASES: Phase[] = [
  { id: "neg1", label: "Ballot line", window: "Weeks 1–6", focus: "Securing the nomination that puts him on the ballot", colorVar: "--phase-neg1", weeks: { from: 1, to: 6 } },
  { id: "0", label: "Set-up", window: "Weeks 4–10 · Instrumentation", focus: "instrumentation", colorVar: "--phase-0", weeks: { from: 4, to: 10 } },
  { id: "1", label: "Awareness", window: "Oct–Dec 2026 · Awareness & Community", focus: "awareness and community building", colorVar: "--phase-1", dates: { start: "2026-10-01", end: "2026-12-31" } },
  { id: "2", label: "Persuasion", window: "Jan–Mar 2027 · Engagement & Persuasion", focus: "engagement and persuasion", colorVar: "--phase-2", dates: { start: "2027-01-01", end: "2027-03-31" } },
  { id: "3", label: "Turnout", window: "Apr–Aug 2027 · Mobilisation & GOTV", focus: "mobilisation and turnout", colorVar: "--phase-3", dates: { start: "2027-04-01", end: ELECTION_DAY } },
];

/** When Wiper decides its candidate: reported, not confirmed (Tier 3). Not one of the campaign's phases. */
export const NOMINATION_WINDOW = {
  label: "How Wiper chooses its candidate",
  date: "2026-10-20",
  end: "2026-11-30",
  whenText: "Late October to November 2026",
  /** The same window, short enough for an inline chip. */
  short: "late Oct–Nov 2026",
  tier: "T3" as const,
  source: "Nomination window: a single-source campaign report, not confirmed by the party",
};

const DAY = 24 * 60 * 60 * 1000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

/** A phase's dated span: its calendar dates, or its weeks placed from the assumed go-ahead. */
export function phaseSpan(p: Phase): { start: string; end: string } {
  if (p.dates) return p.dates;
  const origin = Date.parse(PLANNING_SIGNATURE);
  const w = p.weeks ?? { from: 1, to: 1 };
  return { start: iso(origin + (w.from - 1) * 7 * DAY), end: iso(origin + w.to * 7 * DAY - DAY) };
}

/** The phase's name with what it is for, without saying a word twice: "Set-up: instrumentation", "Awareness and community building". */
export function phaseTitle(p: Phase): string {
  if (p.focus.toLowerCase().includes(p.label.toLowerCase())) return p.focus.charAt(0).toUpperCase() + p.focus.slice(1);
  return `${p.label}: ${p.focus}`;
}

/** The first letter lower-cased, for a phrase set inside a sentence: "late October to November 2026". */
export const inSentence = (t: string): string => t.charAt(0).toLowerCase() + t.slice(1);

/** The window as a reader sees it, without the focus suffix: "Weeks 1–6 from the go-ahead", "Oct–Dec 2026". */
export function phaseWhen(p: Phase): string {
  return p.weeks ? `Weeks ${p.weeks.from}–${p.weeks.to} from the go-ahead` : p.window.split(" · ")[0];
}

/**
 * Whether a dated window has passed, by the rule the Governor Race Calendar uses: a date is passed
 * once today's date in Nairobi is after it. `today` is YYYY-MM-DD, or null before the browser has read it.
 */
export const isPassed = (endIso: string, today: string | null): boolean => today !== null && endIso < today;

export function phaseColor(id: string): string {
  const phase = PHASES.find((p) => p.id === id);
  return `var(${phase?.colorVar ?? "--color-accent"})`;
}
