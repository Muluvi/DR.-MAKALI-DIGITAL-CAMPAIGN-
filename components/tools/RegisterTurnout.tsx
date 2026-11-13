"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { PUBLIC_CONSTITUENCIES, PUBLIC_SOURCES } from "@/lib/public-data";
import { val } from "@/lib/data/read";
import { Compare, ToolShell, fmt } from "./ToolShell";

/**
 * The register chart with a turnout input: ballots by constituency at the 2022 turnout and at the
 * turnout you set, and the share of ballots the benchmark then needs.
 */
function Chart() {
  const actual = val("turnout.2022");
  const benchmark = val("benchmark");
  const [turnout, setTurnout] = useState(actual);
  const t = useDeferredValue(turnout);
  const rows = useMemo(() => [...PUBLIC_CONSTITUENCIES].sort((a, b) => b.voters - a.voters).map((c) => ({ c, base: (c.voters * actual) / 100, scen: (c.voters * t) / 100 })), [actual, t]);
  const baseTotal = rows.reduce((a, r) => a + r.base, 0);
  const scenTotal = rows.reduce((a, r) => a + r.scen, 0);
  const max = Math.max(...rows.map((r) => Math.max(r.base, r.scen)));
  const need = (100 * benchmark) / scenTotal;
  return (
    <div className="grid gap-4">
      <label className="field panel">
        <span className="range-head">County turnout <output>{fmt(turnout, 1)}%</output></span>
        <input type="range" min="40" max="90" step="0.5" value={turnout} onChange={(e) => setTurnout(Number(e.target.value))} aria-label="County turnout" />
        <span className="hint">2022 certified turnout: {fmt(actual, 1)}%</span>
      </label>
      <Compare baseLabel={`2022 turnout`} base={Math.round(baseTotal)} scenario={Math.round(scenTotal)} format={(v) => fmt(v)} unit=" ballots" />
      <div className="result" role="status">
        <p>At {fmt(turnout, 1)}% turnout, the benchmark of {fmt(benchmark)} votes needs <strong>{need > 100 ? "more than every ballot cast" : `${fmt(need, 1)}% of the ballots`}</strong>{turnout !== actual ? `, against ${fmt((100 * benchmark) / baseTotal, 1)}% at the 2022 turnout` : ""}.</p>
      </div>
      <figure className="m-0" aria-label="Ballots by constituency, 2022 turnout and your turnout">
        <ul className="v-bars">
          {rows.map((r) => (
            <li key={r.c.code}>
              <span className="v-bars-label">{r.c.name}</span>
              <span className="v-bars-value">{fmt(Math.round(r.scen))}</span>
              <span className="bar is-base" style={{ gridColumn: "1 / -1" }} aria-hidden="true"><span style={{ width: `${(100 * r.base) / max}%` }} /></span>
              <span className="bar" style={{ gridColumn: "1 / -1" }} aria-hidden="true"><span style={{ width: `${(100 * r.scen) / max}%` }} /></span>
            </li>
          ))}
        </ul>
        <p className="source">Grey: ballots at the 2022 turnout. Blue: ballots at the turnout you set. Figures are the 2022 register times turnout.</p>
      </figure>
    </div>
  );
}

export default function RegisterTurnout() {
  return (
    <ToolShell kicker="Dashboard" title="Ballots by constituency, by turnout" question="How many ballots each constituency casts at a given turnout, and what share of them the benchmark needs." source={`Source: ${PUBLIC_SOURCES.wards.label}; 2022 turnout from IEBC Form 37C`}>
      <Chart />
    </ToolShell>
  );
}
