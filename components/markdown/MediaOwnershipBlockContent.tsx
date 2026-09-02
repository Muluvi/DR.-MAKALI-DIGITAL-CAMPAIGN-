"use client";

import { LazyMount } from "../LazyMount";
import { ProvenanceLine } from "./ProvenanceLine";
import { TierBadge } from "./TierBadge";
import { RADIO_STATIONS } from "../../data/media-ownership";
import MediaOwnershipChart, { type StationBar } from "../charts/MediaOwnershipChart";

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
 * Media ownership map (Section 17A.7 / Phase 6f). The strategic point: the highest-reach
 * stations on Section 17A.1's own reading are controlled by a rival or the party gatekeeper,
 * not by the campaign. Reach is a qualitative 1–3 read, never a measured listenership figure —
 * see the Data Gaps Register for that gap.
 */
export function MediaOwnershipBlockContent() {
  return (
    <div className="not-prose bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Media Ownership Map — Reach vs. Alignment</h4>
      </div>
      <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
        Reach is a qualitative reading of Section 17A.1&apos;s own &quot;Campaign posture&quot; column, not a measured
        listenership figure — none was supplied by the research pass (Data Gaps Register). Ownership associations are
        Tier 2/3 and labelled individually below.
      </p>

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

      <ProvenanceLine provenance={RADIO_STATIONS.map((s) => ({ source: s.source, granularity: "county" as const }))} />
    </div>
  );
}
