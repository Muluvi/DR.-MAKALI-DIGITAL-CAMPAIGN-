"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Sparkles, CheckCircle2, ArrowRight, HelpCircle, Droplet, Coins, HeartHandshake, GraduationCap } from "lucide-react";

interface PersuasionTheme {
  id: string;
  themeTitle: string;
  icon: React.ElementType;
  principles: {
    name: string;
    description: string;
    scriptFraming: string;
  }[];
}

const PERSUASION_THEMES: PersuasionTheme[] = [
  {
    id: "water",
    themeTitle: "Water Security & Infrastructure",
    icon: Droplet,
    principles: [
      {
        name: "Loss Aversion",
        description: "Losses are felt 2x more intensely than equivalent gains.",
        scriptFraming: "“Approximately 400,000 people in Kitui still depend on surface water for drinking. Every dry season costs our families more than permanent boreholes would.”"
      },
      {
        name: "Social Proof",
        description: "People take cues from the verified actions of their peers.",
        scriptFraming: "“Over 14,000 families across Kitui East and Mwingi North have already signed the sand dam resolution. Add your household.”"
      },
      {
        name: "Verification Bias",
        description: "Claims that can be independently audited are trusted 3x more.",
        scriptFraming: "“We will publish every borehole location, contractor cost, and completion date. Dial *384# to check the verified status of the water point nearest your home.”"
      }
    ]
  },
  {
    id: "fiscal",
    themeTitle: "Fiscal Discipline & County Budget",
    icon: Coins,
    principles: [
      {
        name: "Anchoring Effect",
        description: "The initial figure establishes the psychological baseline.",
        scriptFraming: "“Kitui County will receive KSh 13.79 billion this financial year. Do you know where it goes? Dr. Mulu will publish every single shilling.”"
      },
      {
        name: "Loss Aversion",
        description: "Frame corruption and leakages as direct personal deprivation.",
        scriptFraming: "“Every shilling lost in pending bills is a dispensary not built, a nurse not hired, and a rural feeder road left impassable.”"
      },
      {
        name: "Messenger Effect",
        description: "The authority of the messenger validates the policy claim.",
        scriptFraming: "“He was certified as having the best evaluated constituency in the Eastern region by the Ministry of Finance. He does not just spend — he measures.”"
      }
    ]
  },
  {
    id: "youth",
    themeTitle: "Youth Employment & TVET",
    icon: GraduationCap,
    principles: [
      {
        name: "Commitment Device",
        description: "Small public commitments drastically increase voter turnout.",
        scriptFraming: "“Pledge to register to vote today, and Dr. Mulu pledges a quarterly county jobs and procurement audit. Hold him to it.”"
      },
      {
        name: "Messenger Effect",
        description: "Direct peers resonate higher than political speeches.",
        scriptFraming: "“A SEKU engineering graduate shares how transparent county digital innovation hubs would have transformed their job search.”"
      },
      {
        name: "Scarcity & Urgency",
        description: "Limited-time windows prompt immediate action.",
        scriptFraming: "“The voter registration window closes before the nomination list is finalized. Secure your voice before the deadline.”"
      }
    ]
  },
  {
    id: "household",
    themeTitle: "Poverty & Household Economics",
    icon: HeartHandshake,
    principles: [
      {
        name: "Loss Aversion",
        description: "Contrast local poverty against national benchmarks as a policy choice.",
        scriptFraming: "“60.4% of Kitui lives below the poverty line compared to the 45.2% national average. That gap is a failure of leadership, not a fact of nature.”"
      },
      {
        name: "Messenger Effect (Chama Leaders)",
        description: "Grassroots women chairladies validating indigenous economy.",
        scriptFraming: "“A table-banking chairlady speaks on poultry income — a sector in over 90% of Kitui households that county budgets have completely ignored.”"
      },
      {
        name: "Verification Bias",
        description: "Empirical proof of 12,573 bursary disbursements.",
        scriptFraming: "“KSh 47 million directly disbursed to 12,573 students in Kitui Central. Scrutinize the published beneficiary register.”"
      }
    ]
  }
];

export function PersuasionFramingMatrix() {
  const [activeThemeId, setActiveThemeId] = useState<string>("water");
  const currentTheme = PERSUASION_THEMES.find(t => t.id === activeThemeId) || PERSUASION_THEMES[0];

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Brain size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Persuasion architecture · 2.8
              </span>
              <span className="t-label font-mono font-bold text-muted">
                Behavioural Economics
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Behavioural Science & Persuasion Framing Engine
            </h4>
          </div>
        </div>
      </div>

      {/* Theme Switcher Tabs */}
      <div className="p-3 bg-paper/70 border-b border-line grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PERSUASION_THEMES.map((theme) => {
          const isSelected = theme.id === activeThemeId;
          const IconComp = theme.icon;
          return (
            <button
              key={theme.id}
              onClick={() => setActiveThemeId(theme.id)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                isSelected 
                  ? "bg-card border-accent shadow-sm ring-2 ring-accent/15" 
                  : "bg-paper/40 border-line hover:border-accent/40 text-muted hover:text-ink"
              }`}
            >
              <IconComp size={16} className={isSelected ? "text-accent shrink-0" : "text-muted shrink-0"} />
              <span className="text-xs font-bold truncate">{theme.themeTitle.split(" ")[0]} {theme.themeTitle.split(" ")[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Persuasion Principle Cards */}
      <div className="p-4 sm:p-6 space-y-3">
        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
          Applied Behavioral Framings for: <span className="text-ink font-serif font-bold text-sm capitalize">{currentTheme.themeTitle}</span>
        </div>

        <div className="space-y-3">
          {currentTheme.principles.map((p, idx) => (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-paper border border-line space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center t-label font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-ink">{p.name}</span>
                </div>
                <span className="t-label text-muted font-medium">{p.description}</span>
              </div>

              <div className="p-3 bg-card rounded-lg border border-line text-xs sm:text-sm text-ink font-semibold italic leading-relaxed">
                {p.scriptFraming}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical Boundary Note */}
      <div className="p-3 bg-paper/60 border-t border-line t-small text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-accent" />
          <span>Ethics Charter Boundary: Framing is applied strictly to verified empirical facts — zero psychographic micro-targeting or ethnic wedge operations.</span>
        </span>
      </div>
    </div>
  );
}
