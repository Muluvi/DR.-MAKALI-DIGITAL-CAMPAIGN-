"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, ChevronRight, Layers, Sparkles, Compass, Map, MessageSquare, Megaphone, Users, Shield, Database, Target, Gauge, HandCoins } from "lucide-react";
import { SECTIONS, type TabId } from "../lib/heading-slug";
import type { SectionItem } from "../lib/section-index";

const TAB_ICONS: Record<TabId, React.ComponentType<{ size?: number; className?: string }>> = {
  overview: Compass,
  race: Map,
  argument: MessageSquare,
  channels: Megaphone,
  ground: Users,
  defence: Shield,
  data: Database,
  team: Target,
  measure: Gauge,
  ask: HandCoins,
};

interface MobileTOCModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectSection: (sectionId: string, tabId: TabId) => void;
  /** Derived from the markdown at build time — see lib/section-index.ts. */
  sections: SectionItem[];
}

export function MobileTOCModal({
  isOpen,
  onClose,
  activeTab,
  onSelectSection,
  sections
}: MobileTOCModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTabFilter, setSelectedTabFilter] = useState<TabId | "all">("all");

  const filteredSections = useMemo(() => {
    return sections.filter((item) => {
      const matchesTab = selectedTabFilter === "all" || item.tabId === selectedTabFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTab;
      const matchesQuery =
        item.number.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.tabLabel.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [sections, searchQuery, selectedTabFilter]);

  // Counts shown in the header/pills — derived from the live index rather than hardcoded,
  // so they never drift from the document again the way the old "26 Sections" figure did.
  const subSectionCount = useMemo(() => sections.filter((s) => s.level === 2).length, [sections]);
  const partCount = useMemo(() => sections.filter((s) => s.level === 3).length, [sections]);

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
          className="relative w-full max-w-xl max-h-[88vh] sm:max-h-[80vh] bg-card border-t sm:border border-line rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Grab Handle on Mobile */}
          <div className="sm:hidden pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-line/80 rounded-full" />
          </div>

          {/* Header */}
          <div className="p-3.5 sm:p-5 border-b border-line flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-ink leading-tight">
                  Full index
                </h3>
                <p className="text-xs text-muted font-medium mt-0.5">
                  {SECTIONS.length} sections, {subSectionCount} sub-sections, {partCount} parts
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-paper border border-line text-muted hover:text-ink flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 sm:p-4 bg-paper/50 border-b border-line space-y-2.5">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search sections (e.g., 200k, Radio, 40 Wards, DPA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-line rounded-xl text-xs font-semibold text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors min-h-[40px]"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 t-label text-muted hover:text-ink px-2 py-1 bg-paper rounded-lg border border-line cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none t-small font-bold">
              <button
                onClick={() => setSelectedTabFilter("all")}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border cursor-pointer min-h-[32px] ${
                  selectedTabFilter === "all"
                    ? "bg-accent text-white border-accent"
                    : "bg-card text-muted border-line hover:text-ink"
                }`}
              >
                All ({sections.length})
              </button>
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedTabFilter(section.id)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border cursor-pointer min-h-[32px] ${
                    selectedTabFilter === section.id
                      ? "bg-accent text-white border-accent"
                      : "bg-card text-muted border-line hover:text-ink"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 divide-y divide-line/40 overscroll-contain">
            {filteredSections.length > 0 ? (
              filteredSections.map((item) => {
                const Icon = TAB_ICONS[item.tabId] ?? Compass;
                const isCurrentTab = activeTab === item.tabId;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectSection(item.id, item.tabId);
                      onClose();
                    }}
                    className="w-full py-3 px-2 flex items-center justify-between text-left hover:bg-paper/70 active:bg-paper rounded-xl transition-all group cursor-pointer min-h-[50px]"
                  >
                    <div className={`flex items-start gap-2.5 sm:gap-3 min-w-0 pr-2 ${item.level === 3 ? "pl-3 sm:pl-5" : ""}`}>
                      <span className="font-mono text-[11px] tabular-nums text-accent shrink-0 mt-0.5 min-w-[38px]">
                        {item.number}
                      </span>
                      <div className="min-w-0">
                        <span className={`block text-xs text-ink group-hover:text-accent transition-colors truncate ${item.level === 2 ? "font-bold" : "font-medium"}`}>
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted">
                          <Icon size={11} className="shrink-0" />
                          <span className="font-medium truncate">{item.tabLabel}</span>
                          {isCurrentTab && <span className="text-accent font-semibold">· current</span>}
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
          <div className="p-3 bg-paper/60 border-t border-line flex items-center justify-between t-small text-muted px-4 font-semibold">
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
