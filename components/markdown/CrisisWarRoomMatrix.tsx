"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Clock, AlertTriangle, CheckCircle2, FileText, Radio, Bot, PhoneCall, ArrowRight, Flame, Layers } from "lucide-react";

interface CrisisLevel {
  level: "Level 1" | "Level 2" | "Level 3";
  title: string;
  badge: string;
  color: string;
  slaMinutes: number;
  slaDisplay: string;
  triggerDescription: string;
  approvalChain: string;
  actionProtocol: string[];
  sampleScenario: string;
}

const CRISIS_LEVELS: CrisisLevel[] = [
  {
    level: "Level 1",
    title: "Routine Misinformation & Isolated Social Negativity",
    badge: "Low Severity",
    color: "emerald",
    slaMinutes: 240,
    slaDisplay: "≤ 4 Hours",
    triggerDescription: "Minor negative comments, single isolated social media attacks (<1,000 views), standard policy queries.",
    approvalChain: "Firefly Content Lead & Digital Director sign-off.",
    actionProtocol: [
      "Deploy pre-approved fact-check card from asset library.",
      "Direct user to public M&E / Bursary transparency register.",
      "Monitor engagement thread for organized amplification."
    ],
    sampleScenario: "An X user claims Dr. Mulu has never built a classroom in Mulango Ward."
  },
  {
    level: "Level 2",
    title: "Coordinated Smear & Viral Misinformation",
    badge: "Medium Severity",
    color: "amber",
    slaMinutes: 120,
    slaDisplay: "≤ 2 Hours",
    triggerDescription: "Coordinated bot hashtag campaigns, hostile radio talk show attacks, viral claims reaching >10,000 views.",
    approvalChain: "Campaign Communications Director (Campaign Counterpart).",
    actionProtocol: [
      "Issue signed counter-statement across WhatsApp & social handles.",
      "Dispatch audio rebuttal note to Musyi FM & County FM talk shows.",
      "Activate 40 Ward Digital Champions with localized Kikamba infographics."
    ],
    sampleScenario: "A manufactured hashtag alleges Wiper party leadership favors an alternative candidate in Mwingi."
  },
  {
    level: "Level 3",
    title: "Major Crisis, Deepfake & Regulatory Threat",
    badge: "Critical Severity",
    color: "rose",
    slaMinutes: 30,
    slaDisplay: "≤ 30 Minutes",
    triggerDescription: "Fabricated AI audio/video deepfakes, false legal allegations, false IEBC spending ceiling claims, hate speech framing.",
    approvalChain: "Dr. Makali Mulu & Campaign Senior Leadership direct approval.",
    actionProtocol: [
      "Activate 30-minute candidate response video recorded direct-to-camera.",
      "File emergency takedown notices with Meta, TikTok & Google (under Section 16A).",
      "Deploy broadcast rebuttal across all 6 Kamba radio stations.",
      "SMS broadcast to 120k registered voters debunking the synthetic media."
    ],
    sampleScenario: "A viral WhatsApp audio clip falsely synthesizes Dr. Mulu's voice insulting rural livestock farmers."
  }
];

export function CrisisWarRoomMatrix() {
  const [selectedLevelId, setSelectedLevelId] = useState<"Level 1" | "Level 2" | "Level 3">("Level 3");
  const [drillRunning, setDrillRunning] = useState(false);
  const [drillCompleted, setDrillCompleted] = useState(false);

  const currentLevel = CRISIS_LEVELS.find(l => l.level === selectedLevelId) || CRISIS_LEVELS[2];

  const handleSimulateDrill = () => {
    setDrillRunning(true);
    setDrillCompleted(false);
    setTimeout(() => {
      setDrillRunning(false);
      setDrillCompleted(true);
    }, 1200);
  };

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Flame size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Section 13.0 Protocol
              </span>
              <span className="text-[10px] font-mono font-bold text-muted">
                Digital War Room
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Rapid Response & 30-Minute Crisis Escalation Engine
            </h4>
          </div>
        </div>

        {/* 3-Tier SLA Pill */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted">
          <span className="px-2 py-1 bg-paper border border-line rounded-lg text-emerald-600">L1: 4h</span>
          <span className="px-2 py-1 bg-paper border border-line rounded-lg text-amber-600">L2: 2h</span>
          <span className="px-2 py-1 bg-paper border border-line rounded-lg text-rose-600">L3: 30m</span>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="p-3 bg-paper/70 border-b border-line grid grid-cols-1 sm:grid-cols-3 gap-2">
        {CRISIS_LEVELS.map((level) => {
          const isSelected = level.level === selectedLevelId;
          return (
            <button
              key={level.level}
              onClick={() => setSelectedLevelId(level.level)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-card border-accent shadow-sm ring-2 ring-accent/15"
                  : "bg-paper/40 border-line hover:border-accent/40 text-muted hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-mono font-black ${isSelected ? "text-accent" : "text-muted"}`}>
                  {level.level.toUpperCase()}
                </span>
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${
                  level.level === "Level 3"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    : level.level === "Level 2"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                }`}>
                  SLA: {level.slaDisplay}
                </span>
              </div>
              <div className="text-xs font-bold text-ink mt-1.5">
                {level.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Level Details View */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Trigger Banner */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-paper border border-line space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
            <AlertTriangle size={13} className="text-accent" />
            <span>Trigger Scenario & Attack Footprint</span>
          </div>
          <p className="text-xs sm:text-sm text-ink font-medium leading-relaxed">
            {currentLevel.triggerDescription}
          </p>
        </div>

        {/* Approval Chain & Scenario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-card border border-line space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <Clock size={12} className="text-accent" />
              Sign-Off Authority
            </div>
            <p className="text-xs text-ink font-bold">
              {currentLevel.approvalChain}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-line space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <FileText size={12} className="text-accent" />
              Live Simulation Example
            </div>
            <p className="text-xs text-muted font-medium italic">
              &ldquo;{currentLevel.sampleScenario}&rdquo;
            </p>
          </div>
        </div>

        {/* Action Protocol Checklist */}
        <div className="p-3.5 rounded-xl bg-paper border border-line space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1">
            <Layers size={12} />
            Mandatory Rapid Response Action Protocol
          </div>
          <div className="space-y-1.5">
            {currentLevel.actionProtocol.map((act, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-ink font-medium">
                <span className="w-4 h-4 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Red Team Simulation Bar */}
      <div className="p-4 bg-paper/80 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-ink flex items-center gap-1.5">
            <Bot size={14} className="text-accent" />
            <span>Quarterly Red-Team Crisis Simulation Drill</span>
          </div>
          <p className="text-[11px] text-muted">
            Simulate an unannounced deepfake attack to test the 30-minute sign-off clock.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {drillCompleted && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={12} /> Target SLA met: 18m response logged!
            </span>
          )}

          <button
            onClick={handleSimulateDrill}
            disabled={drillRunning}
            className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Clock size={12} />
            <span>{drillRunning ? "Running Simulation..." : "Trigger Red-Team Drill"}</span>
          </button>
        </div>
      </div>

      {/* Footer Rule */}
      <div className="p-3 bg-paper/60 border-t border-line text-[11px] text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <ShieldAlert size={12} className="text-accent" />
          <span>Section 13.7 Red-Team Standard: By Phase 2, 90% of drill responses must beat their severity-level time target.</span>
        </span>
      </div>
    </div>
  );
}
