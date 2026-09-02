"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Calendar, Target, CheckCircle2, AlertTriangle, Flame, Sparkles, Sliders } from "lucide-react";

export function PollingTrajectorySimulator() {
  const [weeklyGainRate, setWeeklyGainRate] = useState<number>(1.2); // Percentage points per week
  const initialPolling = 22.1; // Baseline Mulu %
  const kasaluBaseline = 37.4; // Baseline Kasalu %
  const targetThreshold = 40.0; // Nomination viability mark
  const weeksToNomination = 14; // Approximate weeks in Phase -1 / Phase 0

  const projectedPolling = Math.min(65.0, initialPolling + (weeklyGainRate * weeksToNomination));
  const pointsGained = projectedPolling - initialPolling;
  const isSurpassingKasalu = projectedPolling > kasaluBaseline;
  const isMeetingThreshold = projectedPolling >= targetThreshold;

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Simulation Engine
              </span>
              <span className="t-label font-mono font-bold text-muted">
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
              <AlertTriangle size={14} />
              <span>Below Viability Threshold ({projectedPolling.toFixed(1)}%)</span>
            </>
          )}
        </div>
      </div>

      {/* Simulator Control & Visualizer */}
      <div className="p-4 sm:p-6 space-y-6">
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

          <div className="flex justify-between t-label font-mono text-muted font-semibold">
            <span>0.4% (Organic Pace)</span>
            <span>1.2% (Recommended Baseline)</span>
            <span>2.5% (High-Intensity Airwaves)</span>
          </div>
        </div>

        {/* Trajectory Outcome Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-paper/60 border border-line rounded-xl space-y-1">
            <div className="t-label font-black uppercase tracking-wider text-muted">Baseline Polling (Mizani)</div>
            <div className="font-serif text-2xl font-bold text-muted">22.1%</div>
            <div className="t-small text-muted">Initial standing in county</div>
          </div>

          <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-1">
            <div className="t-label font-black uppercase tracking-wider text-accent">Simulated 14-Week Standing</div>
            <div className="font-serif text-2xl font-bold text-ink">
              {projectedPolling.toFixed(1)}%
            </div>
            <div className="t-small text-emerald-600 dark:text-emerald-400 font-bold">
              +{pointsGained.toFixed(1)}% Total Improvement
            </div>
          </div>

          <div className="p-4 bg-paper/60 border border-line rounded-xl space-y-1">
            <div className="t-label font-black uppercase tracking-wider text-muted">Benchmark Target</div>
            <div className="font-serif text-2xl font-bold text-ink">40.0%+</div>
            <div className="t-small text-muted">Wiper Nomination threshold</div>
          </div>
        </div>

        {/* Strategic Takeaway Card */}
        <div className="p-4 rounded-xl bg-paper border border-line flex items-start gap-3">
          <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-muted leading-relaxed">
            <strong className="text-ink">Operational Prescription:</strong> At a growth rate of <strong>+{weeklyGainRate.toFixed(1)}% per week</strong>, Dr. Mulu {isSurpassingKasalu ? "successfully overtakes Irene Kasalu (37.4%) and establishes" : "narrows the gap with Irene Kasalu but requires additional vernacular radio saturation to establish"} an undeniable mandate for the Wiper gubernatorial nomination before delegates convene in late 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
