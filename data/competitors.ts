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
  { name: "Dr. Irene Kasalu", position: "Woman Representative, Kitui County", stage: "Wiper ticket", note: "The highest 2022 result in the field, as Woman Representative, countywide (§2.2). Full profile in Section 3.5." },
  { name: "Sen. Enoch Wambua", position: "Senator, Kitui County", stage: "Wiper ticket", note: "Won the 2022 Senate race, countywide (§2.2)." },
  { name: "Charity Ngilu", position: "Former Governor, Kitui County (NARC)", stage: "General election field", note: "Won the court-confirmed 2017 governor race (§2.2)." },
  { name: "David Musila", position: "Former Senator, Kitui County", stage: "General election field", note: "Runner-up in 2022; the certified total is in §2.2." },
  { name: "Peninah Malonza", position: "Former Deputy Governor, Kitui County; former Cabinet Secretary", stage: "General election field", note: "No additional sourced material on this contender was supplied by this research pass." },
  { name: "Nicholas Mulila", position: "Safaricom executive", stage: "General election field", note: "No additional sourced material on this contender was supplied by this research pass." },
  { name: "Francis Musili Kauta", position: "Governance activist", stage: "General election field", note: "No additional sourced material on this contender was supplied by this research pass." },
  {
    name: "Julius Malombe",
    position: "Incumbent Governor, Kitui County",
    stage: "General election field",
    note: "Term-limited: two terms served (2013–2017, 2022–2027), the limit under Article 180(7). Not in the 2027 field.",
  },
];

export const MALOMBE_TERM_LIMIT_QUESTION =
  "Malombe served as Kitui Governor 2013–2017, lost the seat to Ngilu for the 2017–2022 term (the court-confirmed 2017 result, §2.2), and won again in 2022. Article 180(7) limits a governor to two terms, and he is serving his second, so he cannot stand in 2027. This proposal plans for an open seat throughout (Section 5.8.15).";
