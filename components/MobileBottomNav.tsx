"use client";

import React, { useEffect, useRef } from "react";
import { ListTree, ChevronUp, Moon, Sun, Maximize2, Minimize2 } from "lucide-react";
import { SECTIONS } from "../lib/heading-slug";

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
  const stripRef = useRef<HTMLDivElement>(null);

  // Ten sections do not fit a phone as a grid of equal tabs, so they scroll — which only works
  // if the current one is always brought into view when it changes.
  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  return (
    <aside aria-label="Section navigation" className="fixed bottom-0 left-0 right-0 z-40 lg:hidden print:hidden">
      <div className="bg-card/95 backdrop-blur-xl border-t border-line shadow-2xl px-2 pt-1.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))]">
        {/* Page tooling: index, expand-all, theme, back to top. */}
        <div className="flex items-center justify-between px-1.5 pb-1.5 mb-1.5 border-b border-line/40 text-xs font-semibold">
          <button
            onClick={onOpenTOC}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 text-accent border border-accent/20 active:scale-95 transition-all cursor-pointer min-h-[36px]"
          >
            <ListTree size={14} />
            <span>Full index</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleExpanded}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-paper border border-line text-ink active:scale-95 transition-all cursor-pointer min-h-[36px]"
              aria-label={isExpanded ? "Collapse to one section" : "Show all sections"}
            >
              {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span className="text-[11px]">{isExpanded ? "Collapse" : "All"}</span>
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
              aria-label="Back to top"
            >
              <ChevronUp size={14} className="text-accent" />
            </button>
          </div>
        </div>

        {/* The ten sections, in reading order. The active one is always scrolled into view, so
            the reader can see where they are without opening anything. */}
        <div
          ref={stripRef}
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 snap-x"
        >
          {SECTIONS.map((section) => {
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                data-active={isActive}
                onClick={() => onTabChange(section.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-1.5 shrink-0 snap-center min-h-[44px] px-3 rounded-xl transition-colors select-none cursor-pointer ${
                  isActive
                    ? "bg-accent text-white shadow-sm shadow-accent/20 font-semibold"
                    : "text-muted bg-paper border border-line/70 active:bg-line/30 font-medium"
                }`}
              >
                <span className={`font-mono text-[11px] tabular-nums ${isActive ? "text-white/70" : "text-accent"}`}>
                  {section.number}
                </span>
                <span className="text-xs leading-tight whitespace-nowrap">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
