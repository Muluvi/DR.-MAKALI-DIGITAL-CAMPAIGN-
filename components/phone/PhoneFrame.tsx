"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { SPRING } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import {
  BEZEL,
  BODY_H,
  BODY_RADIUS,
  BODY_W,
  BUTTONS,
  CHIN,
  ISLAND,
  MAX_ROTATE_X,
  MAX_ROTATE_Y,
  PERSPECTIVE,
  SCREEN_H,
  SCREEN_RADIUS,
  SCREEN_W,
  THICKNESS,
} from "./device";

/**
 * The device. One phone, seven screens — the frame never re-animates when the screen changes,
 * because a phone that reassembles itself every time you switch apps is not a phone.
 *
 * The thickness is real: the side rails are strips rotated 90° about their own outer edge, so
 * they extend backwards in Z on the same preserve-3d plane as the body. At the rotation limits
 * you see a sliver of the left or right side, which is what you would see holding one.
 */

/** Brushed-metal rail: a dark base with a bright specular line along the lit edge. */
const RAIL_GRADIENT =
  "linear-gradient(180deg, #3d434c 0%, #6f7883 6%, #2c3138 22%, #22262c 62%, #565f6a 94%, #2a2e34 100%)";

function RailButton({ top, height, side }: { top: number; height: number; side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className="absolute rounded-[2px]"
      style={{
        top,
        height,
        width: THICKNESS - 4,
        [side === "left" ? "right" : "left"]: 2,
        background:
          "linear-gradient(180deg, #4a525c 0%, #767f8b 18%, #333940 55%, #262a30 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.45)",
      }}
    />
  );
}

export type PhoneVariant = "flagship" | "affordable-android" | "feature-phone";
export type PhoneLightingMode = "studio" | "sunlight" | "low-bandwidth";

export function PhoneFrame({
  children,
  label,
  variant = "flagship",
  lightingMode = "studio",
}: {
  children: React.ReactNode;
  /** Describes the screen currently shown, for assistive technology. */
  label: string;
  /** Physical handset architecture to simulate. */
  variant?: PhoneVariant;
  /** Ambient lighting and network environment simulation. */
  lightingMode?: PhoneLightingMode;
}) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const [pointerInside, setPointerInside] = useState(false);

  const rawY = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rotateY = useSpring(rawY, SPRING.gentle);
  const rotateX = useSpring(rawX, SPRING.gentle);

  // The sheen tracks rotation, so the glass catches the light as the device turns.
  const sheenX = useTransform(rotateY, [-MAX_ROTATE_Y, MAX_ROTATE_Y], ["18%", "82%"]);
  const sheenOpacity = useTransform(rotateY, [-MAX_ROTATE_Y, 0, MAX_ROTATE_Y], [0.1, 0.055, 0.1]);
  const sheenBackground = useTransform(
    sheenX,
    (x) =>
      `linear-gradient(118deg, transparent 0%, transparent calc(${x} - 26%), rgba(255,255,255,0.9) ${x}, transparent calc(${x} + 26%), transparent 100%)`
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rawY.set(px * MAX_ROTATE_Y * 2);
      rawX.set(-py * MAX_ROTATE_X * 2);
    },
    [reduce, rawX, rawY]
  );

  const reset = useCallback(() => {
    setPointerInside(false);
    rawY.set(0);
    rawX.set(0);
  }, [rawX, rawY]);

  return (
    <div
      ref={ref}
      className="select-none"
      style={{ perspective: `${PERSPECTIVE}px`, width: BODY_W, height: BODY_H }}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={reset}
    >
      <motion.div
        className="relative"
        style={{
          width: BODY_W,
          height: BODY_H,
          transformStyle: "preserve-3d",
          rotateY: reduce ? 0 : rotateY,
          rotateX: reduce ? 0 : rotateX,
        }}
      >
        {/* Ambient shadow — wide, soft, offset down. Separate element so it never rotates with
            the body and never reads as a glow. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-6 -bottom-2 h-16 rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(3,8,18,0.42) 0%, transparent 72%)",
            filter: "blur(18px)",
            transform: "translateZ(-40px)",
          }}
        />

        {/* Side rails, on their own planes. transform-origin at the outer edge means the strip
            hinges backwards into Z rather than sliding sideways. */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-0"
          style={{
            width: THICKNESS,
            background: RAIL_GRADIENT,
            transformOrigin: "left center",
            transform: "rotateY(-90deg)",
            borderRadius: 3,
          }}
        >
          <RailButton top={BUTTONS.volumeUp.top} height={BUTTONS.volumeUp.height} side="left" />
          <RailButton top={BUTTONS.volumeDown.top} height={BUTTONS.volumeDown.height} side="left" />
        </div>
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 right-0"
          style={{
            width: THICKNESS,
            background: RAIL_GRADIENT,
            transformOrigin: "right center",
            transform: "rotateY(90deg)",
            borderRadius: 3,
          }}
        >
          <RailButton top={BUTTONS.power.top} height={BUTTONS.power.height} side="right" />
        </div>

        {/* Body. The outer ring is the metal frame; the specular lines along the top-left and
            bottom-right edges are what make it read as a machined edge rather than a border. */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: BODY_RADIUS,
            background: RAIL_GRADIENT,
            padding: `${BEZEL}px ${BEZEL}px ${CHIN}px`,
            boxShadow: [
              "0 1px 0 rgba(255,255,255,0.30) inset",
              "0 -1px 0 rgba(0,0,0,0.55) inset",
              "0 2px 4px rgba(3,8,18,0.44)",
              "0 18px 40px -12px rgba(3,8,18,0.52)",
            ].join(", "),
          }}
        >
          {/* Screen. Radius is BODY_RADIUS - BEZEL, so the curves are concentric. */}
          <div
            className={`relative overflow-hidden bg-black @container ${
              lightingMode === "sunlight" ? "brightness-110 contrast-125" : ""
            }`}
            style={{
              width: SCREEN_W,
              height: SCREEN_H,
              borderRadius: variant === "affordable-android" ? 28 : SCREEN_RADIUS,
              containerType: "inline-size",
              fontSize: "16px",
            }}
            role="img"
            aria-label={label}
          >
            {/* Feature phone layout vs full smartphone screen */}
            {variant === "feature-phone" ? (
              <div className="absolute inset-0 flex flex-col bg-[#161a22] text-[#e2e8f0] select-none">
                {/* Feature phone top speaker */}
                <div className="h-6 flex items-center justify-center shrink-0">
                  <div className="w-10 h-1 rounded-full bg-[#333b47] border border-[#475569]/30" />
                </div>

                {/* 2G Green/Amber Monochromatic Screen */}
                <div className="mx-4 my-1 rounded-lg p-2.5 flex-1 max-h-[340px] bg-[#b9cf9c] text-[#12210b] font-mono border-2 border-[#12210b]/20 shadow-inner flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] pb-1 border-b border-[#12210b]/20 font-bold tracking-tight">
                    <span>SAFARICOM 2G</span>
                    <span className="flex items-center gap-1">
                      <span>98%</span>
                      <span>[■■■]</span>
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto pt-2 text-xs leading-tight">
                    {children}
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#12210b]/20 font-bold">
                    <span>OPTIONS</span>
                    <span>BACK</span>
                  </div>
                </div>

                {/* Physical Tactile Keypad */}
                <div className="p-4 pt-2 pb-6 flex-1 flex flex-col justify-between">
                  {/* Softkeys + D-Pad + Call/End */}
                  <div className="grid grid-cols-3 gap-2 items-center text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-14 h-4 rounded bg-[#2b3341] border border-white/10 shadow-xs text-[9px] font-bold text-slate-400 flex items-center justify-center">—</div>
                      <div className="w-14 h-6 rounded-md bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">CALL</div>
                    </div>
                    {/* D-Pad Ring */}
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#242b37] border-2 border-[#3d485a] flex items-center justify-center shadow-md">
                      <div className="w-8 h-8 rounded-full bg-[#1b212c] border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300">OK</div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-14 h-4 rounded bg-[#2b3341] border border-white/10 shadow-xs text-[9px] font-bold text-slate-400 flex items-center justify-center">—</div>
                      <div className="w-14 h-6 rounded-md bg-rose-700/80 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">END</div>
                    </div>
                  </div>

                  {/* 12-key alphanumeric matrix */}
                  <div className="grid grid-cols-3 gap-2 text-center text-slate-200 mt-2">
                    {[
                      { num: "1", sub: "" },
                      { num: "2", sub: "ABC" },
                      { num: "3", sub: "DEF" },
                      { num: "4", sub: "GHI" },
                      { num: "5", sub: "JKL" },
                      { num: "6", sub: "MNO" },
                      { num: "7", sub: "PQRS" },
                      { num: "8", sub: "TUV" },
                      { num: "9", sub: "WXYZ" },
                      { num: "*", sub: "+" },
                      { num: "0", sub: "SPACE" },
                      { num: "#", sub: "a/A" },
                    ].map((k) => (
                      <div
                        key={k.num}
                        className="py-1.5 rounded-md bg-[#252c38] hover:bg-[#2e3746] border border-white/5 shadow-xs flex flex-col items-center justify-center cursor-default transition-colors"
                      >
                        <span className="text-xs font-bold leading-none">{k.num}</span>
                        {k.sub && <span className="text-[7.5px] font-mono text-slate-400 leading-none mt-0.5">{k.sub}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {children}

                {/* Camera Cutout: Dynamic Island vs Teardrop Notch */}
                {variant === "affordable-android" ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-4.5 bg-black rounded-b-xl z-30 border-b border-black/90 flex items-center justify-center"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#111827] border border-[#374151]/50" />
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-30"
                    style={{ top: ISLAND.top, width: ISLAND.width, height: ISLAND.height }}
                  />
                )}
              </>
            )}

            {/* Environmental Mode: Low-Bandwidth Network Banner */}
            {lightingMode === "low-bandwidth" && variant !== "feature-phone" && (
              <div
                aria-hidden="true"
                className="absolute top-11 inset-x-3 z-35 py-1 px-2.5 rounded-md bg-amber-500/90 text-slate-950 font-mono text-[9.5px] font-bold flex items-center justify-between shadow-md border border-amber-400/40 backdrop-blur-xs"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                  <span>2G EDGE • 32 Kbps</span>
                </span>
                <span className="bg-slate-950 text-amber-400 px-1.5 py-0.2 rounded text-[8.5px]">
                  Lite Mode (-74% Data)
                </span>
              </div>
            )}

            {/* Environmental Mode: Direct Midday Sunlight Glare Overlay */}
            {lightingMode === "sunlight" && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none z-35"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 70% at 75% 15%, rgba(255,255,255,0.32) 0%, rgba(255,248,220,0.18) 35%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
                }}
              >
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/70 text-amber-300 font-mono text-[8px] tracking-wider uppercase border border-amber-400/40 shadow-xs">
                  Direct Sun 85k Lux
                </div>
              </div>
            )}

            {/* Glass sheen */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 z-40 pointer-events-none"
              style={{
                background: sheenBackground,
                opacity: reduce ? 0.05 : sheenOpacity,
                borderRadius: variant === "affordable-android" ? 28 : SCREEN_RADIUS,
              }}
            />
          </div>
        </div>

        {/* Contact shadow — tight, directly under the device, distinct from the ambient one. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-10 -bottom-1 h-3 rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(3,8,18,0.55) 0%, transparent 70%)",
            filter: "blur(5px)",
            transform: "translateZ(-6px)",
            opacity: pointerInside ? 0.85 : 1,
          }}
        />
      </motion.div>
    </div>
  );
}
