"use client";

import { useEffect, useMemo, useState } from "react";
import { countyTotals, PUBLIC_CONSTITUENCIES, PUBLIC_SOURCES, PUBLIC_WARDS, type PublicWard } from "@/lib/public-data";
import { ToolShell, fmt } from "./ToolShell";
import { ToolActions } from "./ToolActions";

type Station = { code: string; centre: string; station: string; voters: number };

/** One ward in full: its register, stations and Gazette figures, against its constituency. */
function Ward({ ward }: { ward: PublicWard }) {
  const [all, setAll] = useState<Record<string, Station[]> | null>(null);
  useEffect(() => {
    let live = true;
    import("@/data/kitui-stations.generated.json").then((m) => live && setAll(m.default as Record<string, Station[]>));
    return () => { live = false; };
  }, []);
  const stations = all ? all[ward.code] ?? [] : null;
  const peers = PUBLIC_WARDS.filter((w) => w.constituencyCode === ward.constituencyCode).sort((a, b) => b.voters - a.voters);
  const peerTotal = peers.reduce((a, w) => a + w.voters, 0);
  const stats: [string, string][] = [
    ["Registered voters, 2022", fmt(ward.voters)],
    ["Polling stations", fmt(ward.stations)],
    ["Registration centres", fmt(ward.centres)],
    ["Voters per station", fmt(Math.round(ward.voters / ward.stations))],
    ["Population (Gazette)", fmt(ward.population)],
    ["Area, sq km (Gazette)", fmt(ward.areaSqKm, 1)],
    ["Share of constituency voters", `${fmt((ward.voters / peerTotal) * 100, 1)}%`],
    ["MCA spending limit (KES)", fmt(ward.mcaLimit)],
  ];
  return (
    <div className="grid gap-4">
      <h4 className="h3">{ward.name} ward, {ward.constituency}</h4>
      <ul className="v-stats">{stats.map(([l, v]) => <li key={l}><p className="v-stat">{v}</p><p className="v-stat-label">{l}</p></li>)}</ul>
      <div className="panel">
        <p className="m-0 font-bold">Compared with the rest of {ward.constituency}</p>
        <ul className="mt-2 grid gap-2 p-0" style={{ listStyle: "none" }}>
          {peers.map((w) => (
            <li key={w.code} className="small">
              <span className="flex justify-between gap-3"><span className={w.code === ward.code ? "font-bold" : ""}>{w.name}</span><span className="num">{fmt(w.voters)}</span></span>
              <span className={`bar mt-1 block ${w.code === ward.code ? "" : "is-base"}`} aria-hidden="true"><span style={{ width: `${(w.voters / peers[0].voters) * 100}%` }} /></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 font-bold">Polling stations</p>
        {stations && <ToolActions filename={`${ward.name.toLowerCase().replace(/[^a-z]+/g, "-")}-polling-stations-2022.csv`} rows={() => [["code", "registration_centre", "polling_station", "registered_voters"], ...stations.map((s) => [s.code, s.centre, s.station, s.voters])]} />}
      </div>
      {stations ? (
        <div className="table-wrap m-0" tabIndex={0} role="region" aria-label={`Polling stations in ${ward.name}`} style={{ maxHeight: "28rem" }}>
          <table>
            <thead><tr><th>Station</th><th>Code</th><th className="num">Voters</th></tr></thead>
            <tbody>{stations.map((s) => <tr key={s.code}><td>{s.station}</td><td className="muted">{s.code}</td><td className="num">{fmt(s.voters)}</td></tr>)}</tbody>
          </table>
        </div>
      ) : <p className="m-0 muted" role="status">Loading the station list…</p>}
    </div>
  );
}

function Dossier() {
  const [q, setQ] = useState("");
  const [code, setCode] = useState(PUBLIC_WARDS[0].code);
  const term = q.trim().toLowerCase();
  const list = useMemo(() => PUBLIC_WARDS.filter((w) => `${w.name} ${w.constituency}`.toLowerCase().includes(term)), [term]);
  const ward = PUBLIC_WARDS.find((w) => w.code === code)!;
  const county: [string, number][] = [["Wards", PUBLIC_WARDS.length], ["Polling stations", countyTotals.stations], ["Registration centres", countyTotals.centres], ["Registered voters", countyTotals.voters]];
  return (
    <div className="grid gap-5">
      <ul className="v-stats">{county.map(([l, v]) => <li key={l}><p className="v-stat">{fmt(v)}</p><p className="v-stat-label">{l}</p></li>)}</ul>
      <div className="table-wrap m-0" tabIndex={0} role="region" aria-label="Constituencies">
        <table>
          <thead><tr><th>Constituency</th><th className="num">Wards</th><th className="num">Stations</th><th className="num">Voters, 2022</th></tr></thead>
          <tbody>{PUBLIC_CONSTITUENCIES.map((c) => <tr key={c.code}><th scope="row">{c.name}</th><td className="num">{c.wards}</td><td className="num">{fmt(c.stations)}</td><td className="num">{fmt(c.voters)}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <label className="field">Find a ward or constituency<input className="input" type="search" value={q} onChange={(e) => {
          const t = e.target.value;
          setQ(t);
          const hits = PUBLIC_WARDS.filter((w) => `${w.name} ${w.constituency}`.toLowerCase().includes(t.trim().toLowerCase()));
          if (hits.length && !hits.some((w) => w.code === code)) setCode(hits[0].code);
        }} /></label>
        <label className="field">Ward<select className="input" value={code} onChange={(e) => setCode(e.target.value)}>{(list.length ? list : PUBLIC_WARDS).map((w) => <option key={w.code} value={w.code}>{w.name} ({w.constituency})</option>)}</select></label>
      </div>
      {term && <p className="m-0 small muted" role="status">{list.length} of {PUBLIC_WARDS.length} wards match.</p>}
      <Ward ward={ward} />
    </div>
  );
}

export default function WardDossier() {
  return (
    <ToolShell kicker="Data" title="Ward dossier" question="The county, its eight constituencies and every ward: register, stations, population and area, with each ward's polling-station list." source={`Source: ${PUBLIC_SOURCES.stations.label}; ${PUBLIC_SOURCES.wards.label}; ${PUBLIC_SOURCES.limits.label}`}>
      <Dossier />
    </ToolShell>
  );
}
