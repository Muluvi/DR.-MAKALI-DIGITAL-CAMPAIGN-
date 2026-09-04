"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Bookmark,
  Download,
  Home,
  Maximize,
  Play,
  Search,
  Share2,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";

import { IDENTITY, ILLUSTRATIVE_COUNTS, YOUTUBE } from "../../../lib/phone-showcase";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";
import { Avatar, ScreenShell, SlotGap } from "../primitives";

/**
 * YouTube — §3.1.1's home for "long-form debates, church sermons and rally livestreams", carrying
 * §2.7.1 Pillar A: the documentary case study on thirteen years of clean NG-CDF audits.
 *
 * Living detail: the playhead moving along the scrubber.
 */

const FG = "#0f0f0f";
const MUTED = "#606060";
const RED = "#ff0000";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full shrink-0"
      style={{ background: "#f2f2f2", padding: "7px 12px", fontSize: 12.5, fontWeight: 500, color: FG }}
    >
      {children}
    </span>
  );
}

export function YouTubeScreen() {
  const reduce = useReducedMotionSafe();
  const [played, setPlayed] = useState(4);

  useEffect(() => {
    if (reduce) return;
    const start = Date.now();
    const id = window.setInterval(() => {
      const pct = Math.min(4 + ((Date.now() - start) / 12000) * 100, 100);
      setPlayed(pct);
      if (pct >= 100) window.clearInterval(id);
    }, 100);
    return () => window.clearInterval(id);
  }, [reduce]);

  // Reduced motion gets a playhead partway along, not one parked at zero.
  const progress = reduce ? 28 : played;

  return (
    <ScreenShell tone="dark" background="#ffffff">
      {/* Player */}
      <div className="relative w-full shrink-0" style={{ aspectRatio: "16 / 9", background: "#0b1a30" }}>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(85% 70% at 22% 26%, rgba(0,32,159,0.55) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-4 pb-6">
          <span
            className="self-start rounded px-1.5 py-0.5 font-black uppercase"
            style={{ fontSize: 8, letterSpacing: "0.12em", background: "rgba(255,255,255,0.14)", color: "#cfe0ff" }}
          >
            {YOUTUBE.thumbnailKicker.value}
          </span>
          <p className="mt-2 font-black pr-16" style={{ fontSize: 18, lineHeight: 1.12, color: "#fff", letterSpacing: "-0.02em" }}>
            {IDENTITY.sloganKikamba}
          </p>
        </div>

        {/* Controls */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full"
          style={{ width: 46, height: 46, background: "rgba(0,0,0,0.45)" }}
        >
          <Play size={22} color="#fff" fill="#fff" strokeWidth={0} />
        </span>
        <span className="absolute right-2 bottom-4 flex items-center gap-2.5" aria-hidden="true">
          <span className="tabular-nums" style={{ fontSize: 10.5, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>
            {YOUTUBE.duration}
          </span>
          <Maximize size={14} color="#fff" strokeWidth={2.4} />
        </span>
        {/* Scrubber */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: 3, background: "rgba(255,255,255,0.3)" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: RED, position: "relative" }}>
            <span
              className="absolute rounded-full"
              style={{ width: 11, height: 11, background: RED, right: -5.5, top: -4 }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {/* Title */}
        <div className="px-3 pt-2.5">
          <p className="font-semibold" style={{ fontSize: 15.5, lineHeight: 1.26, color: FG }}>
            {YOUTUBE.title.value}
          </p>
          <p className="mt-1 tabular-nums" style={{ fontSize: 12.5, color: MUTED }}>
            {ILLUSTRATIVE_COUNTS.youtubeViews} views · {YOUTUBE.publishedAgo}
          </p>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-2 px-3 pt-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <span
            className="flex items-center rounded-full shrink-0"
            style={{ background: "#f2f2f2", fontSize: 12.5, fontWeight: 500, color: FG }}
          >
            <span className="flex items-center gap-1.5" style={{ padding: "7px 10px 7px 12px" }}>
              <ThumbsUp size={15} strokeWidth={2} aria-hidden="true" />
              <span className="tabular-nums">{ILLUSTRATIVE_COUNTS.youtubeLikes}</span>
            </span>
            <span style={{ width: 1, height: 18, background: "#d9d9d9" }} aria-hidden="true" />
            <span style={{ padding: "7px 12px 7px 10px" }}>
              <ThumbsDown size={15} strokeWidth={2} aria-hidden="true" />
            </span>
          </span>
          <Pill>
            <Share2 size={15} strokeWidth={2} aria-hidden="true" /> Share
          </Pill>
          <Pill>
            <Download size={15} strokeWidth={2} aria-hidden="true" /> Download
          </Pill>
          <Pill>
            <Bookmark size={15} strokeWidth={2} aria-hidden="true" /> Save
          </Pill>
        </div>

        {/* Channel row */}
        <div className="flex items-center gap-2.5 px-3 py-3 mt-1">
          <Avatar size={36} />
          <span className="flex-1 min-w-0">
            <span className="block font-semibold truncate" style={{ fontSize: 13.5, color: FG }}>
              {IDENTITY.channelName}
            </span>
            <span className="block tabular-nums" style={{ fontSize: 11.5, color: MUTED }}>
              {ILLUSTRATIVE_COUNTS.youtubeSubscribers} subscribers
            </span>
          </span>
          <span
            className="rounded-full shrink-0 font-semibold"
            style={{ background: FG, color: "#fff", fontSize: 13, padding: "7px 15px" }}
          >
            {YOUTUBE.subscribeLabel}
          </span>
        </div>

        {/* Collapsed description */}
        <div className="mx-3 rounded-xl px-3 py-2.5" style={{ background: "#f2f2f2" }}>
          <p className="truncate" style={{ fontSize: 12.5, color: FG }}>
            {YOUTUBE.descriptionLine.value}
          </p>
          <p className="mt-0.5 font-semibold" style={{ fontSize: 12.5, color: MUTED }}>
            ...more
          </p>
        </div>

        {/* Comments. The proposal carries no comment copy, here or on the Facebook post. */}
        <div className="mx-3 mt-2.5 rounded-xl px-3 py-2.5" style={{ background: "#f2f2f2" }}>
          <p className="font-semibold" style={{ fontSize: 12.5, color: FG }}>
            Comments
          </p>
          <span className="flex items-center gap-2 mt-2">
            <span className="grid place-items-center rounded-full shrink-0" style={{ width: 24, height: 24, background: "#e0e0e0" }} />
            <SlotGap label="Comment preview" />
          </span>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 flex items-center justify-around pt-2 pb-1" style={{ borderTop: "0.5px solid #e5e5e5" }}>
        <Home size={21} color={FG} strokeWidth={2.1} aria-hidden="true" />
        <Search size={21} color={MUTED} strokeWidth={2} aria-hidden="true" />
        <Bell size={21} color={MUTED} strokeWidth={2} aria-hidden="true" />
        <User size={21} color={MUTED} strokeWidth={2} aria-hidden="true" />
      </div>
    </ScreenShell>
  );
}
