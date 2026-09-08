"use client";

import React, { useEffect, useRef, useState } from "react";
import { MiniScorecard } from "./MiniScorecard";
import { ListTree, ChevronUp, Moon, Sun, Maximize2, Minimize2, Eye, EyeOff, Compass } from "lucide-react";
import { SECTIONS } from "../lib/heading-slug";
import { useChromeVisible } from "../hooks/use-chrome-visible";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenTOC: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  theme: string;
  onToggleTheme: () => void;
  isZeroChrome?: boolean;
  onToggleZeroChrome?: () => void;
}

export function MobileBottomNav({
  activeTab,
  onTabChange,
  onOpenTOC,
  isExpanded,
  onToggleExpanded,
  theme,
  onToggleTheme,
  isZeroChrome = false,
  onToggleZeroChrome
}: MobileBottomNavProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  // Shared with the quick-nav capsule and the top chrome, so every floating element withdraws
  // and returns together rather than each running its own scroll listener.
  const chromeVisible = useChromeVisible();

  // The recall pill has to be able to beat the scroll model, or tapping it while scrolled down
  // does nothing. The override wins until the next scroll, which hands control straight back.
  const [override, setOverride] = useState(false);
  useEffect(() => {
    if (!override) return;
    const clear = () => setOverride(false);
    window.addEventListener("scroll", clear, { passive: true, once: true });
    return () => window.removeEventListener("scroll", clear);
  }, [override]);

  const isScrolledDown = !chromeVisible && !override;
  const setIsScrolledDown = (v: boolean) => setOverride(!v);

  // Ten sections do not fit a phone as a grid of equal tabs, so they scroll — which only works
  // if the current one is always brought into view when it changes.
  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  const shouldHide = isZeroChrome || isScrolledDown;

  return (
    <>
      {/* Zero Chrome Discreet Top-Edge Notch or Scroll Micro-Pill */}
      {isZeroChrome ? (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 lg:hidden print:hidden select-none">
          <button
            onClick={onToggleZeroChrome}
            className="px-3 py-2 min-h-[44px] bg-card/90 backdrop-blur-md rounded-b-xl border-x border-b border-line/60 shadow-md text-[11px] font-extrabold text-muted hover:text-accent flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            aria-label="Exit Zero Chrome Fullscreen"
            title="Exit Zero Chrome Fullscreen"
          >
            <Eye size={13} className="text-accent" />
            <span>Restore Bars</span>
          </button>
        </div>
      ) : isScrolledDown ? (
        <div className="fixed bottom-3 right-3 sm:right-6 z-40 lg:hidden print:hidden animate-fade-in select-none">
          <button
            onClick={() => setIsScrolledDown(false)}
            className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full bg-card/90 backdrop-blur-xl border border-accent/30 text-ink shadow-lg fx-press fx-focus transition-all text-xs font-bold cursor-pointer"
            aria-label="Show navigation"
            title="Show navigation"
          >
            <ChevronUp size={14} className="text-accent" />
            <span className="text-xs font-semibold">Nav</span>
          </button>
        </div>
      ) : null}

      {/* Main Persistent Bottom Navigation Dock — Slides out in Zero Chrome */}
      <aside
        aria-label="Section navigation"
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden print:hidden transition-all duration-300 ease-in-out ${
          shouldHide ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="bottom-dock fx-glass border-t border-line shadow-2xl px-2 pt-1.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))]">
          {/* The three figures the document turns on, as the dock's first row.
              They were briefly a separate floating strip and landed on top of this one — a
              fixed element positioned above another fixed element is a guess about the second
              one's height, and it was wrong. Inside the dock there is nothing to collide with,
              and the figures are as thumb-reachable as the navigation. */}
          <MiniScorecard />

          {/* Page tooling: index, expand-all, zero-chrome, theme, back to top. */}
          <div className="flex items-center justify-between px-1 pb-1.5 mb-1.5 border-b border-line/40 text-xs font-semibold gap-1">
            <button
              onClick={onOpenTOC}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-accent/10 text-accent border border-accent/20 fx-press fx-focus transition-all cursor-pointer min-h-[44px] shrink-0"
            >
              <ListTree size={14} />
              <span className="text-[11px] sm:text-xs">Index</span>
            </button>

            <div className="flex items-center gap-1 shrink-0">
              {/* Zero Chrome Toggle Button */}
              {onToggleZeroChrome && (
                <button
                  onClick={onToggleZeroChrome}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-paper border border-line text-ink fx-press fx-focus transition-all cursor-pointer min-h-[44px]"
                  aria-label="Toggle Zero Chrome full-screen reading mode"
                  title="Toggle Zero Chrome reading mode"
                >
                  <EyeOff size={13} className="text-accent" />
                  <span className="text-[11px]">Zero</span>
                </button>
              )}

              <button
                onClick={onToggleExpanded}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-paper border border-line text-ink fx-press fx-focus transition-all cursor-pointer min-h-[44px]"
                aria-label={isExpanded ? "Collapse to one section" : "Show all sections"}
              >
                {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                <span className="text-[11px]">{isExpanded ? "One" : "All"}</span>
              </button>

              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-paper border border-line text-ink fx-press fx-focus transition-all cursor-pointer min-h-[44px] min-w-[44px] relative z-10 flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                {theme === "light" ? <Moon size={14} className="text-gold" /> : <Sun size={14} className="text-gold" />}
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="p-2 rounded-xl bg-paper border border-line text-ink fx-press fx-focus transition-all cursor-pointer min-h-[44px] min-w-[44px] relative z-10 flex items-center justify-center"
                aria-label="Back to top"
              >
                <ChevronUp size={15} className="text-accent" />
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
                      ? "bg-accent-solid text-on-accent shadow-sm shadow-accent/20 font-semibold"
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
    </>
  );
}
