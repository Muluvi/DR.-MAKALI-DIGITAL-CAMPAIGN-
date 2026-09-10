"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X, Eye, Maximize2, Minimize2, Moon, Sun } from "lucide-react";

import { MiniScorecard } from "./MiniScorecard";

/**
 * The three reading preferences, behind one control instead of beside the navigation.
 *
 * Reading view, open-every-section and the theme toggle are power-user switches: a reader
 * touches each of them once, if ever. They were sitting in a permanent row across the bottom of
 * every phone screen, which on an 844px viewport cost more than the hero. Behind one icon they
 * cost nothing until they are wanted, and the dock they came out of now fits in one line.
 *
 * The three key figures come with them. They belong wherever the reader has stopped to orient
 * themselves, which is here and in the index — not in the way of the sentence being read.
 */

interface ReadingSettingsSheetProps {
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  theme: string;
  onToggleTheme: () => void;
  onEnterReadingView?: () => void;
}

export function ReadingSettingsSheet({
  onClose,
  isExpanded,
  onToggleExpanded,
  theme,
  onToggleTheme,
  onEnterReadingView,
}: ReadingSettingsSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const row =
    "w-full flex items-center gap-3 min-h-[52px] px-3.5 rounded-xl bg-paper border border-line " +
    "text-ink text-left fx-press fx-focus transition-colors cursor-pointer hover:border-accent/50";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Reading settings"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fx-backdrop absolute inset-0 bg-ink/70"
      />
      <motion.div
        ref={panelRef}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="relative z-10 w-full fx-glass border-t border-line rounded-t-3xl shadow-2xl px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,1rem))]"
      >
        <div className="flex justify-center pb-2">
          <div className="w-12 h-1.5 rounded-full bg-line/80" />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif t-lead font-bold text-ink">Reading settings</h2>
          <button
            onClick={onClose}
            aria-label="Close reading settings"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-paper text-muted transition-colors hover:text-ink cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-2">
          {onEnterReadingView && (
            <button onClick={() => { onEnterReadingView(); onClose(); }} className={row}>
              <Eye size={17} className="shrink-0 text-accent" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block t-small font-semibold">Reading view</span>
                <span className="block t-micro text-muted">Hide every bar and read full screen</span>
              </span>
            </button>
          )}

          <button onClick={onToggleExpanded} className={row} aria-pressed={isExpanded}>
            {isExpanded ? (
              <Minimize2 size={17} className="shrink-0 text-accent" aria-hidden="true" />
            ) : (
              <Maximize2 size={17} className="shrink-0 text-accent" aria-hidden="true" />
            )}
            <span className="min-w-0">
              <span className="block t-small font-semibold">
                {isExpanded ? "Show one section at a time" : "Open every section"}
              </span>
              <span className="block t-micro text-muted">
                {isExpanded
                  ? "Back to reading one part at a time"
                  : "The whole proposal on one page — this is also what prints"}
              </span>
            </span>
          </button>

          <button onClick={onToggleTheme} className={row} aria-pressed={theme === "light"}>
            {theme === "light" ? (
              <Moon size={17} className="shrink-0 text-gold" aria-hidden="true" />
            ) : (
              <Sun size={17} className="shrink-0 text-gold" aria-hidden="true" />
            )}
            <span className="min-w-0">
              <span className="block t-small font-semibold">
                {theme === "light" ? "Dark theme" : "Light theme"}
              </span>
              <span className="block t-micro text-muted">Currently {theme}</span>
            </span>
          </button>
        </div>

        <div className="mt-4 border-t border-line/60 pt-3">
          <p className="t-micro mb-1 font-semibold text-muted">The three figures everything is argued against</p>
          <MiniScorecard />
        </div>
      </motion.div>
    </div>
  );
}
