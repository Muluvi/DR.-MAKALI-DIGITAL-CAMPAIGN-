"use client";

import { useMemo, useState } from "react";
import { ToolActions } from "../public/ToolActions";
import type { ToolConstituency, ToolStation, ToolWard } from "@/lib/tools/dataset";
import { Badge, Bar, Card, ksh, n0, Note, NumberField, pct, Select, Slider, Stat, Stats, Table } from "./ui";

/* ------------------------------------------------------------------ Ward Comparison */

export function WardCompare({ wards, total }: { wards: ToolWard[]; total: number }) {
  const sorted = useMemo(() => [...wards].sort((a, b) => a.name.localeCompare(b.name)), [wards]);
  const [ids, setIds] = useState<string[]>(() => [...wards].sort((a, b) => b.voters - a.voters).slice(0, 2).map((w) => w.id));
  const pick = ids.map((id) => wards.find((w) => w.id === id)).filter((w): w is ToolWard => !!w);
  const metrics: [string, (w: ToolWard) => string, (w: ToolWard) => number][] = [
    ["Registered voters, 2022", (w) => n0(w.voters), (w) => w.voters],
    ["Share of the county register", (w) => pct((w.voters / total) * 100), (w) => w.voters / total],
    ["Polling stations", (w) => n0(w.stations), (w) => w.stations],
    ["Polling centres", (w) => n0(w.centres), (w) => w.centres],
    ["Voters per station", (w) => n0(w.voters / w.stations), (w) => w.voters / w.stations],
    ["Population", (w) => n0(w.population), (w) => w.population],
    ["Area", (w) => `${n0(w.areaSqKm)} km²`, (w) => w.areaSqKm],
    ["Voters per km²", (w) => (w.voters / w.areaSqKm).toFixed(1), (w) => w.voters / w.areaSqKm],
    ["County projects (itemised)", (w) => n0(w.projects), (w) => w.projects],
    ["Project spend", (w) => ksh(w.projectsKsh), (w) => w.projectsKsh],
  ];
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Select key={i} label={`Ward ${i + 1}${i > 1 ? " (optional)" : ""}`} value={ids[i] ?? ""} onChange={(v) => { const next = [...ids]; if (v) next[i] = v; else next.splice(i, 1); setIds(next.filter(Boolean)); }} options={[...(i > 1 ? [{ value: "", label: "—" }] : []), ...sorted.map((w) => ({ value: w.id, label: `${w.name} (${w.constituencyName})` }))]} />
          ))}
        </div>
      </Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-[0.88rem]">
          <thead><tr><th className="py-2 pr-3 text-muted">Measure</th>{pick.map((w) => <th key={w.id} className="py-2 pr-3 text-ink">{w.name}<span className="block text-[0.75rem] font-normal text-muted">{w.constituencyName}{w.pool ? " · pool" : ""}</span></th>)}</tr></thead>
          <tbody>{metrics.map(([label, show, num]) => { const max = Math.max(...pick.map(num)); return <tr key={label} className="border-t border-line"><td className="py-2 pr-3 text-muted">{label}</td>{pick.map((w) => <td key={w.id} className="py-2 pr-3"><span className="font-mono tabular-nums text-ink">{show(w)}</span><span className="mt-1 block w-24"><Bar value={num(w)} max={max} /></span></td>)}</tr>; })}</tbody>
        </table>
      </div>
      <ToolActions filename="ward-comparison.csv" rows={() => [["Measure", ...pick.map((w) => w.name)], ...metrics.map(([l, show]) => [l, ...pick.map(show)])]} link={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ Constituency Scorecard */

export function ConstituencyScorecard({ cons, total }: { cons: ToolConstituency[]; total: number }) {
  const zone = { anchor: "Anchor zone", mwingi: "Mwingi zone", arid: "Arid belt", none: "In no zone" } as const;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {[...cons].sort((a, b) => b.voters - a.voters).map((c) => (
          <Card key={c.id}>
            <p className="font-serif text-xl text-ink">{c.name}</p>
            <p className="mt-1 flex flex-wrap gap-1">{c.held && <Badge tone="accent">He represents it</Badge>}{c.pool && <Badge tone="gold">Pool: never held office</Badge>}<Badge>{zone[c.zone]}</Badge></p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.88rem]">
              <dt className="text-muted">Registered, 2022</dt><dd className="text-right font-mono text-ink">{n0(c.voters)}</dd>
              <dt className="text-muted">Share of county</dt><dd className="text-right font-mono text-ink">{pct((c.voters / total) * 100)}</dd>
              <dt className="text-muted">Wards</dt><dd className="text-right font-mono text-ink">{c.wards}</dd>
              <dt className="text-muted">Polling stations</dt><dd className="text-right font-mono text-ink">{n0(c.stations)}</dd>
              <dt className="text-muted">County projects</dt><dd className="text-right font-mono text-ink">{c.projects ?? "—"}</dd>
              <dt className="text-muted">Project spend</dt><dd className="text-right font-mono text-ink">{c.projectsKsh !== null ? ksh(c.projectsKsh) : "—"}</dd>
              <dt className="text-muted">Spend per voter</dt><dd className="text-right font-mono text-ink">{c.perVoter !== null ? `KSh ${n0(c.perVoter)}` : "—"}</dd>
            </dl>
            <div className="mt-3"><Bar value={c.voters} max={Math.max(...cons.map((x) => x.voters))} /></div>
          </Card>
        ))}
      </div>
      <Note>Registered voters and stations: IEBC 2022. Projects and spend: the county&rsquo;s Three-Year Scorecard, itemised projects attributed to the constituency.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ Zone Effort Planner */

export function ZoneEffort({ shares, phases }: { shares: { anchor: number; mwingi: number; arid: number; rural: number }; phases: { id: string; label: string; anchor: number; mwingi: number; arid: number; rotating: number }[] }) {
  const [phase, setPhase] = useState(phases[0].id);
  const p = phases.find((x) => x.id === phase) ?? phases[0];
  const [e, setE] = useState({ anchor: p.anchor, mwingi: p.mwingi, arid: p.arid, rotating: p.rotating });
  const sum = e.anchor + e.mwingi + e.arid + e.rotating;
  const zones: { id: "anchor" | "mwingi" | "arid"; label: string }[] = [{ id: "anchor", label: "Anchor: Kitui Central, Kitui West" }, { id: "mwingi", label: "Mwingi: North, West, Central" }, { id: "arid", label: "Arid belt: Kitui South, Kitui East" }];
  return (
    <div className="space-y-4">
      <Card>
        <Select label="Start from the plan's weighting for" value={phase} onChange={(v) => { setPhase(v); const q = phases.find((x) => x.id === v)!; setE({ anchor: q.anchor, mwingi: q.mwingi, arid: q.arid, rotating: q.rotating }); }} options={phases.map((x) => ({ value: x.id, label: x.label }))} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {zones.map((z) => <Slider key={z.id} label={z.label} value={e[z.id]} onChange={(v) => setE({ ...e, [z.id]: v })} min={0} max={70} suffix="%" />)}
          <Slider label="Rotating test wards (Kitui Rural and others)" value={e.rotating} onChange={(v) => setE({ ...e, rotating: v })} min={0} max={50} suffix="%" />
        </div>
        {sum !== 100 && <p className="mt-2 text-[0.85rem] text-gold">The four add up to {sum}%, not 100%.</p>}
      </Card>
      <Table rows={zones} rowKey={(z) => z.id} cols={[
        { key: "z", label: "Zone", render: (z) => z.label },
        { key: "e", label: "Effort", num: true, render: (z) => pct(e[z.id], 0) },
        { key: "r", label: "Register share", num: true, render: (z) => pct(shares[z.id]) },
        { key: "g", label: "Effort ÷ register", num: true, render: (z) => (e[z.id] / shares[z.id]).toFixed(2) },
        { key: "b", label: "", render: (z) => <span className="block w-28"><Bar value={e[z.id]} max={Math.max(70, shares[z.id])} mark={shares[z.id]} tone={e[z.id] >= shares[z.id] ? "accent" : "gold"} /></span> },
      ]} />
      <Note>Above 1.00, a zone gets more effort than its share of voters; below 1.00, less. Kitui Rural ({pct(shares.rural)} of the register) sits in no zone and is carried by the rotating share. The line in each bar is the zone&rsquo;s register share.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ Voter Density Finder */

export function VoterDensity({ wards, stations }: { wards: ToolWard[]; stations: ToolStation[] }) {
  const [scope, setScope] = useState("all");
  const cons = [...new Set(wards.map((w) => w.constituencyName))].sort();
  const centres = useMemo(() => {
    const m = new Map<string, { centre: string; ward: string; con: string; voters: number; streams: number }>();
    for (const s of stations) {
      if (scope !== "all" && s.constituencyName !== scope) continue;
      const k = `${s.ward}|${s.centre}`;
      const cur = m.get(k) ?? { centre: s.centre, ward: s.wardName, con: s.constituencyName, voters: 0, streams: 0 };
      cur.voters += s.voters; cur.streams += 1; m.set(k, cur);
    }
    return [...m.values()].sort((a, b) => b.voters - a.voters);
  }, [stations, scope]);
  const top = centres.slice(0, 25);
  const ws = wards.filter((w) => scope === "all" || w.constituencyName === scope).map((w) => ({ w, d: w.voters / w.areaSqKm })).sort((a, b) => b.d - a.d);
  return (
    <div className="space-y-4">
      <Card><Select label="Where" value={scope} onChange={setScope} options={[{ value: "all", label: "The whole county" }, ...cons.map((c) => ({ value: c, label: c }))]} /></Card>
      <Stats>
        <Stat label="Polling centres" value={n0(centres.length)} />
        <Stat label="Top 25 centres hold" value={n0(top.reduce((s, c) => s + c.voters, 0))} note="registered voters" tone="good" />
        <Stat label="Densest ward" value={ws[0]?.w.name ?? "—"} note={ws[0] ? `${ws[0].d.toFixed(1)} voters per km²` : ""} />
        <Stat label="Sparsest ward" value={ws[ws.length - 1]?.w.name ?? "—"} note={ws.length ? `${ws[ws.length - 1].d.toFixed(1)} voters per km²` : ""} />
      </Stats>
      <Table rows={top} rowKey={(c) => c.ward + c.centre} caption="The 25 polling centres with the most registered voters: where one field day meets the most voters." cols={[
        { key: "i", label: "#", num: true, render: (c) => top.indexOf(c) + 1 },
        { key: "c", label: "Polling centre", render: (c) => c.centre },
        { key: "w", label: "Ward", render: (c) => <>{c.ward}<span className="block text-[0.75rem] text-muted">{c.con}</span></> },
        { key: "s", label: "Streams", num: true, render: (c) => c.streams },
        { key: "v", label: "Voters", num: true, render: (c) => n0(c.voters) },
      ]} />
      <ToolActions filename="voter-density.csv" rows={() => [["Polling centre", "Ward", "Constituency", "Streams", "Voters"], ...centres.map((c) => [c.centre, c.ward, c.con, c.streams, c.voters])]} link={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ Ward Allocation Simulator */

export function Allocation({ wards, defaultTotal }: { wards: ToolWard[]; defaultTotal: number }) {
  const [total, setTotal] = useState(defaultTotal / 1e9);
  const [w, setW] = useState({ pop: 50, area: 25, under: 25 });
  const sum = wards.reduce((s, x) => ({ pop: s.pop + x.population, area: s.area + x.areaSqKm }), { pop: 0, area: 0 });
  const per1k = wards.map((x) => (x.projects / x.voters) * 1000);
  const maxP = Math.max(...per1k);
  const under = per1k.map((p) => maxP - p);
  const underSum = under.reduce((s, v) => s + v, 0) || 1;
  const wt = w.pop + w.area + w.under || 1;
  const rows = wards.map((x, i) => {
    const share = ((x.population / sum.pop) * w.pop + (x.areaSqKm / sum.area) * w.area + (under[i] / underSum) * w.under) / wt;
    return { x, equal: (total * 1e9) / wards.length, needs: total * 1e9 * share };
  }).sort((a, b) => b.needs - a.needs);
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Total to split a year (KSh billion)" value={total} onChange={setTotal} min={0} step={0.1} hint={`The plan's ward fund: KSh ${(defaultTotal / 1e9).toFixed(1)}bn (a proposal, not a budget line)`} />
        </div>
        <p className="mt-4 font-semibold text-ink">Needs-weighted formula</p>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <Slider label="Population" value={w.pop} onChange={(v) => setW({ ...w, pop: v })} min={0} max={100} />
          <Slider label="Area (distance and cost to serve)" value={w.area} onChange={(v) => setW({ ...w, area: v })} min={0} max={100} />
          <Slider label="Fewer county projects so far" value={w.under} onChange={(v) => setW({ ...w, under: v })} min={0} max={100} />
        </div>
      </Card>
      <Table rows={rows} rowKey={(r) => r.x.id} cols={[
        { key: "w", label: "Ward", render: (r) => <>{r.x.name}<span className="block text-[0.75rem] text-muted">{r.x.constituencyName}</span></> },
        { key: "e", label: "Equal split", num: true, render: (r) => ksh(r.equal) },
        { key: "n", label: "Needs-weighted", num: true, render: (r) => ksh(r.needs) },
        { key: "d", label: "Difference", num: true, render: (r) => <span className={r.needs >= r.equal ? "text-accent" : "text-gold"}>{r.needs >= r.equal ? "+" : "−"}{ksh(Math.abs(r.needs - r.equal))}</span> },
      ]} />
      <Note>A ward&rsquo;s needs-weighted share is its share of county population, of county area and of the gap in county projects per voter, mixed by your weights. The plan commits to publishing a needs-weighted formula before any allocation; this tool tests candidate formulas, it does not set one.</Note>
      <ToolActions filename="ward-allocation.csv" rows={() => [["Ward", "Constituency", "Equal KSh", "Needs-weighted KSh"], ...rows.map((r) => [r.x.name, r.x.constituencyName, Math.round(r.equal), Math.round(r.needs)])]} link={false} />
    </div>
  );
}
