// The two published Mizani Africa rounds, and the deficits derived from them.
//
// This is the document's thesis in numbers, so it lives in one place and every surface that
// draws it reads from here. Nothing below is asserted: the shares are as published, and the
// deficits are subtractions of them, computed rather than typed so they cannot drift from the
// shares they come from.
//
// Ngilu carries no June figure because she was not in that round. That is a data gap, not a
// zero, and it is represented as `null` so nothing can plot her at the origin — the same rule
// the KPI baselines follow.
import { MIZANI_AFRICA } from "./sources";
import type { Source } from "./types";

export interface ContestRound {
  /** As printed in §2.2. */
  label: string;
  short: string;
  date: string;
  shares: {
    kasalu: number;
    mulu: number;
    wambua: number;
    /** Not polled in June. Null is the honest value; zero would be a false reading. */
    ngilu: number | null;
  };
}

export const CONTEST_ROUNDS: ContestRound[] = [
  {
    label: "Mizani Africa, June 2026",
    short: "Jun 2026",
    date: "2026-06",
    shares: { kasalu: 31.3, mulu: 20.2, wambua: 16.3, ngilu: null },
  },
  {
    label: "Mizani Africa, 7 Aug 2026",
    short: "Aug 2026",
    date: "2026-08-07",
    shares: { kasalu: 37.4, mulu: 22.1, wambua: 14.3, ngilu: 17.0 },
  },
];

export const CONTEST_SOURCE: Source = MIZANI_AFRICA;

export const LATEST_ROUND = CONTEST_ROUNDS[CONTEST_ROUNDS.length - 1];
export const FIRST_ROUND = CONTEST_ROUNDS[0];

/** One decimal place, matching how every share in this document is printed. */
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Leader's share minus Dr. Mulu's, per round. Derived, never asserted. */
export const deficitFor = (r: ContestRound) => round1(r.shares.kasalu - r.shares.mulu);

/** 31.3 − 20.2 */
export const DEFICIT_FIRST = deficitFor(FIRST_ROUND);
/** 37.4 − 22.1 */
export const DEFICIT_LATEST = deficitFor(LATEST_ROUND);
/** The trend, and the reason this is urgent rather than merely bad. */
export const DEFICIT_WIDENING = round1(DEFICIT_LATEST - DEFICIT_FIRST);

/** The ceiling for the opposed columns — leaves headroom above the leader's share. */
export const SHARE_AXIS_MAX = 45;
