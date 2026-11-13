import { fmt, val } from "../lib/data/read.ts";
import { withTeamEdits } from "../lib/data/team-overlay.ts";

type Baseline =
  | { kind: "unmeasured"; note: string }
  | { kind: "awaiting"; note: string }
  | { kind: "measured"; value: number; display: string; note: string };

interface Kpi {
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


/**
 * The nomination-window scorecard, rebuilt for the 2026 rebuild brief (non-negotiable 1).
 *
 * NW-01 to NW-03 used to be a tracking-poll ballot share, a CATI name-ID booster and a survey
 * salience index. The brief keeps polls out of every KPI and commissions no survey, so each is now
 * a measure his team can observe on his own channels or on the SMS list it operates. The targets
 * that can be stated before Week 1 are stated; the ones that depend on the Week 1 baseline say so.
 */
export const NOMINATION_KPIS: Kpi[] = withTeamEdits<Kpi>("kpis.nomination", "code", [
  {
    code: "NW-01",
    title: "Reach share in the deficit pool",
    definition:
      "Share of his total reach landing in Mwingi North, West, Central and Kitui South, the four constituencies where he has never held office.",
    baseline: { kind: "unmeasured", note: "Not yet measured (Week 1 export)" },
    target: "≥ 51.7%, the pool's share of the register",
    targetValue: 51.7,
    unit: "percent",
    method: "Meta Insights reach by city, mapped to sub-county",
    owner: "Campaign analyst",
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
    owner: "Campaign analyst",
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
    method: "The team's dispatch and consent logs, on the platform",
    owner: "Campaign offline-layer operator",
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
]);

export const GENERAL_ELECTION_KPIS: Kpi[] = withTeamEdits<Kpi>("kpis.general-election", "code", [
  {
    code: "GE-01",
    title: "Pledged Voter Data Base Size",
    definition:
      "Individual registered voters with phone, ward, & polling station logged in campaign CRM.",
    baseline: { kind: "measured", value: 0, display: "0 pledged voters", note: "Section 3.3.1, Commitment 3" },
    target: `${fmt("target.pledged-voters")} Pledged Voters (110% Win)`,
    targetValue: val("target.pledged-voters"),
    unit: "count",
    method: "Verified opt-in 2G SMS & Baraza registration ledger",
    owner: "Field Ops & Data Director",
    cadence: "Weekly Progress Audit",
  },
  {
    code: "GE-02",
    title: "Ward Captain Deployment Index (campaign-owned)",
    definition: "Active, vetted Ward Captains operating across all 40 Wards (10 per ward).",
    baseline: { kind: "measured", value: 0, display: "0 active Captains", note: "Section 3.3.1, Commitment 5" },
    target: `${fmt("target.captains")} Captains (10 / Ward, 100% Coverage)`,
    targetValue: val("target.captains"),
    unit: "count",
    method: "Biometric / ID verification and monthly activity log confirmation",
    owner: "Campaign ground team — outside this engagement",
    cadence: "Bi-Weekly Field Audit",
  },
  {
    code: "GE-03",
    title: "Polling Station Agent Coverage",
    definition:
      "Accredited, trained party polling station agents deployed across 100% of Kitui polling stations.",
    baseline: { kind: "measured", value: 0, display: "0 Station Agents", note: "None deployed" },
    target: `${fmt("register.polling-stations")} Stations (100% of stations)`,
    targetValue: val("register.polling-stations"),
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
]);

/**
 * The recognition indicators (Measuring success, "Recognition where he is least known"): R-01 to
 * R-05. They sit beside the two scorecards, not inside them: the nomination scorecard holds four
 * (NOMINATION_KPIS), the general-election scorecard five (GENERAL_ELECTION_KPIS), and these five
 * measure recognition where Dr. Mulu is least known. Any sentence that counts them reads this list
 * (consolidation pass, Step 1: docs/consolidation-2026-11/DECISIONS.md D1.5).
 */
export const RECOGNITION_INDICATORS = [
  { code: "R-01", title: "Followers located in Mwingi North, Central and West" },
  { code: "R-02", title: "Share of total reach landing in the pool" },
  { code: "R-03", title: "Shares per 1,000 reached, deficit wards only" },
  { code: "R-04", title: "Consented contacts in the 21 wards of the pool, and their share of the list" },
  { code: "R-05", title: "Kikamba-first share of weekly output, and its engagement on reach" },
] as const;
