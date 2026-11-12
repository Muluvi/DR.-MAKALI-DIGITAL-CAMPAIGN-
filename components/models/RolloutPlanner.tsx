"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalendarEntry } from "@/lib/public-data";
import { fmtWeeks, planRollout, validDay, weeksBetween, type RolloutInputs } from "@/lib/models/rollout";
import { ToolActions } from "@/components/tools/public/ToolActions";
import { InstructionBox } from "./InstructionBox";
import { parseRollout } from "@/lib/models/instruct/parse";
import { explainRollout } from "@/lib/models/instruct/explain";

const day = (iso: string) => (iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "–");

/** Link keys, kept short so a shared scenario fits in a message. */
const PARAMS = { start: "start", discoveryWeeks: "d", readinessWeeks: "r", pilotWeeks: "p", pilotConstituencies: "pc", perWave: "pw", weeksPerWave: "ww", readinessBeforePollWeeks: "f", deadline: "by" } as const;
type Key = keyof typeof PARAMS;
const NUMBERS: { key: Exclude<Key, "start" | "deadline">; label: string; min: number; max: number; hint?: string }[] = [
  { key: "discoveryWeeks", label: "Discovery (weeks)", min: 1, max: 12 },
  { key: "readinessWeeks", label: "Readiness (weeks)", min: 1, max: 20 },
  { key: "pilotWeeks", label: "Pilot (weeks)", min: 1, max: 20 },
  { key: "pilotConstituencies", label: "Constituencies in the pilot", min: 0, max: 8, hint: "Besides the centre" },
  { key: "perWave", label: "Constituencies per rollout wave", min: 1, max: 8 },
  { key: "weeksPerWave", label: "Weeks per wave", min: 1, max: 12, hint: "Training by role, then a week of supported use" },
  { key: "readinessBeforePollWeeks", label: "Election-day readiness (weeks before polling day)", min: 1, max: 12, hint: "When changes freeze" },
];

export type RolloutDefaults = Omit<RolloutInputs, "start" | "deadline">;

export function RolloutPlanner({ calendar, pollingDay, defaultStart, defaultDeadline, defaults, constituencies, initial, embedded = false }: { calendar: CalendarEntry[]; pollingDay: string; defaultStart: string; defaultDeadline: string; defaults: RolloutDefaults; constituencies: number; initial: Partial<Record<string, string>>; embedded?: boolean }) {
  const anchors = useMemo(() => calendar.filter((c) => c.date < pollingDay), [calendar, pollingDay]);
  const [v, setV] = useState<RolloutInputs>(() => {
    const out: RolloutInputs = { start: defaultStart, deadline: defaultDeadline, ...defaults };
    const s = initial[PARAMS.start];
    if (s && validDay(s)) out.start = s;
    const by = initial[PARAMS.deadline];
    if (by && anchors.some((a) => a.date === by)) out.deadline = by;
    for (const f of NUMBERS) {
      const raw = Number(initial[PARAMS[f.key]]);
      if (initial[PARAMS[f.key]] !== undefined && Number.isFinite(raw)) out[f.key] = Math.min(f.max, Math.max(f.min, Math.floor(raw)));
    }
    return out;
  });

  useEffect(() => {
    if (embedded) return;
    const p = new URLSearchParams();
    for (const k of Object.keys(PARAMS) as Key[]) p.set(PARAMS[k], String(v[k]));
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [v, embedded]);

  const ok = validDay(v.start) && v.start < pollingDay;
  const plan = useMemo(() => (ok ? planRollout(v, constituencies, pollingDay) : null), [v, ok, constituencies, pollingDay]);
  const deadlineEntry = anchors.find((a) => a.date === v.deadline);
  const span = ok ? weeksBetween(v.start, pollingDay) : 0;
  const pos = (iso: string) => `${Math.min(100, Math.max(0, (100 * weeksBetween(v.start, iso)) / span))}%`;
  const markers = ok ? calendar.filter((c) => c.date >= v.start && c.date <= pollingDay) : [];

  const instruct = (text: string) => {
    const r = parseRollout(text, v, anchors, defaultStart);
    setV(r.next);
    return r;
  };
  return (
    <div>
      <InstructionBox onRun={instruct} explanation={plan ? explainRollout(plan, deadlineEntry ? `${deadlineEntry.event} (${day(deadlineEntry.date)})` : "the deadline") : ["Enter a start date before polling day to see the plan."]} examples={["start 1 February; pilot 8 weeks", "waves of 2; 4 weeks per wave", "finish before the chief agents are submitted", "discovery 3 weeks, readiness 4 weeks"]} />
      <div className="plat-card grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        <label className="plat-label">Start date
          <input className="plat-input mt-1" type="date" value={v.start} onChange={(e) => setV({ ...v, start: e.target.value })} />
          <span className="plat-hint block">The week the first phase is approved</span>
        </label>
        {NUMBERS.map((f) => (
          <label key={f.key} className="plat-label">{f.label}
            <input className="plat-input mt-1" type="number" inputMode="numeric" min={f.min} max={f.max} step="1" value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: Math.min(f.max, Math.max(f.min, Math.floor(Number(e.target.value) || f.min))) })} />
            {f.hint && <span className="plat-hint block">{f.hint}</span>}
          </label>
        ))}
        <label className="plat-label sm:col-span-2 lg:col-span-2">Rollout must finish before
          <select className="plat-input mt-1" value={v.deadline} onChange={(e) => setV({ ...v, deadline: e.target.value })}>
            {anchors.map((a) => <option key={`${a.date}-${a.event}`} value={a.date}>{day(a.date)}: {a.event}</option>)}
          </select>
          <span className="plat-hint block">A gazetted date. Which one the field operation must be reporting by is the campaign&apos;s call.</span>
        </label>
      </div>

      {!ok || !plan ? (
        <p className="mt-4 text-ink" role="status">Enter a start date before polling day to see the plan.</p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <p className="max-w-2xl text-ink" role="status">
              All 40 wards are reporting by <strong>{day(plan.rolloutEnd)}</strong>,{" "}
              {plan.slackToDeadline >= 0 ? <>{fmtWeeks(plan.slackToDeadline)} before</> : <strong>{fmtWeeks(-plan.slackToDeadline)} after</strong>}{" "}
              {deadlineEntry ? <>the deadline you chose, {day(deadlineEntry.date)} ({deadlineEntry.event})</> : "the deadline"}.{" "}
              {plan.optimisationWeeks >= 0 ? <>That leaves {fmtWeeks(plan.optimisationWeeks)} of steady running before changes freeze.</> : null}
            </p>
            <ToolActions link={!embedded} filename="kitui-platform-rollout.csv" rows={() => [["phase", "name", "start", "end", "weeks", "what_it_delivers"], ...plan.phases.map((p) => [p.n, p.label, p.start, p.end, p.weeks, p.note])]} />
          </div>
          {plan.warnings.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-xl border border-[color:var(--danger)] p-3 text-[0.9rem] text-[color:var(--danger)]" role="alert">{plan.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
          )}

          <figure className="plat-card mt-4 p-4">
            <figcaption className="text-[0.85rem] font-semibold text-ink">From the start date to polling day, {day(pollingDay)}</figcaption>
            <div className="mt-3 space-y-2">
              {plan.phases.map((p) => (
                <div key={p.n} className="grid grid-cols-[8.5rem_minmax(0,1fr)] items-center gap-2 text-[0.8rem] sm:grid-cols-[11rem_minmax(0,1fr)]">
                  <span className="truncate text-ink">{p.n}. {p.label}</span>
                  <div className="relative h-6 rounded bg-paper">
                    {p.start && p.end && (
                      <div className="absolute inset-y-0 rounded bg-accent-solid" style={{ left: pos(p.start), width: `calc(${pos(p.end)} - ${pos(p.start)} + 2px)`, opacity: p.n === 5 ? 0.45 : 1 }} title={`${day(p.start)} to ${day(p.end)}`} />
                    )}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-2 text-[0.75rem] sm:grid-cols-[11rem_minmax(0,1fr)]">
                <span className="text-muted">Gazetted dates</span>
                <div className="relative h-5">
                  {markers.map((m) => <span key={`${m.date}-${m.event}`} className={`absolute top-0 h-5 w-[2px] ${m.date === v.deadline ? "bg-[color:var(--danger)]" : "bg-muted"}`} style={{ left: pos(m.date) }} title={`${day(m.date)}: ${m.event}`} />)}
                </div>
              </div>
            </div>
            <p className="plat-hint mt-2">Each tick is a gazetted date; the red one is the deadline you chose. Hover or tap a bar or tick for its dates.</p>
          </figure>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-[0.88rem]">
              <thead className="text-muted"><tr><th className="py-2 pr-3">Phase</th><th className="py-2 pr-3">From</th><th className="py-2 pr-3">To</th><th className="py-2 pr-3 text-right">Weeks</th><th className="py-2">What it delivers</th></tr></thead>
              <tbody>
                {plan.phases.map((p) => (
                  <tr key={p.n} className="border-t border-line text-ink">
                    <td className="py-2 pr-3 font-semibold">{p.n}. {p.label}</td>
                    <td className="py-2 pr-3 font-mono text-[0.82rem]">{day(p.start)}</td>
                    <td className="py-2 pr-3 font-mono text-[0.82rem]">{day(p.end)}</td>
                    <td className="py-2 pr-3 text-right font-mono">{Math.round(p.weeks * 10) / 10}</td>
                    <td className="py-2 text-muted">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plan.waves.length > 0 && (
            <p className="mt-3 text-[0.88rem] text-muted">Rollout waves: {plan.waves.map((w) => `wave ${w.n}, ${w.constituencies} constituenc${w.constituencies === 1 ? "y" : "ies"}, ${day(w.start)} to ${day(w.end)}`).join("; ")}.</p>
          )}
        </>
      )}
    </div>
  );
}
