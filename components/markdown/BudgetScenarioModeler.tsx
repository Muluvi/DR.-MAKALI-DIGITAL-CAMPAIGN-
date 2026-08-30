"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coins, 
  ShieldCheck, 
  Scale, 
  TrendingUp, 
  Users, 
  Radio, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Percent,
  Sliders,
  DollarSign
} from "lucide-react";

interface BudgetTier {
  id: "lean" | "standard" | "premium";
  name: string;
  badge: string;
  recommended: boolean;
  totalCapShare: string;
  estimatedEnvelope: string;
  purpose: string;
  teamSetup: string;
  wardReach: string;
  smsUssdCapacity: string;
  adSpendProfile: string;
  primaryRisk: string;
  strengths: string[];
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: "lean",
    name: "Tier 1: Lean",
    badge: "Nomination Sprint Only",
    recommended: false,
    totalCapShare: "18%–22% of County Cap",
    estimatedEnvelope: "KSh 17.5M – KSh 21.4M",
    purpose: "Win the Wiper nomination, hold the home field, and prove the data model without full county surge.",
    teamSetup: "3-person core team + mandatory Kikamba producer only.",
    wardReach: "Strong in Kitui Central (Anchor zone); weak in Arid Belt & North.",
    smsUssdCapacity: "Organic consented SMS only (up to 40k contacts). No USSD shortcode.",
    adSpendProfile: "KSh 3.5M Meta ads (hyper-targeted on Kitui Central & Wiper delegates).",
    primaryRisk: "Concentrates resources where Dr. Mulu is already strong, leaving the 15.3% recognition gap untouched in Mwingi & Arid Belt.",
    strengths: [
      "Extremely low cash burn in Phase -1",
      "Safely below 20% single-source contribution ceiling",
      "Immediate operational launch with zero onboarding lag"
    ]
  },
  {
    id: "standard",
    name: "Tier 2: Standard",
    badge: "Recommended Benchmark",
    recommended: true,
    totalCapShare: "38%–42% of County Cap",
    estimatedEnvelope: "KSh 37.0M – KSh 40.9M",
    purpose: "Systematically erase the recognition deficit countywide across all 40 wards and contest the general election to win.",
    teamSetup: "Lean Firefly core + activated surge bench (Data, Community, Volunteer, Crisis & Media Leads).",
    wardReach: "Full countywide penetration across all 40 wards + diaspora voter drive.",
    smsUssdCapacity: "Shared USSD (*384#) active across all networks + 120,000 consented SMS universe.",
    adSpendProfile: "KSh 12.5M multi-channel ad budget (Meta, Google, TikTok & YouTube).",
    primaryRisk: "Requires structured monthly cash-flow discipline to sustain field-digital integration.",
    strengths: [
      "Erases Mwingi & Southern deficit by Phase 1",
      "Deploys live Section 19B Public Service Tracker",
      "Compliant headroom preserved for ground logistics & transport"
    ]
  },
  {
    id: "premium",
    name: "Tier 3: Premium",
    badge: "Dominant Share-of-Voice",
    recommended: false,
    totalCapShare: "50%–55% of County Cap",
    estimatedEnvelope: "KSh 48.7M – KSh 53.6M",
    purpose: "Achieve uncontested digital and low-connectivity saturation across Kitui and all 26 diaspora jurisdictions.",
    teamSetup: "Full permanent surge bench + dedicated video production crew & licensed Brandwatch monitoring.",
    wardReach: "All 40 wards + high-intensity diaspora chapter mobilisation in 26 countries.",
    smsUssdCapacity: "Dedicated branded USSD code + WhatsApp Business API multi-agent routing + 250k SMS universe.",
    adSpendProfile: "KSh 22.0M dominant ad blitz with continuous daily video production.",
    primaryRisk: "Approaches the statutory KSh 97.56M ceiling, leaving tight margins for physical logistics & ground transport.",
    strengths: [
      "Total share-of-voice dominance (>65%)",
      "Real-time AI deepfake detection & rapid rebuttal unit",
      "26-country diaspora fundraising & mobilization engine"
    ]
  }
];

export function BudgetScenarioModeler() {
  const [selectedTierId, setSelectedTierId] = useState<"lean" | "standard" | "premium">("standard");
  const currentTier = BUDGET_TIERS.find(t => t.id === selectedTierId) || BUDGET_TIERS[1];

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Coins size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Section 8B Financial Model
              </span>
              <span className="text-[10px] font-mono font-bold text-muted">
                IEBC Gazette No. 12251
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              3-Tier Campaign Budget & Cash-Flow Runway Modeler
            </h4>
          </div>
        </div>

        {/* Binding Ceiling Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-accent/30 rounded-xl">
          <Scale size={14} className="text-accent" />
          <div className="text-right">
            <div className="text-[9px] uppercase font-black text-muted">Statutory County Ceiling</div>
            <div className="text-xs font-mono font-black text-ink">KSh 97.56 Million</div>
          </div>
        </div>
      </div>

      {/* Tier Selector Buttons */}
      <div className="p-3 bg-paper/70 border-b border-line grid grid-cols-1 sm:grid-cols-3 gap-2">
        {BUDGET_TIERS.map((tier) => {
          const isSelected = tier.id === selectedTierId;
          return (
            <button
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-card border-accent shadow-sm ring-2 ring-accent/15"
                  : "bg-paper/40 border-line hover:border-accent/40 text-muted hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-mono font-black ${isSelected ? "text-accent" : "text-muted"}`}>
                  {tier.totalCapShare}
                </span>
                {tier.recommended && (
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    Recommended
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-ink mt-1.5">
                {tier.name}
              </div>
              <div className="text-[11px] font-mono text-muted mt-0.5">
                {tier.estimatedEnvelope}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tier Deep Dive */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Purpose banner */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-paper border border-line">
          <div className="text-[10px] font-black uppercase tracking-wider text-accent mb-1">
            Strategic Scope & Objective
          </div>
          <p className="text-xs sm:text-sm text-ink font-medium leading-relaxed">
            {currentTier.purpose}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-paper/60 border border-line space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <Users size={12} className="text-accent" />
              Team Structure
            </div>
            <p className="text-xs text-ink font-semibold">
              {currentTier.teamSetup}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-paper/60 border border-line space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <Radio size={12} className="text-accent" />
              Low-Connectivity Infrastructure
            </div>
            <p className="text-xs text-ink font-semibold">
              {currentTier.smsUssdCapacity}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-paper/60 border border-line space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <TrendingUp size={12} className="text-accent" />
              Ward Reach & Penetration
            </div>
            <p className="text-xs text-ink font-semibold">
              {currentTier.wardReach}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle size={12} />
              Key Strategic Risk / Trade-off
            </div>
            <p className="text-xs text-rose-900 dark:text-rose-200 font-medium">
              {currentTier.primaryRisk}
            </p>
          </div>
        </div>

        {/* Strengths bullet points */}
        <div className="p-3.5 rounded-xl bg-card border border-line space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-muted">
            Key Execution Advantages
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentTier.strengths.map((st, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-ink font-medium">
                <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Note */}
      <div className="p-3 bg-paper/60 border-t border-line text-[11px] text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-accent" />
          <span>Statutory Compliance Gate: Single-source contributions capped at KSh 19.51M (20% of KSh 97.56M ceiling) per IEBC regulations.</span>
        </span>
      </div>
    </div>
  );
}
