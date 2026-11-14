"use client";

import { useState } from "react";
import type { FigureView } from "@/lib/tools/dataset";
import { Badge, Bar, Card, ksh, n0, Note, pct, Select, Stat, Stats, Table, tierText } from "./ui";

const prov = (f: FigureView) => `${f.source ?? "this proposal"}${f.asOf ? `, ${f.asOf}` : ""} · ${f.state === "target" ? "target" : tierText(f.tier)}${f.state === "modelled" ? ", calculated" : ""}`;

/* ------------------------------------------------------------------ County Money Explainer */

export function CountyMoney({ f, population }: { f: Record<string, FigureView>; population: number }) {
  const [per, setPer] = useState<"total" | "resident">("total");
  const v = (id: string) => f[id].value ?? 0;
  const show = (x: number) => (per === "total" ? ksh(x) : `KSh ${n0(x / population)}`);
  const parts = [
    { id: "budget.equitable", label: "Equitable share from the national government" },
    { id: "budget.osr", label: "Own-source revenue (county taxes, fees, rents)" },
    { id: "budget.grants", label: "Conditional grants and loans" },
  ];
  const audits = [
    { id: "audit.uncollected", label: "Uncollected county rates and rents" },
    { id: "audit.cash", label: "Unconfirmed cash balances" },
    { id: "audit.ifmis", label: "IFMIS variance" },
    { id: "audit.transfers", label: "Unexplained transfers between accounts" },
  ];
  const total = v("budget.total");
  return (
    <div className="space-y-4">
      <Card><Select label="Show money as" value={per} onChange={setPer} options={[{ value: "total", label: "Totals" }, { value: "resident", label: "Per resident (2019 census population)" }]} /></Card>
      <Stats>
        <Stat label="Resource envelope, FY2026/27" value={show(total)} note={tierText(f["budget.total"].tier)} />
        <Stat label="Development spent, Q1 2025/26" value={pct(v("budget.absorption.q1"), 0)} tone="warn" note="Controller of Budget" />
        <Stat label="Audit queries, FY2023/24" value={show(audits.reduce((s, a) => s + v(a.id), 0))} note="Four lines, Auditor-General" />
        <Stat label="Pending bills, FY2020/21" value={show(v("budget.pending-bills.2021"))} note="Controller of Budget" />
      </Stats>
      <Card>
        <p className="font-semibold text-ink">Where the KSh {(total / 1e9).toFixed(2)} billion comes from</p>
        <div className="mt-3 flex h-6 w-full overflow-hidden rounded-md ring-1 ring-line" aria-hidden="true">
          {parts.map((p, i) => <span key={p.id} className={i === 0 ? "bg-accent-solid" : i === 1 ? "bg-gold-solid" : "bg-line"} style={{ width: `${(v(p.id) / total) * 100}%` }} />)}
        </div>
        <ul className="mt-3 space-y-2 text-[0.9rem]">{parts.map((p) => <li key={p.id}><span className="flex justify-between gap-3"><span className="text-ink">{p.label}</span><span className="font-mono">{show(v(p.id))} · {pct((v(p.id) / total) * 100)}</span></span><span className="text-[0.78rem] text-muted">{prov(f[p.id])}</span></li>)}</ul>
      </Card>
      <Table rows={audits} rowKey={(a) => a.id} caption="What the Auditor-General queried, FY2023/24" cols={[
        { key: "l", label: "Query", render: (a) => a.label },
        { key: "v", label: "Amount", num: true, render: (a) => show(v(a.id)) },
        { key: "b", label: "", render: (a) => <span className="block w-28"><Bar value={v(a.id)} max={Math.max(...audits.map((x) => v(x.id)))} tone="gold" /></span> },
      ]} />
      <Card>
        <p className="font-semibold text-ink">Talking points, with their limits</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-[0.9rem] text-ink">
          <li>Of every KSh 100 in the envelope, about KSh {Math.round((v("budget.osr") / total) * 100)} is raised by the county itself; the rest comes from Nairobi. <span className="text-muted">({prov(f["budget.osr"])})</span></li>
          <li>In the first quarter of 2025/26 the county spent {pct(v("budget.absorption.q1"), 0)} of its development budget. <span className="text-muted">(One quarter is not a year: quote it with its quarter.)</span></li>
          <li>The contested pending bills reported for FY2021/22 and FY2022/23, {ksh(v("audit.pending.contested"))}, are a different measure from the FY2020/21 figure. <Badge tone="gold">{tierText(f["audit.pending.contested"].tier)}</Badge> <span className="text-muted">Quote either with its year, never both as one.</span></li>
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ Drought and Livelihood Watch */

export function DroughtWatch({ phases, f, sections }: { phases: { label: string; value: string | number; as_of: string }[]; f: Record<string, FigureView>; sections: { title: string; items: { id: string; label: string; unit?: string }[] }[] }) {
  const latest = phases[phases.length - 1];
  const fmtV = (id: string, unit?: string) => `${f[id].display}${f[id].unit === "percent" ? "%" : ""}${unit ? ` ${unit}` : ""}`;
  return (
    <div className="space-y-4">
      <Card>
        <p className="plat-kicker">NDMA drought phase</p>
        <p className="mt-1 font-serif text-[1.8rem] text-ink">{String(latest.value)} <span className="text-[1rem] text-muted">· {latest.as_of}</span></p>
        <div className="mt-3 flex flex-wrap gap-2">{phases.map((p) => <span key={p.label} className={`rounded-full px-3 py-1 text-[0.8rem] ${p.value === "Normal" ? "bg-paper text-muted ring-1 ring-line" : "bg-gold-solid text-on-gold"}`}>{p.as_of}: {String(p.value)}</span>)}</div>
        <Note>The phase is the NDMA&rsquo;s monthly early-warning call for the county. Check the latest bulletin before quoting a month not shown here.</Note>
      </Card>
      {sections.map((s) => (
        <Card key={s.title}>
          <p className="font-semibold text-ink">{s.title}</p>
          <ul className="mt-2 space-y-2">{s.items.map((it) => <li key={it.id} className="text-[0.9rem]"><span className="flex justify-between gap-3"><span className="text-ink">{it.label}</span><strong className="font-mono">{fmtV(it.id, it.unit)}</strong></span><span className="text-[0.76rem] text-muted">{prov(f[it.id])}</span></li>)}</ul>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ 2017 to 2022 Swing Viewer */

export function SwingViewer({ races, turnout2022, valid2022 }: { races: { year: number; results: { candidate: string; votes: number }[] }[]; turnout2022: number; valid2022: number }) {
  const r17 = races.find((r) => r.year === 2017)!, r22 = races.find((r) => r.year === 2022)!;
  const names = [...new Set([...r17.results, ...r22.results].map((r) => r.candidate))];
  const t17 = r17.results.reduce((s, r) => s + r.votes, 0), t22 = r22.results.reduce((s, r) => s + r.votes, 0);
  const rows = names.map((n) => { const a = r17.results.find((r) => r.candidate === n)?.votes ?? null; const b = r22.results.find((r) => r.candidate === n)?.votes ?? null; return { n, a, b }; });
  const max = Math.max(...rows.flatMap((r) => [r.a ?? 0, r.b ?? 0]));
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label="Listed votes, 2017" value={n0(t17)} note="The three candidates in the court-confirmed result" />
        <Stat label="Listed votes, 2022" value={n0(t22)} note={`Valid votes cast: ${n0(valid2022)}`} />
        <Stat label="Turnout, 2022" value={pct(turnout2022)} note="IEBC certified" />
        <Stat label="Change in listed votes" value={`${t22 >= t17 ? "+" : "−"}${n0(Math.abs(t22 - t17))}`} />
      </Stats>
      <Table rows={rows} rowKey={(r) => r.n} cols={[
        { key: "n", label: "Candidate", render: (r) => r.n },
        { key: "a", label: "2017", num: true, render: (r) => (r.a === null ? "did not stand" : n0(r.a)) },
        { key: "b", label: "2022", num: true, render: (r) => (r.b === null ? "did not stand" : n0(r.b)) },
        { key: "c", label: "Change", num: true, render: (r) => (r.a !== null && r.b !== null ? `${r.b >= r.a ? "+" : "−"}${n0(Math.abs(r.b - r.a))}` : "—") },
        { key: "s", label: "Share of listed, 2017 → 2022", num: true, render: (r) => `${r.a !== null ? pct((r.a / t17) * 100) : "—"} → ${r.b !== null ? pct((r.b / t22) * 100) : "—"}` },
        { key: "bar", label: "", render: (r) => <span className="block w-28 space-y-1"><Bar value={r.a ?? 0} max={max} tone="muted" /><Bar value={r.b ?? 0} max={max} /></span> },
      ]} />
      <Note>Countywide only: the 2017 ward tallies are not yet in hand, so the swing cannot be shown by ward or constituency. Shares are of the votes listed here, not of all valid votes, because the 2017 valid-vote total is not in the record. In each bar pair, grey is 2017 and blue is 2022.</Note>
    </div>
  );
}
