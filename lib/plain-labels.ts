/**
 * Plain names for the campaign's numbered labels, applied as the page renders.
 *
 * The source keeps "Phase −1", "Phase 0" … "Phase 3" (every check, ledger and figure is keyed on
 * them). The reader sees a name instead: a negative phase number reads as a typo, and five numbered
 * phases next to numbered parts, sections and tiers were one more numbering system to decode.
 */
export const PHASE_NAMES: Record<string, string> = {
  "−1": "Nomination sprint",
  "-1": "Nomination sprint",
  "0": "Set-up",
  "1": "Awareness",
  "2": "Persuasion",
  "3": "Turnout",
};

/** Phase id (lib/phases.ts) for a plain phase name, so a renamed heading keeps its colour. */
export const PHASE_ID_BY_NAME: Record<string, string> = {
  "Nomination sprint": "neg1",
  "Set-up": "0",
  Awareness: "1",
  Persuasion: "2",
  Turnout: "3",
};

const LEAD_IN = /(\b(?:in|by|before|during|after|from|through|to|of|into|until|for|across|at|and|or|than)\s+)$/i;
const PHASE = /\bPhases?\s+(−1|-1|0|1|2|3)\b(?:\s*(?:,|and|or|&|–|to)\s*(−1|-1|0|1|2|3)\b)*/g;
// "Phase 1: awareness, October–December 2026" — the words after the colon already name it.
const PHASE_HEAD = /^Phase\s+(−1|-1|0|1|2|3):\s*(\S)/;
// "Stage One: the Wiper nomination", "Stage 2: the general election" — the name follows the colon.
const STAGE_HEAD = /^Stage\s+(?:One|Two|1|2):\s*(\S)/;

function phaseList(match: string): string[] {
  return [...match.matchAll(/(−1|-1|0|1|2|3)\b/g)].map((m) => PHASE_NAMES[m[1]]);
}

export function plainLabels(input: string): string {
  if (!/Phase|Stage/.test(input)) return input;
  let s = input.replace(PHASE_HEAD, (_, _n, c: string) => c.toUpperCase());
  s = s.replace(STAGE_HEAD, (_, c: string) => c.toUpperCase());
  s = s.replace(PHASE, (match, _a, _b, offset: number, whole: string) => {
    // IPC food-security phases ("IPC Phase 2", "Phase 2 — Stressed") are not campaign phases.
    const after = whole.slice(offset + match.length);
    if (/IPC\s*$/i.test(whole.slice(0, offset)) || /^\s*[—–,:(]?\s*["“(]*\s*(Stressed|Crisis|Emergency|Famine|Minimal)/i.test(after)) return match;
    const names = phaseList(match);
    const joined = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];
    const before = whole.slice(0, offset);
    const article = LEAD_IN.test(before) ? "the " : "";
    const atStart = /(^|[.!?:]\s+|\n\s*)$/.test(before);
    // "the Nomination sprint" already names a stretch of time; the others read as "the Awareness phase".
    const suffix = names.length > 1 ? " phases" : names[0] === "Nomination sprint" ? "" : " phase";
    const phrase = `${article}${joined}${suffix}`;
    return atStart ? phrase.charAt(0).toUpperCase() + phrase.slice(1) : phrase;
  });
  return s;
}

type HastNode = { type: string; value?: string; tagName?: string; children?: HastNode[] };
const SKIP = new Set(["code", "pre", "script", "style"]);

/** The rehype half: every text node outside code gets plain labels. */
export function rehypePlainLabels() {
  const walk = (node: HastNode) => {
    if (node.type === "element" && node.tagName && SKIP.has(node.tagName)) return;
    if (node.type === "text" && typeof node.value === "string") node.value = plainLabels(node.value);
    node.children?.forEach(walk);
  };
  return (tree: HastNode) => walk(tree);
}
