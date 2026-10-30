import { ANCHOR_REDIRECTS } from "./anchors/redirects";

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

export function headingSlug(text: string): string | null {
  const num = headingNumber(text);
  if (!num) return null;
  // Lowercased so a lettered number ("1A.4") yields the same id shape as a plain one
  // ("presence-sec-1a-4"). Purely numeric slugs are unaffected, so no existing id moves.
  return num.replace(/\./g, "-").toLowerCase();
}

// The proposal's parts, in reading order (the November 2026 restructure,
// docs/restructure-2026-11/reorganisation-map.md).
//
// Six Parts, following the campaign-planning sequence: research, then the contest, then the
// strategy the evidence justifies, then delivery, then proof and protection, then the decision.
// One route per chapter, so a chapter is a unit of argument and a link target. Chapter 15 is four
// routes, because the fourteen workstreams would otherwise be the heaviest page on the site; they
// carry 15.1 to 15.4 and are told apart by their labels.
//
// Labels are the navigation, so they are sized for the narrowest place they appear. Blurbs are the
// question or contents each chapter answers.
export const SECTIONS = [
  { id: "cover", part: 0, number: "", label: "Cover", blurb: "Prepared for Dr. Makali Mulu, by Firefly Management, on one line of terms" },
  { id: "brief", part: 0, number: "", label: "In brief", blurb: "The case on one screen" },
  { id: "kitui", part: 1, number: "1", label: "Kitui at a glance", blurb: "The people, the land, living standards, how the county is run, and its money" },
  { id: "votes", part: 1, number: "2", label: "How Kitui voted", blurb: "The electorate, the results since 2013, where the votes are, and the number it takes" },
  { id: "needs", part: 1, number: "3", label: "What voters need", blurb: "Water, food, health, roads, jobs, the cost of living, county money and Mui Basin" },
  { id: "news", part: 1, number: "4", label: "How voters get news", blurb: "Where people get information, who owns the airwaves, and what each channel can reach" },
  { id: "race", part: 2, number: "5", label: "The race for 2027", blurb: "An open seat, the Wiper nomination, the field, and each rival on the record" },
  { id: "record", part: 2, number: "6", label: "Record and reach", blurb: "Dr. Makali Mulu's public record, where he is known, and his channels today" },
  { id: "diagnosis", part: 2, number: "7", label: "The diagnosis", blurb: "What the evidence says, what could overturn it, the gaps and the assumptions" },
  { id: "goal", part: 3, number: "8", label: "The goal", blurb: "The goal, the two deadlines, and five objectives for the digital operation" },
  { id: "position", part: 3, number: "9", label: "The position", blurb: "The Economist Governor: the central claim, the resource paradox, and the answer to 'cold'" },
  { id: "message", part: 3, number: "10", label: "The message", blurb: "One claim, three pillars, six themes; discipline, framing, samples and counter-messaging" },
  { id: "voters", part: 3, number: "11", label: "The voters to win", blurb: "The universes, the six segments, and how large each is" },
  { id: "channels", part: 3, number: "12", label: "Channels & language", blurb: "Where the effort goes, which channel does which job, language, a week, and when the plan changes" },
  { id: "engagement", part: 4, number: "13", label: "How it works", blurb: "How the proposal is built, who owns what, scope, rhythm, approvals and escalation" },
  { id: "timeline", part: 4, number: "14", label: "Timeline to Aug 2027", blurb: "The first four weeks, Phase 0, six fixes, the target ladder and the three phases" },
  { id: "workstreams-platforms", part: 4, number: "15.1", label: "Platforms & content", blurb: "Workstreams 1 to 4: the tracker, the brief, creative testing, accessibility" },
  { id: "workstreams-media", part: 4, number: "15.2", label: "Media", blurb: "Workstreams 5 and 6: paid and earned media" },
  { id: "workstreams-ground", part: 4, number: "15.3", label: "Ground & offline", blurb: "Workstreams 7 to 10: ground integration, the field loop, SMS, USSD and voice, volunteers" },
  { id: "workstreams-data", part: 4, number: "15.4", label: "Data & technology", blurb: "Workstreams 11 to 14: the data layer, the voter model, the stack, analytics" },
  { id: "coalitions", part: 4, number: "16", label: "Coalitions", blurb: "Coalitions and endorsements, in sequence" },
  { id: "team", part: 4, number: "17", label: "The team", blurb: "The Firefly core, the surge roles, and how the existing team is upskilled" },
  { id: "success", part: 5, number: "18", label: "Measuring success", blurb: "How success is judged, the scorecards, recognition, and the presence audit" },
  { id: "lawful", part: 5, number: "19", label: "Lawful & ethical", blurb: "Our standard, the Data Protection Act, the charter, IEBC clearance, open items" },
  { id: "response", part: 5, number: "20", label: "Risks & response", blurb: "Risks, the war room, defamation, manipulated media, competitor monitoring" },
  { id: "receives", part: 6, number: "21", label: "What he receives", blurb: "The three scope levels, compared, and the deliverables schedule" },
  { id: "commitments", part: 6, number: "22", label: "Commitments", blurb: "What Firefly commits to, and what the campaign provides" },
  { id: "ask", part: 6, number: "23", label: "The ask", blurb: "One week and one export, and the window that sets the pace" },
  { id: "annex-evidence", part: 7, number: "A", label: "Annex A — Evidence & sources", blurb: "The evidence standard, the three tiers, and every source" },
  { id: "annex-county", part: 7, number: "B", label: "Annex B — Ward register", blurb: "The 40-ward register, 2022" },
  { id: "annex-playbooks", part: 7, number: "C", label: "Annex C — Playbooks", blurb: "Platform playbooks, formats and copy samples" },
  { id: "annex-volunteers", part: 7, number: "D", label: "Annex D — Volunteers", blurb: "The volunteer programme reference" },
  { id: "annex-technology", part: 7, number: "E", label: "Annex E — Technology", blurb: "The technology architecture and the voter model" },
  { id: "annex-runbooks", part: 7, number: "F", label: "Annex F — Runbooks", blurb: "Response tiers, holding lines, security and incidents" },
  { id: "annex-terms", part: 7, number: "G", label: "Annex G — Terms", blurb: "Confidentiality and use" },
  { id: "annex-glossary", part: 7, number: "H", label: "Annex H — Glossary", blurb: "The terms of art, one plain line each" },
] as const;



export type TabId = (typeof SECTIONS)[number]["id"];

/** The parts, for navigation that groups each Part's chapters under one choice. */
export const PARTS = [
  { part: 0, label: "Cover", blurb: "Who this is for, and the case on one screen" },
  { part: 1, label: "Part I — Kitui today", blurb: "Who lives here, and what do they need?" },
  { part: 2, label: "Part II — The contest", blurb: "Who is running, and where does Dr. Mulu stand?" },
  { part: 3, label: "Part III — The strategy", blurb: "What should the campaign do, and why?" },
  { part: 4, label: "Part IV — How Firefly delivers", blurb: "Who does the work, when, and how?" },
  { part: 5, label: "Part V — Proof and protection", blurb: "How will we know it works, and how is it kept safe and lawful?" },
  { part: 6, label: "Part VI — The decision", blurb: "What is Dr. Mulu being asked to decide?" },
  { part: 7, label: "Annexes", blurb: "Reference" },
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
