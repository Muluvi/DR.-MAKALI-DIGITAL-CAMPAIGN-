"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { RACE_CALENDAR } from "@/lib/public-data";
import { ELECTION_DAY } from "@/lib/phases";
import { fmtWeeks, planRollout, validDay, weeksBetween, type RolloutInputs } from "@/lib/models/rollout";
import { CAMPAIGN_START, ROLLOUT_DEFAULTS, nextMonday } from "@/lib/models/rollout-defaults";
import { PUBLIC_CONSTITUENCIES } from "@/lib/public-data";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { parseRollout } from "@/lib/models/instruct/parse";
import { explainRollout } from "@/lib/models/instruct/explain";
import { ToolShell, fmt } from "../ToolShell";
import { ToolActions } from "../ToolActions";
import { InstructionBox } from "./InstructionBox";

const day = (iso: string) => (iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "–");
const NUMBERS: { key: Exclude<keyof RolloutInputs, "start" | "deadline">; label: string; min: number; max: number; hint?: string }[] = [
  { key: "discoveryWeeks", label: "Discovery (weeks)", min: 1, max: 12 },
  { key: "readinessWeeks", label: "Readiness (weeks)", min: 1, max: 20 },
  { key: "pilotWeeks", label: "Pilot (weeks)", min: 1, max: 20 },
  { key: "pilotConstituencies", label: "Constituencies in the pilot", min: 0, max: 8, hint: "Besides the centre" },
  { key: "perWave", label: "Constituencies per rollout wave", min: 1, max: 8 },
  { key: "weeksPerWave", label: "Weeks per wave", min: 1, max: 12, hint: "Training by role, then a week of supported use" },
  { key: "readinessBeforePollWeeks", label: "Freeze before polling day (weeks)", min: 1, max: 12, hint: "When changes stop" },
];
const ANCHORS = RACE_CALENDAR.filter((c) => c.date < ELECTION_DAY);

function Model() {
  const start = useMemo(() => nextMonday(), []);
  const defaults = useMemo<RolloutInputs>(() => ({ start, deadline: CAMPAIGN_START?.date ?? ELECTION_DAY, ...ROLLOUT_DEFAULTS }), [start]);
  const [v, setV] = useState<RolloutInputs>(defaults);
  const shown = useDeferredValue(v);
  const ok = validDay(shown.start) && shown.start < ELECTION_DAY;
  const plan = useMemo(() => (ok ? planRollout(shown, PUBLIC_CONSTITUENCIES.length, ELECTION_DAY) : null), [shown, ok]);
  const base = useMemo(() => planRollout(defaults, PUBLIC_CONSTITUENCIES.length, ELECTION_DAY), [defaults]);
  const deadline = ANCHORS.find((a) => a.date === v.deadline);
  const span = ok ? weeksBetween(shown.start, ELECTION_DAY) : 0;
  const pos = (iso: string) => `${Math.min(100, Math.max(0, (100 * weeksBetween(shown.start, iso)) / span))}%`;
  const markers = ok ? RACE_CALENDAR.filter((c) => c.date >= shown.start && c.date <= ELECTION_DAY) : [];
  const instruct = (text: string) => {
    const r = parseRollout(text, v, ANCHORS, start);
    setV(r.next);
    return r;
  };

  return (
    <div className="grid gap-4">
      <div className="panel grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="field">Start date<input className="input" type="date" value={v.start} onChange={(e) => setV({ ...v, start: e.target.value })} /><span className="hint">The week the first phase is approved</span></label>
        {NUMBERS.map((f) => (
          <label key={f.key} className="field">{f.label}
            <input className="input" type="number" inputMode="numeric" min={f.min} max={f.max} step="1" value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: Math.min(f.max, Math.max(f.min, Math.floor(Number(e.target.value) || f.min))) })} />
            {f.hint && <span className="hint">{f.hint}</span>}
          </label>
        ))}
        <label className="field sm:col-span-2 lg:col-span-2">Rollout must finish before
          <select className="input" value={v.deadline} onChange={(e) => setV({ ...v, deadline: e.target.value })}>{ANCHORS.map((a) => <option key={`${a.date}-${a.event}`} value={a.date}>{day(a.date)}: {a.event}</option>)}</select>
        </label>
      </div>

      {!plan ? (
        <p className="result" role="status">Enter a start date before polling day to see the plan.</p>
      ) : (
        <>
          <dl className="compare" aria-live="polite">
            <div><dt>Default plan</dt><dd>{day(base.rolloutEnd)}</dd><span className="delta">{base.slackToDeadline >= 0 ? `${fmtWeeks(base.slackToDeadline)} to spare` : `${fmtWeeks(-base.slackToDeadline)} late`}</span></div>
            <div className="is-scenario"><dt>Your plan</dt><dd>{day(plan.rolloutEnd)}</dd><span className="delta">{plan.slackToDeadline >= 0 ? `${fmtWeeks(plan.slackToDeadline)} to spare` : `${fmtWeeks(-plan.slackToDeadline)} late`}</span></div>
          </dl>
          <div className="result" role="status">
            <p>All 40 wards are reporting by <strong>{day(plan.rolloutEnd)}</strong>, {plan.slackToDeadline >= 0 ? `${fmtWeeks(plan.slackToDeadline)} before` : <strong>{fmtWeeks(-plan.slackToDeadline)} after</strong>} {deadline ? `${deadline.event} (${day(deadline.date)})` : "the deadline"}.</p>
            {plan.optimisationWeeks >= 0 && <p>That leaves {fmtWeeks(plan.optimisationWeeks)} of steady running before changes freeze.</p>}
            {plan.warnings.map((w) => <p key={w} className="is-bad">{w}</p>)}
          </div>
          <figure className="panel m-0">
            <figcaption className="small font-bold">From the start date to polling day, {day(ELECTION_DAY)}</figcaption>
            <div className="mt-3 grid gap-2">
              {plan.phases.map((p) => (
                <div key={p.n} className="grid grid-cols-[8rem_minmax(0,1fr)] items-center gap-2 small sm:grid-cols-[11rem_minmax(0,1fr)]">
                  <span className="truncate">{p.label}</span>
                  <div className="relative h-6 rounded" style={{ background: "var(--card)" }}>
                    {p.start && p.end && <div className="absolute inset-y-0 rounded" style={{ left: pos(p.start), width: `calc(${pos(p.end)} - ${pos(p.start)} + 2px)`, background: "var(--accent-solid)" }} title={`${day(p.start)} to ${day(p.end)}`} />}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-2 small sm:grid-cols-[11rem_minmax(0,1fr)]">
                <span className="muted">Gazetted dates</span>
                <div className="relative h-5">{markers.map((m) => <span key={`${m.date}-${m.event}`} className="absolute top-0 h-5 w-[2px]" style={{ left: pos(m.date), background: m.date === v.deadline ? "var(--danger)" : "var(--muted)" }} title={`${day(m.date)}: ${m.event}`} />)}</div>
              </div>
            </div>
            <p className="source">Each tick is a gazetted date; the red one is the deadline you chose.</p>
          </figure>
          <div className="flex justify-end"><ToolActions filename="kitui-platform-rollout.csv" rows={() => [["phase", "name", "start", "end", "weeks", "what_it_delivers"], ...plan.phases.map((p) => [p.n, p.label, p.start, p.end, p.weeks, p.note])]} /></div>
          <div className="table-wrap m-0" tabIndex={0} role="region" aria-label="Rollout phases">
            <table>
              <thead><tr><th>Phase</th><th>From</th><th>To</th><th className="num">Weeks</th><th>What it delivers</th></tr></thead>
              <tbody>{plan.phases.map((p) => <tr key={p.n}><th scope="row">{p.label}</th><td>{day(p.start)}</td><td>{day(p.end)}</td><td className="num">{fmt(p.weeks, 1)}</td><td className="muted">{p.note}</td></tr>)}</tbody>
            </table>
          </div>
          {plan.waves.length > 0 && <p className="small muted m-0">Rollout waves: {plan.waves.map((w) => `wave ${w.n}, ${w.constituencies} constituenc${w.constituencies === 1 ? "y" : "ies"}, ${day(w.start)} to ${day(w.end)}`).join("; ")}.</p>}
        </>
      )}
      <InstructionBox onRun={instruct} explanation={plan ? explainRollout(plan, deadline ? `${deadline.event} (${day(deadline.date)})` : "the deadline") : ["Enter a start date before polling day to see the plan."]} examples={EXAMPLES["rollout-planner"]} />
    </div>
  );
}

export default function RolloutPlanner() {
  return (
    <ToolShell kicker="Model" title="Rollout planner" question="Does the platform reach all 40 wards in time? Set the start date, phase lengths, pilot size and waves." source="Source: IEBC Gazette Notices 13497 to 13503, 20 August 2026 (the race calendar)">
      <Model />
    </ToolShell>
  );
}
