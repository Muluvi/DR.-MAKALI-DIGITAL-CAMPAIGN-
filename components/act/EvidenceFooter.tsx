import React from "react";

import type { Tier } from "../../data/types";

export interface Citation {
  source: string;
  detail: string;
  tier: Tier;
}

const TIER_TEXT: Record<Tier, string> = {
  1: "Official",
  2: "Reported",
  3: "Unconfirmed",
};

const TIER_COLOR: Record<Tier, string> = {
  1: "var(--act-blue)",
  2: "var(--act-dim)",
  3: "var(--act-ember)",
};

/**
 * The evidence layer, kept — and moved.
 *
 * In the document every figure carried "(Tier 1)" inline, sometimes three times in a sentence.
 * The provenance rule is right and stays; the placement was what made the prose read like a
 * filed report. So the tiering comes out of the sentences and lands here, once per scene, where
 * a reader who wants to check a number can find every source behind that passage in one place
 * and a reader who does not is never interrupted.
 *
 * A Tier 3 claim still renders its unconfirmed marker in visible text, never on hover — that
 * rule is not a styling decision and does not change with the surface.
 */
export function EvidenceFooter({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;

  return (
    // Pulled up against the passage it belongs to, with the breathing room placed after it
    // instead. Centred between two chapters it read as an orphan belonging to neither.
    <div className="act-measure -mt-8 md:-mt-14 pb-16 md:pb-28">
      <div className="pt-6 border-t" style={{ borderColor: "var(--act-hair)" }}>
        <p
          className="font-sans uppercase tracking-[0.16em] text-[0.625rem] font-bold mb-4"
          style={{ color: "var(--act-dim)" }}
        >
          Evidence behind this passage
        </p>
        <ul className="list-none p-0 m-0 space-y-2.5">
          {citations.map((c) => (
            <li key={`${c.source}-${c.detail}`} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span
                className="font-sans text-[0.5625rem] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm shrink-0"
                style={{
                  color: TIER_COLOR[c.tier],
                  border: `1px solid color-mix(in oklch, ${TIER_COLOR[c.tier]} 40%, transparent)`,
                  background: `color-mix(in oklch, ${TIER_COLOR[c.tier]} 10%, transparent)`,
                }}
              >
                T{c.tier} {TIER_TEXT[c.tier]}
              </span>
              <span
                className="font-sans text-[0.8125rem] font-semibold"
                style={{ color: "var(--act-text)" }}
              >
                {c.source}
              </span>
              <span className="font-sans text-[0.8125rem]" style={{ color: "var(--act-dim)" }}>
                {c.detail}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
