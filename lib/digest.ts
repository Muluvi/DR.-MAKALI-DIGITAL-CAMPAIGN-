/**
 * A chapter's digest: what it concludes, in the chapter's own words and numbers.
 *
 * The flow shows each chapter as one screen before it shows the chapter (streamline pass,
 * November 2026; docs/streamline-2026-11). Nothing in a digest is written for it. It is read out of
 * the chapter's built markdown, the same file the chapter renders from:
 *
 *   THE TAKEAWAY is the chapter's first ```lead fence, which is already a summary drawn from the
 *   chapter's own sentences and checked by scripts/declutter/check-leads.mjs. A chapter that opens
 *   on a plain paragraph instead (the cover, the fine print) gives that paragraph.
 *
 *   THE NUMBERS are the items of the chapter's first `stats` visual, exactly as the chapter prints
 *   them, tier included. A chapter with no stats visual shows none; a number is never lifted out
 *   of prose, because a figure without its label and tier is the thing this document refuses to do.
 *
 * The steps of the argument come from the section index (lib/section-index.ts), which the page
 * already builds from the headings.
 *
 * So a digest cannot drift from its chapter, and no registry value is typed here.
 */

export interface DigestStat {
  /** The value as the chapter prints it: "55.2%", "275,570", "7.2 km". */
  value: string;
  label: string;
  /** 1, 2, 3, "modelled", or absent. */
  tier?: number | string;
}

export interface ChapterDigest {
  /** The takeaway, as markdown. */
  lead: string;
  stats: DigestStat[];
}

/** The most numbers a digest shows: two rows of two on a phone. */
const MAX_STATS = 4;

const FENCE = /^```(\w*)\s*$/;

/** The body of the first fence in `language` that `accept` takes, or null. */
function firstFence(lines: string[], language: string, accept: (body: string) => boolean = () => true): string | null {
  for (let i = 0; i < lines.length; i += 1) {
    const open = FENCE.exec(lines[i]);
    if (!open) continue;
    let end = i + 1;
    while (end < lines.length && !/^```\s*$/.test(lines[end])) end += 1;
    const body = lines.slice(i + 1, end).join("\n").trim();
    if (open[1] === language && accept(body)) return body;
    i = end;
  }
  return null;
}

/** The first paragraph that is prose: not a heading, a fence, a comment, a list or a table. */
function firstParagraph(lines: string[]): string {
  let inFence = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line) continue;
    if (/^(#|<!--|[-*+]\s|\d+\.\s|\||>)/.test(line)) continue;
    return line;
  }
  return "";
}

function statsOf(json: string): DigestStat[] {
  try {
    const spec = JSON.parse(json) as { kind?: string; items?: { value?: unknown; label?: unknown; tier?: unknown }[] };
    if (spec.kind !== "stats" || !Array.isArray(spec.items)) return [];
    return spec.items
      .filter((it) => typeof it?.value === "string" && typeof it?.label === "string")
      .slice(0, MAX_STATS)
      .map((it) => ({
        value: it.value as string,
        label: it.label as string,
        ...(typeof it.tier === "number" || typeof it.tier === "string" ? { tier: it.tier } : {}),
      }));
  } catch {
    return [];
  }
}

const isStats = (body: string) => /^\{\s*"kind"\s*:\s*"stats"/.test(body);

export function chapterDigest(markdown: string): ChapterDigest {
  const lines = markdown.split("\n");
  const lead = firstFence(lines, "lead") ?? firstParagraph(lines);
  const stats = firstFence(lines, "visual", isStats);
  return { lead, stats: stats ? statsOf(stats) : [] };
}
