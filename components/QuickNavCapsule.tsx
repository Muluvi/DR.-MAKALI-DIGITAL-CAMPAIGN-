"use client";

import React, { useState, useEffect } from "react";
import { Compass, ChevronUp, Sparkles, Activity, Radio, Calculator, MapPin, Coins, X, Gauge, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuickNavCapsuleProps {
  onNavigate: (sectionId: string) => void;
  activeTab: string;
}

const QUICK_TARGETS = [
  { id: "measure-sec-8-1", label: "The scorecards", icon: Gauge, tab: "measure" },
  { id: "race-sec-1-3-1", label: "Votes needed to win", icon: Calculator, tab: "race" },
  { id: "race-sec-1-3-2", label: "The 40 wards", icon: MapPin, tab: "race" },
  { id: "ask-sec-9-2", label: "Budget tiers", icon: Coins, tab: "ask" },
  { id: "channels-sec-3-4-1", label: "Kikamba radio", icon: Radio, tab: "channels" },
  { id: "race-sec-1-2-7", label: "County money and audits", icon: Activity, tab: "race" },
  { id: "defence-sec-5-2", label: "The war room", icon: Shield, tab: "defence" },
];

export function QuickNavCapsule({ onNavigate, activeTab }: QuickNavCapsuleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelect = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 print:hidden flex flex-col items-end gap-2.5 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-card/95 backdrop-blur-xl border border-line/60 shadow-2xl rounded-2xl p-4 w-[calc(100vw-2rem)] max-w-xs sm:w-80 mb-2 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-line/40 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-accent/10 text-accent">
                  <Sparkles size={13} />
                </div>
                <span className="font-serif text-xs font-black text-ink">Executive Shortcuts</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-muted hover:text-ink rounded-lg hover:bg-paper cursor-pointer transition-colors"
                aria-label="Close shortcuts"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1">
              {QUICK_TARGETS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className="flex items-center justify-between p-2 rounded-xl text-left hover:bg-accent/10 hover:text-accent group transition-all cursor-pointer text-xs font-bold text-ink"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon size={14} className="text-muted group-hover:text-accent transition-colors shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="t-micro uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-line/30 text-muted group-hover:bg-accent group-hover:text-white transition-all shrink-0">
                      {item.tab}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-3 pt-2.5 border-t border-line/30 flex items-center justify-between t-label text-muted font-semibold">
              <span>Press shortcut to deep link</span>
              <span className="font-mono text-accent">2027 Portal</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="p-2.5 sm:p-3 rounded-full bg-card/90 backdrop-blur-md border border-line/60 shadow-lg text-muted hover:text-accent hover:border-accent active:scale-95 transition-all cursor-pointer"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ChevronUp size={16} />
          </motion.button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full backdrop-blur-md border shadow-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
            isOpen
              ? "bg-accent text-white border-accent shadow-accent/25"
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
