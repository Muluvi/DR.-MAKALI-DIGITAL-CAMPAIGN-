"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Camera, Mic, Paperclip, Plus, Video, Phone as PhoneIcon } from "lucide-react";

import { IDENTITY, WHATSAPP } from "../../../lib/phone-showcase";
import { EASE_ENTRANCE } from "../../../lib/motion";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";
import { ScreenShell } from "../primitives";

/**
 * WhatsApp — §3.1.1's "primary closed-group organizing hub", carrying the dispatch §4.1.2
 * describes: a localized ward pledge, then a voice note from Dr. Mulu, out to the ward captains
 * for peer forwarding.
 *
 * The resident's reply is the single character the SMS copy itself asks for ("Reply 1 to join"),
 * which is why this thread needed no invented dialogue.
 *
 * Living detail: the typing indicator resolving into that reply.
 */

const GREEN_HEADER = "#008069";
const OUT_BUBBLE = "#d9fdd3";
const IN_BUBBLE = "#ffffff";
const WALLPAPER = "#efe7de";
const TICK_BLUE = "#53bdeb";

/** The bubble tail, as an actual corner shape rather than a rotated square. */
function Tail({ side }: { side: "in" | "out" }) {
  const fill = side === "out" ? OUT_BUBBLE : IN_BUBBLE;
  return (
    <svg
      aria-hidden="true"
      width="8"
      height="13"
      viewBox="0 0 8 13"
      className="absolute top-0"
      style={{ [side === "out" ? "right" : "left"]: -7 }}
    >
      <path
        d={side === "out" ? "M0 0h8C4.5 0 4 4.5 0 8V0Z" : "M8 0H0c3.5 0 4 4.5 8 8V0Z"}
        fill={fill}
      />
    </svg>
  );
}

function DoubleTick() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden="true">
      <path d="M1 6.1 3.6 8.8 9.1 2.2" stroke={TICK_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.3 6.1 8.9 8.8 14.4 2.2" stroke={TICK_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          style={{ width: 6, height: 6, background: "#9aa5ad" }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export function WhatsAppScreen() {
  const reduce = useReducedMotionSafe();
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setArrived(true), 2100);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // Under reduced motion the whole thread is simply there; the typing beat is the animation.
  const replied = reduce || arrived;

  const [pledge, reply, voice] = WHATSAPP.thread;

  return (
    <ScreenShell tone="light" background={WALLPAPER} showHome={false} statusBarBackground={GREEN_HEADER}>
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2.5 px-3 pb-2.5 pt-0.5" style={{ background: GREEN_HEADER }}>
        <ArrowLeft size={22} color="#fff" strokeWidth={2.2} aria-hidden="true" />
        <span
          className="grid place-items-center rounded-full shrink-0 text-white font-bold"
          style={{ width: 38, height: 38, fontSize: 14, background: "linear-gradient(145deg,#00209f,#0b1a30)" }}
        >
          {IDENTITY.initials}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-white font-semibold truncate" style={{ fontSize: 15.5, lineHeight: 1.2 }}>
            {WHATSAPP.contactName}
          </span>
          <span className="block truncate" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)" }}>
            {WHATSAPP.contactStatus}
          </span>
        </span>
        <Video size={20} color="#fff" strokeWidth={2} aria-hidden="true" />
        <PhoneIcon size={18} color="#fff" strokeWidth={2} aria-hidden="true" />
      </div>

      {/* Thread. The wallpaper is a faint doodle field, drawn as a repeating radial rather than
          an image so it costs nothing on mobile data. */}
      <div
        className="flex-1 min-h-0 px-3 py-3 flex flex-col justify-end gap-2 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.028) 0 2px, transparent 2px), radial-gradient(circle at 70% 65%, rgba(0,0,0,0.028) 0 2px, transparent 2px)",
          backgroundSize: "34px 34px, 46px 46px",
        }}
      >
        <span
          className="self-center rounded-md px-2.5 py-1 font-medium"
          style={{ fontSize: 11, background: "#e2f2ff", color: "#5a6873", boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}
        >
          {WHATSAPP.dateDivider}
        </span>

        {/* Outgoing pledge */}
        <div className="relative self-end max-w-[85%]">
          <Tail side="out" />
          <div
            className="rounded-lg rounded-tr-none px-2.5 py-1.5"
            style={{ background: OUT_BUBBLE, boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}
          >
            <p style={{ fontSize: 14.2, lineHeight: 1.36, color: "#111b21" }}>{pledge.text}</p>
            <span className="flex items-center justify-end gap-1 mt-0.5">
              <span style={{ fontSize: 11, color: "#667781" }} className="tabular-nums">
                {pledge.time}
              </span>
              <DoubleTick />
            </span>
          </div>
        </div>

        {/* Incoming reply, or the typing indicator that precedes it */}
        <div className="relative self-start max-w-[85%]">
          <Tail side="in" />
          <div
            className="rounded-lg rounded-tl-none px-2.5 py-1.5 min-w-[54px]"
            style={{ background: IN_BUBBLE, boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}
          >
            {replied ? (
              <motion.span
                initial={reduce ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE_ENTRANCE }}
                className="block"
              >
                <span style={{ fontSize: 14.2, lineHeight: 1.36, color: "#111b21" }}>{reply.text}</span>
                <span className="flex items-center justify-end mt-0.5">
                  <span style={{ fontSize: 11, color: "#667781" }} className="tabular-nums">
                    {reply.time}
                  </span>
                </span>
              </motion.span>
            ) : (
              <TypingDots />
            )}
          </div>
        </div>

        {/* Outgoing voice note — §4.1.2's 45-second audio note. No words to invent. */}
        <div className="relative self-end max-w-[85%] w-[80%]">
          <Tail side="out" />
          <div
            className="rounded-lg rounded-tr-none px-2.5 py-2"
            style={{ background: OUT_BUBBLE, boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}
          >
            <span className="flex items-center gap-2">
              <span
                className="grid place-items-center rounded-full shrink-0 text-white font-bold"
                style={{ width: 30, height: 30, fontSize: 11, background: "linear-gradient(145deg,#00209f,#0b1a30)" }}
              >
                {IDENTITY.initials}
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#54656f" aria-hidden="true">
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
              {/* Waveform */}
              <span className="flex items-center gap-[2px] flex-1">
                {[6, 11, 7, 14, 9, 16, 8, 12, 6, 13, 8, 10, 5, 12, 7, 9, 11, 6].map((h, i) => (
                  <span key={i} className="block rounded-full" style={{ width: 2, height: h, background: "#a8b3ba" }} />
                ))}
              </span>
            </span>
            <span className="flex items-center justify-between mt-1 pl-[38px]">
              <span className="tabular-nums" style={{ fontSize: 11, color: "#667781" }}>
                {voice.duration}
              </span>
              <span className="flex items-center gap-1">
                <span className="tabular-nums" style={{ fontSize: 11, color: "#667781" }}>
                  {voice.time}
                </span>
                <DoubleTick />
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 flex items-end gap-1.5 px-2 pb-1.5 pt-1" style={{ background: WALLPAPER }}>
        <div
          className="flex-1 flex items-center gap-2 rounded-[22px] px-3 py-2"
          style={{ background: "#fff", boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}
        >
          <Plus size={20} color="#54656f" strokeWidth={2} aria-hidden="true" />
          <span className="flex-1" style={{ fontSize: 14.5, color: "#8696a0" }}>
            {WHATSAPP.composerPlaceholder}
          </span>
          <Paperclip size={19} color="#54656f" strokeWidth={2} aria-hidden="true" />
          <Camera size={19} color="#54656f" strokeWidth={2} aria-hidden="true" />
        </div>
        <span className="grid place-items-center rounded-full shrink-0" style={{ width: 40, height: 40, background: GREEN_HEADER }}>
          <Mic size={19} color="#fff" strokeWidth={2} aria-hidden="true" />
        </span>
      </div>

      <div aria-hidden="true" className="shrink-0 flex justify-center pt-1 pb-2" style={{ background: WALLPAPER }}>
        <span className="block rounded-full" style={{ width: 118, height: 5, background: "#0f0f0f", opacity: 0.75 }} />
      </div>
    </ScreenShell>
  );
}
