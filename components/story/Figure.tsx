import type { Cell, FigureSpec } from "@/lib/register/types";
import { group } from "@/lib/data/format";
import { Chart } from "./charts";

/**
 * One figure from the figure register (lib/register/specs): the finding as a title, the chart,
 * one sentence under it, and one plain source line. The data table, the notes and a CSV download
 * sit in a native <details>, so they work by keyboard and with JavaScript off.
 */
function cellText(v: Cell): string {
  if (v === null) return "—";
  if (typeof v === "number") return group(v, Number.isInteger(v) ? 0 : 1);
  return v;
}

/** Columns that only grade a figure's reliability: figures are shown plainly, so these never print. */
const GRADE = /^(tier|state|basis|reliability|confidence)$/;

export function RegisterFigure({ spec: raw }: { spec: FigureSpec }) {
  const spec = { ...raw, columns: raw.columns.filter((c) => !GRADE.test(c.key)) };
  const titleId = `${spec.id}-title`;
  const sources = [...new Set(spec.sources.map((s) => s.name))];
  return (
    <figure id={spec.id} className="rf" aria-labelledby={titleId}>
      <p id={titleId} className="rf-title">{spec.title}</p>
      <p className="rf-takeaway">{spec.takeaway}</p>
      <div className="rf-body">
        <Chart spec={spec} />
      </div>
      <p className="source">Source: {sources.join("; ")}</p>
      <details className="v-more">
        <summary>Data table{spec.notes?.length ? " and notes" : ""}</summary>
        <p className="rf-question">{spec.question}</p>
        {spec.notes?.map((n) => <p key={n} className="rf-note">{n}</p>)}
        <div className="table-wrap" tabIndex={0} role="region" aria-label={`Data table: ${spec.title}`}>
          <table>
            <caption className="sr-only">{spec.question}</caption>
            <thead>
              <tr>{spec.columns.map((c) => <th key={c.key} scope="col" className={c.numeric ? "num" : undefined}>{c.label}</th>)}</tr>
            </thead>
            <tbody>
              {spec.rows.map((r, i) => (
                <tr key={i}>
                  {spec.columns.map((c, j) => {
                    const text = cellText(c.key in r.cells ? r.cells[c.key] : "");
                    return j === 0 ? <th key={c.key} scope="row">{text}</th> : <td key={c.key} className={c.numeric ? "num" : undefined}>{text}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <a className="rf-csv" href={`/csv/${spec.id}.csv`} download={`${spec.id}.csv`}>Download as CSV</a>
      </details>
    </figure>
  );
}
