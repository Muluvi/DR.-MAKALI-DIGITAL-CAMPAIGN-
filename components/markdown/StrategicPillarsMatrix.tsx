"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, BarChart3, Languages, CheckSquare, ShieldCheck, ArrowRight, Sparkles, FileCheck2 } from "lucide-react";

interface StrategicPillar {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  corePremise: string;
  tangibleProofPoint: string;
  deliveryFormat: string;
  verificationAudit: string;
}

const STRATEGIC_PILLARS: StrategicPillar[] = [
  {
    id: "pillar1",
    num: "01",
    title: "Fiscal Accountability & Devolution",
    subtitle: "Public Finance Governance & Equitable Ward Share",
    icon: Building2,
    corePremise: "Translates parliamentary leadership in national budget appropriations into a transparent manifesto for Kitui's 40 wards, showing line-by-line management of the KSh 13.79B county resource envelope.",
    tangibleProofPoint: "KSh 1.339B own-source revenue optimization model & published ward allocation formula.",
    deliveryFormat: "Ward-by-ward budget allocation sheets, Kikamba vernacular explainers, and open expenditure tables.",
    verificationAudit: "Pre-allocation public disclosure matched against post-expenditure Auditor General queries."
  },
  {
    id: "pillar2",
    num: "02",
    title: "Data-Driven Civic Engagement",
    subtitle: "Track Record Visualization & Evidence Maps",
    icon: BarChart3,
    corePremise: "Transforms dense county documentation into clear visual graphics, ward maps, and before-and-after project comparisons that ordinary citizens can instantly understand and interrogate.",
    tangibleProofPoint: "12,573 bursary beneficiaries (KSh 47M) and evaluated NG-CDF projects certified as best in Eastern Region.",
    deliveryFormat: "Interactive infographics, mobile-first ward cartograms, and before/after project cards.",
    verificationAudit: "Public register of all school classrooms, bursary disbursements, and water points."
  },
  {
    id: "pillar3",
    num: "03",
    title: "Policy-to-People Translation",
    subtitle: "Linguistic & Cultural Vernacular Localization",
    icon: Languages,
    corePremise: "Converts complex technical topics (climate adaptation, water pipeline financing, agricultural value chains) into culturally resonant Kikamba idioms, proverbs, and audio voice notes.",
    tangibleProofPoint: "Kikamba audio briefs ('Kĩla kĩndũ kĩ na thayũ, ĩtina nĩ kũmenya') and 60-second animated explainers.",
    deliveryFormat: "WhatsApp voice notes from Dr. Mulu, weekly radio barazas, and grassroots chama toolkits.",
    verificationAudit: "Certified by native-speaker linguist with zero identity-based wedge targeting."
  },
  {
    id: "pillar4",
    num: "04",
    title: "Verification & Follow-Through",
    subtitle: "The M&E Signature Differentiator",
    icon: CheckSquare,
    corePremise: "The single pillar separating Dr. Mulu from every rival: publishing what was promised, then systematically publishing whether it actually happened. An evaluator who measures outcomes.",
    tangibleProofPoint: "Public Service-Delivery Tracker (Section 8.5) operational on USSD, SMS, WhatsApp, and Web.",
    deliveryFormat: "Quarterly evidence scorecards, live issue resolution registers, and transparent ad-spend ledger.",
    verificationAudit: "Independent verification through Evaluation Society of Kenya standards."
  }
];

export function StrategicPillarsMatrix() {
  const [selectedPillarId, setSelectedPillarId] = useState<string>("pillar1");
  const currentPillar = STRATEGIC_PILLARS.find(p => p.id === selectedPillarId) || STRATEGIC_PILLARS[0];

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Campaign pillars · 2.2
              </span>
              <span className="t-label font-mono font-bold text-muted">
                Core Policy Architecture
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Four Strategic Communication Pillars
            </h4>
          </div>
        </div>
      </div>

      {/* Pillar Switcher Tabs */}
      <div className="p-3 bg-paper/70 border-b border-line grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STRATEGIC_PILLARS.map((pillar) => {
          const isSelected = pillar.id === selectedPillarId;
          const IconComponent = pillar.icon;
          return (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillarId(pillar.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? "bg-card border-accent shadow-sm ring-2 ring-accent/15"
                  : "bg-paper/40 border-line hover:border-accent/40 text-muted hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`t-label font-mono font-black ${isSelected ? "text-accent" : "text-muted"}`}>
                  PILLAR {pillar.num}
                </span>
                <IconComponent size={14} className={isSelected ? "text-accent" : "text-muted"} />
              </div>
              <div className="text-xs font-bold text-ink mt-1.5 line-clamp-1">
                {pillar.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Pillar Content View */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="border-b border-line/60 pb-3">
          <div className="text-xs font-bold text-accent uppercase tracking-wider">
            Pillar {currentPillar.num} &bull; Strategic Mandate
          </div>
          <h5 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
            {currentPillar.title}
          </h5>
          <p className="text-xs text-muted font-medium mt-1">
            {currentPillar.subtitle}
          </p>
        </div>

        {/* Core Premise */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-paper border border-line text-xs sm:text-sm text-ink leading-relaxed font-medium">
          {currentPillar.corePremise}
        </div>

        {/* Breakdown Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-paper/60 border border-line space-y-1">
            <div className="t-label font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <Sparkles size={12} className="text-accent" />
              Tangible Evidence
            </div>
            <p className="text-xs text-ink font-semibold leading-relaxed">
              {currentPillar.tangibleProofPoint}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-paper/60 border border-line space-y-1">
            <div className="t-label font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <Languages size={12} className="text-accent" />
              Operational Delivery
            </div>
            <p className="text-xs text-muted font-medium leading-relaxed">
              {currentPillar.deliveryFormat}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 space-y-1">
            <div className="t-label font-black uppercase tracking-wider text-accent flex items-center gap-1">
              <FileCheck2 size={12} />
              M&E Verification Audit
            </div>
            <p className="text-xs text-ink font-semibold leading-relaxed">
              {currentPillar.verificationAudit}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Rule */}
      <div className="p-3 bg-paper/60 border-t border-line t-small text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <ArrowRight size={12} className="text-accent" />
          <span>Underlying Campaign Doctrine: &ldquo;Kitui has resources. What it has lacked is leadership that understands how to use them — and the discipline to prove it did.&rdquo;</span>
        </span>
      </div>
    </div>
  );
}
