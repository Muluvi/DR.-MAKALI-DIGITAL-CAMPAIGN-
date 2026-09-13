"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

export interface BarDatum {
  label: string;
  value: number;
  /** Mark colour. One colour for a single measure; a second only where it means something. */
  color: string;
  /** Text at the bar's tip. Selective by design — not every bar carries one. */
  tip?: string;
  /** Extra line under the label. */
  sub?: string;
  /** Shown on hover and focus. Never the only route to the value — the table twin has it too. */
  detail?: string;
}

/**
 * Horizontal bars, to the act's mark spec.
 *
 * 20px thick (under the 24px cap, leaving the band's remainder as air), 4px rounded at the
 * data end and square at the baseline, a 2px surface gap between neighbours, hairline
 * threshold rule, and labels only where they carry the story. Bars grow from the baseline
 * once, on first approach; under reduced motion they render at full length immediately —
 * the figure is never animated *to* the truth.
 *
 * Horizontal rather than vertical because every category here is a phrase ("The Mwingi
 * triad", "Kikamba vernacular radio"), and rotated axis labels on a phone are unreadable.
 */
export function Bars({
  data,
  max,
  threshold,
  thresholdLabel,
  formatValue = (n) => n.toLocaleString("en-KE"),
}: {
  data: BarDatum[];
  max: number;
  threshold?: number;
  thresholdLabel?: string;
  formatValue?: (n: number) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotionSafe();
  const [hover, setHover] = useState<number | null>(null);
  const grown = reduce || inView;

  return (
    <div ref={ref} className="relative">
      {threshold !== undefined ? (
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-8 pointer-events-none"
          style={{ left: `${(threshold / max) * 100}%` }}
        >
          <div className="w-px h-full" style={{ background: "var(--act-hair)" }} />
        </div>
      ) : null}

      <div className="relative space-y-[2px]">
        {data.map((d, i) => {
          const pct = Math.max(0, Math.min(100, (d.value / max) * 100));
          const active = hover === i;
          return (
            <div
              key={d.label}
              className="py-2.5 rounded-md transition-colors"
              style={{ background: active ? "color-mix(in oklch, var(--act-raise) 70%, transparent)" : "transparent" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              role="group"
              aria-label={`${d.label}: ${formatValue(d.value)}${d.detail ? `. ${d.detail}` : ""}`}
            >
              <div className="flex items-baseline justify-between gap-4 mb-1.5 px-1">
                <span
                  className="font-sans text-[0.8125rem] font-semibold leading-tight"
                  style={{ color: "var(--act-text)" }}
                >
                  {d.label}
                  {d.sub ? (
                    <span className="block font-normal mt-0.5" style={{ color: "var(--act-dim)", fontSize: "0.75rem" }}>
                      {d.sub}
                    </span>
                  ) : null}
                </span>
                <span
                  className="font-sans text-[0.8125rem] font-bold shrink-0"
                  style={{ color: "var(--act-text)", fontVariantNumeric: "tabular-nums" }}
                >
                  {formatValue(d.value)}
                </span>
              </div>

              <div className="relative h-5 px-1">
                {/* The bar's WIDTH is the datum; scaleX only animates it into place, so the
                    resting geometry is correct even if the animation never runs. */}
                <motion.div
                  className="h-5"
                  style={{
                    width: `${pct}%`,
                    background: d.color,
                    borderRadius: "2px 4px 4px 2px",
                    transformOrigin: "left center",
                  }}
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={grown ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.85, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {d.tip ? (
                <p
                  className="mt-1.5 px-1 font-sans text-[0.6875rem] font-semibold"
                  style={{ color: "var(--act-dim)" }}
                >
                  {d.tip}
                </p>
              ) : null}

              {active && d.detail ? (
                <p
                  className="mt-1.5 px-1 font-sans text-[0.75rem] leading-snug"
                  style={{ color: "var(--act-body)" }}
                >
                  {d.detail}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {threshold !== undefined && thresholdLabel ? (
        <div className="relative mt-2 h-4" aria-hidden="true">
          <span
            className="absolute font-sans text-[0.625rem] font-bold uppercase tracking-[0.08em] whitespace-nowrap"
            style={{
              left: `min(${(threshold / max) * 100}%, calc(100% - 9rem))`,
              transform: "translateX(-50%)",
              color: "var(--act-dim)",
            }}
          >
            {thresholdLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
