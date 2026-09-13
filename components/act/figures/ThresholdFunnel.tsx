"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { Figure } from "../Figure";
import { SERIES, STATUS } from "../chart-tokens";
import { useChartMode } from "../useChartMode";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";
import { CountUp } from "../../visual/Numerals";

/**
 * Register to ballots to victory, at true proportion.
 *
 * An ordered three-step funnel, so the ramp is the right encoding: one hue, light to dark,
 * each step narrower than the last by exactly the ratio it describes. The reader watches
 * 532,758 people become 330,310 ballots become the ~200,000 the seat costs, and the last bar
 * is visibly three-fifths of the one above it — which is the whole point, and the thing a
 * sentence saying "60.0% to 60.5% of all valid ballots cast" cannot do.
 *
 * The ring carries the share, because a proportion of a whole is the one job a radial does
 * better than a bar.
 */
export function ThresholdFunnel() {
  const mode = useChartMode();
  const c = SERIES[mode];
  const s = STATUS[mode];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotionSafe();
  const run = reduce || inView;

  const REGISTER = 532758;
  const steps = [
    {
      value: REGISTER,
      label: "Registered voters",
      note: "40 wards, 8 constituencies, 1,578 polling stations",
      color: c[0],
      opacity: 0.45,
    },
    {
      value: 330310,
      label: "Ballots expected",
      note: "At the county's 62% historical turnout",
      color: c[0],
      opacity: 0.75,
    },
    {
      value: 200000,
      label: "Votes to win",
      note: "From Malombe's certified 198,004 in 2022",
      color: c[0],
      opacity: 1,
    },
  ];

  return (
    <Figure
      kicker="The shape of the task"
      title="Three votes in every five that are cast"
      standfirst="Each bar is drawn to true proportion of the register above it. The seat is not won on a plurality — it is won on 60% of everything cast."
      source="IEBC certified register and 2022 result · turnout baseline ~62% · Tier 1, official"
      table={{
        head: ["Stage", "People", "% of register"],
        rows: [
          ["Registered voters", "532,758", "100%"],
          ["Ballots expected at 62% turnout", "330,310", "62.0%"],
          ["Votes needed to win", "~200,000", "37.5%"],
          ["Share of ballots cast that requires", "60.0–60.5%", "—"],
        ],
      }}
    >
      <div ref={ref} className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-3 min-w-0">
          {steps.map((step, i) => (
            <div key={step.label}>
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <span className="font-sans text-[0.8125rem] font-semibold" style={{ color: "var(--act-text)" }}>
                  {step.label}
                </span>
                <span className="font-sans text-[0.9375rem] font-bold" style={{ color: "var(--act-text)" }}>
                  <CountUp value={step.value} duration={1400 + i * 250} />
                </span>
              </div>
              <motion.div
                className="h-6"
                style={{
                  width: `${(step.value / REGISTER) * 100}%`,
                  background: step.color,
                  opacity: step.opacity,
                  borderRadius: "2px 4px 4px 2px",
                  transformOrigin: "left center",
                }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={run ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.9, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
              />
              <p className="mt-1.5 font-sans text-[0.6875rem]" style={{ color: "var(--act-dim)" }}>
                {step.note}
              </p>
            </div>
          ))}
        </div>

        <div className="justify-self-center text-center">
          <ShareRing value={0.605} display="60.5%" color={c[0]} run={run} reduce={reduce} />
          <p
            className="mt-3 font-sans text-[0.625rem] font-bold uppercase tracking-[0.12em] max-w-[9rem] mx-auto"
            style={{ color: "var(--act-dim)" }}
          >
            of every ballot cast, to win
          </p>
          <p className="mt-1 font-sans text-[0.6875rem]" style={{ color: s.muted }}>
            37.2–37.5% of the whole register
          </p>
        </div>
      </div>
    </Figure>
  );
}

/**
 * The share, as an arc.
 *
 * Its own component rather than the shared ProgressRing for two reasons that both matter
 * here: that one prints `Math.round(value * 100)`, which would render this figure as "61%"
 * three centimetres from prose saying 60.0–60.5%, and it strokes from the document's accent
 * token rather than the validated chart palette.
 */
function ShareRing({
  value,
  display,
  color,
  run,
  reduce,
}: {
  value: number;
  display: string;
  color: string;
  run: boolean;
  reduce: boolean;
}) {
  const size = 132;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative inline-grid place-items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${display} of every ballot cast`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--act-hair)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={reduce ? false : { strokeDashoffset: circumference }}
          animate={run ? { strokeDashoffset: circumference * (1 - value) } : undefined}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={reduce ? { strokeDashoffset: circumference * (1 - value) } : undefined}
        />
      </svg>
      <span
        className="absolute font-sans font-bold"
        style={{ color: "var(--act-text)", fontSize: "1.5rem" }}
      >
        {display}
      </span>
    </div>
  );
}
