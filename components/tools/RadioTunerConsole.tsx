"use client";

import React, { useState } from "react";

interface Station {
  id: string;
  name: string;
  frequency: string;
  mhz: number;
  ownership: string;
  lean: string;
  reach: string;
  adRate: string;
  posture: string;
  simulatedTranscript: {
    show: string;
    speaker: string;
    quote: string;
    strategy: string;
  };
}

const STATIONS: Station[] = [
  {
    id: "musyi",
    name: "Musyi FM",
    frequency: "102.2 MHz",
    mhz: 102.2,
    ownership: "Royal Media Services (RMS)",
    lean: "Independent Commercial • Market Leader",
    reach: "Broad Ukambani Regional Coverage (High Tier)",
    adRate: "Prime Commercial Drive Rate",
    posture: "Priority A1: Scheduled weekly morning policy debates. Highest credibility anchor in Ukambani.",
    simulatedTranscript: {
      show: "Kavata Ka Musyi (06:30 - 10:00 AM)",
      speaker: "Presenter Munyao / Caller Mutua from Kyuso",
      quote: "Caller asks whether the next Governor can actually fix the water pipeline from Kiambere dam without squandering funds like the current administration.",
      strategy: "Deploy Dr. Mulu's Parliamentary Public Accounts Committee record: cite exact KSh figures on audit queries and give 100-day solar pumping milestone.",
    },
  },
  {
    id: "mbaitu",
    name: "Mbaitu FM",
    frequency: "100.4 MHz",
    mhz: 100.4,
    ownership: "Associated with Former Gov. Charity Ngilu",
    lean: "Incumbent-aligned • Hostile framing expected",
    reach: "Regional Ukambani Coverage (High Tier)",
    adRate: "Competitor-Aligned Rate",
    posture: "Priority B (Monitoring & Counter-Punch): Continuous digital recording. Level 2 rebuttal within 30 mins for false claims.",
    simulatedTranscript: {
      show: "Mbaitu Enene Breakfast Show",
      speaker: "Host questioning Makali's CDF track record",
      quote: "Host asserts that Makali only focused on Kitui Central schools while rural Mwingi was neglected.",
      strategy: "Ward champion immediate call-in armed with CDF Auditor-General clean audit reports and comparative per-capita spending tables.",
    },
  },
  {
    id: "county",
    name: "County FM",
    frequency: "90.3 MHz",
    mhz: 90.3,
    ownership: "Local Kitui Independent Commercial",
    lean: "Grassroots Hyper-Local • High Mwingi North Trust",
    reach: "Kitui & Mwingi Local Coverage (Mid Tier)",
    adRate: "Community Commercial Rate",
    posture: "Priority A2: Dominates rural marketplace chatter. Excellent ROI for vernacular campaign spots and market-day caravans.",
    simulatedTranscript: {
      show: "Mwingi Dawn Drive",
      speaker: "Market Trader Kalekye from Migwani",
      quote: "Traders complaining of multiple county cess taxes on green grams and livestock at Nguni market.",
      strategy: "Air Dr. Mulu's 5-point single-business-permit pledge and complete waiver of cess for smallholder subsistence farmers.",
    },
  },
  {
    id: "athiani",
    name: "Athiani FM",
    frequency: "97.7 MHz",
    mhz: 97.7,
    ownership: "Wiper Party Ecosystem Alignment",
    lean: "Party Baseline & Loyalist Core",
    reach: "Countywide Party-Sensitive Coverage (Mid Tier)",
    adRate: "Station Rate Card",
    posture: "Loyalist Consolidation: Secure nomination consensus and galvanize traditional Wiper party faithful.",
    simulatedTranscript: {
      show: "Kutema Kyeni (Mid-morning)",
      speaker: "Party Delegate from Kitui Rural",
      quote: "Discussion on delegate loyalty and selecting a technocrat who won't embarrass the party leadership.",
      strategy: "Emphasize Dr. Mulu's continuous loyalty to party ideals, spotless integrity, and parliamentary economic leadership.",
    },
  },
  {
    id: "wikwatyo",
    name: "Wikwatyo FM",
    frequency: "105.3 MHz",
    mhz: 105.3,
    ownership: "Community & Faith-Based (SDA / Church Council)",
    lean: "Value-Driven • Ethical Leadership",
    reach: "Faith-Based & Community Coverage",
    adRate: "Sponsorship Rate Card",
    posture: "Moral Authority: High trust among women's church fellowships and elders across Kitui South and East.",
    simulatedTranscript: {
      show: "Syiteto sya Thayyu (Peace & Development)",
      speaker: "Church Elder from Mutomo",
      quote: "Praise for leaders who manage public money without greed and promote Christian family principles.",
      strategy: "Highlight Dr. Mulu's personal reputation as a God-fearing economist, clean family man, and sober administrator.",
    },
  },
];

export function RadioTunerConsole() {
  const [activeStationId, setActiveStationId] = useState<string>("musyi");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const activeStation = STATIONS.find((s) => s.id === activeStationId) || STATIONS[0];

  // Analog dial position calculation (88 MHz = 0%, 108 MHz = 100%)
  const needlePercent = Math.max(0, Math.min(100, ((activeStation.mhz - 88) / (108 - 88)) * 100));

  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="max-w-xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-2">
          <span>§8.7 & §8.7.1 Vernacular Acoustic Console</span>
          <span>•</span>
          <span>Kitui Radio Matrix</span>
        </div>
        <h3 className="t-h3 font-serif font-bold text-ink">
          Kamba Vernacular Radio Tuner & Aircover Console
        </h3>
        <p className="t-body text-sm text-muted mt-1.5">
          In Kitui, radio reaches 74% of offline households. Tune the dial across the county&apos;s five
          primary Kamba broadcasting stations to inspect ownership alignments, ad rates, and the
          campaign&apos;s real-time rebuttal playbook.
        </p>
      </div>

      {/* Physical Radio Transistor Hardware Box */}
      <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-b from-[#232830] to-[#14171d] border-4 border-[#333b47] p-4 sm:p-6 shadow-2xl text-slate-100">
        {/* Top Control Bar: Brand & Antenna */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[10px] font-bold tracking-wider">
              KITUI TRANSISTOR FM-88/108
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">HIGH SENSITIVITY DSP</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isPlaying
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-slate-950 animate-ping" : "bg-slate-400"}`} />
              <span>{isPlaying ? "LIVE AUDIO ON" : "MUTED"}</span>
            </button>
          </div>
        </div>

        {/* Analog Backlit Frequency Dial */}
        <div className="relative h-20 rounded-xl bg-gradient-to-b from-[#0a0d12] to-[#12161f] border-2 border-[#3d485a] p-3 overflow-hidden shadow-inner flex flex-col justify-between select-none">
          {/* Subtle amber backlight glow */}
          <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />

          {/* Scale Numbers (88 to 108 MHz) */}
          <div className="flex justify-between text-[10px] font-mono text-amber-400/80 font-bold px-1 z-10">
            <span>88</span>
            <span>92</span>
            <span>96</span>
            <span>100</span>
            <span>104</span>
            <span>108 MHz</span>
          </div>

          {/* Tick marks */}
          <div className="relative h-4 flex justify-between items-center z-10 px-2 opacity-60">
            {Array.from({ length: 41 }).map((_, i) => (
              <span
                key={i}
                className={`w-[1px] ${i % 5 === 0 ? "h-3.5 bg-amber-300" : "h-2 bg-amber-500/40"}`}
              />
            ))}
          </div>

          {/* Red Tuning Needle with smooth position transition */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-rose-500 z-20 shadow-[0_0_8px_rgba(244,63,94,0.9)] transition-all duration-300 ease-out"
            style={{ left: `${needlePercent}%` }}
          >
            <div className="w-2.5 h-2.5 -ml-[3px] bg-rose-500 rounded-full shadow-md" />
          </div>

          {/* Current Tuning LCD Readout */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 z-10 border-t border-white/5">
            <span className="text-amber-300 font-bold tracking-wide">
              {activeStation.name} • {activeStation.frequency}
            </span>
            <span className="text-[10px] text-emerald-400">STEREO LOCK [SNR: 94dB]</span>
          </div>
        </div>

        {/* Station Preset Pushbuttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
          {STATIONS.map((station) => {
            const isSelected = station.id === activeStationId;
            return (
              <button
                key={station.id}
                type="button"
                onClick={() => {
                  setActiveStationId(station.id);
                  setIsPlaying(true);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md scale-[1.02]"
                    : "bg-[#1e232c] text-slate-300 border-white/5 hover:bg-[#282f3c] hover:text-white"
                }`}
              >
                <div className="text-xs font-bold truncate">{station.name}</div>
                <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? "text-slate-900" : "text-amber-400"}`}>
                  {station.frequency}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Audio Equalizer & Simulated Broadcast */}
        <div className="mt-5 p-4 rounded-xl bg-[#171b22] border border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                {activeStation.simulatedTranscript.show}
              </span>
              <span className="text-[10px] text-slate-400">Live Aircheck Monitor</span>
            </div>

            {/* Audio Waveform visualizer */}
            <div className="flex items-center gap-0.5 h-4">
              {[6, 14, 10, 18, 12, 8, 16, 11, 19, 13, 7, 15, 9, 17].map((h, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all ${
                    isPlaying ? "bg-amber-400 animate-pulse" : "bg-slate-600"
                  }`}
                  style={{ height: isPlaying ? `${h}px` : "3px" }}
                />
              ))}
            </div>
          </div>

          {/* Transcript Content */}
          <div className="mt-3 text-xs space-y-2">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
              <span className="font-semibold text-slate-300 block text-[11px] mb-1">
                {activeStation.simulatedTranscript.speaker}:
              </span>
              <p className="text-slate-300 text-[11.5px] italic leading-relaxed">
                &ldquo;{activeStation.simulatedTranscript.quote}&rdquo;
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">
                <span>WAR ROOM REBUTTAL & PLACEMENT PROTOCOL</span>
              </div>
              <p className="text-emerald-200 text-[11px] leading-relaxed">
                {activeStation.simulatedTranscript.strategy}
              </p>
            </div>
          </div>
        </div>

        {/* Station Intelligence & Rate Card Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/10 text-xs">
          <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Ownership & Align:</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">{activeStation.ownership}</span>
            <span className="text-[10.5px] text-amber-300/80 mt-1 block">{activeStation.lean}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Reach & Ad Rate:</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">{activeStation.reach}</span>
            <span className="text-[10.5px] font-mono text-emerald-400 mt-1 block">{activeStation.adRate}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Strategic Posture:</span>
            <span className="text-[11px] text-slate-300 leading-snug mt-0.5 block">{activeStation.posture}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
