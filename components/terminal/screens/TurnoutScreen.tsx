"use client";

import React from "react";
import { type WardPulseData } from "@/data/terminal-showcase";
import { Gauge, CheckCircle, BarChart2, ShieldCheck, MapPin } from "lucide-react";

export function TurnoutScreen({ data }: { data: WardPulseData }) {
  const turnout = data.turnoutPacing;

  return (
    <div className="flex flex-col h-full bg-[#0d121b] text-slate-100 p-4 font-sans select-none overflow-hidden">
      {/* Screen Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="text-[11px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
            TPC-200K • Turnout & Pacing Check
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Threshold: 198,004
        </div>
      </div>

      {/* Ward Velocity Banner */}
      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Polling Day Stream Pacing</div>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            {data.ward} Ward ({data.constituency})
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono text-slate-400">Stream Status</div>
          <div className="text-xs font-mono font-bold text-emerald-400">On Target (+2.4%)</div>
        </div>
      </div>

      {/* Dual Gauge Comparison */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" /> Pacing Rate
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {turnout?.currentPacingPct || 76.5}%
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">
            Target benchmark: {turnout?.targetTurnoutPct || 75}%
          </div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 flex items-center gap-1">
            <BarChart2 className="w-3 h-3 text-emerald-400" /> Projected Yield
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {turnout ? turnout.projectedVotes.toLocaleString() : "—"}
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">
            {turnout ? `of ${turnout.registeredVoters.toLocaleString()} register` : ""}
          </div>
        </div>
      </div>

      {/* Polling Station Agent Verification */}
      <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800/80 mb-3 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-400">
            Station Agent Deployment
          </span>
          <span className="text-[10px] font-mono text-cyan-400 font-semibold">
            {turnout?.pollingStationsReporting} Stations Reporting
          </span>
        </div>

        {/* Progress bar of reporting stations */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-cyan-400 rounded-full w-full" />
        </div>

        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Form 37A Digital Photo Verified
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">100%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" /> Tamper-Evident Bag Seal Logged
            </span>
            <span className="text-[10px] font-mono text-teal-400 font-bold">100%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800">
        <span>IEBC Tally Reconciliation</span>
        <span className="text-emerald-400 font-bold">Zero Anomalies</span>
      </div>
    </div>
  );
}
