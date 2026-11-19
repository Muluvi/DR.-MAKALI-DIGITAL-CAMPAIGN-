import { figure } from "../../lib/data/read";
import { group } from "../../lib/data/format";
import { provenanceOf, resolveFigure } from "../../lib/card/spec";
import { ExportableVisual } from "../visual/ExportableVisual";

/**
 * County money per resident, as a till receipt (visual upgrade, C3). A generic paper receipt: no
 * shop, no brand, no till number.
 *
 * Every line is a registry figure divided by the 2019 census population, so every line is
 * calculated and says so; the tier beside each is the tier of the figure it was divided from. The
 * envelope is Tier 3 (cited through secondary reporting of the Fiscal Strategy Paper), and the
 * total line keeps that label. The published total does not equal the sum of its parts by a small
 * rounding amount, which the receipt prints as its own line rather than hiding.
 */
const LINES = [
  { id: "budget.equitable", label: "Equitable share from the national government" },
  { id: "budget.osr", label: "Own-source revenue collected in Kitui" },
  { id: "budget.grants", label: "Grants" },
  { id: "budget.rounding", label: "Rounding in the published total" },
] as const;

export function CountyReceipt() {
  const pop = figure("census.population").value ?? 1;
  const per = (id: string) => (figure(id).value ?? 0) / pop;
  const shs = (n: number) => `${n < 0 ? "−" : ""}KSh ${group(Math.abs(n))}`;
  const total = resolveFigure({ id: "budget.total", label: "Budget envelope, FY2026/27", mod: "bn", prefix: "KSh ", suffix: "bn" });
  const popFig = resolveFigure({ id: "census.population", label: "residents, 2019 census" });
  const parts = LINES.map((l) => resolveFigure({ id: l.id, label: l.label }));
  return (
    <ExportableVisual
      id="county-receipt"
      title={`The county's budget comes to ${shs(per("budget.total"))} for every resident`}
      note={`The FY2026/27 envelope of ${total.display}, divided by ${popFig.display} residents.`}
      figures={[total, ...parts, popFig]}
      card={{ type: "receipt" }}
    >
      <div className="rc" role="table" aria-label="County budget per resident, itemised">
        <p className="rc__head" aria-hidden="true">
          <span>KITUI COUNTY</span>
          <span>Budget, FY2026/27</span>
          <span>per resident</span>
        </p>
        <div role="rowgroup">
          {LINES.map((l, i) => (
            <div key={l.id} role="row" className="rc__line xv-rise" style={{ "--i": i } as React.CSSProperties}>
              <span role="cell" className="rc__item">
                {l.label}
                <span className="rc__tier">{provenanceOf(figure(l.id))}</span>
              </span>
              <span role="cell" className="rc__amt">{shs(per(l.id))}</span>
            </div>
          ))}
        </div>
        <div role="row" className="rc__total">
          <span role="cell">TOTAL PER RESIDENT <span className="rc__tier">{provenanceOf(figure("budget.total"))}</span></span>
          <span role="cell" className="rc__amt">{shs(per("budget.total"))}</span>
        </div>
        <p className="rc__foot">
          Every line is calculated: the figure ÷ {popFig.display} residents. Lines are rounded to the shilling.
        </p>
      </div>
    </ExportableVisual>
  );
}
