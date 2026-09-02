"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { EASE_ENTRANCE, STAGGER, VIEWPORT } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

export interface StationBar {
  name: string;
  reachTier: 1 | 2 | 3;
  reachLabel: string;
  alignmentCategory: string;
  color: string;
}

/**
 * Section 17A.1 — the Kamba-language radio landscape, as position rather than length.
 *
 * This was a horizontal bar chart whose own axis label read "Reach (qualitative read, not
 * measured)". Drawing a qualitative 1–3 tier as a continuous bar length asserts a precision the
 * source explicitly disclaims — the same class of problem as the invented figures the truth pass
 * removed, arriving through the chart form instead of through the data.
 *
 * A station has two attributes that matter and neither is continuous: how far it reaches, and
 * whose it is. So it becomes a matrix. Tier is a row; alignment is a column; each station is a
 * chip in a cell. Nothing about the layout implies a measured quantity, and the strategic finding
 * — that the highest-reach stations sit with a rival or the party gatekeeper — becomes visible as
 * a cluster in the top-left rather than something the reader has to assemble from bar lengths.
 */

/** Ordered so the axis reads from most to least useful to this campaign. */
const ALIGNMENTS = [
  { key: "ngilu", label: "Rival-aligned", match: (a: string) => a.includes("Ngilu") },
  { key: "kalonzo", label: "Party gatekeeper", match: (a: string) => a.includes("Kalonzo") },
  { key: "other", label: "Commercial / independent", match: () => true },
] as const;

const TIERS = [
  { tier: 3 as const, label: "Highest reach", note: "Tier 3" },
  { tier: 2 as const, label: "Mid reach", note: "Tier 2" },
  { tier: 1 as const, label: "Narrow reach", note: "Tier 1" },
];

function alignmentOf(station: StationBar) {
  return ALIGNMENTS.find((a) => a.match(station.alignmentCategory)) ?? ALIGNMENTS[2];
}

export default function MediaOwnershipChart({ data }: { data: StationBar[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();

  let order = 0;

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <div className="min-w-[26rem]">
        {/* Column heads — the alignment axis. */}
        <div className="grid grid-cols-[5.5rem_repeat(3,minmax(0,1fr))] gap-1.5 mb-1.5">
          <span aria-hidden="true" />
          {ALIGNMENTS.map((a) => (
            <span
              key={a.key}
              className="text-[9px] font-black uppercase tracking-wider text-muted leading-tight text-center"
            >
              {a.label}
            </span>
          ))}
        </div>

        {TIERS.map((row) => (
          <div key={row.tier} className="grid grid-cols-[5.5rem_repeat(3,minmax(0,1fr))] gap-1.5 mb-1.5">
            <div className="flex flex-col justify-center pr-1">
              <span className="text-[10px] font-bold text-ink leading-tight">{row.label}</span>
              <span className="text-[9px] text-muted font-mono">{row.note}</span>
            </div>

            {ALIGNMENTS.map((col) => {
              const cell = data.filter((s) => s.reachTier === row.tier && alignmentOf(s).key === col.key);
              return (
                <div
                  key={col.key}
                  className="min-h-[2.75rem] rounded-lg border border-line bg-paper/50 p-1 flex flex-wrap gap-1 items-center justify-center"
                >
                  {cell.map((s) => {
                    const delay = reduce ? 0 : order++ * STAGGER.tight;
                    return (
                      <motion.span
                        key={s.name}
                        className="text-[10px] font-bold px-1.5 py-1 rounded border leading-none"
                        style={{
                          color: s.color,
                          borderColor: s.color,
                          backgroundColor: `color-mix(in srgb, ${s.color} 12%, transparent)`,
                        }}
                        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                        animate={inView || reduce ? { opacity: 1, scale: 1 } : undefined}
                        transition={{ duration: 0.42, ease: EASE_ENTRANCE, delay }}
                        title={`${s.name} — ${s.alignmentCategory}. ${s.reachLabel}`}
                      >
                        {s.name}
                      </motion.span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}

        <p className="text-[10px] text-muted leading-relaxed mt-2.5">
          Position carries the reading — nothing here is drawn to scale, and an empty cell means no station in
          this landscape occupies that combination.
        </p>
      </div>
    </div>
  );
}
