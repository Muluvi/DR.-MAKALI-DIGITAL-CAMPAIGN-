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

// The proposal's parts, in reading order: the November 2026 restructure
// (docs/restructure-2026-11/reorganisation-map.md), re-sequenced by the table-of-contents pass
// (docs/toc-2026-11/RESTRUCTURED-TOC.md). Seven parts argue the case; the evidence shelf follows the
// decision, and the working platform (playbooks, runbooks, technology) comes last, after the
// argument, for the team that runs the campaign.
//
// Six Parts, following the campaign-planning sequence: research, then the contest, then the
// strategy the evidence justifies, then delivery, then proof and protection, then the decision.
// One route per chapter, so a chapter is a unit of argument and a link target. The consolidation
// pass (November 2026) folded the four workstream routes into one, "The workstreams", with four
// tabs, and merged commitments, the team, coalitions, the ward register and the glossary into the
// chapters that now hold them.
//
// Labels are the navigation, so they are sized for the narrowest place they appear. Blurbs are the
// question or contents each chapter answers.
export const SECTIONS = [
  { id: "cover", part: 0, number: "", label: "Who this is for", blurb: "Prepared for Dr. Makali Mulu by Firefly Management, and on what terms" },
  { id: "brief", part: 0, number: "", label: "The case on one screen", blurb: "The gap, why it can close, and what Firefly offers" },
  { id: "kitui", part: 1, number: "1", label: "The county in numbers", blurb: "Who lives in Kitui, on what land, and how it is run" },
  { id: "needs", part: 1, number: "3", label: "What voters need", blurb: "Water first, then food, health, roads, jobs, prices and public money" },
  { id: "news", part: 1, number: "4", label: "How voters get news", blurb: "Most of Kitui is offline, so phone, radio and people carry the race" },
  { id: "votes", part: 1, number: "2", label: "How Kitui voted", blurb: "The register, the results since 2013, and the number it takes" },
  { id: "record", part: 2, number: "6", label: "His record and reach", blurb: "A documented record, known mainly in Kitui Central" },
  { id: "diagnosis", part: 2, number: "7", label: "The diagnosis", blurb: "A recognition gap outside Kitui Central, stated as a hypothesis to test" },
  { id: "goal", part: 3, number: "8", label: "The goal", blurb: "The Wiper ticket first, then the county, with five objectives" },
  { id: "position", part: 3, number: "9", label: "The position", blurb: "The Economist Governor, who can show where public money went" },
  { id: "message", part: 3, number: "10", label: "The message", blurb: "One claim, three pillars, six themes, four content types" },
  { id: "voters", part: 3, number: "11", label: "The voters to win", blurb: "Three universes and six segments, by interest, place and life stage" },
  { id: "channels", part: 3, number: "12", label: "Channels and language", blurb: "Where the effort goes, on which channel, in which language" },
  { id: "engagement", part: 4, number: "13", label: "Who does what", blurb: "His team publishes, Firefly runs the platform, one brief a week" },
  { id: "timeline", part: 4, number: "14", label: "Timeline to August 2027", blurb: "Five phases, dated by the electoral calendar" },
  { id: "workstreams", part: 4, number: "15", label: "The fourteen workstreams", blurb: "What each produces, who owns it, and how often it reports" },
  { id: "success", part: 5, number: "18", label: "Measuring success", blurb: "Votes and recognition count; followers and likes do not" },
  { id: "lawful", part: 5, number: "19", label: "Lawful and ethical", blurb: "A data-protection gate, a published charter and IEBC clearance" },
  { id: "platform", part: 6, number: "", label: "The platform in one view", blurb: "Who sees what, who edits what, and what Firefly runs" },
  { id: "receives", part: 6, number: "21", label: "What you get and what you provide", blurb: "Three scope levels, the deliverables, and both sides' commitments" },
  { id: "ask", part: 6, number: "23", label: "The ask", blurb: "The decision in front of him, and the window that sets the pace" },
  { id: "annex-evidence", part: 7, number: "A", label: "Evidence and sources", blurb: "The standard every figure meets, where each comes from, and every ward in one table" },
  { id: "annex-terms", part: 7, number: "G", label: "Fine print", blurb: "Who it is for, how it may be used, and the terms used throughout" },
  { id: "annex-playbooks", part: 8, number: "C", label: "Platform playbooks", blurb: "One job per platform, its formats, copy samples and volunteers" },
  { id: "annex-technology", part: 8, number: "E", label: "Technology", blurb: "The reference architecture and the voter-model dictionary" },
] as const;



export type TabId = (typeof SECTIONS)[number]["id"];

/** The parts, for navigation that groups each Part's chapters under one choice. */
export const PARTS = [
  { part: 0, label: "The case in brief", blurb: "Who this is for, and the argument on one screen" },
  { part: 1, label: "Kitui today", blurb: "What is true about the county and its voters?" },
  { part: 2, label: "His standing", blurb: "Where does Dr. Mulu stand today?" },
  { part: 3, label: "The strategy", blurb: "What should the campaign do, and why?" },
  { part: 4, label: "The plan", blurb: "Who does the work, in what order, and how?" },
  { part: 5, label: "Proof and safeguards", blurb: "How would we know it worked, and that it stayed lawful?" },
  { part: 6, label: "The decision", blurb: "What is Dr. Mulu being asked to decide?" },
  { part: 7, label: "The evidence behind it", blurb: "Where does every figure come from, and on what terms?" },
  { part: 8, label: "The working platform", blurb: "Where the team reads the data, keeps its records and plans the work" },
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
