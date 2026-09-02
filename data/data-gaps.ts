// Phase 5e — the Data Gaps Register. A tracked deliverable, not an apology: it scopes the
// research the campaign would be buying next. Includes the explicit not-found list the research
// pass supplied, plus a handful of gaps this integration pass surfaced while sourcing new
// figures (each cross-references the section that flagged it).
export type AcquisitionRoute = "Official request" | "Purchase" | "Primary research";

export interface DataGap {
  dataset: string;
  whyItMatters: string;
  acquisitionRoute: AcquisitionRoute;
}

export const DATA_GAPS: DataGap[] = [
  { dataset: "Polling stations by ward", whyItMatters: "Ward-level GOTV and agent-deployment planning needs the polling-station count, not just the register total.", acquisitionRoute: "Official request" },
  { dataset: "Turnout by constituency (2022)", whyItMatters: "The ~62% county turnout figure (Section 4.3) hides real variance the targeting model needs constituency-level.", acquisitionRoute: "Official request" },
  { dataset: "MP vote totals (2013 / 2017 / 2022)", whyItMatters: "Dr. Mulu's own constituency margins are the most direct evidence of his personal vote — not supplied for any cycle.", acquisitionRoute: "Official request" },
  { dataset: "KNBS population totals for the five unlisted constituencies", whyItMatters: "Section 4.5 has the county total; only Kitui Central's constituency figure is in dispute (Section 4.6) — the other five constituencies' totals were not supplied at all.", acquisitionRoute: "Official request" },
  { dataset: "Wiper's written nomination rules", whyItMatters: "The single most important document for verifying or refuting the Tier 3 opinion-poll claim in Section 1A.", acquisitionRoute: "Official request" },
  { dataset: "Kitui health, water, electricity, unemployment and PWD indicators", whyItMatters: "The 'Economist Governor' narrative (Section 3) needs current sector indicators beyond the 2019 census baseline.", acquisitionRoute: "Official request" },
  { dataset: "Current county pending bills (post-FY2020/21)", whyItMatters: "Section 4.7 can only show the FY2020/21 figure (~KSh1.3bn) — the campaign needs the current number, not a five-year-old one.", acquisitionRoute: "Official request" },
  { dataset: "Radio listenership figures", whyItMatters: "The media ownership map (Section 17A.7) can only rank stations qualitatively without measured reach.", acquisitionRoute: "Purchase" },
  { dataset: "Ad rate cards (radio, print, digital)", whyItMatters: "Section 8B's unit-economics model has SMS/USSD rates but no earned-adjacent paid-media rate cards.", acquisitionRoute: "Primary research" },
  { dataset: "IEBC nomination fee schedule", whyItMatters: "A direct campaign-finance input the budget model (Section 8B) does not yet carry.", acquisitionRoute: "Official request" },
  { dataset: "ODPC political-messaging guidance", whyItMatters: "The Ethical Data Use section (Section 16) references the Data Protection Act generally; specific ODPC guidance on political messaging was not supplied.", acquisitionRoute: "Official request" },
  { dataset: "Non-Mizani polling", whyItMatters: "The polling section (Section 1.1) currently rests on two Mizani Africa rounds only — a second pollster would let the campaign cross-check the trend.", acquisitionRoute: "Purchase" },
  { dataset: "Issue salience research (what voters actually rank first)", whyItMatters: "The 'Economist Governor' narrative assumes fiscal competence is a top-ranked issue; this has not been tested directly.", acquisitionRoute: "Primary research" },
  { dataset: "Diaspora registration numbers", whyItMatters: "Section 8B.5's Tier 3 plan references the 26 countries IEBC is opening to diaspora registration without a Kitui-specific diaspora count.", acquisitionRoute: "Official request" },
  { dataset: "2013 Kitui gubernatorial result", whyItMatters: "Section 4.6's electoral timeline is missing its first data point entirely — no winner or vote totals were supplied for this cycle.", acquisitionRoute: "Official request" },
  { dataset: "Musila's 2022 vote total — primary IEBC declaration form", whyItMatters: "Resolves the Star-vs-Standard/Nation dispute in Section 4.6 with the single Tier 1 source that settles it.", acquisitionRoute: "Official request" },
  { dataset: "FY2025/26 Q1 CBIRR (primary document)", whyItMatters: "Resolves the 18%-vs-~5% absorption-rate dispute in Section 4.7 directly rather than via secondary reporting.", acquisitionRoute: "Official request" },
  { dataset: "Mui Basin concession count, petition status and displacement headcount", whyItMatters: "Section 4.9 currently carries qualitative statements only — no concession count, current Petition 12 of 2014 status, or displacement figure was supplied.", acquisitionRoute: "Official request" },
  { dataset: "March 2026 flooding — sub-county breakdown", whyItMatters: "Section 4.8 can only report that flooding was reported, not which sub-counties or to what extent.", acquisitionRoute: "Primary research" },
];
