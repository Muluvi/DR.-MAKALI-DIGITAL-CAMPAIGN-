"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  Heart,
  Home,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Search,
  Share,
  User,
} from "lucide-react";

import { IDENTITY, ILLUSTRATIVE_COUNTS, X_POST } from "../../../lib/phone-showcase";
import { EASE_ENTRANCE } from "../../../lib/motion";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";
import { Avatar, ScreenShell } from "../primitives";

/**
 * X — §3.1.1's "elite agenda setting and narrative defense" channel, reaching the journalists and
 * county elites who set what local radio talks about. The post is §2.6.1 Pillar 1's evidence
 * lines cut to post length: the clean NG-CDF audit record against the county's pending bills.
 *
 * Living detail: the like count ticks up once, and only once.
 */

const BG = "#000000";
const FG = "#e7e9ea";
const MUTED = "#71767b";
const LINE = "#2f3336";

function Action({
  icon: Icon,
  count,
  color = MUTED,
  fill = false,
}: {
  icon: typeof Heart;
  count?: string;
  color?: string;
  fill?: boolean;
}) {
  return (
    <span className="flex items-center gap-1.5" style={{ color }}>
      <Icon size={17.5} strokeWidth={1.9} fill={fill ? color : "none"} aria-hidden="true" />
      {count && (
        <span className="tabular-nums" style={{ fontSize: 12.5 }}>
          {count}
        </span>
      )}
    </span>
  );
}

export function XScreen() {
  const reduce = useReducedMotionSafe();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setLiked(true), 1800);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // The tick is a single increment on an illustrative number, never a running counter.
  const likeCount = liked
    ? String(Number(ILLUSTRATIVE_COUNTS.xLikes) + 1)
    : ILLUSTRATIVE_COUNTS.xLikes;

  return (
    <ScreenShell tone="light" background={BG}>
      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-6 px-4 pb-2.5" style={{ borderBottom: `1px solid ${LINE}` }}>
        <ArrowLeft size={20} color={FG} strokeWidth={2} aria-hidden="true" />
        <span style={{ fontSize: 17, fontWeight: 700, color: FG }}>Post</span>
      </div>

      <div className="flex-1 min-h-0 px-4 pt-3 overflow-hidden">
        {/* Author */}
        <div className="flex items-start gap-2.5">
          <Avatar size={40} />
          <span className="flex-1 min-w-0">
            <span className="flex items-center gap-1">
              <span className="font-bold truncate" style={{ fontSize: 15, color: FG }}>
                {IDENTITY.displayName}
              </span>
              <svg width="15" height="15" viewBox="0 0 22 22" fill="#1d9bf0" aria-hidden="true" className="shrink-0">
                <path d="M20.4 11a3 3 0 0 0-1.6-2.6 3 3 0 0 0-.7-3.2 3 3 0 0 0-3.2-.7A3 3 0 0 0 11 2.9a3 3 0 0 0-2.6 1.6 3 3 0 0 0-3.2.7 3 3 0 0 0-.7 3.2A3 3 0 0 0 2.9 11a3 3 0 0 0 1.6 2.6 3 3 0 0 0 .7 3.2 3 3 0 0 0 3.2.7 3 3 0 0 0 2.6 1.6 3 3 0 0 0 2.6-1.6 3 3 0 0 0 3.2-.7 3 3 0 0 0 .7-3.2A3 3 0 0 0 20.4 11Zm-10.6 4-3-3 1.3-1.3 1.7 1.7 4.6-4.6 1.3 1.3-5.9 5.9Z" />
              </svg>
            </span>
            <span className="block truncate" style={{ fontSize: 14, color: MUTED }}>
              {IDENTITY.handle}
            </span>
          </span>
          <MoreHorizontal size={18} color={MUTED} aria-hidden="true" />
        </div>

        {/* Body */}
        <p className="mt-3 whitespace-pre-line" style={{ fontSize: 16.5, lineHeight: 1.38, color: FG }}>
          {X_POST.body.value}
        </p>

        {/* Media card — a designed evidence card, not a photograph. */}
        <div
          className="mt-3 overflow-hidden"
          style={{ borderRadius: 16, border: `1px solid ${LINE}`, background: "#0b1a30" }}
        >
          <div className="px-3.5 py-4">
            <span
              className="inline-block rounded px-1.5 py-0.5 font-black uppercase"
              style={{ fontSize: 8.5, letterSpacing: "0.1em", background: "#132644", color: "#8fb4f0" }}
            >
              Tier 1 — Auditor-General
            </span>
            <p className="mt-2 font-bold" style={{ fontSize: 15, lineHeight: 1.25, color: "#ffffff" }}>
              {X_POST.mediaLabel.value}
            </p>
            {/* One mark per audited year, all clean — which is exactly what the claim says. */}
            <span className="mt-3 flex items-end gap-1 h-7" aria-hidden="true">
              {Array.from({ length: 13 }).map((_, i) => (
                <span key={i} className="flex-1 rounded-sm" style={{ height: "100%", background: "#3d84e8" }} />
              ))}
            </span>
            <p className="mt-2 font-mono" style={{ fontSize: 9.5, color: "#7f9fd0", letterSpacing: "0.04em" }}>
              13 audited years · zero queries
            </p>
          </div>
        </div>

        {/* Timestamp and views */}
        <p className="mt-3" style={{ fontSize: 13.5, color: MUTED }}>
          {X_POST.timestamp} · <span className="font-bold" style={{ color: FG }}>{ILLUSTRATIVE_COUNTS.xViews}</span> Views
        </p>

        {/* Action row */}
        <div
          className="flex items-center justify-between mt-2.5 pt-2.5 pb-2"
          style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}
        >
          <Action icon={MessageCircle} count={ILLUSTRATIVE_COUNTS.xReplies} />
          <Action icon={Repeat2} count={ILLUSTRATIVE_COUNTS.xReposts} />
          <motion.span
            animate={liked && !reduce ? { scale: [1, 1.28, 1] } : { scale: 1 }}
            transition={{ duration: 0.42, ease: EASE_ENTRANCE }}
            className="flex"
          >
            <Action icon={Heart} count={likeCount} color={liked ? "#f91880" : MUTED} fill={liked} />
          </motion.span>
          <Action icon={BarChart3} count={ILLUSTRATIVE_COUNTS.xViews} />
          <span className="flex items-center gap-3.5" style={{ color: MUTED }}>
            <Bookmark size={17.5} strokeWidth={1.9} aria-hidden="true" />
            <Share size={17.5} strokeWidth={1.9} aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* Bottom nav */}
      <div
        className="shrink-0 flex items-center justify-around px-6 pt-2.5 pb-1"
        style={{ borderTop: `1px solid ${LINE}` }}
      >
        <Home size={21} color={FG} strokeWidth={2.1} fill={FG} aria-hidden="true" />
        <Search size={21} color={MUTED} strokeWidth={2} aria-hidden="true" />
        <MessageCircle size={21} color={MUTED} strokeWidth={2} aria-hidden="true" />
        <User size={21} color={MUTED} strokeWidth={2} aria-hidden="true" />
      </div>
    </ScreenShell>
  );
}
