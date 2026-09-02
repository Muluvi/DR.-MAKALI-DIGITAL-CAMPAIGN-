"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart, Home, MessageCircle, Music, Plus, Search, Share, User } from "lucide-react";

import { IDENTITY, ILLUSTRATIVE_COUNTS, TIKTOK } from "../../../lib/phone-showcase";
import { EASE_ENTRANCE } from "../../../lib/motion";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";
import { ScreenShell, SlotGap } from "../primitives";

/**
 * TikTok — §9A.1's fastest-growing channel among 18–25s, carrying §14.1 Pillar D (youth
 * enterprise and TVET) in the vertical format §14.2 specifies.
 *
 * The "video" is a designed poster frame, not a file: the proposal ships no footage, and a
 * stock clip would be worse than an honest frame. Hashtags and the audio track name are gaps —
 * a hashtag is new coinage, not a reshaping of existing copy.
 *
 * Living detail: the progress bar advancing, with the heart pulsing once as it passes.
 */

const RED = "#fe2c55";
const CYAN = "#25f4ee";

function RailAction({
  icon: Icon,
  count,
  filled = false,
  color = "#fff",
  pulse = false,
  reduce = false,
}: {
  icon: typeof Heart;
  count: string;
  filled?: boolean;
  color?: string;
  pulse?: boolean;
  reduce?: boolean;
}) {
  return (
    <span className="flex flex-col items-center gap-1">
      <motion.span
        animate={pulse && !reduce ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.46, ease: EASE_ENTRANCE }}
        className="block"
      >
        <Icon size={31} color={color} fill={filled ? color : "none"} strokeWidth={filled ? 0 : 1.8} aria-hidden="true" />
      </motion.span>
      <span className="font-semibold tabular-nums" style={{ fontSize: 11.5, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
        {count}
      </span>
    </span>
  );
}

export function TikTokScreen() {
  const reduce = useReducedMotionSafe();
  const [played, setPlayed] = useState(0);
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const start = Date.now();
    // A single sweep, then it holds. Not a loop that runs for as long as the page is open.
    const id = window.setInterval(() => {
      const pct = Math.min(((Date.now() - start) / 9000) * 100, 100);
      setPlayed(pct);
      if (pct >= 100) window.clearInterval(id);
    }, 100);
    const t = window.setTimeout(() => setTapped(true), 2600);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(t);
    };
  }, [reduce]);

  // Reduced motion gets a played-partway frame, not an unstarted one.
  const progress = reduce ? 34 : played;
  const liked = reduce || tapped;

  return (
    <ScreenShell tone="light" background="#000000" showHome={false}>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* Poster frame */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(168deg, #17233c 0%, #0b1a30 46%, #050a14 100%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(90% 55% at 76% 22%, rgba(0,32,159,0.5) 0%, transparent 68%)" }}
        />
        <div className="absolute left-6 right-20 top-1/2 -translate-y-1/2">
          <p
            className="font-black uppercase"
            style={{ fontSize: 10.5, letterSpacing: "0.22em", color: CYAN, marginBottom: 12 }}
          >
            Pillar D
          </p>
          <p className="font-black" style={{ fontSize: 33, lineHeight: 1.05, color: "#fff", letterSpacing: "-0.02em" }}>
            {TIKTOK.overlayTitle.value}
          </p>
        </div>

        {/* Top tabs */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-6 pt-1">
          {TIKTOK.tabs.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 15.5,
                fontWeight: t === TIKTOK.activeTab ? 700 : 500,
                color: t === TIKTOK.activeTab ? "#fff" : "rgba(255,255,255,0.65)",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              }}
            >
              {t}
            </span>
          ))}
          <span
            aria-hidden="true"
            className="absolute -bottom-1 rounded-full"
            style={{ width: 26, height: 2.5, background: "#fff", left: "58.5%" }}
          />
        </div>

        {/* Right action rail */}
        <div className="absolute right-2.5 bottom-24 flex flex-col items-center gap-4">
          <span className="relative mb-1">
            <span
              className="grid place-items-center rounded-full text-white font-bold"
              style={{ width: 44, height: 44, fontSize: 15, background: "linear-gradient(145deg,#00209f,#0b1a30)", border: "1.5px solid #fff" }}
            >
              {IDENTITY.initials}
            </span>
            <span
              className="absolute left-1/2 -translate-x-1/2 -bottom-2 grid place-items-center rounded-full"
              style={{ width: 19, height: 19, background: RED }}
            >
              <Plus size={13} color="#fff" strokeWidth={3} aria-hidden="true" />
            </span>
          </span>
          <RailAction icon={Heart} count={ILLUSTRATIVE_COUNTS.tiktokLikes} filled={liked} color={liked ? RED : "#fff"} pulse={liked} reduce={reduce} />
          <RailAction icon={MessageCircle} count={ILLUSTRATIVE_COUNTS.tiktokComments} />
          <RailAction icon={Share} count={ILLUSTRATIVE_COUNTS.tiktokShares} />
          {/* Spinning audio disc */}
          <motion.span
            className="grid place-items-center rounded-full mt-1"
            style={{ width: 42, height: 42, background: "linear-gradient(145deg,#3a3a3a,#111)" }}
            animate={reduce ? { rotate: 0 } : { rotate: 360 }}
            transition={{ duration: 6, repeat: reduce ? 0 : Infinity, ease: "linear" }}
            aria-hidden="true"
          >
            <Music size={16} color="#fff" strokeWidth={2.2} />
          </motion.span>
        </div>

        {/* Bottom-left stack */}
        <div className="absolute left-3 right-20 bottom-8">
          <p className="font-bold" style={{ fontSize: 15.5, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            {IDENTITY.handle}
          </p>
          <p className="mt-1" style={{ fontSize: 13.5, lineHeight: 1.32, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            {TIKTOK.caption.value}
          </p>
          <p className="mt-1.5">
            <SlotGap label="Hashtags" dark />
          </p>
          <p className="mt-2 flex items-center gap-1.5">
            <Music size={13} color="#fff" strokeWidth={2.2} aria-hidden="true" />
            <SlotGap label="Audio track" dark />
          </p>
        </div>

        {/* Progress bar */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: 2.5, background: "rgba(255,255,255,0.28)" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "#fff" }} />
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 flex items-center justify-around pt-2 pb-1" style={{ background: "#000" }}>
        <Home size={22} color="#fff" strokeWidth={2} aria-hidden="true" />
        <Search size={22} color="rgba(255,255,255,0.6)" strokeWidth={2} aria-hidden="true" />
        <span
          className="grid place-items-center rounded-lg"
          style={{ width: 40, height: 26, background: "#fff", boxShadow: `-3px 0 0 ${CYAN}, 3px 0 0 ${RED}` }}
        >
          <Plus size={17} color="#000" strokeWidth={3} aria-hidden="true" />
        </span>
        <MessageCircle size={22} color="rgba(255,255,255,0.6)" strokeWidth={2} aria-hidden="true" />
        <User size={22} color="rgba(255,255,255,0.6)" strokeWidth={2} aria-hidden="true" />
      </div>

      <div aria-hidden="true" className="shrink-0 flex justify-center pt-1 pb-2" style={{ background: "#000" }}>
        <span className="block rounded-full" style={{ width: 118, height: 5, background: "#fff", opacity: 0.85 }} />
      </div>
    </ScreenShell>
  );
}
