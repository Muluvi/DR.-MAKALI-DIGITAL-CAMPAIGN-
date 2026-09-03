// Extracts the leading section number from a markdown heading (e.g. "9B. Low-Connectivity…"
// -> "9b", "9A.1 The problem" -> "9a-1") so every numbered section gets a stable, predictable id.
const LEADING_NUMBER = /^(\d+[A-Za-z]?(?:\.\d+)*)\.?\s/;

export function headingNumber(text: string): string | null {
  const match = LEADING_NUMBER.exec(text.trim());
  if (!match) return null;
  return match[1];
}

export function headingSlug(text: string): string | null {
  const num = headingNumber(text);
  if (!num) return null;
  return num.toLowerCase().replace(/\./g, "-");
}

export type TabId = "exec" | "programme" | "registers";

export function sectionId(tabId: TabId, slug: string): string {
  return `${tabId}-sec-${slug}`;
}

// The document's six major parts (== the six tabs in ClientPage). Used as a running-header
// eyebrow label above every major (h2) heading, and to mark part boundaries in Expand-All view.
export const TAB_LABELS: Record<TabId, string> = {
  exec: "The Analysis",
  programme: "The Programme",
  registers: "Registers",
};

// Cross-references the proposal's own prose makes by section number ("Section 22.14", "Section
// 29.1", "Section 31.1", "Section 31.7") into the programme document, from either of the other two
// documents. Numbering is unified and globally unique across all three documents as of the 2026
// restructure, so each key here is unambiguous regardless of which document it's read from.
export const SECTION_TAB_MAP: Record<string, TabId> = {
  "22.14": "programme",
  "29.1": "programme",
  "31.1": "programme",
  "31.7": "programme",
};

// Deep links minted before the six-tab merge. The section slugs are unchanged — only the tab
// they live in moved — so an old link still lands on the right section rather than nowhere.
const RETIRED_TABS: Record<string, TabId> = {
  strategy: "programme",
  operations: "programme",
  tactics: "programme",
  execution: "programme",
  appendix: "registers",
};

// Old section numbers, retired by the 2026 restructure that unified numbering across all three
// documents and folded several thin, letter-suffixed sections (1A, 6A, 8A/8B, 9A/9B, 12A, 16A,
// 17A, 18A, 19A/19B) into subsections of a neighbour. Maps each tab's old slug to its new one, so
// a bookmark or shared link minted against the old numbering still lands on the right section
// instead of silently failing to scroll. Generated from the exact old->new heading map applied in
// that restructure — see the commit "Rebalance section structure and unify numbering across the
// proposal" for how each entry was derived.
const LEGACY_SLUGS: Record<TabId, Record<string, string>> = {
  exec: {
    "14": "13-5",
    "14-1": "13-6",
    "14-2": "13-7",
    "14-3": "13-8",
    "14-4": "13-9",
    "14-5": "13-10",
    "14-6": "13-11",
    "15": "14",
    "15-1": "14-1",
    "15-2": "14-2",
    "15-3": "14-3",
    "15-4": "14-4",
    "15-5": "14-5",
    "16": "15",
    "16-1": "15-1",
    "16-2": "15-2",
    "16-3": "15-3",
    "16-4": "15-4",
    "17": "15-5",
    "17-1": "15-6",
    "17-2": "15-7",
    "17-3": "15-9",
    "17a": "15-8",
    "18": "16",
    "18-1": "16-1",
    "18-2": "16-2",
    "18-3": "16-3",
    "18-4": "16-4",
    "19": "17",
    "19a": "17-1",
    "19b": "17-2",
    "1a": "2",
    "2": "2-1",
    "2-1": "2-2",
    "2-2": "2-3",
    "2-3": "2-4",
    "2-4": "2-5",
    "2-5": "2-6",
    "20": "17-3",
    "20-1": "17-4",
    "20-2": "17-5",
    "20-3": "17-6",
    "20-4": "17-7",
    "6a": "6-3",
    "6a-1": "6-4",
    "6a-2": "6-5",
    "6a-3": "6-6",
    "9a": "9-1",
    "9b": "9-2",
    "9c": "9-3",
  },
  programme: {
    "10": "23",
    "10-1": "23-1",
    "10-2": "23-2",
    "10-3": "23-3",
    "11": "24",
    "11-1": "24-1",
    "11-2": "24-2",
    "11-3": "24-3",
    "11-4": "24-4",
    "12": "25",
    "12-1": "25-1",
    "12-2": "25-2",
    "12-3": "25-3",
    "12-4": "25-4",
    "12-5": "25-5",
    "12a": "25-6",
    "12a-1": "25-7",
    "12a-2": "25-8",
    "12a-3": "25-9",
    "12a-4": "25-10",
    "13": "26",
    "13-1": "26-1",
    "13-2": "26-2",
    "13-3": "26-3",
    "13-4": "26-4",
    "13-5": "26-5",
    "13-6": "26-6",
    "13-7": "26-7",
    "14": "27",
    "14-1": "27-1",
    "14-2": "27-2",
    "14-3": "27-3",
    "14-4": "27-4",
    "14-5": "27-5",
    "14-6": "27-6",
    "15": "27-7",
    "15-1": "27-8",
    "15-2": "27-9",
    "15-3": "27-10",
    "15-4": "27-11",
    "15-5": "27-12",
    "16": "28",
    "16-1": "28-1",
    "16-2": "28-2",
    "16-3": "28-3",
    "16-4": "28-4",
    "16-5": "28-5",
    "16a": "28-6",
    "16a-1": "28-7",
    "16a-2": "28-8",
    "16a-3": "28-9",
    "16a-4": "28-10",
    "16a-5": "28-11",
    "17": "29",
    "17a": "29-1",
    "17a-1": "29-2",
    "17a-2": "29-3",
    "17a-3": "29-4",
    "17a-4": "29-5",
    "17a-5": "29-6",
    "17a-6": "29-7",
    "18": "30",
    "18a": "30-1",
    "18a-1": "30-2",
    "18a-2": "30-3",
    "18a-3": "30-4",
    "18a-4": "30-5",
    "19": "31",
    "19a": "31-1",
    "19a-1": "31-2",
    "19a-2": "31-3",
    "19a-3": "31-4",
    "19a-4": "31-5",
    "19a-5": "31-6",
    "19b": "31-7",
    "19b-1": "31-8",
    "19b-2": "31-9",
    "19b-3": "31-10",
    "19b-4": "31-11",
    "19b-5": "31-12",
    "19b-6": "31-13",
    "19b-7": "31-14",
    "20": "32",
    "21": "33",
    "21-1": "33-1",
    "21-2": "33-2",
    "21-3": "33-3",
    "21-4": "33-4",
    "21-5": "33-5",
    "22": "33-6",
    "23": "33-7",
    "5": "18",
    "5-1": "18-1",
    "5-2": "18-2",
    "5-3": "18-3",
    "5-4": "18-4",
    "6": "19",
    "7": "20",
    "7-1": "20-1",
    "7-2": "20-2",
    "7-3": "20-3",
    "7-4": "20-4",
    "8": "21",
    "8-1": "21-1",
    "8-2": "21-2",
    "8-3": "21-3",
    "8-4": "21-4",
    "8-5": "21-5",
    "8-6": "21-6",
    "8a": "21-7",
    "8a-1": "21-8",
    "8a-2": "21-9",
    "8a-3": "21-10",
    "8a-4": "21-11",
    "8a-5": "21-12",
    "8a-6": "21-13",
    "8b": "21-14",
    "8b-1": "21-15",
    "8b-2": "21-16",
    "8b-3": "21-17",
    "8b-4": "21-18",
    "8b-5": "21-19",
    "8b-6": "21-20",
    "8b-7": "21-21",
    "9": "22",
    "9-1": "22-1",
    "9-2": "22-2",
    "9-3": "22-3",
    "9-4": "22-4",
    "9-5": "22-5",
    "9-6": "22-6",
    "9-7": "22-7",
    "9a": "22-8",
    "9a-1": "22-9",
    "9a-2": "22-10",
    "9a-3": "22-11",
    "9a-4": "22-12",
    "9a-5": "22-13",
    "9b": "22-14",
    "9b-1": "22-15",
    "9b-2": "22-16",
    "9b-3": "22-17",
    "9b-4": "22-18",
    "9b-5": "22-19",
    "9b-6": "22-20",
  },
  registers: {
    "1": "38-1",
    "10": "38-10",
    "11": "38-11",
    "12": "38-12",
    "13": "38-13",
    "14": "38-14",
    "15": "38-15",
    "16": "38-16",
    "17": "38-17",
    "2": "38-2",
    "3": "38-3",
    "4": "38-4",
    "5": "38-5",
    "6": "38-6",
    "7": "38-7",
    "8": "38-8",
    "9": "38-9",
  },
};

/**
 * Resolves a possibly-outdated deep-link id to the id that exists today. Two independent
 * failure modes, both handled here: a retired tab name (see RETIRED_TABS), and a retired
 * section number from the 2026 restructure (see LEGACY_SLUGS).
 *
 * `validIds`, when given, is checked FIRST — if `id` already names a real, current section, it
 * is returned untouched rather than run through LEGACY_SLUGS. This matters because the old and
 * new numbering ranges overlap: e.g. programme's old "§20" is retired to "§32", but "§20" is
 * ALSO the current, correct address of a different section (Geographic & Regional Dynamics).
 * Without this check, a freshly-generated, entirely valid link to the current §20 would be
 * wrongly rewritten to §32. Callers that can supply the live section index should always do so;
 * it is optional only so this function stays usable in contexts without one.
 */
export function resolveLegacySectionId(id: string, validIds?: ReadonlySet<string>): string {
  if (validIds?.has(id)) return id;

  const [tab, ...rest] = id.split("-sec-");
  if (!rest.length) return id;

  const movedTab = RETIRED_TABS[tab];
  const resolvedTab = (movedTab ?? tab) as TabId;
  const slug = rest.join("-sec-");
  const remappedSlug = LEGACY_SLUGS[resolvedTab]?.[slug];

  if (!movedTab && !remappedSlug) return id;

  const resolved = `${resolvedTab}-sec-${remappedSlug ?? slug}`;
  // If the remap still doesn't land on a real section, prefer the pre-LEGACY_SLUGS result
  // (tab-only fix, or the original id) over a guess that's confirmed wrong.
  if (validIds && !validIds.has(resolved)) {
    return movedTab ? `${resolvedTab}-sec-${slug}` : id;
  }
  return resolved;
}

export function crossSectionTarget(sectionNumber: string): string | null {
  const tab = SECTION_TAB_MAP[sectionNumber];
  if (!tab) return null;
  return sectionId(tab, sectionNumber.toLowerCase());
}
