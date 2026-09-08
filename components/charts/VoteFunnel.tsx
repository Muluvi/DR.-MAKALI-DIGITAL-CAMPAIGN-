"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

import { useMotionPreset } from "../../hooks/useMotionPreset";
import { AnimatedNumber } from "../visual/AnimatedNumber";
import { STAGGER, drawPath } from "../../lib/motion";

/**
 * The register, the turnout, and the number that wins — as one narrowing flow.
 *
 * Three figures the document keeps in separate paragraphs, and the relationship between them is
 * the whole arithmetic of §1.3.1: 532,758 people are registered, about 330,310 of them will
 * actually vote at the 62% countywide baseline, and roughly 200,000 of those votes wins the
 * seat. Stated as a list they are three big numbers. Drawn as a funnel they are one shrinking
 * quantity, and the last stage is most of what remains — which is the point.
 *
 * The benchmark line is 198,004, the total that actually won the seat in 2022. It is drawn as a
 * rule across the final stage rather than as a fourth bar, because it is not a stage of the
 * funnel — it is the evidence that the threshold above it is the right threshold.
 *
 * Motion contract: the connecting flows are SVG paths animated on `pathLength`, and the stage
 * bars scale from their left edge. The benchmark locks in last, after the flow has arrived.
 * Under reduced motion everything renders final and the paths are simply drawn.
 */

const REGISTERED = 532758;
const EXPECTED_TURNOUT = 330310;
const THRESHOLD = 200000;
const WON_2022 = 198004;
const TURNOUT_RATE = 62.0;

const STAGES = [
  {
    key: "registered",
    value: REGISTERED,
    label: "Registered voters",
    note: "IEBC 2022 register, 40 wards. Tier 1.",
    tone: "bg-line",
  },
  {
    key: "turnout",
    value: EXPECTED_TURNOUT,
    label: "Expected ballots cast",
    note: `At the ${TURNOUT_RATE}% countywide participation baseline.`,
    tone: "bg-rival-solid",
  },
  {
    key: "threshold",
    value: THRESHOLD,
    label: "Votes that win the seat",
    note: "≈53.4% of expected turnout.",
    tone: "bg-accent-solid",
  },
] as const;

export function VoteFunnel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const { reduce, spring, variants, enter } = useMotionPreset();
  const shown = reduce || inView;

  return (
    <section
      ref={ref}
      className="not-prose my-7 rounded-2xl border border-line bg-card p-4 sm:p-5"
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-labelledby="vote-funnel-title"
    >
      <p className="eyebrow-label">The arithmetic of winning</p>
      <h4 id="vote-funnel-title" className="font-serif t-label font-black text-ink mb-1">
        From the register to the winning number
      </h4>
      <p className="t-small text-muted leading-relaxed mb-4">
        Three figures, and the distance between them. The seat is decided by the last one.
      </p>

      <ol className="space-y-1" aria-hidden="true">
        {STAGES.map((stage, i) => {
          const width = (stage.value / REGISTERED) * 100;
          return (
            <li key={stage.key}>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="t-micro font-black uppercase tracking-wider text-muted">
                  {stage.label}
                </span>
                <span className="t-label font-black text-ink tabular-nums">
                  <AnimatedNumber value={stage.value} />
                </span>
              </div>
              <div className="relative h-7 rounded-lg bg-line/25 overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-lg ${stage.tone}`}
                  style={{ width: `${width}%`, transformOrigin: "left" }}
                  initial={enter({ scaleX: 0 })}
                  animate={shown ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ ...spring("gentle"), delay: reduce ? 0 : i * STAGGER.loose * 3 }}
                />
                {/* The 2022 benchmark, on the stage it belongs to. */}
                {stage.key === "threshold" && (
                  <motion.div
                    className="absolute inset-y-0 w-[2px] bg-gold"
                    style={{ left: `${(WON_2022 / REGISTERED) * 100}%` }}
                    initial={enter({ opacity: 0, scaleY: 0.4 })}
                    animate={shown ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.4 }}
                    transition={{ ...spring("bouncy"), delay: reduce ? 0 : 0.75 }}
                  />
                )}
              </div>
              <p className="t-micro text-muted mt-1 leading-snug">{stage.note}</p>

              {/* The narrowing, drawn. Two strokes converging from this stage's width to the
                  next one's, so the loss between stages is the shape rather than a subtraction. */}
              {i < STAGES.length - 1 && (
                <svg
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  className="w-full h-3 my-0.5 text-line"
                  aria-hidden="true"
                >
                  <motion.path
                    d={`M0 0 L${(STAGES[i + 1].value / REGISTERED) * 100 * 0} 10`}
                    stroke="currentColor"
                    strokeWidth="0.6"
                    vectorEffect="non-scaling-stroke"
                    fill="none"
                    variants={variants(drawPath)}
                    initial={enter("hidden")}
                    animate={shown ? "visible" : "hidden"}
                  />
                  <motion.path
                    d={`M${width} 0 L${(STAGES[i + 1].value / REGISTERED) * 100} 10`}
                    stroke="currentColor"
                    strokeWidth="0.6"
                    vectorEffect="non-scaling-stroke"
                    fill="none"
                    variants={variants(drawPath)}
                    initial={enter("hidden")}
                    animate={shown ? "visible" : "hidden"}
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/[0.05] p-3">
        <span aria-hidden="true" className="mt-1 w-[3px] h-8 rounded-full bg-gold shrink-0" />
        <p className="t-small text-ink leading-snug">
          <strong className="font-black tabular-nums">{WON_2022.toLocaleString()}</strong> votes won
          the seat in 2022. The ~{THRESHOLD.toLocaleString()} target is set just above what has
          actually been enough, not above a round number.
        </p>
      </div>

      {/* The accessible equivalent. */}
      <table className="w-full mt-4 t-small border-collapse">
        <caption className="sr-only">
          Kitui County vote arithmetic: registered voters, expected ballots cast at the 62%
          participation baseline, and the winning threshold, with the 2022 winning total as a
          benchmark.
        </caption>
        <tbody>
          {STAGES.map((s) => (
            <tr key={s.key} className="border-b border-line/40">
              <th scope="row" className="text-left py-1.5 font-semibold text-ink">{s.label}</th>
              <td className="text-right py-1.5 tabular-nums text-muted">{s.value.toLocaleString()}</td>
            </tr>
          ))}
          <tr>
            <th scope="row" className="text-left py-1.5 font-semibold text-ink">
              Winning total, 2022
            </th>
            <td className="text-right py-1.5 tabular-nums text-muted">{WON_2022.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
