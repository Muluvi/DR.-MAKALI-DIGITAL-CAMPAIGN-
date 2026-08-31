"use client";

import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Calculator,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  Layers,
  ShieldAlert,
  Percent,
  Sliders,
} from "lucide-react";
import { CONSTITUENCIES, ALL_WARDS } from "../../data/ward-register";
import { ClaimBadge } from "./ClaimBadge";

// Coalition membership only (constituency ids / ward names) is hand-picked to match the four
// paths Section 6.3 already argues in prose; every voter count is looked up live from
// data/ward-register.ts (the same verified-at-build-time source scripts/verify-ward-register.mjs
// checks) rather than retyped, so this calculator can't silently drift from the register again.
const byId = new Map(CONSTITUENCIES.map((c) => [c.id, c]));
const WINNING_TOTAL_2022 = 198_004; // Malombe, 2022 (Tier 1) -- Section 6.1

const constituencyPath = (ids: string[]) => {
  const cs = ids.map((id) => byId.get(id)!);
  return {
    voterPool: cs.reduce((s, c) => s + c.voters, 0),
    wardCount: cs.reduce((s, c) => s + c.wards.length, 0),
    constituencies: cs.map((c) => ({ name: c.name, voters: c.voters, wards: c.wards.length })),
  };
};

const top12Wards = [...ALL_WARDS].sort((a, b) => b.voters - a.voters).slice(0, 12);
const pathC = {
  voterPool: top12Wards.reduce((s, w) => s + w.voters, 0),
  wardCount: 12,
  constituencies: [
    { name: `${top12Wards[0].name} to ${top12Wards[11].name} (12 wards, 6 constituencies)`, voters: top12Wards.reduce((s, w) => s + w.voters, 0), wards: 12 },
  ],
};

interface CoalitionPath {
  id: string;
  name: string;
  tagline: string;
  voterPool: number;
  wardCount: number;
  constituencies: { name: string; voters: number; wards: number }[];
  strategicVerdict: string;
  tacticalRequirement: string;
}

const COALITION_PATHS: CoalitionPath[] = [
  {
    id: "pathA",
    name: "Path A: The Northern Mwingi Triad",
    tagline: "Total Northern Bloc Consolidation",
    ...constituencyPath(["mwingi-north", "mwingi-central", "mwingi-west"]),
    strategicVerdict: "Mathematically viable on its own. Captures the entire northern demographic belt.",
    tacticalRequirement: "Must close the 15.3-pt deficit in Mwingi against Kasalu through aggressive Kikamba vernacular radio (Musyi FM 06:00–08:30) and targeted church networks."
  },
  {
    id: "pathB",
    name: "Path B: The Central-South-West Axis",
    tagline: "The Southern & Urban Bastion",
    ...constituencyPath(["kitui-central", "kitui-south", "kitui-west"]),
    strategicVerdict: "Strongest numerical cushion of the four paths. Highest turnout stability.",
    tacticalRequirement: "Requires neutralizing Irene Kasalu's home advantage in Kitui South while defending Dr. Mulu's home anchor in Kitui Central."
  },
  {
    id: "pathC",
    name: "Path C: The Top 12 Megawards Coalition",
    tagline: "High-Density Ward Concentration",
    ...pathC,
    strategicVerdict: "Highest capital efficiency. Directs ground and digital ad budget into just 30% of county wards.",
    tacticalRequirement: "Intensive field-agent deployment, ward coordinators, and targeted digital/SMS bursts in the county's 12 largest wards."
  },
  {
    id: "pathD",
    name: "Path D: The Home-Belt Ceiling Trap",
    tagline: "Central Geography Only (Fatal Flaw)",
    ...constituencyPath(["kitui-central", "kitui-west", "kitui-rural"]),
    strategicVerdict: "Falls short of the 2022 winning mark even at 100% registered-voter turnout in every one of these three constituencies.",
    tacticalRequirement: "Demonstrates conclusively that an inward-focused Central-only campaign cannot win without breaking into Mwingi or Kitui South."
  }
];

const TURNOUT_MIN = 0.45;
const TURNOUT_MAX = 0.75;
const HISTORICAL_TURNOUT = 0.62;

export function PathTo200kCalculator() {
  const [selectedPathId, setSelectedPathId] = useState<string>("pathB");
  const [turnout, setTurnout] = useState<number>(HISTORICAL_TURNOUT);
  const selectedPath = COALITION_PATHS.find(p => p.id === selectedPathId) || COALITION_PATHS[0];
  const targetThreshold = 200000;
  const isViable = selectedPath.voterPool >= targetThreshold;
  const marginOverTarget = selectedPath.voterPool - WINNING_TOTAL_2022;
  const shareOfCounty = (selectedPath.voterPool / 532_758) * 100;
  const progressPercent = Math.min(100, (selectedPath.voterPool / targetThreshold) * 100);

  // Sensitivity: at the chosen turnout, what share of ballots actually cast within this
  // coalition would Dr. Mulu need to win 200,000 total votes -- worst case, assuming every
  // one of his votes comes from this coalition (the same simplifying assumption Section 6.3's
  // own prose uses). Modelled, not observed -- labelled as a campaign estimate throughout.
  const ballotsCast = useMemo(() => Math.round(selectedPath.voterPool * turnout), [selectedPath, turnout]);
  const shareNeeded = useMemo(() => Math.min(999, (targetThreshold / ballotsCast) * 100), [ballotsCast]);

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
          isViable
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
            : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
        }`}>
          {isViable ? (
            <>
              <CheckCircle2 size={14} />
              <span>Viable Coalition (+{marginOverTarget.toLocaleString()} votes)</span>
            </>
          ) : (
            <>
              <AlertOctagon size={14} />
              <span>Mathematical Ceiling Deficit ({marginOverTarget.toLocaleString()} votes)</span>
            </>
          )}
        </div>
      </div>

      {/* Path Selector Tabs (Touch-friendly grid) */}
      <div className="p-3 bg-paper/70 border-b border-line grid grid-cols-2 sm:grid-cols-4 gap-2">
        {COALITION_PATHS.map((path) => {
          const isSelected = path.id === selectedPathId;
          const pathViable = path.voterPool >= targetThreshold;
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
                <span className={`w-2 h-2 rounded-full ${pathViable ? "bg-emerald-500" : "bg-rose-500"}`} />
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
              {selectedPath.voterPool.toLocaleString()} / 200,000 ({shareOfCounty.toFixed(2)}% of County Register)
            </span>
          </div>
          <div className="h-3.5 bg-paper border border-line rounded-full overflow-hidden p-0.5 relative">
            <motion.div
              key={selectedPath.id}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, progressPercent)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full ${
                isViable
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

        {/* Turnout Sensitivity -- how much of the ballots CAST would need to go to Dr. Mulu,
            not just how many voters are registered there. Modelled, not observed. */}
        <div className="p-4 bg-paper rounded-2xl border border-line space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="turnout-slider" className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Sliders size={14} className="text-accent" />
              <span>Turnout sensitivity, this coalition:</span>
            </label>
            <div className="flex items-center gap-2">
              <ClaimBadge status="estimate" compact />
              <span className="font-mono text-sm font-black text-accent">{Math.round(turnout * 100)}%</span>
            </div>
          </div>
          <input
            id="turnout-slider"
            type="range"
            min={TURNOUT_MIN}
            max={TURNOUT_MAX}
            step={0.01}
            value={turnout}
            onChange={(e) => setTurnout(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer h-2 bg-line rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted font-semibold">
            <span>{Math.round(TURNOUT_MIN * 100)}% (Low turnout)</span>
            <span>62% (2022 county average)</span>
            <span>{Math.round(TURNOUT_MAX * 100)}% (High turnout)</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 bg-card border border-line rounded-xl">
              <div className="text-[10px] font-black uppercase tracking-wider text-muted">Ballots cast in coalition</div>
              <div className="font-serif text-lg font-bold text-ink mt-0.5">{ballotsCast.toLocaleString()}</div>
            </div>
            <div className={`p-3 border rounded-xl ${shareNeeded <= 100 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
              <div className={`text-[10px] font-black uppercase tracking-wider ${shareNeeded <= 100 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>Share of those ballots needed</div>
              <div className="font-serif text-lg font-bold text-ink mt-0.5">{shareNeeded > 100 ? "Impossible" : `${shareNeeded.toFixed(0)}%`}</div>
            </div>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Worst-case model: assumes every one of Dr. Mulu&apos;s 200,000 votes comes from this coalition alone. Lower turnout means fewer ballots cast, so a larger share of them has to go his way — this is why Path B&apos;s wider registered-voter cushion matters more as turnout drops.
          </p>
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
