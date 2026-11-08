"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublicWard } from "@/lib/public-data";
import { ToolActions } from "./ToolActions";

const n = (v: number) => v.toLocaleString("en-KE");

export function PollingAgentPlanner({ wards, initial }: { wards: PublicWard[]; initial: { agents?: string; reserve?: string; span?: string } }) {
  const [perStation, setPerStation] = useState(initial.agents ?? "");
  const [reserve, setReserve] = useState(initial.reserve ?? "0");
  const [perSupervisor, setPerSupervisor] = useState(initial.span ?? "");
  useEffect(() => {
    const p = new URLSearchParams();
    if (perStation) p.set("agents", perStation);
    if (reserve !== "0") p.set("reserve", reserve);
    if (perSupervisor) p.set("span", perSupervisor);
    const q = p.toString();
    window.history.replaceState(null, "", q ? `?${q}` : window.location.pathname);
  }, [perStation, reserve, perSupervisor]);
  const a = Number(perStation), r = Number(reserve), s = Number(perSupervisor);
  const ready = a > 0 && r >= 0;
  const plan = useMemo(() => wards.map((w) => {
    const base = w.stations * a;
    const reserves = Math.ceil(base * r / 100);
    const supervisors = s > 0 ? Math.ceil(w.stations / s) : 0;
    return { w, base, reserves, supervisors, total: base + reserves + supervisors };
  }), [wards, a, r, s]);
  const sum = plan.reduce((t, p) => ({ base: t.base + p.base, reserves: t.reserves + p.reserves, supervisors: t.supervisors + p.supervisors, total: t.total + p.total, stations: t.stations + p.w.stations }), { base: 0, reserves: 0, supervisors: 0, total: 0, stations: 0 });
  return (
    <div>
      <div className="plat-card grid gap-4 p-4 sm:grid-cols-3">
        <label className="plat-label">Agents per station (required)
          <input className="plat-input mt-1 block w-full" type="number" min="1" step="1" inputMode="numeric" value={perStation} onChange={(e) => setPerStation(e.target.value)} />
          <span className="plat-hint mt-1 block">A planning assumption you enter. Confirm the legal rule first.</span>
        </label>
        <label className="plat-label">Reserve (%)
          <input className="plat-input mt-1 block w-full" type="number" min="0" max="100" inputMode="numeric" value={reserve} onChange={(e) => setReserve(e.target.value)} />
        </label>
        <label className="plat-label">Stations per supervisor (optional)
          <input className="plat-input mt-1 block w-full" type="number" min="1" inputMode="numeric" value={perSupervisor} onChange={(e) => setPerSupervisor(e.target.value)} />
        </label>
      </div>
      {!ready && <p className="plat-hint mt-4" role="status">Enter agents per station to see the plan. The station counts below are official 2022 figures.</p>}
      {ready && <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-ink" role="status"><strong className="font-mono text-2xl">{n(sum.total)}</strong> people across {n(sum.stations)} stations</p><ToolActions filename="kitui-polling-agent-plan.csv" rows={() => [["ward_code", "ward", "constituency", "stations", "agents", "reserves", "supervisors", "total"], ...plan.map((p) => [p.w.code, p.w.name, p.w.constituency, p.w.stations, p.base, p.reserves, p.supervisors, p.total])]} /></div>}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-[0.88rem]">
          <thead className="text-muted"><tr><th className="py-2 pr-3">Ward</th><th className="py-2 pr-3">Constituency</th><th className="py-2 pr-3 text-right">Stations</th><th className="py-2 pr-3 text-right">Agents</th><th className="py-2 pr-3 text-right">Reserves</th><th className="py-2 pr-3 text-right">Supervisors</th><th className="py-2 text-right">Total</th></tr></thead>
          <tbody>{plan.map((p) => <tr key={p.w.code} className="border-t border-line text-ink"><td className="py-2 pr-3">{p.w.name}</td><td className="py-2 pr-3 text-muted">{p.w.constituency}</td><td className="py-2 pr-3 text-right font-mono">{n(p.w.stations)}</td><td className="py-2 pr-3 text-right font-mono">{ready ? n(p.base) : "–"}</td><td className="py-2 pr-3 text-right font-mono">{ready ? n(p.reserves) : "–"}</td><td className="py-2 pr-3 text-right font-mono">{ready && s > 0 ? n(p.supervisors) : "–"}</td><td className="py-2 text-right font-mono">{ready ? n(p.total) : "–"}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
