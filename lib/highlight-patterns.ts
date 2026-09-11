import type { ClaimStatus } from "../components/markdown/ClaimBadge";
import type { TabId } from "./heading-slug";

// Source markdown hard-wraps around 80 columns, which leaves a literal "\n" inside a single
// text node wherever a phrase happens to wrap — so every multi-word pattern below matches on
// `\s+` rather than a literal space, or it silently fails to fire on a wrapped line.
export function ws(phrase: string): string {
  return phrase.replace(/ /g, "\\s+");
}

// The two derived figures the proposal leans on hardest, matched at their canonical first
// statement so the "show the working" drawer appears once, not on every later restatement.
export const WORKING_TRIGGERS: { pattern: string; id: string }[] = [
  { pattern: ws("approximately 200,000 votes\\.?"), id: "win-threshold" },
  { pattern: ws("15\\.3 percentage points\\.?"), id: "deficit" },
];

// Figures the copy itself already states a status for — an approved fiscal-strategy-paper
// total, a register the text calls "verified", a population figure the text itself calls an
// "estimate". Deliberately narrow: only phrases the prose makes unambiguous get badged: see
// "leave the claim unbadged rather than guessing" in the brief. Matched on the exact prose
// wording so a badge never lands next to a number the text doesn't make a claim about.
export const STATUS_PHRASES: { pattern: string; status: ClaimStatus }[] = [
  { pattern: ws("KSh13\\.79 billion"), status: "verified" },
  { pattern: ws("532,758 voters"), status: "verified" },
  { pattern: ws("22\\.1% against a front-runner at 37\\.4%"), status: "verified" },
  { pattern: ws("approximately 1\\.2 million by 2024"), status: "estimate" },
  { pattern: ws("KSh97\\.56 million"), status: "verified" },
];

// A key-takeaway banner closes a section by quoting a line that is already that section's own
// natural closing statement — never new copy. Two triggers here previously quoted lines that no
// longer appear anywhere in the proposal ("a governance commitment…", "commence Phase −1 Week
// 1."); they matched nothing and have been removed rather than repointed.
export const BANNER_TRIGGERS: { pattern: string; tabIds: TabId[] }[] = [
  { pattern: ws("the reason the campaign's own deepfake denials will be believed\\."), tabIds: ["risk"] },
  { pattern: ws("Firefly Management is ready to build that operation\\."), tabIds: ["nextsteps"] },
];

// Dictionary of definitions for hover tooltips
export const DEFINITIONS: Record<string, string> = {
  "own-source revenue": "Kitui's locally-generated county treasury funds, targeted at KSh 1.339bn.",
  "polling deficit": "The 15.3-point gap between Dr. Mulu (22.1%) and Dr. Kasalu (37.4%) in the 7 August 2026 Mizani survey. Percentage points, not percent.",
  "ussd database": "Offline text-based digital voter registration system designed to reach citizens without internet.",
  "aircover": "Continuous community FM radio broadcasting synchronized with SMS networks.",
  "consensus strategy": "Direct delegate alignment to secure 75%+ endorsements without ballot splits.",
  "delegate nominations": "Wiper nomination delegates representing forty constituencies across Kitui."
};

const termsUnion = Object.keys(DEFINITIONS).join("|");
export const datePatterns = "August 2026|December 2026|April 2027|August 2027|2026/27|KSh 1\\.339bn";
const statusPhrasePattern = STATUS_PHRASES.map((p) => p.pattern).join("|");
const workingTriggerPattern = WORKING_TRIGGERS.map((p) => p.pattern).join("|");
const bannerTriggerPattern = BANNER_TRIGGERS.map((p) => p.pattern).join("|");

// No cross-reference alternative any more. In-text "Section N.N" pointers used to be matched
// here and resolved into links; the numbering and the pointers are both gone, and the data a
// pointer used to lead to is now shown where it is relevant.
const MASTER_SOURCE = `(${termsUnion}|${datePatterns}|${statusPhrasePattern}|${workingTriggerPattern}|${bannerTriggerPattern})`;

// Master regex to match definitions and key badges in a single native pass. Split on this and
// every odd-indexed part is a match, because the whole source is one capturing group.
export const masterRegex = new RegExp(MASTER_SOURCE, "gi");

// The same test without the `g` flag, because `.test()` on a global regex advances `lastIndex`
// and so alternates true/false across calls. Server-safe: no React, no hooks, no DOM — which is
// the point. It lets the server decide whether a text node needs the client highlighter at all,
// so the large majority of paragraphs and list items ship as plain server-rendered markup.
const probeRegex = new RegExp(MASTER_SOURCE, "i");

export function hasHighlight(text: string): boolean {
  return probeRegex.test(text);
}
