"use client";

import type { Mark } from "./types";

/**
 * The detail panel behind a data point.
 *
 * This is F-17, and it is deliberately not a tooltip. A cursor-following tooltip has no touch
 * equivalent and moves the thing the reader is trying to read; this panel sits in a fixed place
 * beneath its chart, so the detail always appears where the reader last saw it.
 *
 * It is bound to click AND focus by every chart that uses it, so a keyboard reaches it.
 *
 * The baseline matters as much as the panel: every chart that renders this also renders the same
 * content as a plain list beneath, so nothing is locked behind a gesture on a device that cannot
 * make it. The list is what a reader with JavaScript disabled gets, and it is what the browser's
 * in-page find searches.
 */
export function InspectPanel({ mark, empty }: { mark: Mark | null; empty?: string }) {
  return (
    <div
      className="mt-3 min-h-[3.25rem] rounded-xl border border-line bg-card px-3 py-2"
      aria-live="polite"
    >
      {mark ? (
        <>
          <p className="t-label font-extrabold text-ink">{mark.label}</p>
          <p className="t-label font-bold text-accent">
            {mark.display ?? mark.value.toLocaleString()}
            {mark.sub ? <span className="text-muted font-semibold"> · {mark.sub}</span> : null}
          </p>
          {mark.note ? (
            <p className="t-micro text-muted font-semibold mt-1 leading-snug">{mark.note}</p>
          ) : null}
        </>
      ) : (
        <p className="t-micro text-muted font-semibold">
          {empty ?? "Select a bar for the detail behind it."}
        </p>
      )}
    </div>
  );
}

/**
 * The accessible equivalent of a chart: every mark as a labelled list.
 *
 * Rendered by every chart, always, and never hidden from assistive technology — a reader on a
 * feature phone, with JS off, or using a screen reader gets the same figures the chart plots.
 */
export function MarkList({ marks, caption }: { marks: Mark[]; caption?: string }) {
  return (
    <details className="mt-2 group">
      <summary className="t-micro font-bold text-muted cursor-pointer marker:text-accent">
        {caption ?? `All ${marks.length} figures, as a list`}
      </summary>
      <dl className="mt-2 grid gap-1">
        {marks.map((m) => (
          <div key={m.id} className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-1">
            <dt className="t-micro font-bold text-ink">{m.label}</dt>
            <dd className="t-micro font-semibold text-muted tabular-nums shrink-0">
              {m.display ?? m.value.toLocaleString()}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
