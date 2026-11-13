import { headingNumber, headingSlug, sectionId, TAB_LABELS, type TabId } from "./heading-slug";
import { REGISTER } from "./register/specs";

/**
 * The document's section index, derived from the markdown at build time.
 *
 * One file per top-level section, so a document's own headings are the only source of truth for
 * the index. Generating it means the index cannot disagree with the document — which matters
 * more since the restructure, because numbering is now section.sub-section.part and a
 * hand-written index would have 262 chances to drift.
 *
 * Parsing happens on the server in app/page.tsx, so no markdown or parser reaches the client
 * bundle.
 */

export interface SectionItem {
  /** Deep-link target, "<tab>-sec-<slug>". */
  id: string;
  /** Section number as printed, e.g. "4.3" or "4.3.2". */
  number: string;
  title: string;
  tabId: TabId;
  tabLabel: string;
  /** 2 for a sub-section, 3 for one of its parts. */
  level: 2 | 3;
  /** The register figures placed in this section, so search finds a figure by its finding. */
  figures?: { id: string; title: string; takeaway: string }[];
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
    let fenceIsFigure = false;
    for (const line of source.split("\n")) {
      // Headings inside fenced code blocks are ASCII diagrams, not sections.
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        fenceIsFigure = inFence && line.trim() === "```figure";
        continue;
      }
      if (inFence) {
        // A figure fence attaches its register figure to the section it sits in.
        const fid = fenceIsFigure ? line.match(/^\s*id:\s*([a-z0-9-]+)\s*$/)?.[1] : undefined;
        const spec = fid ? REGISTER[fid] : undefined;
        const host = items[items.length - 1];
        if (spec && host && host.tabId === tab) (host.figures ??= []).push({ id: spec.id, title: spec.title, takeaway: spec.takeaway });
        continue;
      }

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
