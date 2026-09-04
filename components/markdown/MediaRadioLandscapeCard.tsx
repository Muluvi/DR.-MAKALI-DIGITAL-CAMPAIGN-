"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { disclosure } from "../../lib/motion";
import { Radio, Volume2, VolumeX, ShieldAlert, CheckCircle2, AlertTriangle, Play, Pause, ArrowRight, Info } from "lucide-react";

interface RadioStation {
  name: string;
  frequency: string;
  ownership: string;
  politicalAllegiance: "Rival (Ngilu)" | "Party Gatekeeper (Kalonzo)" | "Commercially Independent" | "Church / Faith-Based" | "Public / State";
  campaignPosture: string;
  isPriority: boolean;
  reachEstimate: string;
  recommendedSlot: string;
}

const RADIO_STATIONS: RadioStation[] = [
  {
    name: "Musyi FM",
    frequency: "102.2 FM",
    ownership: "Royal Media Services (SK Macharia)",
    politicalAllegiance: "Commercially Independent",
    campaignPosture: "Top Priority — Main commercial vehicle across Kitui & Eastern Kenya. Host weekly 06:30–08:00 morning breakfast interviews.",
    isPriority: true,
    reachEstimate: "Dominant countywide listenership (~42%)",
    recommendedSlot: "Morning Drive & Evening Baraza"
  },
  {
    name: "County FM",
    frequency: "90.3 Kitui / 91.8 Mwingi",
    ownership: "Kitui Independent Media Group",
    politicalAllegiance: "Commercially Independent",
    campaignPosture: "Top Priority — Hyperlocal grassroots penetration, especially in Mwingi region and rural markets.",
    isPriority: true,
    reachEstimate: "High grassroots credibility (~24%)",
    recommendedSlot: "Mid-day Farming & Livestock Show"
  },
  {
    name: "Wikwatyo FM",
    frequency: "105.3 FM",
    ownership: "Seventh-Day Adventist Church (Kitui)",
    politicalAllegiance: "Church / Faith-Based",
    campaignPosture: "Priority — Moral authority, integrity, and faith-based community service programming.",
    isPriority: true,
    reachEstimate: "High faith-based trust (~15%)",
    recommendedSlot: "Sunday Morning & Evening Sermons"
  },
  {
    name: "Athiani FM",
    frequency: "97.7 FM",
    ownership: "Associated with Kalonzo Musyoka (Wiper Leader)",
    politicalAllegiance: "Party Gatekeeper (Kalonzo)",
    campaignPosture: "Party-Aligned — Monitor closely during nomination window; coverage reflects party leadership sentiment rather than pure merit.",
    isPriority: false,
    reachEstimate: "Influential Wiper loyalist base (~20%)",
    recommendedSlot: "Party Delegate Policy Features"
  },
  {
    name: "Mbaitu FM / Syokimau FM",
    frequency: "100.4 FM",
    ownership: "Associated with Charity Ngilu (Declared Rival)",
    politicalAllegiance: "Rival (Ngilu)",
    campaignPosture: "Hostile / Monitoring Only — Do not buy prime inventory; establish rapid response war room protocol to counter on-air attacks within 30 mins.",
    isPriority: false,
    reachEstimate: "Strong in Central & Southern Kitui",
    recommendedSlot: "War Room Audio Monitoring Only"
  },
  {
    name: "KBC Mwatu FM",
    frequency: "93.1 FM",
    ownership: "Kenya Broadcasting Corporation (State)",
    politicalAllegiance: "Public / State",
    campaignPosture: "Institutional — Equal airtime access for national policy announcements and election coverage.",
    isPriority: false,
    reachEstimate: "Steady institutional baseline",
    recommendedSlot: "Civic Education & Debates"
  }
];

export function MediaRadioLandscapeCard() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "priorityOnly">("all");
  const [playingSnippet, setPlayingSnippet] = useState<string | null>(null);

  const displayedStations = selectedFilter === "all"
    ? RADIO_STATIONS
    : RADIO_STATIONS.filter(s => s.isPriority);

  const toggleSnippet = (stationName: string) => {
    if (playingSnippet === stationName) {
      setPlayingSnippet(null);
    } else {
      setPlayingSnippet(stationName);
    }
  };

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Radio size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Radio landscape · 3.4
              </span>
              <span className="t-label font-mono font-bold text-muted">
                Vernacular Radio Table
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Kamba-Language Broadcast Ownership & Risk Map
            </h4>
          </div>
        </div>

        {/* Filter Switch */}
        <div className="flex items-center p-1 bg-paper border border-line rounded-xl">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "all" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            All 6 Networks
          </button>
          <button
            onClick={() => setSelectedFilter("priorityOnly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "priorityOnly" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            Priority Placement (3)
          </button>
        </div>
      </div>

      {/* Strategic Takeaway Bar */}
      <div className="p-3.5 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
        <ShieldAlert size={16} className="shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Ownership Risk Reality:</strong> Two major Kikamba radio networks are owned or affiliated with declared political rivals (Charity Ngilu) and party leadership. Prime broadcast strategy concentrates on <strong>Musyi FM, County FM, and Wikwatyo FM</strong>.
        </div>
      </div>

      {/* Station List */}
      <div className="p-4 sm:p-6 space-y-3">
        {displayedStations.map((station) => (
          <div
            key={station.name}
            className={`p-4 rounded-xl border transition-all ${
              station.isPriority
                ? "bg-paper/80 border-accent/30 hover:border-accent"
                : station.politicalAllegiance.includes("Rival")
                ? "bg-rose-500/5 border-rose-500/20"
                : "bg-paper/40 border-line"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                  station.isPriority 
                    ? "bg-accent text-white" 
                    : station.politicalAllegiance.includes("Rival")
                    ? "bg-rose-500/20 text-rose-600"
                    : "bg-paper border border-line text-muted"
                }`}>
                  <Radio size={18} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-ink">{station.name}</h5>
                    <span className="t-small font-mono font-bold text-accent bg-card px-2 py-0.5 rounded border border-line">
                      {station.frequency}
                    </span>
                    {station.isPriority && (
                      <span className="t-micro font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Priority Placement
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted font-medium mt-0.5">
                    Ownership: <span className="text-ink font-semibold">{station.ownership}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-start sm:self-auto">
                <span className={`t-label font-bold px-2.5 py-1 rounded-lg border ${
                  station.politicalAllegiance.includes("Independent")
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                    : station.politicalAllegiance.includes("Rival")
                    ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                    : "bg-paper text-ink border-line"
                }`}>
                  {station.politicalAllegiance}
                </span>
              </div>
            </div>

            <p className="text-xs text-ink font-medium mt-2.5 leading-relaxed">
              {station.campaignPosture}
            </p>

            <div className="mt-2.5 pt-2 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 t-small">
              <span className="text-muted">
                <strong>Reach:</strong> {station.reachEstimate} &bull; <strong>Recommended Slot:</strong> {station.recommendedSlot}
              </span>

              <button
                onClick={() => toggleSnippet(station.name)}
                className="text-xs font-bold text-accent hover:text-accent/80 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                {playingSnippet === station.name ? (
                  <>
                    <Pause size={12} />
                    <span>Stop Preview</span>
                  </>
                ) : (
                  <>
                    <Play size={12} />
                    <span>Preview Vernacular Strategy Brief</span>
                  </>
                )}
              </button>
            </div>

            {playingSnippet === station.name && (
              <motion.div
                initial={{ opacity: 0, gridTemplateRows: "0fr" }}
                animate={{ opacity: 1, gridTemplateRows: "1fr" }}
                exit={{ opacity: 0, gridTemplateRows: "0fr" }}
                transition={disclosure}
                className="grid mt-2"
              >
              <div className="overflow-hidden min-h-0">
              <div className="p-3 bg-card rounded-lg border border-accent/20 text-xs space-y-1">
                <div className="font-bold text-accent flex items-center gap-1.5">
                  <Volume2 size={13} />
                  <span>Sample On-Air Talking Point ({station.name}):</span>
                </div>
                <p className="italic text-ink">
                  &ldquo;Mbee! Mbee! Kĩla kĩndũ kĩ na thayũ, ĩtina nĩ kũmenya. Dr. Makali Mulu is the tested economist who will allocate Kitui&apos;s KSh 13.79 billion transparently to each of our 40 wards.&rdquo;
                </p>
              </div>
              </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Rule */}
      <div className="p-3 bg-paper/60 border-t border-line t-small text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <Info size={12} className="text-accent" />
          <span>Vernacular Airwave Primacy: 86% of Kitui relies on radio as their primary daily source of political truth.</span>
        </span>
      </div>
    </div>
  );
}
