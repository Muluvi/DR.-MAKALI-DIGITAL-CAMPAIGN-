"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { SPRING_SOFT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import {
  BEZEL_BOTTOM,
  BEZEL_TOP,
  BEZEL_X,
  BODY_H,
  BODY_RADIUS,
  BODY_W,
  MAX_ROTATE_X,
  MAX_ROTATE_Y,
  PERSPECTIVE,
  SCREEN_H,
  SCREEN_RADIUS,
  SCREEN_W,
  STATUS_LEDS,
  THICKNESS,
} from "./device";
import { Sun, Wifi, BatteryCharging, Shield } from "lucide-react";

/** Industrial hex bolt rivet for the rugged chassis */
function HexBolt({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute w-3 h-3 rounded-full bg-gradient-to-br from-slate-600 via-slate-800 to-slate-900 border border-slate-700/60 shadow-inner flex items-center justify-center ${className}`}
    >
      <div className="w-1.5 h-1.5 rounded-[1px] bg-slate-950 border border-slate-700/40 rotate-45" />
    </div>
  );
}

/** Rubberized protective corner bumper */
function CornerBumper({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const posClasses = {
    "top-left": "-top-1 -left-1 rounded-tl-xl rounded-br-sm",
    "top-right": "-top-1 -right-1 rounded-tr-xl rounded-bl-sm",
    "bottom-left": "-bottom-1 -left-1 rounded-bl-xl rounded-tr-sm",
    "bottom-right": "-bottom-1 -right-1 rounded-br-xl rounded-tl-sm",
  }[position];

  return (
    <div
      aria-hidden="true"
      className={`absolute w-7 h-7 bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-slate-700/70 z-20 shadow-md ${posClasses}`}
    >
      {/* Texture ridges on the rubber bumper */}
      <div className="absolute inset-1 border-t border-l border-slate-600/30 rounded-sm" />
    </div>
  );
}

export function TerminalFrame({
  children,
  label,
  battery = "94%",
  signal = "Safaricom 4G",
}: {
  children: React.ReactNode;
  label: string;
  battery?: string;
  signal?: string;
}) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const [pointerInside, setPointerInside] = useState(false);

  const rawY = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rotateY = useSpring(rawY, SPRING_SOFT);
  const rotateX = useSpring(rawX, SPRING_SOFT);

  // Subtle glass reflection tracking rotation
  const sheenX = useTransform(rotateY, [-MAX_ROTATE_Y, MAX_ROTATE_Y], ["15%", "85%"]);
  const sheenBackground = useTransform(
    sheenX,
    (x) =>
      `linear-gradient(115deg, transparent 0%, transparent calc(${x} - 28%), rgba(255,255,255,0.08) ${x}, transparent calc(${x} + 28%), transparent 100%)`
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
        {/* Ambient Drop Shadow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-8 -bottom-3 h-14 rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(5,12,25,0.55) 0%, transparent 75%)",
            filter: "blur(20px)",
            transform: "translateZ(-30px)",
          }}
        />

        {/* Tactical Antenna Stub */}
        <div
          aria-hidden="true"
          className="absolute -top-7 right-10 w-4 h-8 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-t-sm border-t border-x border-slate-600/60 z-0"
        >
          <div className="w-full h-2 border-b border-slate-600/40" />
          <div className="w-full h-2 border-b border-slate-600/40" />
        </div>

        {/* Protective Corner Bumpers */}
        <CornerBumper position="top-left" />
        <CornerBumper position="top-right" />
        <CornerBumper position="bottom-left" />
        <CornerBumper position="bottom-right" />

        {/* Industrial Hex Screws */}
        <HexBolt className="top-2.5 left-8" />
        <HexBolt className="top-2.5 right-8" />
        <HexBolt className="bottom-2.5 left-8" />
        <HexBolt className="bottom-2.5 right-8" />

        {/* Physical Tablet Body */}
        <div
          className="relative w-full h-full rounded-[28px] overflow-hidden flex flex-col justify-between border-2 border-slate-700/80 shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, #242b36 0%, #171c24 35%, #0f1319 75%, #0a0d12 100%)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.8), 0 20px 40px -10px rgba(0,0,0,0.6)",
          }}
        >
          {/* Top Industrial Bezel Header */}
          <div
            className="w-full px-5 flex items-center justify-between text-slate-300 z-10"
            style={{ height: BEZEL_TOP }}
          >
            {/* Left: Hardware Status LEDs */}
            <div className="flex items-center gap-3">
              {STATUS_LEDS.map((led) => (
                <div key={led.id} className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: led.color,
                      boxShadow: `0 0 5px ${led.color}`,
                    }}
                  />
                  <span className="text-[9px] font-mono tracking-wider font-semibold text-slate-400">
                    {led.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Center: Device Brand / Hardware Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/60">
              <Shield className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-mono tracking-widest text-slate-200 font-bold uppercase">
                KITUI-TAC 40
              </span>
            </div>

            {/* Right: Telemetry Indicators */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Sun className="w-3 h-3 text-amber-400" />
                <BatteryCharging className="w-3 h-3 text-emerald-400" />
                {battery}
              </span>
              <span className="flex items-center gap-0.5 text-slate-300">
                <Wifi className="w-3 h-3 text-cyan-400" />
                4G
              </span>
            </div>
          </div>

          {/* Screen Recess */}
          <div
            className="mx-auto relative overflow-hidden bg-black border border-slate-800/90 rounded-[10px] shadow-inner"
            style={{
              width: SCREEN_W,
              height: SCREEN_H,
            }}
          >
            {/* Screen Content */}
            <div className="w-full h-full relative z-10">{children}</div>

            {/* Glass Sheen Overlay */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20"
              style={{ background: sheenBackground }}
            />

            {/* CRT/LCD Subtle Scanline / Pixel Grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "100% 2px",
              }}
            />
          </div>

          {/* Bottom Industrial Chin Bezel */}
          <div
            className="w-full px-6 flex items-center justify-between z-10"
            style={{ height: BEZEL_BOTTOM }}
          >
            {/* Hardware Speaker Slits */}
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-1 h-3 bg-slate-950 rounded-[1px] border-b border-slate-800" />
              ))}
            </div>

            {/* Center Hardware Keys */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-3.5 rounded bg-slate-900 border border-slate-700/80 shadow-inner flex items-center justify-center">
                <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase font-bold">
                  TAC-1
                </span>
              </div>
              <div className="w-16 h-3.5 rounded bg-slate-900 border border-slate-700/80 shadow-inner flex items-center justify-center">
                <span className="text-[8px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                  DISPATCH
                </span>
              </div>
            </div>

            {/* County Crest / Unit Allocation */}
            <div className="text-[9px] font-mono text-slate-400 tracking-wider">
              FIELD UNIT #04-COORD
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
