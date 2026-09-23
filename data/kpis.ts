// The two scorecards, §11.1.1 and §11.1.2, as data.
//
// The one thing this file exists to encode is that a BASELINE IS NOT ALWAYS A NUMBER. The
// document is scrupulous about it and the interface has to be too:
//
//   "unmeasured"  — nobody has taken this reading yet. NW-01 to NW-03 say "Not yet measured
//                   (Week 1)": the Week 1 instrument is what will establish them. Drawing these
//                   at zero would report an unmeasured quantity as measured at nil, which is a
//                   different and false claim.
//   "awaiting"    — a campaign decision, not a measurement. NW-04's baseline is "Confirm w/
//                   party (Week 1)". Nobody is going to measure it; somebody has to decide it.
//   "measured"    — a real prior reading, with the note the table carries about where it came
//                   from. Only these five can be drawn as a starting position on a track.
//
// Note for review: the task brief lists all four nomination baselines as "Not yet measured".
// §11.1.1 in this repository marks NW-04 as "Confirm w/ party" instead, which is the
// awaiting-decision state rather than the unmeasured one. The repository is the source of truth,
// so that is what is encoded here, and the difference is flagged rather than smoothed over.
import type { ClaimStatus } from "../components/markdown/ClaimBadge";

export type Baseline =
  | { kind: "unmeasured"; note: string }
  | { kind: "awaiting"; note: string }
  | { kind: "measured"; value: number; display: string; note: string };

export interface Kpi {
  /** The code, exactly as printed. Never renumbered. */
  code: string;
  title: string;
  /** Operational definition, as written in the scorecard. */
  definition: string;
  baseline: Baseline;
  /** Target as printed, including its qualifier. */
  target: string;
  /** The numeric target, where the pair makes a track meaningful. */
  targetValue: number | null;
  /** Unit for the track's axis, where one applies. */
  unit: "percent" | "count" | null;
  method: string;
  owner: string;
  cadence: string;
}

/** Which provenance badge a baseline earns. Keeps the mapping in one place. */
export function baselineStatus(b: Baseline): ClaimStatus {
  if (b.kind === "unmeasured") return "unmeasured";
  if (b.kind === "awaiting") return "awaiting";
  return "verified";
}

/**
 * The nomination-window scorecard, rebuilt for the 2026 rebuild brief (non-negotiable 1).
 *
 * NW-01 to NW-03 used to be a tracking-poll ballot share, a CATI name-ID booster and a survey
 * salience index. The brief keeps polls out of every KPI and commissions no survey, so each is now
 * a measure Firefly can observe on his own channels or on the SMS list it operates. The targets
 * that can be stated before Week 1 are stated; the ones that depend on the Week 1 baseline say so.
 */
export const NOMINATION_KPIS: Kpi[] = [
  {
    code: "NW-01",
    title: "Reach share in the deficit pool",
    definition:
      "Share of his total reach landing in Mwingi North, West, Central and Kitui South, the four constituencies where he has never held office.",
    baseline: { kind: "unmeasured", note: "Not yet measured (Week 1 export)" },
    target: "≥ 51.7%, the pool's share of the register",
    targetValue: 51.7,
    unit: "percent",
    method: "Meta Insights reach by city, mapped to sub-county (Section 5.3)",
    owner: "Firefly analyst",
    cadence: "Weekly",
  },
  {
    code: "NW-02",
    title: "Followers located in Mwingi",
    definition:
      "Share of his followers whose location is in Mwingi North, Central or West, the proxy for being known where he is not yet known.",
    baseline: { kind: "unmeasured", note: "Not yet measured (Week 1 export)" },
    target: "A stated monthly gain on the Week 1 baseline",
    targetValue: null,
    unit: "percent",
    method: "Meta follower city breakdown, mapped to sub-county",
    owner: "Firefly analyst",
    cadence: "Monthly",
  },
  {
    code: "NW-03",
    title: "Consented contacts in the pool",
    definition:
      "Share of the consented SMS/USSD list registered in the 21 wards of the deficit pool.",
    baseline: { kind: "unmeasured", note: "Not yet measured (the list starts at Week 2)" },
    target: "≥ 51.7%, the pool's share of the register",
    targetValue: 51.7,
    unit: "percent",
    method: "Firefly's own dispatch and consent logs (Section 5.2.3.3)",
    owner: "Firefly offline-layer operator",
    cadence: "Weekly",
  },
  {
    code: "NW-04",
    title: "Branch Exec Endorsement Rate",
    definition:
      "Verified, signed support pledges from Sub-County Wiper Executive Branch Committees.",
    baseline: { kind: "awaiting", note: "Confirm w/ party (Week 1)" },
    target: "8 / 8 Sub-County Branches",
    targetValue: 8,
    unit: "count",
    method: "Formal written branch caucus endorsement resolutions",
    owner: "Political Affairs Director",
    cadence: "Weekly Executive Dashboard",
  },
];

export const GENERAL_ELECTION_KPIS: Kpi[] = [
  {
    code: "GE-01",
    title: "Pledged Voter Data Base Size",
    definition:
      "Individual registered voters with phone, ward, & polling station logged in campaign CRM.",
    baseline: { kind: "measured", value: 0, display: "0 pledged voters", note: "Section 4.2, Commitment 3" },
    target: "220,000 Pledged Voters (110% Win)",
    targetValue: 220000,
    unit: "count",
    method: "Verified opt-in 2G SMS & Baraza registration ledger (Section 11.2.2)",
    owner: "Field Ops & Data Director",
    cadence: "Weekly Progress Audit",
  },
  {
    code: "GE-02",
    title: "Ward Captain Deployment Index (campaign-owned)",
    definition: "Active, vetted Ward Captains operating across all 40 Wards (10 per ward).",
    baseline: { kind: "measured", value: 0, display: "0 active Captains", note: "Section 4.2, Commitment 5" },
    target: "400 Captains (10 / Ward, 100% Coverage)",
    targetValue: 400,
    unit: "count",
    method: "Biometric / ID verification and monthly activity log confirmation",
    owner: "Campaign ground team — outside this engagement (Section 5.1.3)",
    cadence: "Bi-Weekly Field Audit",
  },
  {
    code: "GE-03",
    title: "Polling Station Agent Coverage",
    definition:
      "Accredited, trained party polling station agents deployed across 100% of Kitui polling stations.",
    baseline: { kind: "measured", value: 0, display: "0 Station Agents", note: "None deployed" },
    target: "1,578 Stations (100% of stations)",
    targetValue: 1578,
    unit: "count",
    method: "IEBC official accreditation badges & signed deployment forms",
    owner: "Legal & Polling Station Lead",
    cadence: "Weekly (Final 60 Days)",
  },
  {
    code: "GE-04",
    title: "Turnout Conversion Efficiency",
    definition:
      "Ratio of pledged voters who cast verified ballots in target strongholds on polling day.",
    baseline: { kind: "unmeasured", note: "No sourced historical conversion rate; set from the CRM once pledges exist" },
    target: "≥ 82.0% Voter Turnout Conversion",
    targetValue: 82.0,
    unit: "percent",
    method: "IEBC Form 37A audit vs. CRM voter ledger by polling stream",
    owner: "Polling Day Ops Director",
    cadence: "Post-Day Real-Time Tracking (06:00–17:00)",
  },
  {
    code: "GE-05",
    title: "Real-Time Form 37A Capture",
    definition:
      "% of Form 37A result sheets photographed and transmitted to War Room within 2 hours of count.",
    baseline: { kind: "measured", value: 0, display: "0% Transmit Rate", note: "No capture in place" },
    target: "100% Transmit within 2 Hours",
    targetValue: 100,
    unit: "percent",
    method: "Encrypted field agent WhatsApp / USSD photo upload verification DB",
    owner: "Chief Technology Officer (CTO)",
    cadence: "Polling Day Hourly Real-Time (17:00–21:00)",
  },
];

/** The four Stage 1 headline targets, as §11.1.3's architecture diagram states them. */
/**
 * The four Stage 1 headline targets, as §11.1.3's architecture block states them.
 *
 * THIS LIST HAD DRIFTED FROM THE SCORECARD TEN LINES ABOVE IT. It read "North Sub-County Name ID
 * (>65%)" where both §11.1.1's NW-02 row and §11.1.3's own block say ≥70.0%, and "Delegate
 * Endorsement Pledges" where the document says "Branch Executive". KpiArchitecture renders this
 * list, so the site was showing a target five points below the one the proposal states. It was a
 * retyping of data this file already held correctly — which is how it drifted — and
 * figures.test.ts now asserts each line against the KPI it summarises, so it cannot drift again.
 *
 * The WORDING is §11.1.3's, not NW-01's, because the block is a summary and uses its own shorter
 * labels. Only the two wrong figures were corrected. No content was changed: see DECISIONS.md D-14.
 */
export const STAGE_1_TARGETS = [
  "Reach Share in the Deficit Pool (≥ 51.7%)",
  "Followers Located in Mwingi (monthly gain on Week 1)",
  "Consented Contacts in the Pool (≥ 51.7%)",
  "Branch Executive Endorsement Pledges (8/8)",
];

/** The four Stage 2 headline targets, likewise. */
export const STAGE_2_TARGETS = [
  "Verified Pledged Voter Database (Target: 220,000 Opt-In Voters)",
  "Ward Captain Mobilization Index, campaign-owned (400 Captains / 40 Wards)",
  "Polling Agent Station Coverage (100% of 1,578 Stations)",
  "Turnout Conversion Rate (≥82%)",
];
