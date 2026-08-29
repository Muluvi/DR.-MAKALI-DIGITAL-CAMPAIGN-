// Phase 5a — the nomination path. This is the single most consequential Tier 3 claim in the
// document: the entire Phase −1 strategy is built on the premise that the Wiper Kitui
// gubernatorial ticket will be settled by opinion poll rather than a competitive primary, and
// that premise is single-sourced to local digital media, not confirmed by Wiper itself.
import type { SourcedFigure } from "./types";
import { LOCAL_DIGITAL_NOMINATION_REPORT } from "./sources";

export const NOMINATION_METHOD_CLAIM: SourcedFigure<string> = {
  label: "Wiper Kitui gubernatorial nomination method",
  value: "Reported as an opinion poll, not a competitive primary",
  unit: "method",
  provenance: {
    source: LOCAL_DIGITAL_NOMINATION_REPORT,
    granularity: "county",
    note: "Not confirmed by Wiper. Section 1.1's survey-based strategy assumes this reporting is accurate — if it is wrong, the phasing in Section 20 needs to be revisited before it is acted on.",
  },
};

export const NOMINATION_CONFIRMATION_REQUIREMENTS: string[] = [
  "A Wiper National Executive Council (NEC) resolution formally adopting the opinion-poll method for the Kitui gubernatorial nomination.",
  "The commissioned pollster's terms of reference — sample frame, questionnaire, fieldwork dates, and the count/weighting method — made available to the campaign.",
];
