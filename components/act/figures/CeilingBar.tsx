"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { Figure } from "../Figure";
import { SERIES, STATUS } from "../chart-tokens";
import { useChartMode } from "../useChartMode";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";
import { CountUp } from "../../visual/Numerals";

/**
 * The hardest claim in the proposal, as one bar.
 *
 * Every connected voter in Kitui — all of them, at a conversion rate no campaign has ever
 * achieved — against the number of votes the seat costs. One track, one fill, and the empty
 * remainder is the argument: the gap is 126,004 votes that digital cannot reach at any budget.
 *
 * A stat tile would state it; this shows it, and the ratio is the reason the whole
 * communications split that follows is 82% offline. The two ends are labelled directly
 * because the point is the distance between them, not either value on its own.
 */
export function CeilingBar() {
  const mode = useChartMode();
  const c = SERIES[mode];
  const s = STATUS[mode];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotionSafe();
  const run = reduce || inView;

  const REACHABLE = 72000;
  const THRESHOLD = 198004;
  const pct = (REACHABLE / THRESHOLD) * 100;
  const shortfall = THRESHOLD - REACHABLE;
  const fmt = (n: number) => n.toLocaleString("en-KE");
  const pct1 = (n: number) => `${n.toFixed(1)}%`;

  return (
    <Figure
      kicker="The digital ceiling"
      title="Every connected voter in the county is 36% of a win"
      standfirst="The filled portion is 100% conversion of every internet user in Kitui. The empty portion is what no amount of digital spend can reach."
      source="KNBS 2019 Census — 143,340 internet users of 1,053,991 aged 3+ · IEBC 2022 result · Tier 1, official"
      table={{
        head: ["Measure", "Voters", "Share of threshold"],
        rows: [
          [`Connected voters in Kitui (100% converted)`, `~${fmt(REACHABLE)}`, pct1(pct)],
          [`Votes required to win`, fmt(THRESHOLD), `100%`],
          [`Shortfall digital cannot close`, `~${fmt(shortfall)}`, pct1(100 - pct)],
          ["Population offline", "86.4%", "—"],
        ],
      }}
    >
      <div ref={ref}>
        <div
          className="relative h-16 rounded-lg overflow-hidden"
          style={{ background: "color-mix(in oklch, var(--act-raise) 90%, transparent)", border: "1px solid var(--act-hair)" }}
        >
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ width: `${pct}%`, background: c[0], transformOrigin: "left center" }}
            initial={reduce ? false : { scaleX: 0 }}
            animate={run ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* The shortfall, marked rather than filled — there is nothing there, which is the point. */}
          <div
            className="absolute inset-y-0 right-0 flex items-center justify-end pr-4"
            style={{ width: `${100 - pct}%` }}
          >
            <span
              className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em]"
              style={{ color: s.critical }}
            >
              {fmt(shortfall)} out of reach
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p
              className="font-sans font-bold leading-none"
              style={{ color: c[0], fontSize: "clamp(1.6rem, 1.2rem + 1.6vw, 2.4rem)" }}
            >
              <CountUp value={72000} />
            </p>
            <p className="mt-1.5 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--act-dim)" }}>
              reachable online, at 100%
            </p>
          </div>
          <div className="text-right">
            <p
              className="font-sans font-bold leading-none"
              style={{ color: "var(--act-text)", fontSize: "clamp(1.6rem, 1.2rem + 1.6vw, 2.4rem)" }}
            >
              <CountUp value={198004} />
            </p>
            <p className="mt-1.5 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--act-dim)" }}>
              votes to win the seat
            </p>
          </div>
        </div>
      </div>
    </Figure>
  );
}
