// Phase 4c — drought and food security. Feeds the new Section 2.8.
import type { SourcedFigure } from "./types";
import { NDMA_ALERT, IPC_CLASSIFICATION, CBC_CECM_STATEMENT, MEDIA_FLOODING_MARCH_2026 } from "./sources";

export const NDMA_DROUGHT_PHASE: SourcedFigure<string> = {
  label: "NDMA drought early warning phase, Kitui County",
  value: "Alert",
  unit: "phase",
  provenance: { source: NDMA_ALERT, granularity: "county" },
};

export const IPC_FOOD_SECURITY_PHASE: SourcedFigure<string> = {
  label: "IPC food-security classification, Kitui County",
  value: "Phase 2 — Stressed",
  unit: "phase",
  provenance: { source: IPC_CLASSIFICATION, granularity: "county" },
};

export const FOOD_RESERVE_HOUSEHOLDS: SourcedFigure = {
  label: "Households holding food reserves",
  value: 28000,
  unit: "households, of a stated base of 1.2m+",
  provenance: {
    source: CBC_CECM_STATEMENT,
    granularity: "county",
    note:
      "The CECM's stated household base (over 1.2 million) is markedly higher than the 2019 census household count for the whole county (262,942 — Section 2.5). Rendered exactly as stated rather than corrected; the discrepancy may reflect the CECM conflating population with households, but this pass has no second source to resolve which figure is right.",
  },
};

export const MARCH_2026_FLOODING: SourcedFigure<string> = {
  label: "March 2026 flooding, Kitui County",
  value: "Reported affected — sub-county breakdown not supplied",
  unit: "status",
  provenance: {
    source: MEDIA_FLOODING_MARCH_2026,
    granularity: "county",
    note: "The research hand-off referenced sub-county flooding impact without itemising which sub-counties or supplying figures — flagged in the Data Gaps Register rather than distributed across sub-counties by guess.",
  },
};
