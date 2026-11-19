import { figure, fmt } from "../../lib/data/read";
import { resolveFigure } from "../../lib/card/spec";
import { TOOL_WARDS } from "../../lib/tools/dataset";
import { ExportableVisual } from "../visual/ExportableVisual";
import { WardLocator } from "./Locator";

/**
 * The 40 wards as a league table (visual upgrade, C1): position, ward, registered voters, and the
 * gap to the ward above. Every count is the registry's own ward figure (`ward.<slug>`, IEBC 2022).
 *
 * No up or down arrows: a movement needs a second year of ward registers, and none is published
 * (the July 2026 total is county-wide only). The table says where each ward stands, not where it is
 * going. Pool wards, where he has never held office, carry a mark.
 *
 * The first twelve show; the other twenty-eight are one tap away, in the HTML for find-in-page,
 * print and a reader without script.
 */
const SHOWN = 12;

export function WardLeague() {
  const rows = TOOL_WARDS.map((w) => ({ ...w, voters: figure(`ward.${w.id}`).value ?? 0 }))
    .sort((a, b) => b.voters - a.voters)
    .map((w, i, all) => ({ ...w, pos: i + 1, gap: i === 0 ? null : all[i - 1].voters - w.voters }));
  const max = rows[0].voters;
  const top = rows.slice(0, SHOWN);
  const rest = rows.slice(SHOWN);
  const topShare = resolveFigure({ id: "pareto.top12.share", label: "of the register in the twelve largest wards" });
  const register = resolveFigure({ id: "register.2022", label: "registered voters, 2022" });
  const wardFig = resolveFigure({ id: `ward.${rows[0].id}`, label: rows[0].name });

  const Row = ({ r }: { r: (typeof rows)[number] }) => (
    <li className="lg__row xv-rise" style={{ "--i": Math.min(r.pos - 1, 12) } as React.CSSProperties} data-pool={r.pool ? "true" : "false"}>
      <span className="lg__pos">{r.pos}</span>
      <span className="lg__name">
        <span className="lg__ward">{r.name}</span>
        <span className="lg__con">
          {r.constituencyName}
          {r.pool ? <span className="lg__pool"> · never held office</span> : null}
        </span>
      </span>
      <span className="lg__bar" aria-hidden="true">
        <span className="lg__fill xv-grow-x" style={{ width: `${(r.voters / max) * 100}%`, "--i": Math.min(r.pos - 1, 12) } as React.CSSProperties} />
      </span>
      <span className="lg__v">{fmt(`ward.${r.id}`)}</span>
      <span className="lg__gap">{r.gap === null ? "" : `−${r.gap.toLocaleString("en-KE")}`}</span>
    </li>
  );

  return (
    <ExportableVisual
      id="ward-league"
      title={`The league table: twelve wards hold ${topShare.display} of the register`}
      note="The 40 wards ranked by registered voters, with the gap to the ward above. A mark shows the wards where he has never held office."
      figures={[register, wardFig, topShare]}
      card={{ type: "ranked", params: { measure: "voters" } }}
    >
      <div className="lg__head">
        <WardLocator wards={top.map((r) => r.id)} label="Map of Kitui: the twelve largest wards highlighted" size={112} />
        <p className="lg__legend">
          <span className="lg__key lg__key--pool" aria-hidden="true" /> never held office · the bar runs from zero to the largest ward
        </p>
      </div>
      <div className="lg__cols" aria-hidden="true">
        <span>#</span><span>Ward</span><span /><span>Voters</span><span>Gap</span>
      </div>
      <ol className="lg">
        {top.map((r) => <Row key={r.id} r={r} />)}
      </ol>
      <details className="lg__more">
        <summary>Show the other {rest.length} wards</summary>
        <ol className="lg" start={SHOWN + 1}>
          {rest.map((r) => <Row key={r.id} r={r} />)}
        </ol>
      </details>
    </ExportableVisual>
  );
}
