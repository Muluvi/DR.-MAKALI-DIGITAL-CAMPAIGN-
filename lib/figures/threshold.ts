/**
 * The vote arithmetic, as one build-up: register → ballots → the votes that win.
 *
 * This is §3B's spine, and the one place in the document where the visual boldness is meant to be
 * spent. Everything here is computed from data/ward-register.json and the published register
 * comparison; nothing is transcribed from the prose, so a figure and the sentence beside it can
 * be compared rather than assumed to agree.
 *
 * TWO REGISTERS, AND THEY ARE NOT INTERCHANGEABLE. The 2022 ward register (532,758) is Tier 1 and
 * every ward figure in §3.4 rests on it. The 2026 register (605,703) is reported at Tier 3 in the
 * prose — "[VERIFY]", "not used in any calculation below" — and asserted as Tier 1 "confirmed
 * against the IEBC ECVR county annex" by the register panel. That is conflict C-9, and the
 * like-for-like step below inherits it: ≈225,000 is arithmetically sound (605,703 × 37.2%) and
 * rests on a figure whose tier the document does not agree with itself about.
 */
import {
  COUNTY_BALLOTS,
  COUNTY_REGISTER,
  THRESHOLD_ROUNDED,
  TURNOUT_BASELINE,
  WINNING_TOTAL_2022,
} from "./register";
import { IEBC_ECVR_2026, IEBC_WARD_REGISTER, IEBC_2022_RESULTS, IEBC_REGISTER_2026_REPORTED } from "../../data/sources";
import type { FigurePoint, FigureSeries } from "./types";

/** 2022's winning tally as a share of the 2022 register — the ratio the like-for-like step uses. */
export const WINNING_SHARE_2022 = WINNING_TOTAL_2022 / COUNTY_REGISTER;

/* ------------------------------------------------------------------ the 2026 register */

/** New registrations reported in the ECVR drive, to 28 April 2026. */
export const ECVR_NEW_REGISTRATIONS = 61_839;

/**
 * The remainder between 532,758 + 61,839 and the reported 605,703.
 *
 * Computed rather than typed, because the three numbers are quoted together in §3.4.1 as though
 * they add up and this is the only way to see whether they do. They do: 532,758 + 61,839 + 11,106
 * = 605,703 exactly.
 */
export const REGISTER_2026_REPORTED = 605_703;
export const ECVR_REMAINDER = REGISTER_2026_REPORTED - COUNTY_REGISTER - ECVR_NEW_REGISTRATIONS;

/** 37.2% of the reported 2026 register — §3.4.1's "[CALC, not a forecast]" like-for-like figure. */
export const LIKE_FOR_LIKE_THRESHOLD = Math.round(REGISTER_2026_REPORTED * 0.372);

/* ------------------------------------------------------------------ the build-up */

const officialRegister = {
  source: IEBC_WARD_REGISTER,
  tier: 1 as const,
  asOf: "2022",
  kind: "official" as const,
  granularity: "ward" as const,
};

/**
 * Step by step, and each step says what kind of number it is.
 *
 * The whole argument of §3B is that a register is not a vote — that 200,198 registered voters in
 * Mwingi is about 124,100 ballots, and that a bloc bigger than the 2022 winning total still loses
 * on its own. A build-up that drew all four steps identically would lose exactly that distinction,
 * so the turnout step and the threshold step are marked `calculated` and carry their working.
 */
export const THRESHOLD_STEPS: FigurePoint[] = [
  {
    label: "Registered voters, 2022",
    value: COUNTY_REGISTER,
    unit: "voters",
    ...officialRegister,
    note: "40 wards across 8 constituencies. A further 75 prison voters bring the register to 532,833.",
  },
  {
    label: `Ballots cast at ${(TURNOUT_BASELINE * 100).toFixed(0)}% turnout`,
    value: COUNTY_BALLOTS,
    unit: "ballots",
    source: IEBC_WARD_REGISTER,
    tier: 1,
    asOf: "2022",
    kind: "calculated",
    granularity: "county",
    note: `${COUNTY_REGISTER.toLocaleString("en-KE")} × ${(TURNOUT_BASELINE * 100).toFixed(0)}% — the county's historical turnout baseline.`,
  },
  {
    label: "Votes that won the seat in 2022",
    value: WINNING_TOTAL_2022,
    unit: "votes",
    source: IEBC_2022_RESULTS,
    tier: 1,
    asOf: "2022-08",
    kind: "official",
    granularity: "county",
    note: `Julius Malombe's certified total — ${(WINNING_SHARE_2022 * 100).toFixed(1)}% of the register, ${((WINNING_TOTAL_2022 / COUNTY_BALLOTS) * 100).toFixed(1)}% of ballots cast.`,
  },
  {
    label: "The threshold the campaign plans to",
    value: THRESHOLD_ROUNDED,
    unit: "votes",
    source: IEBC_2022_RESULTS,
    tier: 1,
    asOf: "2022-08",
    kind: "calculated",
    granularity: "county",
    note: `The rounded upper bound of the 198,004–200,000 band — ${((THRESHOLD_ROUNDED / COUNTY_BALLOTS) * 100).toFixed(1)}% of ballots cast, ${((THRESHOLD_ROUNDED / COUNTY_REGISTER) * 100).toFixed(1)}% of the register.`,
  },
];

/**
 * What winning requires, as shares rather than counts.
 *
 * Carried explicitly because the ASCII table this figure replaces stated it as a BAND — "60.0% to
 * 60.5% of all votes cast", "37.2% to 37.5% of total registered voters" — and rule 1a only allows
 * that block to be retired once every fact in it is shown here. A figure that carried the counts
 * and dropped the shares would be a smaller claim than the table it replaced.
 */
export const REQUIRED_SHARES = {
  ofBallotsLow: (WINNING_TOTAL_2022 / COUNTY_BALLOTS) * 100,
  ofBallotsHigh: (THRESHOLD_ROUNDED / COUNTY_BALLOTS) * 100,
  ofRegisterLow: (WINNING_TOTAL_2022 / COUNTY_REGISTER) * 100,
  ofRegisterHigh: (THRESHOLD_ROUNDED / COUNTY_REGISTER) * 100,
};

/**
 * The register as it stands in 2026, and what that does to the threshold.
 *
 * §3.4.1 is emphatic that 605,703 is not used in any calculation in that section, and this series
 * is presented separately for that reason rather than folded into the steps above. It carries C-9
 * on both points that rest on the 2026 figure.
 */
export const REGISTER_GROWTH: FigurePoint[] = [
  {
    label: "2022 register",
    value: COUNTY_REGISTER,
    unit: "voters",
    ...officialRegister,
  },
  {
    label: "New registrations, ECVR drive to 28 Apr 2026",
    value: ECVR_NEW_REGISTRATIONS,
    unit: "voters",
    source: IEBC_ECVR_2026,
    tier: 1,
    asOf: "2026-04-28",
    kind: "official",
    granularity: "county",
    note: "30-day Enhanced Continuous Voter Registration across all 1,450 wards.",
  },
  {
    label: "Remainder to the reported July 2026 total",
    value: ECVR_REMAINDER,
    unit: "voters",
    source: IEBC_REGISTER_2026_REPORTED,
    tier: 3,
    asOf: "2026-07",
    kind: "reported",
    granularity: "county",
    conflicts: ["C-9"],
    note: "Continuous registration outside the drive window. Derived: 605,703 − 532,758 − 61,839.",
  },
];

export const LIKE_FOR_LIKE: FigurePoint = {
  label: "The same 37.2% share of a 605,703 register",
  value: LIKE_FOR_LIKE_THRESHOLD,
  unit: "votes",
  source: IEBC_REGISTER_2026_REPORTED,
  tier: 3,
  asOf: "2026-07",
  kind: "calculated",
  granularity: "county",
  conflicts: ["C-9"],
  note: "§3.4.1 marks this [CALC, not a forecast]. It inherits the tier of the register it rests on, which the document states two ways.",
};

/* ------------------------------------------------------------------ series */

export const THRESHOLD_SERIES: FigureSeries = {
  id: "threshold-build-up",
  headline: `A register of ${COUNTY_REGISTER.toLocaleString("en-KE")} yields about ${COUNTY_BALLOTS.toLocaleString("en-KE")} ballots, and ${WINNING_TOTAL_2022.toLocaleString("en-KE")} of them won the seat`,
  measure: "Registered voters, ballots at the 62% turnout baseline, and the certified 2022 winning total",
  points: THRESHOLD_STEPS,
  note:
    `A register is not a vote. Winning takes ${REQUIRED_SHARES.ofBallotsLow.toFixed(1)}–${REQUIRED_SHARES.ofBallotsHigh.toFixed(1)}% of ` +
    `all ballots cast, or ${REQUIRED_SHARES.ofRegisterLow.toFixed(1)}–${REQUIRED_SHARES.ofRegisterHigh.toFixed(1)}% of the whole register. ` +
    `Every path in §3.4.3 is measured against the last two bars, not the first.`,
};

export const REGISTER_GROWTH_SERIES: FigureSeries = {
  id: "register-growth",
  headline: `The register has grown to a reported ${REGISTER_2026_REPORTED.toLocaleString("en-KE")}, which would put the same winning share near ${LIKE_FOR_LIKE_THRESHOLD.toLocaleString("en-KE")} votes`,
  measure: "2022 register, registrations added since, and the like-for-like threshold on the larger base",
  points: [...REGISTER_GROWTH, LIKE_FOR_LIKE],
  conflicts: ["C-9"],
  note: "§3.4.1 states that 605,703 is not used in any ward calculation. Treat ≈200,000 as a floor rather than a target.",
};
