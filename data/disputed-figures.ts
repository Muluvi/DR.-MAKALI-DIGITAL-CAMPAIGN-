// Phase 3 — disputed figures. Three known contradictions in the research pass. None is
// resolved by picking a winner and dropping the other value: every entry keeps both (or all)
// values, both sources, and states either the reason a value is preferred or exactly what
// would resolve the dispute. Rendered by components/markdown/DisputedFigure.tsx.
import type { DisputedFigureEntry } from "./types";
import { KNBS_CENSUS_2019, THE_STAR, STANDARD_NATION, CONTROLLER_OF_BUDGET, MEDIA_ABSORPTION_ALT } from "./sources";

// A constituency-level CDF office webpage is not itself a statistical survey body, so it is
// tiered as Reported (2) rather than Official (1) even though NG-CDF is government-adjacent —
// the entire point of this dispute is that KNBS, the actual census authority, disagrees with it.
const KITUI_CENTRAL_NGCDF_SITE = {
  name: "Kitui Central NG-CDF website",
  publicationDate: "2019",
  tier: 2 as const,
};

export const DISPUTED_FIGURES: DisputedFigureEntry[] = [
  {
    id: "kitui-central-2019-population",
    label: "Kitui Central constituency population, 2019 census",
    values: [
      { value: 105991, unit: "residents", source: KNBS_CENSUS_2019, granularity: "constituency" },
      { value: 175633, unit: "residents", source: KITUI_CENTRAL_NGCDF_SITE, granularity: "constituency" },
    ],
    preferredIndex: 0,
    preferenceReason:
      "KNBS is Kenya's official census authority (Tier 1); the NG-CDF office webpage is not a statistical survey body and does not cite a methodology for its figure.",
    resolutionPath:
      "Cross-check the NG-CDF site's figure against KNBS's constituency-level census volumes directly — it may be conflating population with a different base (e.g. a projected or eligible-beneficiary count) rather than the 2019 census count.",
    status: "resolved-preferred",
  },
  {
    id: "musila-2022-governor-votes",
    label: "David Musila, 2022 Kitui gubernatorial race — runner-up vote total",
    values: [
      { value: 114606, unit: "votes", source: THE_STAR, granularity: "county" },
      { value: 117606, unit: "votes", source: STANDARD_NATION, granularity: "county" },
    ],
    resolutionPath: "The IEBC declaration form (Form 37C or the equivalent gubernatorial declaration) for the 2022 Kitui County result, once obtained, is the only Tier 1 source that settles this.",
    status: "unresolved",
  },
  {
    id: "kitui-fy2025-26-q1-absorption",
    label: "Kitui County FY2025/26 Q1 development-budget absorption rate",
    values: [
      { value: 18, unit: "%", source: CONTROLLER_OF_BUDGET, granularity: "county" },
      { value: 5, unit: "% (approx.)", source: MEDIA_ABSORPTION_ALT, granularity: "county" },
    ],
    resolutionPath: "The primary County Budget Implementation Review Report (CBIRR) for FY2025/26 Q1, once obtained directly rather than via secondary reporting, is the only source that settles this.",
    status: "unresolved",
  },
];
