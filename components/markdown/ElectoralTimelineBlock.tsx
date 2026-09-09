"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";
import { LazyMount } from "../LazyMount";
import { COURT_OF_APPEAL_2018, IEBC_2022_RESULTS } from "../../data/sources";
import type { Provenance } from "../../data/types";
import type { TimelinePoint } from "../charts/ElectoralTimelineChart";
import { FigureBlock } from "./FigureBlock";
// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const ElectoralTimelineChart = dynamic(() => import("../charts/ElectoralTimelineChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

const DATA: TimelinePoint[] = [
  { year: "2013", winner: null, votes: null, color: "transparent" },
  { year: "2017", winner: "Ngilu", votes: 169990, color: "#e31d2b" },
  { year: "2022", winner: "Malombe", votes: 198004, color: "#0056a8" },
];

const PROVENANCE: Provenance[] = [
  { source: COURT_OF_APPEAL_2018, granularity: "county" },
  { source: IEBC_2022_RESULTS, granularity: "county" },
];

export function ElectoralTimelineBlock() {
  return (
    <FigureBlock
      title="Governor-Race Winner by Cycle"
      subtitle={
        <>
          Two different winners across the two cycles with sourced results. 2013 is drawn as an empty gap, not a zero —
          no sourced winner or vote total was supplied for that cycle.
        </>
      }
      provenance={PROVENANCE}
    >

      <div className="w-full t-micro mb-4">
        <LazyMount minHeight={180}>
          <ElectoralTimelineChart data={DATA} />
        </LazyMount>
      </div>

      {/* Accessible table equivalent */}
      <div className="overflow-x-auto">
        <table className="data-table text-left t-small">
          <thead>
            <tr className="t-micro uppercase tracking-wider font-bold text-muted">
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
    </FigureBlock>
  );
}
