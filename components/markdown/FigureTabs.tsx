"use client";

import { useState, type ReactNode } from "react";

import { useRovingTabs } from "../../hooks/use-device-showcase";
import type { Provenance } from "../../data/types";
import { FigureBlock } from "./FigureBlock";

export interface FigureView {
  id: string;
  /** What this view shows — "Results table", "Charted". Short enough to sit in a tab. */
  label: string;
  /** The provenance for this view specifically; shown in the footer while it is selected. */
  provenance?: Provenance | Provenance[];
  content: ReactNode;
}

/**
 * One figure, several views of it.
 *
 * Three headings in this document mounted two or three separate cards drawn from the same source
 * data, one after the other: §1.2.6 put a results table directly above a chart of the same
 * results, §1.2.7 did the same for the Auditor-General figures, and §1.2.3 stacked three cards
 * all reading the ward register. Each card repeated the heading, the framing sentence and the
 * provenance footer, so a reader scrolled past the same citation two or three times to see one
 * body of evidence.
 *
 * The views are a real tablist, using the same roving-tabindex hook as the device showcases:
 * arrow keys move between them, Home and End jump to the ends.
 *
 * Every view stays in the DOM ordering sense — only the selected one renders — so the figures
 * a reader does not open cost nothing, which matters most on the phone this document is written
 * for. The printed and screen-reader path is the first view, which is why the tabular one is
 * always first where a table exists.
 */
export function FigureTabs({
  title,
  subtitle,
  views,
  label,
}: {
  title: string;
  subtitle?: ReactNode;
  views: FigureView[];
  /** Names the tablist for assistive technology, e.g. "Views of the electoral record". */
  label: string;
}) {
  const [activeId, setActiveId] = useState(views[0].id);
  const ids = views.map((v) => v.id);
  const { onKeyDown, tabProps } = useRovingTabs(ids, activeId, setActiveId);
  const active = views.find((v) => v.id === activeId) ?? views[0];

  return (
    <FigureBlock title={title} subtitle={subtitle} provenance={active.provenance} footer={!!active.provenance}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex gap-1.5 flex-wrap mb-4"
      >
        {views.map((v) => (
          <button
            key={v.id}
            {...tabProps(v.id)}
            id={`figview-tab-${v.id}`}
            aria-controls={`figview-panel-${v.id}`}
            type="button"
            className={`min-h-[44px] shrink-0 rounded-full border px-3 py-1.5 t-micro font-bold transition-colors cursor-pointer fx-press fx-focus ${
              v.id === activeId
                ? "border-accent-solid bg-accent-solid text-on-accent"
                : "border-line bg-paper text-muted hover:text-ink"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div id={`figview-panel-${active.id}`} role="tabpanel" aria-labelledby={`figview-tab-${active.id}`}>
        {active.content}
      </div>
    </FigureBlock>
  );
}
