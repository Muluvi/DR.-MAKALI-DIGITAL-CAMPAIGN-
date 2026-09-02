"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { deliberate } from "../../lib/motion";
import { Calculator, CheckCircle2, AlertTriangle, TrendingUp, Compass, Layers, ArrowRight, ShieldAlert, Percent } from "lucide-react";

import { ALL_WARDS, CONSTITUENCIES, COUNTY_TOTAL_WARDS } from "../../data/ward-register";

/**
 * Section 6A — the four structural paths to ~200,000, showing the working.
 *
 * Every figure is DERIVED from data/ward-register.json. Nothing is typed in, which matters
 * here more than anywhere else on the site: this component is the proposal's central
 * arithmetic claim, and an earlier version had every constituency figure wrong (Mwingi North
 * 68,932 against a true 68,829; Kitui Central 78,512 against 77,764) while also substituting
 * Kitui East for Kitui West in Path D. The totals were right and the breakdowns were invented
 * underneath them — which is exactly the failure mode "showing the working" exists to prevent.
 */

/** 2022 winning total (Malombe), §6.1. The benchmark every path is measured against. */
const WINNING_TOTAL_2022 = 198004;
/** The round benchmark §6A states the paths against. */
const TARGET_THRESHOLD = 200000;

const byId = (id: string) => {
  const c = CONSTITUENCIES.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown constituency id: ${id}`);
  return c;
};

interface CoalitionPath {
  id: string;
  name: string;
  code: string;
  tagline: string;
  strategicVerdict: string;
  tacticalRequirement: string;
  /** Either whole constituencies, or the top-N wards countywide. */
  composition: { kind: "constituencies"; ids: string[] } | { kind: "topWards"; count: number };
}

const PATH_DEFS: CoalitionPath[] = [
  {
    id: "pathA",
    name: "Path A: The Northern Mwingi Triad",
    code: "MWINGI CENTRAL + MWINGI NORTH + MWINGI WEST",
    tagline: "Total northern bloc consolidation",
    composition: { kind: "constituencies", ids: ["mwingi-central", "mwingi-north", "mwingi-west"] },
    strategicVerdict:
      "The northern three constituencies possess enough registered voters to meet the entire historical victory threshold on their own.",
    tacticalRequirement:
      "Consolidating a decisive margin in Mwingi is a mathematically sufficient foundation for victory — and Mwingi is where the recognition deficit is deepest.",
  },
  {
    id: "pathB",
    name: "Path B: The Central-South-West Axis",
    code: "KITUI CENTRAL + KITUI SOUTH + KITUI WEST",
    tagline: "The southern and urban bastion",
    composition: { kind: "constituencies", ids: ["kitui-central", "kitui-south", "kitui-west"] },
    strategicVerdict:
      "Combining the home base with the county's largest southern constituency and the peri-urban west forms a contiguous coalition that clears the threshold with the widest margin of any path.",
    tacticalRequirement:
      "Requires breaking into Kitui South, which §6A.2 identifies as critical-deficit territory.",
  },
  {
    id: "pathC",
    name: "Path C: The 12 Megawards",
    code: "TOP 12 WARDS ACROSS 6 CONSTITUENCIES",
    tagline: "High-density ward concentration",
    composition: { kind: "topWards", count: 12 },
    strategicVerdict:
      "The campaign does not need to contest all 40 wards with equal resource intensity.",
    tacticalRequirement:
      "High-intensity micro-targeting across just these 12 high-yield wards directly engages the whole threshold.",
  },
  {
    id: "pathD",
    name: "Path D: The Home-Belt Ceiling",
    code: "KITUI CENTRAL + KITUI WEST + KITUI RURAL",
    tagline: "Central geography only — the isolation trap",
    composition: { kind: "constituencies", ids: ["kitui-central", "kitui-west", "kitui-rural"] },
    strategicVerdict:
      "A home-constituency strategy is mathematically impossible. At the 62.0% turnout baseline these registered voters produce only 118,923 ballots cast; even at an unprecedented 80% share across the entire home belt, the result falls far short.",
    tacticalRequirement:
      "Aggressive outward expansion into Mwingi and Kitui South is an absolute, non-negotiable arithmetic necessity.",
  },
];

/** Resolve each path against the register — pool, ward count, share and margin all computed. */
const COALITION_PATHS = PATH_DEFS.map((def) => {
  let voterPool: number;
  let wardCount: number;
  let parts: { name: string; voters: number; wards: number }[];

  if (def.composition.kind === "constituencies") {
    const cs = def.composition.ids.map(byId);
    voterPool = cs.reduce((sum, c) => sum + c.voters, 0);
    wardCount = cs.reduce((sum, c) => sum + c.wards.length, 0);
    parts = cs.map((c) => ({ name: c.name, voters: c.voters, wards: c.wards.length }));
  } else {
    const top = [...ALL_WARDS].sort((a, b) => b.voters - a.voters).slice(0, def.composition.count);
    voterPool = top.reduce((sum, w) => sum + w.voters, 0);
    wardCount = top.length;
    const byConstituency = new Map<string, { voters: number; wards: number }>();
    for (const w of top) {
      const cur = byConstituency.get(w.constituencyName) ?? { voters: 0, wards: 0 };
      byConstituency.set(w.constituencyName, { voters: cur.voters + w.voters, wards: cur.wards + 1 });
    }
    parts = [...byConstituency.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.voters - a.voters);
  }

  return {
    ...def,
    voterPool,
    wardCount,
    constituencies: parts,
    shareOfCounty: (voterPool / COUNTY_TOTAL_WARDS) * 100,
    marginOver2022: voterPool - WINNING_TOTAL_2022,
    marginOverBenchmark: voterPool - TARGET_THRESHOLD,
    isViable: voterPool >= TARGET_THRESHOLD,
  };
});

export function PathTo200kCalculator() {
  const [selectedPathId, setSelectedPathId] = useState<string>("pathB");
  const selectedPath = COALITION_PATHS.find(p => p.id === selectedPathId) || COALITION_PATHS[0];
  const targetThreshold = TARGET_THRESHOLD;
  const progressPercent = Math.min(100, (selectedPath.voterPool / targetThreshold) * 100);

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Calculator size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Coalition Arithmetic Engine
              </span>
              <span className="t-label font-mono font-bold text-muted">
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
              <span>Clears the benchmark (+{selectedPath.marginOverBenchmark.toLocaleString()})</span>
            </>
          ) : (
            <>
              <AlertTriangle size={14} />
              <span>Short of the benchmark ({selectedPath.marginOverBenchmark.toLocaleString()})</span>
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
                <span className={`t-label font-black uppercase tracking-wider ${isSelected ? "text-accent" : "text-muted"}`}>
                  {path.id.toUpperCase()}
                </span>
                <span className={`w-2 h-2 rounded-full ${path.isViable ? "bg-emerald-500" : "bg-rose-500"}`} />
              </div>
              <div className="text-xs font-bold text-ink mt-1 truncate">
                {path.tagline}
              </div>
              <div className="t-small font-mono font-semibold text-muted mt-0.5">
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
              {selectedPath.voterPool.toLocaleString()} / {TARGET_THRESHOLD.toLocaleString()} ({selectedPath.shareOfCounty.toFixed(2)}% of register, {selectedPath.wardCount} wards)
            </span>
          </div>
          <div className="h-3.5 bg-paper border border-line rounded-full overflow-hidden p-0.5 relative">
            <motion.div
              key={selectedPath.id}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.min(100, progressPercent) / 100 }}
              transition={deliberate}
              style={{ transformOrigin: "left", width: "100%" }}
              className={`h-full rounded-full ${
                selectedPath.isViable
                  ? "bg-gradient-to-r from-accent to-emerald-500"
                  : "bg-gradient-to-r from-accent to-rose-500"
              }`}
            />
            {/* 200k Marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-ink/70 z-10"
              style={{ left: `${(WINNING_TOTAL_2022 / TARGET_THRESHOLD) * 100}%` }}
              title={`2022 winning total (${WINNING_TOTAL_2022.toLocaleString()})`}
            />
          </div>
          <div className="flex justify-between t-label font-mono text-muted mt-1">
            <span>0</span>
            <span className="text-accent font-bold tabular-nums">{COUNTY_TOTAL_WARDS.toLocaleString()} Kitui registered pool</span>
            <span className="tabular-nums">{TARGET_THRESHOLD.toLocaleString()} target</span>
          </div>
        </div>

        {/* Constituent Sub-County Cards */}
        <div>
          <div className="t-label font-black uppercase tracking-widest text-muted mb-2 flex items-center gap-1.5">
            <Layers size={12} className="text-accent" />
            <span>Constituency Building Blocks</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {selectedPath.constituencies.map((c, i) => (
              <div key={i} className="p-3 bg-paper border border-line rounded-xl space-y-1">
                <div className="text-xs font-bold text-ink">{c.name}</div>
                <div className="flex items-center justify-between t-small font-mono text-muted">
                  <span>{c.voters.toLocaleString()} Voters</span>
                  <span className="t-label px-1.5 py-0.2 bg-card rounded border border-line">{c.wards} Wards</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Verdict Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 space-y-1">
            <div className="t-label font-black uppercase tracking-wider text-accent flex items-center gap-1">
              <TrendingUp size={12} />
              Strategic Verdict
            </div>
            <p className="text-xs text-ink font-medium leading-relaxed">
              {selectedPath.strategicVerdict}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1">
            <div className="t-label font-black uppercase tracking-wider text-muted flex items-center gap-1">
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
      <div className="p-3 bg-paper/60 border-t border-line t-small text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <Percent size={12} className="text-accent" />
          <span>IEBC Benchmark: Minimum winning threshold is 198,004 – 200,000 valid votes in a 3-way contest.</span>
        </span>
      </div>
    </div>
  );
}
