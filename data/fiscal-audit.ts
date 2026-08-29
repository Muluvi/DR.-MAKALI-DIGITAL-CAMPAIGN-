// Phase 4b — county fiscal and audit record. Feeds Section 2.7 and the Phase 6d fiscal/audit
// panel. The FY2025/26 Q1 absorption rate itself is disputed — see data/disputed-figures.ts,
// id "kitui-fy2025-26-q1-absorption" — and is not duplicated here as a single number.
import type { SourcedFigure } from "./types";
import { AUDITOR_GENERAL_FY2023_24, CONTROLLER_OF_BUDGET, FISCAL_STRATEGY_PAPER_FY2026_27 } from "./sources";

// Section 2.4's resource envelope, restated here as a typed figure so the Phase 6d chart can
// plot it without a hardcoded number in the component file.
export const RESOURCE_ENVELOPE_FY2026_27: SourcedFigure = {
  label: "Total resource envelope, FY2026/27",
  value: 13_790_000_000,
  unit: "KSh",
  provenance: { source: FISCAL_STRATEGY_PAPER_FY2026_27, granularity: "county" },
};

export const AUDIT_QUERIES_FY2023_24: SourcedFigure[] = [
  {
    label: "Unconfirmed cash balances",
    value: 670_000_000,
    unit: "KSh",
    provenance: { source: AUDITOR_GENERAL_FY2023_24, granularity: "county" },
  },
  {
    label: "Uncollected county rates and rents",
    value: 1_090_000_000,
    unit: "KSh",
    provenance: { source: AUDITOR_GENERAL_FY2023_24, granularity: "county" },
  },
  {
    label: "IFMIS variance",
    value: 621_500_000,
    unit: "KSh",
    provenance: { source: AUDITOR_GENERAL_FY2023_24, granularity: "county" },
  },
  {
    label: "Unexplained inter-account transfer variance",
    value: 356_200_000,
    unit: "KSh",
    provenance: { source: AUDITOR_GENERAL_FY2023_24, granularity: "county" },
  },
];

export const PENDING_BILLS_FY2020_21: SourcedFigure = {
  label: "County pending bills, FY2020/21",
  value: 1_300_000_000,
  unit: "KSh (approx.)",
  provenance: {
    source: CONTROLLER_OF_BUDGET,
    granularity: "county",
    note: "The research hand-off did not name the specific CBIRR edition this figure comes from — flagged in the Data Gaps Register alongside the current (post-FY2020/21) pending-bills figure, which was not supplied at all.",
  },
};

/**
 * Stalled health projects are flagged by the Auditor-General in the research hand-off, but no
 * count, facility list, or specific amount was supplied — rendered as a named gap rather than
 * invented. See the Data Gaps Register (Appendix C).
 */
export const STALLED_HEALTH_PROJECTS_GAP =
  "Stalled county health projects are flagged in Auditor-General reporting, but this research pass did not supply a count, facility list, or committed amount.";
