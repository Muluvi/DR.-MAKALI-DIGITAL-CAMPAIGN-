/**
 * The nineteen routes of the rebuilt document.
 *
 * Six sections and seven annexes, as <new_structure> specifies — but a section is a unit of
 * ARGUMENT and a route is a unit of TRANSFER, and §5 is 23,000 words. The site already solved
 * this once: old §8 was one section across five routes labelled 8, 8A-8D. Section 5 uses the same
 * device, so the reader meets one Implementation section while the wire carries six files.
 *
 * `number` is what the navigation prints. The HEADINGS inside carry the brief's own numbering
 * (5.1, 5.2.1, ...), which is the document's addressing system and what every cross-reference
 * and deep link resolves against.
 */
export const NEW_ROUTES = [
  { id: "cover",       part: 0,  number: "",   label: "Cover",                  blurb: "Prepared for, prepared by, and the terms in one line" },
  { id: "objectives",  part: 1,  number: "1",  label: "Objectives",             blurb: "What this engagement is for, and how success will be judged" },
  { id: "data",        part: 2,  number: "2",  label: "The Data",               blurb: "What the official record shows, graded by source, with no new polling" },
  { id: "analysis",    part: 3,  number: "3",  label: "The Analysis",           blurb: "The winning number, where it lives, and why he isn't yet reaching it" },
  { id: "strategy",    part: 4,  number: "4",  label: "The Strategy",           blurb: "Each choice tied to the finding it answers" },
  { id: "implementation",        part: 5, number: "5",  label: "Implementation",          blurb: "Who owns what, and the first four weeks" },
  { id: "workstreams-platforms", part: 5, number: "5A", label: "Platforms & content",     blurb: "Workstreams 1-4, and the accessibility standard" },
  { id: "workstreams-media",     part: 5, number: "5B", label: "Publishing & earned media", blurb: "Workstreams 5-6" },
  { id: "workstreams-ground",    part: 5, number: "5C", label: "Ground & offline reach",  blurb: "Workstreams 7-10" },
  { id: "workstreams-data",      part: 5, number: "5D", label: "Data & technology",       blurb: "Workstreams 11-14" },
  { id: "delivery",              part: 5, number: "5E", label: "Delivery & governance",   blurb: "What he receives, how it is measured, decided, staffed and de-risked" },
  { id: "nextsteps",   part: 6,  number: "6",  label: "Next Steps",             blurb: "What the campaign provides, and the decision requested" },
  { id: "annex-evidence", part: 7, number: "A", label: "Annex A — Evidence standard",  blurb: "Provenance rules, the three source tiers, and conflict resolution" },
  { id: "annex-county",   part: 7, number: "B", label: "Annex B — County reference",   blurb: "The 40-ward register, audit record, drought, Mui Basin, and the legal ground on each rival" },
  { id: "annex-polls",    part: 7, number: "C", label: "Annex C — Published polls",    blurb: "For reference only. Each round on its own row, with its method limits" },
  { id: "annex-messages", part: 7, number: "D", label: "Annex D — Message assignment", blurb: "Message by segment and by channel" },
  { id: "annex-cadence",  part: 7, number: "E", label: "Annex E — Cadence & escalation", blurb: "The meeting rhythm and the escalation protocol, in full" },
  { id: "annex-runbooks", part: 7, number: "F", label: "Annex F — Response runbooks",  blurb: "Decision tree, holding positions, security baseline, monitoring tooling" },
  { id: "annex-terms",    part: 7, number: "G", label: "Annex G — Terms",              blurb: "Confidentiality, use, and who this was prepared for" },
];

/** The reading order. Objectives first, then data, analysis, strategy, implementation, the ask. */
export const NEW_FLOW = NEW_ROUTES.filter((r) => r.id !== "cover" && !r.id.startsWith("annex-"))
  .map((r) => r.id)
  .concat(["cover", "annex-evidence", "annex-county", "annex-polls", "annex-messages", "annex-cadence", "annex-runbooks", "annex-terms"]);
