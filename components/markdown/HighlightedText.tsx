"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CrossSectionLink } from "./CrossSectionLink";
import { ClaimBadge, type ClaimStatus } from "./ClaimBadge";
import { DerivedFigureDrawer } from "./DerivedFigureDrawer";
import { KeyTakeawayBanner } from "./KeyTakeawayBanner";
import { crossSectionTarget, type TabId } from "../../lib/heading-slug";

// Source markdown hard-wraps around 80 columns, which leaves a literal "\n" inside a single
// text node wherever a phrase happens to wrap — so every multi-word pattern below matches on
// `\s+` rather than a literal space, or it silently fails to fire on a wrapped line.
function ws(phrase: string): string {
  return phrase.replace(/ /g, "\\s+");
}

// The two derived figures the proposal leans on hardest, matched at their canonical first
// statement so the "show the working" drawer appears once, not on every later restatement.
const WORKING_TRIGGERS: { pattern: string; id: string }[] = [
  { pattern: ws("approximately 200,000 votes\\.?"), id: "win-threshold" },
  { pattern: ws("15\\.3 percentage points\\.?"), id: "deficit" },
];

// Figures the copy itself already states a status for — an approved fiscal-strategy-paper
// total, a register the text calls "verified", a population figure the text itself calls an
// "estimate". Deliberately narrow: only phrases the prose makes unambiguous get badged: see
// "leave the claim unbadged rather than guessing" in the brief. Matched on the exact prose
// wording so a badge never lands next to a number the text doesn't make a claim about.
const STATUS_PHRASES: { pattern: string; status: ClaimStatus }[] = [
  { pattern: ws("KSh13\\.79 billion"), status: "verified" },
  { pattern: ws("532,758 voters"), status: "verified" },
  { pattern: ws("22\\.1% against a front-runner at 37\\.4%"), status: "verified" },
  { pattern: ws("approximately 1\\.2 million by 2024"), status: "estimate" },
  { pattern: ws("KSh97\\.56 million"), status: "verified" },
];

// A key-takeaway banner closes each major section, quoting a line that's already that
// section's own natural closing statement — never new copy. "exec" is skipped: Section 3
// already closes on the promoted central-narrative pull quote, and a second banner quoting
// the same line would just duplicate it. strategy/tactics share a trigger because the source
// markdown duplicates that content across both documents (see strategy.md and tactics.md,
// Section 19B.4) — each tab gets its own banner instance from the same stated line.
const BANNER_TRIGGERS: { pattern: string; tabIds: TabId[] }[] = [
  {
    pattern: ws("one that continues is a governance commitment — and the commitment is the persuasive element\\."),
    tabIds: ["programme"],
  },
  { pattern: ws("the reason the campaign's own deepfake denials will be believed\\."), tabIds: ["programme"] },
  { pattern: ws("Firefly Management is ready to build that operation\\."), tabIds: ["programme"] },
  { pattern: ws("commence Phase\\s+[−-]1 Week 1\\."), tabIds: ["registers"] },
];

// Dictionary of definitions for hover tooltips
const DEFINITIONS: Record<string, string> = {
  "own-source revenue": "Kitui's locally-generated county treasury funds, targeted at KSh 1.339bn.",
  "polling deficit": "The 15.3-point gap between Dr. Mulu (22.1%) and Dr. Kasalu (37.4%) in the 7 August 2026 Mizani survey. Percentage points, not percent.",
  "ussd database": "Offline text-based digital voter registration system designed to reach citizens without internet.",
  "aircover": "Continuous community FM radio broadcasting synchronized with SMS networks.",
  "consensus strategy": "Direct delegate alignment to secure 75%+ endorsements without ballot splits.",
  "delegate nominations": "Wiper nomination delegates representing forty constituencies across Kitui."
};

// Tooltip helper component
function InlineTooltip({ text, term }: { text: string; term: string }) {
  const [visible, setVisible] = useState(false);
  const definition = DEFINITIONS[term.toLowerCase()];

  if (!definition) return <span>{text}</span>;

  return (
    <span
      className="relative inline-block cursor-help group z-10"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="underline decoration-dotted decoration-accent decoration-2 font-semibold text-ink group-hover:text-accent transition-colors">
        {text}
      </span>
      <AnimatePresence>
        {visible && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-paper border border-line rounded-xl shadow-lg text-xs text-ink font-sans z-50 text-center leading-normal"
          >
            <span className="font-bold text-accent block mb-1 uppercase tracking-wider t-label flex items-center justify-center gap-1">
              <Info size={11} /> Strategy Definition
            </span>
            {definition}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-paper" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// Master regex to match definitions and key badges in a single native pass
const termsUnion = Object.keys(DEFINITIONS).join("|");
const datePatterns = "August 2026|December 2026|April 2027|August 2027|2026/27|KSh 1\\.339bn";
// In-text cross-references the proposal makes to specific numbered sections — see
// lib/heading-slug.ts for where each one resolves to.
const crossRefPattern = "Section\\s+(?:19B|9B|17A)";
const statusPhrasePattern = STATUS_PHRASES.map((p) => p.pattern).join("|");
const workingTriggerPattern = WORKING_TRIGGERS.map((p) => p.pattern).join("|");
const bannerTriggerPattern = BANNER_TRIGGERS.map((p) => p.pattern).join("|");
const masterRegex = new RegExp(
  `(${termsUnion}|${datePatterns}|${crossRefPattern}|${statusPhrasePattern}|${workingTriggerPattern}|${bannerTriggerPattern})`,
  "gi"
);

// Highly optimized memoized component to handle tooltip wrapping and badge highlights
export const HighlightedText = React.memo(function HighlightedText({ text, tabId }: { text: string; tabId?: TabId }) {
  const elements = React.useMemo(() => {
    if (!text) return null;
    const parts = text.split(masterRegex);
    if (parts.length === 1) return text;

    return parts.map((part, idx) => {
      const lower = part.toLowerCase();
      // If it is a defined term, wrap in a tooltip
      if (DEFINITIONS[lower]) {
        return <InlineTooltip key={idx} text={part} term={lower} />;
      }
      // If it is a cross-reference to another numbered section, make it a working link
      const crossRefMatch = /^Section\s+(19B|9B|17A)$/i.exec(part);
      if (crossRefMatch) {
        const sectionNumber = crossRefMatch[1].toUpperCase();
        const targetId =
          tabId && crossSectionTarget(sectionNumber)?.startsWith(`${tabId}-sec-`)
            ? null // already inside the section being referenced — plain text reads better than a self-link
            : crossSectionTarget(sectionNumber);
        if (targetId) {
          return (
            <CrossSectionLink key={idx} id={targetId}>
              {part}
            </CrossSectionLink>
          );
        }
        return part;
      }
      // If this is a section's natural closing line, follow it with a key-takeaway banner
      const bannerMatch =
        tabId && BANNER_TRIGGERS.find((t) => t.tabIds.includes(tabId) && new RegExp(`^${t.pattern}$`, "i").test(part));
      if (bannerMatch && tabId) {
        return (
          <React.Fragment key={idx}>
            {part}
            <KeyTakeawayBanner tabId={tabId}>{part}</KeyTakeawayBanner>
          </React.Fragment>
        );
      }
      // If this is the canonical statement of a derived figure, attach a "show the working" drawer
      const workingMatch = WORKING_TRIGGERS.find((t) => new RegExp(`^${t.pattern}$`, "i").test(part));
      if (workingMatch) {
        return (
          <DerivedFigureDrawer key={idx} id={workingMatch.id}>
            {part}
          </DerivedFigureDrawer>
        );
      }
      // If the copy already states this figure's status (verified / estimate), badge it —
      // the matched text itself is left untouched, the badge is only appended after it.
      const statusMatch = STATUS_PHRASES.find((p) => new RegExp(`^${p.pattern}$`, "i").test(part));
      if (statusMatch) {
        return (
          <span key={idx} className="inline-flex items-center gap-1.5 flex-wrap align-middle">
            {part}
            <ClaimBadge status={statusMatch.status} compact />
          </span>
        );
      }
      // If it is a key milestone date or budget figure, wrap in a badge
      if (/^(August 2026|December 2026|April 2027|August 2027|2026\/27|KSh 1\.339bn)$/i.test(part)) {
        return (
          <span
            key={idx}
            className="bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded font-mono t-label font-bold mx-1 whitespace-nowrap"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }, [text, tabId]);

  return <>{elements}</>;
});
