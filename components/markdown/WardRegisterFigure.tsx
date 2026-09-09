"use client";

import { FigureTabs } from "./FigureTabs";
import dynamic from "next/dynamic";
import type { Provenance } from "../../data/types";
import type { PathPoint } from "../charts/PathTo200kChart";
import { ChartFallback } from "../ChartFallback";
import { LazyMount } from "../LazyMount";
import { IEBC_WARD_REGISTER } from "../../data/sources";
import { WardRegisterTicker } from "../charts/WardRegisterTicker";
import { ALL_WARDS, MWINGI_BLOC_TOTAL, CONSTITUENCIES, CONSTITUENCIES_BY_SIZE, COUNTY_TOTAL_WARDS } from "../../data/ward-register";
import { useState } from "react";

// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const WardCartogram = dynamic(() => import("../charts/WardCartogram"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

// Two granularities, kept apart. The cartogram and the path are itemised ward by ward; the
// constituency view aggregates them, and saying "ward" there would overstate what that view
// shows. The three cards this figure replaces each declared their own; collapsing them to one
// would have quietly promoted the constituency figure's granularity.
const WARD_PROVENANCE: Provenance = { source: IEBC_WARD_REGISTER, granularity: "ward" };
const CONSTITUENCY_PROVENANCE: Provenance = { source: IEBC_WARD_REGISTER, granularity: "constituency" };

// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const PathTo200kChart = dynamic(() => import("../charts/PathTo200kChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

const WIN_THRESHOLD = 200_000; // §1.2.3: 198,004 actual 2022 winning total, rounded for KPI-setting.

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
const PATH_DATA: PathPoint[] = SORTED.map((w, i) => {
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

// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const ConstituencyBarChart = dynamic(() => import("../charts/ConstituencyBarChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});


const CONSTITUENCY_DATA = CONSTITUENCIES_BY_SIZE.map((c) => ({
  id: c.id,
  name: c.name,
  voters: c.voters,
  share: `${((c.voters / COUNTY_TOTAL_WARDS) * 100).toFixed(1)}%`,
}));

/**
 * The 2022 ward register, as one figure.
 *
 * §1.2.3 mounted three cards under one heading, all reading data/ward-register: the ward
 * cartogram and live stream, the cumulative path to 200,000 votes, and the constituency
 * weighting. Three headings, three framing paragraphs and three identical IEBC provenance
 * footers, for one register looked at three ways.
 *
 * The cartogram is first because it is the register itself — all 40 wards, itemised. The other
 * two are things you do with it: accumulate it toward a target, and group it by constituency.
 */
export function WardRegisterFigure() {
  // Lifted from ConstituencyWeightBlock, which owned this state before the three cards merged.
  const [selectedID, setSelectedID] = useState(CONSTITUENCY_DATA[0].id);
  const largest = CONSTITUENCIES_BY_SIZE[0];

  return (
    <FigureTabs
      title="Ward Register — 40 Wards, the Path to 200,000, and Constituency Weight"
      label="Views of the ward register"
      views={[
        {
          id: "cartogram",
          label: "All 40 wards",
          provenance: WARD_PROVENANCE,
          content: (
            <>
              <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
          One tile per ward, clustered by constituency. No ward-boundary map exists in this repository, so this grid —
          not a geographic map — is the cartogram. All 40 wards are itemised (Phase 2 of the provenance system replaced
          the previous 13-of-40 partial register).
              </p>

      {/*
        The register stream, mounted here and nowhere else.

        It used to appear three times inside one section — twice at §1.2.3, where this block and
        the path-to-200k block sit under the same heading, and again at §1.3.2, where
        InteractiveTable detected the 40-row register table and prepended another. Each mount
        renders the forty wards twice (a real list plus an aria-hidden clone the seamless loop
        needs), so a reader was being served 240 ward cards to read 40 facts.

        One mount now. The path-to-200k block keeps its own accessible table of all 40 wards,
        which is the right thing in that context, and §1.3.2's markdown table already IS the
        register. The presentational clone below remains: a marquee that loops without a visible
        seam needs two copies of the strip, and that copy is inert and hidden from assistive
        technology. It is the only duplication left.
      */}
      <WardRegisterTicker />

      <div className="min-h-[420px]">
        <LazyMount minHeight={420}>
          <WardCartogram />
        </LazyMount>
      </div>
    
            </>
          ),
        },
        {
          id: "path",
          label: "Path to 200,000",
          provenance: WARD_PROVENANCE,
          content: (
            <>
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
          <PathTo200kChart data={PATH_DATA} threshold={WIN_THRESHOLD} />
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
            {PATH_DATA.map((d) => (
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
    
            </>
          ),
        },
        {
          id: "weight",
          label: "By constituency",
          provenance: CONSTITUENCY_PROVENANCE,
          content: (
            <>
              <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
          <strong className="text-ink">{largest.name} is the largest constituency in the county register, at{" "}
          {largest.voters.toLocaleString()} voters</strong> ({((largest.voters / COUNTY_TOTAL_WARDS) * 100).toFixed(1)}%
          of the county total) — the candidate&apos;s own base is the county&apos;s heaviest constituency. That is the
          strongest structural argument he has.
              </p>

      <div className="h-64 w-full t-micro mb-4">
        <LazyMount minHeight={256} className="h-full">
          <ConstituencyBarChart chartData={CONSTITUENCY_DATA} selectedID={selectedID} onSelect={setSelectedID} />
        </LazyMount>
      </div>

      {/* Accessible table equivalent */}
      <div className="overflow-x-auto">
        <table className="w-full text-left t-small">
          <thead>
            <tr className="t-micro uppercase tracking-wider font-bold text-muted">
              <th className="py-1 pr-3">Constituency</th>
              <th className="py-1 pr-3">Registered voters</th>
              <th className="py-1">Share of county</th>
            </tr>
          </thead>
          <tbody>
            {CONSTITUENCY_DATA.map((d) => (
              <tr key={d.id} className="border-t border-line/40">
                <td className={`py-1.5 pr-3 font-bold ${d.id === "kitui-central" ? "text-accent" : "text-ink"}`}>{d.name}</td>
                <td className="py-1.5 pr-3 text-ink/80">{d.voters.toLocaleString()}</td>
                <td className="py-1.5 text-ink/80">{d.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
            </>
          ),
        },
      ]}
    />
  );
}
