"use client";

import React, { useState } from "react";
import { CONSTITUENCIES, type Ward, type Constituency } from "../../data/ward-register";
import { ELECTORAL_ARITHMETIC } from "../../data/electoral-arithmetic";
import { TierBadge } from "../markdown/TierBadge";
import { Table, TableProperties, Layers, MapPin, Info } from "lucide-react";

export type WardMapLayer =
  | "register"
  | "footprint"
  | "party-flow"
  | "zones"
  | "effort"
  | "reach-targets";

interface WardTileMapProps {
  initialLayer?: WardMapLayer;
  className?: string;
  showControls?: boolean;
}

// Ordered strictly North to South
const CONSTITUENCY_GEO_ORDER: string[] = [
  "mwingi-north",
  "mwingi-west",
  "mwingi-central",
  "kitui-west",
  "kitui-central",
  "kitui-rural",
  "kitui-east",
  "kitui-south",
];

const LAYER_CONFIGS: Record<
  WardMapLayer,
  {
    label: string;
    description: string;
    sectionRef: string;
    tier: "T1" | "T2" | "T3";
    getWardStyle: (w: Ward, c: Constituency) => { fill: string; border: string; tag: string };
    legend: { label: string; color: string }[];
  }
> = {
  register: {
    label: "Voter Register Density",
    description: "Choropleth mapping of the official 532,758 registered voters across 40 wards.",
    sectionRef: "§3.2 Where the votes are",
    tier: "T1",
    getWardStyle: (w) => {
      // 7,429 to 19,921
      const pct = (w.voters - 7000) / (20000 - 7000);
      const intensity = Math.min(Math.max(pct, 0.15), 0.95);
      return {
        fill: `rgba(37, 99, 235, ${intensity.toFixed(2)})`,
        border: "rgba(30, 64, 175, 0.6)",
        tag: `${w.voters.toLocaleString()} voters`,
      };
    },
    legend: [
      { label: "Top Density (16k–20k)", color: "rgba(37, 99, 235, 0.9)" },
      { label: "Medium Density (12k–15k)", color: "rgba(37, 99, 235, 0.5)" },
      { label: "Lower Density (7k–11k)", color: "rgba(37, 99, 235, 0.2)" },
    ],
  },
  footprint: {
    label: "Legislative Footprint (275,570 Pool)",
    description: "Kitui Central home anchor vs. 275,570 voter deficit pool where he has never held office.",
    sectionRef: "§3.4 Where he is known",
    tier: "T1",
    getWardStyle: (_w, c) => {
      if (c.id === "kitui-central") {
        return { fill: "rgba(16, 185, 129, 0.85)", border: "rgb(5, 150, 105)", tag: "Home Anchor (Kitui Central MP)" };
      }
      if (["kitui-west", "kitui-rural", "kitui-east"].includes(c.id)) {
        return { fill: "rgba(245, 158, 11, 0.75)", border: "rgb(217, 119, 6)", tag: "Neighbouring Belt (Secondary Recognition)" };
      }
      return { fill: "rgba(239, 68, 68, 0.75)", border: "rgb(220, 38, 38)", tag: "Deficit Pool: Never Held Office (51.7% of voters)" };
    },
    legend: [
      { label: "Home Base (Kitui Central, 77.7k)", color: "rgba(16, 185, 129, 0.85)" },
      { label: "Adjacent Belt (Kitui West, Rural, East)", color: "rgba(245, 158, 11, 0.75)" },
      { label: "Deficit Pool: Mwingi & South (275.5k, 51.7%)", color: "rgba(239, 68, 68, 0.75)" },
    ],
  },
  "party-flow": {
    label: "Party Flow & Non-Wiper Seats",
    description: "Certified party affiliations highlighting UDA and Jubilee strongholds.",
    sectionRef: "§3.6 Party loyalty boundaries",
    tier: "T1",
    getWardStyle: (_w, c) => {
      if (c.id === "kitui-east") {
        return { fill: "rgba(234, 179, 8, 0.85)", border: "rgb(202, 138, 4)", tag: "Kitui East (UDA MP Nimrod Mbai)" };
      }
      if (c.id === "kitui-south") {
        return { fill: "rgba(239, 68, 68, 0.75)", border: "rgb(185, 28, 28)", tag: "Kitui South (Jubilee MP Rachel Nyamai)" };
      }
      if (c.id === "kitui-central") {
        return { fill: "rgba(59, 130, 246, 0.85)", border: "rgb(37, 99, 235)", tag: "Wiper Home: Succession Vulnerability" };
      }
      return { fill: "rgba(99, 102, 241, 0.75)", border: "rgb(79, 70, 229)", tag: "Wiper Plurality Constituency" };
    },
    legend: [
      { label: "Wiper Dominant Wards", color: "rgba(99, 102, 241, 0.75)" },
      { label: "Kitui East: UDA Incumbent", color: "rgba(234, 179, 8, 0.85)" },
      { label: "Kitui South: Jubilee Incumbent", color: "rgba(239, 68, 68, 0.75)" },
      { label: "Kitui Central: Open Succession", color: "rgba(59, 130, 246, 0.85)" },
    ],
  },
  zones: {
    label: "Three Regional Campaign Sectors",
    description: "Strategic tri-zone allocation of Kitui's 40 wards.",
    sectionRef: "§3.7 Regional campaign zones",
    tier: "T1",
    getWardStyle: (_w, c) => {
      if (["mwingi-north", "mwingi-west", "mwingi-central"].includes(c.id)) {
        return { fill: "rgba(14, 165, 233, 0.8)", border: "rgb(2, 132, 199)", tag: "Northern Zone (200,198 voters, 37.6%)" };
      }
      if (["kitui-west", "kitui-central", "kitui-rural"].includes(c.id)) {
        return { fill: "rgba(168, 85, 247, 0.8)", border: "rgb(147, 51, 234)", tag: "Central Zone (191,811 voters, 36.0%)" };
      }
      return { fill: "rgba(236, 72, 153, 0.8)", border: "rgb(219, 39, 119)", tag: "Southern Zone (140,749 voters, 26.4%)" };
    },
    legend: [
      { label: "Northern Zone (Mwingi 15 wards, 37.6%)", color: "rgba(14, 165, 233, 0.8)" },
      { label: "Central Zone (Home belt 13 wards, 36.0%)", color: "rgba(168, 85, 247, 0.8)" },
      { label: "Southern Zone (Border 12 wards, 26.4%)", color: "rgba(236, 72, 153, 0.8)" },
    ],
  },
  effort: {
    label: "Phase −1 Effort Weighting",
    description: "Rebalanced communications weight correcting historical home-base bias.",
    sectionRef: "§4.2 Communications rebalancing",
    tier: "T2",
    getWardStyle: (_w, c) => {
      if (["mwingi-north", "mwingi-west", "kitui-south"].includes(c.id)) {
        return { fill: "rgba(220, 38, 38, 0.85)", border: "rgb(185, 28, 28)", tag: "Heavy Priority Effort (45% total digital weight)" };
      }
      if (["mwingi-central", "kitui-east"].includes(c.id)) {
        return { fill: "rgba(245, 158, 11, 0.8)", border: "rgb(217, 119, 6)", tag: "Elevated Effort (35% digital weight)" };
      }
      return { fill: "rgba(107, 114, 128, 0.5)", border: "rgb(75, 85, 99)", tag: "Baseline Maintenance Effort (20% weight)" };
    },
    legend: [
      { label: "High Priority Deficit Areas (45% effort)", color: "rgba(220, 38, 38, 0.85)" },
      { label: "Secondary Contested Wards (35% effort)", color: "rgba(245, 158, 11, 0.8)" },
      { label: "Baseline Maintenance Wards (20% effort)", color: "rgba(107, 114, 128, 0.5)" },
    ],
  },
  "reach-targets": {
    label: "Observable Subscriber Reach Targets",
    description: "Target distribution of the 120,000 rural consented subscribers and 200k supporter DB.",
    sectionRef: "§5.6 Measurable indicator framework",
    tier: "T1",
    getWardStyle: (w) => {
      // 120,000 across 40 wards = ~3,000 per ward average; scaled by ward size
      const target = Math.round((w.voters / 532758) * 120000);
      if (target >= 3500) {
        return { fill: "rgba(5, 150, 105, 0.85)", border: "rgb(4, 120, 87)", tag: `Target: ${target.toLocaleString()} subscribers (Tier A)` };
      }
      if (target >= 2800) {
        return { fill: "rgba(16, 185, 129, 0.65)", border: "rgb(5, 150, 105)", tag: `Target: ${target.toLocaleString()} subscribers (Tier B)` };
      }
      return { fill: "rgba(52, 211, 153, 0.45)", border: "rgb(16, 185, 129)", tag: `Target: ${target.toLocaleString()} subscribers (Tier C)` };
    },
    legend: [
      { label: "Tier A Target (3,500+ consented voters)", color: "rgba(5, 150, 105, 0.85)" },
      { label: "Tier B Target (2,800–3,499 consented)", color: "rgba(16, 185, 129, 0.65)" },
      { label: "Tier C Target (1,500–2,799 consented)", color: "rgba(52, 211, 153, 0.45)" },
    ],
  },
};

export function WardTileMap({
  initialLayer = "register",
  className = "",
  showControls = true,
}: WardTileMapProps) {
  const [activeLayer, setActiveLayer] = useState<WardMapLayer>(initialLayer);
  const [selectedWard, setSelectedWard] = useState<{ ward: Ward; constituency: Constituency } | null>(null);
  const [viewTable, setViewTable] = useState(false);

  const currentCfg = LAYER_CONFIGS[activeLayer];

  // Grouped and sorted constituencies
  const orderedConstituencies = CONSTITUENCY_GEO_ORDER.map((id) =>
    CONSTITUENCIES.find((c) => c.id === id)!
  ).filter(Boolean);

  return (
    <figure
      className={`not-prose my-6 rounded-2xl border border-line bg-card p-4 sm:p-6 ${className}`}
      aria-label="40-Ward Schematic Tile Map"
    >
      {/* Header with Title and Tier Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-ink sm:text-xl">
              Kitui 40-Ward Electoral Cartogram: {currentCfg.label}
            </h3>
            <TierBadge tier={currentCfg.tier} />
          </div>
          <p className="mt-1 t-micro text-muted">
            {currentCfg.description} &bull; <span className="font-semibold text-ink">{currentCfg.sectionRef}</span>
          </p>
        </div>

        {/* View as table toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewTable(!viewTable)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-xs font-semibold text-ink hover:bg-paper transition-colors"
            aria-expanded={viewTable}
          >
            <Table size={14} />
            {viewTable ? "Show Tile Map" : "View as Table"}
          </button>
        </div>
      </div>

      {/* Layer selector tabs */}
      {showControls && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(Object.keys(LAYER_CONFIGS) as WardMapLayer[]).map((layerKey) => {
            const cfg = LAYER_CONFIGS[layerKey];
            const isActive = activeLayer === layerKey;
            return (
              <button
                key={layerKey}
                type="button"
                onClick={() => {
                  setActiveLayer(layerKey);
                  setSelectedWard(null);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-accent text-white shadow-sm font-semibold"
                    : "bg-paper text-muted hover:text-ink hover:bg-line/40 border border-line/40"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend strip */}
      <div className="mt-4 flex flex-wrap items-center gap-4 py-2 px-3 rounded-lg bg-paper/60 border border-line/40 text-xs text-muted">
        <span className="font-bold text-ink uppercase tracking-wider text-[10px]">Legend:</span>
        {currentCfg.legend.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded-sm border border-black/20"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Table view */}
      {viewTable ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line bg-paper text-ink font-semibold">
                <th className="py-2.5 px-3">Constituency</th>
                <th className="py-2.5 px-3">Ward</th>
                <th className="py-2.5 px-3 text-right">Registered Voters (2022)</th>
                <th className="py-2.5 px-3 text-right">% of County</th>
                <th className="py-2.5 px-3">Layer Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40 font-mono">
              {orderedConstituencies.flatMap((c) =>
                c.wards.map((w) => {
                  const style = currentCfg.getWardStyle(w, c);
                  const sharePct = ((w.voters / ELECTORAL_ARITHMETIC.register2022Certified) * 100).toFixed(2);
                  return (
                    <tr key={`${c.id}-${w.name}`} className="hover:bg-paper/40 font-sans">
                      <td className="py-2 px-3 font-medium text-ink">{c.name}</td>
                      <td className="py-2 px-3 text-ink font-semibold">{w.name}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">{w.voters.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">{sharePct}%</td>
                      <td className="py-2 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-paper border border-line/60">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.fill }} />
                          {style.tag}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cartogram Tiles View */
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {orderedConstituencies.map((constituency, idx) => {
              const constTotalVoters = constituency.voters;
              const constShare = ((constTotalVoters / ELECTORAL_ARITHMETIC.register2022Certified) * 100).toFixed(1);

              return (
                <div
                  key={constituency.id}
                  className="rounded-xl border border-line bg-paper/50 p-3 flex flex-col justify-between hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-serif font-bold text-xs text-ink truncate" title={constituency.name}>
                      {idx + 1}. {constituency.name}
                    </span>
                    <span className="font-mono text-[11px] text-muted">
                      {constTotalVoters.toLocaleString()} ({constShare}%)
                    </span>
                  </div>

                  {/* Ward Tiles */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {constituency.wards.map((ward) => {
                      const style = currentCfg.getWardStyle(ward, constituency);
                      const isSelected =
                        selectedWard?.constituency.id === constituency.id &&
                        selectedWard?.ward.name === ward.name;

                      return (
                        <button
                          key={ward.name}
                          type="button"
                          onClick={() => setSelectedWard({ ward, constituency })}
                          aria-label={`${ward.name} Ward, ${constituency.name}: ${ward.voters.toLocaleString()} voters. ${style.tag}`}
                          style={{
                            backgroundColor: style.fill,
                            borderColor: isSelected ? "var(--color-ink, #000)" : style.border,
                          }}
                          className={`group relative h-9 rounded-md border text-[10px] font-bold text-white transition-all flex items-center justify-center p-0.5 shadow-sm hover:scale-105 hover:z-20 ${
                            isSelected ? "ring-2 ring-ink ring-offset-2 scale-105 z-10" : ""
                          }`}
                        >
                          <span className="truncate drop-shadow-sm px-0.5">{ward.name.split("/")[0].slice(0, 4)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Ward Inspection Card */}
          {selectedWard && (
            <div className="mt-4 p-4 rounded-xl border border-accent/40 bg-card shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent mt-0.5">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-ink text-sm sm:text-base">
                    {selectedWard.ward.name} Ward &bull; {selectedWard.constituency.name}
                  </h4>
                  <p className="text-xs text-muted mt-0.5">
                    <strong className="text-ink font-semibold">{selectedWard.ward.voters.toLocaleString()}</strong> registered voters (
                    {((selectedWard.ward.voters / ELECTORAL_ARITHMETIC.register2022Certified) * 100).toFixed(2)}% of county total).
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-paper border border-line text-xs font-semibold text-ink">
                {currentCfg.getWardStyle(selectedWard.ward, selectedWard.constituency).tag}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sourced Takeaway */}
      <figcaption className="mt-4 pt-3 border-t border-line/60 text-xs text-muted leading-relaxed">
        <strong className="text-ink font-semibold">Analytical Takeaway:</strong> 51.7% of all registered voters (275,570) reside in Mwingi North, Mwingi West, Mwingi Central, and Kitui South—districts where Dr. Mulu has never held legislative office. Winning the county requires structural expansion beyond the Kitui Central home anchor into these primary clusters.
      </figcaption>
    </figure>
  );
}

export default WardTileMap;
