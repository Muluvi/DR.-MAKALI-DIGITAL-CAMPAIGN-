"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CHANNELS, LAYERS, layerReach, reachByConstituency, type ChannelKey, type LayerKey, type Mix } from "@/lib/models/reach";
import { REACH_SHARES } from "@/lib/models/data";
import { PUBLIC_CONSTITUENCIES } from "@/lib/public-data";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { parseReach } from "@/lib/models/instruct/parse";
import { explainReach } from "@/lib/models/instruct/explain";
import { Compare, ToolShell, fmt } from "../ToolShell";
import { ToolActions } from "../ToolActions";
import { InstructionBox } from "./InstructionBox";

/** The starting mix: every channel on, each assumed to reach a quarter of the people it can reach. */
const START: Mix = { social: { on: true, reach: 25 }, sms: { on: true, reach: 25 }, radio: { on: true, reach: 25 }, ground: { on: true, reach: 25 } };
const pct = (v: number) => `${Math.round(v * 100)}%`;
const TONE: Record<LayerKey, string> = { data: "var(--accent-solid)", smsOnly: "color-mix(in oklch, var(--accent-solid) 55%, var(--card))", offline: "color-mix(in oklch, var(--accent-solid) 22%, var(--card))" };
const total = (rows: { voters: number; reached: number }[]) => rows.reduce((a, r) => ({ voters: a.voters + r.voters, reached: a.reached + r.reached }), { voters: 0, reached: 0 });

function Model() {
  const [mix, setMix] = useState<Mix>(START);
  const shown = useDeferredValue(mix);
  const reach = useMemo(() => layerReach(shown), [shown]);
  const rows = useMemo(() => reachByConstituency(PUBLIC_CONSTITUENCIES, REACH_SHARES, shown), [shown]);
  const base = useMemo(() => total(reachByConstituency(PUBLIC_CONSTITUENCIES, REACH_SHARES, START)), []);
  const t = total(rows);
  const set = (k: ChannelKey, v: Partial<Mix[ChannelKey]>) => setMix({ ...mix, [k]: { ...mix[k], ...v } });
  const worst = LAYERS.reduce((a, l) => (reach[l.key] < reach[a.key] ? l : a), LAYERS[0]);
  const instruct = (text: string) => {
    const r = parseReach(text, mix);
    setMix(r.next);
    return r;
  };

  return (
    <div className="grid gap-4">
      <div className="panel grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((c) => (
          <div key={c.key}>
            <label className="check"><input type="checkbox" checked={mix[c.key].on} onChange={(e) => set(c.key, { on: e.target.checked })} />{c.label}</label>
            <label className={`field ${mix[c.key].on ? "" : "opacity-50"}`}>
              <span className="range-head">Reaches this share of the people it can reach <output>{mix[c.key].reach}%</output></span>
              <input type="range" min="0" max="100" step="5" disabled={!mix[c.key].on} value={mix[c.key].reach} onChange={(e) => set(c.key, { reach: Number(e.target.value) })} aria-label={`${c.label}: assumed reach`} />
              <span className="hint">{c.note}</span>
            </label>
          </div>
        ))}
      </div>
      <Compare baseLabel="Every channel at 25%" base={base.reached} scenario={t.reached} format={(v) => fmt(Math.round(v))} unit=" voters" />
      <div className="result" role="status">
        <p>This mix reaches about <strong>{fmt(Math.round(t.reached))}</strong> of {fmt(t.voters)} registered voters ({pct(t.reached / t.voters)}).</p>
        {reach[worst.key] < 0.5 && <p>It reaches least among <strong>{worst.label.toLowerCase()}</strong>: {pct(reach[worst.key])} of them.</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {LAYERS.map((l) => (
          <div key={l.key} className="panel">
            <p className="m-0 small muted">{l.label}, {fmt(REACH_SHARES[l.key], 1)}% of voters</p>
            <p className="m-0 v-stat">{pct(reach[l.key])}</p>
            <p className="m-0 small muted">reached by the mix</p>
          </div>
        ))}
      </div>
      <InstructionBox onRun={instruct} explanation={explainReach(rows, reach)} examples={EXAMPLES["reach-by-channel"]} />
      <figure className="panel m-0" aria-label="Reach by constituency">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 font-bold">By constituency: share reached, and voters not reached</p>
          <ToolActions filename="kitui-reach-by-channel.csv" rows={() => [["constituency", "register_2022", "reached", "not_reached", ...LAYERS.map((l) => `reached_${l.key}`)], ...rows.map((r) => [r.name, r.voters, Math.round(r.reached), Math.round(r.missed), ...LAYERS.map((l) => Math.round(r.byLayer[l.key].reached))])]} />
        </div>
        <ul className="mt-3 grid gap-2 p-0" style={{ listStyle: "none" }}>
          {rows.map((r) => (
            <li key={r.code} className="grid grid-cols-[7rem_minmax(0,1fr)_4.5rem] items-center gap-2 small sm:grid-cols-[9rem_minmax(0,1fr)_6rem]">
              <span className="truncate">{r.name}</span>
              <span className="flex h-4 overflow-hidden rounded" style={{ background: "var(--card)" }} aria-hidden="true">
                {LAYERS.map((l) => <span key={l.key} style={{ width: `${(100 * r.byLayer[l.key].reached) / r.voters}%`, background: TONE[l.key] }} />)}
              </span>
              <span className="num text-right">{fmt(Math.round(r.missed))}<span className="sr-only"> not reached</span></span>
            </li>
          ))}
        </ul>
        <p className="source">Darkest: internet users; middle: phone without internet; lightest: no phone. Every constituency carries the county rates, so the bars match; the numbers differ with the size of each register.</p>
      </figure>
    </div>
  );
}

export default function ReachByChannel() {
  return (
    <ToolShell
      kicker="Model"
      title="Reach by channel"
      question="Who does a channel mix reach, and who does it miss? Switch channels on or off and set the share each reaches."
      source="Source: CA/KNBS ICT survey 2023/24 (internet use and phone ownership); IEBC register of voters, 2022"
    >
      <Model />
    </ToolShell>
  );
}
