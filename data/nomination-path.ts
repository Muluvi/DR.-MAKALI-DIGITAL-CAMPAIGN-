// Phase 5a — the nomination path. This is the single most consequential Tier 3 claim in the
// document: the entire Phase −1 strategy is built on the premise that the Wiper Kitui
// gubernatorial ticket will be settled by a party-run countywide selection rather than a
// competitive primary, and
// that premise is single-sourced to local digital media, not confirmed by Wiper itself.
import type { SourcedFigure } from "./types";
import { LOCAL_DIGITAL_NOMINATION_REPORT } from "./sources";

export const NOMINATION_METHOD_CLAIM: SourcedFigure<string> = {
  label: "Wiper Kitui gubernatorial nomination method",
  value: "Reported as a party-run countywide selection, not a competitive primary",
  unit: "method",
  provenance: {
    source: LOCAL_DIGITAL_NOMINATION_REPORT,
    granularity: "county",
    note: "Not confirmed by Wiper. The Phase −1 strategy assumes this reporting is accurate — if it is wrong, the phasing in Section 1.5 needs to be revisited before it is acted on.",
  },
};

export const NOMINATION_CONFIRMATION_REQUIREMENTS: string[] = [
  "A Wiper National Executive Council (NEC) resolution formally adopting the selection method for the Kitui gubernatorial nomination.",
  "The party's nomination rules and timetable for 2027, as filed with the IEBC and the Office of the Registrar of Political Parties.",
];
