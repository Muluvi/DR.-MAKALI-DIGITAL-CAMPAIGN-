"use client";

import { useEffect, useMemo, useState } from "react";
import { CHANNELS, LAYERS, layerReach, reachByConstituency, type ChannelKey, type LayerKey, type Mix } from "@/lib/models/reach";
import { ToolActions } from "@/components/tools/public/ToolActions";
import { InstructionBox } from "./InstructionBox";
import { parseReach } from "@/lib/models/instruct/parse";
import { explainReach } from "@/lib/models/instruct/explain";

const n = (v: number) => Math.round(v).toLocaleString("en-KE");
const pct = (v: number) => `${Math.round(v * 100)}%`;
const START: Mix = { social: { on: true, reach: 25 }, sms: { on: true, reach: 25 }, radio: { on: true, reach: 25 }, ground: { on: true, reach: 25 } };
const KEYS = CHANNELS.map((c) => c.key);

/** The mix in the link: per channel, in order, on or off and the assumed reach, joined by dots and dashes. */
function decode(raw: string | undefined): Mix {
  const parts = (raw ?? "").split("-");
  if (parts.length !== KEYS.length) return START;
  const out = { ...START };
  parts.forEach((p, i) => {
    const [on, reach] = p.split(".").map(Number);
    if (Number.isFinite(on) && Number.isFinite(reach)) out[KEYS[i]] = { on: on === 1, reach: Math.min(100, Math.max(0, reach)) };
  });
  return out;
}

const LAYER_TONE: Record<LayerKey, string> = { data: "var(--accent-solid)", smsOnly: "color-mix(in oklch, var(--accent-solid) 55%, var(--card))", offline: "color-mix(in oklch, var(--accent-solid) 22%, var(--card))" };

export function ReachByChannel({ constituencies, shares, initial, embedded = false }: { constituencies: { code: string; name: string; voters: number }[]; shares: Record<LayerKey, number>; initial?: string; embedded?: boolean }) {
  const [mix, setMix] = useState<Mix>(() => decode(initial));
  useEffect(() => {
    if (embedded) return;
    window.history.replaceState(null, "", `?m=${KEYS.map((k) => `${mix[k].on ? 1 : 0}.${mix[k].reach}`).join("-")}`);
  }, [mix, embedded]);

  const reach = useMemo(() => layerReach(mix), [mix]);
  const rows = useMemo(() => reachByConstituency(constituencies, shares, mix), [constituencies, shares, mix]);
  const total = rows.reduce((a, r) => ({ voters: a.voters + r.voters, reached: a.reached + r.reached }), { voters: 0, reached: 0 });
  const set = (k: ChannelKey, v: Partial<Mix[ChannelKey]>) => setMix({ ...mix, [k]: { ...mix[k], ...v } });
  const worst = LAYERS.reduce((a, l) => (reach[l.key] < reach[a.key] ? l : a), LAYERS[0]);

  const instruct = (text: string) => {
    const r = parseReach(text, mix);
    setMix(r.next);
    return r;
  };
  return (
    <div>
      <InstructionBox onRun={instruct} explanation={explainReach(rows, reach)} examples={["no radio, SMS 40%", "only social media at 60%", "radio 50%, ground work 30%"]} />
      <div className="plat-card grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        {CHANNELS.map((c) => (
          <div key={c.key} className="text-[0.85rem]">
            <label className="flex items-center gap-2 font-semibold text-ink">
              <input type="checkbox" checked={mix[c.key].on} onChange={(e) => set(c.key, { on: e.target.checked })} />
              {c.label}
            </label>
            <label className={`mt-2 block text-muted ${mix[c.key].on ? "" : "opacity-50"}`}>
              Reaches <output className="font-mono text-ink">{mix[c.key].reach}%</output> of the people it can reach
              <input className="mt-1 block w-full" type="range" min="0" max="100" step="5" disabled={!mix[c.key].on} value={mix[c.key].reach} onChange={(e) => set(c.key, { reach: Number(e.target.value) })} aria-label={`${c.label}: assumed reach`} />
            </label>
            <span className="plat-hint block">{c.note}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 max-w-3xl text-ink" role="status">
        This mix reaches about <strong>{n(total.reached)}</strong> of {n(total.voters)} registered voters ({pct(total.reached / total.voters)}).
        {reach[worst.key] < 0.5 && <> It reaches least among <strong>{worst.label.toLowerCase()}</strong>: {pct(reach[worst.key])} of them.</>}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {LAYERS.map((l) => (
          <div key={l.key} className="plat-card p-4">
            <p className="text-[0.8rem] text-muted">{l.label}, {Math.round(shares[l.key] * 10) / 10}% of voters</p>
            <p className="mt-1 font-mono text-2xl text-ink">{pct(reach[l.key])}</p>
            <p className="text-[0.8rem] text-muted">reached by the mix</p>
          </div>
        ))}
      </div>

      <div className="plat-card mt-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-ink">By constituency</h2>
          <ToolActions link={!embedded} filename="kitui-reach-by-channel.csv" rows={() => [["constituency", "register_2022", "reached", "not_reached", ...LAYERS.map((l) => `reached_${l.key}`)], ...rows.map((r) => [r.name, r.voters, Math.round(r.reached), Math.round(r.missed), ...LAYERS.map((l) => Math.round(r.byLayer[l.key].reached))])]} />
        </div>
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.code} className="grid grid-cols-[7.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-[0.85rem] sm:grid-cols-[9rem_minmax(0,1fr)_6rem]">
              <span className="truncate text-ink">{r.name}</span>
              <span className="flex h-4 overflow-hidden rounded bg-paper" aria-hidden="true">
                {LAYERS.map((l) => <span key={l.key} style={{ width: `${(100 * r.byLayer[l.key].reached) / r.voters}%`, background: LAYER_TONE[l.key] }} />)}
              </span>
              <span className="text-right font-mono text-ink">{n(r.missed)}<span className="sr-only"> not reached</span></span>
            </li>
          ))}
        </ul>
        <p className="plat-hint mt-2">Bars show the share reached, split by layer (darkest: internet users). The number is voters not reached. Every constituency gets the county rates, so the bars match; the numbers differ with the size of each register.</p>
      </div>
    </div>
  );
}
