"use client";

import { LazyMount } from "../LazyMount";
import { ProvenanceLine } from "./ProvenanceLine";
import { RADIO_STATIONS } from "../../data/media-ownership";
import { StationTable } from "../premium/StationTable";
import MediaOwnershipChart, { type StationBar } from "../charts/MediaOwnershipChart";

/**
 * The three reported-alignment categories, as theme tokens rather than fixed hexes.
 *
 * These were the light-theme party colours, painted straight onto station labels in both themes.
 * On the dark ground #0056a8 measured 2.63:1 and #b45309 3.74:1 — the label said which owner a
 * station answers to, in a colour that could not be read. The tokens keep the hues and let each
 * theme set the lightness. See --align-a/b/c in app/globals.css.
 */
function alignmentColor(alignment: string): string {
  if (alignment.includes("Ngilu")) return "var(--align-a)";
  if (alignment.includes("Kalonzo")) return "var(--align-b)";
  return "var(--align-c)";
}

const CHART_DATA: StationBar[] = RADIO_STATIONS.map((s) => ({
  name: s.name,
  reachTier: s.reachTier,
  reachLabel: s.reachLabel,
  alignmentCategory: s.alignment,
  color: alignmentColor(s.alignment),
}));

/**
 * Media ownership map (§3.7.1). The strategic point: the highest-reach
 * stations on §3.7.1's own reading are controlled by a rival or the party gatekeeper,
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
        Reach is a qualitative reading of Section 3.7.1&apos;s own &quot;Campaign posture&quot; column, not a measured
        listenership figure — none was supplied by the research pass (Data Gaps Register). Ownership associations are
        Tier 2/3 and labelled individually below.
      </p>

      <div className="w-full t-micro mb-4">
        <LazyMount minHeight={200}>
          <MediaOwnershipChart data={CHART_DATA} />
        </LazyMount>
      </div>

      {/* The table equivalent, in the G-6 system: a real table on wide screens, label-above-value
          cards on a phone. It replaced a five-column table that collapsed to one character per
          line at 390 px (D-03). */}
      <StationTable />

      <ProvenanceLine provenance={RADIO_STATIONS.map((s) => ({ source: s.source, granularity: "county" as const }))} />
    </div>
  );
}
