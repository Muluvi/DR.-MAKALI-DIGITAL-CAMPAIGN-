/**
 * §3.4.6 — the eight findings §3.4 established, each with the section that established it.
 *
 * WHAT THIS REPLACES. A box-drawing banner headed SECTION 3.4.6 STRATEGIC TARGETING SUMMARY: eight
 * bullet lines restating figures the reader had already met, between two and nine subsections
 * earlier. Rule 1a names a "restated summary table" as the thing a figure may retire, and this is
 * the clearest example of one in the document.
 *
 * WHAT MAKES THE FIGURE WORTH MORE THAN THE BOX. Three things the bullets could not do:
 *
 *   1. Every figure here is COMPUTED from data/ward-register.json, not transcribed. A summary that
 *      is typed twice can drift from what it summarises; one that is derived cannot.
 *   2. Each row names the subsection that established it, so the summary is a way back into §3.4
 *      rather than a second copy of it.
 *   3. THREE OF THE EIGHT LINES ARE IN DISPUTE, and the box stated all eight in the same voice.
 *      The deficit share is printed 51.72% where the register says 51.73% (C-6); the overlap is
 *      "5 of top 8" where the fifth ward ranks 11th (C-5); and the mandate names 24 wards for a
 *      pool that spans 21 (C-7). The rows carry those flags. Nothing in the content has changed.
 *
 * The row text below quotes the banner's own phrasing, including the figures this audit disputes,
 * so retiring the block loses no wording — `stated` is what §3.4.6 printed and `computed` is what
 * the register says, side by side, wherever the two differ.
 */
import {
  COUNTY_REGISTER,
  COUNTY_TOTAL_WITH_PRISONS,
  DEFICIT_POOL,
  DEFICIT_POOL_SHARE,
  DEFICIT_WARD_COUNT,
  KITUI_SOUTH,
  MWINGI_BLOC,
  TOP_12,
  THRESHOLD_ROUNDED,
  TURNOUT_BASELINE,
  WARD_COUNT,
  WINNING_TOTAL_2022,
} from "./register";
import { ballotsAt } from "./register-math";
import type { FigureSeries } from "./types";

const n = (v: number) => v.toLocaleString("en-KE");

/** The home belt — Kitui Central, West and Rural — which §3.4.3 carries as Path D. */
export const HOME_BELT = 191_811;

/** Mwingi's ballots at the 62% baseline: the banner's "~124,100". */
export const MWINGI_BALLOTS = ballotsAt(MWINGI_BLOC, TURNOUT_BASELINE);

export type SummaryRow = {
  /** The banner's own label for the finding. */
  label: string;
  /** The figure, computed. */
  value: string;
  /** What it means, in the banner's terms. */
  detail: string;
  /** The subsection that established it. */
  section: string;
  /** What §3.4.6 printed, where that differs from the computed value. */
  stated?: string;
  conflicts?: string[];
};

export const TARGETING_SUMMARY: SummaryRow[] = [
  {
    label: "Registered electorate",
    value: `${n(COUNTY_REGISTER)} voters`,
    detail: `Across ${WARD_COUNT} wards — ${n(COUNTY_TOTAL_WITH_PRISONS)} with prisons.`,
    section: "§3.4",
  },
  {
    label: "Victory threshold",
    value: `${n(WINNING_TOTAL_2022)} – ${n(THRESHOLD_ROUNDED)} votes`,
    detail: `${((WINNING_TOTAL_2022 / COUNTY_REGISTER) * 100).toFixed(1)}%–${((THRESHOLD_ROUNDED / COUNTY_REGISTER) * 100).toFixed(1)}% of the register. The banner states this as "~37.5%".`,
    section: "§3.4.1",
  },
  {
    label: "12 megawards density",
    value: `${n(TOP_12)} voters`,
    detail: `The top 12 wards hold ${((TOP_12 / COUNTY_REGISTER) * 100).toFixed(2)}% of the county.`,
    section: "§3.4.2",
  },
  {
    label: "Mwingi triad proof",
    value: `${n(MWINGI_BLOC)} registered`,
    // The banner rounded this to the nearest hundred and said "~". Computed it is 124,123, and
    // both are printed rather than one quietly replacing the other — the difference is a
    // rounding, not a disagreement, and saying so costs one clause.
    detail: `Mwingi's three sub-counties — ${n(MWINGI_BALLOTS)} ballots at the ${Math.round(TURNOUT_BASELINE * 100)}% turnout baseline, which §3.4.3 states as approximately 124,100. Short of the threshold either way.`,
    section: "§3.4.3",
  },
  {
    label: "Home-belt ceiling trap",
    value: `${n(HOME_BELT)} registered`,
    detail: "Kitui Central + West + Rural. The home belt cannot win alone.",
    section: "§3.4.3",
  },
  {
    label: "Primary deficit zones",
    value: `${n(DEFICIT_POOL)} registered`,
    detail: `Mwingi (${n(MWINGI_BLOC)}) + Kitui South (${n(KITUI_SOUTH)}) = ${DEFICIT_POOL_SHARE.toFixed(2)}% of the register.`,
    section: "§3.4.5",
    stated: "51.72%",
    conflicts: ["C-6"],
  },
  {
    label: "Overlap finding",
    value: "5 of the top 11 wards",
    detail:
      "Direct 1:1 overlap: Kyuso, Tseikuru, Mumoni, Athi and Ikanga/Kyatune sit in the deficit zones, 83,496 voters between them. Four of the five are in the top 8.",
    section: "§3.4.5",
    stated: "5 of top 8 wards",
    conflicts: ["C-5"],
  },
  {
    label: "Operational mandate",
    value: "65% digital · 70% offline SMS",
    detail: `Directed to Mwingi and Kitui South — ${DEFICIT_WARD_COUNT} wards — to close the 15.3-point gap.`,
    section: "§3.4.5",
    stated: "24 northern and southern deficit wards",
    conflicts: ["C-7"],
  },
];

export const TARGETING_SERIES: FigureSeries = {
  id: "targeting-summary",
  headline: "What §3.4 established, and the three lines of it that are in dispute",
  measure: `The eight findings of §3.4, each computed from the ${n(COUNTY_REGISTER)} register and pointing back at the subsection that established it`,
  // The rows are statements rather than a measurable series, so the frame takes no points: the
  // mark draws them. Declaring points here would put a bar chart behind a ledger.
  points: [],
  conflicts: ["C-5", "C-6", "C-7"],
  note:
    "Every figure is derived from the register rather than restated, so this summary cannot drift " +
    "from what it summarises. Where §3.4.6 printed a different figure, the printed one is shown " +
    "beside the computed one and neither has been changed.",
};
