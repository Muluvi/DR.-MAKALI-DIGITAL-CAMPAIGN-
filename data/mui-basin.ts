// Phase 4d — the Mui Basin coal question. Feeds the new Section 4.9.
//
// The research hand-off supplied this as qualitative context (concessions exist, development
// has stalled for roughly a decade, a legal challenge is on record, communities face
// displacement exposure) rather than as measured figures — no concession count, no displacement
// headcount, and no specific court/bench for the petition were given. Modelled as sourced
// statements rather than forced into SourcedFigure<number>, since inventing numbers to fit that
// shape would violate the "never invent a figure absent from the source material" rule. Gaps
// are named explicitly and carried into the Data Gaps Register (Appendix C).
import type { Source, Granularity } from "./types";
import { MEDIA_MUI_BASIN, PETITION_12_2014 } from "./sources";

export interface QualitativeFact {
  label: string;
  statement: string;
  source: Source;
  granularity: Granularity;
  note?: string;
}

export const MUI_BASIN_FACTS: QualitativeFact[] = [
  {
    label: "Concessions",
    statement: "Coal concessions were granted covering blocks of the Mui Basin, straddling Kitui East and Kitui South.",
    source: MEDIA_MUI_BASIN,
    granularity: "county",
    note: "No exact concession count or block-by-block boundary was supplied by the research pass.",
  },
  {
    label: "A stalled decade",
    statement: "Roughly a decade on from the original concessions, no commercial coal mining is underway in the Mui Basin.",
    source: MEDIA_MUI_BASIN,
    granularity: "county",
  },
  {
    label: "Legal challenge on record",
    statement: "Petition 12 of 2014 is the legal challenge on record concerning the Mui Basin concessions.",
    source: PETITION_12_2014,
    granularity: "county",
    note: "The specific court/bench and current status of the petition were not supplied — see the Data Gaps Register.",
  },
  {
    label: "Displacement exposure",
    statement: "Local communities in the affected wards carry displacement exposure should mining activity proceed.",
    source: MEDIA_MUI_BASIN,
    granularity: "county",
    note: "No displacement headcount, household count, or named-ward breakdown was supplied by the research pass.",
  },
];
