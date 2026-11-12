"use client";

import { useEffect, useMemo, useState } from "react";
import { allChannels, coverage, sharesTotal, type ContentCode, type PlanRow } from "@/lib/models/brief-mix";

type TypeRow = { code: ContentCode; short: string };
const CODES: ContentCode[] = ["P1", "P2", "P3", "P4"];

export function BriefMix({ plan, types, languages, sizes, initial, embedded = false }: { plan: PlanRow[]; types: TypeRow[]; languages: string[]; sizes: Record<string, string>; initial: { s?: string; l?: string; c?: string; min?: string }; embedded?: boolean }) {
  const channels = useMemo(() => allChannels(plan), [plan]);
  const [shares, setShares] = useState<Record<ContentCode, number>>(() => {
    const p = (initial.s ?? "").split("-").map(Number);
    return p.length === 4 && p.every(Number.isFinite) ? { P1: p[0], P2: p[1], P3: p[2], P4: p[3] } : { P1: 25, P2: 25, P3: 25, P4: 25 };
  });
  const [langs, setLangs] = useState<string[]>(() => (initial.l ? initial.l.split("~").filter((x) => languages.includes(x)) : languages));
  const [chans, setChans] = useState<string[]>(() => (initial.c ? initial.c.split("~").filter((x) => channels.includes(x)) : channels));
  const [minShare, setMinShare] = useState<number>(() => (Number.isFinite(Number(initial.min)) && initial.min ? Number(initial.min) : 10));

  useEffect(() => {
    if (embedded) return;
    const p = new URLSearchParams({ s: CODES.map((c) => shares[c]).join("-"), l: langs.join("~"), c: chans.join("~"), min: String(minShare) });
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [shares, langs, chans, minShare, embedded]);

  const result = useMemo(() => coverage(plan, { shares, languages: langs, channels: chans, minShare }), [plan, shares, langs, chans, minShare]);
  const total = sharesTotal(shares);
  const covered = result.filter((r) => r.covered).length;
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div>
      <div className="plat-card grid gap-5 p-4 sm:p-5 lg:grid-cols-3">
        <fieldset className="lg:col-span-1">
          <legend className="font-semibold text-ink">Share of the week, by content type</legend>
          {types.map((t) => (
            <label key={t.code} className="mt-2 block text-[0.85rem] text-muted">
              {t.code} · {t.short} <output className="float-right font-mono text-ink">{shares[t.code]}%</output>
              <input className="mt-1 block w-full" type="range" min="0" max="100" step="5" value={shares[t.code]} onChange={(e) => setShares({ ...shares, [t.code]: Number(e.target.value) })} aria-label={`${t.code} share of the week`} />
            </label>
          ))}
          <p className={`plat-hint mt-2 ${total === 100 ? "" : "text-[color:var(--danger)]"}`}>Total {total}%. The weekly brief&apos;s weights must total 100.</p>
          <label className="mt-3 block text-[0.85rem] text-muted">A content type counts once it has <output className="font-mono text-ink">{minShare}%</output> of the week
            <input className="mt-1 block w-full" type="range" min="0" max="50" step="5" value={minShare} onChange={(e) => setMinShare(Number(e.target.value))} aria-label="Minimum share for a content type to count" />
          </label>
        </fieldset>
        <fieldset>
          <legend className="font-semibold text-ink">Languages this week</legend>
          {languages.map((l) => <label key={l} className="mt-2 flex items-center gap-2 text-[0.9rem] text-ink"><input type="checkbox" checked={langs.includes(l)} onChange={() => toggle(langs, setLangs, l)} />{l}</label>)}
        </fieldset>
        <fieldset>
          <legend className="font-semibold text-ink">Channels this week</legend>
          <div className="grid grid-cols-2 gap-x-3">
            {channels.map((c) => <label key={c} className="mt-2 flex items-center gap-2 text-[0.9rem] text-ink"><input type="checkbox" checked={chans.includes(c)} onChange={() => toggle(chans, setChans, c)} />{c}</label>)}
          </div>
        </fieldset>
      </div>

      <p className="mt-4 text-ink" role="status"><strong>{covered} of {result.length}</strong> segments are covered this week.</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {result.map((r) => (
          <li key={r.row.id} className={`plat-card p-4 ${r.covered ? "" : "border-dashed"}`}>
            <span className={`plat-chip ${r.covered ? "plat-status-live" : "plat-status-paused"}`}>{r.covered ? "Covered" : "Missed"}</span>
            <h3 className="mt-2 font-semibold text-ink">{r.row.name}</h3>
            <p className="text-[0.8rem] text-muted">{sizes[r.row.id]}</p>
            <p className="mt-2 text-[0.85rem] text-muted">Content type {r.row.pillar}; {r.row.languages.join(", ")}; {r.row.channels.join(", ")}.</p>
            {!r.covered && <p className="mt-2 text-[0.85rem] text-ink">Missed because {r.reasons.join("; ")}.</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
