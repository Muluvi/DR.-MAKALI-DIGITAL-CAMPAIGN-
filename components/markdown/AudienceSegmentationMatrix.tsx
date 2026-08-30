"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users2, 
  Smartphone, 
  Radio, 
  Globe, 
  Coins, 
  GraduationCap, 
  Sparkles,
  ChevronRight,
  Send,
  Zap
} from "lucide-react";

interface AudienceSegment {
  id: string;
  name: string;
  demographicSize: string;
  connectivityLevel: "Ultra-Low / Feature Phone" | "Mixed / WhatsApp" | "High / Broadband";
  primaryLanguage: "Kikamba (Monolingual)" | "Kikamba + Sheng" | "English + Swahili";
  keyFrustration: string;
  leadMessage: string;
  recommendedChannels: string[];
}

const AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: "rural-farmers",
    name: "1. Rural Smallholders & Livestock Keepers",
    demographicSize: "44.5% of County (approx. 237,000 voters)",
    connectivityLevel: "Ultra-Low / Feature Phone",
    primaryLanguage: "Kikamba (Monolingual)",
    keyFrustration: "Chronic droughts, broken water boreholes, unmitigated livestock losses, and lack of subsidized inputs.",
    leadMessage: "The Economist Governor guarantees predictable county budget allocations for water pans, subsidized seeds, and livestock insurance.",
    recommendedChannels: ["Kikamba Vernacular Radio (Musyi FM, Mbaitu FM)", "Weekly Market Barazas", "SMS Weather & Commodity Alerts"]
  },
  {
    id: "youth-underemployed",
    name: "2. Underemployed Youth (18–35)",
    demographicSize: "32.8% of County (approx. 175,000 voters)",
    connectivityLevel: "Mixed / WhatsApp",
    primaryLanguage: "Kikamba + Sheng",
    keyFrustration: "Zero formal jobs after tertiary education, unpaid county supplier invoices, and predatory digital loans.",
    leadMessage: "Economic empowerment through County Enterprise Fund access, digital work hubs in every ward, and youth procurement compliance.",
    recommendedChannels: ["WhatsApp Viral Voice Notes", "TikTok Strategy Clips", "Bodaboda Stage Activations", "Football Tournament Sponsorships"]
  },
  {
    id: "market-traders",
    name: "3. Market Women & Informal MSME Traders",
    demographicSize: "18.2% of County (approx. 97,000 voters)",
    connectivityLevel: "Mixed / WhatsApp",
    primaryLanguage: "Kikamba (Monolingual)",
    keyFrustration: "Excessive municipal cess and market levies without clean sanitation, market stalls, or lighting.",
    leadMessage: "A rationalized cess regime, modern market shade infrastructure with solar lighting, and revolving micro-credit chamas.",
    recommendedChannels: ["Chama & Table Banking Visits", "Market Day PA Sound Trucks", "USSD Financial Survey Engagement"]
  },
  {
    id: "teachers-civil-servants",
    name: "4. Teachers, Health Workers & County Staff",
    demographicSize: "6.5% of County (approx. 35,000 opinion shapers)",
    connectivityLevel: "High / Broadband",
    primaryLanguage: "English + Swahili",
    keyFrustration: "Delayed salaries, unremitted statutory deductions (NHIF/NSSF), and political interference in promotions.",
    leadMessage: "Fiscal discipline: 100% timely payroll disbursement, transparent civil service promotions, and audited pending bill clearance.",
    recommendedChannels: ["Detailed Policy Whitepapers", "LinkedIn & Facebook Thought Leadership", "Union Delegation Breakfasts"]
  },
  {
    id: "nairobi-diaspora",
    name: "5. Nairobi & Coastal Kitui Diaspora",
    demographicSize: "High Influence (Influences 80,000+ home votes)",
    connectivityLevel: "High / Broadband",
    primaryLanguage: "English + Swahili",
    keyFrustration: "Brain drain, poor county health infrastructure forcing relatives to travel to Nairobi, and corrupt land registry.",
    leadMessage: "Partnering with diaspora capital for value addition in green grams, honey processing, and mineral rights protection.",
    recommendedChannels: ["Nairobi Town Hall Dinners", "WhatsApp Community Groups", "Twitter/X Spaces & YouTube Policy Briefs"]
  },
  {
    id: "clergy-elders",
    name: "6. Church Clergy & Clan Elders (Atumia)",
    demographicSize: "Supreme Moral Authority (Gatekeepers)",
    connectivityLevel: "Ultra-Low / Feature Phone",
    primaryLanguage: "Kikamba (Monolingual)",
    keyFrustration: "Erosion of communal values, political hooliganism, and neglect of church-sponsored schools and dispensaries.",
    leadMessage: "Integrity, parliamentary pedigree, decorum, and transparent collaboration with faith-based organizations.",
    recommendedChannels: ["Sunday Pulpit Protocol Engagements", "Council of Elders (Nzama) Consultations", "Direct Phone Calls from Dr. Mulu"]
  }
];

export function AudienceSegmentationMatrix() {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("rural-farmers");
  const currentSegment = AUDIENCE_SEGMENTS.find(s => s.id === selectedSegmentId) || AUDIENCE_SEGMENTS[0];

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Users2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Audience Architecture
              </span>
              <span className="text-[10px] font-mono font-bold text-muted">
                6 Strategic Demographic Cohorts
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Demographic Segmentation & Messaging Engine
            </h4>
          </div>
        </div>
      </div>

      {/* Segment Selector Chips (Scrollable / Grid) */}
      <div className="p-3 bg-paper/70 border-b border-line overflow-x-auto scrollbar-none flex items-center gap-2">
        {AUDIENCE_SEGMENTS.map((segment) => {
          const isSelected = segment.id === selectedSegmentId;
          return (
            <button
              key={segment.id}
              onClick={() => setSelectedSegmentId(segment.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? "bg-accent text-white shadow-sm shadow-accent/20"
                  : "bg-card border border-line text-muted hover:text-ink hover:border-accent/40"
              }`}
            >
              <span>{segment.name.split(". ")[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Segment Details Card */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
          <div>
            <h5 className="text-base font-bold text-ink">{currentSegment.name}</h5>
            <p className="text-xs font-mono text-accent font-bold mt-0.5">{currentSegment.demographicSize}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-1 bg-paper border border-line rounded-lg text-muted">
              {currentSegment.connectivityLevel}
            </span>
            <span className="text-[10px] font-bold px-2 py-1 bg-accent/10 border border-accent/20 rounded-lg text-accent">
              {currentSegment.primaryLanguage}
            </span>
          </div>
        </div>

        {/* Frustration vs Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          <div className="p-4 rounded-xl bg-paper border border-line space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Zap size={13} className="text-rose-500" />
              Core Livelihood Frustration
            </div>
            <p className="text-xs text-ink leading-relaxed font-medium">
              {currentSegment.keyFrustration}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Sparkles size={13} />
              Tailored Campaign Narrative
            </div>
            <p className="text-xs text-ink leading-relaxed font-semibold">
              &ldquo;{currentSegment.leadMessage}&rdquo;
            </p>
          </div>
        </div>

        {/* Recommended Tactical Channels */}
        <div className="pt-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">
            High-Impact Delivery Channels
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentSegment.recommendedChannels.map((channel, i) => (
              <div key={i} className="p-2.5 bg-paper rounded-xl border border-line text-xs font-bold text-ink flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[10px]">
                  {i + 1}
                </div>
                <span className="truncate">{channel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Rule */}
      <div className="p-3 bg-paper/60 border-t border-line text-[11px] text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <Globe size={12} className="text-accent" />
          <span>86.4% of voters reside in rural/offline low-bandwidth environments (KNBS 2019 Census).</span>
        </span>
      </div>
    </div>
  );
}
