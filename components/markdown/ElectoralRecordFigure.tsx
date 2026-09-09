"use client";

import { FigureTabs } from "./FigureTabs";
import { ELECTORAL_HISTORY } from "../../data/electoral-history";
import { DISPUTED_FIGURES } from "../../data/disputed-figures";
import { COURT_OF_APPEAL_2018, IEBC_2022_RESULTS, MEDIA_2022_DECLARATION } from "../../data/sources";
import { TierBadge } from "./TierBadge";
import { DisputedFigure } from "./DisputedFigure";
import dynamic from "next/dynamic";
import { ChartFallback } from "../ChartFallback";
import { LazyMount } from "../LazyMount";
import type { Provenance } from "../../data/types";
import type { TimelinePoint } from "../charts/ElectoralTimelineChart";

const musilaDispute = DISPUTED_FIGURES.find((d) => d.id === "musila-2022-governor-votes")!;

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

/**
 * The electoral record for Kitui, as one figure.
 *
 * §1.2.6 mounted two cards back to back: a table of the three offices by cycle, then a chart of
 * the Governor race alone — same sources, same argument, two headings and two provenance
 * footers to scroll past. They are two views of one thing, so they are one figure now.
 *
 * The table is the first view because it is what prints, what a screen reader reads, and what
 * carries all three offices; the chart shows the one race where a trend across cycles is the
 * point. The chart's own small governor-race table is gone — the results table above it
 * itemises the same three rows and more.
 */
export function ElectoralRecordFigure() {
  return (
    <FigureTabs
      title="Kitui Governor, Senator and Woman Representative — Results by Cycle"
      label="Views of the electoral record"
      views={[
        {
          id: "results",
          label: "Results by office",
          provenance: [
            { source: COURT_OF_APPEAL_2018, granularity: "county" },
            { source: IEBC_2022_RESULTS, granularity: "county" },
            { source: MEDIA_2022_DECLARATION, granularity: "county" },
          ],
          content: (
            <>
      <p className="t-small text-muted mb-4 leading-relaxed pl-3.5">
        Three cycles, three different Governor-race winners. 2013 is shown as an explicit gap rather than filled in —
        see the note below and the Data Gaps Register.
      </p>

      <div className="space-y-4">
        {ELECTORAL_HISTORY.map((race, i) => (
          <div key={i} className="rounded-xl border border-line/60 bg-paper p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="t-label font-black uppercase tracking-wider text-ink">
                {race.year} · {race.office}
              </span>
            </div>

            {race.results ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left t-small">
                  <thead>
                    <tr className="t-micro uppercase tracking-wider font-bold text-muted">
                      <th className="py-1 pr-3">Candidate</th>
                      <th className="py-1 pr-3">Party</th>
                      <th className="py-1 pr-3">Votes</th>
                      <th className="py-1">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {race.results.map((r, j) => (
                      <tr key={j} className="border-t border-line/40">
                        <td className="py-1.5 pr-3 font-bold text-ink">
                          {r.candidate}
                          {r.disputedFigureId && (
                            <span className="ml-1.5 t-micro font-black uppercase tracking-wider text-danger">Disputed ↓</span>
                          )}
                        </td>
                        <td className="py-1.5 pr-3 text-ink/70">{r.party ?? "—"}</td>
                        <td className="py-1.5 pr-3 font-black text-ink">{r.votes.toLocaleString()}</td>
                        <td className="py-1.5">
                          <TierBadge tier={r.source.tier} compact />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-muted italic">{race.gapNote}</p>
            )}
          </div>
        ))}
      </div>

      <DisputedFigure entry={musilaDispute} />

    
            </>
          ),
        },
        {
          id: "governor-trend",
          label: "Governor race, charted",
          provenance: PROVENANCE,
          content: (
            <>
              <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
                Two different winners across the two cycles with sourced results. 2013 is drawn as an
                empty gap, not a zero — no sourced winner or vote total was supplied for that cycle.
              </p>

      <div className="w-full t-micro mb-4">
        <LazyMount minHeight={180}>
          <ElectoralTimelineChart data={DATA} />
        </LazyMount>
      </div>
    
            </>
          ),
        },
      ]}
    />
  );
}
