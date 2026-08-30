"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Users, 
  Coins, 
  Radio, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Percent,
  Layers
} from "lucide-react";

interface GeographicZone {
  id: string;
  name: string;
  subCounties: string;
  population: string;
  registeredVoters: string;
  popShare: string;
  density: string;
  households: string;
  nominationWeight: number; // %
  generalWeight: number; // %
  connectivityProfile: string;
  primaryStrategicImperative: string;
  keyWards: string[];
}

const GEOGRAPHIC_ZONES: GeographicZone[] = [
  {
    id: "anchor",
    name: "1. The Urban & Central Anchor",
    subCounties: "Kitui Central, Kitui West, Katulani",
    population: "223,970",
    registeredVoters: "134,544 (2022 baseline)",
    popShare: "19.7%",
    density: "~190 persons / km²",
    households: "58,724",
    nominationWeight: 20,
    generalWeight: 25,
    connectivityProfile: "High / Mixed 4G & Fiber (Urban core)",
    primaryStrategicImperative: "Consolidate Dr. Mulu's home base early and intensely. Achieve an 80%+ voter turnout margin to cushion northern and southern battlegrounds.",
    keyWards: ["Kitui Township (28,412)", "Kyangwithya West (22,105)", "Kyangwithya East (19,400)", "Mulango (17,200)", "Matinyani (16,980)"]
  },
  {
    id: "mwingi",
    name: "2. The Northern Block (Mwingi Region)",
    subCounties: "Mwingi Central, Kyuso, Mumoni, Tseikuru",
    population: "255,795",
    registeredVoters: "148,820 (2022 baseline)",
    popShare: "22.5%",
    density: "~53 persons / km²",
    households: "57,821",
    nominationWeight: 35,
    generalWeight: 25,
    connectivityProfile: "Low-to-Medium (USSD, Radio & SMS dominant)",
    primaryStrategicImperative: "Close the 15.3-point recognition deficit against Irene Kasalu. Guarantee 100% equitable ward funding to assure northern voters of fair representation.",
    keyWards: ["Mwingi Central (21,940)", "Waita (18,920)", "Kyuso (17,640)", "Nguni (15,400)", "Tseikuru (14,200)"]
  },
  {
    id: "arid-belt",
    name: "3. The Arid & Resource Belt (South & East)",
    subCounties: "Mutomo, Ikutha, Mwingi East, Mutitu, Migwani",
    population: "416,001",
    registeredVoters: "172,430 (2022 baseline)",
    popShare: "36.6%",
    density: "~19 persons / km²",
    households: "89,070",
    nominationWeight: 30,
    generalWeight: 35,
    connectivityProfile: "Ultra-Low (9 persons/km² in Ikutha - SMS/USSD essential)",
    primaryStrategicImperative: "Deliver credible water pipeline solutions, livestock insurance models, and mineral revenue governance (coal & limestone protection).",
    keyWards: ["Mutomo / Kibwea (20,850)", "Athi (19,800)", "Ikutha (18,150)", "Ikanga / Kyatune (17,400)", "Mutha (13,200)"]
  }
];

export function GeographicZoneMatrix() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>("mwingi");
  const currentZone = GEOGRAPHIC_ZONES.find(z => z.id === selectedZoneId) || GEOGRAPHIC_ZONES[0];

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Compass size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Section 7.0 Regional Dynamics
              </span>
              <span className="text-[10px] font-mono font-bold text-muted">
                3 Geographic Battlegrounds
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Kitui Geographic Belt & Zone Weighting Model
            </h4>
          </div>
        </div>
      </div>

      {/* Zone Switcher Grid */}
      <div className="p-3 bg-paper/70 border-b border-line grid grid-cols-1 sm:grid-cols-3 gap-2">
        {GEOGRAPHIC_ZONES.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedZoneId(zone.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-card border-accent shadow-sm ring-2 ring-accent/15"
                  : "bg-paper/40 border-line hover:border-accent/40 text-muted hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? "text-accent" : "text-muted"}`}>
                  {zone.popShare} POPULATION
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                  Phase -1: {zone.nominationWeight}%
                </span>
              </div>
              <div className="text-xs font-bold text-ink mt-1 truncate">
                {zone.name}
              </div>
              <div className="text-[11px] font-mono text-muted mt-0.5 truncate">
                {zone.subCounties}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Zone Deep Dive */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Metric Quick-Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-paper rounded-xl border border-line">
            <div className="text-[10px] uppercase font-bold text-muted">Population</div>
            <div className="text-sm font-bold text-ink mt-0.5 font-mono">{currentZone.population}</div>
            <div className="text-[10px] text-accent font-semibold">{currentZone.popShare} of County</div>
          </div>

          <div className="p-3 bg-paper rounded-xl border border-line">
            <div className="text-[10px] uppercase font-bold text-muted">Voter Baseline</div>
            <div className="text-sm font-bold text-ink mt-0.5 font-mono">{currentZone.registeredVoters.split(" ")[0]}</div>
            <div className="text-[10px] text-muted">Registered Base</div>
          </div>

          <div className="p-3 bg-paper rounded-xl border border-line">
            <div className="text-[10px] uppercase font-bold text-muted">Density</div>
            <div className="text-sm font-bold text-ink mt-0.5 font-mono">{currentZone.density}</div>
            <div className="text-[10px] text-muted">{currentZone.households} h/holds</div>
          </div>

          <div className="p-3 bg-accent/5 rounded-xl border border-accent/20">
            <div className="text-[10px] uppercase font-bold text-accent">Nomination Budget</div>
            <div className="text-sm font-black text-accent mt-0.5 font-mono">{currentZone.nominationWeight}% Allocation</div>
            <div className="text-[10px] text-muted font-medium">Phase -1 Focus</div>
          </div>
        </div>

        {/* Strategic Imperative Card */}
        <div className="p-4 rounded-xl bg-paper border border-line space-y-1.5">
          <div className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1.5">
            <TrendingUp size={13} />
            Zone Strategic Imperative
          </div>
          <p className="text-xs text-ink leading-relaxed font-medium">
            {currentZone.primaryStrategicImperative}
          </p>
        </div>

        {/* Connectivity & Key High-Density Wards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-paper/60 border border-line space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <Radio size={12} className="text-accent" />
              Connectivity & Delivery Channels
            </div>
            <p className="text-xs text-ink font-semibold">
              {currentZone.connectivityProfile}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-paper/60 border border-line space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <MapPin size={12} className="text-accent" />
              High-Density Wards in Zone
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentZone.keyWards.map((w, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-card border border-line text-ink">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Rule */}
      <div className="p-3 bg-paper/60 border-t border-line text-[11px] text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <Percent size={12} className="text-accent" />
          <span>Nomination Over-Index Doctrine: Phase -1 deliberately allocates 65% of campaign budget to Mwingi and the Arid Belt to extinguish the recognition deficit.</span>
        </span>
      </div>
    </div>
  );
}
