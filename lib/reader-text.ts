import { tierWord } from "../data/types.ts";
import { plainLabels } from "./plain-labels.ts";

/**
 * What a figure's words look like to the reader. The figure specs keep their working form (tier
 * codes, numbered phases, section citations) because every check and CSV is keyed on it; this is
 * the one pass that turns them into plain words on the way to the page.
 *
 *   - "(T1)", "T2", "T3"           -> Official / Reported / Unconfirmed
 *   - "Phase −1" … "Phase 3"       -> the phase's name (lib/plain-labels.ts)
 *   - "(Section 6.2)", "(§4.3)"    -> dropped: on a website the link or the heading carries it
 *   - "§4.3 — the register split"  -> "The register split"
 */
const NUM = String.raw`(?:\d+(?:\.\d+){0,3}|[A-H](?:\.\d+){0,3})\b`;
const PAREN_REF = new RegExp(
  String.raw`\s?\((?:see\s+)?(?:§\s?|Sections?\s+|Annex\s+)${NUM}(?:\s*(?:,|and|or|&|–|to|/)\s*(?:§\s?|Sections?\s+)?${NUM})*(?:\s*\[CHECK REF\])?\)`,
  "g"
);
const LEAD_REF = new RegExp(String.raw`^§\s?${NUM}(?:['’]s)?\s*(?:—|–|-|:)\s*(\S)?`);
const TIER_CODE = /\bT([123])\b/g;

export function readerText(input: string): string {
  let s = input.replace(PAREN_REF, "");
  s = s.replace(LEAD_REF, (_, c?: string) => (c ? c.toUpperCase() : ""));
  s = s.replace(TIER_CODE, (_, n: string) => tierWord(n)).replace(/\bUnconfirmed,?\s+unconfirmed\b/g, "Unconfirmed");
  return plainLabels(s);
}

// Fields that are data or addresses, never prose: left exactly as written.
const KEEP = new Set(["id", "href", "key", "section", "tier", "state", "type", "unit", "color", "format", "anchor", "csv", "src", "kind", "preset", "align", "shape", "icon"]);

/** A deep copy of a spec with every prose string passed through readerText. */
export function readerDeep<T>(value: T, key = ""): T {
  if (typeof value === "string") return (KEEP.has(key) ? value : readerText(value)) as T;
  if (Array.isArray(value)) return value.map((v) => readerDeep(v, key)) as T;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = KEEP.has(k) ? v : readerDeep(v, k);
    return out as T;
  }
  return value;
}

const PART_NAMES: Record<string, string> = {
  I: "Kitui today",
  II: "The contest",
  III: "The strategy",
  IV: "How Firefly delivers",
  V: "Proof and protection",
  VI: "The decision",
};
const PART_ROMAN = /\bPart (VI|IV|V|III|II|I)\b(?!\s*\d)/g;
const PARTS_ROMAN = /\bParts (VI|IV|V|III|II|I) and (VI|IV|V|III|II|I)\b/g;
const OPENS_PART = /\bThis chapter opens Part (?:VI|IV|V|III|II|I)\b(?::\s*)?/g;
const REF_TOKEN = String.raw`(?:§\s?|Sections?\s+)${NUM}(?:\s*\[CHECK REF\])?`;
const ONLY_REFS = new RegExp(String.raw`^\s*${REF_TOKEN}(?:\s*(?:,|and|&|–|/)?\s*${REF_TOKEN})*\s*$`);
const FIGURE_REF = new RegExp(String.raw`(Figure),\s*${REF_TOKEN}`, "g");
const TRAILING_REF = new RegExp(String.raw`\s*[,·—–]\s*${REF_TOKEN}`, "g");
const LEADING_REF = new RegExp(String.raw`${REF_TOKEN}\s*[,·—–]\s*`, "g");
const IN_REF = new RegExp(String.raw`\b(in|see|per|from|under)\s+${REF_TOKEN}`, "gi");
const START_REF = new RegExp(String.raw`^${REF_TOKEN}\s+(?=[a-z])`);
const POSS_OWN = new RegExp(String.raw`${REF_TOKEN}['’]s own`, "g");
const POSS_PAIR = new RegExp(String.raw`${REF_TOKEN}['’]s(?:,\s*|\s+and\s+)${REF_TOKEN}['’]s`, "g");
const POSS = new RegExp(String.raw`${REF_TOKEN}['’]s\s+(?=[a-z])`, "g");
const ANY_REF = new RegExp(REF_TOKEN, "g");
const ANNEX_REF = /\bAnnex(?:es)? [A-H](?:\.\d+)*\b/g;

/**
 * readerText for text the page draws outside the markdown renderer (panels, chips, chart labels,
 * figure tables). The citations in these hand-built panels follow an older numbering that no longer
 * matches any heading on the page, so they are not translated into names (that would name the wrong
 * section); they are taken out where the sentence stands without them, and pointed at "this
 * proposal" where it does not.
 */
export function pageText(input: string): string {
  let s = readerText(input);
  s = s.replace(OPENS_PART, (m: string) => (m.trim().endsWith(":") ? "This chapter opens this part: " : "This chapter opens this part"));
  s = s.replace(PARTS_ROMAN, (_, a: string, b: string) => `${PART_NAMES[a]} and ${PART_NAMES[b]}`);
  s = s.replace(PART_ROMAN, (_, r: string) => PART_NAMES[r]);
  s = s.replace(ANNEX_REF, "the reference shelf");
  if (!/§|Section/.test(s)) return s;
  if (ONLY_REFS.test(s)) return "";
  s = s.replace(FIGURE_REF, "$1");
  s = s.replace(TRAILING_REF, "");
  s = s.replace(LEADING_REF, "");
  s = s.replace(IN_REF, "$1 this proposal");
  s = s.replace(START_REF, "This proposal ");
  s = s.replace(POSS_OWN, "this proposal's own");
  s = s.replace(POSS_PAIR, "this proposal's");
  s = s.replace(POSS, (_, at: number) => (at === 0 || /[.!?]\s*$/.test(s.slice(0, at)) ? "The " : "the "));
  s = s.replace(ANY_REF, (_, at: number, whole: string) => (at === 0 || /[.!?]\s*$/.test(whole.slice(0, at)) ? "This proposal" : "this proposal"));
  return s;
}
