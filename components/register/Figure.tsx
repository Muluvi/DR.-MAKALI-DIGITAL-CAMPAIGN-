import type { Cell, CellState, FigureSpec, SourceRef } from "../../lib/register/types";
import { group } from "../../lib/data/format";
import { Chart } from "./charts";

/**
 * The frame every figure in the register sits in (brief §E.8, §O). A server component: all of it
 * is in the HTML, so it works with JavaScript off and prints complete.
 *
 *   title      the finding, as a sentence
 *   question   one line: what the figure answers
 *   chart      the marks
 *   takeaway   one sentence beneath
 *   source     each source with a tier pill that differs by SHAPE (T1 solid, T2 outlined, T3
 *              dashed), and a hatched pill for modelled data, so it survives greyscale
 *   table      inside a native <details>: keyboard-reachable, no script, opened for print
 *   CSV        a real link to public/data/<id>.csv, written at build from the same rows
 */
export function RegisterFigure({ spec }: { spec: FigureSpec }) {
  const titleId = `${spec.id}-title`;
  const takeawayId = `${spec.id}-takeaway`;
  return (
    <figure id={spec.id} className="rf not-prose" role="figure" aria-labelledby={titleId} aria-describedby={takeawayId} data-figure={spec.id}>
      <div className="rf-head">
        <h4 id={titleId} className="rf-title">{spec.title}</h4>
        <p className="rf-question">{spec.question}</p>
      </div>
      <div className="rf-body">
        <Chart spec={spec} />
        {spec.notes?.map((n) => (
          <p key={n} className="rf-notes">{n}</p>
        ))}
      </div>
      <p id={takeawayId} className="rf-takeaway">{spec.takeaway}</p>
      <figcaption className="rf-foot">
        <p className="rf-source">
          <span>Source:</span>
          {spec.sources.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1.5">
              <TierPill source={s} />
              <span>{s.name}</span>
            </span>
          ))}
        </p>
        <details open className="rf-details print-open">
          <summary>View the data table</summary>
          <div className="rf-table-wrap" tabIndex={0} role="region" aria-label={`Data table: ${spec.title}`}>
            <DataTable spec={spec} />
          </div>
        </details>
        <a className="rf-csv" href={`/data/${spec.id}.csv`} download={`${spec.id}.csv`}>
          Download the data as CSV<span className="rf-csv-file">{spec.id}.csv</span>
        </a>
      </figcaption>
    </figure>
  );
}

const STATE_TEXT: Record<CellState, string> = {
  sourced: "",
  modelled: "Modelled",
  needed: "Data needed",
  target: "Target",
};

export function TierPill({ source }: { source: Pick<SourceRef, "tier" | "state"> }) {
  if (source.state === "needed") return <span className="tp tp-needed">Data needed</span>;
  if (source.state === "modelled") return <span className="tp tp-modelled">Modelled{source.tier ? ` · ${source.tier}` : ""}</span>;
  if (source.state === "target") return <span className="tp tp-target">Target</span>;
  if (!source.tier) return <span className="tp tp-needed">No tier</span>;
  return <span className={`tp tp-${source.tier}`}>{source.tier}</span>;
}

export function cellText(v: Cell, closesWith?: string): string {
  if (v === null) return `[DATA NEEDED — ${closesWith ?? "source"}]`;
  if (typeof v === "number") return group(v, Number.isInteger(v) ? 0 : 1);
  return v;
}

function DataTable({ spec }: { spec: FigureSpec }) {
  const hasState = spec.rows.some((r) => r.state && r.state !== "sourced");
  return (
    <table className="rf-table">
      <caption className="sr-only">{spec.question}</caption>
      <thead>
        <tr>
          {spec.columns.map((c) => (
            <th key={c.key} scope="col" className={c.numeric ? "num" : undefined}>{c.label}</th>
          ))}
          {hasState && <th scope="col">Basis</th>}
        </tr>
      </thead>
      <tbody>
        {spec.rows.map((r, i) => (
          <tr key={i}>
            {spec.columns.map((c, j) => {
              const text = cellText(c.key in r.cells ? r.cells[c.key] : "", r.closesWith);
              return j === 0 ? (
                <th key={c.key} scope="row">{text}</th>
              ) : (
                <td key={c.key} data-col={c.label} className={c.numeric ? "num" : undefined}>{text}</td>
              );
            })}
            {hasState && <td data-col="Basis">{STATE_TEXT[r.state ?? "sourced"] || "Sourced"}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
