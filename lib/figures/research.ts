/**
 * §11.2 — what the campaign does not yet know, and the instruments it plans to find out with.
 *
 * WHAT THESE REPLACE. Three box-drawing blocks: a two-column research-and-tracker panel, a
 * research architecture table of three modules, and a service-delivery tracker architecture.
 *
 * THE HONEST GAPS ARE THE SUBSTANCE HERE and they are transcribed as gaps. §5.6.6's tracker names
 * two counts it does not have — classroom and TVET counts "pending the project ledger", and a
 * bursary receipt count likewise pending, with §2.8's 12,573 given as the Tier 1 figure it does
 * have. The brief forbids filling an empty data state with an estimate; these figures print the
 * absence in the cell where the number would go, which is what the source does.
 *
 * The decision column is the other thing worth preserving exactly. Each module names the decision
 * it unlocks, so the research is not a measurement for its own sake.
 *
 * SEPTEMBER 2026 AUDIT. Firefly forms strategy from existing records and its own analysis only, so
 * every module reads a record that already exists: module 1 the Week 1 channel audit, module 2 the
 * IEBC's ward-level results, module 3 the log of what arrives unprompted on the line Firefly
 * operates. Nothing is commissioned.
 */
import type { FigureSeries } from "./types";

/* ------------------------------------------------------------------ §5.6.4 the two programmes */

export const RESEARCH_TIERS = [
  {
    label: "19A: the evidence tests",
    items: [
      "The Week 1 channel audit (confirm or refute the recognition thesis on his own data)",
      "The 2017 and 2022 ward-level results (IEBC Forms 37A and 37B)",
      "Inbound feedback on the Firefly-operated SMS and USSD line",
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
  measure: "§5.6's tests of the recognition hypothesis, and the service-delivery tracker",
  points: [],
  note:
    "The research programme feeds the tracker: what the audit establishes about a ward becomes " +
    "a baseline the tracker publishes against. 19B is stated as a dual asset — campaign evidence " +
    "now, and a governing dashboard from day one.",
};

/* ------------------------------------------------------------------ §5.6.5 the research modules */

export const RESEARCH_MODULES: string[][] = [
  [
    "1. The Week 1 channel audit",
    "Ninety days of his own channels, exported and coded twice · reach by city mapped to sub-county · engagement on reach · language and format mix · the public comparison with the two nomination rivals",
    "Every post in the window · his Meta Insights export · public posts of the two nomination rivals · no personal data",
    "Week 1",
    "If reach concentrates in Kitui Central, output weight shifts to Mwingi and the arid belt. If it lands in Mwingi but does not convert, the problem is message, not reach (Section 4.8).",
  ],
  [
    "2. The ward-level record",
    "The 2017 and 2022 governor results by ward and polling station, set against the pool and the twelve decisive wards · Wiper's 2022 share, ward by ward",
    "IEBC Forms 37A and 37B for all 40 wards · public records, not yet in hand (Section 2.2)",
    "On receipt",
    "If Wiper carried the pool wards in 2022, the gap there is his own recognition and reach is the answer. If it did not, party flow is part of the problem and Section 3.6's direct-contact plan widens.",
  ],
  [
    "3. Inbound feedback log",
    "What arrives unprompted on the SMS/USSD line and the tracker · reports, questions and market-day rumours · counted and coded, never solicited",
    "Every inbound message from consented contacts across 40 wards · aggregated via the Africa's Talking API",
    "Weekly, ongoing",
    "Rapid pivots for weekly radio and SMS copy.",
  ],
];

export const MODULES_SERIES: FigureSeries = {
  id: "research-modules",
  headline: "Three instruments, and each one names the decision it unlocks",
  measure: "§5.6.5's tests of the recognition-deficit hypothesis — module, method, record, timing and the decision it unlocks",
  points: [],
  note:
    "The last column is what makes this a decision instrument: the audit's result routes directly " +
    "to a stated change of plan, set out in advance in Section 4.8. All three read records that " +
    "already exist: his own analytics, the IEBC's published forms and the line Firefly operates.",
};

/* ------------------------------------------------------------------ §5.6.6 the tracker */

export const TRACKER_DIMENSIONS: string[][] = [
  [
    "1. Ward infrastructure & school laboratories",
    "Kitui Central NG-CDF project ledger · Ministry of Education infrastructure DB · classroom and TVET counts pending the project ledger (see §E.3)",
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
    "Annual / statutory audit cycle · each year's audit opinion as the OAG report states it; the 2013–2025 reports are not yet retrieved (Section 4.4.1)",
  ],
  [
    "4. Secondary & tertiary bursary distribution",
    "NG-CDF bursary disbursements ledger · NG-CDF constituency records — not HELB, which holds national loan data",
    "Termly disbursement audit · receipt count pending the ledger; §2.8 gives 12,573 as Tier 1",
  ],
];

export const TRACKER_SERIES: FigureSeries = {
  id: "delivery-tracker",
  headline: "Four delivery dimensions, two of which are still waiting on a ledger",
  measure: "§5.6.6's public service-delivery tracker — dimension, statutory sources, update cadence and verification",
  points: [],
  note:
    "The classroom and TVET counts and the bursary receipt count are stated as pending the project " +
    "ledger, and they are printed that way rather than filled with an estimate. §2.8's 12,573 " +
    "bursary recipients is the Tier 1 figure the document does have, and the row says so.",
};
