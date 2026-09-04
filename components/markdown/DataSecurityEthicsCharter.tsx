"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Lock, EyeOff, Database, FileCode2, AlertTriangle, CheckSquare, ArrowRight, FileCheck2, Scale } from "lucide-react";

interface EthicalCommitment {
  id: string;
  category: "Consent & Messaging" | "Data Storage & Privacy" | "AI & Synthetic Media" | "Campaign Finance";
  ruleName: string;
  statutoryBasis: string;
  campaignStandard: string;
  penaltyForBreach: string;
  isComplianceGated: boolean;
}

const ETHICAL_COMMITMENTS: EthicalCommitment[] = [
  {
    id: "eth-1",
    category: "Consent & Messaging",
    ruleName: "Zero Purchased Number Databases (Opt-In Only)",
    statutoryBasis: "Data Protection Act 2019 & CA Political Messaging Code",
    campaignStandard: "Strictly 100% first-party opt-in via USSD self-registration, baraza signup sheets, WhatsApp confirmation, or website forms. Zero purchased numbers.",
    penaltyForBreach: "ODPC regulatory fine up to KSh 5M + immediate disqualification of offending vendor.",
    isComplianceGated: true
  },
  {
    id: "eth-2",
    category: "Consent & Messaging",
    ruleName: "One-Touch Unconditional Opt-Out",
    statutoryBasis: "DPA 2019 Right to Object & DND Regulations",
    campaignStandard: "Every bulk SMS carries an immediate opt-out keyword. The shortcode is a vendor allocation pending at Phase 0 (Appendix A), so the footer reads 'STOP to <shortcode>' until it is issued. Opt-outs are processed automatically across all campaign lists.",
    penaltyForBreach: "Immediate permanent suppression of number across all databases.",
    isComplianceGated: false
  },
  {
    id: "eth-3",
    category: "Data Storage & Privacy",
    ruleName: "§6.5.5 compliance gate on voter-file processing",
    statutoryBasis: "ODPC Voter Register Guidance 2026",
    campaignStandard: "No voter-file predictive modeling is deployed until independent Kenyan legal counsel certifies lawful basis. Operates on aggregate ward statistics as fallback.",
    penaltyForBreach: "Model frozen automatically by Data Governance Owner without commercial sign-off.",
    isComplianceGated: true
  },
  {
    id: "eth-4",
    category: "AI & Synthetic Media",
    ruleName: "Zero Synthetic Impersonation & Deepfake Prohibition",
    statutoryBasis: "National Cohesion & Integration Act + NCIC Guidelines",
    campaignStandard: "AI assists copy drafting and variation testing only. The campaign will never synthesize opponent voices, fabricate events, or generate deceptive visual deepfakes.",
    penaltyForBreach: "Zero tolerance; immediate contract termination for creative team members.",
    isComplianceGated: false
  },
  {
    id: "eth-5",
    category: "Campaign Finance",
    ruleName: "20% Single-Source Contribution Ceiling",
    statutoryBasis: "IEBC Gazette Notice No. 12251 (7 Aug 2026)",
    campaignStandard: "No single donor may contribute more than KSh 19.51M (20% of the KSh 97.56M county ceiling). All donations audited and logged to the compliance ledger.",
    penaltyForBreach: "Fine up to KSh 2M, imprisonment up to 5 years, or campaign disqualification.",
    isComplianceGated: true
  },
  {
    id: "eth-6",
    category: "Data Storage & Privacy",
    ruleName: "Post-Election Data Deletion Schedule",
    statutoryBasis: "DPA 2019 Storage Limitation Principle",
    campaignStandard: "All personal voter telephone numbers, canvass forms, and interaction records are permanently purged 30 days after gazettement of final election results.",
    penaltyForBreach: "Cryptographic proof of database destruction published on campaign portal.",
    isComplianceGated: false
  }
];

export function DataSecurityEthicsCharter() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>({
    "eth-1": true,
    "eth-2": true,
    "eth-3": true,
    "eth-4": true,
    "eth-5": true,
    "eth-6": true
  });

  const filteredRules = selectedFilter === "All"
    ? ETHICAL_COMMITMENTS
    : ETHICAL_COMMITMENTS.filter(r => r.category === selectedFilter);

  const toggleCheck = (id: string) => {
    setCheckedRules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Ethics and data charter
              </span>
              <span className="t-label font-mono font-bold text-muted">
                DPA 2019 & IEBC Compliance
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Digital Ethics, Data Privacy & Regulatory Compliance Charter
            </h4>
          </div>
        </div>

        {/* ODPC Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>ODPC & IEBC Pre-Audited Standards</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 bg-paper/70 border-b border-line flex flex-wrap items-center gap-1.5">
        {["All", "Consent & Messaging", "Data Storage & Privacy", "AI & Synthetic Media", "Campaign Finance"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === cat
                ? "bg-accent text-white shadow-sm"
                : "bg-card border border-line text-muted hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rules Table */}
      <div className="p-4 sm:p-6 space-y-3">
        {filteredRules.map((rule) => {
          const isChecked = !!checkedRules[rule.id];
          return (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all ${
                isChecked ? "bg-paper/80 border-line" : "bg-card border-line/40 opacity-70"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleCheck(rule.id)}
                    className="w-6 h-6 rounded-lg bg-card border border-line flex items-center justify-center text-accent hover:border-accent cursor-pointer shrink-0"
                  >
                    {isChecked && <CheckSquare size={16} className="text-accent" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-ink">{rule.ruleName}</h5>
                      {rule.isComplianceGated && (
                        <span className="t-micro font-black uppercase px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                          Compliance Gate
                        </span>
                      )}
                    </div>
                    <div className="t-small font-mono text-muted mt-0.5">
                      Statutory Basis: {rule.statutoryBasis}
                    </div>
                  </div>
                </div>

                <div className="self-start sm:self-auto">
                  <span className="t-label font-mono font-bold px-2 py-0.5 rounded bg-card border border-line text-muted">
                    {rule.category}
                  </span>
                </div>
              </div>

              <p className="text-xs text-ink font-medium mt-2.5 leading-relaxed">
                {rule.campaignStandard}
              </p>

              <div className="mt-2.5 pt-2 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 t-small">
                <span className="text-muted">
                  <strong className="text-rose-600 dark:text-rose-400">Statutory Exposure / Penalty:</strong> {rule.penaltyForBreach}
                </span>
                <span className="t-label font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> Active Campaign Standard
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Rule */}
      <div className="p-3 bg-paper/60 border-t border-line t-small text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <Scale size={12} className="text-accent" />
          <span>Legal Doctrine: High ethical standards protect Dr. Mulu&apos;s brand as a disciplined economist while eliminating regulatory liability under the ODPC and IEBC.</span>
        </span>
      </div>
    </div>
  );
}
