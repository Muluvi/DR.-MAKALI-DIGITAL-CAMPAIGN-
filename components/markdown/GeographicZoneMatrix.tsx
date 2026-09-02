"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Radio, Compass, TrendingUp, Percent, AlertTriangle } from "lucide-react";

import { CONSTITUENCIES, COUNTY_TOTAL_WARDS } from "../../data/ward-register";
import { TierBadge } from "./TierBadge";

/**
 * Section 7 zone model, bound to the verified IEBC register.
 *
 * Every registered-voter figure below is DERIVED from data/ward-register.json at module load,
 * never typed in. That register is Tier 1 and is checked for internal consistency both by
 * scripts/verify-ward-register.mjs (prebuild) and by data/ward-register.ts at import time, so
 * a figure shown here cannot drift from the source without failing the build.
 *
 * Population, density and household figures are quoted from strategy.md §7.1–7.3, which
 * sources them to the 2019 KNBS census. Phase weightings are quoted from §7.4.
 *
 * One honest wrinkle the UI has to carry rather than smooth over: §7 groups the county by
 * SUB-COUNTY (Kitui Central, Katulani, Migwani …) while the IEBC register is published by
 * CONSTITUENCY. The two do not nest. So the zones map onto whole constituencies here, and
 * Kitui Rural — which §7's three zones do not name at all — is surfaced as unassigned rather
 * than quietly folded into a neighbour to make the totals look tidy.
 */

const byId = (id: string) => CONSTITUENCIES.find((c) => c.id === id);

function zoneRegister(ids: string[]) {
  const parts = ids.map(byId).filter((c): c is NonNullable<typeof c> => Boolean(c));
  return {
    voters: parts.reduce((sum, c) => sum + c.voters, 0),
    constituencies: parts,
    wards: parts
      .flatMap((c) => c.wards.map((w) => ({ ...w, constituency: c.name })))
      .sort((a, b) => b.voters - a.voters),
  };
}

interface GeographicZone {
  id: string;
  name: string;
  /** Sub-counties, exactly as §7 lists them. */
  subCounties: string;
  /** Constituencies the register figures are summed over. */
  constituencyIds: string[];
  population: string;
  popShare: string;
  density: string;
  households: string;
  nominationWeight: number;
  generalWeight: number;
  connectivityProfile: string;
  primaryStrategicImperative: string;
}

const GEOGRAPHIC_ZONES: GeographicZone[] = [
  {
    id: "anchor",
    name: "The Urban & Central Anchor",
    subCounties: "Kitui Central · Kitui West · Katulani",
    constituencyIds: ["kitui-central", "kitui-west"],
    population: "223,970",
    popShare: "19.7%",
    density: "~190 persons / km²",
    households: "58,724",
    nominationWeight: 20,
    generalWeight: 25,
    connectivityProfile: "Highest in the county — the urban core is where the 13.6% connected minority is concentrated.",
    primaryStrategicImperative:
      "Consolidate the home base early and intensely. This is the only zone where Dr. Mulu starts with a structural advantage, and in a nomination-poll contest consolidating a base is cheaper than converting a stranger.",
  },
  {
    id: "mwingi",
    name: "The Northern Block — Mwingi",
    subCounties: "Mwingi Central · Kyuso · Mumoni · Tseikuru",
    constituencyIds: ["mwingi-north", "mwingi-west", "mwingi-central"],
    population: "255,795",
    popShare: "22.5%",
    density: "~53 persons / km²",
    households: "57,821",
    nominationWeight: 35,
    generalWeight: 25,
    connectivityProfile: "Low to medium. Kikamba radio and SMS carry the load; USSD reaches the rest.",
    primaryStrategicImperative:
      "Nearly a quarter of the county, and where a Kitui Central MP is structurally least known. Messaging must assure northern voters that devolved funds will be distributed equitably per ward — a commitment Dr. Mulu can make more credibly than any rival, because he can publish the allocation methodology and then evaluate against it.",
  },
  {
    id: "arid-belt",
    name: "The Arid & Resource Belt",
    subCounties: "Mutomo · Ikutha · Mwingi East · Mutitu · Migwani",
    constituencyIds: ["kitui-south", "kitui-east"],
    population: "416,001",
    popShare: "36.6%",
    density: "~19 persons / km²",
    households: "89,070",
    nominationWeight: 30,
    generalWeight: 35,
    connectivityProfile:
      "Ultra-low. Ikutha sits at 9 persons/km² — digital-only reach here is not a strategy, it is an assumption.",
    primaryStrategicImperative:
      "Over a third of the county. Framing centres on transformative infrastructure — water pipelines, road networks, and responsible management of mineral resource wealth for local benefit. This is where SMS and USSD do the heavy lifting.",
  },
];

/** §7.4's fourth row: held back for testing rather than allocated to a zone. */
const ROTATING_WEIGHT = { nomination: 15, general: 15 };

const ZONE_REGISTERS = Object.fromEntries(
  GEOGRAPHIC_ZONES.map((z) => [z.id, zoneRegister(z.constituencyIds)])
) as Record<string, ReturnType<typeof zoneRegister>>;

const ASSIGNED = GEOGRAPHIC_ZONES.flatMap((z) => z.constituencyIds);
const UNASSIGNED = CONSTITUENCIES.filter((c) => !ASSIGNED.includes(c.id));

const fmt = (n: number) => n.toLocaleString("en-KE");

export function GeographicZoneMatrix() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>("mwingi");
  const currentZone = GEOGRAPHIC_ZONES.find((z) => z.id === selectedZoneId) ?? GEOGRAPHIC_ZONES[0];
  const register = ZONE_REGISTERS[currentZone.id];
  const shareOfRegister = (register.voters / COUNTY_TOTAL_WARDS) * 100;

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Compass size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Section 7 · Regional dynamics
              </span>
              <TierBadge tier={1} compact />
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-1">
              Zone weighting against the 2022 register
            </h4>
          </div>
        </div>
      </div>

      <div
        className="p-3 bg-paper/70 border-b border-line grid grid-cols-1 sm:grid-cols-3 gap-2"
        role="tablist"
        aria-label="Geographic zones"
      >
        {GEOGRAPHIC_ZONES.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          const zr = ZONE_REGISTERS[zone.id];
          return (
            <button
              key={zone.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedZoneId(zone.id)}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex flex-col gap-1 ${
                isSelected
                  ? "bg-card border-accent ring-2 ring-accent/15"
                  : "bg-paper/40 border-line hover:border-accent/40 text-muted hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className={`t-label font-black uppercase tracking-wider ${isSelected ? "text-accent" : "text-muted"}`}>
                  {zone.popShare} of population
                </span>
                <span className="t-label font-mono font-bold px-1.5 py-0.5 rounded bg-accent/10 text-accent shrink-0">
                  Phase −1: {zone.nominationWeight}%
                </span>
              </div>
              <div className="text-xs font-bold text-ink truncate">{zone.name}</div>
              <div className="t-small font-mono text-muted tabular-nums">
                {fmt(zr.voters)} registered
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentZone.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-paper rounded-xl border border-line">
                <div className="t-label uppercase font-bold text-muted">Population</div>
                <div className="text-sm font-bold text-ink mt-0.5 font-mono tabular-nums">{currentZone.population}</div>
                <div className="t-label text-accent font-semibold">{currentZone.popShare} of county</div>
              </div>

              <div className="p-3 bg-paper rounded-xl border border-line">
                <div className="t-label uppercase font-bold text-muted">Registered voters</div>
                <div className="text-sm font-bold text-ink mt-0.5 font-mono tabular-nums">{fmt(register.voters)}</div>
                <div className="t-label text-muted">{shareOfRegister.toFixed(1)}% of the register</div>
              </div>

              <div className="p-3 bg-paper rounded-xl border border-line">
                <div className="t-label uppercase font-bold text-muted">Density</div>
                <div className="text-sm font-bold text-ink mt-0.5 font-mono">{currentZone.density}</div>
                <div className="t-label text-muted tabular-nums">{currentZone.households} households</div>
              </div>

              <div className="p-3 bg-accent/5 rounded-xl border border-accent/20">
                <div className="t-label uppercase font-bold text-accent">Phase −1 weighting</div>
                <div className="text-sm font-black text-accent mt-0.5 font-mono tabular-nums">
                  {currentZone.nominationWeight}%
                </div>
                <div className="t-label text-muted font-medium">Phase 3: {currentZone.generalWeight}%</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-paper border border-line space-y-1.5">
              <div className="t-label font-black uppercase tracking-wider text-accent flex items-center gap-1.5">
                <TrendingUp size={13} aria-hidden="true" />
                Zone strategic imperative
              </div>
              <p className="text-xs text-ink leading-relaxed font-medium">{currentZone.primaryStrategicImperative}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-paper/60 border border-line space-y-1.5">
                <div className="t-label font-black uppercase tracking-wider text-muted flex items-center gap-1">
                  <Radio size={12} className="text-accent" aria-hidden="true" />
                  Connectivity &amp; delivery channels
                </div>
                <p className="text-xs text-ink font-medium leading-relaxed">{currentZone.connectivityProfile}</p>
                <p className="t-label text-muted pt-1">
                  Sub-counties in this zone: {currentZone.subCounties}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-paper/60 border border-line space-y-1.5">
                <div className="t-label font-black uppercase tracking-wider text-muted flex items-center gap-1">
                  <MapPin size={12} className="text-accent" aria-hidden="true" />
                  Largest wards by register
                </div>
                <ul className="flex flex-col gap-1 mt-1">
                  {register.wards.slice(0, 5).map((w) => (
                    <li key={`${w.constituency}-${w.name}`} className="flex items-baseline justify-between gap-2 t-small">
                      <span className="text-ink font-semibold truncate">{w.name}</span>
                      <span className="font-mono text-muted tabular-nums shrink-0">{fmt(w.voters)}</span>
                    </li>
                  ))}
                </ul>
                <p className="t-label text-muted pt-1">
                  {register.constituencies.map((c) => c.name).join(" · ")} — {register.wards.length} wards
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-4 py-3 bg-paper/60 border-t border-line space-y-2">
        <p className="t-small text-muted font-medium flex items-start gap-1.5">
          <Percent size={12} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            Phase −1 deliberately over-indexes on Mwingi and the arid belt relative to population share, because the
            nomination deficit is a recognition deficit concentrated outside the home base. A further{" "}
            {ROTATING_WEIGHT.nomination}% is held back for rotating tests. Weightings are reviewed monthly and
            reallocated.
          </span>
        </p>
        {UNASSIGNED.length > 0 && (
          <p className="t-small text-muted flex items-start gap-1.5">
            <AlertTriangle size={12} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Section 7 groups the county by sub-county; the IEBC register is published by constituency, and the two do
              not nest. Zone totals above sum whole constituencies.{" "}
              {UNASSIGNED.map((c) => `${c.name} (${fmt(c.voters)})`).join(", ")}{" "}
              {UNASSIGNED.length === 1 ? "is" : "are"} not named in any of the three zones and{" "}
              {UNASSIGNED.length === 1 ? "is" : "are"} excluded rather than assigned by assumption.
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
