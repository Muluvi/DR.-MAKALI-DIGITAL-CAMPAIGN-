"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";
import { useState } from "react";
import { LazyMount } from "../LazyMount";
import { CONSTITUENCIES_BY_SIZE, COUNTY_TOTAL_WARDS } from "../../data/ward-register";
import { IEBC_WARD_REGISTER } from "../../data/sources";
import type { Provenance } from "../../data/types";
import { FigureBlock } from "./FigureBlock";
// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const ConstituencyBarChart = dynamic(() => import("../charts/ConstituencyBarChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

const PROVENANCE: Provenance = { source: IEBC_WARD_REGISTER, granularity: "constituency" };

const CHART_DATA = CONSTITUENCIES_BY_SIZE.map((c) => ({
  id: c.id,
  name: c.name,
  voters: c.voters,
  share: `${((c.voters / COUNTY_TOTAL_WARDS) * 100).toFixed(1)}%`,
}));

export function ConstituencyWeightBlock() {
  const [selectedID, setSelectedID] = useState(CHART_DATA[0].id);
  const largest = CONSTITUENCIES_BY_SIZE[0];

  return (
    <FigureBlock
      title="Constituency Weight — All Eight, by Register"
      subtitle={
        <>
          <strong className="text-ink">{largest.name} is the largest constituency in the county register, at{" "}
          {largest.voters.toLocaleString()} voters</strong> ({((largest.voters / COUNTY_TOTAL_WARDS) * 100).toFixed(1)}%
          of the county total) — the candidate&apos;s own base is the county&apos;s heaviest constituency. That is the
          strongest structural argument he has.
        </>
      }
      provenance={PROVENANCE}
    >

      <div className="h-64 w-full t-micro mb-4">
        <LazyMount minHeight={256} className="h-full">
          <ConstituencyBarChart chartData={CHART_DATA} selectedID={selectedID} onSelect={setSelectedID} />
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
            {CHART_DATA.map((d) => (
              <tr key={d.id} className="border-t border-line/40">
                <td className={`py-1.5 pr-3 font-bold ${d.id === "kitui-central" ? "text-accent" : "text-ink"}`}>{d.name}</td>
                <td className="py-1.5 pr-3 text-ink/80">{d.voters.toLocaleString()}</td>
                <td className="py-1.5 text-ink/80">{d.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FigureBlock>
  );
}
