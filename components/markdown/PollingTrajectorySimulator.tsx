"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Sparkles,
  Sliders
} from "lucide-react";

// Two different 14-week closing-rate models share this one slider mechanic: countywide
// preference share (Mizani Africa, Tier 2) and the Mwingi sub-county name-recognition gap
// (Section 3, Operational Commitment 1, baseline/target figures already stated there, Tier 2).
// Neither number here is new research -- both are already-cited figures in the document;
// this only adds the closing-rate sensitivity the prose doesn't model on its own.
interface TrajectoryScenario {
  id: string;
  label: string;
  short: string;
  baseline: number;
  rivalBaseline: number | null;
  rivalLabel: string | null;
  target: number;
  targetLabel: string;
  sourceNote: string;
}

const SCENARIOS: TrajectoryScenario[] = [
  {
    id: "countywide",
    label: "Countywide preference (Mizani Africa)",
    short: "Preference",
    baseline: 22.1,
    rivalBaseline: 37.4,
    rivalLabel: "Kasalu",
    target: 40.0,
    targetLabel: "Wiper nomination threshold",
    sourceNote: "Mizani Africa, 7 August 2026 (Tier 2) — Section 1.1",
  },
  {
    id: "mwingi",
    label: "Mwingi sub-county name recognition",
    short: "Recognition",
    baseline: 12.0,
    rivalBaseline: null,
    rivalLabel: null,
    target: 45.0,
    targetLabel: "Operational Commitment 1 target",
    sourceNote: "Section 3, Operational Commitment 1 (Tier 2) — internal tracking baseline",
  },
];

export function PollingTrajectorySimulator() {
  const [weeklyGainRate, setWeeklyGainRate] = useState<number>(1.2); // Percentage points per week
  const [scenarioId, setScenarioId] = useState<string>("countywide");
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const initialPolling = scenario.baseline;
  const kasaluBaseline = scenario.rivalBaseline;
  const targetThreshold = scenario.target;
  const weeksToNomination = 14; // Approximate weeks in Phase -1 / Phase 0

  const projectedPolling = Math.min(95.0, initialPolling + (weeklyGainRate * weeksToNomination));
  const pointsGained = projectedPolling - initialPolling;
  const isSurpassingKasalu = kasaluBaseline === null ? true : projectedPolling > kasaluBaseline;
  const isMeetingThreshold = projectedPolling >= targetThreshold;

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Simulation Engine
              </span>
              <span className="text-[10px] font-mono font-bold text-muted">
                Phase -1 Evaluation Window
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Wiper Nomination Viability Simulator
            </h4>
          </div>
        </div>

        {/* Status Pill */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 self-start sm:self-auto ${
          isMeetingThreshold 
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
        }`}>
          {isMeetingThreshold ? (
            <>
              <CheckCircle2 size={14} />
              <span>Target Achieved ({projectedPolling.toFixed(1)}%)</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} />
              <span>Below Viability Threshold ({projectedPolling.toFixed(1)}%)</span>
            </>
          )}
        </div>
      </div>

      {/* Simulator Control & Visualizer */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Scenario toggle -- two different 14-week closing-rate models, same mechanic */}
        <div className="flex gap-1.5 p-1 bg-paper rounded-xl border border-line">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className={`flex-1 px-2.5 py-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                s.id === scenarioId ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {s.short}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted -mt-3">{scenario.label} · <span className="italic">{scenario.sourceNote}</span></p>

        {/* Interactive Slider */}
        <div className="p-4 bg-paper rounded-2xl border border-line space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="gain-rate-slider" className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Sliders size={14} className="text-accent" />
              <span>Target Weekly Growth Rate (Points / Week):</span>
            </label>
            <span className="font-mono text-sm font-black text-accent">
              +{weeklyGainRate.toFixed(1)}% / wk
            </span>
          </div>

          <input
            id="gain-rate-slider"
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={weeklyGainRate}
            onChange={(e) => setWeeklyGainRate(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer h-2 bg-line rounded-lg"
          />

          <div className="flex justify-between text-[10px] font-mono text-muted font-semibold">
            <span>0.4% (Organic Pace)</span>
            <span>1.2% (Recommended Baseline)</span>
            <span>2.5% (High-Intensity Airwaves)</span>
          </div>
        </div>

        {/* Trajectory Outcome Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-paper/60 border border-line rounded-xl space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted">Baseline</div>
            <div className="font-serif text-2xl font-bold text-muted">{initialPolling.toFixed(1)}%</div>
            <div className="text-[11px] text-muted">{scenario.label}</div>
          </div>

          <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-accent">Simulated 14-Week Standing</div>
            <div className="font-serif text-2xl font-bold text-ink">
              {projectedPolling.toFixed(1)}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              +{pointsGained.toFixed(1)}% Total Improvement
            </div>
          </div>

          <div className="p-4 bg-paper/60 border border-line rounded-xl space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted">Benchmark Target</div>
            <div className="font-serif text-2xl font-bold text-ink">{targetThreshold.toFixed(1)}%+</div>
            <div className="text-[11px] text-muted">{scenario.targetLabel}</div>
          </div>
        </div>

        {/* Strategic Takeaway Card */}
        <div className="p-4 rounded-xl bg-paper border border-line flex items-start gap-3">
          <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-muted leading-relaxed">
            <strong className="text-ink">Operational Prescription:</strong> At a growth rate of <strong>+{weeklyGainRate.toFixed(1)}% per week</strong>, {scenario.id === "countywide"
              ? `Dr. Mulu ${isSurpassingKasalu ? "overtakes Irene Kasalu (37.4%) and establishes" : "narrows the gap with Irene Kasalu but needs additional vernacular radio saturation to establish"} an undeniable mandate for the Wiper gubernatorial nomination before delegates convene in late 2026.`
              : `Mwingi sub-county recognition ${isMeetingThreshold ? "clears" : "falls short of"} the 45% Operational Commitment 1 target within the 14-week Phase −1 window, ${isMeetingThreshold ? "removing" : "leaving"} the single biggest driver of the countywide preference deficit ${isMeetingThreshold ? "as a closed risk" : "open"}.`}
          </div>
        </div>
      </div>
    </div>
  );
}
