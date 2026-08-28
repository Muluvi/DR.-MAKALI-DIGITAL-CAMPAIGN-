"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CrossSectionLink } from "./CrossSectionLink";
import { crossSectionTarget, type TabId } from "../../lib/heading-slug";

// Dictionary of definitions for hover tooltips
const DEFINITIONS: Record<string, string> = {
  "own-source revenue": "Kitui's locally-generated county treasury funds, targeted at KSh 1.339bn.",
  "polling deficit": "The 15.3% voter margin gap that this campaign is actively closing.",
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
            <span className="font-bold text-accent block mb-1 uppercase tracking-wider text-[10px] flex items-center justify-center gap-1">
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
const crossRefPattern = "Section (?:19B|9B|17A)";
const masterRegex = new RegExp(`(${termsUnion}|${datePatterns}|${crossRefPattern})`, "gi");

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
      const crossRefMatch = /^Section (19B|9B|17A)$/i.exec(part);
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
      // If it is a key milestone date or budget figure, wrap in a badge
      if (/^(August 2026|December 2026|April 2027|August 2027|2026\/27|KSh 1\.339bn)$/i.test(part)) {
        return (
          <span
            key={idx}
            className="bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold mx-1 whitespace-nowrap"
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
