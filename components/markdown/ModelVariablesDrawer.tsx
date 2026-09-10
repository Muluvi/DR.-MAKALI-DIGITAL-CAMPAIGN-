"use client";

import React, { useState, useMemo } from "react";
import { Search, Database, Tag, ShieldCheck, FileText, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface ModelVariable {
  variable: string;
  description: string;
  source: string;
  type: "String" | "Categorical" | "Binary" | "Continuous";
  format: string;
  highlight?: boolean;
}

const MODEL_VARIABLES: ModelVariable[] = [
  { variable: "voter_id", description: "Unique identifier (hashed)", source: "IEBC register", type: "String", format: "Alphanumeric" },
  { variable: "gender", description: "Voter gender", source: "IEBC register", type: "Categorical", format: "M/F" },
  { variable: "age_bracket", description: "Age grouping", source: "IEBC register", type: "Categorical", format: "18–24, 25–34, …" },
  { variable: "ward_code", description: "Electoral ward", source: "IEBC register", type: "String", format: "3-digit" },
  { variable: "constituency", description: "Constituency", source: "IEBC register", type: "Categorical", format: "8 values" },
  { variable: "subcounty", description: "Sub-county", source: "Census", type: "Categorical", format: "18 values" },
  { variable: "polling_station", description: "Station identifier", source: "IEBC register", type: "String", format: "Unique code" },
  { variable: "turnout_2017", description: "Turned out 2017", source: "IEBC results", type: "Binary", format: "0/1" },
  { variable: "turnout_2022", description: "Turned out 2022", source: "IEBC results", type: "Binary", format: "0/1" },
  { variable: "ward_poverty_rate", description: "Ward poverty headcount", source: "KNBS", type: "Continuous", format: "0–100" },
  { variable: "ward_literacy_rate", description: "Adult literacy", source: "KNBS", type: "Continuous", format: "0–100" },
  { variable: "ward_water_access", description: "% households, improved water", source: "KNBS", type: "Continuous", format: "0–100" },
  { variable: "ward_connectivity_index", description: "Internet/mobile use proxy — drives channel selection", source: "KNBS/CA", type: "Continuous", format: "0–100", highlight: true },
  { variable: "population_density", description: "Persons per km²", source: "Census", type: "Continuous", format: "9–251" },
  { variable: "household_size", description: "Average household size", source: "Census", type: "Continuous", format: "3.6–4.9" },
  { variable: "digital_engagement_score", description: "Composite of interactions", source: "Campaign (consented)", type: "Continuous", format: "0–100" },
  { variable: "sms_optin_status", description: "Consented to SMS contact", source: "Campaign", type: "Binary", format: "0/1", highlight: true },
  { variable: "whatsapp_group_member", description: "Campaign group member", source: "Campaign", type: "Binary", format: "0/1" },
  { variable: "volunteer_status", description: "Sign-up status", source: "Campaign", type: "Categorical", format: "None/Inactive/Active" },
  { variable: "donor_status", description: "Donation history", source: "Campaign", type: "Categorical", format: "None/One-time/Recurring" },
  { variable: "field_contact_outcome", description: "Canvass result (Section 4.2)", source: "Field team", type: "Categorical", format: "Support/Undecided/Oppose/No contact", highlight: true },
  { variable: "support_score", description: "Predicted support (output)", source: "Model", type: "Continuous", format: "0–1" },
  { variable: "turnout_score", description: "Predicted turnout (output)", source: "Model", type: "Continuous", format: "0–1" },
];

const SOURCES = ["All", "IEBC register", "Census", "KNBS", "Campaign", "Field team", "Model"] as const;
const TYPES = ["All", "Continuous", "Binary", "Categorical", "String"] as const;

export default function ModelVariablesDrawer() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [expandedVar, setExpandedVar] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MODEL_VARIABLES.filter((item) => {
      if (sourceFilter !== "All") {
        if (sourceFilter === "KNBS" && !item.source.startsWith("KNBS")) return false;
        if (sourceFilter === "Campaign" && !item.source.startsWith("Campaign")) return false;
        if (sourceFilter === "IEBC register" && !item.source.startsWith("IEBC")) return false;
        if (sourceFilter !== "KNBS" && sourceFilter !== "Campaign" && sourceFilter !== "IEBC register" && item.source !== sourceFilter) return false;
      }
      if (typeFilter !== "All" && item.type !== typeFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.variable.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.format.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, sourceFilter, typeFilter]);

  return (
    <div className="border border-line/70 rounded-2xl bg-card/60 overflow-hidden my-6 shadow-sm not-prose">
      {/* Header */}
      <div className="p-3.5 sm:p-4 bg-paper/60 border-b border-line/60">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 text-accent shrink-0">
              <Database size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-serif text-sm sm:text-base font-bold text-ink">
                  Model Variables Dictionary (§6.2.4)
                </h4>
                <span className="t-micro font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                  23 Verified Features
                </span>
              </div>
              <p className="t-label text-muted mt-0.5">
                Targeting and prediction feature dictionary. No psychographic, ethnic, or religious variables permitted.
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Pill Banner */}
        <div className="mt-3 px-3 py-2 rounded-xl bg-accent/[0.04] border border-accent/20 flex items-center gap-2 text-ink t-label">
          <ShieldCheck size={14} className="text-accent shrink-0" />
          <span>
            Strict compliance gate: <strong className="font-bold">Zero non-consented psychographic attributes</strong>. All features auditable under DPA 2019.
          </span>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search variable, description, source..."
            className="w-full pl-8 pr-3 py-2 bg-card border border-line rounded-xl t-small text-ink placeholder:text-muted focus:outline-none focus:border-accent min-h-[44px]"
            aria-label="Search model variables"
          />
        </div>

        {/* Source & Type Filter Chips */}
        <div className="mt-3 space-y-2">
          {/* Source filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="t-micro font-bold text-muted shrink-0 mr-1">
              Source:
            </span>
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={`px-2.5 py-1 rounded-lg t-micro font-bold transition-all shrink-0 cursor-pointer min-h-[32px] ${
 sourceFilter === s
                    ? "bg-accent-solid text-on-accent shadow-xs"
                    : "bg-card border border-line/60 text-muted hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="t-micro font-bold text-muted shrink-0 mr-1">
              Type:
            </span>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg t-micro font-bold transition-all shrink-0 cursor-pointer min-h-[32px] ${
 typeFilter === t
                    ? "bg-gold text-ink shadow-xs"
                    : "bg-card border border-line/60 text-muted hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dictionary Items List */}
      <div className="divide-y divide-line/40 p-2 sm:p-3 max-h-[600px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center t-label text-muted">
            No variables match current search or filters.
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedVar === item.variable;
            return (
              <div
                key={item.variable}
                onClick={() => setExpandedVar(isExpanded ? null : item.variable)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
 item.highlight
                    ? "bg-accent/[0.04] border border-accent/30 my-1.5"
                    : "hover:bg-line/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                    <code className="font-mono font-bold text-accent t-small bg-card px-1.5 py-0.5 rounded border border-line/50">
                      {item.variable}
                    </code>
                    <span className="t-micro font-semibold px-2 py-0.5 rounded-full bg-paper border border-line/50 text-muted">
                      {item.type}
                    </span>
                    <span className="t-micro font-medium text-muted">
                      via {item.source}
                    </span>
                    {item.highlight && (
                      <span className="t-micro font-black px-1.5 py-0.2 bg-gold/15 text-gold-dark rounded">
                        Key Driver
                      </span>
                    )}
                  </div>
                  <div className="shrink-0 text-muted mt-0.5">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>

                <p className="t-small text-ink mt-1.5 leading-snug">
                  {item.description}
                </p>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-line/40 grid grid-cols-1 sm:grid-cols-3 gap-2 t-label">
                    <div className="bg-paper/70 p-2 rounded-lg border border-line/40">
                      <span className="t-micro font-bold text-muted block">Format</span>
                      <span className="font-mono text-ink font-semibold">{item.format}</span>
                    </div>
                    <div className="bg-paper/70 p-2 rounded-lg border border-line/40">
                      <span className="t-micro font-bold text-muted block">Source Entity</span>
                      <span className="text-ink font-semibold">{item.source}</span>
                    </div>
                    <div className="bg-paper/70 p-2 rounded-lg border border-line/40">
                      <span className="t-micro font-bold text-muted block">Targeting Utility</span>
                      <span className="text-accent font-semibold">
                        {item.variable === "ward_connectivity_index"
                          ? "Online vs SMS/USSD router"
                          : item.variable === "sms_optin_status"
                          ? "Consent-verified broadcasts"
                          : item.variable.includes("score")
                          ? "Predictive model output"
                          : "Electoral profile segmentation"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer info strip */}
      <div className="px-3.5 py-2.5 bg-paper/50 border-t border-line/60 flex items-center justify-between text-muted t-micro">
        <span>Showing {filtered.length} of 23 variables</span>
        <span className="font-mono">Section 6.2.4 Tech Spec</span>
      </div>
    </div>
  );
}
