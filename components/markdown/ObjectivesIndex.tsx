"use client";

import React from "react";
import { Target } from "lucide-react";

import { useSectionIndex } from "./SectionNumberMap";

/**
 * Every measurement surface in the document, in one place, at the top of the measurement framework.
 *
 * The proposal's headline indicators are the headline scorecards section and the indicator framework, anchored to the vote threshold section, and its objectives are the strategic-objectives section. But eight further KPI
 * blocks stay with the work they measure — earned media, accessibility, the offline layer,
 * volunteers, coalitions, analytics benchmarks, the message lab, the tracker — because a target
 * is only readable beside the thing it is a target for.
 *
 * Moving them here would break that. Not naming them leaves a reader who has just been shown the
 * scorecards unable to see how much else is measured. So this indexes them instead: derived from
 * the generated section index by matching the headings the author already wrote, so it cannot
 * drift, and it needs no maintenance when a section moves again.
 */
const KPI_HEADING = /\bKPIs?\b|^Key metrics/i;

export function ObjectivesIndex() {
  const sections = useSectionIndex();
  // the indicator framework, anchored to the vote threshold section, the indicator framework, sits in this section itself — an index of what is elsewhere
  // should not list the thing sitting three headings above it.
  const items = React.useMemo(
    () => sections.filter((s) => s.tabId !== "measurement" && KPI_HEADING.test(s.title)),
    [sections]
  );

  if (!items.length) return null;

  return (
    <aside className="not-prose my-8 rounded-2xl border border-line/60 bg-card/60 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Target size={15} className="text-accent shrink-0" aria-hidden />
        <h3 className="t-label font-extrabold text-muted">
          The rest of what is measured
        </h3>
      </div>
      <p className="t-label sm:t-small text-muted leading-relaxed mb-4 text-pretty">
        The scorecards above are the campaign&rsquo;s headline targets. {items.length} further
        indicator sets sit with the work they measure, rather than being collected here — each one
        is a tap away.
      </p>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                if (window.__navigateToSection) {
                  e.preventDefault();
                  window.__navigateToSection(item.id);
                }
              }}
              className="flex min-h-[44px] min-w-[44px] justify-center items-baseline gap-2 rounded-lg px-2 py-2.5 -mx-2 hover:bg-accent/[0.06] transition-colors"
            >
              <span className="t-label sm:t-small font-semibold text-ink leading-snug">
                {item.title}
              </span>
              <span className="t-micro text-muted ml-auto shrink-0 hidden sm:inline">
                {item.tabLabel}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
