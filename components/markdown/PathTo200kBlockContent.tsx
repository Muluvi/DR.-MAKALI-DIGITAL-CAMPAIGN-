"use client";

import { LazyMount } from "../LazyMount";
import { ProvenanceLine } from "./ProvenanceLine";
import { ALL_WARDS, MWINGI_BLOC_TOTAL, CONSTITUENCIES } from "../../data/ward-register";
import { IEBC_WARD_REGISTER } from "../../data/sources";
import type { Provenance } from "../../data/types";
import PathTo200kChart, { type PathPoint } from "../charts/PathTo200kChart";

const WIN_THRESHOLD = 200_000; // §1.2.3: 198,004 actual 2022 winning total, rounded for KPI-setting.
const PROVENANCE: Provenance = { source: IEBC_WARD_REGISTER, granularity: "ward" };

const CONSTITUENCY_COLORS: Record<string, string> = {
  "kitui-central": "#0056a8",
  "kitui-south": "#e31d2b",
  "mwingi-central": "#0891b2",
  "mwingi-north": "#22d3ee",
  "kitui-east": "#b45309",
  "kitui-west": "#15803d",
  "mwingi-west": "#6d28d9",
  "kitui-rural": "#8295a9",
};

const SORTED = [...ALL_WARDS].sort((a, b) => b.voters - a.voters);
let running = 0;
const CHART_DATA: PathPoint[] = SORTED.map((w, i) => {
  running += w.voters;
  return {
    rank: i + 1,
    ward: w.name,
    constituencyName: w.constituencyName,
    voters: w.voters,
    cumulative: running,
    color: CONSTITUENCY_COLORS[w.constituencyId] ?? "#8295a9",
  };
});

export function PathTo200kBlockContent() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Path to 200,000 — Wards Ranked by Register</h4>
      </div>
      <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
        All 40 wards, ranked descending by register size (bars, coloured by constituency) with the cumulative running
        total (line) against the ~200,000-vote win threshold. <strong className="text-ink">The three Mwingi
        constituencies alone total {MWINGI_BLOC_TOTAL.toLocaleString()}</strong> — the threshold is reachable from
        that bloc on its own, a real targeting finding.
      </p>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 pl-3.5">
        {CONSTITUENCIES.map((c) => (
          <span key={c.id} className="flex items-center gap-1.5 t-micro font-black uppercase tracking-wide text-muted">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CONSTITUENCY_COLORS[c.id] }} />
            {c.name}
          </span>
        ))}
      </div>

      <div className="h-72 w-full t-micro mb-4">
        <LazyMount minHeight={288} className="h-full">
          <PathTo200kChart data={CHART_DATA} threshold={WIN_THRESHOLD} />
        </LazyMount>
      </div>

      {/* Accessible table equivalent — all 40 wards */}
      <div className="overflow-x-auto max-h-72 overflow-y-auto border border-line/40 rounded-xl">
        <table className="w-full text-left t-small">
          <caption className="sr-only">All 40 wards ranked by 2022 register size with cumulative running total</caption>
          <thead className="sticky top-0 bg-paper">
            <tr className="t-micro uppercase tracking-wider font-bold text-muted">
              <th className="py-1.5 px-2">#</th>
              <th className="py-1.5 px-2">Ward</th>
              <th className="py-1.5 px-2">Constituency</th>
              <th className="py-1.5 px-2">Voters</th>
              <th className="py-1.5 px-2">Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {CHART_DATA.map((d) => (
              <tr key={d.rank} className={`border-t border-line/30 ${d.cumulative >= WIN_THRESHOLD && d.cumulative - d.voters < WIN_THRESHOLD ? "bg-danger/5" : ""}`}>
                <td className="py-1 px-2 text-muted">{d.rank}</td>
                <td className="py-1 px-2 font-bold text-ink">{d.ward}</td>
                <td className="py-1 px-2 text-ink/70">{d.constituencyName}</td>
                <td className="py-1 px-2 text-ink/80">{d.voters.toLocaleString()}</td>
                <td className="py-1 px-2 font-black text-ink">{d.cumulative.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProvenanceLine provenance={PROVENANCE} />
    </div>
  );
}
