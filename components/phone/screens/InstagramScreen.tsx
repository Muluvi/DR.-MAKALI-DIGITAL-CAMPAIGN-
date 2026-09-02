"use client";

import React, { useEffect, useState } from "react";
import { Bookmark, Heart, Home, MessageCircle, MoreHorizontal, Search, Send, SquarePlay, User } from "lucide-react";

import { IDENTITY, ILLUSTRATIVE_COUNTS, INSTAGRAM } from "../../../lib/phone-showcase";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";
import { Avatar, ScreenShell } from "../primitives";

/**
 * Instagram — a square feed carousel, which is the only format §14.2 actually specifies for
 * social ("1080x1080 square carousel cards"). Not a Story, not a Reel: a Reel here would be the
 * TikTok screen twice, and neither format is named in the proposal.
 *
 * The card carries §14.1 Pillar B — the guaranteed Ksh 85/kg ndengu floor price — with the
 * pillar's own Kikamba name.
 *
 * Living detail: the carousel dots advancing.
 */

const FG = "#262626";
const MUTED = "#8e8e8e";

export function InstagramScreen() {
  const reduce = useReducedMotionSafe();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % INSTAGRAM.slideCount), 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <ScreenShell tone="dark" background="#ffffff">
      {/* App bar */}
      <div className="shrink-0 flex items-center justify-between px-4 pb-2">
        <span style={{ fontSize: 23, fontWeight: 600, color: FG, fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}>
          Instagram
        </span>
        <span className="flex items-center gap-4">
          <Heart size={23} color={FG} strokeWidth={1.9} aria-hidden="true" />
          <Send size={22} color={FG} strokeWidth={1.9} aria-hidden="true" />
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {/* Post header */}
        <div className="flex items-center gap-2.5 px-3 py-2">
          <Avatar size={34} ring />
          <span className="flex-1 min-w-0">
            <span className="block font-semibold truncate" style={{ fontSize: 13.5, color: FG }}>
              {IDENTITY.handle.replace("@", "")}
            </span>
            <span className="block truncate" style={{ fontSize: 11.5, color: FG }}>
              {INSTAGRAM.location}
            </span>
          </span>
          <MoreHorizontal size={18} color={FG} aria-hidden="true" />
        </div>

        {/* Square media — a designed policy card, per §14.2's carousel format. */}
        <div className="relative w-full" style={{ aspectRatio: "1 / 1", background: "#0b1a30" }}>
          <div className="absolute inset-0 flex flex-col justify-between p-5">
            <span
              className="self-start rounded px-2 py-1 font-black uppercase"
              style={{ fontSize: 8.5, letterSpacing: "0.12em", background: "rgba(255,255,255,0.12)", color: "#cfe0ff" }}
            >
              {INSTAGRAM.captionTitle.value}
            </span>
            <span>
              <span className="block font-black" style={{ fontSize: 46, lineHeight: 1, color: "#fff", letterSpacing: "-0.03em" }}>
                {INSTAGRAM.cardHeadline.value}
              </span>
              <span className="block mt-1.5" style={{ fontSize: 14.5, color: "#9fb6d8" }}>
                {INSTAGRAM.cardSub.value}
              </span>
            </span>
          </div>
          {/* Carousel index */}
          <span
            className="absolute top-3 right-3 rounded-full px-2 py-0.5 tabular-nums"
            style={{ fontSize: 11, fontWeight: 600, background: "rgba(0,0,0,0.6)", color: "#fff" }}
          >
            {slide + 1}/{INSTAGRAM.slideCount}
          </span>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between px-3 pt-2.5">
          <span className="flex items-center gap-4">
            <Heart size={24} color={FG} strokeWidth={1.8} aria-hidden="true" />
            <MessageCircle size={23} color={FG} strokeWidth={1.8} aria-hidden="true" />
            <Send size={22} color={FG} strokeWidth={1.8} aria-hidden="true" />
          </span>
          {/* Carousel dots */}
          <span className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: INSTAGRAM.slideCount }).map((_, i) => (
              <span
                key={i}
                className="block rounded-full transition-colors"
                style={{ width: 5.5, height: 5.5, background: i === slide ? "#0095f6" : "#c7c7c7" }}
              />
            ))}
          </span>
          <Bookmark size={23} color={FG} strokeWidth={1.8} aria-hidden="true" />
        </div>

        {/* Likes, caption, timestamp */}
        <div className="px-3 pt-2">
          <p className="font-semibold tabular-nums" style={{ fontSize: 13.5, color: FG }}>
            {ILLUSTRATIVE_COUNTS.instagramLikes} likes
          </p>
          <p className="mt-1" style={{ fontSize: 13.5, lineHeight: 1.4, color: FG }}>
            <span className="font-semibold">{IDENTITY.handle.replace("@", "")}</span>{" "}
            {INSTAGRAM.caption.value} <span style={{ color: MUTED }}>more</span>
          </p>
          <p className="mt-1.5 uppercase" style={{ fontSize: 10.5, letterSpacing: "0.02em", color: MUTED }}>
            {INSTAGRAM.timestamp}
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 flex items-center justify-around pt-2 pb-1" style={{ borderTop: "0.5px solid #dbdbdb" }}>
        <Home size={23} color={FG} strokeWidth={2} fill={FG} aria-hidden="true" />
        <Search size={23} color={FG} strokeWidth={2} aria-hidden="true" />
        <SquarePlay size={23} color={FG} strokeWidth={2} aria-hidden="true" />
        <User size={23} color={FG} strokeWidth={2} aria-hidden="true" />
      </div>
    </ScreenShell>
  );
}
