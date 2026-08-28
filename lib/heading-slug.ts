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

export type TabId = "exec" | "strategy" | "operations" | "tactics" | "execution" | "appendix";

export function sectionId(tabId: TabId, slug: string): string {
  return `${tabId}-sec-${slug}`;
}

// The document's six major parts (== the six tabs in ClientPage). Used as a running-header
// eyebrow label above every major (h2) heading, and to mark part boundaries in Expand-All view.
export const TAB_LABELS: Record<TabId, string> = {
  exec: "Executive Summary",
  strategy: "Strategy & Targeting",
  operations: "Operations & Architecture",
  tactics: "Tactics & Themes",
  execution: "Implementation & KPIs",
  appendix: "Appendix",
};

// Cross-references the proposal's own prose makes by section number ("Section 19B", "Section 9B",
// "Section 17A"). Some numbers (17A, 19B) appear as headings in more than one tab because the
// source markdown duplicates that content across the strategy and tactics documents; the map below
// points each reference at its first, canonical appearance so links are unambiguous.
export const SECTION_TAB_MAP: Record<string, TabId> = {
  "9B": "operations",
  "17A": "strategy",
  "19B": "strategy",
};

export function crossSectionTarget(sectionNumber: string): string | null {
  const tab = SECTION_TAB_MAP[sectionNumber];
  if (!tab) return null;
  return sectionId(tab, sectionNumber.toLowerCase());
}
