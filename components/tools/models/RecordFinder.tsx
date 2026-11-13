"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { findRecords, sectorsOf, totalKsh, type FinderInputs } from "@/lib/models/record-finder";
import { FINDER_WARDS, PROJECTS, SCORECARD_SOURCE } from "@/lib/models/data";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { parseRecord } from "@/lib/models/instruct/parse";
import { explainRecord } from "@/lib/models/instruct/explain";
import { ToolShell, fmt } from "../ToolShell";
import { ToolActions } from "../ToolActions";
import { InstructionBox } from "./InstructionBox";

const kes = (v: number) => `KES ${fmt(Math.round(v))}`;
const PLACED = { ward: "This ward", shared: "Named with other places", constituency: "Constituency level" } as const;
const SECTORS = sectorsOf(PROJECTS);

function Model() {
  const first = FINDER_WARDS[0];
  const [v, setV] = useState<FinderInputs>({ ward: first.slug, constituency: first.constituency, sector: "all", status: "all", includeConstituency: false });
  const shown = useDeferredValue(v);
  const found = useMemo(() => findRecords(PROJECTS, shown), [shown]);
  const ward = FINDER_WARDS.find((w) => w.slug === v.ward)!;
  const instruct = (text: string) => {
    const r = parseRecord(text, v, FINDER_WARDS, SECTORS);
    setV(r.next);
    return r;
  };
  return (
    <div className="grid gap-4">
      <div className="panel grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="field">Ward
          <select className="input" value={v.ward} onChange={(e) => { const w = FINDER_WARDS.find((x) => x.slug === e.target.value)!; setV({ ...v, ward: w.slug, constituency: w.constituency }); }}>
            {FINDER_WARDS.map((w) => <option key={w.slug} value={w.slug}>{w.name} ({w.constituency})</option>)}
          </select>
        </label>
        <label className="field">Sector
          <select className="input" value={v.sector} onChange={(e) => setV({ ...v, sector: e.target.value })}><option value="all">All sectors</option>{SECTORS.map((s) => <option key={s}>{s}</option>)}</select>
        </label>
        <label className="field">Status the county prints
          <select className="input" value={v.status} onChange={(e) => setV({ ...v, status: e.target.value as FinderInputs["status"] })}><option value="all">Any status</option><option value="complete">Complete</option><option value="other">Not complete, or not stated</option></select>
        </label>
        <label className="check self-end"><input type="checkbox" checked={v.includeConstituency} onChange={(e) => setV({ ...v, includeConstituency: e.target.checked })} />Add {ward.constituency}&rsquo;s constituency-level projects</label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0" role="status"><strong>{found.length}</strong> project{found.length === 1 ? "" : "s"} for {ward.name}, printed at {kes(totalKsh(found))} in all.</p>
        <ToolActions filename={`kitui-record-${v.ward}.csv`} rows={() => [["project", "sector", "placed", "status_printed", "kes_printed", "scorecard_page"], ...found.map((f) => [f.project.label, f.project.dims.sector, PLACED[f.placed], f.project.dims.status, Math.round(f.project.value), f.project.dims.page])]} />
      </div>
      <InstructionBox onRun={instruct} explanation={explainRecord(found, ward.name)} examples={EXAMPLES["record-finder"]} />
      {found.length === 0 ? (
        <p className="muted m-0">The scorecard places nothing here with these filters.</p>
      ) : (
        <ul className="grid gap-2 p-0 sm:grid-cols-2" style={{ listStyle: "none", maxHeight: "36rem", overflow: "auto" }}>
          {found.map((f) => (
            <li key={f.project.dims.id} className="panel small">
              <p className="m-0 font-bold">{f.project.label}</p>
              <p className="m-0 mt-1 muted">{f.project.dims.sector} · {f.project.dims.status} · {kes(f.project.value)}</p>
              <p className="m-0 mt-1 muted">{PLACED[f.placed]}. Cite: {SCORECARD_SOURCE}, p. {f.project.dims.page}.</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RecordFinder() {
  return (
    <ToolShell kicker="Tool" title="Record finder" question="Which county projects can a speaker cite in this ward? Pick a ward, a sector and a status." source="Source: County Government of Kitui, Delivering the Kitui Promise scorecard (401 itemised projects)">
      <Model />
    </ToolShell>
  );
}
