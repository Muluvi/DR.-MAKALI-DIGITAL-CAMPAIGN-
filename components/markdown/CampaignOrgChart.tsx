"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, UserCheck, ChevronRight, ShieldAlert, Clock, Briefcase, Layers, Sparkles, ArrowRight } from "lucide-react";

interface TeamRole {
  title: string;
  category: "Leadership" | "Core Retained" | "Activated Surge" | "Field Volunteers";
  reportingTo: string;
  keyResponsibilities: string;
  decisionRights: string;
  triggerCondition: string;
}

const CAMPAIGN_ROLES: TeamRole[] = [
  {
    title: "Dr. Makali Mulu & Senior Leadership",
    category: "Leadership",
    reportingTo: "Kitui Electorate",
    keyResponsibilities: "Candidate, overall political vision, final Level 3 crisis approval, manifesto sign-off.",
    decisionRights: "Final approval on candidate statements, coalition pacts, Level 3 crisis releases.",
    triggerCondition: "Permanent throughout campaign cycle."
  },
  {
    title: "Campaign Communications Director (Campaign Counterpart)",
    category: "Leadership",
    reportingTo: "Dr. Makali Mulu",
    keyResponsibilities: "Single named campaign-side counterpart. Liaises directly with Firefly Digital Director.",
    decisionRights: "Approves policy briefs, Level 2 crisis statements (≤2h), weekly content calendars.",
    triggerCondition: "Permanent standing counter-role."
  },
  {
    title: "Digital Director (Firefly Principal)",
    category: "Core Retained",
    reportingTo: "Campaign Communications Director",
    keyResponsibilities: "Owns end-to-end digital strategy, weekly syncs, compliance ledger, Level 1 sign-off.",
    decisionRights: "Approves all published creative, reallocates ad spend within agreed monthly ceilings.",
    triggerCondition: "Retained core from Phase -1 to Phase 3."
  },
  {
    title: "Content & Language Lead",
    category: "Core Retained",
    reportingTo: "Digital Director",
    keyResponsibilities: "Manages publishing across English, Kiswahili, and Kikamba. Oversees tone and narrative consistency.",
    decisionRights: "Approves routine content within approved templates; escalates policy claims.",
    triggerCondition: "Retained core from Phase -1 to Phase 3."
  },
  {
    title: "Paid Media & Analytics Manager",
    category: "Core Retained",
    reportingTo: "Digital Director",
    keyResponsibilities: "Executes ad buying across Meta, Google, TikTok; SMS/USSD dispatch; IEBC compliance ledger.",
    decisionRights: "Adjusts bidding strategies; cannot exceed ward-level budget caps without Director sign-off.",
    triggerCondition: "Retained core from Phase -1 to Phase 3."
  },
  {
    title: "Kikamba Content Producer (Native Speaker)",
    category: "Activated Surge",
    reportingTo: "Content & Language Lead",
    keyResponsibilities: "Voice note scripts, Kikamba proverb verification, audio production, vernacular radio clipping.",
    decisionRights: "Mandatory linguistic gatekeeper: no Kikamba asset publishes without certification.",
    triggerCondition: "Phase -1 onward (Mandatory at all budget tiers)."
  },
  {
    title: "Data Analyst & Modeller",
    category: "Activated Surge",
    reportingTo: "Paid Media & Analytics Manager",
    keyResponsibilities: "Predictive voter scoring, field-digital attribution loop, named Data Governance Owner.",
    decisionRights: "Can suspend targeting if data privacy regulations or consent thresholds are breached.",
    triggerCondition: "Phase 1 onward (Standard & Premium tiers)."
  },
  {
    title: "Crisis Communications Lead",
    category: "Activated Surge",
    reportingTo: "Digital Director",
    keyResponsibilities: "Rapid response war room, quarterly red-team simulation drills, deepfake rebuttal protocol.",
    decisionRights: "Executes 30-minute rapid response workflow during hostile media attacks.",
    triggerCondition: "Phase 2 onward, or immediately on crisis trigger."
  },
  {
    title: "Volunteer & Ward Champion Coordinator",
    category: "Activated Surge",
    reportingTo: "Digital Director",
    keyResponsibilities: "Oversees 4-tier volunteer program, WhatsApp bot leaderboards, field canvass training.",
    decisionRights: "Assigns ground canvass priority routes to verified ward organizers.",
    triggerCondition: "Phase 1 onward (Activated upon volunteer threshold)."
  },
  {
    title: "40 Ward Digital Champions (Grassroots Volunteers)",
    category: "Field Volunteers",
    reportingTo: "Volunteer Coordinator",
    keyResponsibilities: "Hyperlocal content distribution, door-to-door canvassing, logging field outcomes offline.",
    decisionRights: "Grassroots feedback reporters; no authority to publish official statements.",
    triggerCondition: "Recruited across all 40 Kitui wards from Phase 0."
  }
];

export function CampaignOrgChart() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRole, setSelectedRole] = useState<TeamRole>(CAMPAIGN_ROLES[2]);

  const filteredRoles = selectedCategory === "All"
    ? CAMPAIGN_ROLES
    : CAMPAIGN_ROLES.filter(r => r.category === selectedCategory);

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Users size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Section 8A Structure
              </span>
              <span className="text-[10px] font-mono font-bold text-muted">
                Lean Core + Defined Surge
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Campaign Team Org Chart & Decision Rights Matrix
            </h4>
          </div>
        </div>

        {/* Single Counterpart Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-line rounded-xl text-xs font-semibold text-muted">
          <UserCheck size={14} className="text-accent" />
          <span>Single Campaign Counterpart Protocol</span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="p-3 bg-paper/70 border-b border-line flex flex-wrap items-center gap-1.5">
        {["All", "Leadership", "Core Retained", "Activated Surge", "Field Volunteers"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-accent text-white shadow-sm"
                : "bg-card border border-line text-muted hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Two Column Layout: List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-line">
        {/* Role List */}
        <div className="lg:col-span-6 p-4 space-y-2 max-h-[380px] overflow-y-auto scrollbar-thin">
          {filteredRoles.map((role) => {
            const isSelected = selectedRole.title === role.title;
            return (
              <button
                key={role.title}
                onClick={() => setSelectedRole(role)}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-paper border-accent shadow-sm ring-1 ring-accent/20"
                    : "bg-card border-line hover:border-accent/40 text-muted hover:text-ink"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-paper border border-line text-muted">
                      {role.category}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-ink mt-1">
                    {role.title}
                  </div>
                  <div className="text-[10px] text-muted truncate">
                    Reports to: {role.reportingTo}
                  </div>
                </div>

                <ChevronRight size={14} className={isSelected ? "text-accent shrink-0" : "text-muted/40 shrink-0"} />
              </button>
            );
          })}
        </div>

        {/* Selected Role Detail Panel */}
        <div className="lg:col-span-6 p-4 sm:p-6 bg-paper/40 space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
              {selectedRole.category} Role Detail
            </span>
            <h5 className="font-serif text-base sm:text-lg font-bold text-ink mt-1">
              {selectedRole.title}
            </h5>
            <p className="text-xs font-mono text-muted mt-0.5">
              Reporting Line: <strong className="text-ink">{selectedRole.reportingTo}</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-line space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1">
              <Briefcase size={12} className="text-accent" />
              Core Responsibilities
            </div>
            <p className="text-xs text-ink font-medium leading-relaxed">
              {selectedRole.keyResponsibilities}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-line space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1">
              <Sparkles size={12} />
              Decision Rights & Sign-off Limits
            </div>
            <p className="text-xs text-ink font-semibold leading-relaxed">
              {selectedRole.decisionRights}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-paper border border-line text-[11px] text-muted flex items-center gap-2">
            <Clock size={13} className="text-accent shrink-0" />
            <span><strong>Activation Trigger:</strong> {selectedRole.triggerCondition}</span>
          </div>
        </div>
      </div>

      {/* Footer Rule */}
      <div className="p-3 bg-paper/60 border-t border-line text-[11px] text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <ArrowRight size={12} className="text-accent" />
          <span>Operational Efficiency Principle: Defined surge roles prevent standing overhead while ensuring rapid scaling during crisis or GOTV peaks.</span>
        </span>
      </div>
    </div>
  );
}
