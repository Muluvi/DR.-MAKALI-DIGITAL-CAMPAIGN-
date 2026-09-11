/**
 * Turns a long run of repeated `h4` blocks into a set of disclosures.
 *
 * The heaviest parts of this proposal are not dense arguments — they are matrices typed as
 * prose. §5.1 is six voter segments carrying the same seven fields each, 1,292 words of it;
 * §8.14.1 is five stack components each with a spec, a cost and a vendor. Read top to bottom
 * that is a very long scroll on a phone, and the structure the author actually wrote — six
 * comparable things — is invisible until you have read all of it.
 *
 * Nothing is rewritten or removed here. The `h4` heading becomes the label of a disclosure and
 * its body moves inside; the first one is open, so the section still opens on real content
 * rather than on a row of closed drawers. Every word is one tap away, and the shape of the
 * section is legible at a glance.
 *
 * Deliberately rule-driven rather than a hand-kept list of section numbers: this document has
 * been renumbered twice, and every hardcoded section list in this repo had drifted out of date
 * by the time anyone looked at it.
 */

/** Below this, a run of headings is short enough to just read. */
const MIN_PANELS = 2;
/** Below this, the block is not heavy enough for the interaction to be worth it. */
const MIN_WORDS = 150;
/** A block with no headings but a long unbroken run of prose gets folded after its opening. */
const MIN_FOLD_RUN = 6;
const MIN_FOLD_WORDS = 250;
/** A fold that hides less than this is pure friction — the tap costs more than the scroll. */
const MIN_FOLD_HIDDEN = 150;

/**
 * Sections that are never collapsed, whatever their shape, because the reader has to hold two of
 * their parts side by side to judge a trade-off — and an accordion shows one at a time.
 *
 * §10.1 is the whole of it: the scope levels and the cadence each carries
 * are §10.1.1, and choosing a tier means reading them together. Collapsing that section puts the
 * ceiling and the tiers behind two different taps, which is the one thing an answer-first
 * document must not do to the section it is asking the reader to decide on.
 */
const NEVER_COLLAPSE = new Set(["9.2"]);

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

const LEADING_NUMBER = /^(\d+(?:\.\d+)*)/;

export type Segment =
  | { kind: "markdown"; text: string }
  | { kind: "group"; id: string; panels: { label: string; text: string; unresolved: boolean }[] }
  | { kind: "fold"; id: string; text: string };

const FENCE = /^\s*```/;
const SECTION_HEADING = /^(#{2,3})\s+(.+?)\s*$/;
const PANEL_HEADING = /^(#{4,5})\s+(.+?)\s*$/;

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

/**
 * Split one section's body into the text before its first sub-heading and one chunk per
 * sub-heading.
 *
 * Splits on the SHALLOWEST heading level present, so a block that nests h5s under an h4 — the
 * 40-ward register does exactly this — divides into the two things the author actually wrote
 * rather than into eight fragments with the second h4 buried inside the last of them.
 */
function makePanel(current: { label: string; lines: string[] }) {
  const text = current.lines.join("\n").trim();
  return { label: current.label, text, unresolved: hasUnresolvedFigure(text) };
}

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

/** Longest run of consecutive prose lines — the thing that actually reads as a wall of text. */
function longestProseRun(body: string[]): number {
  let inFence = false;
  let run = 0;
  let longest = 0;
  for (const line of body) {
    if (FENCE.test(line)) { inFence = !inFence; run = 0; continue; }
    const t = line.trim();
    if (inFence || t === "" || /^\|/.test(t) || /^[*\-+]\s|^\d+\.\s/.test(t) || /^#/.test(t)) { run = 0; continue; }
    run += 1;
    longest = Math.max(longest, run);
  }
  return longest;
}

/** Everything from the end of the opening paragraph onwards, which is what gets folded. */
function splitLead(body: string[]): { lead: string[]; rest: string[] } {
  let seenText = false;
  for (let i = 0; i < body.length; i += 1) {
    const t = body[i].trim();
    if (t !== "") { seenText = true; continue; }
    if (seenText && body.slice(i).some((l) => l.trim() !== "")) return { lead: body.slice(0, i), rest: body.slice(i) };
  }
  return { lead: body, rest: [] };
}

/**
 * @param isClosingSection the section the proposal ends on. Its final block is the ask, and the
 * ask is never folded — a proposal that hides what it wants behind a "read more" does not close,
 * whatever it saves in scroll. Every other section's final block folds like any other.
 */
export function segmentContent(markdown: string, { isClosingSection = false } = {}): Segment[] {
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
      pending.push(line);
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

    const words = wordCount(body);
    const { preamble, panels } = splitPanels(body);
    const number = LEADING_NUMBER.exec(cleanLabel(heading[2]))?.[1];
    if (number && NEVER_COLLAPSE.has(number)) {
      pending.push(line, ...body);
      i = j;
      continue;
    }
    if (panels.length >= MIN_PANELS && words >= MIN_WORDS) {
      pending.push(line, ...preamble);
      flush();
      segments.push({ kind: "group", id: cleanLabel(heading[2]), panels });
    } else if (
      !panels.length &&
      words >= MIN_FOLD_WORDS &&
      longestProseRun(body) >= MIN_FOLD_RUN &&
      !(isClosingSection && j >= lines.length)
    ) {
      // No sub-headings to fold on, but a long unbroken run of prose. Keep the opening
      // paragraph — the block still has to say what it is — and fold the argument behind it.
      const { lead, rest } = splitLead(body);
      if (wordCount(rest) >= MIN_FOLD_HIDDEN) {
        pending.push(line, ...lead);
        flush();
        segments.push({ kind: "fold", id: cleanLabel(heading[2]), text: rest.join("\n") });
      } else {
        pending.push(line, ...body);
      }
    } else {
      pending.push(line, ...body);
    }
    i = j;
  }

  flush();
  return segments;
}
