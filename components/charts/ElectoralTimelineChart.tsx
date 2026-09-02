"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { EASE_ENTRANCE, VIEWPORT } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

export interface TimelinePoint {
  year: string;
  winner: string | null; // null = 2013, a named gap, not a zero result
  votes: number | null;
  color: string;
}

/**
 * Section 2.6 — the winning total across election cycles, as a trajectory.
 *
 * This was a bar chart with `year` on the x-axis. Bars compare magnitudes side by side; they
 * cannot show direction of travel, which is the entire point here. The bar Dr. Mulu has to clear
 * ROSE between the two sourced cycles, and a slope says that in one gesture where two columns
 * only invite the reader to work it out.
 *
 * 2013 has no sourced result. It renders as an explicit gap on the axis — a labelled absence,
 * never a zero, because a zero-height bar would read as "nobody won in 2013".
 *
 * Prose lives in HTML, not in the SVG. Text inside a scaled viewBox is magnified on a wide card
 * and shrunk to about six pixels on a phone; the delta and the gap note are sentences a reader
 * has to be able to read at any width, so they sit outside the drawing.
 */
export default function ElectoralTimelineChart({ data }: { data: TimelinePoint[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();

  const real = data.filter((d): d is TimelinePoint & { votes: number } => d.votes !== null);
  if (real.length < 2) return null;

  const W = 420;
  const H = 170;
  const PAD = { top: 30, right: 86, bottom: 30, left: 50 };
  const max = Math.max(...real.map((d) => d.votes)) * 1.08;
  const min = Math.min(...real.map((d) => d.votes)) * 0.9;

  const x = (i: number) => PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * (H - PAD.top - PAD.bottom);

  const first = real[0];
  const last = real[real.length - 1];
  const delta = last.votes - first.votes;
  const pct = (delta / first.votes) * 100;
  const gaps = data.filter((d) => d.votes === null);
  const path = real.map((d) => `${x(data.indexOf(d))},${y(d.votes)}`).join(" L ");

  return (
    <div ref={ref} className="w-full max-w-[30rem] mx-auto">
      {/* The delta is the finding, so it is stated rather than left to be inferred. */}
      <p className="text-[11px] font-bold text-ink text-center mb-1 tabular-nums">
        {delta > 0 ? "+" : ""}
        {delta.toLocaleString()} ({pct > 0 ? "+" : ""}
        {pct.toFixed(1)}%){" "}
        <span className="font-normal text-muted">between the two sourced cycles</span>
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Winning total rose from ${first.votes.toLocaleString()} in ${first.year} to ${last.votes.toLocaleString()} in ${last.year}`}
      >
        {/* Axis ticks — the two sourced values only; a grid here would add ink and no meaning. */}
        {real.map((d) => (
          <g key={d.year}>
            <line
              x1={PAD.left}
              y1={y(d.votes)}
              x2={W - PAD.right}
              y2={y(d.votes)}
              stroke="var(--color-line)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
            <text
              x={PAD.left - 7}
              y={y(d.votes) + 3}
              textAnchor="end"
              className="fill-muted"
              style={{ fontSize: 9, fontWeight: 700 }}
            >
              {(d.votes / 1000).toFixed(0)}k
            </text>
          </g>
        ))}

        {/* The slope. Draws forward on entry — the motion is the direction of travel. */}
        <motion.path
          d={`M ${path}`}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={inView || reduce ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.62, ease: EASE_ENTRANCE }}
        />

        {data.map((d, i) => {
          if (d.votes === null) {
            // A named gap. Hollow marker on the baseline — the note beneath the chart says why.
            return (
              <g key={d.year}>
                <circle
                  cx={x(i)}
                  cy={H - PAD.bottom}
                  r="4.5"
                  fill="none"
                  stroke="var(--color-muted)"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <text
                  x={x(i)}
                  y={H - PAD.bottom + 17}
                  textAnchor="middle"
                  className="fill-muted"
                  style={{ fontSize: 10, fontWeight: 700 }}
                >
                  {d.year}
                </text>
              </g>
            );
          }
          const isLast = d === last;
          return (
            <g key={d.year}>
              <circle
                cx={x(i)}
                cy={y(d.votes)}
                r={isLast ? 5.5 : 4.5}
                fill={isLast ? "var(--color-accent)" : "var(--color-card)"}
                stroke="var(--color-accent)"
                strokeWidth="2"
              />
              <text
                x={x(i)}
                y={H - PAD.bottom + 17}
                textAnchor="middle"
                className="fill-ink"
                style={{ fontSize: 10.5, fontWeight: 800 }}
              >
                {d.year}
              </text>
              <text
                x={x(i) + (isLast ? 11 : 0)}
                y={y(d.votes) - 11}
                textAnchor={isLast ? "start" : "middle"}
                className="fill-ink"
                style={{ fontSize: 10, fontWeight: 800 }}
              >
                {d.winner}
              </text>
              {isLast && (
                <text
                  x={x(i) + 11}
                  y={y(d.votes) + 4}
                  className="fill-accent"
                  style={{ fontSize: 10, fontWeight: 800 }}
                >
                  {d.votes.toLocaleString()}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {gaps.length > 0 && (
        <p className="flex items-center justify-center gap-1.5 text-[10.5px] text-muted mt-1">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full border-[1.5px] border-dashed border-muted shrink-0"
            aria-hidden="true"
          />
          <span>
            {gaps.map((g) => g.year).join(", ")} — no sourced winner or vote total, drawn as a gap rather than a zero.
          </span>
        </p>
      )}
    </div>
  );
}
