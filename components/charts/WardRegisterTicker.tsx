"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { Trophy, TrendingDown, Pause, Play, Compass, ArrowUpRight, CheckCircle2, ChevronRight, Gauge } from "lucide-react";
import { CONSTITUENCIES, ALL_WARDS, COUNTY_TOTAL_WARDS, type Ward } from "../../data/ward-register";
import { useMarqueeActive } from "../../hooks/use-marquee-active";

type FilterMode = "all" | "top" | "bottom";

interface RankedWard {
  rank: number;
  name: string;
  constituencyName: string;
  voters: number;
  sharePercent: number;
  performanceTier: "top" | "mid" | "bottom";
  deltaFromMean: number;
}

export function WardRegisterTicker() {
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState<number>(36);
  const [selectedWard, setSelectedWard] = useState<RankedWard | null>(null);

  const { containerRef, isActive } = useMarqueeActive<HTMLDivElement>();

  // Calculate sorted rankings and performance classification dynamically
  const rankedWards: RankedWard[] = useMemo(() => {
    const sorted = [...ALL_WARDS].sort((a, b) => b.voters - a.voters);
    const mean = Math.round(COUNTY_TOTAL_WARDS / sorted.length);

    return sorted.map((w, idx) => {
      const rank = idx + 1;
      let performanceTier: "top" | "mid" | "bottom" = "mid";
      if (rank <= 10) performanceTier = "top";
      else if (rank > 30) performanceTier = "bottom";

      return {
        rank,
        name: w.name,
        constituencyName: w.constituencyName,
        voters: w.voters,
        sharePercent: (w.voters / COUNTY_TOTAL_WARDS) * 100,
        performanceTier,
        deltaFromMean: w.voters - mean,
      };
    });
  }, []);

  const topPerformerCount = 10;
  const bottomPerformerCount = 10;

  const filteredWards = useMemo(() => {
    if (filterMode === "top") {
      return rankedWards.slice(0, topPerformerCount);
    }
    if (filterMode === "bottom") {
      return rankedWards.slice(-bottomPerformerCount);
    }
    return rankedWards;
  }, [filterMode, rankedWards]);

  const top10Total = useMemo(() => {
    return rankedWards.slice(0, 10).reduce((acc, w) => acc + w.voters, 0);
  }, [rankedWards]);

  const bottom10Total = useMemo(() => {
    return rankedWards.slice(-10).reduce((acc, w) => acc + w.voters, 0);
  }, [rankedWards]);

  // Determine if motion should be active
  const isScrolling = isActive && !isPausedByUser;

  return (
    <div className="w-full bg-paper/60 border border-line/80 rounded-2xl p-3.5 sm:p-4 my-4 shadow-sm select-none">
      {/* Header controls & filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-line/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
            <Gauge size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-serif text-xs sm:text-sm font-bold text-ink">
                40-Ward IEBC Voter Register Stream
              </h5>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent">
                Live Dynamic Ticker
              </span>
            </div>
            <p className="text-[11px] text-muted">
              Auto-scrolling registry sorted by IEBC registered voter strength
            </p>
          </div>
        </div>

        {/* Filter modes and playback controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="inline-flex p-0.5 bg-card border border-line/60 rounded-xl">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                filterMode === "all"
                  ? "bg-accent text-white shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              All 40 Wards
            </button>
            <button
              onClick={() => setFilterMode("top")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === "top"
                  ? "bg-gold text-ink shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Trophy size={11} className={filterMode === "top" ? "text-ink" : "text-gold"} />
              <span>Top 10</span>
            </button>
            <button
              onClick={() => setFilterMode("bottom")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === "bottom"
                  ? "bg-line/90 text-ink shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <TrendingDown size={11} className="text-muted" />
              <span>Turnout Frontiers</span>
            </button>
          </div>

          {/* Pause / Resume button */}
          <button
            onClick={() => setIsPausedByUser(!isPausedByUser)}
            className="p-1.5 rounded-xl bg-card border border-line text-ink hover:border-accent/40 active:scale-95 transition-all cursor-pointer"
            title={isPausedByUser ? "Resume ticker" : "Pause ticker"}
            aria-label={isPausedByUser ? "Resume ticker" : "Pause ticker"}
          >
            {isPausedByUser ? <Play size={13} className="text-accent" /> : <Pause size={13} className="text-muted" />}
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-3 text-xs">
        <div className="bg-card/70 border border-line/60 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] text-muted">Top 10 Wards Concentration:</span>
          <span className="font-mono font-bold text-ink">{top10Total.toLocaleString()} voters</span>
        </div>
        <div className="bg-card/70 border border-line/60 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] text-muted">Frontier 10 Wards Total:</span>
          <span className="font-mono font-bold text-ink">{bottom10Total.toLocaleString()} voters</span>
        </div>
        <div className="bg-card/70 border border-line/60 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] text-muted">County Ward Average:</span>
          <span className="font-mono font-bold text-accent">13,319 voters</span>
        </div>
      </div>

      {/* Continuous Ticker Carousel */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none py-2 my-1"
        onMouseEnter={() => setIsPausedByUser(true)}
        onMouseLeave={() => setIsPausedByUser(false)}
      >
        {/* Soft edge gradient fade masks */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-paper/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-paper/90 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-2.5 w-max pr-3"
          animate={isScrolling ? { x: ["0%", "-50%"] } : {}}
          transition={{
            ease: "linear",
            duration: filterMode === "all" ? tickerSpeed : Math.max(16, tickerSpeed / 2.5),
            repeat: Infinity,
          }}
        >
          {/* Primary Set */}
          <div className="flex gap-2.5 shrink-0">
            {filteredWards.map((ward) => {
              const isSelected = selectedWard?.name === ward.name;
              return (
                <div
                  key={`ward-a-${ward.name}`}
                  onClick={() => setSelectedWard(isSelected ? null : ward)}
                  className={`flex items-center gap-2.5 bg-card border rounded-xl px-3 py-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-accent ring-2 ring-accent/30 bg-accent/5 shadow-md"
                      : ward.performanceTier === "top"
                      ? "border-gold/50 hover:border-gold shadow-xs"
                      : ward.performanceTier === "bottom"
                      ? "border-line/70 hover:border-line"
                      : "border-line/60 hover:border-accent/40 shadow-xs"
                  }`}
                >
                  {/* Rank Badge */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-black shrink-0 ${
                      ward.performanceTier === "top"
                        ? "bg-gold text-ink"
                        : ward.performanceTier === "bottom"
                        ? "bg-line text-muted"
                        : "bg-paper text-ink border border-line"
                    }`}
                  >
                    #{ward.rank}
                  </div>

                  {/* Ward & Voters Details */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-ink whitespace-nowrap">
                        {ward.name}
                      </span>
                      {ward.performanceTier === "top" && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-gold/15 text-ink rounded">
                          Top Tier
                        </span>
                      )}
                      {ward.performanceTier === "bottom" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-line text-muted rounded">
                          Frontier
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted whitespace-nowrap">
                      <span className="font-mono font-bold text-ink">{ward.voters.toLocaleString()} voters</span>
                      <span className="text-line">|</span>
                      <span>{ward.constituencyName}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Duplicate Set for infinite seamless loop */}
          <div className="flex gap-2.5 shrink-0" aria-hidden="true">
            {filteredWards.map((ward) => (
              <div
                key={`ward-b-${ward.name}`}
                onClick={() => setSelectedWard(ward)}
                className={`flex items-center gap-2.5 bg-card border rounded-xl px-3 py-2 transition-all cursor-pointer ${
                  ward.performanceTier === "top"
                    ? "border-gold/50 hover:border-gold shadow-xs"
                    : ward.performanceTier === "bottom"
                    ? "border-line/70 hover:border-line"
                    : "border-line/60 hover:border-accent/40 shadow-xs"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-black shrink-0 ${
                    ward.performanceTier === "top"
                      ? "bg-gold text-ink"
                      : ward.performanceTier === "bottom"
                      ? "bg-line text-muted"
                      : "bg-paper text-ink border border-line"
                  }`}
                >
                  #{ward.rank}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-ink whitespace-nowrap">
                      {ward.name}
                    </span>
                    {ward.performanceTier === "top" && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-gold/15 text-ink rounded">
                        Top Tier
                      </span>
                    )}
                    {ward.performanceTier === "bottom" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-line text-muted rounded">
                        Frontier
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted whitespace-nowrap">
                    <span className="font-mono font-bold text-ink">{ward.voters.toLocaleString()} voters</span>
                    <span className="text-line">|</span>
                    <span>{ward.constituencyName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Selected Ward Deep-Dive Inspector */}
      {selectedWard && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-line/60 bg-card rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-mono font-black text-sm">
              #{selectedWard.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h6 className="font-serif text-sm font-black text-ink">{selectedWard.name} Ward</h6>
                <span className="t-micro uppercase tracking-wider font-bold text-accent px-2 py-0.5 rounded bg-accent/10">
                  {selectedWard.constituencyName}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                {selectedWard.voters.toLocaleString()} registered voters ({selectedWard.sharePercent.toFixed(2)}% of county register).
                {selectedWard.deltaFromMean >= 0
                  ? ` +${selectedWard.deltaFromMean.toLocaleString()} above county ward average.`
                  : ` ${selectedWard.deltaFromMean.toLocaleString()} relative to county ward average.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedWard(null)}
            className="self-end sm:self-auto px-2.5 py-1 text-xs font-bold text-muted hover:text-ink bg-paper border border-line rounded-lg cursor-pointer"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </div>
  );
}
