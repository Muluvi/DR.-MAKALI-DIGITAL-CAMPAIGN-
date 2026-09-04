/**
 * Turns a long run of repeated `h4` blocks into a set of disclosures.
 *
 * The heaviest parts of this proposal are not dense arguments — they are matrices typed as
 * prose. §2.4.1 is six voter segments carrying the same seven fields each, 1,292 words of it;
 * §6.3.1 is five stack components each with a spec, a cost and a vendor. Read top to bottom
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
const MIN_PANELS = 3;
/** Below this, the part is not heavy enough for the interaction to be worth it. */
const MIN_WORDS = 300;

export type Segment =
  | { kind: "markdown"; text: string }
  | { kind: "group"; id: string; panels: { label: string; text: string }[] };

const FENCE = /^\s*```/;
const SECTION_HEADING = /^(#{2,3})\s+(.+?)\s*$/;
const PANEL_HEADING = /^####\s+(.+?)\s*$/;

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

/** Split one section's body into the text before its first `h4` and one chunk per `h4`. */
function splitPanels(body: string[]): { preamble: string[]; panels: { label: string; text: string }[] } {
  const preamble: string[] = [];
  const panels: { label: string; text: string }[] = [];
  let current: { label: string; lines: string[] } | null = null;
  let inFence = false;

  for (const line of body) {
    if (FENCE.test(line)) inFence = !inFence;
    const heading = inFence ? null : PANEL_HEADING.exec(line);
    if (heading) {
      if (current) panels.push({ label: current.label, text: current.lines.join("\n").trim() });
      current = { label: cleanLabel(heading[1]), lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
    else preamble.push(line);
  }
  if (current) panels.push({ label: current.label, text: current.lines.join("\n").trim() });
  return { preamble, panels };
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

    const { preamble, panels } = splitPanels(body);
    if (panels.length >= MIN_PANELS && wordCount(body) >= MIN_WORDS) {
      pending.push(line, ...preamble);
      flush();
      segments.push({ kind: "group", id: cleanLabel(heading[2]), panels });
    } else {
      pending.push(line, ...body);
    }
    i = j;
  }

  flush();
  return segments;
}
