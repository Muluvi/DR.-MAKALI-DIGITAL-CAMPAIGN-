"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";
import { LazyMount } from "../LazyMount";
import { TierBadge } from "./TierBadge";
import { RADIO_STATIONS } from "../../data/media-ownership";
import type { StationBar } from "../charts/MediaOwnershipChart";
import { FigureBlock } from "./FigureBlock";
// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const MediaOwnershipChart = dynamic(() => import("../charts/MediaOwnershipChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

function alignmentColor(alignment: string): string {
  if (alignment.includes("Ngilu")) return "#e31d2b";
  if (alignment.includes("Kalonzo")) return "#b45309";
  return "#0056a8";
}

const CHART_DATA: StationBar[] = RADIO_STATIONS.map((s) => ({
  name: s.name,
  reachTier: s.reachTier,
  reachLabel: s.reachLabel,
  alignmentCategory: s.alignment,
  color: alignmentColor(s.alignment),
}));

/**
 * Media ownership map (§3.4.1). The strategic point: the highest-reach
 * stations on §3.4.1's own reading are controlled by a rival or the party gatekeeper,
 * not by the campaign. Reach is a qualitative 1–3 read, never a measured listenership figure —
 * see the Data Gaps Register for that gap.
 */
export function MediaOwnershipBlock() {
  return (
    <FigureBlock
      title="Media Ownership Map — Reach vs. Alignment"
      subtitle={
        <>
          Reach is a qualitative reading of Section 3.4.1&apos;s own &quot;Campaign posture&quot; column, not a measured
          listenership figure — none was supplied by the research pass (Data Gaps Register). Ownership associations are
          Tier 2/3 and labelled individually below.
        </>
      }
      provenance={RADIO_STATIONS.map((s) => ({ source: s.source, granularity: "county" as const }))}
    >

      <div className="w-full t-micro mb-4">
        <LazyMount minHeight={200}>
          <MediaOwnershipChart data={CHART_DATA} />
        </LazyMount>
      </div>

      {/* Accessible table equivalent */}
      <div className="overflow-x-auto">
        <table className="data-table text-left t-small">
          <thead>
            <tr className="t-micro uppercase tracking-wider font-bold text-muted">
              <th className="py-1 pr-3">Station</th>
              <th className="py-1 pr-3">Reported alignment</th>
              <th className="py-1 pr-3">Reach (qualitative)</th>
              <th className="py-1">Tier</th>
            </tr>
          </thead>
          <tbody>
            {RADIO_STATIONS.map((s, i) => (
              <tr key={i} className="border-t border-line/40">
                <td className="py-1.5 pr-3 font-bold text-ink">{s.name}</td>
                <td className="py-1.5 pr-3 text-ink/80">{s.alignment}</td>
                <td className="py-1.5 pr-3 text-ink/80">{s.reachLabel.split(" (")[0]}</td>
                <td className="py-1.5">
                  <TierBadge tier={s.source.tier} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FigureBlock>
  );
}
