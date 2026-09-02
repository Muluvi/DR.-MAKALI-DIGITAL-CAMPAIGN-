"use client";

import { LazyMount } from "../LazyMount";
import { ProvenanceLine } from "./ProvenanceLine";
import { COURT_OF_APPEAL_2018, IEBC_2022_RESULTS } from "../../data/sources";
import type { Provenance } from "../../data/types";
import ElectoralTimelineChart, { type TimelinePoint } from "../charts/ElectoralTimelineChart";

const DATA: TimelinePoint[] = [
  { year: "2013", winner: null, votes: null, color: "transparent" },
  { year: "2017", winner: "Ngilu", votes: 169990, color: "#e31d2b" },
  { year: "2022", winner: "Malombe", votes: 198004, color: "#0056a8" },
];

const PROVENANCE: Provenance[] = [
  { source: COURT_OF_APPEAL_2018, granularity: "county" },
  { source: IEBC_2022_RESULTS, granularity: "county" },
];

export function ElectoralTimelineBlockContent() {
  return (
    <div className="not-prose bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Governor-Race Winner by Cycle</h4>
      </div>
      <p className="text-[11px] text-muted mb-3 leading-relaxed pl-3.5">
        Two different winners across the two cycles with sourced results. 2013 is drawn as an empty gap, not a zero —
        no sourced winner or vote total was supplied for that cycle.
      </p>

      <div className="w-full text-[9px] mb-4">
        <LazyMount minHeight={180}>
          <ElectoralTimelineChart data={DATA} />
        </LazyMount>
      </div>

      {/* Accessible table equivalent */}
      <div className="overflow-x-auto">
        <table className="data-table text-left text-[11px]">
          <thead>
            <tr className="text-[9px] uppercase tracking-wider font-bold text-muted">
              <th className="py-1 pr-3">Year</th>
              <th className="py-1 pr-3">Winner</th>
              <th className="py-1">Votes</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((d) => (
              <tr key={d.year} className="border-t border-line/40">
                <td className="py-1.5 pr-3 font-bold text-ink">{d.year}</td>
                <td className="py-1.5 pr-3 text-ink/80">{d.winner ?? <span className="italic text-muted">No sourced result</span>}</td>
                <td className="py-1.5 text-ink/80">{d.votes !== null ? d.votes.toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProvenanceLine provenance={PROVENANCE} />
    </div>
  );
}
