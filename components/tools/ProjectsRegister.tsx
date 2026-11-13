"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { PROJECTS, PROJECTS_EXPORT, WARDS, WARD_NAME, type ProjectLevel, type ProjectRow } from "@/data/projects";
import { ToolShell, fmt } from "./ToolShell";
import { ToolActions } from "./ToolActions";

/**
 * The service-delivery tracker: every project the county's scorecard itemises, filterable by
 * constituency, ward, sector and printed status. A record of what the county claims.
 */
const ALL = "All";
const NO_SINGLE_WARD = "no-single-ward";
const PAGE = 30;
const LEVEL: Record<ProjectLevel, string> = { ward: "", multi_ward: "Several wards", conflict: "Ward outside its constituency", constituency: "No single ward", county: "County-wide or HQ" };
const kes = (n: number) => `KES ${fmt(Math.round(n))}`;
const kesShort = (n: number) => (n >= 1e9 ? `KES ${fmt(n / 1e9, 2)}bn` : `KES ${fmt(n / 1e6, 1)}m`);
const sorted = (xs: Iterable<string>) => [...new Set(xs)].sort((a, b) => a.localeCompare(b));
const CONSTITUENCIES = sorted(PROJECTS.map((p) => p.constituency));
const SECTORS = sorted(PROJECTS.map((p) => p.sector));
const STATUSES = sorted(PROJECTS.map((p) => p.status));

function placeOf(p: ProjectRow): string {
  if (p.level === "ward") return WARD_NAME[p.wards[0]];
  if (p.wards.length > 0) return `${LEVEL[p.level]}: ${p.wards.map((w) => WARD_NAME[w]).join(", ")}`;
  return LEVEL[p.level];
}

function Tracker() {
  const [f, setF] = useState({ constituency: ALL, ward: ALL, sector: ALL, status: ALL, query: "" });
  const [shown, setShown] = useState(PAGE);
  const q = useDeferredValue(f);
  const wardOptions = WARDS.filter((w) => f.constituency === ALL || w.constituency === f.constituency).sort((a, b) => a.name.localeCompare(b.name));
  const filtered = useMemo(() => {
    const term = q.query.trim().toLowerCase();
    return PROJECTS.filter((p) =>
      (q.constituency === ALL || p.constituency === q.constituency) &&
      (q.ward === ALL || (q.ward === NO_SINGLE_WARD ? p.level !== "ward" : p.wards.includes(q.ward))) &&
      (q.sector === ALL || p.sector === q.sector) &&
      (q.status === ALL || p.status === q.status) &&
      (term === "" || `${p.title} ${p.asPrinted}`.toLowerCase().includes(term)));
  }, [q]);
  const total = filtered.reduce((n, p) => n + p.amount, 0);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setF({ ...f, [k]: e.target.value, ...(k === "constituency" ? { ward: ALL } : {}) }); setShown(PAGE); };

  return (
    <div className="grid gap-4">
      <div className="panel grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="field">Constituency<select className="input" value={f.constituency} onChange={set("constituency")}><option value={ALL}>All constituencies</option>{CONSTITUENCIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="field">Ward<select className="input" value={f.ward} onChange={set("ward")}><option value={ALL}>All wards</option>{wardOptions.map((w) => <option key={w.slug} value={w.slug}>{w.name}</option>)}<option value={NO_SINGLE_WARD}>Not placed on one ward</option></select></label>
        <label className="field">Sector<select className="input" value={f.sector} onChange={set("sector")}><option value={ALL}>All sectors</option>{SECTORS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="field">Status, as the county prints it<select className="input" value={f.status} onChange={set("status")}><option value={ALL}>All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="field sm:col-span-2 lg:col-span-4">Search titles and villages<input className="input" type="search" value={f.query} onChange={set("query")} /></label>
      </div>
      <dl className="compare sm:grid-cols-3" style={{ gridTemplateColumns: undefined }} aria-live="polite">
        <div><dt>Projects</dt><dd>{fmt(filtered.length)}</dd><span className="delta">of {fmt(PROJECTS.length)} itemised</span></div>
        <div><dt>Printed cost</dt><dd>{kesShort(total)}</dd></div>
        <div><dt>On one ward</dt><dd>{fmt(filtered.filter((p) => p.level === "ward").length)}</dd></div>
      </dl>
      <div className="flex justify-end"><ToolActions filename="kitui-county-projects.csv" rows={() => [["project", "sector", "constituency", "place", "status_printed", "kes_printed", "scorecard_page"], ...filtered.map((p) => [p.title, p.sector, p.constituency, placeOf(p), p.status, Math.round(p.amount), p.page])]} /></div>
      <ul className="grid gap-2 p-0" style={{ listStyle: "none" }}>
        {filtered.slice(0, shown).map((p) => (
          <li key={p.id} className="panel">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
              <div className="min-w-0 flex-1">
                <p className="m-0 font-bold">{p.title}</p>
                <p className="m-0 small muted">{p.sector} · {p.constituency} · {placeOf(p)}</p>
              </div>
              <div className="text-right">
                <p className="m-0 num font-bold">{kes(p.amount)}</p>
                <p className="m-0 small muted">County says: {p.status}</p>
              </div>
            </div>
            <details className="v-more"><summary>As printed, p. {p.page}</summary><p className="small muted m-0">{p.asPrinted}</p></details>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p className="muted m-0">No projects match these filters.</p>}
      {filtered.length > shown && <button type="button" className="btn justify-self-center" onClick={() => setShown((n) => n + PAGE)}>Show more ({fmt(filtered.length - shown)} left)</button>}
    </div>
  );
}

export default function ProjectsRegister() {
  return (
    <ToolShell kicker="Tool" title="Service-delivery tracker" question="Every project the county's scorecard itemises, by constituency, ward, sector and printed status. A record of what the county claims, not evidence that the claims are true." source={`Source: County Government of Kitui, Delivering the Kitui Promise: Three-Year Scorecard (Aug 2022 – Aug 2025), itemised tables. Costs as printed. Data as at ${PROJECTS_EXPORT.data_as_of}.`} resettable>
      <Tracker />
    </ToolShell>
  );
}
