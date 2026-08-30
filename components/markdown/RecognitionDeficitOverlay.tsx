"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Target, 
  MapPin, 
  TrendingDown, 
  Radio, 
  MessageSquare, 
  Compass, 
  ChevronRight,
  AlertCircle,
  BarChart3
} from "lucide-react";

interface DeficitWard {
  rank: number;
  name: string;
  constituency: string;
  voters: number;
  isDeficitZone: boolean;
  muluPollingBaseline: number; // %
  kasaluPollingBaseline: number; // %
  primaryChannel: string;
}

const TOP_DECISIVE_WARDS: DeficitWard[] = [
  { rank: 1, name: "Kitui Township", constituency: "Kitui Central", voters: 28412, isDeficitZone: false, muluPollingBaseline: 64.2, kasaluPollingBaseline: 18.5, primaryChannel: "Digital / WhatsApp Townhalls" },
  { rank: 2, name: "Kyangwithya West", constituency: "Kitui Central", voters: 22105, isDeficitZone: false, muluPollingBaseline: 58.0, kasaluPollingBaseline: 22.0, primaryChannel: "Church Ground Networks" },
  { rank: 3, name: "Mwingi Central", constituency: "Mwingi Central", voters: 21940, isDeficitZone: true, muluPollingBaseline: 19.4, kasaluPollingBaseline: 41.2, primaryChannel: "Musyi FM + USSD Push" },
  { rank: 4, name: "Mutomo", constituency: "Kitui South", voters: 20850, isDeficitZone: true, muluPollingBaseline: 14.8, kasaluPollingBaseline: 48.6, primaryChannel: "Vernacular Radio + Market Agents" },
  { rank: 5, name: "Waita", constituency: "Mwingi Central", voters: 18920, isDeficitZone: true, muluPollingBaseline: 18.1, kasaluPollingBaseline: 39.5, primaryChannel: "SMS Broadcasts + Cattle Dips" },
  { rank: 6, name: "Ikutha", constituency: "Kitui South", voters: 18150, isDeficitZone: true, muluPollingBaseline: 12.3, kasaluPollingBaseline: 51.0, primaryChannel: "Women Chamas + Vernacular Radio" },
  { rank: 7, name: "Kyuso", constituency: "Mwingi North", voters: 17640, isDeficitZone: true, muluPollingBaseline: 16.5, kasaluPollingBaseline: 38.0, primaryChannel: "Sang'u FM + Bodaboda Sheds" },
  { rank: 8, name: "Matinyani", constituency: "Kitui West", voters: 16980, isDeficitZone: false, muluPollingBaseline: 34.0, kasaluPollingBaseline: 29.5, primaryChannel: "Clan Elders + WhatsApp Voice" },
];

export function RecognitionDeficitOverlay() {
  const [filterMode, setFilterMode] = useState<"all" | "deficitOnly">("all");

  const displayedWards = filterMode === "all" 
    ? TOP_DECISIVE_WARDS 
    : TOP_DECISIVE_WARDS.filter(w => w.isDeficitZone);

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Target size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Strategic Disparity Matrix
              </span>
              <span className="text-[10px] font-mono font-bold text-muted">
                5 of Top 8 Wards in Deficit Belt
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Recognition Deficit vs Electoral Density
            </h4>
          </div>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center p-1 bg-paper border border-line rounded-xl">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterMode === "all" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            All Top 8 Wards
          </button>
          <button
            onClick={() => setFilterMode("deficitOnly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterMode === "deficitOnly" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            Deficit Wards Only (5)
          </button>
        </div>
      </div>

      {/* Strategic Deficit Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line border-b border-line bg-card">
        <div className="p-3.5 sm:p-4 text-center sm:text-left">
          <div className="text-[10px] uppercase font-black tracking-widest text-muted">Total Deficit Pool</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-ink mt-0.5">275,570 Voters</div>
          <div className="text-[11px] text-muted mt-0.5">51.72% of Kitui registered base</div>
        </div>
        <div className="p-3.5 sm:p-4 text-center sm:text-left">
          <div className="text-[10px] uppercase font-black tracking-widest text-muted">Baseline Polling Deficit</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">-15.3 pts</div>
          <div className="text-[11px] text-muted mt-0.5">Kasalu 37.4% vs Mulu 22.1%</div>
        </div>
        <div className="p-3.5 sm:p-4 text-center sm:text-left">
          <div className="text-[10px] uppercase font-black tracking-widest text-muted">Recommended Ad Budget Split</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-accent mt-0.5">65.0% Northern/Southern</div>
          <div className="text-[11px] text-muted mt-0.5">Focus: Mwingi + Kitui South</div>
        </div>
      </div>

      {/* Interactive Ward Card Stack (Responsive & Touch-Optimized) */}
      <div className="p-3 sm:p-4 space-y-2.5">
        {displayedWards.map((w) => {
          const diff = w.kasaluPollingBaseline - w.muluPollingBaseline;
          const isLeading = w.muluPollingBaseline > w.kasaluPollingBaseline;

          return (
            <div
              key={w.rank}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                w.isDeficitZone
                  ? "bg-paper/80 border-rose-500/20 hover:border-rose-500/40"
                  : "bg-paper/40 border-line hover:border-accent/40"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-card border border-line flex items-center justify-center text-xs font-mono font-black text-accent shrink-0">
                    #{w.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-ink">{w.name}</span>
                      <span className="text-[10px] font-semibold text-muted">({w.constituency})</span>
                      {w.isDeficitZone && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Deficit Zone
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-muted mt-0.5">
                      {w.voters.toLocaleString()} registered voters
                    </div>
                  </div>
                </div>

                {/* Polling Comparison Bars */}
                <div className="flex items-center gap-3 sm:justify-end">
                  <div className="text-right">
                    <div className="text-[10px] text-muted font-bold">Mulu vs Kasalu</div>
                    <div className="text-xs font-mono font-bold">
                      <span className="text-accent">{w.muluPollingBaseline}%</span>
                      <span className="text-muted mx-1">vs</span>
                      <span className="text-rose-500">{w.kasaluPollingBaseline}%</span>
                    </div>
                  </div>

                  <div className={`px-2 py-1 rounded-lg text-[10px] font-mono font-black ${
                    isLeading 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}>
                    {isLeading ? `+${(w.muluPollingBaseline - w.kasaluPollingBaseline).toFixed(1)}%` : `-${diff.toFixed(1)}%`}
                  </div>
                </div>
              </div>

              {/* Recommended Operational Action Strip */}
              <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between text-[11px]">
                <span className="text-muted flex items-center gap-1.5">
                  <Radio size={12} className="text-accent" />
                  <span className="font-medium">Primary Tactical Channel:</span>
                  <span className="font-semibold text-ink">{w.primaryChannel}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Note */}
      <div className="p-3 bg-paper/60 border-t border-line text-[11px] text-muted flex items-center gap-2 px-4 font-medium">
        <AlertCircle size={13} className="text-accent shrink-0" />
        <span>Actionable Takeaway: Dr. Mulu must not over-invest in Kitui Central base (+45.7% lead) at the expense of high-density Mwingi and South wards.</span>
      </div>
    </div>
  );
}
