"use client";

import React from "react";
import { type WardPulseData } from "@/data/terminal-showcase";
import { Gauge, CircleCheckBig, ChartNoAxesColumn, ShieldCheck, MapPin } from "lucide-react";

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
          <span className="font-mono text-cyan-400 font-semibold" style={{ fontSize: "0.6875em" }}>
            TPC-200K • Turnout & Pacing Check
          </span>
        </div>
        <div className="font-mono text-slate-400" style={{ fontSize: "0.625em" }}>
          Threshold: 198,004
        </div>
      </div>

      {/* Ward Velocity Banner */}
      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 mb-3 flex items-center justify-between">
        <div>
          <div className="font-mono text-slate-400 uppercase" style={{ fontSize: "0.625em" }}>Polling Day Stream Pacing</div>
          <div className="font-bold text-white flex items-center gap-1.5" style={{ fontSize: "0.875em" }}>
            <MapPin className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            {data.ward} Ward ({data.constituency})
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-slate-400" style={{ fontSize: "0.5625em" }}>Stream Status</div>
          <div className="font-mono font-bold text-emerald-400" style={{ fontSize: "0.75em" }}>On Target (+2.4%)</div>
        </div>
      </div>

      {/* Dual Gauge Comparison */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div className="font-mono uppercase text-slate-400 mb-1 flex items-center gap-1" style={{ fontSize: "0.625em" }}>
            <Gauge className="w-3 h-3 text-cyan-400" aria-hidden="true" /> Pacing Rate
          </div>
          <div className="font-bold font-mono text-white" style={{ fontSize: "1.25em" }}>
            {turnout?.currentPacingPct || 76.5}%
          </div>
          <div className="text-slate-400 mt-0.5" style={{ fontSize: "0.5625em" }}>
            Target benchmark: {turnout?.targetTurnoutPct || 75}%
          </div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div className="font-mono uppercase text-slate-400 mb-1 flex items-center gap-1" style={{ fontSize: "0.625em" }}>
            <ChartNoAxesColumn className="w-3 h-3 text-emerald-400" aria-hidden="true" /> Projected Yield
          </div>
          <div className="font-bold font-mono text-emerald-400" style={{ fontSize: "1.25em" }}>
            {turnout ? turnout.projectedVotes.toLocaleString() : "—"}
          </div>
          <div className="text-slate-400 mt-0.5" style={{ fontSize: "0.5625em" }}>
            {turnout ? `of ${turnout.registeredVoters.toLocaleString()} register` : ""}
          </div>
        </div>
      </div>

      {/* Polling Station Agent Verification */}
      <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800/80 mb-3 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono uppercase text-slate-400" style={{ fontSize: "0.625em" }}>
            Station Agent Deployment
          </span>
          <span className="font-mono text-cyan-400 font-semibold" style={{ fontSize: "0.625em" }}>
            {turnout?.pollingStationsReporting} Stations Reporting
          </span>
        </div>

        {/* Progress bar of reporting stations */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-cyan-400 rounded-full w-full" />
        </div>

        <div className="space-y-1.5 text-slate-300" style={{ fontSize: "0.75em" }}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> Form 37A Digital Photo Verified
            </span>
            <span className="font-mono text-emerald-400 font-bold" style={{ fontSize: "0.625em" }}>100%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CircleCheckBig className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" /> Tamper-Evident Bag Seal Logged
            </span>
            <span className="font-mono text-teal-400 font-bold" style={{ fontSize: "0.625em" }}>100%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-1 flex items-center justify-between font-mono text-slate-400 border-t border-slate-800" style={{ fontSize: "0.625em" }}>
        <span>IEBC Tally Reconciliation</span>
        <span className="text-emerald-400 font-bold">Zero Anomalies</span>
      </div>
    </div>
  );
}
