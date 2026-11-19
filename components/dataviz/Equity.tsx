/** Shillings in millions, to two places: one line in a narrow column. */
const ksm = (n: number) => `KSh ${(n / 1e6).toFixed(2)}m`;
import { resolveFigure } from "../../lib/card/spec";
import { TOOL_WARDS } from "../../lib/tools/dataset";
import { ExportableVisual } from "../visual/ExportableVisual";
import { HeatTable, type HeatRow } from "./HeatTable";

/**
 * Ward equity, two ways (visual upgrade, C22 and C23).
 *
 * The measure is the county's own itemised projects: the summed printed cost of the scorecard
 * projects whose place resolves to one ward, per 1,000 registered voters. It covers the 401
 * itemised projects only, not the county budget, and the source line says so wherever it is shown.
 */
const SCORECARD = "County Government of Kitui, Delivering the Kitui Promise: three-year scorecard, itemised projects placed on one ward (401 of the projects it lists)";

export function equityRows() {
  return TOOL_WARDS.map((w) => ({ ...w, per1k: w.voters ? (w.projectsKsh / w.voters) * 1000 : 0 }));
}

/** C22: every ward against the county average, each stem from zero. */
export function EquityLollipop() {
  const rows = equityRows().sort((a, b) => b.per1k - a.per1k);
  const totalKsh = rows.reduce((n, r) => n + r.projectsKsh, 0);
  const totalVoters = rows.reduce((n, r) => n + r.voters, 0);
  const avg = (totalKsh / totalVoters) * 1000;
  const max = rows[0].per1k;
  const below = rows.filter((r) => r.per1k < avg).length;
  const register = resolveFigure({ id: "register.2022", label: "registered voters" });
  return (
    <ExportableVisual
      id="equity-lollipop"
      title={`${below} of the 40 wards sit below the county average for project spend per 1,000 voters`}
      note={`The printed value of county projects for every 1,000 registered voters. The line is the county average, ${ksm(avg)}. Every stem starts at zero.`}
      figures={[register]}
      source={`Source: ${SCORECARD}; registered voters from the IEBC 2022 register (Tier 1). Spend per 1,000 voters calculated by the site.`}
      card={{ type: "ranked", params: { measure: "per1k" } }}
    >
      <div className="lp" style={{ "--avg": `${(avg / max) * 100}%` } as React.CSSProperties}>
        <p className="lp__key"><i aria-hidden="true" /> county average <b aria-hidden="true" /> below it</p>
        <ol className="lp__rows">
          {rows.map((r, i) => (
            <li key={r.id} className="lp__row" data-below={r.per1k < avg ? "true" : "false"} data-pool={r.pool ? "true" : "false"}>
              <span className="lp__name">{r.name}</span>
              <span className="lp__track" aria-hidden="true">
                <span className="lp__stem xv-grow-x" style={{ width: `${(r.per1k / max) * 100}%`, "--i": Math.min(i, 20) } as React.CSSProperties}>
                  <span className="lp__dot" />
                </span>
              </span>
              <span className="lp__v">{ksm(r.per1k)}</span>
            </li>
          ))}
        </ol>
      </div>
    </ExportableVisual>
  );
}

/** C23: the 40 wards against six measures at once, each column shaded by its own fifths. */
export function EquityHeatTable() {
  const rows: HeatRow[] = equityRows().map((r) => ({
    id: r.id,
    name: r.name,
    constituency: r.constituencyName,
    pool: r.pool,
    values: {
      voters: r.voters,
      stations: r.stations,
      perStation: r.stations ? r.voters / r.stations : 0,
      density: r.areaSqKm ? r.population / r.areaSqKm : 0,
      projects: r.projects,
      per1k: r.per1k,
    },
  }));
  return (
    <ExportableVisual
      id="ward-heat-table"
      title="The 40 wards on one screen: where voters crowd, and where county projects are thin"
      note="Each column is shaded by its own fifths, lightest to darkest. Tap a column to sort by it."
      source={`Source: IEBC 2022 register and polling-station list (Tier 1); KNBS 2019 census population and ward area from the IEBC public pack; ${SCORECARD}. Ratios calculated by the site.`}
      card={{ type: "map", params: { layer: "per1k" } }}
    >
      <HeatTable rows={rows} />
    </ExportableVisual>
  );
}
