"use client";

import { useMemo, useState } from "react";
import { ToolActions } from "../public/ToolActions";
import type { ToolConstituency, ToolWard } from "@/lib/tools/dataset";
import { Badge, Bar, Card, n0, Note, pct, Select, Slider, Stat, Stats, Table } from "./ui";

/* ------------------------------------------------------------------ Coalition Path Builder */

export function CoalitionPath({ cons, benchmark, turnout, register2022, register2026 }: { cons: ToolConstituency[]; benchmark: number; turnout: number; register2022: number; register2026: number }) {
  const [t, setT] = useState(turnout);
  const [basis, setBasis] = useState<"2022" | "2026">("2022");
  const [share, setShare] = useState<Record<string, number>>(() => Object.fromEntries(cons.map((c) => [c.id, 50])));
  const scale = basis === "2026" ? register2026 / register2022 : 1;
  const rows = cons.map((c) => {
    const ballots = c.voters * scale * (t / 100);
    return { c, ballots, votes: ballots * (share[c.id] / 100) };
  });
  const ballots = rows.reduce((s, r) => s + r.ballots, 0);
  const votes = rows.reduce((s, r) => s + r.votes, 0);
  const uniform = ballots > 0 ? (benchmark / ballots) * 100 : 0;
  const gap = benchmark - votes;
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Slider label="Turnout" value={t} onChange={setT} min={40} max={85} step={0.1} suffix="%" hint={`2022 certified turnout: ${pct(turnout)}`} />
          <Select label="Register" value={basis} onChange={setBasis} options={[{ value: "2022", label: "2022 register (IEBC, certified)" }, { value: "2026", label: "July 2026 total (reported, unconfirmed), spread on 2022 shares" }]} />
        </div>
      </Card>
      <Stats>
        <Stat label="Your votes" value={n0(votes)} tone={gap <= 0 ? "good" : "warn"} />
        <Stat label="Benchmark" value={n0(benchmark)} note="The 2022 winning tally, rounded" />
        <Stat label={gap <= 0 ? "Above it by" : "Short by"} value={n0(Math.abs(gap))} tone={gap <= 0 ? "good" : "warn"} />
        <Stat label="Share needed everywhere" value={pct(uniform)} note="One equal share across all eight that reaches the benchmark" />
      </Stats>
      <Card>
        <p className="font-semibold text-ink">Your share of the vote in each constituency</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.c.id}>
              <Slider label={r.c.name} value={share[r.c.id]} onChange={(v) => setShare({ ...share, [r.c.id]: v })} min={0} max={90} suffix="%" hint={`${n0(r.votes)} votes of ${n0(r.ballots)} ballots${r.c.pool ? " · pool" : ""}${r.c.held ? " · held office" : ""}`} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="plat-btn plat-btn-sm" onClick={() => setShare(Object.fromEntries(cons.map((c) => [c.id, Math.round(uniform)])))}>Set every share to {Math.round(uniform)}%</button>
          <button type="button" className="plat-btn plat-btn-sm" onClick={() => setShare(Object.fromEntries(cons.map((c) => [c.id, 50])))}>Reset to 50%</button>
        </div>
      </Card>
      <ToolActions filename="coalition-path.csv" rows={() => [["Constituency", "Ballots", "Share %", "Votes"], ...rows.map((r) => [r.c.name, Math.round(r.ballots), share[r.c.id], Math.round(r.votes)]), ["Total", Math.round(ballots), "", Math.round(votes)]]} link={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ Ward Priority Scorer */

const minmax = (xs: number[]) => { const lo = Math.min(...xs), hi = Math.max(...xs); return (x: number) => (hi === lo ? 0 : (x - lo) / (hi - lo)); };

export function PriorityScorer({ wards }: { wards: ToolWard[] }) {
  const [w, setW] = useState({ size: 50, pool: 25, perStation: 10, underServed: 15 });
  const scored = useMemo(() => {
    const size = minmax(wards.map((x) => x.voters));
    const ps = minmax(wards.map((x) => x.voters / Math.max(1, x.stations)));
    const per1k = wards.map((x) => (x.projects / x.voters) * 1000);
    const us = minmax(per1k);
    const total = w.size + w.pool + w.perStation + w.underServed || 1;
    return wards.map((x, i) => {
      const parts = { size: size(x.voters), pool: x.pool ? 1 : 0, perStation: ps(x.voters / Math.max(1, x.stations)), underServed: 1 - us(per1k[i]) };
      const score = (parts.size * w.size + parts.pool * w.pool + parts.perStation * w.perStation + parts.underServed * w.underServed) / total;
      return { x, parts, score, per1k: per1k[i] };
    }).sort((a, b) => b.score - a.score);
  }, [wards, w]);
  return (
    <div className="space-y-4">
      <Card>
        <p className="font-semibold text-ink">Weights (they are rescaled to add up to 100)</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Slider label="Size of the register" value={w.size} onChange={(v) => setW({ ...w, size: v })} min={0} max={100} />
          <Slider label="In the pool (never held office)" value={w.pool} onChange={(v) => setW({ ...w, pool: v })} min={0} max={100} />
          <Slider label="Voters per polling station" value={w.perStation} onChange={(v) => setW({ ...w, perStation: v })} min={0} max={100} hint="More voters at each station: more reached per visit" />
          <Slider label="Fewer county projects per 1,000 voters" value={w.underServed} onChange={(v) => setW({ ...w, underServed: v })} min={0} max={100} hint="From the county's own scorecard, itemised projects only" />
        </div>
      </Card>
      <Table rows={scored} rowKey={(r) => r.x.id} cols={[
        { key: "rank", label: "#", num: true, render: (r) => scored.indexOf(r) + 1 },
        { key: "ward", label: "Ward", render: (r) => <>{r.x.name} {r.x.pool && <Badge tone="gold">pool</Badge>}<span className="block text-[0.75rem] text-muted">{r.x.constituencyName}</span></> },
        { key: "score", label: "Score", num: true, render: (r) => Math.round(r.score * 100) },
        { key: "bar", label: "", render: (r) => <span className="block w-24"><Bar value={r.score} max={1} /></span> },
        { key: "voters", label: "Voters", num: true, render: (r) => n0(r.x.voters) },
        { key: "proj", label: "Projects / 1,000", num: true, render: (r) => r.per1k.toFixed(1) },
      ]} />
      <ToolActions filename="ward-priority.csv" rows={() => [["Rank", "Ward", "Constituency", "Score", "Voters", "Pool", "Projects per 1,000 voters"], ...scored.map((r, i) => [i + 1, r.x.name, r.x.constituencyName, Math.round(r.score * 100), r.x.voters, r.x.pool ? "yes" : "no", r.per1k.toFixed(2)])]} link={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ Kitui Map Studio */

type Layer = "voters" | "stations" | "population" | "projects" | "per1k" | "zone";
const LAYER_LABEL: Record<Layer, string> = { voters: "Registered voters, 2022", stations: "Polling stations, 2022", population: "Population (IEBC ward figures, 2026 gazette)", projects: "County projects (scorecard, itemised)", per1k: "County projects per 1,000 voters", zone: "Zones and the pool" };
const STEPS = ["var(--seq-1, #e8edf8)", "var(--seq-2, #c3cff0)", "var(--seq-3, #8ea6e2)", "var(--seq-4, #4f73cf)", "var(--seq-5, #2442a8)"];

export function MapStudio({ wards }: { wards: ToolWard[] }) {
  const [layer, setLayer] = useState<Layer>("voters");
  const [sel, setSel] = useState<string>(wards[0]?.id ?? "");
  const val = (x: ToolWard) => (layer === "voters" ? x.voters : layer === "stations" ? x.stations : layer === "population" ? x.population : layer === "projects" ? x.projects : layer === "per1k" ? (x.projects / x.voters) * 1000 : 0);
  const sorted = [...wards].map(val).sort((a, b) => a - b);
  const q = (v: number) => Math.min(4, Math.floor((sorted.filter((s) => s < v).length / wards.length) * 5));
  const rows = Math.max(...wards.map((x) => x.row)) + 1;
  const cur = wards.find((x) => x.id === sel);
  const zoneFill = (x: ToolWard) => (x.zone === "anchor" ? "var(--accent-solid)" : x.zone === "mwingi" ? "var(--gold-solid)" : x.zone === "arid" ? "var(--phase-2, #7a5)" : "var(--line)");
  return (
    <div className="space-y-4">
      <Card><Select label="Layer" value={layer} onChange={setLayer} options={(Object.keys(LAYER_LABEL) as Layer[]).map((l) => ({ value: l, label: LAYER_LABEL[l] }))} /></Card>
      <Card>
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }} role="group" aria-label={`Ward tile map: ${LAYER_LABEL[layer]}`}>
          {wards.map((x) => {
            const step = q(val(x));
            const bg = layer === "zone" ? zoneFill(x) : STEPS[step];
            const dark = layer === "zone" ? x.zone !== "none" : step >= 3;
            return (
              <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={sel === x.id} title={x.name}
                className={`aspect-square overflow-hidden rounded-md p-0.5 text-center text-[0.55rem] leading-tight sm:text-[0.68rem] ${sel === x.id ? "ring-2 ring-ink" : ""} ${x.pool && layer === "zone" ? "outline outline-2 outline-offset-[-3px] outline-dashed outline-white/70" : ""}`}
                style={{ gridColumn: x.col + 1, gridRow: x.row + 1, background: bg, color: dark ? "white" : "var(--ink)" }}>
                <span className="line-clamp-2 block">{x.name}</span>
                {layer !== "zone" && <span className="block font-mono">{layer === "per1k" ? val(x).toFixed(1) : n0(val(x))}</span>}
              </button>
            );
          })}
        </div>
        <Note>Schematic: every ward is one tile, placed inside its constituency block. {layer === "zone" ? "Blue: anchor zone. Gold: Mwingi. Green: arid belt. Grey: Kitui Rural. A dashed outline marks the pool." : "Five shades, lightest to darkest, split the 40 wards into fifths by this layer."}</Note>
      </Card>
      {cur && (
        <Card>
          <p className="font-serif text-xl text-ink">{cur.name} <span className="text-[0.9rem] text-muted">· {cur.constituencyName}</span></p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[0.88rem] sm:grid-cols-3">
            <p>Voters: <strong>{n0(cur.voters)}</strong></p><p>Stations: <strong>{cur.stations}</strong></p><p>Centres: <strong>{cur.centres}</strong></p>
            <p>Population: <strong>{n0(cur.population)}</strong></p><p>Area: <strong>{n0(cur.areaSqKm)} km²</strong></p><p>Projects: <strong>{cur.projects}</strong></p>
          </div>
          <a className="mt-3 inline-block underline" href={`/tools/ward-dossier/${cur.code}`}>Open the ward dossier</a>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Pareto Ward Planner */

export function ParetoWards({ wards }: { wards: ToolWard[] }) {
  const [target, setTarget] = useState(50);
  const total = wards.reduce((s, w) => s + w.voters, 0);
  const ordered = [...wards].sort((a, b) => b.voters - a.voters);
  const cum = ordered.reduce<{ w: ToolWard; cum: number; share: number }[]>((acc, w) => {
    const c = (acc.length ? acc[acc.length - 1].cum : 0) + w.voters;
    return [...acc, { w, cum: c, share: (c / total) * 100 }];
  }, []);
  const k = cum.findIndex((r) => r.share >= target) + 1;
  const chosen = cum.slice(0, k);
  return (
    <div className="space-y-4">
      <Card><Slider label="Share of the 2022 register to cover" value={target} onChange={setTarget} min={10} max={95} suffix="%" /></Card>
      <Stats>
        <Stat label="Wards needed" value={`${k} of ${wards.length}`} tone="good" />
        <Stat label="Voters covered" value={n0(chosen[chosen.length - 1]?.cum ?? 0)} />
        <Stat label="In the pool" value={`${chosen.filter((r) => r.w.pool).length}`} note="of the wards chosen" />
        <Stat label="Polling stations" value={n0(chosen.reduce((s, r) => s + r.w.stations, 0))} />
      </Stats>
      <Table rows={cum} rowKey={(r) => r.w.id} cols={[
        { key: "i", label: "#", num: true, render: (r) => cum.indexOf(r) + 1 },
        { key: "ward", label: "Ward", render: (r) => <span className={cum.indexOf(r) < k ? "font-semibold" : "text-muted"}>{r.w.name} {r.w.pool && <Badge tone="gold">pool</Badge>}</span> },
        { key: "con", label: "Constituency", render: (r) => <span className="text-muted">{r.w.constituencyName}</span> },
        { key: "v", label: "Voters", num: true, render: (r) => n0(r.w.voters) },
        { key: "c", label: "Running share", num: true, render: (r) => pct(r.share) },
      ]} />
      <ToolActions filename="pareto-wards.csv" rows={() => [["Rank", "Ward", "Constituency", "Voters", "Running share %", "Chosen"], ...cum.map((r, i) => [i + 1, r.w.name, r.w.constituencyName, r.w.voters, r.share.toFixed(1), i < k ? "yes" : "no"])]} link={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ Register Growth Tracker */

export function RegisterGrowth({ cons, register2022, growth, drive, turnout, winnerShare }: { cons: ToolConstituency[]; register2022: number; growth: number; drive: number; turnout: number; winnerShare: number }) {
  const [poolTilt, setPoolTilt] = useState(0);
  const [t, setT] = useState(turnout);
  const poolVoters = cons.filter((c) => c.pool).reduce((s, c) => s + c.voters, 0);
  const rows = cons.map((c) => {
    const base = c.voters / register2022;
    const poolShare = poolVoters / register2022;
    const weight = c.pool ? base * (1 + poolTilt / 100) : base * (1 - (poolTilt / 100) * (poolShare / (1 - poolShare)));
    return { c, add: growth * weight };
  });
  const newRegister = register2022 + growth;
  const old = register2022 * (turnout / 100) * (winnerShare / 100);
  const now = newRegister * (t / 100) * (winnerShare / 100);
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label="Added since 2022" value={n0(growth)} note="July 2026 total less 2022 (reported, unconfirmed)" />
        <Stat label="In the April drive" value={n0(drive)} note="IEBC count, confirmed" />
        <Stat label="Winning number, 2022 basis" value={n0(old)} />
        <Stat label="Winning number, new register" value={n0(now)} tone="warn" note={`+${n0(now - old)} at the winner's share`} />
      </Stats>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Slider label="Turnout on the new register" value={t} onChange={setT} min={40} max={85} step={0.1} suffix="%" />
          <Slider label="Tilt of new voters toward the pool" value={poolTilt} onChange={setPoolTilt} min={-50} max={50} suffix="%" hint="0 spreads them on 2022 shares. The IEBC has not published the new register by ward" />
        </div>
      </Card>
      <Table rows={rows} rowKey={(r) => r.c.id} cols={[
        { key: "c", label: "Constituency", render: (r) => <>{r.c.name} {r.c.pool && <Badge tone="gold">pool</Badge>}</> },
        { key: "o", label: "2022 register", num: true, render: (r) => n0(r.c.voters) },
        { key: "a", label: "New voters (spread)", num: true, render: (r) => n0(r.add) },
        { key: "n", label: "Estimated now", num: true, render: (r) => n0(r.c.voters + r.add) },
      ]} />
      <Note>The winning number here is the new register × turnout × the 2022 winner&rsquo;s share of valid votes ({pct(winnerShare)}). It is a benchmark, not a forecast.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ Youth and New Voter Calculator */

export function YouthVoters({ register2022, youth, firstTime, benchmark }: { register2022: number; youth: number; firstTime: number; benchmark: number }) {
  const [yt, setYt] = useState(50);
  const [ot, setOt] = useState(65);
  const [ys, setYs] = useState(50);
  const [ft, setFt] = useState(45);
  const [fs, setFs] = useState(50);
  const older = register2022 - youth;
  const youthVotes = youth * (yt / 100) * (ys / 100);
  const firstVotes = firstTime * (ft / 100) * (fs / 100);
  const turnoutAll = ((youth * yt + older * ot) / 100 + firstTime * (ft / 100)) / (register2022 + firstTime) * 100;
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label="Youth voters, 18–35" value={n0(youth)} note="Modelled: 2019 census ages on the 2022 register" />
        <Stat label="New since 2022" value={n0(firstTime)} note="Reported, unconfirmed" />
        <Stat label="Youth votes for him" value={n0(youthVotes)} tone="good" note={`${pct((youthVotes / benchmark) * 100)} of the benchmark`} />
        <Stat label="New voters' votes for him" value={n0(firstVotes)} note={`${pct((firstVotes / benchmark) * 100)} of the benchmark; overlaps the youth figure`} />
      </Stats>
      <Stats>
        <Stat label="Overall turnout implied" value={pct(turnoutAll)} note="On the 2022 register plus the new voters" />
      </Stats>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Slider label="Youth turnout" value={yt} onChange={setYt} min={20} max={90} suffix="%" />
          <Slider label="Turnout of voters over 35" value={ot} onChange={setOt} min={20} max={90} suffix="%" />
          <Slider label="His share of youth votes" value={ys} onChange={setYs} min={0} max={90} suffix="%" />
          <Slider label="New voters' turnout" value={ft} onChange={setFt} min={20} max={90} suffix="%" />
          <Slider label="His share of new voters" value={fs} onChange={setFs} min={0} max={90} suffix="%" />
        </div>
      </Card>
      <Note>Every turnout and share above is your assumption; no source measures them by age in Kitui. The IEBC does not publish the register by age. New voters may overlap with the youth count: treat the two as layers, not a sum of separate people.</Note>
    </div>
  );
}
