"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublicConstituency } from "@/lib/public-data";
import { val } from "../../../lib/data/read";
import { clampPct as clamp, scenarioTotals, startingScenario, type Cell, type Scenario } from "../../../lib/models/winning-number";
import { ToolActions } from "./ToolActions";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { InstructionBox } from "../../models/InstructionBox";
import { parseWinning } from "../../../lib/models/instruct/parse";
import { explainWinning } from "../../../lib/models/instruct/explain";

const n = (v: number) => Math.round(v).toLocaleString("en-KE");

function decode(raw: string | undefined): { a?: Scenario; b?: Scenario } {
  if (!raw) return {};
  try { return JSON.parse(atob(raw)); } catch { return {}; }
}

export function ScenarioSimulator({ constituencies, initial, embedded = false }: { constituencies: PublicConstituency[]; initial?: string; embedded?: boolean }) {
  const benchmark = val("benchmark");
  const baseTurnout = val("turnout.constant");
  const start = useMemo<Scenario>(() => startingScenario(constituencies, benchmark, baseTurnout), [constituencies, benchmark, baseTurnout]);
  const [a, setA] = useState<Scenario>(() => ({ ...start, ...decode(initial).a }));
  const [b, setB] = useState<Scenario>(() => ({ ...start, ...decode(initial).b }));
  const [active, setActive] = useState<"A" | "B">("A");
  const [paste, setPaste] = useState("");
  const [note, setNote] = useState("");
  const cur = active === "A" ? a : b;
  const set = active === "A" ? setA : setB;

  useEffect(() => {
    if (embedded) return;
    window.history.replaceState(null, "", `?s=${encodeURIComponent(btoa(JSON.stringify({ a, b })))}`);
  }, [a, b, embedded]);

  const total = (s: Scenario) => scenarioTotals(constituencies, s);
  const ta = total(a), tb = total(b);

  const load = () => {
    const next = { ...cur }; let done = 0; const skipped: string[] = [];
    for (const line of paste.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)) {
      const [name, t, s] = line.split(/[,\t]/).map((x) => x.trim());
      const c = constituencies.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (!c || !Number.isFinite(Number(t)) || !Number.isFinite(Number(s)) || t === "" || s === "") { if (!/^constituency$/i.test(name)) skipped.push(name); continue; }
      next[c.code] = { turnout: clamp(Number(t)), share: clamp(Number(s)) }; done++;
    }
    set(next);
    setNote(`Applied ${done} constituencies to scenario ${active}.${skipped.length ? ` Skipped: ${skipped.join(", ")}.` : ""}`);
  };
  const summary = (label: string, t: { ballots: number; votes: number }) => (
    <div className="plat-card p-4">
      <p className="plat-kicker">Scenario {label}</p>
      <p className="mt-1 font-mono text-3xl text-ink">{n(t.votes)}</p>
      <p className="text-[0.85rem] text-muted">votes from {n(t.ballots)} ballots</p>
      <p className="mt-2 text-[0.9rem] text-ink">{t.votes >= benchmark ? `${n(t.votes - benchmark)} above` : `${n(benchmark - t.votes)} short of`} the working benchmark of {n(benchmark)}</p>
    </div>
  );
  const update = (code: string, key: keyof Cell, v: number) => set({ ...cur, [code]: { ...cur[code], [key]: v } });
  const instruct = (text: string) => {
    const r = parseWinning(text, { a, b, active }, constituencies);
    setA(r.next.a); setB(r.next.b); setActive(r.next.active);
    return r;
  };
  return (
    <div>
      <InstructionBox onRun={instruct} explanation={explainWinning(constituencies, cur, benchmark)} model="winning-number" examples={EXAMPLES["winning-number"]} />
      <div className="grid gap-3 sm:grid-cols-2">{summary("A", ta)}{summary("B", tb)}</div>
      <p className="mt-3 text-[0.9rem] text-ink" role="status">B minus A: {tb.votes - ta.votes >= 0 ? "+" : "−"}{n(Math.abs(tb.votes - ta.votes))} votes</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario being edited">
          {(["A", "B"] as const).map((s) => <button key={s} type="button" aria-pressed={active === s} onClick={() => setActive(s)} className={`plat-btn plat-btn-sm ${active === s ? "plat-btn-solid" : ""}`}>Edit {s}</button>)}
          <button type="button" className="plat-btn plat-btn-sm" onClick={() => set(start)}>Reset {active}</button>
        </div>
        <ToolActions link={!embedded} filename="kitui-scenarios.csv" rows={() => [["constituency", "register_2022", "a_turnout", "a_share", "b_turnout", "b_share"], ...constituencies.map((c) => [c.name, c.voters, a[c.code].turnout, a[c.code].share, b[c.code].turnout, b[c.code].share])]} />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {constituencies.map((c) => {
          const v = cur[c.code]; const ballots = c.voters * v.turnout / 100;
          return (
            <div key={c.code} className="plat-card p-4">
              <div className="flex justify-between gap-3"><h3 className="font-semibold text-ink">{c.name}</h3><span className="font-mono text-[0.85rem] text-muted">{n(ballots * v.share / 100)} votes</span></div>
              <label className="mt-3 block text-[0.85rem] text-muted">Turnout <output className="float-right font-mono text-ink">{v.turnout.toFixed(1)}%</output><input className="mt-1 block w-full" type="range" min="30" max="90" step="0.5" value={v.turnout} onChange={(e) => update(c.code, "turnout", Number(e.target.value))} aria-label={`${c.name} turnout`} /></label>
              <label className="mt-3 block text-[0.85rem] text-muted">Share of ballots <output className="float-right font-mono text-ink">{v.share.toFixed(1)}%</output><input className="mt-1 block w-full" type="range" min="0" max="100" step="0.5" value={v.share} onChange={(e) => update(c.code, "share", Number(e.target.value))} aria-label={`${c.name} share of ballots`} /></label>
            </div>
          );
        })}
      </div>
      <details className="plat-card mt-4 p-4">
        <summary className="cursor-pointer font-semibold text-ink">Load your own aggregate figures</summary>
        <p className="plat-hint mt-2">Paste one line per constituency: name, turnout %, share %. This stays in your browser and is never sent anywhere. Do not paste names or phone numbers.</p>
        <textarea className="plat-input mt-2 block w-full" rows={5} value={paste} onChange={(e) => setPaste(e.target.value)} aria-label="Aggregate figures to load" />
        <button type="button" className="plat-btn plat-btn-sm mt-2" onClick={load}>Apply to scenario {active}</button>
        {note && <p className="plat-hint mt-2" role="status">{note}</p>}
      </details>
    </div>
  );
}
