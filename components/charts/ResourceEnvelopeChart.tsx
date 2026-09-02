"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { EASE_ENTRANCE, STAGGER, VIEWPORT } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

export interface WaterfallStep {
  name: string;
  base: number;
  value: number;
  display: string;
  color: string;
  isTotal?: boolean;
}

/**
 * Section 4.4 — how the county resource envelope is built up.
 *
 * The data type has been `WaterfallStep` all along, but it rendered through a plain column chart,
 * so the running total was invisible: three columns floating at different heights with nothing
 * saying they accumulate. A waterfall without connectors is just bars at odd offsets.
 *
 * The connectors are the content. Each step starts where the previous one ended, and the line
 * between them is what makes it an accumulation rather than a comparison. The total column is
 * grounded at zero and set apart, because it is the sum rather than another contribution.
 */
export default function ResourceEnvelopeChart({ data }: { data: WaterfallStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();

  const max = Math.max(...data.map((d) => d.base + d.value)) * 1.06;
  const pct = (v: number) => (v / max) * 100;
  // Values arrive already denominated in billions (11.64, 1.03 …), matching the source prose.
  const fmt = (v: number) => `${v.toFixed(2)}bn`;

  return (
    <div ref={ref} className="w-full h-full flex flex-col min-h-[10rem]">
      <div className="flex-1 flex items-end gap-2 sm:gap-3 min-h-[8rem] relative">
        {data.map((step, i) => {
          const top = pct(step.base + step.value);
          const bottom = pct(step.base);
          const prev = data[i - 1];
          const connectorAt = prev && !step.isTotal ? pct(prev.base + prev.value) : null;

          return (
            <div key={step.name} className="flex-1 relative h-full flex flex-col justify-end">
              {/* Connector from the previous step's top to this one's base. The accumulation. */}
              {connectorAt !== null && (
                <motion.div
                  className="absolute border-t border-dashed border-muted/70 -left-2 sm:-left-3 right-0 origin-left"
                  style={{ bottom: `${connectorAt}%` }}
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={inView || reduce ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.3, ease: EASE_ENTRANCE, delay: reduce ? 0 : i * STAGGER.tight }}
                  aria-hidden="true"
                />
              )}

              <motion.div
                className={`w-full rounded-t origin-bottom ${step.isTotal ? "rounded-b-none border-t-2 border-x border-x-line" : ""}`}
                style={{
                  position: "absolute",
                  bottom: `${bottom}%`,
                  height: `${top - bottom}%`,
                  // The total is the sum, not another contribution, so it is drawn in the
                  // theme's own ink rather than a palette colour — the caller's near-black
                  // total colour vanishes against a dark ground.
                  backgroundColor: step.isTotal ? "color-mix(in srgb, var(--color-ink) 22%, transparent)" : step.color,
                  borderTopColor: step.isTotal ? "var(--color-ink)" : undefined,
                }}
                initial={reduce ? false : { scaleY: 0 }}
                animate={inView || reduce ? { scaleY: 1 } : undefined}
                transition={{ duration: 0.5, ease: EASE_ENTRANCE, delay: reduce ? 0 : 0.1 + i * STAGGER.tight }}
                role="img"
                aria-label={`${step.name}: ${step.display}`}
              />

              <span
                className="absolute w-full text-center font-mono t-micro font-bold text-ink tabular-nums"
                style={{ bottom: `calc(${top}% + 3px)` }}
              >
                {fmt(step.value)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 sm:gap-3 mt-2 pt-2 border-t border-line">
        {data.map((step) => (
          <div key={step.name} className="flex-1 text-center">
            <span
              className={`block t-micro leading-tight ${
                step.isTotal ? "font-black text-ink" : "font-bold text-muted"
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
