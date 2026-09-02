"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Clock, AlertTriangle, Search, Smartphone, Send, FileText, Activity, ShieldCheck, Layers, MapPin, ChevronRight, Filter, Info } from "lucide-react";

interface ServiceReport {
  refNumber: string;
  ward: string;
  constituency: string;
  category: "Water Infrastructure" | "Feeder Roads" | "Health Clinic" | "Market Sanitation";
  issue: string;
  channel: "USSD" | "SMS" | "WhatsApp" | "Ward Champion";
  status: "Under Verification" | "Raised with County" | "Resolved / Audited" | "Escalated";
  date: string;
  outcomeNote: string;
}

const SAMPLE_REPORTS: ServiceReport[] = [
  {
    refNumber: "KT-SAMPLE-A",
    ward: "Kyuso",
    constituency: "Mwingi North",
    category: "Water Infrastructure",
    issue: "Kyuso Solar-powered borehole pump failed; 1,200 households walking 8km to Tana River basin.",
    channel: "USSD",
    status: "Raised with County",
    date: "28 Aug 2026",
    outcomeNote: "Formal query submitted to County Water Chief Officer; Ward Coordinator verifying solar inverter warranty."
  },
  {
    refNumber: "KT-SAMPLE-B",
    ward: "Mutomo",
    constituency: "Kitui South",
    category: "Health Clinic",
    issue: "Mutomo Sub-County Hospital maternity wing lacks standby generator during frequent grid blackouts.",
    channel: "SMS",
    status: "Escalated",
    date: "25 Aug 2026",
    outcomeNote: "Dr. Mulu raised on parliamentary committee record regarding unspent county emergency health reserves."
  },
  {
    refNumber: "KT-SAMPLE-C",
    ward: "Township",
    constituency: "Kitui Central",
    category: "Market Sanitation",
    issue: "Kalundu Market solid waste accumulation blocking drainage channels before onset of short rains.",
    channel: "WhatsApp",
    status: "Resolved / Audited",
    date: "19 Aug 2026",
    outcomeNote: "Municipal cleanup completed following public petition; audited by volunteer youth champions."
  },
  {
    refNumber: "KT-SAMPLE-D",
    ward: "Waita",
    constituency: "Mwingi Central",
    category: "Feeder Roads",
    issue: "Waita-Kavuvwani culvert washed away during March 2026 floods; agricultural produce trucks cut off.",
    channel: "Ward Champion",
    status: "Under Verification",
    date: "14 Aug 2026",
    outcomeNote: "GPS coordinates and photo verification logged into citizen evidence register."
  }
];

export function PublicServiceDeliveryTracker() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isSimulatingSubmission, setIsSimulatingSubmission] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState("KT-SAMPLE-E");
  const [wardInput, setWardInput] = useState("Mwingi Central");
  const [issueInput, setIssueInput] = useState("");

  const filteredReports = selectedCategory === "All"
    ? SAMPLE_REPORTS
    : SAMPLE_REPORTS.filter(r => r.category === selectedCategory);

  const handleSubmitSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueInput.trim()) return;
    setIsSimulatingSubmission(true);
    const newRef = `KT-2026-0${Math.floor(Math.random() * 800) + 100}`;
    setGeneratedRef(newRef);
    setTimeout(() => {
      setIsSimulatingSubmission(false);
      setSubmissionSuccess(true);
      setTimeout(() => setSubmissionSuccess(false), 5000);
      setIssueInput("");
    }, 1000);
  };

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Section 19B M&E Tool
              </span>
              <span className="t-label font-mono font-bold text-muted">
                Public Register
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-0.5">
              Public Service-Delivery & Promise Tracker
            </h4>
          </div>
        </div>

        {/* Intake channels. Shortcodes are vendor allocations pending at Phase 0 (Appendix A). */}
        <div className="flex flex-wrap items-center gap-1.5 t-label font-mono font-bold text-muted">
          <span className="px-2 py-1 bg-paper border border-line rounded-lg">USSD &mdash; code pending</span>
          <span className="px-2 py-1 bg-paper border border-line rounded-lg">SMS &mdash; shortcode pending</span>
          <span className="px-2 py-1 bg-paper border border-line rounded-lg">WhatsApp</span>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-gold/[0.06] border-b border-gold/25 flex items-start gap-2">
        <Info size={13} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
        <p className="t-small text-ink leading-relaxed">
          <strong>Interface preview.</strong> The tracker described in §19B has not been built &mdash; §19B.6 sets out
          its build and cost. Every entry below is illustrative, written to show the intake format and the
          verification protocol. No citizen report has been received and no query has been raised with the county.
        </p>
      </div>

      {/* 5-Step M&E Pipeline Visualizer (Replacing raw ASCII tree) */}
      <div className="p-4 bg-paper/70 border-b border-line">
        <div className="t-label font-black uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
          <Layers size={12} className="text-accent" />
          <span>The 5-Stage Verification Protocol</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          <div className="p-2 bg-card rounded-lg border border-line">
            <div className="t-label font-mono font-bold text-accent">1. INTAKE</div>
            <div className="t-small font-bold text-ink truncate mt-0.5">USSD / SMS / Baraza</div>
          </div>
          <div className="p-2 bg-card rounded-lg border border-line">
            <div className="t-label font-mono font-bold text-accent">2. LOGGING</div>
            <div className="t-small font-bold text-ink truncate mt-0.5">Auto Reference ID</div>
          </div>
          <div className="p-2 bg-card rounded-lg border border-line">
            <div className="t-label font-mono font-bold text-accent">3. AUDIT</div>
            <div className="t-small font-bold text-ink truncate mt-0.5">Ward Field Check</div>
          </div>
          <div className="p-2 bg-card rounded-lg border border-line">
            <div className="t-label font-mono font-bold text-accent">4. ESCALATION</div>
            <div className="t-small font-bold text-ink truncate mt-0.5">County / Assembly</div>
          </div>
          <div className="p-2 bg-accent/10 rounded-lg border border-accent/20 col-span-2 sm:col-span-1">
            <div className="t-label font-mono font-bold text-accent">5. OUTCOME</div>
            <div className="t-small font-bold text-accent truncate mt-0.5">SMS Notification</div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="p-3 bg-card border-b border-line flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {["All", "Water Infrastructure", "Feeder Roads", "Health Clinic", "Market Sanitation"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-accent text-white shadow-sm"
                : "bg-paper border border-line text-muted hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reports Feed */}
      <div className="p-4 sm:p-6 space-y-3">
        {filteredReports.map((report) => (
          <div key={report.refNumber} className="p-3.5 sm:p-4 bg-paper rounded-xl border border-line space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-accent bg-card px-2 py-0.5 rounded border border-line">
                  {report.refNumber}
                </span>
                <span className="text-xs font-bold text-ink">{report.ward} Ward</span>
                <span className="t-label text-muted font-medium">({report.constituency})</span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="t-label font-mono text-muted">{report.date}</span>
                <span className={`t-label font-bold px-2 py-0.5 rounded-full border ${
                  report.status === "Resolved / Audited"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : report.status === "Escalated"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-card text-muted border-line"
                }`}>
                  {report.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-ink font-medium leading-relaxed">
              {report.issue}
            </p>

            <div className="pt-1.5 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 t-small">
              <span className="text-muted">
                <strong className="text-ink">M&E Verification Note:</strong> {report.outcomeNote}
              </span>
              <span className="t-label font-mono text-muted shrink-0">
                Via {report.channel}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Simulation Form */}
      <div className="p-4 bg-paper/80 border-t border-line">
        <div className="text-xs font-bold text-ink mb-2 flex items-center gap-1.5">
          <Smartphone size={14} className="text-accent" />
          <span>Simulate Ward Issue Submission (Web / USSD Bridge)</span>
        </div>

        <form onSubmit={handleSubmitSim} className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={wardInput}
              onChange={(e) => setWardInput(e.target.value)}
              className="p-2 bg-card border border-line rounded-lg text-xs font-semibold text-ink"
            >
              <option value="Mwingi Central">Mwingi Central Ward</option>
              <option value="Mutomo">Mutomo Ward</option>
              <option value="Kitui Township">Kitui Township Ward</option>
              <option value="Kyuso">Kyuso Ward</option>
              <option value="Ikutha">Ikutha Ward</option>
            </select>

            <input
              type="text"
              placeholder="e.g. Broken solar borehole pump at Kavuvwani market"
              value={issueInput}
              onChange={(e) => setIssueInput(e.target.value)}
              className="sm:col-span-2 p-2 bg-card border border-line rounded-lg text-xs text-ink placeholder:text-muted"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="t-label text-muted">
              {submissionSuccess && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Logged as #{generatedRef} & SMS notification simulated!
                </span>
              )}
            </span>

            <button
              type="submit"
              disabled={isSimulatingSubmission || !issueInput.trim()}
              className="px-4 py-1.5 rounded-lg bg-accent text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Send size={12} />
              <span>{isSimulatingSubmission ? "Logging to Register..." : "Submit Test Report"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer Rule */}
      <div className="p-3 bg-paper/60 border-t border-line t-small text-muted flex items-center justify-between px-4 font-semibold">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-accent" />
          <span>Governance Commitment: The public delivery tracker continues post-election as the official County Citizen Oversight Portal.</span>
        </span>
      </div>
    </div>
  );
}
