// Phase 4a — electoral history across the 2013, 2017 and 2022 cycles. Feeds §2.2 and
// the Phase 6c electoral-timeline chart.
import type { Source } from "./types";
import { COURT_OF_APPEAL_2018, IEBC_2022_RESULTS, MEDIA_2022_DECLARATION } from "./sources";

export interface RaceResult {
  candidate: string;
  party?: string;
  votes: number;
  source: Source;
  /** Set when this candidate's figure is one of the two disputed values — see data/disputed-figures.ts. */
  disputedFigureId?: string;
}

export interface ElectionRace {
  year: number;
  office: string;
  results: RaceResult[] | null;
  /** Set instead of `results` when the research pass did not supply this race's figures. */
  gapNote?: string;
}

export const ELECTORAL_HISTORY: ElectionRace[] = [
  {
    year: 2013,
    office: "Kitui Governor",
    results: null,
    gapNote:
      "The research pass did not supply sourced 2013 Kitui gubernatorial results (winner, vote totals, or a citation). Not filled in from unsourced recollection — see the Data Gaps Register.",
  },
  {
    year: 2017,
    office: "Kitui Governor",
    results: [
      { candidate: "Charity Ngilu", votes: 169990, source: COURT_OF_APPEAL_2018 },
      { candidate: "David Musila", votes: 114827, source: COURT_OF_APPEAL_2018 },
      { candidate: "Julius Malombe", votes: 74681, source: COURT_OF_APPEAL_2018 },
    ],
  },
  {
    year: 2022,
    office: "Kitui Governor",
    results: [
      { candidate: "Julius Malombe", party: "Wiper", votes: 198004, source: IEBC_2022_RESULTS },
      { candidate: "David Musila", party: "Jubilee", votes: 117606, source: IEBC_2022_RESULTS, disputedFigureId: "musila-2022-governor-votes" },
      { candidate: "Mueke", party: "UDA", votes: 10639, source: IEBC_2022_RESULTS },
    ],
  },
  {
    year: 2022,
    office: "Kitui Senator",
    results: [{ candidate: "Enoch Wambua", votes: 191317, source: MEDIA_2022_DECLARATION }],
  },
  {
    year: 2022,
    office: "Kitui Woman Representative",
    results: [{ candidate: "Irene Kasalu", votes: 201899, source: MEDIA_2022_DECLARATION }],
  },
];

// Musila's 2022 governor figure is 117,606, the IEBC Form 37C total (see data/disputed-figures.ts,
// id "musila-2022-governor-votes", resolved 25 September 2026). The Star's early 114,606 is not
// used. Any render of this race pairs it with <DisputedFigure> so the reader sees both published
// values and why one is preferred (see components/markdown/ElectoralTimelineBlock.tsx).
