"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { EASE_ENTRANCE, STAGGER, VIEWPORT } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

export interface TierBand {
  name: string;
  base: number; // KSh — the low end of the recommended band
  value: number; // KSh — the width of the band (high minus low)
  display: string;
  color: string;
}

/**
 * Section 8B.7 — the three tier bands against the statutory ceiling.
 *
 * This was a column chart faking floating bars with an invisible `base` segment, which is a
 * known workaround and reads as a stack of two things where only one is real. The data is three
 * RANGES measured against one fixed cap, which is the textbook case for a bullet chart: a shared
 * track, the band as the measure, the cap as a hard target marker.
 *
 * Making the cap a marker rather than an axis maximum is the point. Headroom beneath a statutory
 * limit is the thing §8B exists to demonstrate, and it should be visible as distance, not
 * inferred from where a bar happens to stop.
 */
export default function SpendingCeilingChart({ data, ceiling }: { data: TierBand[]; ceiling: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();

  // The track runs past the cap so the marker sits inside the plot, not on its edge.
  const scaleMax = ceiling * 1.12;
  const pct = (v: number) => (v / scaleMax) * 100;
  const fmtM = (v: number) => `${(v / 1_000_000).toFixed(1)}m`;

  return (
    <div ref={ref} className="w-full space-y-3">
      {data.map((t, i) => {
        const low = t.base;
        const high = t.base + t.value;
        const headroom = ceiling - high;
        const headroomText =
          headroom >= 0 ? `KSh ${fmtM(headroom)} headroom below the cap` : `KSh ${fmtM(-headroom)} over the cap`;
        const headroomClass = headroom < 0 ? "text-danger font-bold" : "text-muted";
        return (
          <div key={t.name}>
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <span className="t-small font-bold text-ink">{t.name}</span>
              <span className="font-mono t-label text-muted tabular-nums">{t.display}</span>
            </div>

            <div
              className="relative h-6 rounded bg-line/35"
              role="img"
              aria-label={`${t.name}: KSh ${fmtM(low)} to ${fmtM(high)}, against a ceiling of KSh ${fmtM(
                ceiling
              )}. Headroom KSh ${fmtM(headroom)}.`}
            >
              {/* The band. Grows from its own low end, which is where the range starts. */}
              <motion.div
                className="absolute inset-y-1 rounded-sm origin-left"
                style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%`, backgroundColor: t.color }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={inView || reduce ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.52, ease: EASE_ENTRANCE, delay: reduce ? 0 : i * STAGGER.tight }}
              />
              {/* Everything past the cap is unlawful spend. Tinting it says so, rather than
                  leaving a stretch of neutral track that reads as more available room. */}
              <div
                className="absolute inset-y-0 right-0 rounded-r bg-danger/12"
                style={{ left: `${pct(ceiling)}%` }}
                aria-hidden="true"
              />
              {/* The statutory cap. Fixed, never animated — it is not a value being revealed. */}
              <div
                className="absolute -inset-y-0.5 w-[2.5px] bg-danger rounded-full"
                style={{ left: `${pct(ceiling)}%` }}
                aria-hidden="true"
              />
            </div>

            {/* The low end is labelled beneath where the band actually begins; at the container's
                left edge it reads as an axis origin instead. On a phone the two labels would
                collide once the band sits far enough right, so the headroom drops to its own line. */}
            <div className="relative mt-0.5 h-3.5 t-micro font-mono text-muted tabular-nums">
              <span className="absolute whitespace-nowrap" style={{ left: `${pct(low)}%` }}>
                KSh {fmtM(low)}
              </span>
              <span className={`hidden sm:inline absolute right-0 whitespace-nowrap ${headroomClass}`}>
                {headroomText}
              </span>
            </div>
            <div className={`sm:hidden text-right t-micro font-mono tabular-nums ${headroomClass}`}>
              {headroomText}
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-2 pt-1 t-label text-muted">
        <span className="w-[2.5px] h-3.5 bg-danger rounded-full shrink-0" aria-hidden="true" />
        <span>
          Statutory county ceiling, <span className="font-mono tabular-nums">KSh {fmtM(ceiling)}</span> — shared
          across the Governor, Senator and Woman Representative races.
        </span>
      </div>
    </div>
  );
}
