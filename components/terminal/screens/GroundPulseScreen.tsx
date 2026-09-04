"use client";

import React from "react";
import { type WardPulseData } from "@/data/terminal-showcase";
import { Activity, Radio, Users, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

export function GroundPulseScreen({ data }: { data: WardPulseData }) {
  const pctOfTarget = Math.min(100, Math.round((data.totalWardSupporters / data.targetThreshold) * 100));

  return (
    <div className="flex flex-col h-full bg-[#0d121b] text-slate-100 p-4 font-sans select-none overflow-hidden">
      {/* Screen Sub-Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono tracking-wider text-emerald-400 uppercase font-semibold">
            DGP-40 • Ground Pulse Protocol
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono text-slate-400">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>{data.channel}</span>
        </div>
      </div>

      {/* Ward Identification Banner */}
      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
            {data.constituency} Constituency
          </div>
          <div className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            {data.ward} Ward
            <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {data.moodIndex}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-400">Field Coordinator</div>
          <div className="text-xs font-medium text-slate-200">{data.coordinator}</div>
        </div>
      </div>

      {/* Main Content Cards */}
      <div className="flex-1 space-y-2.5 overflow-hidden flex flex-col justify-between">
        {/* Dominant Local Issue / Field Radar */}
        <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-400" /> Dominant Ground Anxiety / Issue
            </span>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
              Verified 18:00 EAT
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-snug font-medium">
            &ldquo;{data.dominantIssue}&rdquo;
          </p>
        </div>

        {/* Competitor Reconnaissance */}
        <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" /> Adversary Field Activity
            </span>
            <span className="text-[9px] font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-900/40">
              Monitored
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            {data.competitorSignal}
          </p>
        </div>

        {/* Supporter Metric Block */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg p-3 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold text-slate-200">Verified Pledges & Supporter Roll</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5 font-semibold">
              <TrendingUp className="w-3 h-3" />
              +{data.optInSupportersToday} today
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xl font-bold font-mono text-white tracking-tight">
              {data.totalWardSupporters.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">
              target: {data.targetThreshold.toLocaleString()} ({pctOfTarget}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${pctOfTarget}%` }}
            />
          </div>
        </div>

        {/* Terminal Status Footer */}
        <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Ground mesh synchronized
          </span>
          <span>Encrypted 256-bit</span>
        </div>
      </div>
    </div>
  );
}
