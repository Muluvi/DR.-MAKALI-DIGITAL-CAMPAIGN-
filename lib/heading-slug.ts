// Extracts the leading section number from a markdown heading (e.g. "4.3 SMS, USSD and the
// offline majority" -> "4-3", "4.3.2 The SMS layer" -> "4-3-2") so every numbered heading gets a
// stable, predictable id.
//
// Numbering is section.sub-section.part across the whole document, and each top-level section
// lives in its own file, so a slug is unique within its section and the id is unique globally.
const LEADING_NUMBER = /^((?:\d+[A-Z]?(?:\.\d+)*|[A-H](?:\.\d+)+))\.?\s/;

export function headingNumber(text: string): string | null {
  const match = LEADING_NUMBER.exec(text.trim());
  if (!match) return null;
  return match[1];
}

/**
 * The heading as the reader sees it: the same words without the leading number. The number still
 * makes the id (headingSlug), so every shared link and every check keyed on it is unchanged.
 */
export function displayTitle(text: string): string {
  return text.trim().replace(LEADING_NUMBER, "").trim() || text.trim();
}

export function headingSlug(text: string): string | null {
  const num = headingNumber(text);
  if (!num) return null;
  // Lowercased so a lettered number ("1A.4") yields the same id shape as a plain one
  // ("presence-sec-1a-4"). Purely numeric slugs are unaffected, so no existing id moves.
  return num.replace(/\./g, "-").toLowerCase();
}

// The chapters, in reading order: the flow pass (November 2026, docs/flow-2026-11/FLOW-PLAN.md).
// One continuous story: the Welcome (part 0, no act opener), then Data, Analysis, Objectives,
// Strategies and Implementation, then the evidence shelf (part 6). `part` groups chapters by stage
// and must match PARTS and lib/flow.ts FLOW_ACTS.
//
// One route per chapter, so a chapter is a unit of the story and a link target. `number` feeds the
// in-prose "Section N" references (components/markdown/SectionNumberMap.tsx) and is never shown.
//
// Labels are the navigation, so they are sized for the narrowest place they appear. Blurbs are the
// question or contents each chapter answers.
export const SECTIONS = [
  { id: "welcome", part: 0, number: "", label: "A welcome from Firefly", blurb: "What Firefly built for the campaign, what is inside, and how to start" },
  { id: "platform", part: 0, number: "", label: "The platform in one view", blurb: "Who sees what, who edits what, and what Firefly runs" },
  { id: "brief", part: 0, number: "", label: "The case on one screen", blurb: "The gap, why it can close, and what Firefly offers" },
  { id: "kitui", part: 1, number: "1", label: "The county in numbers", blurb: "Who lives in Kitui, on what land, and how it is run" },
  { id: "needs", part: 1, number: "3", label: "What voters need", blurb: "Water first, then food, health, roads, jobs, prices and public money" },
  { id: "news", part: 1, number: "4", label: "How voters get news", blurb: "Most of Kitui is offline, so phone, radio and people carry the race" },
  { id: "votes", part: 1, number: "2", label: "How Kitui voted", blurb: "The register and the results since 2013" },
  { id: "record", part: 1, number: "6", label: "His public record", blurb: "What he has done, and where he publishes" },
  { id: "winning", part: 2, number: "", label: "The number it takes", blurb: "The benchmark vote count, and where it can come from" },
  { id: "known", part: 2, number: "", label: "Where he is known, and where not", blurb: "Known in Kitui Central, not yet beyond it" },
  { id: "spend", part: 2, number: "", label: "Where county money goes", blurb: "County spending against need, ward by ward" },
  { id: "diagnosis", part: 2, number: "7", label: "The diagnosis", blurb: "A recognition gap outside Kitui Central, stated as a hypothesis to test" },
  { id: "goal", part: 3, number: "8", label: "The goal and five objectives", blurb: "The Wiper ticket first, then the county, with five objectives" },
  { id: "position", part: 4, number: "9", label: "The position", blurb: "The Economist Governor, who can show where public money went" },
  { id: "message", part: 4, number: "10", label: "The message", blurb: "One claim, three pillars, six themes, four content types" },
  { id: "voters", part: 4, number: "11", label: "The voters to win", blurb: "Three universes and six segments, by interest, place and life stage" },
  { id: "channels", part: 4, number: "12", label: "Channels and language", blurb: "Where the effort goes, on which channel, in which language" },
  { id: "engagement", part: 5, number: "13", label: "Who does what", blurb: "His team publishes, Firefly runs the platform, one brief a week" },
  { id: "week", part: 5, number: "", label: "This week", blurb: "The weekly rhythm, a week of publishing, the meetings, and what to do when the plan changes" },
  { id: "timeline", part: 5, number: "14", label: "Timeline to August 2027", blurb: "Five phases, dated by the electoral calendar" },
  { id: "workstreams", part: 5, number: "15", label: "The fourteen workstreams", blurb: "What each produces, who owns it, and how often it reports" },
  { id: "success", part: 5, number: "18", label: "Measuring success", blurb: "Votes and recognition count; followers and likes do not" },
  { id: "lawful", part: 5, number: "19", label: "Lawful and ethical", blurb: "A data-protection gate, a published charter and IEBC clearance" },
  { id: "receives", part: 5, number: "21", label: "What you get and what you provide", blurb: "Three scope levels, the deliverables, and both sides' commitments" },
  { id: "ask", part: 5, number: "23", label: "The ask", blurb: "The decision in front of him, and the window that sets the pace" },
  { id: "annex-evidence", part: 6, number: "A", label: "Evidence and sources", blurb: "The standard every figure meets, where each comes from, and every ward in one table" },
  { id: "annex-terms", part: 6, number: "G", label: "Fine print", blurb: "Who it is for, how it may be used, and the terms used throughout" },
  { id: "annex-playbooks", part: 6, number: "C", label: "Platform playbooks", blurb: "One job per platform, its formats, copy samples and volunteers" },
  { id: "annex-technology", part: 6, number: "E", label: "Technology", blurb: "The reference architecture and the voter-model dictionary" },
] as const;



export type TabId = (typeof SECTIONS)[number]["id"];

/** The stages, for navigation that groups each stage's chapters under one choice. */
export const PARTS = [
  { part: 0, label: "Welcome", blurb: "What Firefly built for the campaign, what is inside, and how to start" },
  { part: 1, label: "Data", blurb: "What is true about Kitui, its voters and Dr. Mulu?" },
  { part: 2, label: "Analysis", blurb: "What does the data mean for the race?" },
  { part: 3, label: "Objectives", blurb: "What must the campaign achieve?" },
  { part: 4, label: "Strategies", blurb: "How will it achieve it?" },
  { part: 5, label: "Implementation", blurb: "Who does what, when, and how it is measured" },
  { part: 6, label: "The evidence behind it", blurb: "Where every figure comes from, and the terms" },
] as const;

export type PartId = (typeof PARTS)[number]["part"];

export function partOf(tabId: TabId): PartId {
  return (SECTIONS.find((s) => s.id === tabId)?.part ?? 0) as PartId;
}

export const TAB_LABELS: Record<TabId, string> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s.label])
) as Record<TabId, string>;

export function sectionId(tabId: TabId, slug: string): string {
  return `${tabId}-sec-${slug}`;
}

/**
 * Old deep-link id -> the heading it lands on today.
 *
 * The map is generated by scripts/build-anchors.ts from every id that existed before the 2026
 * rebuild (lib/anchors/pre-rebuild.json) and the moves the rebuild made (lib/anchors/rebuild-moves.json).
 * Every entry already points at a live heading, so resolution is one lookup, not a chain. The
 * build fails if any pre-rebuild id lands on nothing.
 *
 * `validIds`, when given, is checked FIRST, so an id that names a live heading is returned as is.
 *
 * The map (1,704 entries, ≈ 9 kB gzipped) is loaded only when an id is not already live, which is
 * the rare case of an old shared link (visual-first pass: it was in every reader's first-load
 * bundle). `isLiveSectionId` answers the common case synchronously.
 */
export function isLiveSectionId(id: string, validIds?: ReadonlySet<string>): boolean {
  return !id || !!validIds?.has(id) || !id.includes("-sec-");
}

export async function resolveLegacySectionId(id: string, validIds?: ReadonlySet<string>): Promise<string> {
  if (isLiveSectionId(id, validIds)) return id;
  const { ANCHOR_REDIRECTS } = await import("./anchors/redirects");
  const target = ANCHOR_REDIRECTS[id];
  if (!target) return id;
  if (validIds && !validIds.has(target)) return id;
  return target;
}
