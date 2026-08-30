"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Search, 
  ChevronRight, 
  FileText, 
  Target, 
  Activity, 
  FileKey,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";
import type { TabId } from "../lib/heading-slug";

interface SectionItem {
  id: string;
  number: string;
  title: string;
  tabId: TabId;
  tabLabel: string;
  badge?: string;
}

const ALL_SECTIONS: SectionItem[] = [
  // Part 1: Executive Summary
  { id: "exec-sec-1", number: "1.0", title: "Executive Summary: Context & Challenge", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-1-1", number: "1.1", title: "The Polling Reality & Nomination Mechanism", tabId: "exec", tabLabel: "Executive Summary", badge: "Baseline Polling" },
  { id: "exec-sec-1-2", number: "1.2", title: "The Core Thesis: The Economist Governor", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-1-3", number: "1.3", title: "Three Governing Realities (Offline Majority)", tabId: "exec", tabLabel: "Executive Summary", badge: "86.4% Offline" },
  { id: "exec-sec-1-4", number: "1.4", title: "Strategic Objectives", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2", number: "2.0", title: "Voter Calculus & Winning Coalition", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2-1", number: "2.1", title: "The Kitui Electoral Map (8 Constituencies)", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2-2", number: "2.2", title: "Nomination Strategy (Primary vs General)", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2-3", number: "2.3", title: "The 200,000 Vote Target & Deficit", tabId: "exec", tabLabel: "Executive Summary", badge: "200k Target" },
  { id: "exec-sec-2-4", number: "2.4", title: "County Revenue & Resource Realities (KSh13.79bn)", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2-5", number: "2.5", title: "Demographics & Connectivity (KNBS 2019)", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2-6", number: "2.6", title: "Historical Electoral Precedent (2013–2022)", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2-7", number: "2.7", title: "Fiscal Governance & Audit Queries (KSh2.38bn)", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2-8", number: "2.8", title: "Drought & Climate Vulnerability (11 Sub-Counties)", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2-9", number: "2.9", title: "Mui Basin Coal Concession (Blocks A–D)", tabId: "exec", tabLabel: "Executive Summary" },
  { id: "exec-sec-2-10", number: "2.10", title: "Competitor Field Analysis (Kasalu & Malombe)", tabId: "exec", tabLabel: "Executive Summary" },

  // Part 2: Strategy & Targeting
  { id: "strategy-sec-3", number: "3.0", title: "Brand Positioning & Value Proposition", tabId: "strategy", tabLabel: "Strategy & Targeting" },
  { id: "strategy-sec-4", number: "4.0", title: "The Economic Argument & Fiscal Discipline", tabId: "strategy", tabLabel: "Strategy & Targeting" },
  { id: "strategy-sec-5", number: "5.0", title: "Coalition Architecture & Regional Blocs", tabId: "strategy", tabLabel: "Strategy & Targeting" },
  { id: "strategy-sec-6", number: "6.0", title: "Ward-by-Ward Targeting (40 Wards)", tabId: "strategy", tabLabel: "Strategy & Targeting", badge: "40 Wards" },
  { id: "strategy-sec-7", number: "7.0", title: "Audience Segmentation (6 Demographic Cohorts)", tabId: "strategy", tabLabel: "Strategy & Targeting", badge: "6 Segments" },

  // Part 3: Operations & Architecture
  { id: "operations-sec-8", number: "8.0", title: "Campaign Finance & Compliance (ECFA 2013)", tabId: "operations", tabLabel: "Operations & Architecture", badge: "KSh187m Cap" },
  { id: "operations-sec-9", number: "9.0", title: "Communications Channel Architecture", tabId: "operations", tabLabel: "Operations & Architecture" },
  { id: "operations-sec-9a", number: "9A", title: "Digital Advertising & Social Media", tabId: "operations", tabLabel: "Operations & Architecture" },
  { id: "operations-sec-9b", number: "9B", title: "Low-Connectivity Layer (SMS & USSD Engine)", tabId: "operations", tabLabel: "Operations & Architecture", badge: "SMS + USSD" },
  { id: "operations-sec-9c", number: "9C", title: "Kikamba Vernacular Radio (Musyi, Sang'u, Mbaitu)", tabId: "operations", tabLabel: "Operations & Architecture", badge: "Radio Grid" },
  { id: "operations-sec-10", number: "10.0", title: "Ground-to-Digital Operations & Field Agents", tabId: "operations", tabLabel: "Operations & Architecture" },
  { id: "operations-sec-11", number: "11.0", title: "Campaign Technology Stack & Infrastructure", tabId: "operations", tabLabel: "Operations & Architecture" },

  // Part 4: Tactics & Themes
  { id: "tactics-sec-12", number: "12.0", title: "Narrative Strategy: The Economist Governor", tabId: "tactics", tabLabel: "Tactics & Themes" },
  { id: "tactics-sec-13", number: "13.0", title: "Contrast Strategy (Track Record vs Rhetoric)", tabId: "tactics", tabLabel: "Tactics & Themes" },
  { id: "tactics-sec-14", number: "14.0", title: "Response Protocols & Message Matrix", tabId: "tactics", tabLabel: "Tactics & Themes" },
  { id: "tactics-sec-15", number: "15.0", title: "Rapid Response & Counter-Disinformation", tabId: "tactics", tabLabel: "Tactics & Themes" },

  // Part 5: Implementation & KPIs
  { id: "execution-sec-16", number: "16.0", title: "Data Protection Act 2019 Compliance Matrix", tabId: "execution", tabLabel: "Implementation & KPIs", badge: "DPA 2019" },
  { id: "execution-sec-17", number: "17.0", title: "Campaign Calendar & Phasing (Phases -1 to 3)", tabId: "execution", tabLabel: "Implementation & KPIs" },
  { id: "execution-sec-18", number: "18.0", title: "Resource Allocation Matrix (Tiered Budgets)", tabId: "execution", tabLabel: "Implementation & KPIs" },
  { id: "execution-sec-19", number: "19.0", title: "Risk Register & Mitigation Protocols", tabId: "execution", tabLabel: "Implementation & KPIs" },
  { id: "execution-sec-20", number: "20.0", title: "Phase-by-Phase KPIs & Governance", tabId: "execution", tabLabel: "Implementation & KPIs", badge: "Phase KPIs" },

  // Part 6: Appendix
  { id: "appendix-sec-a1", number: "A1", title: "Appendix A1: Statutory Authority Citations", tabId: "appendix", tabLabel: "Appendix" },
  { id: "appendix-sec-a2", number: "A2", title: "Appendix A2: Polling Methodology & Mizani Africa", tabId: "appendix", tabLabel: "Appendix" },
  { id: "appendix-sec-a3", number: "A3", title: "Appendix A3: Kitui County 40-Ward Complete Register", tabId: "appendix", tabLabel: "Appendix", badge: "IEBC Data" },
  { id: "appendix-sec-a4", number: "A4", title: "Appendix A4: Kikamba Vernacular Radio Landscape", tabId: "appendix", tabLabel: "Appendix" },
  { id: "appendix-sec-b", number: "B", title: "Appendix B: Campaign Readiness Checklist", tabId: "appendix", tabLabel: "Appendix" },
  { id: "appendix-sec-c", number: "C", title: "Appendix C: Data Gaps Register", tabId: "appendix", tabLabel: "Appendix" }
];

const TAB_ICONS: Record<TabId, React.ComponentType<{ size?: number; className?: string }>> = {
  exec: FileText,
  strategy: Target,
  operations: Activity,
  tactics: Activity,
  execution: Activity,
  appendix: FileKey,
};

interface MobileTOCModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectSection: (sectionId: string, tabId: TabId) => void;
}

export function MobileTOCModal({
  isOpen,
  onClose,
  activeTab,
  onSelectSection
}: MobileTOCModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTabFilter, setSelectedTabFilter] = useState<TabId | "all">("all");

  const filteredSections = useMemo(() => {
    return ALL_SECTIONS.filter((item) => {
      const matchesTab = selectedTabFilter === "all" || item.tabId === selectedTabFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTab;
      const matchesQuery = 
        item.number.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.tabLabel.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q));
      return matchesTab && matchesQuery;
    });
  }, [searchQuery, selectedTabFilter]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center print:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/70 backdrop-blur-md"
        />

        {/* Sheet / Modal Container */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-xl max-h-[85vh] sm:max-h-[80vh] bg-card border-t sm:border border-line rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Grab Handle on Mobile */}
          <div className="sm:hidden pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-line/80 rounded-full" />
          </div>

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink leading-none">
                  Document Table of Contents
                </h3>
                <p className="text-[11px] text-muted font-medium mt-1">
                  20 Strategic Sections · 6 Major Architecture Parts
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-paper border border-line text-muted hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 sm:p-4 bg-paper/50 border-b border-line space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search sections (e.g., 200k, Radio, 40 Wards, DPA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-line rounded-xl text-xs font-semibold text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted hover:text-ink px-1.5 py-0.5 bg-paper rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
              <button
                onClick={() => setSelectedTabFilter("all")}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedTabFilter === "all"
                    ? "bg-accent text-white border-accent"
                    : "bg-card text-muted border-line hover:text-ink"
                }`}
              >
                All (26)
              </button>
              {(["exec", "strategy", "operations", "tactics", "execution", "appendix"] as const).map((tab) => {
                const labelMap = {
                  exec: "1. Exec",
                  strategy: "2. Strategy",
                  operations: "3. Ops",
                  tactics: "4. Tactics",
                  execution: "5. Execution",
                  appendix: "6. Appendix"
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedTabFilter(tab)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border cursor-pointer ${
                      selectedTabFilter === tab
                        ? "bg-accent text-white border-accent"
                        : "bg-card text-muted border-line hover:text-ink"
                    }`}
                  >
                    {labelMap[tab]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-line/40">
            {filteredSections.length > 0 ? (
              filteredSections.map((item) => {
                const Icon = TAB_ICONS[item.tabId] || FileText;
                const isCurrentTab = activeTab === item.tabId;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectSection(item.id, item.tabId);
                      onClose();
                    }}
                    className="w-full py-3 px-2.5 flex items-center justify-between text-left hover:bg-paper/70 rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-paper border border-line flex items-center justify-center shrink-0 mt-0.5 text-accent group-hover:border-accent/40 transition-colors">
                        <span className="font-mono text-[10px] font-black">{item.number}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-ink group-hover:text-accent transition-colors truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="shrink-0 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted">
                          <span className="capitalize font-semibold">{item.tabLabel}</span>
                          {isCurrentTab && (
                            <span className="text-accent font-bold">· (Active Part)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-paper border border-line flex items-center justify-center shrink-0 text-muted group-hover:text-accent group-hover:border-accent/50 transition-colors">
                      <ChevronRight size={14} />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-muted space-y-2">
                <p className="font-bold text-ink">No matching sections found</p>
                <p>Try searching by keyword like &quot;Ward&quot;, &quot;Radio&quot;, &quot;Nomination&quot;, or &quot;Budget&quot;.</p>
              </div>
            )}
          </div>

          {/* Footer Quick Info */}
          <div className="p-3 bg-paper/60 border-t border-line flex items-center justify-between text-[11px] text-muted px-4 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-accent" />
              <span>Tap any section to jump instantly</span>
            </span>
            <button
              onClick={onClose}
              className="text-accent font-bold hover:underline"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
