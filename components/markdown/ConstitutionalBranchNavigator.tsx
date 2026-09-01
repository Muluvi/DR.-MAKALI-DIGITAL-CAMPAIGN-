"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scale, AlertTriangle, CheckCircle2, ChevronRight, HelpCircle, ArrowRight, ShieldCheck, Building2, Users } from "lucide-react";

export function ConstitutionalBranchNavigator() {
  const [activeBranch, setActiveBranch] = useState<"branchA" | "branchB">("branchA");

  return (
    <div className="my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Scale size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Constitutional Precedent Analysis
              </span>
              <span className="text-[10px] font-mono font-bold text-muted">
                Article 180(7)
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Governor Malombe Eligibility Scenarios
            </h4>
          </div>
        </div>

        {/* Branch Selector Switch */}
        <div className="flex items-center p-1 bg-paper border border-line rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveBranch("branchA")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeBranch === "branchA"
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Scenario A: Disqualified
          </button>
          <button
            onClick={() => setActiveBranch("branchB")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeBranch === "branchB"
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Scenario B: Eligible
          </button>
        </div>
      </div>

      {/* Scenario Context Banner */}
      <div className="p-4 bg-accent/5 border-b border-line text-xs font-medium text-ink flex items-start gap-2.5">
        <HelpCircle size={16} className="text-accent shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Legal Question:</span> Does the 2017–2022 Ngilu interregnum reset or permit a 3rd term under the <em>two-term limit</em> clause of Article 180(7)? Active litigation in High Court.
        </div>
      </div>

      {/* Interactive Scenario Content */}
      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {activeBranch === "branchA" ? (
            <motion.div
              key="branchA"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Supreme Court / High Court Rules Malombe INELIGIBLE (Two-Term Absolute Bar)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Users size={12} className="text-accent" />
                    Wiper Nomination Dynamics
                  </div>
                  <div className="text-xs font-bold text-ink">
                    Open Succession Contest
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Eliminates incumbent executive patronage advantage. Contest simplifies into a direct technocratic choice between Dr. Mulu and Irene Kasalu.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Building2 size={12} className="text-accent" />
                    Kitui Central Anchor
                  </div>
                  <div className="text-xs font-bold text-ink">
                    Malombe Base Fragmentation
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Malombe&apos;s loyalist bloc in Kitui Central and rural wards becomes available. Dr. Mulu becomes the primary home-base consolidation candidate.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-accent" />
                    Strategic Posture
                  </div>
                  <div className="text-xs font-bold text-ink">
                    The Competence Coalition
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Frame Dr. Mulu as the sole contender equipped to steer the KSh 13.79B county resource envelope without political factional instability.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="branchB"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <AlertTriangle size={16} className="shrink-0" />
                <span>Court Rules Interregnum Permits Re-Election (Malombe Contests 2027)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Users size={12} className="text-accent" />
                    Nomination Mechanism
                  </div>
                  <div className="text-xs font-bold text-ink">
                    Three-Way Wiper Primary
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Requires forcing party primaries through scientific polling before mid-November 2026 to prevent consensus nomination of the incumbent.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Building2 size={12} className="text-accent" />
                    Audit & Delivery Wedge
                  </div>
                  <div className="text-xs font-bold text-ink">
                    KSh 2.73B Audit Exposure
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Deploy OAG fiscal audit queries, pending bills (KSh 2.38B), and incomplete health facilities as empirical proof of executive mismanagement.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-accent" />
                    Strategic Posture
                  </div>
                  <div className="text-xs font-bold text-ink">
                    The Generational Shift
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Position Dr. Mulu as the modern, data-driven alternative to an exhausted 10-year political establishment.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Strategic Rule Footer */}
      <div className="p-3 bg-paper/60 border-t border-line text-[11px] text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <ArrowRight size={12} className="text-accent" />
          <span>Strategic Command Rule: Campaign operations must prepare simultaneously for both branches.</span>
        </span>
      </div>
    </div>
  );
}
