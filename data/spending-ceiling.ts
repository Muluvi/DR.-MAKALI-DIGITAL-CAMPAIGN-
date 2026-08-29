// Phase 5b — compliance and spending ceiling. This resolves the `[Insert verified Kitui County
// expenditure ceiling]` placeholder previously in operations.md Section 8B.1 with the verified
// figure, and supplies the operational compliance panel: this is the campaign's binding budget
// constraint, not background reading.
import type { SourcedFigure } from "./types";
import { IEBC_GAZETTE_CEILING } from "./sources";

export const KITUI_SPENDING_CEILING: SourcedFigure = {
  label: "Kitui county-seat expenditure ceiling (Governor, Senator, Woman Representative — shared)",
  value: 97_560_000,
  unit: "KSh",
  provenance: {
    source: IEBC_GAZETTE_CEILING,
    granularity: "county",
    note: "First Schedule, Election Campaign Financing Regulations 2026 — the ceiling weights population 70% / land area 30% (Section 8B.1).",
  },
};

export const SINGLE_SOURCE_CONTRIBUTION_CAP_PCT: SourcedFigure = {
  label: "Single-source contribution cap",
  value: 20,
  unit: "% of the total ceiling",
  provenance: { source: IEBC_GAZETTE_CEILING, granularity: "national" },
};

export const AUDITED_REPORT_THRESHOLD: SourcedFigure = {
  label: "Threshold above which an audited expenditure report is required",
  value: 1_000_000,
  unit: "KSh",
  provenance: { source: IEBC_GAZETTE_CEILING, granularity: "national" },
};

export const PENALTY_MAX_FINE: SourcedFigure = {
  label: "Maximum fine for unreported excess expenditure",
  value: 2_000_000,
  unit: "KSh",
  provenance: { source: IEBC_GAZETTE_CEILING, granularity: "national" },
};

export const PENALTY_MAX_PRISON_YEARS: SourcedFigure = {
  label: "Maximum imprisonment for unreported excess expenditure",
  value: 5,
  unit: "years",
  provenance: { source: IEBC_GAZETTE_CEILING, granularity: "national", note: "Fine and imprisonment are alternative or cumulative — 'and/or' in the Regulations." },
};

export const EXPENDITURE_WINDOW = {
  start: "At least 6 months before polling day (10 August 2027)",
  end: "14 days after polling day",
  provenance: { source: IEBC_GAZETTE_CEILING, granularity: "national" as const },
};

export const COMPLIANCE_REQUIREMENTS: string[] = [
  "A dedicated campaign bank account holds all regulated expenditure — no commingling with personal or party funds.",
  "An authorised person (the campaign's appointed finance agent) is accountable for that account and for the IEBC expenditure return.",
  "Every contribution and expense is logged to a single reconciliation ledger from day one, tagged by date, channel, ward and purpose (Section 8B.4).",
  "Contribution records capture source and value to evidence the 20% single-source cap.",
  "Expenditure above the KSh1,000,000 threshold requires an audited report.",
];
