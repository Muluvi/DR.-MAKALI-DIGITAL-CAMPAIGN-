/**
 * §11.2 — what the campaign does not yet know, and the instruments it plans to find out with.
 *
 * WHAT THESE REPLACE. Three box-drawing blocks: a two-column research-and-tracker panel, a
 * research architecture table of three modules, and a service-delivery tracker architecture.
 *
 * THE HONEST GAPS ARE THE SUBSTANCE HERE and they are transcribed as gaps. §11.2.2's tracker names
 * two counts it does not have — classroom and TVET counts "pending the project ledger", and a
 * bursary receipt count likewise pending, with §3.3.1's 12,573 given as the Tier 1 figure it does
 * have. The brief forbids filling an empty data state with an estimate; these figures print the
 * absence in the cell where the number would go, which is what the source does.
 *
 * §11.2.1's decision triggers are the other thing worth preserving exactly. Each research module
 * names the decision it unlocks — "if Name ID <45% in North: trigger 8-truck PA blitz; if >65%:
 * shift to policy ads" — so the poll is not a measurement for its own sake. A figure that dropped
 * that column would turn a decision instrument into a survey.
 */
import type { FigureSeries } from "./types";

/* ------------------------------------------------------------------ §11.2.0 the two programmes */

export const RESEARCH_TIERS = [
  {
    label: "19A: research programme",
    items: [
      "Pre-cycle recognition testing (confirm or refute the deficit)",
      "Mixed method — CATI plus focus group discussions",
      "Nomination window tracking polling",
      "Gatekeeper decision triggers",
    ],
  },
  {
    label: "19B: service-delivery tracker",
    items: [
      "Ward-by-ward baseline metrics",
      "OAG / KNBS / CRA data feeds",
      "Monthly public web and USSD sync",
      "Dual asset: campaign evidence and a day-one governing dashboard",
    ],
  },
];

export const RESEARCH_SPLIT: FigureSeries = {
  id: "research-and-tracker",
  headline: "One programme tests whether the deficit is real; the other is the evidence it argues with",
  measure: "§11.2.0's empirical research programme and service-delivery tracker",
  points: [],
  note:
    "The research programme feeds the tracker: what the polling establishes about a ward becomes " +
    "a baseline the tracker publishes against. 19B is stated as a dual asset — campaign evidence " +
    "now, and a governing dashboard from day one.",
};

/* ------------------------------------------------------------------ §11.2.1 the research modules */

export const RESEARCH_MODULES: string[][] = [
  [
    "1. Baseline countywide quantitative poll",
    "CATI plus face-to-face CAPI boosters · spontaneous and aided candidate name ID · favourability and primary issue salience index",
    "N = 1,600 registered voters across all 8 sub-counties · stratified by ward and gender (52% F, 48% M) · sub-county boost in Mwingi North and South",
    "Month 1 (early cycle)",
    "If name ID is under 45% in the north: trigger an 8-truck PA blitz. If over 65%: shift to policy ads.",
  ],
  [
    "2. Deep-dive qualitative focus groups",
    "12 in-person focus group discussions · audio-recorded in vernacular Kikamba · concept testing of the Ksh 100M ward fund and the ndengu floor price",
    "12 groups of 8–10 · 4× rural women chamas, 4× youth boda and MSMEs, 4× village elders and smallholder farmers · Tseikuru, Nguni, Mutomo, Ikutha",
    "Month 2 (post-quantitative)",
    "Decides vernacular dialect framing and identifies fatal cultural sensitivities.",
  ],
  [
    "3. SMS pulse ward-level barometer",
    "Two-way interactive SMS micro-surveys, a three-question structured loop · direct feedback on market-day rumours",
    "N = 5,000 opt-in 2G feature phone users across 40 wards · aggregated via the Africa's Talking API",
    "Fortnightly, ongoing",
    "Rapid pivots for weekly radio and SMS copy.",
  ],
];

export const MODULES_SERIES: FigureSeries = {
  id: "research-modules",
  headline: "Three instruments, and each one names the decision it unlocks",
  measure: "§11.2.1's recognition-deficit research architecture — module, method, sample, timing and the decision it unlocks",
  points: [],
  note:
    "The last column is what makes this a decision instrument rather than a survey: the baseline " +
    "poll's result routes directly to either an 8-truck PA blitz or a shift to policy ads, at " +
    "thresholds stated in advance. A figure that dropped it would have kept the sample sizes and " +
    "lost the point.",
};

/* ------------------------------------------------------------------ §11.2.2 the tracker */

export const TRACKER_DIMENSIONS: string[][] = [
  [
    "1. Ward infrastructure & school laboratories",
    "Kitui Central NG-CDF project ledger · Ministry of Education infrastructure DB · classroom and TVET counts pending the project ledger (see §13.1.4)",
    "Monthly sync · on-site geotagged photo audit; certified contractor handovers",
  ],
  [
    "2. Solar boreholes & water access points",
    "National Water Resources Authority · county water master plan baseline · 84 operational solar borehole sites",
    "Bi-weekly water quality and pump telemetry feed · real-time GPS and yield logs",
  ],
  [
    "3. Public financial stewardship ledger",
    "Office of the Auditor-General certified reports (2013–2025) · Controller of Budget reports",
    "Annual / statutory audit cycle · zero adverse audit queries verified against National Assembly Hansard",
  ],
  [
    "4. Secondary & tertiary bursary distribution",
    "NG-CDF bursary disbursements ledger · NG-CDF constituency records — not HELB, which holds national loan data",
    "Termly disbursement audit · receipt count pending the ledger; §3.3.1 gives 12,573 as Tier 1",
  ],
];

export const TRACKER_SERIES: FigureSeries = {
  id: "delivery-tracker",
  headline: "Four delivery dimensions, two of which are still waiting on a ledger",
  measure: "§11.2.2's public service-delivery tracker — dimension, statutory sources, update cadence and verification",
  points: [],
  note:
    "The classroom and TVET counts and the bursary receipt count are stated as pending the project " +
    "ledger, and they are printed that way rather than filled with an estimate. §3.3.1's 12,573 " +
    "bursary recipients is the Tier 1 figure the document does have, and the row says so.",
};
