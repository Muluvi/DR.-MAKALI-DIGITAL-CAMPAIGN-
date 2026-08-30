"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  CheckCircle2, 
  AlertOctagon, 
  TrendingUp, 
  Compass, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Percent
} from "lucide-react";

interface CoalitionPath {
  id: string;
  name: string;
  code: string;
  tagline: string;
  voterPool: number;
  shareOfCounty: number;
  marginOverTarget: number;
  isViable: boolean;
  constituencies: { name: string; voters: number; wards: number }[];
  strategicVerdict: string;
  tacticalRequirement: string;
}

const COALITION_PATHS: CoalitionPath[] = [
  {
    id: "pathA",
    name: "Path A: The Northern Mwingi Triad",
    code: "MWINGI-NORTH + MWINGI-CENTRAL + MWINGI-WEST",
    tagline: "Total Northern Bloc Consolidation",
    voterPool: 200198,
    shareOfCounty: 37.58,
    marginOverTarget: 2194, // over 198,004 (2022 winning threshold)
    isViable: true,
    constituencies: [
      { name: "Mwingi North", voters: 68932, wards: 5 },
      { name: "Mwingi Central", voters: 74653, wards: 6 },
      { name: "Mwingi West", voters: 56613, wards: 4 },
    ],
    strategicVerdict: "Mathematically viable (+2,194 votes over winning mark). Captures the entire northern demographic belt.",
    tacticalRequirement: "Must close the 15.3-pt deficit in Mwingi against Kasalu through aggressive Kikamba vernacular radio (Musyi FM 06:00–08:30) and targeted church networks."
  },
  {
    id: "pathB",
    name: "Path B: The Central-South-West Axis",
    code: "KITUI-CENTRAL + KITUI-SOUTH + KITUI-WEST",
    tagline: "The Southern & Urban Bastion",
    voterPool: 212183,
    shareOfCounty: 39.83,
    marginOverTarget: 14179,
    isViable: true,
    constituencies: [
      { name: "Kitui Central (Home Anchor)", voters: 78512, wards: 5 },
      { name: "Kitui South (Largest Deficit)", voters: 76891, wards: 6 },
      { name: "Kitui West", voters: 56780, wards: 4 },
    ],
    strategicVerdict: "Strongest numerical cushion (+14,179 votes over winning mark). Highest turnout stability.",
    tacticalRequirement: "Requires neutralizing Irene Kasalu's home advantage in Kitui South while defending Dr. Mulu's 80%+ anchor in Kitui Central."
  },
  {
    id: "pathC",
    name: "Path C: The Top 12 Megawards Coalition",
    code: "TOP 12 WARDS ACROSS ALL 8 CONSTITUENCIES",
    tagline: "High-Density Ward Concentration",
    voterPool: 201267,
    shareOfCounty: 37.78,
    marginOverTarget: 3263,
    isViable: true,
    constituencies: [
      { name: "Township & Kyangwithya (Central)", voters: 42100, wards: 2 },
      { name: "Mwingi Central & Waita (Mwingi)", voters: 39850, wards: 2 },
      { name: "Mutomo & Ikutha (South)", voters: 38200, wards: 2 },
      { name: "6 Other High-Density Wards", voters: 81117, wards: 6 },
    ],
    strategicVerdict: "Highest capital efficiency. Directs 70% of ground and digital ad budget into just 30% of county wards.",
    tacticalRequirement: "Intensive field-agent deployment, ward coordinators, and targeted digital/SMS bursts in Kitui Township, Mwingi Town, and Mutomo."
  },
  {
    id: "pathD",
    name: "Path D: The Home-Belt Ceiling Trap",
    code: "KITUI-CENTRAL + KITUI-RURAL + KITUI-EAST",
    tagline: "Central Geography Only (Fatal Flaw)",
    voterPool: 191811,
    shareOfCounty: 36.00,
    marginOverTarget: -6193, // Deficit vs 198,004
    isViable: false,
    constituencies: [
      { name: "Kitui Central", voters: 78512, wards: 5 },
      { name: "Kitui Rural", voters: 58240, wards: 4 },
      { name: "Kitui East", voters: 55059, wards: 5 },
    ],
    strategicVerdict: "FATAL DEFICIT (-6,193 votes short of 2022 winning mark even at 100% voter registration).",
    tacticalRequirement: "Demonstrates conclusively that an inward-focused Central-only campaign cannot win without breaking into Mwingi or Kitui South."
  }
];

export function PathTo200kCalculator() {
  const [selectedPathId, setSelectedPathId] = useState<string>("pathB");
  const selectedPath = COALITION_PATHS.find(p => p.id === selectedPathId) || COALITION_PATHS[0];
  const targetThreshold = 200000;
  const progressPercent = Math.min(100, (selectedPath.voterPool / targetThreshold) * 100);

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Calculator size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Coalition Arithmetic Engine
              </span>
              <span className="text-[10px] font-mono font-bold text-muted">
                Target: 200,000 Votes
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Four Structural Paths to Electoral Victory
            </h4>
          </div>
        </div>

        {/* Victory Status Pill */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 self-start sm:self-auto ${
          selectedPath.isViable 
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
            : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
        }`}>
          {selectedPath.isViable ? (
            <>
              <CheckCircle2 size={14} />
              <span>Viable Coalition (+{selectedPath.marginOverTarget.toLocaleString()} votes)</span>
            </>
          ) : (
            <>
              <AlertOctagon size={14} />
              <span>Mathematical Ceiling Deficit ({selectedPath.marginOverTarget.toLocaleString()} votes)</span>
            </>
          )}
        </div>
      </div>

      {/* Path Selector Tabs (Touch-friendly grid) */}
      <div className="p-3 bg-paper/70 border-b border-line grid grid-cols-2 sm:grid-cols-4 gap-2">
        {COALITION_PATHS.map((path) => {
          const isSelected = path.id === selectedPathId;
          return (
            <button
              key={path.id}
              onClick={() => setSelectedPathId(path.id)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? "bg-card border-accent shadow-sm ring-2 ring-accent/15"
                  : "bg-paper/40 border-line hover:border-accent/40 text-muted hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? "text-accent" : "text-muted"}`}>
                  {path.id.toUpperCase()}
                </span>
                <span className={`w-2 h-2 rounded-full ${path.isViable ? "bg-emerald-500" : "bg-rose-500"}`} />
              </div>
              <div className="text-xs font-bold text-ink mt-1 truncate">
                {path.tagline}
              </div>
              <div className="text-[11px] font-mono font-semibold text-muted mt-0.5">
                {path.voterPool.toLocaleString()} voters
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Path Analytics Area */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Animated Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-ink">{selectedPath.name}</span>
            <span className="font-mono text-accent">
              {selectedPath.voterPool.toLocaleString()} / 200,000 ({selectedPath.shareOfCounty}% of County Register)
            </span>
          </div>
          <div className="h-3.5 bg-paper border border-line rounded-full overflow-hidden p-0.5 relative">
            <motion.div
              key={selectedPath.id}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, progressPercent)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full ${
                selectedPath.isViable
                  ? "bg-gradient-to-r from-accent to-emerald-500"
                  : "bg-gradient-to-r from-accent to-rose-500"
              }`}
            />
            {/* 200k Marker */}
            <div className="absolute top-0 bottom-0 left-[94.3%] w-0.5 bg-ink/70 z-10" title="2022 Winner Baseline (198,004)" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
            <span>0</span>
            <span className="text-accent font-bold">532,758 Kitui Registered Pool</span>
            <span>200,000 Target Threshold</span>
          </div>
        </div>

        {/* Constituent Sub-County Cards */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 flex items-center gap-1.5">
            <Layers size={12} className="text-accent" />
            <span>Constituency Building Blocks</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {selectedPath.constituencies.map((c, i) => (
              <div key={i} className="p-3 bg-paper border border-line rounded-xl space-y-1">
                <div className="text-xs font-bold text-ink">{c.name}</div>
                <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>{c.voters.toLocaleString()} Voters</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-card rounded border border-line">{c.wards} Wards</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Verdict Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1">
              <TrendingUp size={12} />
              Strategic Verdict
            </div>
            <p className="text-xs text-ink font-medium leading-relaxed">
              {selectedPath.strategicVerdict}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <ShieldAlert size={12} className="text-gold" />
              Tactical Requirement
            </div>
            <p className="text-xs text-muted font-medium leading-relaxed">
              {selectedPath.tacticalRequirement}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="p-3 bg-paper/60 border-t border-line text-[11px] text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <Percent size={12} className="text-accent" />
          <span>IEBC Benchmark: Minimum winning threshold is 198,004 – 200,000 valid votes in a 3-way contest.</span>
        </span>
      </div>
    </div>
  );
}
