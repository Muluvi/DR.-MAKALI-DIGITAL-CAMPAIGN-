/**
 * The register, bound: the pure arithmetic in ./register-math.ts applied to the real 40 wards.
 *
 * WHY THE DERIVED FIGURES ARE COMPUTED AND NOT TRANSCRIBED. §3.4 states around forty derived
 * figures — the top twelve wards, the deficit pool, four coalition paths, ballots at 62% — and
 * every one of them is a sum or a subtraction over the same forty ward numbers. Stated as text
 * they can drift, and this audit found that they have: the deficit pool is 51.72% in one
 * paragraph and 51.73% in the panel beside it, and Path B's margin is measured against a
 * threshold it does not name.
 *
 * So every figure below is computed. Where it agrees with the prose, the prose is simply right.
 * Where it disagrees, the disagreement is a CONFLICTS.md entry and the figure carries the Under
 * review flag — this file never silently corrects the document, because hard rule 2 makes
 * reconciling Firefly's job and not this pass's.
 */
import {
  CONSTITUENCIES,
  COUNTY_TOTAL_WARDS,
  COUNTY_TOTAL_WITH_PRISONS,
  PRISON_VOTERS,
} from "../../data/ward-register";
import {
  ballotsAt,
  blocTotal,
  bottomWards,
  countyTotal,
  rankWards,
  topWards,
  wardCount,
} from "./register-math";

export * from "./register-math";

/* ------------------------------------------------------------------ bound to the real register */

export const WARD_RANKING = rankWards(CONSTITUENCIES);
export const COUNTY_REGISTER = countyTotal(CONSTITUENCIES);
export const WARD_COUNT = wardCount(CONSTITUENCIES);
export const CONSTITUENCY_COUNT = CONSTITUENCIES.length;
export { PRISON_VOTERS, COUNTY_TOTAL_WITH_PRISONS, COUNTY_TOTAL_WARDS };

/** The turnout baseline §3.4.1 states, as a rate. Tier 1, and the only turnout figure used. */
export const TURNOUT_BASELINE = 0.62;

/** 2022's certified winning total — the number every path is measured against. */
export const WINNING_TOTAL_2022 = 198_004;

/** The rounded threshold the document plans to, stated as "approximately 200,000". */
export const THRESHOLD_ROUNDED = 200_000;

/** Total ballots the county casts at the 62% baseline. §3.4.1 prints 330,310. */
export const COUNTY_BALLOTS = ballotsAt(COUNTY_REGISTER, TURNOUT_BASELINE);

export const TOP_12 = topWards(CONSTITUENCIES, 12);
export const TOP_20 = topWards(CONSTITUENCIES, 20);
export const BOTTOM_10 = bottomWards(CONSTITUENCIES, 10);

export const MWINGI_BLOC_NAMES = ["Mwingi North", "Mwingi West", "Mwingi Central"];
export const MWINGI_BLOC = blocTotal(CONSTITUENCIES, MWINGI_BLOC_NAMES);
export const KITUI_SOUTH = blocTotal(CONSTITUENCIES, ["Kitui South"]);

/**
 * The recognition-deficit pool: Mwingi plus Kitui South.
 *
 * Note what it does NOT include. §3.4.5 names three Kitui East border wards among the deficit
 * zones and then directs effort into "these 24 northern and southern deficit wards" — but the
 * pool it quotes, 275,570, is Mwingi (200,198) + Kitui South (75,372) and excludes Kitui East
 * entirely. Mwingi's 15 wards plus Kitui South's 6 is 21, not 24. That is conflict C-7, and the
 * count is left as the register gives it rather than adjusted to fit the sentence.
 */
export const DEFICIT_POOL = MWINGI_BLOC + KITUI_SOUTH;
export const DEFICIT_POOL_SHARE = (DEFICIT_POOL / COUNTY_REGISTER) * 100;
export const DEFICIT_WARD_COUNT = CONSTITUENCIES.filter((c) =>
  [...MWINGI_BLOC_NAMES, "Kitui South"].includes(c.name)
).reduce((n, c) => n + c.wards.length, 0);

/* ------------------------------------------------------------------ the four paths */

export interface CoalitionPath {
  id: "A" | "B" | "C" | "D";
  name: string;
  /** Constituency names, or null where the path is a set of wards rather than constituencies. */
  constituencies: string[] | null;
  registered: number;
  wards: number;
  /** Share of the county register. */
  share: number;
  /** Ballots this path yields at the 62% baseline — the number the register is not. */
  ballots: number;
  /** Margin over 2022's certified 198,004, and over the rounded 200,000. Both, because §3.4.3 mixes them. */
  marginOver2022: number;
  marginOverRounded: number;
}

function path(
  id: CoalitionPath["id"],
  name: string,
  names: string[] | null,
  registered: number,
  wards: number
): CoalitionPath {
  return {
    id,
    name,
    constituencies: names,
    registered,
    wards,
    share: (registered / COUNTY_REGISTER) * 100,
    ballots: ballotsAt(registered, TURNOUT_BASELINE),
    marginOver2022: registered - WINNING_TOTAL_2022,
    marginOverRounded: registered - THRESHOLD_ROUNDED,
  };
}

/**
 * The four routes §3.4.3 evaluates.
 *
 * Every total is computed from the register, which is how conflict C-4 became visible: Path B's
 * prose says it "exceeds the 200,000 threshold by 14,179 voters", and 212,183 − 200,000 is
 * 12,183. 14,179 is the margin over 198,004. Both margins are carried on the path so the figure
 * can show which number the sentence is actually measuring against, without changing the sentence.
 */
export const COALITION_PATHS: CoalitionPath[] = [
  path("A", "The Northern Mwingi Triad", MWINGI_BLOC_NAMES, MWINGI_BLOC, 15),
  path("B", "The Central-South-West Axis", ["Kitui Central", "Kitui South", "Kitui West"],
       blocTotal(CONSTITUENCIES, ["Kitui Central", "Kitui South", "Kitui West"]), 15),
  path("C", "The Top 12 Megawards", null, TOP_12, 12),
  path("D", "The Home-Belt Ceiling", ["Kitui Central", "Kitui West", "Kitui Rural"],
       blocTotal(CONSTITUENCIES, ["Kitui Central", "Kitui West", "Kitui Rural"]), 13),
];

/* ------------------------------------------------------------------ constituency power ranking */

export const CONSTITUENCY_RANKING = [...CONSTITUENCIES]
  .sort((a, b) => b.voters - a.voters || a.name.localeCompare(b.name))
  .map((c, i) => ({
    rank: i + 1,
    name: c.name,
    voters: c.voters,
    wards: c.wards.length,
    share: (c.voters / COUNTY_REGISTER) * 100,
    averageWard: Math.round(c.voters / c.wards.length),
  }));

/** The "Big 4" §3.4.4 names: the four largest constituencies. */
export const BIG_FOUR = CONSTITUENCY_RANKING.slice(0, 4);
export const BIG_FOUR_TOTAL = BIG_FOUR.reduce((s, c) => s + c.voters, 0);
export const BIG_FOUR_WARDS = BIG_FOUR.reduce((s, c) => s + c.wards, 0);
