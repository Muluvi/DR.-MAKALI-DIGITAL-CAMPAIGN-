import LEGACY_ID_TABLE from "./legacy-ids.json";

// Extracts the leading section number from a markdown heading (e.g. "4.3 SMS, USSD and the
// offline majority" -> "4-3", "4.3.2 The SMS layer" -> "4-3-2") so every numbered heading gets a
// stable, predictable id.
//
// Numbering is section.sub-section.part across the whole document, and each top-level section
// lives in its own file, so a slug is unique within its section and the id is unique globally.
const LEADING_NUMBER = /^((?:\d+[A-Z]?(?:\.\d+)*|[A-G](?:\.\d+)+))\.?\s/;

export function headingNumber(text: string): string | null {
  const match = LEADING_NUMBER.exec(text.trim());
  if (!match) return null;
  return match[1];
}

export function headingSlug(text: string): string | null {
  const num = headingNumber(text);
  if (!num) return null;
  // Lowercased so a lettered number ("1A.4") yields the same id shape as a plain one
  // ("presence-sec-1a-4"). Purely numeric slugs are unaffected, so no existing id moves.
  return num.replace(/\./g, "-").toLowerCase();
}

// The proposal's parts, in reading order.
//
// Two routes carry numbers that look like gaps and are not. The decision route is Section 0 and
// the scope index is Section 8.0, because both were added to a document already numbered 1..16
// with 241 headings hanging off it. Numbering the decision route "1" would have renumbered every
// section after it, invalidated 837 legacy deep links and rewritten every cross-reference in
// 52,000 words to move one page to the front. Section 0 costs nothing and reads correctly: it is
// the page before the proposal starts. Section 8.0 is the index to 8.1-8.15 on the same logic.
//
// Two layers. `decision` is the decision layer — objectives, scope, budget and the ask, promoted
// out of the old Parts 7-9 so a reader with fifteen minutes can stop there and still have the
// whole offer. Everything after it is the audit layer, ordered the way the argument is actually
// built: what we know and what it implies, what we will therefore do, how it runs, and how it is
// delivered and proved.
//
// Part 4 is five parallel tracks rather than one part, because nothing in the defence track
// depends on having read the ground track. The reader enters at the track they own.
// Labels are the navigation, so they are sized for the narrowest place they appear.
//
// Four of them used to open "Scope of work — " and run to 43 characters. In the mobile dock's
// current-section slot and in the sticky bar they truncate, so a reader in §8C saw
// "Scope of work — ground and…" — the fifteen characters all four share, and none of the word
// that tells them apart. The prefix now lives in the part label (PARTS, part 8) where it is
// stated once, and each section keeps only what distinguishes it.
export const SECTIONS = [
  { id: "cover", part: 0, number: "", label: "Cover", blurb: "Prepared for, prepared by, and on what terms" },
  { id: "objectives", part: 1, number: "1", label: "Objectives", blurb: "What this engagement is for, and how success will be judged" },
  { id: "data", part: 2, number: "2", label: "The Data", blurb: "What the official record shows, graded by source, with no new polling" },
  { id: "analysis", part: 3, number: "3", label: "The Analysis", blurb: "The winning number, where it lives, and why he isn't yet reaching it" },
  { id: "strategy", part: 4, number: "4", label: "The Strategy", blurb: "Each choice tied to the finding it answers" },
  { id: "implementation", part: 5, number: "5", label: "Implementation", blurb: "Who owns what, and the first four weeks" },
  { id: "workstreams-platforms", part: 5, number: "5A", label: "Platforms & content", blurb: "Workstreams 1-4, and the accessibility standard" },
  { id: "workstreams-media", part: 5, number: "5B", label: "Publishing & earned media", blurb: "Workstreams 5-6" },
  { id: "workstreams-ground", part: 5, number: "5C", label: "Ground & offline reach", blurb: "Workstreams 7-10" },
  { id: "workstreams-data", part: 5, number: "5D", label: "Data & technology", blurb: "Workstreams 11-14" },
  { id: "delivery", part: 5, number: "5E", label: "Delivery & governance", blurb: "What he receives, how it is measured, decided, staffed and de-risked" },
  { id: "nextsteps", part: 6, number: "6", label: "Next Steps", blurb: "What the campaign provides, and the decision requested" },
  { id: "annex-evidence", part: 7, number: "A", label: "Annex A \u2014 Evidence standard", blurb: "Provenance rules, the three source tiers, and conflict resolution" },
  { id: "annex-county", part: 7, number: "B", label: "Annex B \u2014 County reference", blurb: "The 40-ward register, the audit record, drought, Mui Basin, and the legal ground on each rival" },
  { id: "annex-polls", part: 7, number: "C", label: "Annex C \u2014 Published polls", blurb: "For reference only. Each round on its own row, with its method limits" },
  { id: "annex-messages", part: 7, number: "D", label: "Annex D \u2014 Message assignment", blurb: "Message by segment and by channel \u2014 the studio's production reference" },
  { id: "annex-cadence", part: 7, number: "E", label: "Annex E \u2014 Cadence & escalation", blurb: "The meeting rhythm and the escalation protocol, in full" },
  { id: "annex-runbooks", part: 7, number: "F", label: "Annex F \u2014 Response runbooks", blurb: "Decision tree, holding positions, security baseline, monitoring tooling" },
  { id: "annex-terms", part: 7, number: "G", label: "Annex G \u2014 Terms", blurb: "Confidentiality, use, and who this was prepared for" },
] as const;



export type TabId = (typeof SECTIONS)[number]["id"];

/** The five parts, for navigation that groups Part 4's five parallel tracks under one choice. */
export const PARTS = [
  { part: 0, label: "Cover", blurb: "Who this is for, and on what terms" },
  { part: 1, label: "Objectives", blurb: "What this engagement is for, and how success will be judged" },
  { part: 2, label: "The Data", blurb: "What the official record shows, graded by source" },
  { part: 3, label: "The Analysis", blurb: "The winning number, where it lives, and why he isn't yet reaching it" },
  { part: 4, label: "The Strategy", blurb: "Each choice tied to the finding it answers" },
  { part: 5, label: "Implementation", blurb: "Who does what, when, and how it's checked" },
  { part: 6, label: "Next Steps", blurb: "What the campaign provides, and the decision requested" },
  { part: 7, label: "Annexes", blurb: "Evidence standard, county reference, polls, and the runbooks" },
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

// Deep links minted before this restructure. Two generations of them: the six-tab merge
// (strategy/operations/tactics/execution/appendix) and the 2026 renumbering that produced the
// three-tab exec/programme/registers document. Both are resolved here so a bookmark or a link
// already shared with the campaign still lands on the right section rather than nowhere.
//
// NOTE: "strategy" is both a retired six-tab name here and a live part id today. That is safe
// only because resolveLegacySectionId checks the live section index BEFORE consulting this
// table, so a current strategy id is returned untouched and never aliased to "programme".
// Always pass validIds. scripts/verify-deep-links.mjs asserts both directions hold.
/**
 * Retired. It mapped an OLD TAB NAME to a current one, which worked for three restructures
 * because a section's printed NUMBER never moved — only the file it lived in. The 2026 rebuild
 * renumbered the whole document, so knowing an id's old tab no longer tells you anything about
 * where its number went, and every mapping has to be explicit. The twenty-four entries that were
 * stored here were full ids rather than tab names, so they never matched this lookup at all;
 * they are now in legacy-ids.json, where they do.
 */
const TAB_ALIASES: Record<string, string> = {};

// Old id -> current id. Three generations of deep link resolve here.
//
// 1. The six-tab document (strategy/operations/tactics/execution/appendix), via TAB_ALIASES.
// 2. The three-tab exec/programme/registers document.
// 3. The ten-part overview/race/argument/... document, retired by the five-part restructure.
//
// Every entry was generated by diffing the section index either side of a restructure, never
// hand-written: a section's printed number is stable across all three generations, so an old id
// resolves by looking its number up in the index that exists today. Entries whose target was one
// of the deleted registers (§34, §35, §37, §38, §39) are absent by design — there is nothing left
// for them to point at.
//
// Verified mechanically by scripts/verify-deep-links.mjs, which fails the build if any key here
// resolves to an id the document no longer offers.
/**
 * Old id -> current id. Four generations of deep link resolve here, 1,174 of them.
 *
 * 1. The six-tab document (strategy/operations/tactics/execution/appendix).
 * 2. The three-tab exec/programme/registers document.
 * 3. The ten-part overview/race/argument document.
 * 4. The thirty-route numbered proposal, retired by the 2026 restructure into six sections and
 *    seven annexes.
 *
 * Generations 1-3 were generated by diffing the section index either side of a move, which was
 * sound only because a section's printed number survived every one of them. The fourth
 * generation renumbered the document, so its entries are composed: each older id was pushed
 * through scripts/rebuild/mapping.mjs to wherever its target ended up. Nothing here is
 * hand-written, and scripts/verify-deep-links.mjs fails the build if any key resolves to an id
 * the document no longer offers.
 *
 * ONE ID IS DELIBERATELY ABSENT. "cover-sec-1-1" pointed at §1.1 "Proposal identification", whose
 * content is now the cover itself — an unnumbered heading, and therefore one with no address to
 * resolve to. Mapping it to the bare route would hand the router a fragment it cannot parse, so
 * it is left out: the link opens the document at the top, which is where that heading now is.
 */
const LEGACY_IDS: Record<string, string> = LEGACY_ID_TABLE;

/**
 * Resolves a possibly-outdated deep-link id to the id that exists today.
 *
 * `validIds`, when given, is checked FIRST — if `id` already names a real, current section it is
 * returned untouched rather than run through the legacy map. The old and new numbering ranges
 * overlap (old "exec-sec-9" and current "channels-sec-3-1" are different addresses for the same
 * material, but old "programme-sec-20" and current "race-sec-1-4" are not), so callers that can
 * supply the live section index should always do so.
 */
export function resolveLegacySectionId(id: string, validIds?: ReadonlySet<string>): string {
  if (!id) return id;
  if (validIds?.has(id)) return id;

  const [tab, ...rest] = id.split("-sec-");
  if (!rest.length) return id;

  const direct = LEGACY_IDS[id];
  if (direct && (!validIds || validIds.has(direct))) return direct;

  const canonicalTab = TAB_ALIASES[tab] ?? tab;
  const canonicalId = `${canonicalTab}-sec-${rest.join("-sec-")}`;
  const resolved = LEGACY_IDS[canonicalId];
  if (!resolved) return id;
  // If the remap doesn't land on a real section, prefer the original over a guess known to be wrong.
  if (validIds && !validIds.has(resolved)) return id;
  return resolved;
}
