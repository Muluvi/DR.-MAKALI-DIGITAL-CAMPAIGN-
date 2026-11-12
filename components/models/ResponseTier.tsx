"use client";

import { useEffect, useMemo, useState } from "react";
import { classify, KINDS, SPREADS, type Incident, type KindKey, type SpreadKey, type Tier } from "@/lib/models/response-tier";
import { InstructionBox } from "./InstructionBox";
import { parseIncident } from "@/lib/models/instruct/parse";
import { explainTier } from "@/lib/models/instruct/explain";

export type HoldingLine = { question: string; attack: string; holding: string; kikamba: string; source: string };

export function ResponseTier({ tiers, lines, initial, embedded = false }: { tiers: Tier[]; lines: HoldingLine[]; initial: Record<string, string | undefined>; embedded?: boolean }) {
  const [i, setI] = useState<Incident>(() => ({
    kind: (KINDS.some((k) => k.key === initial.kind) ? initial.kind : "rumour") as KindKey,
    spread: (SPREADS.some((s) => s.key === initial.spread) ? initial.spread : "wards") as SpreadKey,
    views: Number.isFinite(Number(initial.views)) && initial.views ? Number(initial.views) : 200,
    wardGroups: Number.isFinite(Number(initial.groups)) && initial.groups ? Number(initial.groups) : 1,
    fringe: initial.fringe === "1",
  }));
  const [line, setLine] = useState<number>(() => (Number.isInteger(Number(initial.line)) && initial.line ? Number(initial.line) : -1));

  useEffect(() => {
    if (embedded) return;
    const p = new URLSearchParams({ kind: i.kind, spread: i.spread, views: String(i.views), groups: String(i.wardGroups), fringe: i.fringe ? "1" : "0", line: String(line) });
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [i, line, embedded]);

  const r = useMemo(() => classify(tiers, i), [tiers, i]);
  const pick = line >= 0 ? lines[line] : null;
  const set = <K extends keyof Incident>(k: K, v: Incident[K]) => setI({ ...i, [k]: v });

  const instruct = (text: string) => {
    const p = parseIncident(text, i, lines);
    const { line: l, ...incident } = p.next;
    setI(incident);
    if (l >= 0) setLine(l);
    return p;
  };
  return (
    <div>
      <InstructionBox onRun={instruct} explanation={explainTier(r)} examples={["a doctored video of him, 4,200 views, county-wide", "mentioned on vernacular radio this morning", "a rumour in 4 ward WhatsApp groups that he will favour Kitui Central"]} />
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="plat-card grid content-start gap-4 p-4 sm:p-5">
        <label className="plat-label">What happened
          <select className="plat-input mt-1" value={i.kind} onChange={(e) => set("kind", e.target.value as KindKey)}>{KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}</select>
        </label>
        <label className="plat-label">Where it is
          <select className="plat-input mt-1" value={i.spread} onChange={(e) => set("spread", e.target.value as SpreadKey)}>{SPREADS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}</select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="plat-label">Views so far
            <input className="plat-input mt-1" type="number" min="0" inputMode="numeric" value={i.views} onChange={(e) => set("views", Math.max(0, Number(e.target.value) || 0))} />
          </label>
          <label className="plat-label">Ward WhatsApp groups carrying it
            <input className="plat-input mt-1" type="number" min="0" inputMode="numeric" value={i.wardGroups} onChange={(e) => set("wardGroups", Math.max(0, Number(e.target.value) || 0))} />
          </label>
        </div>
        <label className="flex items-center gap-2 text-[0.9rem] text-ink"><input type="checkbox" checked={i.fringe} onChange={(e) => set("fringe", e.target.checked)} />From a fringe blog or anonymous account</label>
        <label className="plat-label">Line of attack, if it matches one
          <select className="plat-input mt-1" value={line} onChange={(e) => setLine(Number(e.target.value))}>
            <option value={-1}>None of the prepared lines</option>
            {lines.map((l, n) => <option key={l.question} value={n}>{l.question.replace(/^\d+\.\s*/, "")}</option>)}
          </select>
        </label>
        <p className="plat-hint">Describe the incident, not the people in it. Nothing you enter is stored.</p>
      </div>

      <section className="plat-card p-4 sm:p-5" aria-live="polite" aria-labelledby="tier-name">
        <p className="plat-kicker">Severity tier</p>
        <h2 id="tier-name" className="mt-2 font-serif text-3xl text-ink">{r.tier.name}</h2>
        <p className="mt-1 text-[0.9rem] text-muted">{r.rule}</p>
        {r.flagged && <p className="mt-2 rounded-lg border border-line p-2 text-[0.88rem] text-ink">{r.flagged}</p>}
        <dl className="mt-4 grid gap-3 text-[0.9rem] sm:grid-cols-2">
          <div><dt className="font-semibold text-ink">What the campaign does</dt><dd className="text-muted">{r.tier.protocol}</dd></div>
          <div><dt className="font-semibold text-ink">How fast</dt><dd className="text-muted">{r.tier.turnaround}</dd></div>
          <div><dt className="font-semibold text-ink">Drafted by</dt><dd className="text-muted">{r.tier.draftedBy}</dd></div>
          <div><dt className="font-semibold text-ink">Approved by</dt><dd className="text-muted">{r.tier.approvedBy}</dd></div>
        </dl>
        {pick && (
          <div className="mt-5 border-t border-line pt-4 text-[0.9rem]">
            <h3 className="font-semibold text-ink">The holding line to start from</h3>
            <p className="mt-1 text-muted">Attack: {pick.attack}</p>
            <p className="mt-2 text-ink">{pick.holding}</p>
            <p className="mt-2 italic text-muted" lang="kam">{pick.kikamba}</p>
            <p className="mt-2 text-[0.8rem] text-muted">Source: {pick.source}</p>
          </div>
        )}
        <p className="mt-4 text-[0.8rem] text-muted">No tier answers by bulk SMS: political SMS is lodged with the operator 48 hours ahead, so it cannot carry a rapid response.</p>
      </section>
    </div>
    </div>
  );
}
