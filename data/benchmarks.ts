// §6.4.4's key metrics, as data.
//
// The table states a global benchmark and a campaign target side by side, and the thing it does
// not show is the RELATIONSHIP between them: which targets sit above the industry band, which
// sit inside it, and by how much. On a shared axis that is visible at a glance, and it is the
// question a monitoring-and-evaluation reader will ask first — are these targets ambitious,
// conservative, or unexamined?
//
// Only the five metrics measured on a comparable percentage scale are plotted. The other three
// in §6.4.4 are carried as text, because a cost in shillings, a cost in dollars and a shift in
// survey points do not share an axis and forcing them onto one would invent a comparison the
// document does not make.

export interface Benchmark {
  metric: string;
  definition: string;
  /** Global benchmark band, in percentage points on a 0-100 axis. */
  benchmarkFrom: number;
  benchmarkTo: number;
  /** The campaign's target, on the same axis. */
  target: number;
  /** As printed in the table. */
  benchmarkLabel: string;
  targetLabel: string;
  /** Whether the target sits above, inside or below the benchmark band. Derived. */
}

export const PLOTTED_BENCHMARKS: Benchmark[] = [
  {
    metric: "Share of voice",
    definition: "% of Kitui gubernatorial mentions about Dr. Mulu",
    benchmarkFrom: 30, benchmarkTo: 40, target: 50,
    benchmarkLabel: "30–40% for leader", targetLabel: "≥ 50%",
  },
  {
    metric: "Net sentiment",
    definition: "(Positive − negative) / total",
    benchmarkFrom: 20, benchmarkTo: 30, target: 40,
    benchmarkLabel: "+20 to +30", targetLabel: "≥ +40",
  },
  {
    metric: "Voter registration lift",
    definition: "Increase in target wards from campaign drives",
    benchmarkFrom: 5, benchmarkTo: 10, target: 10,
    benchmarkLabel: "5–10%", targetLabel: "≥ 10%",
  },
  {
    metric: "Digital-to-offline conversion",
    definition: "% of engagers attending or volunteering",
    benchmarkFrom: 5, benchmarkTo: 15, target: 10,
    benchmarkLabel: "5–15%", targetLabel: "≥ 10%",
  },
  {
    metric: "GOTV contact rate",
    definition: "% of target voters reached",
    benchmarkFrom: 60, benchmarkTo: 80, target: 70,
    benchmarkLabel: "60–80%", targetLabel: "≥ 70%",
  },
];

/** Where a target sits relative to its benchmark band. Computed, never asserted. */
export function targetPosition(b: Benchmark): "above" | "inside" | "below" {
  if (b.target > b.benchmarkTo) return "above";
  if (b.target < b.benchmarkFrom) return "below";
  return "inside";
}

/** The three metrics in §6.4.4 that share no axis with the five above. */
export const UNPLOTTED_BENCHMARKS = [
  {
    metric: "Measured preference shift",
    definition: "Change in published survey share",
    benchmarkLabel: "—",
    targetLabel: "Close the deficit to ≤ 5 points by nomination window",
  },
  {
    metric: "Cost per persuaded voter",
    definition: "Total spend ÷ estimated persuaded",
    benchmarkLabel: "$1–$5",
    targetLabel: "≤ KSh200",
  },
  {
    metric: "Cost per consented contact",
    definition: "Total channel spend ÷ consented contacts",
    benchmarkLabel: "—",
    targetLabel: "≤ KSh0.60 falling to KSh0.35",
  },
];
