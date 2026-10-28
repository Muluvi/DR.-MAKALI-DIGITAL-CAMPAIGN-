/**
 * How one section's body is laid out on the page: what shows on load, and what sits behind
 * "Read the full text".
 *
 * The site has one version (brief 2026-10 declutter, section 5.0; the Brief/Full reading mode and
 * its rule that nothing is summarised are retired, see docs/declutter/DECISIONS.md). Every section
 * is laid out by one of three rules:
 *
 *   A LEAD. A section whose body carries a ```lead fence opens on that lead (a summary drawn from the
 *   section's own sentences, checked by scripts/declutter/check-leads.mjs), then its visuals: every
 *   ```figure, ```visual and ```textversion fence, in document order, and any block marked
 *   `<!-- keep -->`. The section's original prose follows in one closed "Read the full text" fold.
 *
 *   A GROUP. A section written as three or more comparable h4 blocks (six voter segments with the
 *   same seven fields) is an accordion: the labels show, one panel is open at a time.
 *
 *   THE DEFAULT. Any other section shows its first paragraph when it is 60 words or fewer, a
 *   paragraph that is wholly bold and short (this document writes its findings that way), its
 *   visuals and its keep-marked blocks. The rest folds, once there is enough of it to be worth a
 *   tap. A section of 60 words or fewer shows as written.
 *
 * Nothing is deleted here and nothing is rewritten: every line of the body is in exactly one of the
 * shown or folded parts. Order is kept within each part; a folded block that sat between two shown
 * ones moves below them, which is the one compromise one fold per section requires.
 *
 * Deliberately rule-driven rather than a hand-kept list of section numbers: this document has
 * been renumbered three times, and every hardcoded section list in this repo had drifted out of
 * date by the time anyone looked at it.
 */

/** Below this, a run of headings is short enough to just read. */
const MIN_PANELS = 3;
/** Below this, the block is not heavy enough for the interaction to be worth it. */
const MIN_WORDS = 150;
/** The longest paragraph a reader meets on load (brief 2026-10 declutter, section 3). */
export const MAX_VISIBLE_PARAGRAPH = 60;
/** A section this short shows as written. */
const SHOW_ALL_WORDS = 60;
/** A fold that hides less than this is friction: the tap costs more than the scroll. */
const MIN_FOLDED = 40;
/** A wholly bold paragraph shows on load up to this length. */
const MAX_FINDING = 40;

/** A line that marks the block after it as shown on load (a published commitment, for instance). */
export const KEEP_MARKER = /^\s*<!--\s*keep\s*-->\s*$/;

/**
 * A block carrying a figure the campaign has not yet established — an `[Insert …]` placeholder,
 * a `[Confirm …]`, or a `Not yet` KPI baseline cell.
 *
 * The document is deliberate about marking what it does not know, and that honesty is worth more
 * to a professional reader than a confident-sounding gap would be. Panels carrying one are
 * flagged so the marker is visible on the closed label, rather than only to whoever opens it.
 */
const UNRESOLVED = /\[Insert|\[Confirm|\bNot yet\b/i;

export function hasUnresolvedFigure(text: string): boolean {
  return UNRESOLVED.test(text);
}

export type Segment =
  | { kind: "markdown"; text: string }
  | { kind: "group"; id: string; panels: { label: string; text: string; unresolved: boolean }[] }
  /** A section's folded text: closed by default, "Read the full text (N words)". */
  | { kind: "more"; id: string; text: string; words: number };

const FENCE = /^\s*```/;
const SECTION_HEADING = /^(#{2,3})\s+(.+?)\s*$/;
const PANEL_HEADING = /^(#{4,5})\s+(.+?)\s*$/;
/** The fences that show on load wherever they sit: they are what replaces the prose. */
const VISUAL_FENCE = /^\s*```(?:figure|visual|textversion|lead)\s*$/;

/** Strip markdown emphasis from a heading so it can be used as a button label. */
function cleanLabel(raw: string): string {
  return raw
    .replace(/\*\((new|updated)\)\*/gi, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .trim();
}

function wordCount(lines: string[]): number {
  return lines.reduce((n, line) => n + line.trim().split(/\s+/).filter(Boolean).length, 0);
}

/** Words outside every fence: the running prose a reader would have to read. */
export function proseWords(lines: string[]): number {
  let inFence = false;
  let n = 0;
  for (const line of lines) {
    if (FENCE.test(line)) { inFence = !inFence; continue; }
    if (inFence || KEEP_MARKER.test(line)) continue;
    n += line.trim().split(/\s+/).filter(Boolean).length;
  }
  return n;
}

function makePanel(current: { label: string; lines: string[] }) {
  const text = current.lines.join("\n").trim();
  return { label: current.label, text, unresolved: hasUnresolvedFigure(text) };
}

/**
 * Split one section's body into the text before its first sub-heading and one chunk per
 * sub-heading.
 *
 * Splits on the SHALLOWEST heading level present, so a block that nests h5s under an h4 — the
 * 40-ward register does exactly this — divides into the two things the author actually wrote
 * rather than into eight fragments with the second h4 buried inside the last of them.
 */
function splitPanels(body: string[]): { preamble: string[]; panels: { label: string; text: string; unresolved: boolean }[] } {
  let inFence = false;
  let level = 0;
  for (const line of body) {
    if (FENCE.test(line)) inFence = !inFence;
    if (inFence) continue;
    const heading = PANEL_HEADING.exec(line);
    if (heading) level = level ? Math.min(level, heading[1].length) : heading[1].length;
  }
  if (!level) return { preamble: body, panels: [] };

  const preamble: string[] = [];
  const panels: { label: string; text: string; unresolved: boolean }[] = [];
  let current: { label: string; lines: string[] } | null = null;
  inFence = false;

  for (const line of body) {
    if (FENCE.test(line)) inFence = !inFence;
    const heading = inFence ? null : PANEL_HEADING.exec(line);
    if (heading && heading[1].length === level) {
      if (current) panels.push(makePanel(current));
      current = { label: cleanLabel(heading[2]), lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
    else preamble.push(line);
  }
  if (current) panels.push(makePanel(current));
  return { preamble, panels };
}

type Block = { lines: string[]; fence: string | null; keep: boolean };

/**
 * A body as blocks: a paragraph, a list, a table, a callout or a fence, each with whether it was
 * marked `<!-- keep -->`. The marker line itself is consumed; it is a layout instruction, not text.
 */
function blocksOf(body: string[]): Block[] {
  const blocks: Block[] = [];
  let cur: string[] = [];
  let inFence = false;
  let fence: string | null = null;
  let keepNext = false;
  const emit = () => {
    if (cur.length) blocks.push({ lines: cur, fence, keep: keepNext });
    if (cur.length) keepNext = false;
    cur = [];
    fence = null;
  };
  for (const line of body) {
    if (!inFence && KEEP_MARKER.test(line)) {
      emit();
      keepNext = true;
      continue;
    }
    if (FENCE.test(line)) {
      if (!inFence) {
        emit();
        inFence = true;
        fence = (/^\s*```([A-Za-z0-9_-]*)/.exec(line)?.[1] ?? "").toLowerCase();
        cur.push(line);
        continue;
      }
      inFence = false;
      cur.push(line);
      emit();
      continue;
    }
    if (inFence) { cur.push(line); continue; }
    if (line.trim() === "") { emit(); continue; }
    cur.push(line);
  }
  emit();
  return blocks;
}

const isVisualBlock = (b: Block) => b.fence !== null && VISUAL_FENCE.test(b.lines[0]);

/** Lay out one section body: what shows, and what folds. */
export function layoutSection(body: string[]): { shown: string[]; folded: string[] } {
  const blocks = blocksOf(body);
  const shown: string[] = [];
  const folded: string[] = [];
  const show = (b: Block) => shown.push(...b.lines, "");
  const fold = (b: Block) => folded.push(...b.lines, "");

  const hasLead = blocks.some((b) => b.fence === "lead");
  if (hasLead) {
    for (const b of blocks) (isVisualBlock(b) || b.keep ? show : fold)(b);
    return { shown, folded };
  }

  let leadTaken = false;
  for (const b of blocks) {
    if (isVisualBlock(b) || b.keep) { show(b); continue; }
    const text = b.lines.join("\n").trim();
    const words = wordCount(b.lines);
    const isProse = b.fence === null && !/^\s*(?:[*\-+]|\d+\.)\s/.test(b.lines[0]) && !/^\s*[|>#]/.test(b.lines[0]);
    if (!leadTaken && isProse) {
      leadTaken = true;
      if (words <= MAX_VISIBLE_PARAGRAPH) { show(b); continue; }
    }
    if (b.fence === null && /^\*\*[\s\S]+\*\*$/.test(text) && words <= MAX_FINDING) { show(b); continue; }
    fold(b);
  }
  return { shown, folded };
}

export function segmentContent(markdown: string): Segment[] {
  const segments: Segment[] = [];
  const lines = markdown.split("\n");

  // Buffer of plain markdown waiting to be emitted, so consecutive ordinary sections stay in a
  // single ReactMarkdown pass rather than one per heading.
  let pending: string[] = [];
  const flush = () => {
    const text = pending.join("\n");
    if (text.trim()) segments.push({ kind: "markdown", text });
    pending = [];
  };

  let inFence = false;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (FENCE.test(line)) inFence = !inFence;
    const heading = inFence ? null : SECTION_HEADING.exec(line);
    if (!heading) {
      if (!KEEP_MARKER.test(line)) pending.push(line);
      i += 1;
      continue;
    }

    // Collect this section's body: everything up to the next h2/h3 at fence depth zero.
    const body: string[] = [];
    let j = i + 1;
    let bodyFence = false;
    while (j < lines.length) {
      if (FENCE.test(lines[j])) bodyFence = !bodyFence;
      if (!bodyFence && SECTION_HEADING.test(lines[j])) break;
      body.push(lines[j]);
      j += 1;
    }
    i = j;

    const id = cleanLabel(heading[2]);
    const hasLead = body.some((l) => /^\s*```lead\s*$/.test(l));
    const { preamble, panels } = splitPanels(body);

    if (!hasLead && proseWords(body) <= SHOW_ALL_WORDS) {
      pending.push(line, ...body.filter((l) => !KEEP_MARKER.test(l)));
      continue;
    }
    if (!hasLead && panels.length >= MIN_PANELS && wordCount(body) >= MIN_WORDS) {
      const pre = layoutSection(preamble);
      pending.push(line, ...pre.shown);
      flush();
      segments.push({ kind: "group", id, panels });
      if (pre.folded.length && proseWords(pre.folded) > 0) {
        segments.push({ kind: "more", id, text: pre.folded.join("\n"), words: proseWords(pre.folded) });
      }
      continue;
    }
    const { shown, folded } = layoutSection(body);
    const foldedWords = proseWords(folded);
    if (!hasLead && foldedWords < MIN_FOLDED) {
      pending.push(line, ...body.filter((l) => !KEEP_MARKER.test(l)));
      continue;
    }
    pending.push(line, ...shown);
    flush();
    if (folded.some((l) => l.trim())) segments.push({ kind: "more", id, text: folded.join("\n"), words: foldedWords });
  }

  flush();
  return segments;
}

/**
 * Words a reader meets on load: what the segmentation shows, outside figures and text versions,
 * plus each lead. A visual's own words are counted by the visual (lib/visual.ts visibleWords).
 */
export function visibleProseWords(markdown: string, visualWords: (json: string) => number = () => 0): number {
  let n = 0;
  for (const segment of segmentContent(markdown)) {
    if (segment.kind === "more") continue;
    const text = segment.kind === "group" ? segment.panels[0]?.text ?? "" : segment.text;
    let fence: string | null = null;
    let buf: string[] = [];
    for (const line of text.split("\n")) {
      if (FENCE.test(line)) {
        if (fence === null) { fence = (/^\s*```([A-Za-z0-9_-]*)/.exec(line)?.[1] ?? "").toLowerCase(); buf = []; continue; }
        if (fence === "visual") n += visualWords(buf.join("\n"));
        fence = null;
        continue;
      }
      if (fence === null || fence === "lead") n += line.trim().split(/\s+/).filter(Boolean).length;
      else buf.push(line);
    }
  }
  return n;
}

/* ------------------------------------------------------------------ rule 1b: cross-references */

import duplicatesFile from "../data/duplicates.json";

/**
 * A paragraph the reader has already read, folded behind a line naming where they read it.
 *
 * RULE 1b SAYS A DUPLICATE IS COLLAPSED, NOT CUT, and this is the whole of the mechanism. The
 * second copy stays in the markdown, stays in the DOM and stays in the printed kit; what changes
 * is that it arrives as one line — "§2.1 restates §0.1" — with the text itself one tap away.
 * Nothing is deleted, so nothing needs Firefly's approval before it ships.
 *
 * It is keyed on the paragraph's opening 60 characters rather than a marker in the markdown,
 * because the content is under an integrity guard and must not be edited to carry one. That makes
 * the match fragile by construction, which is why `scripts/find-duplicates.mjs --check` re-derives
 * the whole set on every build: a declaration whose paragraph has moved or been reworded fails
 * there rather than silently collapsing nothing, or the wrong thing.
 */
export type DuplicateDeclaration = {
  id: string;
  score: number;
  note: string;
  canonical: { chapter: string; section: string; href: string; opening: string; words: number };
  duplicate: { chapter: string; section: string; opening: string; words: number };
};

const DUPLICATES = (duplicatesFile as { duplicates: DuplicateDeclaration[] }).duplicates;

/** The declarations whose second copy lives in this chapter. */
export function duplicatesIn(chapter: string): DuplicateDeclaration[] {
  return DUPLICATES.filter((d) => d.duplicate.chapter === chapter);
}

/**
 * The declaration whose duplicate paragraph starts with this text, if any.
 *
 * MATCHED AT RENDER, NOT AT SEGMENTATION, and the difference matters. A first attempt split the
 * `markdown` segments and found nothing: almost every paragraph in this document lives inside a
 * fold, because the layout splits every long subsection into what shows and the rest. Matching
 * in the paragraph renderer instead reaches the text wherever segmentation put it — markdown,
 * fold or disclosure panel — and leaves reading order exactly as the author wrote it,
 * which lifting a paragraph out of a fold would not.
 *
 * The comparison folds whitespace, because markdown paragraphs wrap in the source and arrive
 * unwrapped, and strips the emphasis markers ReactMarkdown has already turned into elements.
 */
const foldForMatch = (s: string) => s.replace(/\s+/g, " ").replace(/[*_`]/g, "").trim();

export function crossRefFor(chapter: string, paragraphText: string): DuplicateDeclaration | null {
  const text = foldForMatch(paragraphText);
  for (const d of DUPLICATES) {
    if (d.duplicate.chapter !== chapter) continue;
    if (text.startsWith(foldForMatch(d.duplicate.opening))) return d;
  }
  return null;
}
