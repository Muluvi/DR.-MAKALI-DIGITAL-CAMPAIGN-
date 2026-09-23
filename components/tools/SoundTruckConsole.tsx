"use client";

import React, { useState } from "react";

interface MarketLocation {
  id: string;
  name: string;
  day: string;
  estimatedCrowd: number;
  economy: string;
  focusMessage: string;
}

const MARKETS: MarketLocation[] = [
  {
    id: "mwingi",
    name: "Mwingi Central Open Market",
    day: "Wednesday Market Day",
    estimatedCrowd: 7800,
    economy: "Livestock auction, dry grains & cross-county regional trading hub",
    focusMessage: "Abolishing unfair municipal cess on smallholder livestock and green gram traders.",
  },
  {
    id: "kitui-town",
    name: "Kitui Town Commercial Market",
    day: "Thursday Market Day",
    estimatedCrowd: 12500,
    economy: "County capital economic hub, bodaboda operators, retail shops & wholesale distributors",
    focusMessage: "Unified business permit, town sanitation upgrades, and SME youth credit guarantee fund.",
  },
  {
    id: "mutomo",
    name: "Mutomo Livestock Fair",
    day: "Saturday Auction Day",
    estimatedCrowd: 6200,
    economy: "Southern cattle traders, pastoralists, timber and honey sellers",
    focusMessage: "Borehole solarization, hay storage reserves, and livestock disease vaccination corridors.",
  },
  {
    id: "kyuso",
    name: "Kyuso Grain Centre",
    day: "Monday Market Day",
    estimatedCrowd: 4800,
    economy: "Mwingi North green gram farmers, women's basket-weaving collectives",
    focusMessage: "Direct value addition factory, post-harvest grain silos, and guaranteed minimum farm-gate prices.",
  },
];

interface AudioTrack {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  desc: string;
}

const TRACKS: AudioTrack[] = [
  {
    id: "policy",
    title: "100-Day Water & Budget Manifesto",
    speaker: "Dr. Makali Mulu (Vernacular Kikamba)",
    duration: "0:45",
    desc: "Direct address detailing reallocation of non-essential county travel budget into 40 solar borehole projects.",
  },
  {
    id: "jingle",
    title: "Uchumi na Kazi Campaign Jingle",
    speaker: "Kitui Youth Cultural Troupe",
    duration: "1:15",
    desc: "Upbeat rhythmic campaign anthem celebrating Dr. Mulu's clean parliamentary record and job creation agenda.",
  },
  {
    id: "bodaboda",
    title: "Bodaboda Stage Call & Response",
    speaker: "Kitui Central Bodaboda Chairperson",
    duration: "0:30",
    desc: "Grassroots safety gear announcement and invitation to town hall discussion at the stadium.",
  },
];

export function SoundTruckConsole() {
  const [selectedMarketId, setSelectedMarketId] = useState<string>("kitui-town");
  const [selectedTrackId, setSelectedTrackId] = useState<string>("policy");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [powerWatts, setPowerWatts] = useState<number>(2400); // 1000W to 4000W

  const currentMarket = MARKETS.find((m) => m.id === selectedMarketId) || MARKETS[1];
  const currentTrack = TRACKS.find((t) => t.id === selectedTrackId) || TRACKS[0];

  // Acoustic radius calculation based on wattage
  const clearRadiusMeters = Math.round(80 + (powerWatts / 4000) * 120); // 80m to 200m
  const ambientRadiusMeters = Math.round(clearRadiusMeters * 2.2); // 176m to 440m
  const crowdReachPct = Math.min(98, Math.round(55 + (powerWatts / 4000) * 40));

  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="max-w-xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
          <span>§8.8 & §8.8.2 Ground Intel & Roadshow Activation</span>
          <span>•</span>
          <span>Public Address Acoustics</span>
        </div>
        <h3 className="t-h3 font-serif font-bold text-ink">
          Market Day Sound Truck & PA Rig Console
        </h3>
        <p className="t-body text-sm text-muted mt-1.5">
          Simulating the 4,000W mobile roadshow rig used on market days. Adjust acoustic coverage
          parameters across major Kitui trading centres, monitor generator power reserves, and audition
          vernacular loudspeaker audio.
        </p>
      </div>

      {/* 19-inch Audio Rack Casing */}
      <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-b from-[#212631] to-[#12161f] border-4 border-[#323947] p-4 sm:p-6 shadow-2xl text-slate-100 font-sans">
        {/* Rack Header: Model & Dual Power Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold tracking-wider">
              ROADSHOW RIG #KT-TRUCK-01
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              19&quot; RACK MOUNT • 4-CHANNEL CLASS D
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-2 py-0.5 rounded bg-black/40 border border-white/10 flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>HONDA EU5000is: 240V (84% FUEL)</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-amber-300 text-[11px]">
              24V SOLAR: 100%
            </div>
          </div>
        </div>

        {/* Market Location Selector */}
        <div className="mt-4">
          <div className="text-[11px] font-mono uppercase text-slate-400 mb-2">
            Target Trading Centre & Market Day:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MARKETS.map((market) => {
              const active = market.id === selectedMarketId;
              return (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => setSelectedMarketId(market.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    active
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-md scale-[1.02]"
                      : "bg-[#181d26] text-slate-300 border-white/5 hover:bg-[#232936]"
                  }`}
                >
                  <div className="text-xs font-bold truncate">{market.name}</div>
                  <div className={`text-[10px] mt-0.5 ${active ? "text-emerald-100" : "text-slate-400"}`}>
                    {market.day}
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${active ? "text-white" : "text-emerald-400"}`}>
                    ~{market.estimatedCrowd.toLocaleString()} voters
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Acoustic Coverage Simulator */}
        <div className="mt-5 p-4 rounded-xl bg-[#151922] border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <div className="text-xs font-bold font-mono text-emerald-400">
                ACOUSTIC DECIBEL & COVERAGE RADIUS SIMULATOR
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Calculates voice intelligibility in ambient open-air market noise (68 dB ambient threshold)
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-sm font-bold text-white">{powerWatts} Watts RMS</span>
              <span className="text-[10px] text-slate-400 block">4x Horn Array (4.5m Mast)</span>
            </div>
          </div>

          {/* Wattage Slider */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>PA Power Output Level:</span>
              <span className="text-emerald-400 font-bold">{powerWatts}W RMS</span>
            </div>
            <input
              type="range"
              min="1000"
              max="4000"
              step="200"
              value={powerWatts}
              onChange={(e) => setPowerWatts(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1,000W (Small Stage)</span>
              <span>2,400W (Standard Caravan)</span>
              <span>4,000W (Full Stadium Blast)</span>
            </div>
          </div>

          {/* Acoustic Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mt-4 text-center font-mono">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-400">SPEECH CLARITY RADIUS</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{clearRadiusMeters} meters</div>
              <div className="text-[9.5px] text-slate-400 mt-0.5">&gt; 85 dB (100% Intelligible)</div>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-400">AUDIBLE JINGLE RADIUS</div>
              <div className="text-base font-bold text-amber-300 mt-0.5">{ambientRadiusMeters} meters</div>
              <div className="text-[9.5px] text-slate-400 mt-0.5">&gt; 72 dB (Recognizable Anthem)</div>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-400">MARKET CROWD REACH</div>
              <div className="text-base font-bold text-white mt-0.5">{crowdReachPct}%</div>
              <div className="text-[9.5px] text-emerald-400 mt-0.5">
                ~{Math.round((currentMarket.estimatedCrowd * crowdReachPct) / 100).toLocaleString()} people
              </div>
            </div>
          </div>
        </div>

        {/* Audio Track Selector & Sound Player */}
        <div className="mt-5 p-4 rounded-xl bg-[#151922] border border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="text-xs font-bold font-mono text-amber-400">
              DIGITAL SOUND CART & LOUDSPEAKER QUEUE
            </div>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                isPlaying ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-300"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-slate-950 animate-ping" : "bg-slate-400"}`} />
              <span>{isPlaying ? "PA BROADCASTING" : "PA PAUSED"}</span>
            </button>
          </div>

          {/* Track Selection Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            {TRACKS.map((track) => {
              const active = track.id === selectedTrackId;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    setIsPlaying(true);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    active
                      ? "bg-slate-800 border-emerald-500 shadow-xs text-white"
                      : "bg-[#181d26] border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{track.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{track.duration}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 mt-1 truncate">{track.speaker}</div>
                </button>
              );
            })}
          </div>

          {/* Audio Visualizer & Playing Details */}
          <div className="mt-4 p-3 rounded-lg bg-black/50 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs space-y-0.5 text-center sm:text-left">
              <div className="text-white font-semibold flex items-center gap-2">
                <span>{currentTrack.title}</span>
                <span className="text-[10px] font-mono text-emerald-400">({currentTrack.duration})</span>
              </div>
              <div className="text-[11px] text-slate-400">{currentTrack.desc}</div>
            </div>

            {/* VU Meter Bars */}
            <div className="flex items-center gap-1 h-6">
              {[8, 16, 12, 22, 14, 20, 10, 24, 18, 12, 16, 8].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    isPlaying
                      ? i > 9
                        ? "bg-rose-500 animate-pulse"
                        : i > 6
                        ? "bg-amber-400 animate-pulse"
                        : "bg-emerald-400 animate-pulse"
                      : "bg-slate-700"
                  }`}
                  style={{ height: isPlaying ? `${h}px` : "4px" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Ground Activation Strategy Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Coordinated with 50 Bodaboda Marshals & Printed Kikamba Leaflets</span>
          </div>
          <span>Kitui Ground SLA: &lt; 4 Hours Rebuttal</span>
        </div>
      </div>
    </div>
  );
}
