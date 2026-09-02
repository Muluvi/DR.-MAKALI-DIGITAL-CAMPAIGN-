"use client";

import { motion } from "motion/react";
import { VIEWPORT, deliberate } from "../../lib/motion";

export interface KpiRow {
  label: string;
  unit: string;
  // One entry per phase that has a stated numeric target; phases marked "Not live" are omitted
  // rather than plotted as zero.
  points: { phaseId: string; phaseLabel: string; value: number; color: string }[];
}

/**
 * Bullet-chart-style horizontal bar per metric: a track scaled to the final-phase target, with
 * a tick marker for every phase that has a stated target. There is no "actual" series here —
 * the proposal has no results yet — so this shows the target ramp across phases rather than
 * actual-vs-target.
 */
export default function KpiPhaseBarChart({ rows }: { rows: KpiRow[] }) {
  return (
    <div className="space-y-8">
      {rows.map((row) => {
        const max = Math.max(...row.points.map((p) => p.value));
        const finalPoint = row.points[row.points.length - 1];
        return (
          <div key={row.label}>
            <div className="flex items-baseline justify-between mb-3">
              <span className="t-small font-black text-ink uppercase tracking-wide">{row.label}</span>
              <span className="t-label font-bold text-accent">
                {finalPoint.value.toLocaleString()} <span className="text-muted font-semibold normal-case">{row.unit} by {finalPoint.phaseLabel}</span>
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-line/40 overflow-visible mx-1.5">
              {/* scaleX, not width — width forces layout every frame. Origin left, so the
                  rail grows from its baseline the way the values it carries accumulate. */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={VIEWPORT}
                transition={deliberate}
                style={{ transformOrigin: "left" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/25 to-accent/10"
              />
              {row.points.map((p) => (
                <div
                  key={p.phaseId}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                  style={{ left: `${(p.value / max) * 100}%` }}
                >
                  <div
                    className="w-1.5 h-5 rounded-full border-2 border-card shadow-sm cursor-default"
                    style={{ backgroundColor: p.color }}
                    title={`${p.phaseLabel}: ${p.value.toLocaleString()} ${row.unit}`}
                  />
                  <span
                    className="absolute left-1/2 -translate-x-1/2 top-6 t-micro font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-line rounded-md px-1.5 py-0.5 shadow-sm z-10"
                    style={{ color: p.color }}
                  >
                    {p.phaseLabel}: {p.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
