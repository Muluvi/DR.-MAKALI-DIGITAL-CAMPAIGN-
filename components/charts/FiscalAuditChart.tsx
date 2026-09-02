"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { EASE_ENTRANCE, STAGGER, VIEWPORT } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

export interface FiscalBar {
  name: string;
  value: number;
  display: string;
  color: string;
}

/**
 * Section 2.7 — audit exposure measured against the resource envelope.
 *
 * This was three bars side by side, which invites the reader to compare the envelope with the
 * exposures as if they were peers. They are not: the envelope is the denominator and the other
 * two are what sits inside it. The section's own sentence is "exposure is N% of the envelope",
 * so the form should be a meter — the envelope as the track, the exposures stacked inside it.
 *
 * Convention: the FIRST datum is the whole, the rest are the parts measured against it. That
 * matches the order the caller already builds and keeps the component honest about which figure
 * is the denominator.
 */
export default function FiscalAuditChart({ data }: { data: FiscalBar[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();

  if (data.length < 2) return null;
  const [whole, ...parts] = data;
  const exposure = parts.reduce((s, p) => s + p.value, 0);
  const sharePct = (exposure / whole.value) * 100;

  const fmt = (v: number) =>
    v >= 1_000_000_000 ? `KSh ${(v / 1_000_000_000).toFixed(2)}bn` : `KSh ${Math.round(v / 1_000_000)}m`;

  let offset = 0;
  const segments = parts.map((p) => {
    const seg = { ...p, pct: (p.value / whole.value) * 100, offset };
    offset += seg.pct;
    return seg;
  });

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-muted">{whole.name}</span>
        <span className="font-mono text-sm font-black text-ink tabular-nums">{fmt(whole.value)}</span>
      </div>

      {/* The envelope is the track; the exposures are what sits inside it. */}
      <div
        className="relative h-10 rounded-lg overflow-hidden bg-line/40 border border-line"
        role="img"
        aria-label={`${fmt(exposure)} of exposure against a ${fmt(whole.value)} envelope, ${sharePct.toFixed(
          0
        )} percent, composed of ${parts.map((p) => `${p.name} ${fmt(p.value)}`).join(", ")}`}
      >
        {segments.map((s, i) => (
          <motion.div
            key={s.name}
            className="absolute inset-y-0 origin-left"
            style={{ left: `${s.offset}%`, width: `calc(${s.pct}% - 2px)`, backgroundColor: s.color }}
            initial={reduce ? false : { scaleX: 0 }}
            animate={inView || reduce ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.52, ease: EASE_ENTRANCE, delay: reduce ? 0 : i * STAGGER.tight }}
          />
        ))}
        {/* Where the exposure ends. The reader should be able to see the proportion, not compute it. */}
        <div
          className="absolute inset-y-0 w-0.5 bg-ink/70"
          style={{ left: `${sharePct}%` }}
          aria-hidden="true"
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono font-black text-ink tabular-nums"
          style={{ left: `calc(${sharePct}% + 8px)` }}
        >
          {sharePct.toFixed(0)}%
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {segments.map((s) => (
          <li key={s.name} className="flex items-baseline gap-2 text-[11px] leading-snug">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0 mt-0.5"
              style={{ backgroundColor: s.color }}
              aria-hidden="true"
            />
            <span className="text-ink flex-1 min-w-0">{s.name}</span>
            <span className="font-mono text-muted tabular-nums shrink-0">{fmt(s.value)}</span>
            <span className="font-mono text-muted/70 tabular-nums shrink-0 w-10 text-right">
              {s.pct.toFixed(1)}%
            </span>
          </li>
        ))}
        <li className="flex items-baseline gap-2 text-[11px] pt-1.5 border-t border-line/50">
          <span className="w-2.5 shrink-0" aria-hidden="true" />
          <span className="text-ink font-bold flex-1">Total exposure</span>
          <span className="font-mono text-ink font-bold tabular-nums shrink-0">{fmt(exposure)}</span>
          <span className="font-mono text-ink font-bold tabular-nums shrink-0 w-10 text-right">
            {sharePct.toFixed(1)}%
          </span>
        </li>
      </ul>
    </div>
  );
}
