import { headingNumber, headingSlug, sectionId, TAB_LABELS, type TabId } from "./heading-slug";

/**
 * The document's section index, derived from the markdown at build time.
 *
 * This replaces a hand-maintained list of 43 entries that had drifted badly from the content it
 * indexed: it carried strategy-sec-3 and strategy-sec-4, which do not exist, and titled
 * strategy-sec-5 "Coalition Architecture & Regional Blocs" when §5 of strategy.md is "Strategic
 * Communication Pillars". The drift was a symptom of the two colliding section-number universes
 * — exec.md numbers its own sections 1–20 with entirely different titles from the tab documents
 * that use the same numbers — so a hand-written index had no way to stay correct.
 *
 * Generating it means the index cannot disagree with the document. Parsing happens on the server
 * in app/page.tsx, so no markdown or parser reaches the client bundle.
 */

export interface SectionItem {
  /** Deep-link target, "<tab>-sec-<slug>". */
  id: string;
  /** Section number as printed, e.g. "9B" or "2.10". */
  number: string;
  title: string;
  tabId: TabId;
  tabLabel: string;
  /** 2 for a major section, 3 for a subsection. */
  level: 2 | 3;
}

const HEADING = /^(#{2,3})\s+(.+?)\s*$/;

/** Strip markdown emphasis and trailing editorial markers from a heading. */
function cleanTitle(raw: string): string {
  return raw
    .replace(/\*\((new|updated)\)\*/gi, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/\s*\$?\\?ge\s*[\d,]+\$?/g, "")
    .trim();
}

/** Drop the leading number from the title, since the index shows it in its own column. */
function titleWithoutNumber(title: string, number: string): string {
  const withoutNum = title.replace(new RegExp(`^${number.replace(/\./g, "\\.")}\\.?\\s*`), "");
  return withoutNum || title;
}

export function buildSectionIndex(documents: Record<TabId, string>): SectionItem[] {
  const items: SectionItem[] = [];
  const seen = new Set<string>();

  for (const [tab, source] of Object.entries(documents) as [TabId, string][]) {
    let inFence = false;
    for (const line of source.split("\n")) {
      // Headings inside fenced code blocks are ASCII diagrams, not sections.
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;

      const match = HEADING.exec(line);
      if (!match) continue;

      const level = match[1].length as 2 | 3;
      const title = cleanTitle(match[2]);
      const number = headingNumber(title);
      const slug = headingSlug(title);
      if (!number || !slug) continue;

      const id = sectionId(tab, slug);
      if (seen.has(id)) continue;
      seen.add(id);

      items.push({
        id,
        number,
        title: titleWithoutNumber(title, number),
        tabId: tab,
        tabLabel: TAB_LABELS[tab],
        level,
      });
    }
  }

  return items;
}
