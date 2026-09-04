"use client";

import React, { useState } from "react";
import { type WardPulseData } from "@/data/terminal-showcase";
import { ShoppingBag, Users, FileText, Bike, Play, Pause, Volume2 } from "lucide-react";

export function MarketAuditScreen({ data }: { data: WardPulseData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const market = data.marketData;

  return (
    <div className="flex flex-col h-full bg-[#0d121b] text-slate-100 p-4 font-sans select-none overflow-hidden">
      {/* Screen Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="text-[11px] font-mono tracking-wider text-amber-400 uppercase font-semibold">
            MEA-08 • Market Day Event Audit
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Weekly Ground Recon
        </div>
      </div>

      {/* Market Location Header */}
      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Target Commercial Hub</div>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            {market?.marketName || "Ward Trading Center"}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
            Active Market Day
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[9px] font-mono uppercase mb-0.5">
            <Users className="w-2.5 h-2.5 text-cyan-400" /> Crowd
          </div>
          <div className="text-xs font-bold font-mono text-white">
            {market?.crowdEstimate.split(" ")[0] || "3,500+"}
          </div>
          <div className="text-[9px] text-slate-400">Attendees</div>
        </div>

        <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[9px] font-mono uppercase mb-0.5">
            <FileText className="w-2.5 h-2.5 text-emerald-400" /> Leaflets
          </div>
          <div className="text-xs font-bold font-mono text-emerald-400">
            {market?.leafletsDistributed.toLocaleString() || "1,500"}
          </div>
          <div className="text-[9px] text-slate-400">Kikamba/ENG</div>
        </div>

        <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[9px] font-mono uppercase mb-0.5">
            <Bike className="w-2.5 h-2.5 text-amber-400" /> Boda
          </div>
          <div className="text-xs font-bold font-mono text-amber-300">
            {market?.bodaBodaChampionsActive || "30"}
          </div>
          <div className="text-[9px] text-slate-400">Champions</div>
        </div>
      </div>

      {/* Field Audio Dispatch Player */}
      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 mb-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
          <span className="flex items-center gap-1 text-cyan-400">
            <Volume2 className="w-3 h-3" /> Vernacular Audio Memo
          </span>
          <span>{data.recentAudioDispatch.duration}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center justify-center border border-cyan-500/40 transition shrink-0"
            aria-label={isPlaying ? "Pause audio memo" : "Play audio memo"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-slate-200 truncate">
              {data.recentAudioDispatch.title}
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              {data.recentAudioDispatch.speaker} • {data.recentAudioDispatch.location}
            </div>
            {/* Simulated audio waveform */}
            <div className="flex items-end gap-0.5 h-3 mt-1">
              {[4, 8, 12, 6, 14, 10, 5, 9, 13, 11, 7, 12, 15, 8, 5, 10, 14, 9, 6, 11, 8, 4, 12, 7, 5].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-sm transition-all duration-300 ${
                    isPlaying ? "bg-cyan-400" : "bg-slate-700"
                  }`}
                  style={{ height: `${isPlaying ? Math.max(3, (h * ((i % 3) + 1.2)) % 14) : h}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grassroots Sentiment Quote */}
      <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/80 mb-2 flex-1 flex flex-col justify-center">
        <span className="text-[9px] font-mono uppercase text-slate-400 mb-1">
          Direct Ground Sentiment Recorded
        </span>
        <p className="text-xs italic text-slate-300 leading-relaxed">
          &ldquo;{market?.keyQuote || "Traders emphasize local water storage and market gate fees."}&rdquo;
        </p>
      </div>

      {/* Sync Footer */}
      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800">
        <span>Channel: Kikamba Sound Notes</span>
        <span className="text-emerald-400">War Room Synced</span>
      </div>
    </div>
  );
}
