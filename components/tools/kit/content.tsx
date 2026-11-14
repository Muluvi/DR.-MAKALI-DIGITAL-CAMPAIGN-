"use client";

import { useMemo, useState } from "react";
import { ToolActions } from "../public/ToolActions";
import type { FigureView, ToolWard } from "@/lib/tools/dataset";
import { Badge, Card, n0, Note, NumberField, pct, Select, Slider, Stat, Stats, Table, tierText } from "./ui";

/* ------------------------------------------------------------------ Weekly Content Calendar */

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Largest-remainder split of n posts across weights. */
function split(n: number, weights: number[]): number[] {
  const t = weights.reduce((s, w) => s + w, 0) || 1;
  const raw = weights.map((w) => (w / t) * n);
  const out = raw.map(Math.floor);
  let left = n - out.reduce((s, v) => s + v, 0);
  raw.map((r, i) => ({ i, f: r - Math.floor(r) })).sort((a, b) => b.f - a.f).forEach(({ i }) => { if (left > 0) { out[i] += 1; left -= 1; } });
  return out;
}

export function ContentCalendar({ pillars, types, wards }: { pillars: string[]; types: { code: string; short: string }[]; wards: ToolWard[] }) {
  const [weights, setWeights] = useState<number[]>(() => split(100, pillars.map(() => 1)));
  const [posts, setPosts] = useState(6);
  const [kikamba, setKikamba] = useState(4);
  const poolWards = useMemo(() => [...wards].filter((w) => w.pool).sort((a, b) => b.voters - a.voters), [wards]);
  const [start, setStart] = useState(0);
  const plan = useMemo(() => {
    const per = split(posts, weights);
    const seq = per.flatMap((k, i) => Array(k).fill(i) as number[]);
    // Interleave pillars so the same one does not run on consecutive days.
    const order: number[] = [];
    const pools = per.map((k, i) => ({ i, k }));
    while (order.length < posts) { pools.sort((a, b) => b.k - a.k); const pick = pools.find((p) => p.k > 0 && p.i !== order[order.length - 1]) ?? pools.find((p) => p.k > 0); if (!pick) break; order.push(pick.i); pick.k -= 1; }
    return (order.length ? order : seq).map((p, j) => ({
      day: DAYS[Math.min(6, Math.floor((j * 7) / Math.max(posts, 1)))],
      pillar: pillars[p],
      type: types[j % types.length],
      language: j < kikamba ? "Kikamba first" : j % 2 ? "Kiswahili" : "English",
      ward: j < 2 ? poolWards[(start + j) % poolWards.length]?.name ?? "—" : "Countywide",
    }));
  }, [posts, weights, kikamba, pillars, types, poolWards, start]);
  const sum = weights.reduce((s, w) => s + w, 0);
  return (
    <div className="space-y-4">
      <Card>
        <p className="font-semibold text-ink">Pillar weights {sum !== 100 && <Badge tone="gold">add up to {sum}, not 100</Badge>}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">{pillars.map((p, i) => <Slider key={p} label={p} value={weights[i]} onChange={(v) => setWeights(weights.map((w, j) => (j === i ? v : w)))} min={0} max={100} suffix="%" />)}</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Slider label="Posts this week" value={posts} onChange={setPosts} min={3} max={14} />
          <Slider label="Kikamba-first posts" value={kikamba} onChange={(v) => setKikamba(Math.min(v, posts))} min={0} max={posts} hint="The brief's rule: at least four" />
          <Slider label="Rotate the pool wards" value={start} onChange={setStart} min={0} max={Math.max(0, poolWards.length - 1)} hint="Two posts originate in a pool ward" />
        </div>
      </Card>
      {kikamba < 4 && <Note>Below the brief&rsquo;s rule of at least four Kikamba-first posts a week.</Note>}
      <Table rows={plan} rowKey={(_, i) => String(i)} cols={[
        { key: "d", label: "Day", render: (r) => r.day },
        { key: "p", label: "Pillar", render: (r) => r.pillar },
        { key: "t", label: "Content type", render: (r) => `${r.type.code} ${r.type.short}` },
        { key: "l", label: "Language", render: (r) => r.language },
        { key: "w", label: "Originates in", render: (r) => r.ward },
      ]} />
      <ToolActions filename="weekly-content-calendar.csv" rows={() => [["Day", "Pillar", "Content type", "Language", "Originates in"], ...plan.map((r) => [r.day, r.pillar, `${r.type.code} ${r.type.short}`, r.language, r.ward])]} link={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ Message Studio */

export function MessageStudio({ smsLimit }: { smsLimit: number }) {
  const [text, setText] = useState("");
  const [lang, setLang] = useState<"english" | "kiswahili" | "kikamba">("kiswahili");
  const chars = [...text].length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const parts = chars === 0 ? 0 : chars <= smsLimit ? 1 : Math.ceil(chars / 153);
  const checks = [
    { ok: chars <= smsLimit, label: `SMS: ${chars} of ${smsLimit} characters${parts > 1 ? `, ${parts} parts` : ""}` },
    { ok: lang !== "kikamba", label: lang === "kikamba" ? "SMS: Kikamba goes out as a WhatsApp voice note or on radio, not as SMS" : "SMS: English or Kiswahili" },
    { ok: chars <= 182, label: `USSD screen: ${chars} of 182 characters` },
    { ok: chars <= 280, label: `X: ${chars} of 280 characters` },
  ];
  return (
    <div className="space-y-4">
      <Card>
        <label className="plat-label block">Your message
          <textarea className="plat-input mt-1 block min-h-28 w-full" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write it once; see it on every channel." />
        </label>
        <div className="mt-3 grid gap-4 sm:grid-cols-2"><Select label="Language" value={lang} onChange={setLang} options={[{ value: "kiswahili", label: "Kiswahili" }, { value: "english", label: "English" }, { value: "kikamba", label: "Kikamba" }]} /></div>
      </Card>
      <Stats>
        <Stat label="Characters" value={n0(chars)} />
        <Stat label="Words" value={n0(words)} />
        <Stat label="SMS parts" value={String(parts)} tone={parts > 1 ? "warn" : undefined} />
        <Stat label="Radio read" value={`${Math.round((words / 150) * 60)} s`} note="At 150 words a minute" />
      </Stats>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card><p className="plat-kicker">SMS</p><p className="mt-2 whitespace-pre-wrap rounded-xl bg-paper p-3 font-mono text-[0.85rem] text-ink ring-1 ring-line">{text.slice(0, smsLimit) || "…"}{chars > smsLimit && <span className="text-gold">{text.slice(smsLimit)}</span>}</p></Card>
        <Card><p className="plat-kicker">USSD screen</p><p className="mt-2 whitespace-pre-wrap rounded-md bg-[#cfd8c8] p-3 font-mono text-[0.8rem] text-[#1d2a1a]">{text.slice(0, 182) || "…"}</p></Card>
        <Card><p className="plat-kicker">WhatsApp</p><p className="mt-2 inline-block max-w-full whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-[#dcf8c6] px-3 py-2 text-[0.9rem] text-[#111]">{text || "…"}</p></Card>
        <Card><p className="plat-kicker">Checks</p><ul className="mt-2 space-y-1 text-[0.88rem]">{checks.map((c) => <li key={c.label} className={c.ok ? "text-ink" : "text-gold"}>{c.ok ? "✓" : "✕"} {c.label}</li>)}</ul></Card>
      </div>
      <Note>Nothing is sent from here. Every bulk send still goes through the approval chain and the Language and Compliance check.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ Fact Card Generator */

export function FactCards({ facts }: { facts: { label: string; f: FigureView }[] }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [copied, setCopied] = useState(false);
  const list = facts.filter((x) => x.label.toLowerCase().includes(q.toLowerCase()));
  const cur = list[sel] ?? list[0];
  const caution = cur && (cur.f.tier === "T3" || cur.f.state === "modelled" || cur.f.state === "target");
  const line = cur ? `${cur.label}: ${cur.f.display}${cur.f.unit === "percent" ? "%" : ""}. Source: ${cur.f.source ?? "this proposal"}${cur.f.asOf ? `, ${cur.f.asOf}` : ""}.${cur.f.state === "modelled" ? " (Calculated.)" : ""}` : "";
  return (
    <div className="space-y-4">
      <Card>
        <label className="plat-label block">Find a figure<input className="plat-input mt-1 block w-full" value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder="water, budget, register…" /></label>
        <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto">{list.map((x, i) => <li key={x.f.id}><button type="button" onClick={() => setSel(i)} className={`w-full rounded-md px-2 py-1.5 text-left text-[0.9rem] ${cur?.f.id === x.f.id ? "bg-accent-solid text-on-accent" : "hover:bg-paper"}`}>{x.label} <span className="opacity-70">· {x.f.display}</span></button></li>)}</ul>
      </Card>
      {cur && (
        <Card>
          <p className="plat-kicker">Ready to post</p>
          <p className="mt-2 font-serif text-[1.4rem] leading-snug text-ink">{cur.f.display}{cur.f.unit === "percent" ? "%" : ""}</p>
          <p className="text-ink">{cur.label}</p>
          <p className="mt-2 text-[0.85rem] text-muted">{cur.f.source}{cur.f.asOf ? ` · ${cur.f.asOf}` : ""} · <Badge tone={caution ? "gold" : "accent"}>{cur.f.state === "target" ? "target" : `${tierText(cur.f.tier)}${cur.f.state === "modelled" ? ", calculated" : ""}`}</Badge></p>
          {caution && <p className="mt-2 text-[0.85rem] text-gold">Check before posting: {cur.f.tier === "T3" ? "a Tier 3 figure, reported but not confirmed." : cur.f.state === "target" ? "a target set by this proposal, not a measurement." : "calculated by the site from sourced figures; say so."}</p>}
          <p className="mt-3 rounded-xl bg-paper p-3 text-[0.9rem] text-ink ring-1 ring-line">{line}</p>
          <button type="button" className="plat-btn plat-btn-sm mt-3" onClick={async () => { await navigator.clipboard?.writeText(line); setCopied(true); setTimeout(() => setCopied(false), 1600); }}>{copied ? "Copied" : "Copy the line"}</button>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Radio Planner */

export function RadioPlanner({ stations }: { stations: { name: string; frequency: string | null; alignment: string; posture: string; reachLabel: string; share: FigureView | null }[] }) {
  const placement = (p: string) => /^Priority|^Secondary/.test(p);
  const [spots, setSpots] = useState<Record<string, number>>(() => Object.fromEntries(stations.map((s) => [s.name, /^Priority/.test(s.posture) ? 10 : 0])));
  const [len, setLen] = useState(45);
  const rows = stations.map((s) => ({ s, k: spots[s.name] ?? 0, index: (spots[s.name] ?? 0) * (s.share?.value ?? 0) }));
  const tot = rows.reduce((t, r) => ({ k: t.k + r.k, idx: t.idx + r.index }), { k: 0, idx: 0 });
  return (
    <div className="space-y-4">
      <Card><NumberField label="Spot length (seconds)" value={len} onChange={setLen} min={10} step={5} /></Card>
      <Stats>
        <Stat label="Spots a week" value={n0(tot.k)} />
        <Stat label="Airtime a week" value={`${n0((tot.k * len) / 60)} min`} />
        <Stat label="On monitoring-only stations" value={n0(rows.filter((r) => !placement(r.s.posture)).reduce((s, r) => s + r.k, 0))} tone="warn" />
        <Stat label="Listener-weighted index" value={n0(tot.idx)} note="Spots × regional listener share; ranks plans, does not count listeners" />
      </Stats>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <Card key={r.s.name}>
            <p className="font-semibold text-ink">{r.s.name} <span className="text-[0.8rem] font-normal text-muted">{r.s.frequency ?? "frequency not published"}</span></p>
            <p className="text-[0.82rem] text-muted">{r.s.alignment}</p>
            <p className="mt-1 text-[0.85rem] text-ink">{r.s.posture}</p>
            <p className="mt-1 text-[0.8rem] text-muted">Listener share: {r.s.share ? `${pct(r.s.share.value ?? 0)} of Lower Eastern (Tier 2)` : "not measured"} · {r.s.reachLabel}</p>
            <div className="mt-2"><Slider label="Spots a week" value={r.k} onChange={(v) => setSpots({ ...spots, [r.s.name]: v })} min={0} max={40} /></div>
            {!placement(r.s.posture) && r.k > 0 && <p className="text-[0.8rem] text-gold">This station is a monitoring target, not a placement target.</p>}
          </Card>
        ))}
      </div>
      <ToolActions filename="radio-plan.csv" rows={() => [["Station", "Frequency", "Posture", "Spots a week", "Seconds a week"], ...rows.map((r) => [r.s.name, r.s.frequency ?? "", r.s.posture, r.k, r.k * len])]} link={false} />
    </div>
  );
}
