"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { PUBLIC_CONSTITUENCIES } from "@/lib/public-data";
import { val } from "@/lib/data/read";
import { clampPct as clamp, scenarioTotals, startingScenario, type Cell, type Scenario } from "@/lib/models/winning-number";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { parseWinning } from "@/lib/models/instruct/parse";
import { explainWinning } from "@/lib/models/instruct/explain";
import { Compare, ToolShell, fmt } from "../ToolShell";
import { InstructionBox } from "./InstructionBox";

const cons = PUBLIC_CONSTITUENCIES;
const n = (v: number) => fmt(Math.round(v));

function Model() {
  const benchmark = val("benchmark");
  const baseTurnout = val("turnout.constant");
  const start = useMemo<Scenario>(() => startingScenario(cons, benchmark, baseTurnout), [benchmark, baseTurnout]);
  const [cur, setCur] = useState<Scenario>(start);
  const [paste, setPaste] = useState("");
  const [note, setNote] = useState("");
  const shown = useDeferredValue(cur);
  const base = useMemo(() => scenarioTotals(cons, start), [start]);
  const t = useMemo(() => scenarioTotals(cons, shown), [shown]);
  const update = (code: string, key: keyof Cell, v: number) => setCur((s) => ({ ...s, [code]: { ...s[code], [key]: v } }));

  const load = () => {
    const next = { ...cur };
    let done = 0;
    const skipped: string[] = [];
    for (const line of paste.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)) {
      const [name, tt, ss] = line.split(/[,\t]/).map((x) => x.trim());
      const c = cons.find((x) => x.name.toLowerCase() === (name ?? "").toLowerCase());
      if (!c || tt === "" || ss === "" || !Number.isFinite(Number(tt)) || !Number.isFinite(Number(ss))) { if (name && !/^constituency$/i.test(name)) skipped.push(name); continue; }
      next[c.code] = { turnout: clamp(Number(tt)), share: clamp(Number(ss)) };
      done++;
    }
    setCur(next);
    setNote(`Applied ${done} constituencies.${skipped.length ? ` Skipped: ${skipped.join(", ")}.` : ""}`);
  };
  const instruct = (text: string) => {
    const r = parseWinning(text, { a: cur, b: cur, active: "A" }, cons);
    setCur(r.next.a);
    // This page runs one scenario against the starting point, so the parser's A/B labels are dropped.
    return { ...r, understood: r.understood.map((u) => u.replace(/^Scenario [AB],\s*/, "")).filter((u) => !/^editing scenario/i.test(u)) };
  };

  return (
    <div className="grid gap-4">
      <Compare baseLabel="Starting point" base={base.votes} scenario={t.votes} format={n} />
      <div className="result">
        <p><strong>{t.votes >= benchmark ? `${n(t.votes - benchmark)} votes above` : `${n(benchmark - t.votes)} votes short of`}</strong> the working benchmark of {n(benchmark)}, from {n(t.ballots)} ballots.</p>
      </div>
      <InstructionBox onRun={instruct} explanation={explainWinning(cons, shown, benchmark)} examples={EXAMPLES["winning-number"]} />
      <div className="grid gap-3 lg:grid-cols-2">
        {cons.map((c) => {
          const v = cur[c.code];
          const ballots = (c.voters * v.turnout) / 100;
          return (
            <div key={c.code} className="panel">
              <div className="flex justify-between gap-3"><p className="m-0 font-bold">{c.name}</p><p className="m-0 small num">{n((ballots * v.share) / 100)} votes</p></div>
              <p className="m-0 small muted num">{n(c.voters)} registered, 2022</p>
              <label className="field mt-2"><span className="range-head">Turnout <output>{fmt(v.turnout, 1)}%</output></span>
                <input type="range" min="30" max="90" step="0.5" value={v.turnout} onChange={(e) => update(c.code, "turnout", Number(e.target.value))} aria-label={`${c.name} turnout`} />
              </label>
              <label className="field mt-1"><span className="range-head">Share of ballots for Dr. Mulu <output>{fmt(v.share, 1)}%</output></span>
                <input type="range" min="0" max="100" step="0.5" value={v.share} onChange={(e) => update(c.code, "share", Number(e.target.value))} aria-label={`${c.name} share of ballots`} />
              </label>
            </div>
          );
        })}
      </div>
      <details className="panel">
        <summary className="v-more" style={{ display: "list-item", cursor: "pointer", fontWeight: 600 }}>Load the team&rsquo;s own turnout and share figures</summary>
        <p className="small muted">One line per constituency: name, turnout %, share %. Read in this browser only; refreshing the page clears it.</p>
        <textarea className="input" rows={5} value={paste} onChange={(e) => setPaste(e.target.value)} aria-label="Turnout and share by constituency" placeholder={"Mwingi North, 68, 55\nKitui Central, 72, 61"} />
        <button type="button" className="btn btn-sm mt-2" onClick={load}>Apply</button>
        {note && <p className="small muted" role="status">{note}</p>}
      </details>
    </div>
  );
}

export default function WinningNumber() {
  return (
    <ToolShell
      kicker="Model"
      title="Winning number"
      question="What turnout and share reach the benchmark? Set both for each constituency; votes are the 2022 register × turnout × share. It starts at the 2022 county turnout and the even share that reaches the benchmark."
      source="Source: IEBC register of voters per ward, 2022; benchmark and turnout from the figure registry"
    >
      <Model />
    </ToolShell>
  );
}
