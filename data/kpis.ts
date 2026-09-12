// The two scorecards, the stage 1: the nomination-window scorecard section and the stage 2: the general election scorecard section, as data.
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
// the stage 1: the nomination-window scorecard section in this repository marks NW-04 as "Confirm w/ party" instead, which is the
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

export const NOMINATION_KPIS: Kpi[] = [
  {
    code: "NW-01",
    title: "Wiper Ballot Preference Share",
    definition:
      "% of sampled likely Wiper primary voters naming Dr. Makali Mulu as their 1st choice.",
    baseline: { kind: "unmeasured", note: "Not yet measured (Week 1)" },
    target: "≥ 55.0% Primary Preference",
    targetValue: 55.0,
    unit: "percent",
    method: "Rolling 7-day Tracking Poll (N = 400 CATI) (the Kitui message lab section)",
    owner: "Head of Research & Polling",
    cadence: "Weekly / Fortnightly",
  },
  {
    code: "NW-02",
    title: "Northern Sub-County Name ID",
    definition:
      "Spontaneous + aided name recognition in Mwingi North, Central & West sub-counties.",
    baseline: { kind: "unmeasured", note: "Not yet measured (Week 1)" },
    target: "≥ 70.0% Name ID",
    targetValue: 70.0,
    unit: "percent",
    method: "Sub-County CATI Poll booster in Mwingi North & Central (N = 600)",
    owner: "Comms Director",
    cadence: "Fortnightly Tracking",
  },
  {
    code: "NW-03",
    title: "Fiscal Integrity Salience",
    definition:
      "Voter ranking of “Clean Audit Record / Anti-Corruption” as the #1 or #2 voting criterion.",
    baseline: { kind: "unmeasured", note: "Not yet measured (Week 1)" },
    target: "≥ 60.0% Issue Salience",
    targetValue: 60.0,
    unit: "percent",
    method: "Issue Salience Index in County Tracking Survey (the Kitui message lab section)",
    owner: "Policy & Strategy Lead",
    cadence: "Fortnightly",
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
    baseline: { kind: "measured", value: 0, display: "0 pledged voters", note: "the objectives for the general election section, Commitment 3" },
    target: "220,000 Pledged Voters (110% Win)",
    targetValue: 220000,
    unit: "count",
    method: "Verified opt-in 2G SMS & Baraza registration ledger (the service-delivery performance tracker section)",
    owner: "Field Ops & Data Director",
    cadence: "Weekly Progress Audit",
  },
  {
    code: "GE-02",
    title: "Ward Captain Deployment Index",
    definition: "Active, vetted Ward Captains operating across all 40 Wards (10 per ward).",
    baseline: { kind: "measured", value: 0, display: "0 active Captains", note: "the objectives for the general election section, Commitment 5" },
    target: "400 Captains (10 / Ward, 100% Coverage)",
    targetValue: 400,
    unit: "count",
    method: "Biometric / ID verification and monthly activity log confirmation",
    owner: "Groundgame Director",
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
    baseline: { kind: "measured", value: 72.0, display: "72.0%", note: "Historical Average" },
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

/** The four Stage 1 headline targets, as the indicator framework, anchored to the vote threshold section's architecture diagram states them. */
export const STAGE_1_TARGETS = [
  "Wiper Primary Share (Target >55%)",
  "North Sub-County Name ID (>65%)",
  "Integrity / Clean Audit Salience",
  "Delegate Endorsement Pledges (8/8)",
];

/** The four Stage 2 headline targets, likewise. */
export const STAGE_2_TARGETS = [
  "Verified Pledged Voter Database (Target: 220,000 Opt-In Voters)",
  "Ward Captain Mobilization Index (400 Captains / 40 Wards)",
  "Polling Agent Station Coverage (100% of 1,578 Stations)",
  "Turnout Conversion Rate (≥82%)",
];
