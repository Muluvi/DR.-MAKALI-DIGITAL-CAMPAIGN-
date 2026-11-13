import type { ReactNode } from "react";

import { cellText } from "../register/Figure";
import type { FigureSpec } from "../../lib/register/types";
import { ProvPill } from "./ProvPill";
import { Reveal } from "./Reveal";

const STATE_TEXT = { sourced: "Sourced", modelled: "Modelled", needed: "Data needed", target: "Target" } as const;

/**
 * The figure frame, v2. The contract is unchanged (docs/rebuild/REPORT.md §4): title states the
 * finding, subtitle is the question, takeaway beneath, source with a shape-coded pill, the table
 * in a native <details> (open in the HTML, so it reads with scripts off and prints), and the CSV.
 *
 * What changes is hierarchy. `hero` is the one lead figure of a section: wide, larger title, and
 * a soft inner glow in the section colour. Everything else is `standard`. The table is drawn in
 * the G-6 system: a real table on wide screens, label-above-value card rows on phones.
 */
export function FigureV2({ spec, chart, variant = "standard" }: { spec: FigureSpec; chart: ReactNode; variant?: "hero" | "standard" }) {
  const titleId = `${spec.id}-v2-title`;
  const takeawayId = `${spec.id}-v2-takeaway`;
  const hasState = spec.rows.some((r) => r.state && r.state !== "sourced");
  return (
    <figure className={`pf-fig pf-fig--${variant}`} aria-labelledby={titleId} aria-describedby={takeawayId}>
      <header className="pf-fig__head">
        <p className="pf-fig__sec">Figure · §{spec.section}</p>
        <h3 id={titleId} className="pf-fig__title">{spec.title}</h3>
        <p className="pf-fig__question">{spec.question}</p>
      </header>

      <Reveal className="pf-fig__body">{chart}</Reveal>

      {spec.notes?.map((n) => (
        <p key={n} className="pf-fig__note">{n}</p>
      ))}

      <p id={takeawayId} className="pf-fig__takeaway">{spec.takeaway}</p>

      <figcaption className="pf-fig__foot">
        <ul className="pf-fig__sources" aria-label="Sources">
          {spec.sources.map((s) => (
            <li key={s.name}>
              <ProvPill p={{ tier: s.tier, state: s.state }} />
              <span>{s.name}</span>
            </li>
          ))}
        </ul>
        <details open className="pf-fig__details print-open">
          <summary>The data table</summary>
          <div className="pf-table-wrap" role="region" aria-label={`Data table: ${spec.title}`} tabIndex={0}>
            <table className="pf-table pf-table--cards">
              <caption className="sr-only">{spec.question}</caption>
              <thead>
                <tr>
                  {spec.columns.map((c) => (
                    <th key={c.key} scope="col" className={c.numeric ? "is-num" : undefined}>{c.label}</th>
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
                        <td key={c.key} data-label={c.label} className={c.numeric ? "is-num" : undefined}>{text}</td>
                      );
                    })}
                    {hasState && <td data-label="Basis">{STATE_TEXT[r.state ?? "sourced"]}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <a className="pf-fig__csv" href={`/data/${spec.id}.csv`} download={`${spec.id}.csv`}>
          Download the data as CSV <span className="pf-mono">{spec.id}.csv</span>
        </a>
      </figcaption>
    </figure>
  );
}
