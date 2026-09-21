import type { FigureSeries } from "../../lib/figures/types";
import { KIND_LABEL, conflictsOf, isImprecise, sourcesOf, tierOf } from "../../lib/figures/types";
import { TIER_META } from "../../data/types";
import { UnderReview } from "./UnderReview";

/**
 * The frame every figure in this audit sits in, and the contract it enforces.
 *
 * A chart is a claim. This frame is what makes the claim checkable, and it is deliberately not
 * optional: a figure that cannot state its finding, its measure, its source and its date is a
 * figure this document should not be printing. Every requirement below comes from the audit's
 * Phase 7 gate, and each is structural rather than remembered:
 *
 *   THE HEADLINE STATES THE FINDING. Not "Registered voters by ward" but "Twelve of forty wards
 *   hold 37.8% of the register". A title that names the measure makes the reader do the work the
 *   figure exists to do for them, and on a phone most readers will not do it.
 *
 *   THE SOURCE, THE TIER AND THE DATE ARE VISIBLE. Not in a tooltip: this document's own Annex A
 *   commits to provenance on every figure, and a provenance a reader has to hover to find does
 *   not exist on a touchscreen at all.
 *
 *   THE DATA IS AVAILABLE. Every frame carries a "View the data" disclosure built from the same
 *   series the marks are drawn from, so the table cannot drift from the chart. This is what lets
 *   rule 1a retire an ASCII table: the numbers are still here, one tap away, and they are still
 *   in the printed page.
 *
 *   A DISPUTED FIGURE SAYS SO. Conflicts are read off the series rather than passed in, so a
 *   figure whose data carries C-9 cannot be rendered without the Under review flag.
 *
 *   A MODELLED FIGURE SAYS SO. If any point is modelled or illustrative the frame labels it, and
 *   the mark components draw it as a range or a band rather than a point.
 *
 * It is a SERVER COMPONENT. No state, no effects, no client bundle — and everything above is in
 * the HTML a reader with JavaScript off receives, which is the only version guaranteed to reach
 * a phone on a bad connection.
 */
export function FigureFrame({
  series,
  children,
  /** Overrides the generated table, for figures whose data is better shown another way. */
  data,
  className = "",
}: {
  series: FigureSeries;
  children: React.ReactNode;
  data?: React.ReactNode;
  className?: string;
}) {
  const conflicts = conflictsOf(series);
  const sources = sourcesOf(series);
  const tier = tierOf(series);
  const imprecise = isImprecise(series);

  // The dates the points carry, newest last. A figure drawing 2019 census rates beside 2023/24
  // survey rates must say both — C-13 is exactly that argument.
  const dates = [...new Set(series.points.map((p) => p.asOf))].sort();

  return (
    <figure
      className={`not-prose my-6 rounded-2xl border border-line bg-card overflow-hidden ${className}`}
      // The summary a screen reader hears before the marks, and the one a reader gets if the SVG
      // fails to paint. It is the headline, because the headline is the finding.
      role="group"
      aria-label={series.headline}
    >
      <figcaption className="px-4 pt-4 sm:px-5 sm:pt-5">
        <h4 className="font-serif t-small sm:t-body font-bold leading-snug text-ink text-balance">
          {series.headline}
        </h4>
        <p className="t-micro mt-1 leading-snug text-muted">{series.measure}</p>
      </figcaption>

      {conflicts.length > 0 && (
        <div className="px-4 pt-3 sm:px-5">
          <UnderReview ids={conflicts}>
            {series.note ??
              "The document states this figure more than one way. Both readings are shown; neither has been changed."}
          </UnderReview>
        </div>
      )}

      <div className="px-4 py-4 sm:px-5">{children}</div>

      <div className="border-t border-line/60 bg-paper/40 px-4 py-3 sm:px-5">
        <p className="t-micro leading-snug text-muted">
          <span className="font-semibold text-ink">
            {TIER_META[tier].short} · {TIER_META[tier].label}
          </span>
          {" — "}
          {sources.map((s) => s.name).join("; ")}
          {dates.length > 0 && <> · {dates.join(" and ")}</>}
          {imprecise && (
            <>
              {" · "}
              <strong className="font-semibold text-gold">
                {KIND_LABEL[series.points.find((p) => p.kind === "modelled" || p.kind === "illustrative")!.kind]}
              </strong>
              {" — drawn as a range, not a measurement"}
            </>
          )}
        </p>

        {series.note && conflicts.length === 0 && (
          <p className="t-micro mt-1.5 leading-snug text-muted">{series.note}</p>
        )}

        {/* SHIPS OPEN, closed by PrintSafeDisclosures once a script is there to reopen it.
            This carried `print:open` before, which styles nothing — `open` is an attribute, not a
            CSS property — and the table did not print. Rendering /reach to PDF gave 21 pages with
            these shut and 24 with them open: three pages of figure data missing from the printed
            proposal, which is the retired ASCII blocks' numbers leaving the document. */}
        <details open className="print-open mt-2 group">
          <summary className="t-micro cursor-pointer font-semibold text-accent marker:text-accent">
            View the data
          </summary>
          <div className="fx-focus mt-2 overflow-x-auto" tabIndex={0} role="group" aria-label="Figure data table, scrollable">
            {data ?? <SeriesTable series={series} />}
          </div>
        </details>
      </div>
    </figure>
  );
}

/**
 * The figure's own numbers, generated from the series that drew it.
 *
 * Generated rather than written out, so the table and the marks cannot disagree — the failure
 * mode this audit found four times over, where a chart, a card stack and a summary table each
 * carried their own copy of the same figures and two of them were stale.
 */
export function SeriesTable({ series }: { series: FigureSeries }) {
  const anyRange = series.points.some((p) => p.range);
  const anyNote = series.points.some((p) => p.note);

  return (
    <table className="w-full t-micro">
      <caption className="sr-only">{series.measure}</caption>
      <thead>
        <tr className="border-b border-line/60 text-left text-muted">
          <th scope="col" className="py-1.5 pr-3 font-semibold">Item</th>
          <th scope="col" className="py-1.5 pr-3 text-right font-semibold">Value</th>
          {anyRange && <th scope="col" className="py-1.5 pr-3 text-right font-semibold">Range</th>}
          <th scope="col" className="py-1.5 pr-3 font-semibold">Basis</th>
          {anyNote && <th scope="col" className="py-1.5 font-semibold">Note</th>}
        </tr>
      </thead>
      <tbody>
        {series.points.map((p) => (
          <tr key={p.label} className="border-b border-line/30 align-top last:border-0">
            <th scope="row" className="py-1.5 pr-3 text-left font-medium text-ink">{p.label}</th>
            <td className="py-1.5 pr-3 text-right tabular-nums text-ink">
              {typeof p.value === "number" ? p.value.toLocaleString("en-KE") : p.value}
              {p.unit && p.unit !== "%" ? ` ${p.unit}` : p.unit}
            </td>
            {anyRange && (
              <td className="py-1.5 pr-3 text-right tabular-nums text-muted">
                {p.range ? `${p.range.low.toLocaleString("en-KE")}–${p.range.high.toLocaleString("en-KE")}` : "—"}
              </td>
            )}
            <td className="py-1.5 pr-3 text-muted">
              {TIER_META[p.tier].short} · {KIND_LABEL[p.kind]} · {p.asOf}
            </td>
            {anyNote && <td className="py-1.5 text-muted">{p.note ?? ""}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
