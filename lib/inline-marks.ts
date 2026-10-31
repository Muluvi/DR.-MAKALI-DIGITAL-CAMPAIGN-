/**
 * The working marks this document carries in its text, and what a reader sees in their place
 * (brief 2026-10 declutter, 5.4, X1 to X4 and X6).
 *
 * The source markdown is NOT changed. Every mark below stays in content/*.md exactly as typed, so
 * the open-items lists, the conservation checks and anyone editing the source still see it. What
 * changes is how it renders:
 *
 *   X1  "(Tier 1, IEBC Form 37C)"         a tier badge; tapping it shows "IEBC Form 37C" and the
 *                                         tier legend in Annex A.1.2
 *   X2  "[CONFLICT C3: see open items]"   a chip: "Two versions in this document — under review"
 *   X3  "[CHECK REF]"                     nothing in a production build; a dashed outline in
 *                                         development, so an editor still sees it
 *   X4  "[VERIFY whether in force]"       a "Source pending" chip with the note behind it
 *   X6  "(Section 2.5.2)"                 a compact "§2.5.2" link chip. Only a parenthesis that
 *                                         holds nothing but section references; a reference
 *                                         inside a sentence stays text.
 *
 * One tokenizer serves both the markdown renderer (lib/rehype-inline-marks.ts, on text nodes) and
 * the figures, whose notes are plain strings (components/markdown/InlineMarks.tsx).
 */

export type InlinePart =
  | { type: "text"; text: string }
  /** `head` is what the badge says ("Tier 1", "Tier 1 / Tier 2", "Tier 1 gap"); `rest` is the source and caveat. */
  | { type: "tier"; tiers: number[]; head: string; rest: string; raw: string }
  | { type: "conflict"; id: string; raw: string }
  | { type: "checkref"; raw: string }
  | { type: "status"; status: "source" | "counsel"; note: string; raw: string }
  | { type: "xref"; refs: string[]; raw: string };

/** A parenthetical that opens with a tier: one level of nested parentheses is allowed inside it. */
const TIER = String.raw`\(Tier [123][^()]*(?:\([^()]*\)[^()]*)*\)`;
const CONFLICT = String.raw`\[CONFLICT (C\d+): see open items\]`;
const CHECKREF = String.raw` ?\[CHECK REF\]`;
const VERIFY = String.raw`\[VERIFY ([^\]]*)\]`;
/** A section number as this document writes it: 2, 2.5, 2.5.2, A.1, G.4. */
const NUM = String.raw`(?:\b\d+(?:\.\d+){0,2}\b|\b[A-H](?:\.\d+){0,2}\b)`;
const XREF = String.raw`\((?:see\s+)?(?:Sections?\s+|§\s?|Annex(?:es)?\s+)${NUM}(?:\s*(?:,|and|or|&|–|-|to)\s*(?:Sections?\s+|§\s?|Annex\s+)?${NUM})*\)`;

const MASTER = new RegExp(`(${TIER})|${CONFLICT}|(${CHECKREF})|${VERIFY}|(${XREF})`, "g");
const PROBE = new RegExp(MASTER.source);

export function hasInlineMark(text: string): boolean {
  return PROBE.test(text);
}

/** The "Tier N" words at the head of a tier parenthetical, and everything after them. */
export function splitTier(raw: string): { tiers: number[]; head: string; rest: string } {
  const inner = raw.slice(1, -1).replace(/\s+/g, " ").trim();
  // The head runs to the first comma or semicolon that is not inside a nested parenthesis.
  let depth = 0;
  let cut = inner.length;
  for (let i = 0; i < inner.length; i += 1) {
    const c = inner[i];
    if (c === "(") depth += 1;
    else if (c === ")") depth -= 1;
    else if ((c === "," || c === ";") && depth === 0) { cut = i; break; }
  }
  const head = inner.slice(0, cut).trim();
  const rest = inner.slice(cut + 1).trim();
  const tiers = [...head.matchAll(/Tier ([123])/g)].map((m) => Number(m[1]));
  return { tiers, head, rest };
}

/** The section numbers in a parenthesised reference: "(Sections 2.5 and 2.6)" → ["2.5", "2.6"]. */
export function refsOf(raw: string): string[] {
  return [...raw.matchAll(new RegExp(NUM, "g"))].map((m) => m[0]);
}

export function tokenizeInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;
  for (const m of text.matchAll(MASTER)) {
    const at = m.index ?? 0;
    if (at > last) parts.push({ type: "text", text: text.slice(last, at) });
    const raw = m[0];
    if (m[1]) parts.push({ type: "tier", raw, ...splitTier(raw) });
    else if (m[2]) parts.push({ type: "conflict", id: m[2], raw });
    else if (m[3]) parts.push({ type: "checkref", raw });
    else if (m[4] !== undefined) parts.push({ type: "status", status: "source", note: m[4], raw });
    else if (m[5]) parts.push({ type: "xref", refs: refsOf(raw), raw });
    last = at + raw.length;
  }
  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });
  return parts;
}

/** An inline code span the document uses as a counsel note: `[Confirm approach with campaign counsel — …]`. */
export const COUNSEL_NOTE = /^\[Confirm approach with campaign counsel\s*[—–-]\s*([\s\S]*)\]$/;
