"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Radio, MessageSquare, AlertCircle, Layers } from "lucide-react";

import { ClaimBadge } from "./ClaimBadge";
import { TierBadge } from "./TierBadge";

/**
 * Sections 7.1–7.2 — the six structural segments.
 *
 * Sizing figures are quoted from §7.1's "Empirical Sizing" line and §7.2's summary matrix.
 * Three of the six are marked in the source as a Named Data Gap requiring primary survey; those
 * render as unsized, with the source's estimated range shown as an estimate rather than promoted
 * to a fact. An earlier version of this component assigned all six invented percentages and
 * voter counts that appear nowhere in the proposal
 * and did not sum correctly against the register.
 */

type Sizing =
  | { kind: "sized"; voters: string; share: string; tier: 1 | 2 | 3 }
  | { kind: "gap"; estimate: string; note: string };

interface AudienceSegment {
  id: string;
  index: number;
  name: string;
  sizing: Sizing;
  connectivity: string;
  geographicBase: string;
  coreAnxiety: string;
  valueProposition: string;
  channels: string[];
}

const AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: "agrarian",
    index: 1,
    name: "Rural agrarian & smallholder baseline",
    sizing: { kind: "sized", voters: "~455,000 registered voters", share: "~86.2% of county population", tier: 1 },
    connectivity: "86.4% offline. 2G feature-phone dominance, high evening vernacular radio listenership.",
    geographicBase: "Rural belts across Kitui Central, Kitui West, Kitui Rural, Mwingi Central, Mwingi West and Kitui East — 36 non-urban wards.",
    coreAnxiety:
      "Persistent seasonal crop failure, unmitigated drought shocks, exploitative middlemen for green grams and pigeon peas, erratic subsidised seed and fertiliser distribution.",
    valueProposition:
      "Public finance expertise as a guarantee of guaranteed minimum returns, county-backed cold storage and aggregate marketing boards, and decentralised solar-powered sand dam and borehole expansion.",
    channels: ["Kamba vernacular radio, 06:00–08:30 and 19:00–21:30", "Localised bulk SMS in Kikamba", "Market-day barazas", "Church fellowships and SACCO meetings"],
  },
  {
    id: "pastoralist",
    index: 2,
    name: "Agro-pastoralist & arid-zone livestock keepers",
    sizing: {
      kind: "gap",
      estimate: "~80,000–105,000 registered voters",
      note: "~15%–20% of the rural population. Precise registration figures require a targeted primary survey.",
    },
    connectivity: "Highly dispersed. Intermittent 2G coverage, heavy battery and solar radio listenership.",
    geographicBase: "Mwingi North, Mwingi Central, Kitui South and Kitui East borderlands.",
    coreAnxiety:
      "Banditry along the Tana River and Garissa borders, pasture depletion, no county livestock off-take during drought, disease outbreaks, predatory livestock buyers.",
    valueProposition:
      "County-financed livestock vaccination corridors, modern abattoir facilities in Mwingi and Mutomo, and assertive security coordination backed by parliamentary budgeting influence.",
    channels: ["Vernacular radio pastoralist segments", "Weekly livestock market hubs", "Clan elders and grazing committee chairs"],
  },
  {
    id: "youth",
    index: 3,
    name: "Youth cohort, ages 18–35",
    sizing: { kind: "sized", voters: "~234,000 registered voters", share: "~44% of the active register", tier: 1 },
    connectivity: "~70%+ smartphone adoption within the cohort. WhatsApp, TikTok, Facebook Mobile, YouTube.",
    geographicBase: "Peri-urban corridors — Kitui Township, the Kwa Vonza university belt, Mwingi Central town, Mutonguni, Kabati — and rural trading centres.",
    coreAnxiety:
      "Chronic un- and under-employment, predatory digital lending apps, arbitrary county revenue enforcement against bodaboda riders and kiosks, no startup capital.",
    valueProposition:
      "Dismantling the handouts model in favour of an institutionalised County Youth Enterprise & Innovation Fund, TVET scholarship vouchers, and zero-rating of small informal trade licences.",
    channels: ["Meta and TikTok short-form video", "WhatsApp audio and graphic forwards", "Bodaboda stage associations", "University and college student unions"],
  },
  {
    id: "msme",
    index: 4,
    name: "Urban & peri-urban informal commerce",
    sizing: { kind: "sized", voters: "~73,500 registered voters", share: "~13.8% of county population", tier: 1 },
    connectivity: "~45%–55% smartphone connectivity. Constant WhatsApp business use, daily county revenue contact.",
    geographicBase: "Kitui Township, Mwingi Central town, Kwa Vonza/Yatta, Mutomo, Matinyani and Nguutani.",
    coreAnxiety:
      "Excessive cess without basic market infrastructure, arbitrary harassment by county enforcement, market fires with no response.",
    valueProposition:
      "The Economist's Business Charter — a single unified business permit, 24-hour solar-lit and secured markets, modern sanitation, and predictable county tax codes.",
    channels: ["Business-district walk-throughs", "Trader association meetings", "KNCCI Kitui chapter", "Market-day PA activations"],
  },
  {
    id: "professionals",
    index: 5,
    name: "Formal professionals, civil servants & educators",
    sizing: {
      kind: "gap",
      estimate: "~25,000–35,000 registered voters",
      note: "Teachers under KNUT/KUPPET, healthcare workers, civil servants, bank staff and clergy. Sizing requires administrative primary research.",
    },
    connectivity: ">90% smartphone and laptop connectivity. Active on X, Facebook, LinkedIn and professional WhatsApp groups.",
    geographicBase: "Concentrated in Kitui town, Mwingi town and county administrative centres.",
    coreAnxiety:
      "Delayed statutory deductions, stalled promotions, poor hospital drug supplies undermining medical practice, politicised public service appointments.",
    valueProposition:
      "Meritocratic public service administration, on-time payment of county health workers, professionalisation of the County Public Service Board, and governance free from cronyism.",
    channels: ["Policy whitepapers", "LinkedIn and Facebook thought leadership", "Union delegation briefings"],
  },
  {
    id: "diaspora",
    index: 6,
    name: "Out-of-county Kamba diaspora",
    sizing: {
      kind: "gap",
      estimate: "150,000+ individuals",
      note: "Total diaspora volume. The subset registered to vote in Kitui County requires specialised primary polling.",
    },
    connectivity: ">95% internet and smartphone connected. Active on X, Facebook, WhatsApp, YouTube and national podcasts.",
    geographicBase: "Nairobi, the Coast and nationwide, plus the 26 countries IEBC is opening to diaspora registration.",
    coreAnxiety:
      "Inefficient county spending that leaves rural parents and siblings in perpetual poverty, requiring continuous emergency bailouts from the diaspora.",
    valueProposition:
      "Dr. Mulu as the diaspora's trusted steward — an economist who will manage county funds with audited transparency and create an enabling environment for diaspora investment.",
    channels: ["Nairobi and Coast geotargeted ads", "Diaspora town halls", "National podcasts"],
  },
];

export function AudienceSegmentationMatrix() {
  const [activeId, setActiveId] = useState(AUDIENCE_SEGMENTS[0].id);
  const active = AUDIENCE_SEGMENTS.find((s) => s.id === activeId) ?? AUDIENCE_SEGMENTS[0];
  const gapCount = AUDIENCE_SEGMENTS.filter((s) => s.sizing.kind === "gap").length;

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Layers size={20} aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
              Section 7 · Audience architecture
            </span>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-1">Six structural segments</h4>
          </div>
        </div>
      </div>

      <div
        className="flex overflow-x-auto gap-1 p-2 bg-paper/70 border-b border-line scrollbar-none"
        role="tablist"
        aria-label="Audience segments"
      >
        {AUDIENCE_SEGMENTS.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(s.id)}
              className={`px-3 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive ? "bg-accent text-white" : "text-muted hover:text-ink hover:bg-ink/5"
              }`}
            >
              <span className="font-mono opacity-70 mr-1.5">{s.index}</span>
              {s.name.split(" ").slice(0, 3).join(" ")}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="p-4 sm:p-6 space-y-4"
        >
          <div>
            <h5 className="font-serif text-lg font-bold text-ink leading-tight">{active.name}</h5>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {active.sizing.kind === "sized" ? (
                <>
                  <span className="font-mono text-sm font-black text-accent tabular-nums">{active.sizing.voters}</span>
                  <span className="text-xs text-muted">{active.sizing.share}</span>
                  <TierBadge tier={active.sizing.tier} compact />
                </>
              ) : (
                <>
                  <span className="font-mono text-sm font-black text-muted tabular-nums">{active.sizing.estimate}</span>
                  <ClaimBadge status="estimate" compact />
                </>
              )}
            </div>
            {active.sizing.kind === "gap" && (
              <p className="text-[11px] text-muted mt-2 flex items-start gap-1.5">
                <AlertCircle size={11} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Named data gap (§7.3).</strong> {active.sizing.note} Commissioning this is a Phase −1
                  research priority; it is not sized here because it is not sized in the source.
                </span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-paper/60 border border-line">
              <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1 mb-1.5">
                <Radio size={12} className="text-accent" aria-hidden="true" />
                Connectivity &amp; media
              </div>
              <p className="text-xs text-ink leading-relaxed">{active.connectivity}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-paper/60 border border-line">
              <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1 mb-1.5">
                <Users size={12} className="text-accent" aria-hidden="true" />
                Geographic base
              </div>
              <p className="text-xs text-ink leading-relaxed">{active.geographicBase}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-paper border border-line space-y-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
                Core anxiety
              </div>
              <p className="text-xs text-ink leading-relaxed">{active.coreAnxiety}</p>
            </div>
            <div className="pt-3 border-t border-line/50">
              <div className="text-[10px] font-black uppercase tracking-wider text-accent mb-1">
                Candidate value proposition
              </div>
              <p className="text-xs text-ink leading-relaxed">{active.valueProposition}</p>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1 mb-2">
              <MessageSquare size={12} className="text-accent" aria-hidden="true" />
              Reachable channels
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {active.channels.map((c) => (
                <li key={c} className="text-[11px] px-2.5 py-1 rounded-lg bg-card border border-line text-ink">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="px-4 py-3 bg-paper/60 border-t border-line">
        <p className="text-[11px] text-muted leading-relaxed">
          {gapCount} of the 6 segments are unsized in the source and are shown as such. §7.3 catalogues them for
          commissioning in the Phase −1 baseline survey — this document does not estimate past its own evidence.
        </p>
      </div>
    </div>
  );
}
