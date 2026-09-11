"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { ListTree, ChevronUp, Eye, SlidersHorizontal } from "lucide-react";
import { SECTIONS } from "../lib/heading-slug";
import { useChromeVisible } from "../hooks/use-chrome-visible";
import { ReadingSettingsSheet } from "./ReadingSettingsSheet";

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
  const dockRef = useRef<HTMLDivElement>(null);

  // The dock was 190px tall on a phone: three stacked rows — the key figures, a row of five
  // tools, and a scrolling strip of all nine sections. On an 844px screen that is close to a
  // quarter of the viewport spent on furniture, permanently, for a document whose whole
  // argument is that it respects a reader on a cheap handset over a bad connection.
  //
  // It is now one row. The section strip is gone because the index sheet it duplicated is
  // better at the job — it has search, the five parts, reading times and read-state — and the
  // dock names the current section instead, which is the only part of that strip a reader
  // needed at a glance. The four tools are behind one control; the key figures moved into the
  // sheet with them.
  //
  // The measured height is still published, because the quick-nav capsule floats above the
  // dock and a guess about another fixed element's height is always wrong eventually. It used
  // to guess 5rem and land on this dock's own "Back to top" button.
  useEffect(() => {
    const el = dockRef.current;
    const root = document.documentElement;
    if (!el) return;
    const publish = () => root.style.setProperty("--dock-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--dock-h");
    };
  }, []);
  // Shared with the quick-nav capsule and the top chrome, so every floating element withdraws
  // and returns together rather than each running its own scroll listener.
  const chromeVisible = useChromeVisible();

  // The recall pill has to be able to beat the scroll model, or tapping it while scrolled down
  // does nothing. The override wins until the next scroll, which hands control straight back.
  const [override, setOverride] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    if (!override) return;
    const clear = () => setOverride(false);
    window.addEventListener("scroll", clear, { passive: true, once: true });
    return () => window.removeEventListener("scroll", clear);
  }, [override]);

  const isScrolledDown = !chromeVisible && !override;
  const setIsScrolledDown = (v: boolean) => setOverride(!v);

  const currentIndex = SECTIONS.findIndex((section) => section.id === activeTab);
  const current = currentIndex === -1 ? undefined : SECTIONS[currentIndex];

  const shouldHide = isZeroChrome || isScrolledDown;

  return (
    <>
      {/* Reading-view top-edge notch, or the scroll micro-pill */}
      {isZeroChrome ? (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 lg:hidden print:hidden select-none">
          <button
            onClick={onToggleZeroChrome}
            className="px-3 py-2 min-h-[44px] min-w-[44px] justify-center bg-card/90 backdrop-blur-md rounded-b-xl border-x border-b border-line/60 shadow-md text-[11px] font-extrabold text-muted hover:text-accent flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            aria-label="Leave reading view"
            title="Leave reading view"
          >
            <Eye size={13} className="text-accent" />
            <span>Restore Bars</span>
          </button>
        </div>
      ) : isScrolledDown ? (
        <div className="fixed bottom-3 right-3 sm:right-6 z-40 lg:hidden print:hidden animate-fade-in select-none">
          <button
            onClick={() => setIsScrolledDown(false)}
            className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full bg-card/90 backdrop-blur-xl border border-accent/30 text-ink shadow-lg fx-press fx-focus transition-all t-label font-bold cursor-pointer"
            aria-label="Show navigation"
            title="Show navigation"
          >
            <ChevronUp size={14} className="text-accent" />
            <span className="t-label font-semibold">Nav</span>
          </button>
        </div>
      ) : null}

      {/* The persistent bottom dock — slides out in reading view */}
      <aside
        aria-label="Section navigation"
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden print:hidden transition-all duration-300 ease-in-out ${
 shouldHide ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        <div
          ref={dockRef}
          className="bottom-dock fx-glass border-t border-line shadow-2xl px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))]"
        >
          <div className="flex items-center gap-2">
            {/* One control opens the index, and it doubles as the "you are here" readout —
                the only part of the old nine-section strip a reader needed at a glance. */}
            <button
              onClick={onOpenTOC}
              className="flex min-w-0 grow items-center gap-2 rounded-xl border border-accent/20 bg-accent/10 px-3 min-h-[44px] text-left fx-press fx-focus transition-colors cursor-pointer"
              aria-label={`Open the full index. Currently reading section ${current?.number ?? ""}, ${current?.label ?? ""}`}
            >
              <ListTree size={16} className="shrink-0 text-accent" />
              <span className="min-w-0">
                <span className="block t-micro font-semibold text-muted leading-none">
                  {current ? `${currentIndex + 1} of ${SECTIONS.length}` : "All sections"}
                </span>
                <span className="block t-small font-semibold text-ink leading-tight truncate mt-0.5">
                  {current ? `${current.number}. ${current.label}` : "The whole proposal"}
                </span>
              </span>
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-ink fx-press fx-focus transition-colors cursor-pointer"
              aria-label="Reading settings"
              title="Reading settings"
            >
              <SlidersHorizontal size={16} className="text-accent" />
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-ink fx-press fx-focus transition-colors cursor-pointer"
              aria-label="Back to top"
              title="Back to top"
            >
              <ChevronUp size={17} className="text-accent" />
            </button>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {settingsOpen && (
          <ReadingSettingsSheet
            onClose={() => setSettingsOpen(false)}
            isExpanded={isExpanded}
            onToggleExpanded={onToggleExpanded}
            theme={theme}
            onToggleTheme={onToggleTheme}
            onEnterReadingView={onToggleZeroChrome}
          />
        )}
      </AnimatePresence>
    </>
  );
}
