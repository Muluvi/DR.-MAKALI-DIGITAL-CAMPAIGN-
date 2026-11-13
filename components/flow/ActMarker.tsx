"use client";

import { useInView } from "../../hooks/use-in-view";
import type { FlowAct } from "../../lib/flow";

/**
 * The seam between two movements of the scroll.
 *
 * A continuous document needs punctuation or it reads as one undifferentiated fall. There are
 * seven of these in 55,000 words — few enough that each one lands, and they are the only
 * full-bleed elements in the reading column, so they are unmistakably structural rather than
 * decorative.
 *
 * Deliberately almost nothing: a roman numeral, a name, a line that draws itself across the
 * viewport as the marker arrives. No panel, no image, no gradient wash. It is a breath.
 */
export function ActMarker({ act, index, total }: { act: FlowAct; index: number; total: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.4, margin: "-10% 0px" });
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][index] ?? String(index + 1);

  return (
    <div
      ref={ref}
      data-in-view={inView ? "true" : "false"}
      className="flow-act print:break-before-page"
      aria-hidden="true"
    >
      <span className="flow-act__rule" />
      <span className="flow-act__numeral">{roman}</span>
      <span className="flow-act__text">
        <span className="flow-act__label">{act.label}</span>
        <span className="flow-act__blurb">{act.blurb}</span>
      </span>
      <span className="flow-act__count">
        {index + 1}<i>/</i>{total}
      </span>
    </div>
  );
}
