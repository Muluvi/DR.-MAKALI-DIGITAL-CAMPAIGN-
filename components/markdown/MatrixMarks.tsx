"use client";

import { motion } from "motion/react";

import { useMotionPreset } from "../../hooks/useMotionPreset";
import { STAGGER } from "../../lib/motion";

export interface MatrixDatum {
  name: string;
  value: number;
  formatted: string;
}

/**
 * The Analytical Matrix's chart view, as marks that share identity with the table's rows.
 *
 * The switcher used to cross-fade a table into a recharts canvas: two unrelated pictures of the
 * same numbers, with nothing carrying the reader's place across the cut. If you were looking at
 * the third row, the chart gave you no way to find it again.
 *
 * These bars are laid out by Motion, so each label can share a `layoutId` with the row it came
 * from. Toggling the view makes the label travel from its cell to its bar and back — the row
 * IS the mark, seen a second way, and the transition says so. That is the whole reason to
 * animate a view switch rather than fade it.
 *
 * Native rather than recharts, and deliberately. A shared-element transition needs both ends
 * under Motion's control, and a charting library's canvas cannot be one end of it. Recharts is
 * still the right tool where the mark is genuinely a chart — the polling trajectory, the
 * unit-economics model — and it is untouched there.
 *
 * Bars scale from their left edge, so no frame touches layout. Under reduced motion the layout
 * animation is suppressed: the marks appear at their true widths, which is the same finished
 * picture without the travel.
 */
export function MatrixMarks({
  data, statsLabel, idPrefix,
}: {
  data: MatrixDatum[];
  statsLabel?: string;
  idPrefix: string;
}) {
  const { reduce, spring } = useMotionPreset();
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);

  return (
    <div className="p-3 sm:p-5 bg-card/60 border-t border-line/30">
      <ol className="space-y-2">
        {data.map((d, i) => (
          <li key={`${d.name}-${i}`}>
            <div className="flex items-baseline justify-between gap-2 mb-1">
              {/* The shared element. Same layoutId as the row's leading cell, so it travels
                  between the two views instead of one fading out while the other fades in. */}
              <motion.span
                layoutId={reduce ? undefined : `${idPrefix}-label-${i}`}
                className="t-small font-semibold text-ink min-w-0 truncate"
              >
                {d.name}
              </motion.span>
              <span className="t-label font-black tabular-nums text-ink shrink-0">
                {d.formatted}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-line/40 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent-solid origin-left"
                style={{ width: `${(Math.abs(d.value) / max) * 100}%` }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ ...spring("gentle"), delay: reduce ? 0 : i * STAGGER.tight }}
              />
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-center t-micro font-semibold text-muted">
        {statsLabel || "Metrics"} — {data.length} rows, ranked as listed
      </p>
    </div>
  );
}
