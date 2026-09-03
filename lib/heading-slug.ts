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

export function resolveLegacySectionId(id: string): string {
  const [tab, ...rest] = id.split("-sec-");
  if (!rest.length) return id;
  const moved = RETIRED_TABS[tab];
  return moved ? `${moved}-sec-${rest.join("-sec-")}` : id;
}

export function crossSectionTarget(sectionNumber: string): string | null {
  const tab = SECTION_TAB_MAP[sectionNumber];
  if (!tab) return null;
  return sectionId(tab, sectionNumber.toLowerCase());
}
