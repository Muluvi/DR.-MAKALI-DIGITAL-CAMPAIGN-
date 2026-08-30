"use client";

import React from "react";
import { 
  FileText, 
  Target, 
  Activity, 
  FileKey, 
  ListTree, 
  ChevronUp, 
  Moon, 
  Sun,
  Maximize2,
  Minimize2
} from "lucide-react";
import type { TabId } from "../lib/heading-slug";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenTOC: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export function MobileBottomNav({
  activeTab,
  onTabChange,
  onOpenTOC,
  isExpanded,
  onToggleExpanded,
  theme,
  onToggleTheme
}: MobileBottomNavProps) {
  const tabs: { id: TabId; label: string; shortLabel: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: "exec", label: "Executive", shortLabel: "Exec", icon: FileText },
    { id: "strategy", label: "Strategy", shortLabel: "Strategy", icon: Target },
    { id: "operations", label: "Operations", shortLabel: "Ops", icon: Activity },
    { id: "tactics", label: "Tactics", shortLabel: "Tactics", icon: Activity },
    { id: "execution", label: "Execution", shortLabel: "KPIs", icon: Activity },
    { id: "appendix", label: "Appendix", shortLabel: "Appx", icon: FileKey },
  ];

  return (
    <aside aria-label="Mobile Navigation Dock" className="fixed bottom-0 left-0 right-0 z-40 lg:hidden print:hidden">
      {/* Background with Blur & Border */}
      <div className="bg-card/95 backdrop-blur-xl border-t border-line shadow-2xl px-2 pt-1.5 pb-3">
        {/* Quick Utilities Strip on Mobile (Scroll Top, Expand All, Theme, TOC) */}
        <div className="flex items-center justify-between px-2 pb-1.5 mb-1 border-b border-line/40 text-[11px] font-bold">
          <button
            onClick={onOpenTOC}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20 active:scale-95 transition-all cursor-pointer min-h-[32px]"
          >
            <ListTree size={13} />
            <span>Table of Contents</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleExpanded}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-paper border border-line text-ink active:scale-95 transition-all cursor-pointer min-h-[32px]"
              aria-label={isExpanded ? "Collapse view" : "Expand all sections"}
            >
              {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              <span className="text-[10px]">{isExpanded ? "Collapse" : "All"}</span>
            </button>

            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg bg-paper border border-line text-ink active:scale-95 transition-all cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={12} className="text-gold" /> : <Sun size={12} className="text-gold" />}
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-1.5 rounded-lg bg-paper border border-line text-ink active:scale-95 transition-all cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <ChevronUp size={13} className="text-accent" />
            </button>
          </div>
        </div>

        {/* 6 Strategic Part Tabs with 44px+ touch targets */}
        <div className="grid grid-cols-6 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 px-0.5 rounded-xl transition-all select-none cursor-pointer ${
                  isActive 
                    ? "bg-accent text-white shadow-md shadow-accent/20 font-black" 
                    : "text-muted hover:text-ink active:bg-paper font-semibold"
                }`}
              >
                <Icon size={16} className={isActive ? "text-white" : "text-muted"} />
                <span className="text-[9px] tracking-tight mt-0.5 leading-tight truncate w-full text-center">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
