"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  TERMINAL_MODES,
  WARD_DATA,
  WARDS_LIST,
  type TerminalModeId,
} from "@/data/terminal-showcase";
import { DURATION, EASE_ENTRANCE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { BODY_H, BODY_W } from "./device";
import { TerminalFrame } from "./TerminalFrame";
import { GroundPulseScreen } from "./screens/GroundPulseScreen";
import { MarketAuditScreen } from "./screens/MarketAuditScreen";
import { IncidentScreen } from "./screens/IncidentScreen";
import { TurnoutScreen } from "./screens/TurnoutScreen";
import { MapPin, Radio, Shield, Users } from "lucide-react";

const SCREENS: Record<TerminalModeId, React.ComponentType<{ data: (typeof WARD_DATA)[string] }>> = {
  dgp: GroundPulseScreen,
  mea: MarketAuditScreen,
  iad: IncidentScreen,
  tpc: TurnoutScreen,
};

export function TerminalShowcase() {
  const reduce = useReducedMotionSafe();
  const [activeMode, setActiveMode] = useState<TerminalModeId>("dgp");
  const [selectedWard, setSelectedWard] = useState<string>("kitui-township");
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const tabRefs = useRef<Partial<Record<TerminalModeId, HTMLButtonElement | null>>>({});

  // Responsive scaling with zero CLS
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / BODY_W));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const modeIndex = TERMINAL_MODES.findIndex((m) => m.id === activeMode);

  const move = useCallback(
    (delta: number) => {
      const next =
        TERMINAL_MODES[(modeIndex + delta + TERMINAL_MODES.length) % TERMINAL_MODES.length];
      setActiveMode(next.id);
      tabRefs.current[next.id]?.focus();
    },
    [modeIndex]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveMode(TERMINAL_MODES[0].id);
        tabRefs.current[TERMINAL_MODES[0].id]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const last = TERMINAL_MODES[TERMINAL_MODES.length - 1];
        setActiveMode(last.id);
        tabRefs.current[last.id]?.focus();
      }
    },
    [move]
  );

  const currentModeInfo = TERMINAL_MODES.find((m) => m.id === activeMode)!;
  const currentWardData = WARD_DATA[selectedWard] || WARD_DATA["kitui-township"];
  const ScreenComponent = SCREENS[activeMode];

  return (
    <div className="not-prose my-8 sm:my-10 print-avoid-break">
      {/* Component Intro & Framing */}
      <div className="border border-line rounded-2xl bg-card p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold">
                Section 4.1.1 Physical Hardware Model
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink">
              Kitui Field Coordinator Terminal (TAC-40)
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold self-start sm:self-auto">
            <Radio className="w-3.5 h-3.5" />
            <span>40 Wards Connected • Dual 2G/4G GSM</span>
          </div>
        </div>
        <p className="text-sm text-ink/80 mt-3 leading-relaxed">
          While §3.1 models the connected voter’s smartphone, this terminal models the operational hardware deployed across Kitui’s 40 wards. 
          Each of the <strong>40 Ward Coordinators</strong> supervising <strong>400 Ward Captains</strong> uses this protocol tree to feed ground intelligence back into the central campaign war room.
        </p>
      </div>

      {/* Mode Tabs (Roving tablist) */}
      <div className="mb-4">
        <div
          role="tablist"
          aria-label="Field Terminal Protocols"
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 sm:justify-center sm:overflow-visible"
          style={{ scrollbarWidth: "none" }}
        >
          {TERMINAL_MODES.map((mode) => {
            const selected = mode.id === activeMode;
            return (
              <button
                key={mode.id}
                ref={(el) => {
                  tabRefs.current[mode.id] = el;
                }}
                role="tab"
                id={`terminal-tab-${mode.id}`}
                aria-controls={`terminal-panel-${mode.id}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 border ${
                  selected
                    ? "bg-ink text-paper border-ink shadow-sm font-semibold"
                    : "bg-surface hover:bg-surface-hover text-muted hover:text-ink border-line"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                    selected ? "bg-paper/20 text-paper" : "bg-muted/15 text-muted"
                  }`}>
                    {mode.code}
                  </span>
                  <span>{mode.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Protocol Cadence Badge & Blurb */}
        <div className="text-center mt-2 text-xs text-muted">
          <span className="font-mono font-semibold text-accent">{currentModeInfo.cadence}</span>
          <span className="mx-2">•</span>
          <span>{currentModeInfo.summary}</span>
        </div>
      </div>

      {/* Ward Selector Strip */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
        <span className="text-xs font-mono text-muted mr-1.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Sample Ward:
        </span>
        {WARDS_LIST.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setSelectedWard(w.id)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition ${
              selectedWard === w.id
                ? "bg-slate-900 text-white border-slate-900 font-medium shadow-xs"
                : "bg-card text-muted hover:text-ink border-line hover:border-slate-300"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Terminal Stage (Centering & Zero-CLS scaling) */}
      <div
        ref={stageRef}
        className="w-full flex justify-center items-start overflow-visible"
        style={{
          height: BODY_H * scale,
          minHeight: 340,
        }}
      >
        <div
          style={{
            width: BODY_W,
            height: BODY_H,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <TerminalFrame
            label={currentModeInfo.name}
            battery={currentWardData.battery}
            signal={currentWardData.channel}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeMode}-${selectedWard}`}
                id={`terminal-panel-${activeMode}`}
                role="tabpanel"
                aria-labelledby={`terminal-tab-${activeMode}`}
                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{
                  duration: reduce ? 0 : DURATION.fast,
                  ease: EASE_ENTRANCE,
                }}
                className="w-full h-full"
              >
                <ScreenComponent data={currentWardData} />
              </motion.div>
            </AnimatePresence>
          </TerminalFrame>
        </div>
      </div>

      {/* Bottom Architectural Caption */}
      <div className="mt-4 max-w-xl mx-auto text-center text-xs text-muted leading-relaxed">
        <span className="font-semibold text-ink">Field-to-War Room Protocol:</span> Field intelligence logged by ward coordinators updates county voter projections within 15 minutes, synchronizing radio rebuttal aircover and targeted micro-geofenced voter mobilization.
      </div>
    </div>
  );
}
