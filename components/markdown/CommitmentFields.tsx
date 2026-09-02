"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, CalendarDays, UserRound, Route, TriangleAlert } from "lucide-react";

import { EASE_ENTRANCE, STAGGER, VIEWPORT } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import type { CommitmentField, CommitmentFieldKey } from "../../lib/commitment-fields";
import { HighlightedText } from "./HighlightedText";
import type { TabId } from "../../lib/heading-slug";

/**
 * Section 3 — the five Operational Commitments, as a grid rather than a bullet list.
 *
 * Every commitment carries the same six fields in the same order: Traceability, Baseline Figure,
 * Target Figure, Deadline, Named Owner, Escalation Trigger. That is a table the document happens
 * to have written as prose. Read as bullets, the two figures that matter — where the campaign is
 * and where it has committed to be — are the third and fourth lines of six, weighted the same as
 * everything else.
 *
 * This restructures the SAME list items: nothing is added, removed, or reworded. Each item's own
 * children are passed straight through, so cross-references, claim badges and figure highlighting
 * keep working inside the values exactly as they do in a bullet.
 */

/**
 * Field values are raw markdown children, so their bare strings have not been through the
 * highlighter yet — the same step MarkdownListItem performs for a bullet. Without it a value
 * silently loses its cross-reference links, claim badges and date chips.
 */
function Value({ children, tabId }: { children: React.ReactNode; tabId?: TabId }) {
  return (
    <>
      {React.Children.map(children, (child) =>
        typeof child === "string" ? <HighlightedText text={child} tabId={tabId} /> : child
      )}
    </>
  );
}

function Chip({
  icon: Icon,
  label,
  children,
  tabId,
}: {
  icon: typeof CalendarDays;
  label: string;
  children: React.ReactNode;
  tabId?: TabId;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-line/60 bg-paper px-3 py-2 flex-1 min-w-0">
      <Icon size={13} className="text-muted shrink-0 mt-0.5" aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-[9px] font-black uppercase tracking-wider text-muted leading-none mb-1">{label}</div>
        <div className="text-[11px] font-bold text-ink leading-snug">
          <Value tabId={tabId}>{children}</Value>
        </div>
      </div>
    </div>
  );
}

export function CommitmentFields({ fields, tabId }: { fields: CommitmentField[]; tabId?: TabId }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();

  const find = (k: CommitmentFieldKey) => fields.find((f) => f.key === k);
  const baseline = find("baseline");
  const target = find("target");
  const deadline = find("deadline");
  const owner = find("owner");
  const traceability = find("traceability");
  const escalation = find("escalation");

  // Anything the document adds later that is not one of the six known fields still gets shown.
  const extras = fields.filter((f) => f.key === null);

  const rise = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: inView || reduce ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.46, ease: EASE_ENTRANCE, delay: reduce ? 0 : i * STAGGER.tight },
  });

  return (
    <div ref={ref} className="not-prose my-4 space-y-2.5">
      {/* Where it stands, and what it has committed to. The pair is the commitment. */}
      {baseline && target && (
        <motion.div className="flex flex-col sm:flex-row items-stretch gap-2" {...rise(0)}>
          <div className="flex-1 rounded-xl border border-line/60 bg-paper p-3">
            <div className="text-[9px] font-black uppercase tracking-wider text-muted mb-1">{baseline.label}</div>
            <div className="text-[12px] text-ink leading-snug">
              <Value tabId={tabId}>{baseline.value}</Value>
            </div>
          </div>
          <div className="flex items-center justify-center shrink-0" aria-hidden="true">
            <ArrowRight size={16} className="text-accent rotate-90 sm:rotate-0" />
          </div>
          <div className="flex-1 rounded-xl border border-accent/30 bg-accent/[0.05] p-3">
            <div className="text-[9px] font-black uppercase tracking-wider text-accent mb-1">{target.label}</div>
            <div className="text-[12px] font-semibold text-ink leading-snug">
              <Value tabId={tabId}>{target.value}</Value>
            </div>
          </div>
        </motion.div>
      )}

      {(deadline || owner) && (
        <motion.div className="flex flex-col sm:flex-row gap-2" {...rise(1)}>
          {deadline && (
            <Chip icon={CalendarDays} label={deadline.label} tabId={tabId}>
              {deadline.value}
            </Chip>
          )}
          {owner && (
            <Chip icon={UserRound} label={owner.label} tabId={tabId}>
              {owner.value}
            </Chip>
          )}
        </motion.div>
      )}

      {traceability && (
        <motion.div className="flex items-start gap-2 px-1" {...rise(2)}>
          <Route size={13} className="text-muted shrink-0 mt-1" aria-hidden="true" />
          <p className="text-[11px] text-muted leading-relaxed">
            <span className="font-black uppercase tracking-wider text-[9px] text-muted mr-1.5">
              {traceability.label}
            </span>
            <Value tabId={tabId}>{traceability.value}</Value>
          </p>
        </motion.div>
      )}

      {escalation && (
        <motion.div
          className="rounded-xl border border-danger/30 bg-danger/[0.04] p-3 flex items-start gap-2"
          {...rise(3)}
        >
          <TriangleAlert size={13} className="text-danger shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[11px] text-ink/90 leading-relaxed min-w-0">
            <span className="font-black uppercase tracking-wider text-[9px] text-danger mr-1.5">
              {escalation.label}
            </span>
            <Value tabId={tabId}>{escalation.value}</Value>
          </p>
        </motion.div>
      )}

      {extras.map((f, i) => (
        <motion.p key={i} className="text-[11px] text-muted leading-relaxed px-1" {...rise(4 + i)}>
          <span className="font-black uppercase tracking-wider text-[9px] text-muted mr-1.5">{f.label}</span>
          <Value tabId={tabId}>{f.value}</Value>
        </motion.p>
      ))}
    </div>
  );
}
