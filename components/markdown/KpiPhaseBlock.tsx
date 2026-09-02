"use client";

import { LazyMount } from "../LazyMount";
import { PHASES, phaseColor } from "../../lib/phases";
import KpiPhaseBarChart, { type KpiRow } from "../charts/KpiPhaseBarChart";

function points(values: Partial<Record<string, number>>): KpiRow["points"] {
  // JS reorders integer-like object keys ("1", "2", "3") ahead of non-numeric ones ("neg1")
  // regardless of insertion order, so phase sequence is taken explicitly from PHASES rather
  // than trusted to Object.entries().
  return PHASES.filter((phase) => typeof values[phase.id] === "number").map((phase) => ({
    phaseId: phase.id,
    phaseLabel: phase.label,
    value: values[phase.id] as number,
    color: phaseColor(phase.id),
  }));
}

// Section 20 phase KPI tables. Phases marked "Not live" in the source are omitted rather than
// plotted as zero. There is no "actual achieved" series in a forward-looking proposal — this
// shows how each target ramps across phases, not actual-vs-target.
const ROWS: KpiRow[] = [
  {
    label: "Consented SMS contacts",
    unit: "contacts",
    points: points({ neg1: 15000, "1": 40000, "2": 80000, "3": 120000 }),
  },
  {
    label: "USSD unique sessions",
    unit: "sessions",
    points: points({ "1": 5000, "2": 25000, "3": 60000 }),
  },
  {
    label: "Tracker reports received",
    unit: "reports",
    points: points({ "1": 500, "2": 3000, "3": 8000 }),
  },
  {
    label: "Combined social reach",
    unit: "people",
    points: points({ neg1: 400000, "1": 1000000, "2": 3000000, "3": 5000000 }),
  },
  {
    label: "Engaged followers",
    unit: "followers",
    points: points({ neg1: 20000, "1": 50000, "2": 150000, "3": 250000 }),
  },
];

export function KpiPhaseBlock() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">KPI Targets by Phase</h4>
      </div>
      <p className="t-small text-muted mb-4 leading-relaxed pl-3.5">
        This is a proposal, not a report — there are no achieved results to plot yet. Each marker is the stated target
        for that phase; phases the tables mark {"“"}Not live{"”"} are omitted rather than shown as zero.
      </p>
      <div className="flex flex-wrap gap-3 mb-5 pl-3.5">
        {PHASES.map((p) => (
          <span key={p.id} className="flex items-center gap-1.5 t-micro font-black uppercase tracking-wide text-muted">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `var(${p.colorVar})` }} />
            {p.label}
          </span>
        ))}
      </div>
      <div className="min-h-[360px]">
        <LazyMount minHeight={360}>
          <KpiPhaseBarChart rows={ROWS} />
        </LazyMount>
      </div>
    </div>
  );
}
