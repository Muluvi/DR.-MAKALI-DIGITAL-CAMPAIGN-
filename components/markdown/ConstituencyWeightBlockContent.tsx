"use client";

import { useState } from "react";
import { LazyMount } from "../LazyMount";
import { ProvenanceLine } from "./ProvenanceLine";
import { CONSTITUENCIES_BY_SIZE, COUNTY_TOTAL_WARDS } from "../../data/ward-register";
import { IEBC_WARD_REGISTER } from "../../data/sources";
import type { Provenance } from "../../data/types";
import ConstituencyBarChart from "../charts/ConstituencyBarChart";

const PROVENANCE: Provenance = { source: IEBC_WARD_REGISTER, granularity: "constituency" };

const CHART_DATA = CONSTITUENCIES_BY_SIZE.map((c) => ({
  id: c.id,
  name: c.name,
  voters: c.voters,
  share: `${((c.voters / COUNTY_TOTAL_WARDS) * 100).toFixed(1)}%`,
}));

export function ConstituencyWeightBlockContent() {
  const [selectedID, setSelectedID] = useState(CHART_DATA[0].id);
  const largest = CONSTITUENCIES_BY_SIZE[0];

  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Constituency Weight — All Eight, by Register</h4>
      </div>
      <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
        <strong className="text-ink">{largest.name} is the largest constituency in the county register, at{" "}
        {largest.voters.toLocaleString()} voters</strong> ({((largest.voters / COUNTY_TOTAL_WARDS) * 100).toFixed(1)}%
        of the county total) — the candidate&apos;s own base is the county&apos;s heaviest constituency. That is the
        strongest structural argument he has.
      </p>

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

      <ProvenanceLine provenance={PROVENANCE} />
    </div>
  );
}
