// Phase 5c — the wider competitor field. Legal care applies throughout (see PR description /
// <legal_care> in the task brief): only material already established in this document's own
// sourced content appears here; no adverse claims are added from outside knowledge; Malombe's
// term-limit status is presented as an open question with both readings, not a conclusion.
export interface Contender {
  name: string;
  position: string;
  stage: "Wiper ticket" | "General election field";
  note: string;
}

export const CONTENDERS: Contender[] = [
  { name: "Dr. Irene Kasalu", position: "Woman Representative, Kitui County", stage: "Wiper ticket", note: "Currently leading on measured preference (the nomination contest and its selection mechanism section). Full profile in the workstream 8 — The field-to-digital loop section." },
  { name: "Sen. Enoch Wambua", position: "Senator, Kitui County", stage: "Wiper ticket", note: "Senior Wiper standing (the field he is running against section)." },
  { name: "Charity Ngilu", position: "Former Governor, Kitui County (NARC)", stage: "General election field", note: "Won the court-confirmed 2017 governor race (the three election cycles, and the results in dispute section)." },
  { name: "David Musila", position: "Former Senator, Kitui County", stage: "General election field", note: "2022 runner-up figure is disputed (the three election cycles, and the results in dispute section)." },
  { name: "Peninah Malonza", position: "Former Deputy Governor, Kitui County; former Cabinet Secretary", stage: "General election field", note: "No additional sourced material on this contender was supplied by this research pass." },
  { name: "Nicholas Mulila", position: "Safaricom executive", stage: "General election field", note: "No additional sourced material on this contender was supplied by this research pass." },
  { name: "Francis Musili Kauta", position: "Governance activist", stage: "General election field", note: "No additional sourced material on this contender was supplied by this research pass." },
  {
    name: "Julius Malombe",
    position: "Incumbent Governor, Kitui County",
    stage: "General election field",
    note: "Term-limit eligibility for 2027 is an open legal question — see below. Not treated as resolved in this document.",
  },
];

export const MALOMBE_TERM_LIMIT_QUESTION =
  "Malombe served as Kitui Governor 2013–2017, then lost the seat to Ngilu for the 2017–2022 term (the court-confirmed 2017 result, the three election cycles, and the results in dispute section), before winning again in 2022. Whether that non-consecutive, interrupted service counts toward Kenya's two-term gubernatorial limit for a 2027 run is, on the facts established in this document, an open question with two possible readings — that interrupted terms count toward the limit, or that they do not — rather than a settled one. This proposal treats it as unresolved in all planning, per the existing framing in the workstream 8 — The field-to-digital loop section, and does not take a position on which reading is correct.";
