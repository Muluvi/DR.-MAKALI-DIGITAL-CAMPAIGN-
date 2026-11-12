/**
 * The campaign calendar, in one file: the five phases, the nomination decision window, and the
 * election. Every figure, rail and chip that names a phase or the window reads it from here
 * (consolidation pass, Step 1: docs/consolidation-2026-11/DECISIONS.md D1.3).
 *
 * Two things that used to be confused, kept apart:
 *
 *   NOMINATION_WINDOW  when Wiper decides its candidate. Not Firefly's: reported for late October to
 *                      November 2026 by a single source (Tier 3), and bounded by law: party primaries
 *                      must be held by 8 May 2027 (Tier 1, IEBC Gazette Notice 13501). Its home in
 *                      prose is "How Wiper chooses its candidate" (The race for 2027).
 *   The Nomination sprint (phase "neg1")
 *                      the team's own work period aimed at that decision: Weeks 1–6 from signature.
 *
 * The Nomination sprint and Set-up are counted from signature; Awareness, Persuasion and Turnout keep
 * their calendar dates, because the electoral calendar sets them (Timeline to August 2027).
 *
 * Re-anchored on 8 November 2026 (docs/toc-2026-11/APPLIED.md), when the proposal was revised
 * unsigned. The September plan ran Awareness from October, which the Set-up it depends on (the SMS
 * layer, the tracker, the analytics) cannot precede. The calendar phases now follow the IEBC's own
 * timetable (Gazette Notice 13501, data/public-2026-11/kitui-governor-race-calendar-2027.csv):
 * Awareness as Set-up completes, Persuasion up to the 8 May 2027 deadline for party primaries, and
 * Turnout from the primaries through the 3–6 June governor nominations and the campaign period to
 * election day.
 *
 * To edit: change a window here. `start`/`end` place a phase on the dated timeline (fig-5-4); for
 * the two phases counted from signature they are computed from PLANNING_SIGNATURE, the month this
 * proposal assumes it is signed, and the reader sees the weeks (`window`), not those dates.
 */

export interface Phase {
  id: string;
  label: string;
  /** The window as a reader sees it. */
  window: string;
  /** What the phase is for, in a few words. */
  focus: string;
  colorVar: string; // CSS custom property name, e.g. "--phase-1"
  /** Weeks from signature, for the two phases counted that way. */
  weeks?: { from: number; to: number };
  /** Calendar dates (ISO), for the three phases the electoral calendar sets. */
  dates?: { start: string; end: string };
}

/** The month this proposal assumes it is signed: the origin of "Week 1". A planning assumption. */
export const PLANNING_SIGNATURE = "2026-12-01";

/** Election day: the second Tuesday of August, fixed by the Constitution (Article 101). */
export const ELECTION_DAY = "2027-08-10";

export const PHASES: Phase[] = [
  { id: "neg1", label: "Nomination sprint", window: "Weeks 1–6", focus: "The team's work aimed at the Wiper decision", colorVar: "--phase-neg1", weeks: { from: 1, to: 6 } },
  { id: "0", label: "Set-up", window: "Weeks 4–10 · Instrumentation", focus: "instrumentation", colorVar: "--phase-0", weeks: { from: 4, to: 10 } },
  { id: "1", label: "Awareness", window: "Jan–Feb 2027 · Awareness & Community", focus: "awareness and community building", colorVar: "--phase-1", dates: { start: "2027-01-01", end: "2027-02-28" } },
  { id: "2", label: "Persuasion", window: "Mar–May 2027 · Engagement & Persuasion", focus: "engagement and persuasion", colorVar: "--phase-2", dates: { start: "2027-03-01", end: "2027-05-08" } },
  { id: "3", label: "Turnout", window: "May–Aug 2027 · Mobilisation & GOTV", focus: "mobilisation and turnout", colorVar: "--phase-3", dates: { start: "2027-05-09", end: ELECTION_DAY } },
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
  /** The latest the decision can come, by law: party primaries are held by this date. */
  deadline: "2027-05-08",
  deadlineText: "8 May 2027",
  deadlineTier: "T1" as const,
  deadlineSource: "IEBC Gazette Notice 13501 (20 August 2026): party primaries held and disputes resolved by 8 May 2027",
};

const DAY = 24 * 60 * 60 * 1000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

/** A phase's dated span: its calendar dates, or its weeks placed from the planning signature. */
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

/** The window as a reader sees it, without the focus suffix: "Weeks 1–6 from signature", "Jan–Feb 2027". */
export function phaseWhen(p: Phase): string {
  return p.weeks ? `Weeks ${p.weeks.from}–${p.weeks.to} from signature` : p.window.split(" · ")[0];
}

export function phaseColor(id: string): string {
  const phase = PHASES.find((p) => p.id === id);
  return `var(${phase?.colorVar ?? "--color-accent"})`;
}
