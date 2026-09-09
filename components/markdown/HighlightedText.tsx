"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CrossSectionLink } from "./CrossSectionLink";
import { ClaimBadge } from "./ClaimBadge";
import { DerivedFigureDrawer } from "./DerivedFigureDrawer";
import { KeyTakeawayBanner } from "./KeyTakeawayBanner";
import { type TabId } from "../../lib/heading-slug";
import { useSectionNumberMap } from "./SectionNumberMap";

// Every pattern this component matches now lives in lib/highlight-patterns, so the server can
// ask `hasHighlight` whether a text node needs this component at all before shipping it to the
// client. One source of truth — a pattern added there is matched here without further wiring.
import {
  BANNER_TRIGGERS,
  DEFINITIONS,
  STATUS_PHRASES,
  WORKING_TRIGGERS,
  masterRegex,
} from "../../lib/highlight-patterns";

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

// Highly optimized memoized component to handle tooltip wrapping and badge highlights
export const HighlightedText = React.memo(function HighlightedText({ text, tabId }: { text: string; tabId?: TabId }) {
  const sectionNumberMap = useSectionNumberMap();
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
      // Every "Section N.N" the author wrote, not a hand-listed handful. The previous list held
      // four numbers (22.14, 29.1, 31.1, 31.7) left over from an earlier renumbering, none of
      // which survive in the document — so all 173 references rendered as plain text.
      const crossRefMatch = /^Section\s+(\d+(?:\.\d+){1,2})$/i.exec(part);
      if (crossRefMatch) {
        const targetId = sectionNumberMap[crossRefMatch[1]] ?? null;
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
  }, [text, tabId, sectionNumberMap]);

  return <>{elements}</>;
});
