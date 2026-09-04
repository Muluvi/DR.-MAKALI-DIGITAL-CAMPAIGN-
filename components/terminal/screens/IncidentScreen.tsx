"use client";

import React from "react";
import { type WardPulseData } from "@/data/terminal-showcase";
import { ShieldAlert, AlertOctagon, CheckCircle2, Clock, Send, Radio } from "lucide-react";

export function IncidentScreen({ data }: { data: WardPulseData }) {
  const alert = data.incidentAlert;

  const isTier1 = alert?.tier.includes("Tier 1");
  const isTier2 = alert?.tier.includes("Tier 2");

  return (
    <div className="flex flex-col h-full bg-[#0d121b] text-slate-100 p-4 font-sans select-none overflow-hidden">
      {/* Screen Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isTier1 ? "bg-rose-400" : isTier2 ? "bg-amber-400" : "bg-blue-400"} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isTier1 ? "bg-rose-500" : isTier2 ? "bg-amber-500" : "bg-blue-500"}`} />
          </span>
          <span className="text-[11px] font-mono tracking-wider text-rose-400 uppercase font-semibold">
            IAD-SEC • Incident Rapid Response
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{alert?.timestamp || "14:15 EAT"}</span>
        </div>
      </div>

      {/* Incident Severity Banner */}
      <div
        className={`rounded-lg p-2.5 border mb-3 flex items-center justify-between ${
          isTier1
            ? "bg-rose-950/30 border-rose-800/80 text-rose-200"
            : isTier2
            ? "bg-amber-950/30 border-amber-800/80 text-amber-200"
            : "bg-blue-950/30 border-blue-800/80 text-blue-200"
        }`}
      >
        <div className="flex items-center gap-2">
          {isTier1 ? (
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div>
            <div className="text-[11px] font-bold tracking-tight">
              {alert?.tier || "Tier 2 — High Priority"}
            </div>
            <div className="text-[9px] font-mono opacity-80">
              Ward Coordinates: {data.ward} • {data.constituency}
            </div>
          </div>
        </div>
        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
          Logged
        </span>
      </div>

      {/* Incident Body */}
      <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 mb-3 space-y-2">
        <div className="text-[10px] font-mono uppercase text-slate-400">
          Reported Hostile Information / Action
        </div>
        <p className="text-xs text-slate-200 font-medium leading-relaxed">
          &ldquo;{alert?.incidentType || "Misinformation circulating in local transport stages."}&rdquo;
        </p>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">Attribution Source:</span>
          <span className="text-rose-300 font-semibold">{alert?.adversary || "Unverified proxy"}</span>
        </div>
      </div>

      {/* Protocol Response Action */}
      <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800/80 mb-3 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> War Room Counter-Action
          </span>
          <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            Target SLA: &lt;15m
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Send className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Debunk dispatch drafted in Kikamba & Kiswahili</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Broadcast alert queued for evening radio drive-time</span>
          </div>
        </div>

        <div className="mt-2.5 p-2 rounded bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-300">Status:</span>
          <span className="text-emerald-300 font-bold">{alert?.status || "Counter-Ad Geofenced"}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800">
        <span>Rapid Response Desk #5</span>
        <span className="text-cyan-400">Auto-Alert Pushed</span>
      </div>
    </div>
  );
}
