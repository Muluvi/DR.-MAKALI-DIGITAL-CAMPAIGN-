"use client";

import React from "react";
import { FileText, Target, Activity, FileKey, ListTree, ChevronUp, Moon, Sun, Maximize2, Minimize2 } from "lucide-react";
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
    { id: "exec", label: "The Analysis", shortLabel: "Analysis", icon: FileText },
    { id: "programme", label: "The Programme", shortLabel: "Programme", icon: Target },
    { id: "registers", label: "Registers", shortLabel: "Registers", icon: FileKey },
  ];

  return (
    <aside aria-label="Mobile Navigation Dock" className="fixed bottom-0 left-0 right-0 z-40 lg:hidden print:hidden">
      {/* Background with Blur & Border */}
      <div className="bg-card/95 backdrop-blur-xl border-t border-line shadow-2xl px-2 pt-1.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))]">
        {/* Quick Utilities Strip on Mobile (Scroll Top, Expand All, Theme, TOC) */}
        <div className="flex items-center justify-between px-1.5 pb-1.5 mb-1 border-b border-line/40 t-small font-bold">
          <button
            onClick={onOpenTOC}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 text-accent border border-accent/20 active:scale-95 transition-all cursor-pointer min-h-[36px]"
          >
            <ListTree size={14} />
            <span>Table of Contents</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleExpanded}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-paper border border-line text-ink active:scale-95 transition-all cursor-pointer min-h-[36px]"
              aria-label={isExpanded ? "Collapse view" : "Expand all sections"}
            >
              {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span className="t-label">{isExpanded ? "Collapse" : "All"}</span>
            </button>

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-paper border border-line text-ink active:scale-95 transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={13} className="text-gold" /> : <Sun size={13} className="text-gold" />}
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-2 rounded-xl bg-paper border border-line text-ink active:scale-95 transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <ChevronUp size={14} className="text-accent" />
            </button>
          </div>
        </div>

        {/* 3 Strategic Part Tabs with 48px+ touch targets */}
        <div className="grid grid-cols-3 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl transition-all select-none cursor-pointer ${
                  isActive 
                    ? "bg-accent text-white shadow-md shadow-accent/20 font-black" 
                    : "text-muted hover:text-ink active:bg-paper/80 font-semibold"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-muted"} />
                <span className="t-small tracking-tight mt-1 leading-tight truncate w-full text-center">
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
