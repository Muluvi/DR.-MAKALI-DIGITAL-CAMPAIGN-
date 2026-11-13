"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { PUBLIC_WARDS } from "@/lib/public-data";
import { agentInputsReady, agentPlan, agentTotals, type AgentInputs } from "@/lib/models/polling-agents";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { parseAgents } from "@/lib/models/instruct/parse";
import { explainAgents } from "@/lib/models/instruct/explain";
import { Compare, ToolShell, fmt } from "../ToolShell";
import { InstructionBox } from "./InstructionBox";
import { ToolActions } from "../ToolActions";

/** The starting point: one agent at every polling station, no reserve, no supervisors. */
const START: AgentInputs = { perStation: 1, reservePct: 0, perSupervisor: 0 };

function Model() {
  const [i, setI] = useState<AgentInputs>(START);
  const shown = useDeferredValue(i);
  const ready = agentInputsReady(shown);
  const plan = useMemo(() => agentPlan(PUBLIC_WARDS, shown), [shown]);
  const sum = agentTotals(plan);
  const base = useMemo(() => agentTotals(agentPlan(PUBLIC_WARDS, START)), []);
  const num = (k: keyof AgentInputs, min: number, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setI({ ...i, [k]: Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min });
  };
  const instruct = (text: string) => {
    const r = parseAgents(text, i);
    setI({ perStation: r.next.perStation || i.perStation, reservePct: r.next.reservePct, perSupervisor: r.next.perSupervisor || 0 });
    return r;
  };

  return (
    <div className="grid gap-4">
      <div className="panel grid gap-3 sm:grid-cols-3">
        <label className="field">Agents per polling station
          <input className="input" type="number" min="1" max="10" step="1" inputMode="numeric" value={i.perStation} onChange={num("perStation", 1, 10)} />
          <span className="hint">A planning assumption. Confirm the legal rule first.</span>
        </label>
        <label className="field">Reserve agents (%)
          <input className="input" type="number" min="0" max="100" step="5" inputMode="numeric" value={i.reservePct} onChange={num("reservePct", 0, 100)} />
        </label>
        <label className="field">Stations per supervisor
          <input className="input" type="number" min="0" max="50" step="1" inputMode="numeric" value={i.perSupervisor} onChange={num("perSupervisor", 0, 50)} />
          <span className="hint">0 for no supervisors</span>
        </label>
      </div>
      {ready && <Compare baseLabel="One per station" base={base.total} scenario={sum.total} format={(v) => fmt(v)} unit=" people" />}
      <InstructionBox onRun={instruct} explanation={ready ? explainAgents(plan, sum) : ["Enter at least one agent per station."]} examples={EXAMPLES["polling-agents"]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0" role="status"><strong className="num">{fmt(sum.total)}</strong> people across {fmt(sum.stations)} stations: {fmt(sum.base)} agents, {fmt(sum.reserves)} reserves, {fmt(sum.supervisors)} supervisors.</p>
        <ToolActions filename="kitui-polling-agent-plan.csv" rows={() => [["ward_code", "ward", "constituency", "stations", "agents", "reserves", "supervisors", "total"], ...plan.map((p) => [p.w.code, p.w.name, p.w.constituency, p.w.stations, p.base, p.reserves, p.supervisors, p.total])]} />
      </div>
      <div className="table-wrap m-0" tabIndex={0} role="region" aria-label="Polling-day people by ward" style={{ maxHeight: "30rem" }}>
        <table>
          <thead><tr><th>Ward</th><th>Constituency</th><th className="num">Stations</th><th className="num">Agents</th><th className="num">Reserves</th><th className="num">Supervisors</th><th className="num">Total</th></tr></thead>
          <tbody>{plan.map((p) => <tr key={p.w.code}><td>{p.w.name}</td><td className="muted">{p.w.constituency}</td><td className="num">{fmt(p.w.stations)}</td><td className="num">{fmt(p.base)}</td><td className="num">{fmt(p.reserves)}</td><td className="num">{fmt(p.supervisors)}</td><td className="num"><strong>{fmt(p.total)}</strong></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default function PollingAgents() {
  return (
    <ToolShell
      kicker="Model"
      title="Polling-agent cover"
      question="How many people does polling day need, ward by ward? Agents per station, a reserve and supervisors, on the 2022 polling-station list."
      source="Source: IEBC register of voters per polling station, 2022"
    >
      <Model />
    </ToolShell>
  );
}
