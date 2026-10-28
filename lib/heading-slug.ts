import { ANCHOR_REDIRECTS } from "./anchors/redirects";

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
// Decision first (the October 2026 restructure, docs/restructure-2026-10/preview.md). Part 1 is
// the decision: the ask, the goal, the objectives, who owns what, the levels, the commitments,
// what the campaign must provide and the assumptions. A reader with fifteen minutes can stop there
// and still have the whole offer. Then the evidence (the record and what it implies, one chain),
// the strategy, delivery, measurement and governance, and risks, with the reference material in
// the annexes.
//
// Part 4 is seven routes rather than one: the operating model, the fourteen workstreams in four
// files, and the staffing. A route is a unit of transfer, a part a unit of argument.
//
// Labels are the navigation, so they are sized for the narrowest place they appear. The four
// workstream routes carry the same number (4.5) and are told apart by their labels, which differ
// from their first word, so a truncated label in the mobile dock is never four identical prefixes.
// Blurbs are the question each part answers (preview section 5).
export const SECTIONS = [
  { id: "cover", part: 0, number: "", label: "Cover", blurb: "Prepared for, prepared by, and on what terms" },
  { id: "decision", part: 1, number: "1", label: "The decision", blurb: "What is being asked, what do I get, who does what, and what must I decide or provide?" },
  { id: "evidence", part: 2, number: "2", label: "The evidence", blurb: "What does the record show, and why is the plan shaped this way?" },
  { id: "strategy", part: 3, number: "3", label: "The strategy", blurb: "What do we do about it, and why that?" },
  { id: "delivery", part: 4, number: "4", label: "Delivery", blurb: "How is it run, when, by whom? The operating rhythm, the first weeks, the phases and the coalition calendar" },
  { id: "workstreams-platforms", part: 4, number: "4.5", label: "Platforms & content", blurb: "Workstreams 1 to 4, and the accessibility standard" },
  { id: "workstreams-media", part: 4, number: "4.5", label: "Publishing & earned media", blurb: "Workstreams 5 and 6" },
  { id: "workstreams-ground", part: 4, number: "4.5", label: "Ground & offline reach", blurb: "Workstreams 7 to 10" },
  { id: "workstreams-data", part: 4, number: "4.5", label: "Data & technology", blurb: "Workstreams 11 to 14" },
  { id: "staffing", part: 4, number: "4.6", label: "Staffing", blurb: "The Firefly core, the surge roles, and how the existing team is assessed and upskilled" },
  { id: "measurement", part: 5, number: "5", label: "Measurement & governance", blurb: "How will we know it is working, and how is it kept lawful?" },
  { id: "risks", part: 6, number: "6", label: "Risks & response", blurb: "What could go wrong, and what happens when it does?" },
  { id: "annex-evidence", part: 7, number: "A", label: "Annex A \u2014 Evidence standard", blurb: "Provenance rules, the three source tiers, and conflict resolution" },
  { id: "annex-county", part: 7, number: "B", label: "Annex B \u2014 County reference", blurb: "The 40-ward register, the audit record, drought, Mui Basin, and the legal ground on each rival" },
  { id: "annex-messages", part: 7, number: "C", label: "Annex C \u2014 Message assignment", blurb: "Message by segment and by channel \u2014 the studio's production reference" },
  { id: "annex-cadence", part: 7, number: "D", label: "Annex D \u2014 Cadence & escalation", blurb: "The meeting rhythm and the escalation protocol, in full" },
  { id: "annex-runbooks", part: 7, number: "E", label: "Annex E \u2014 Response runbooks", blurb: "Decision tree, holding positions, security baseline, monitoring tooling" },
  { id: "annex-terms", part: 7, number: "F", label: "Annex F \u2014 Terms", blurb: "Confidentiality and use" },
  { id: "annex-spec", part: 7, number: "G", label: "Annex G \u2014 Specifications", blurb: "Platform playbooks, copy samples, the volunteer reference, the technology architecture and the voter model" },
] as const;



export type TabId = (typeof SECTIONS)[number]["id"];

/** The parts, for navigation that groups Part 4's seven routes under one choice. */
export const PARTS = [
  { part: 0, label: "Cover", blurb: "Who this is for, and on what terms" },
  { part: 1, label: "The decision", blurb: "What is being asked, what do I get, who does what, and what must I decide or provide?" },
  { part: 2, label: "The evidence", blurb: "What does the record show, and why is the plan shaped this way?" },
  { part: 3, label: "The strategy", blurb: "What do we do about it, and why that?" },
  { part: 4, label: "Delivery", blurb: "How is it run, when, by whom?" },
  { part: 5, label: "Measurement and governance", blurb: "How will we know it is working, and how is it kept lawful?" },
  { part: 6, label: "Risks and response", blurb: "What could go wrong, and what happens when it does?" },
  { part: 7, label: "Annexes", blurb: "Evidence standard, county reference, message assignment, the runbooks, terms and specifications" },
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
 */
export function resolveLegacySectionId(id: string, validIds?: ReadonlySet<string>): string {
  if (!id) return id;
  if (validIds?.has(id)) return id;
  if (!id.includes("-sec-")) return id;
  const target = ANCHOR_REDIRECTS[id];
  if (!target) return id;
  if (validIds && !validIds.has(target)) return id;
  return target;
}
