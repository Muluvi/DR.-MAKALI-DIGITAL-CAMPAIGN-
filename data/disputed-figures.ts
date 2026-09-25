// Phase 3 — disputed figures. Three known contradictions in the research pass, all now resolved
// by a preferred value (September 2026). None is
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
      "KNBS is Kenya's official census authority (Tier 1); the NG-CDF office webpage is not a statistical authority and does not cite a methodology for its figure.",
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
    preferredIndex: 1,
    preferenceReason:
      "117,606 is the IEBC Form 37C total as reported by Nation Africa, and the certified share (35.77%) matches it; Firefly confirmed it on 25 September 2026. The Star's 114,606 was an early media total and is not used.",
    resolutionPath: "The IEBC Form 37C for the 2022 Kitui governor result, held directly, would make the figure Tier 1.",
    status: "resolved-preferred",
  },
  {
    id: "kitui-fy2025-26-q1-absorption",
    label: "Kitui County FY2025/26 Q1 development-budget absorption rate",
    values: [
      { value: 18, unit: "%", source: CONTROLLER_OF_BUDGET, granularity: "county" },
      { value: 5, unit: "% (approx.)", source: MEDIA_ABSORPTION_ALT, granularity: "county" },
    ],
    preferredIndex: 0,
    preferenceReason:
      "The Controller of Budget is the statutory source for county absorption, and its review report gives Kitui's FY2025/26 Q1 development absorption as 18%; Firefly confirmed it on 25 September 2026. The 5% in media reports is not used.",
    resolutionPath: "The primary County Budget Implementation Review Report (CBIRR) for FY2025/26 Q1, held directly rather than via secondary reporting, would attach the document to the figure.",
    status: "resolved-preferred",
  },
];
