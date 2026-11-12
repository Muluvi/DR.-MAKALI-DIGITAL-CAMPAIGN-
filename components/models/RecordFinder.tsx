"use client";

import { useEffect, useMemo, useState } from "react";
import { findRecords, sectorsOf, totalKsh, type FinderInputs, type Project } from "@/lib/models/record-finder";
import { ToolActions } from "@/components/tools/public/ToolActions";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { InstructionBox } from "./InstructionBox";
import { parseRecord } from "@/lib/models/instruct/parse";
import { explainRecord } from "@/lib/models/instruct/explain";

type WardOption = { slug: string; name: string; constituency: string };
const ksh = (v: number) => `KSh ${Math.round(v).toLocaleString("en-KE")}`;
const PLACED = { ward: "This ward", shared: "Named with other places", constituency: "Constituency level" } as const;

export function RecordFinder({ projects, wards, source, initial, embedded = false }: { projects: Project[]; wards: WardOption[]; source: string; initial: Record<string, string | undefined>; embedded?: boolean }) {
  const sectors = useMemo(() => sectorsOf(projects), [projects]);
  const [v, setV] = useState<FinderInputs>(() => {
    const w = wards.find((x) => x.slug === initial.ward) ?? wards[0];
    return {
      ward: w.slug,
      constituency: w.constituency,
      sector: sectors.includes(initial.sector ?? "") ? initial.sector! : "all",
      status: initial.status === "complete" || initial.status === "other" ? initial.status : "all",
      includeConstituency: initial.wide === "1",
    };
  });
  useEffect(() => {
    if (embedded) return;
    const p = new URLSearchParams({ ward: v.ward, sector: v.sector, status: v.status, wide: v.includeConstituency ? "1" : "0" });
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [v, embedded]);

  const found = useMemo(() => findRecords(projects, v), [projects, v]);
  const ward = wards.find((w) => w.slug === v.ward)!;

  const instruct = (text: string) => {
    const r = parseRecord(text, v, wards, sectors);
    setV(r.next);
    return r;
  };
  return (
    <div>
      <InstructionBox onRun={instruct} explanation={explainRecord(found, ward.name)} model="record-finder" examples={EXAMPLES["record-finder"]} />
      <div className="plat-card grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <label className="plat-label">Ward
          <select className="plat-input mt-1" value={v.ward} onChange={(e) => { const w = wards.find((x) => x.slug === e.target.value)!; setV({ ...v, ward: w.slug, constituency: w.constituency }); }}>
            {wards.map((w) => <option key={w.slug} value={w.slug}>{w.name} ({w.constituency})</option>)}
          </select>
        </label>
        <label className="plat-label">Sector
          <select className="plat-input mt-1" value={v.sector} onChange={(e) => setV({ ...v, sector: e.target.value })}>
            <option value="all">All sectors</option>{sectors.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="plat-label">Status the county prints
          <select className="plat-input mt-1" value={v.status} onChange={(e) => setV({ ...v, status: e.target.value as FinderInputs["status"] })}>
            <option value="all">Any status</option><option value="complete">Complete</option><option value="other">Not complete, or not stated</option>
          </select>
        </label>
        <label className="flex items-center gap-2 self-end pb-3 text-[0.9rem] text-ink"><input type="checkbox" checked={v.includeConstituency} onChange={(e) => setV({ ...v, includeConstituency: e.target.checked })} />Add {ward.constituency}&apos;s constituency-level projects</label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink" role="status"><strong>{found.length}</strong> project{found.length === 1 ? "" : "s"} for {ward.name}, printed at {ksh(totalKsh(found))} in all.</p>
        <ToolActions link={!embedded} filename={`kitui-record-${v.ward}.csv`} rows={() => [["project", "sector", "placed", "status_printed", "ksh_printed", "scorecard_page"], ...found.map((f) => [f.project.label, f.project.dims.sector, PLACED[f.placed], f.project.dims.status, Math.round(f.project.value), f.project.dims.page])]} />
      </div>
      {found.length === 0 ? (
        <p className="plat-hint mt-3">The scorecard places nothing here with these filters.</p>
      ) : (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {found.map((f) => (
            <li key={f.project.dims.id} className="plat-card p-3 text-[0.88rem]">
              <p className="font-semibold text-ink">{f.project.label}</p>
              <p className="mt-1 text-muted">{f.project.dims.sector} · {f.project.dims.status} · {ksh(f.project.value)}</p>
              <p className="mt-1 text-[0.8rem] text-muted">{PLACED[f.placed]}. Cite: {source}, p. {f.project.dims.page}.</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
