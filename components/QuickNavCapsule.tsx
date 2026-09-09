"use client";

import { useState } from "react";
import { Compass, ChevronUp, Sparkles, Activity, Radio, Calculator, MapPin, Coins, X, Gauge, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useChromeVisible } from "../hooks/use-chrome-visible";
import { useScrolledPast } from "../hooks/use-scroll-position";
import { DURATION } from "../lib/motion";

interface QuickNavCapsuleProps {
  onNavigate: (sectionId: string) => void;
  activeTab: string;
  isZeroChrome?: boolean;
}

const QUICK_TARGETS = [
  { id: "decision-sec-8-1", label: "The scorecards", icon: Gauge, tab: "decision" },
  { id: "evidence-sec-1-3-1", label: "Votes needed to win", icon: Calculator, tab: "evidence" },
  { id: "evidence-sec-1-3-2", label: "The 40 wards", icon: MapPin, tab: "evidence" },
  { id: "decision-sec-9-2", label: "Budget tiers", icon: Coins, tab: "decision" },
  { id: "evidence-sec-3-4-1", label: "Kikamba radio", icon: Radio, tab: "evidence" },
  { id: "evidence-sec-1-2-7", label: "County money and audits", icon: Activity, tab: "evidence" },
  { id: "defence-sec-5-2", label: "The war room", icon: Shield, tab: "defence" },
];

export function QuickNavCapsule({ onNavigate, activeTab, isZeroChrome = false }: QuickNavCapsuleProps) {
  // Previously fixed over the document with no scroll behaviour: at 1440px it covered a figure
  // in every section sampled. It now follows the same model as the bottom nav, so it is out of
  // the way while reading and back on any upward scroll. The isZeroChrome toggle still removes
  // it entirely for readers who want that.
  const visible = useChromeVisible();
  const [isOpen, setIsOpen] = useState(false);
  const showScrollTop = useScrolledPast(400);

  const handleSelect = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isZeroChrome) return null;

  return (
    <div className={`fixed bottom-[calc(var(--dock-h,5rem)+0.75rem)] lg:bottom-6 right-4 sm:right-6 z-40 print:hidden flex flex-col items-end gap-2.5 select-none transition-all duration-300 ease-out motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: DURATION.quick, ease: "easeOut" }}
            className="fx-glass shadow-2xl rounded-2xl p-4 w-[min(calc(100vw-2.5rem),20rem)] mb-2 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-line/40 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-accent/10 text-accent">
                  <Sparkles size={13} />
                </div>
                <span className="font-serif text-xs font-black text-ink">Executive Shortcuts</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-11 h-11 text-muted hover:text-ink rounded-lg hover:bg-paper cursor-pointer transition-colors flex items-center justify-center -mr-2"
                aria-label="Close shortcuts"
              >
                <X size={16} />
              </button>
            </div>

            <div className="fx-menu grid grid-cols-1 gap-1 max-h-64 overflow-y-auto pr-1">
              {QUICK_TARGETS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className="fx-press fx-focus flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-accent/10 hover:text-accent group transition-all cursor-pointer text-xs font-bold text-ink min-h-[44px]"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon size={14} className="fx-icon-rise text-muted group-hover:text-accent transition-colors shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="t-micro uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-line/30 text-muted group-hover:bg-accent group-hover:text-white transition-all shrink-0">
                      {item.tab}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-2.5 pt-2 border-t border-line/30 flex items-center justify-between t-label text-muted font-semibold">
              <span>Press shortcut to deep link</span>
              <span className="font-mono text-accent">2027 Portal</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Kept mounted and revealed, rather than mounted on crossing the threshold. A control
            inserted into the row as you scroll shifts the Quick Jump button sideways under the
            reader's thumb; one that fades in from `.fx-backtotop` does not. The 44px square is
            main's, and it is the platform minimum.

            Desktop only: the bottom dock carries its own "Back to top" on a phone, and two
            identical controls a couple of centimetres apart is one of them too many — the
            second is thumb space the section strip can use. */}
        <button
          onClick={scrollToTop}
          data-visible={showScrollTop}
          aria-hidden={!showScrollTop}
          tabIndex={showScrollTop ? 0 : -1}
          className="fx-backtotop fx-glass fx-press fx-focus w-11 h-11 rounded-full shadow-lg text-muted hover:text-accent hover:border-accent cursor-pointer hidden lg:flex items-center justify-center"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ChevronUp size={16} />
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-full backdrop-blur-md border shadow-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
            isOpen
              ? "bg-accent-solid text-on-accent border-accent-solid shadow-accent/25"
              : "bg-card/95 text-ink border-line/60 hover:border-accent/60 hover:text-accent"
          }`}
          aria-label="Quick Navigator"
        >
          <Compass size={16} className={isOpen ? "rotate-45 transition-transform" : "transition-transform"} />
          <span className="hidden sm:inline">Quick Jump</span>
        </button>
      </div>
    </div>
  );
}
