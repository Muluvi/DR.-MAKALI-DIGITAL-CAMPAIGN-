"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bell, Globe, Home, MessageCircle, MoreHorizontal, Search, Share2, ThumbsUp, Users } from "lucide-react";

import { FACEBOOK, IDENTITY, ILLUSTRATIVE_COUNTS } from "../../../lib/phone-showcase";
import { EASE_ENTRANCE, STAGGER } from "../../../lib/motion";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";
import { Avatar, ScreenShell, Slot } from "../primitives";

/**
 * Facebook — §3.1.1's "broadest public social network in Kitui". The post is §2.6.1 Pillar 3's
 * narrative statement on the Ward Development Equalization Fund, with that pillar's own Tier 1
 * water-access proof point as the attached card.
 *
 * Living detail: the reaction cluster animating in.
 *
 * The comment preview is left as a gap — the proposal contains no comment copy, and writing a
 * supportive comment from an imagined resident would be inventing an endorsement.
 */

const BLUE = "#1877f2";
const FG = "#050505";
const MUTED = "#65676b";
const CANVAS = "#f0f2f5";

/** The overlapping reaction pills. Drawn, not emoji. */
function ReactionPills({ show, reduce }: { show: boolean; reduce: boolean }) {
  const pills = [
    { bg: BLUE, node: <ThumbsUp size={9} color="#fff" fill="#fff" strokeWidth={0} aria-hidden="true" /> },
    {
      bg: "#f33e58",
      node: (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M12 21s-8-5.2-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 3.6C20 15.8 12 21 12 21Z" />
        </svg>
      ),
    },
  ];
  return (
    <span className="flex items-center">
      {pills.map((p, i) => (
        <motion.span
          key={i}
          className="grid place-items-center rounded-full"
          style={{
            width: 18,
            height: 18,
            background: p.bg,
            border: "1.5px solid #fff",
            marginLeft: i === 0 ? 0 : -6,
            zIndex: pills.length - i,
          }}
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={show || reduce ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.36, ease: EASE_ENTRANCE, delay: reduce ? 0 : i * STAGGER.tight }}
        >
          {p.node}
        </motion.span>
      ))}
    </span>
  );
}

export function FacebookScreen() {
  const reduce = useReducedMotionSafe();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setSettled(true), 900);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const reacted = reduce || settled;

  return (
    <ScreenShell tone="dark" background={CANVAS}>
      {/* App bar */}
      <div className="shrink-0 flex items-center justify-between px-4 pb-2 bg-white">
        <span style={{ fontSize: 24, fontWeight: 800, color: BLUE, letterSpacing: "-0.03em" }}>facebook</span>
        <span className="flex items-center gap-2">
          <span className="grid place-items-center rounded-full" style={{ width: 32, height: 32, background: "#e4e6eb" }}>
            <Search size={17} color={FG} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="grid place-items-center rounded-full" style={{ width: 32, height: 32, background: "#e4e6eb" }}>
            <MessageCircle size={17} color={FG} strokeWidth={2.4} aria-hidden="true" />
          </span>
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden pt-2">
        <div className="bg-white pb-0.5">
          {/* Post header */}
          <div className="flex items-start gap-2.5 px-3 pt-3">
            <Avatar size={40} />
            <span className="flex-1 min-w-0">
              <span className="block font-semibold truncate" style={{ fontSize: 14.5, color: FG }}>
                {IDENTITY.pageName}
              </span>
              <span className="flex items-center gap-1" style={{ fontSize: 12.5, color: MUTED }}>
                {FACEBOOK.timestamp} · <Globe size={11.5} strokeWidth={2.2} aria-hidden="true" />
              </span>
            </span>
            <MoreHorizontal size={19} color={MUTED} aria-hidden="true" />
          </div>

          {/* Body, with the fold */}
          <p className="px-3 pt-2.5" style={{ fontSize: 14.5, lineHeight: 1.36, color: FG }}>
            {FACEBOOK.body.value}{" "}
            <span style={{ color: MUTED }}>See more</span>
          </p>

          {/* Attached card */}
          <div className="mt-2.5" style={{ background: "#0b1a30" }}>
            <div className="px-4 py-5">
              <span
                className="inline-block rounded px-1.5 py-0.5 font-black uppercase"
                style={{ fontSize: 8.5, letterSpacing: "0.1em", background: "#132644", color: "#8fb4f0" }}
              >
                {FACEBOOK.card.value.kicker}
              </span>
              <p className="mt-2 font-bold" style={{ fontSize: 17, lineHeight: 1.22, color: "#fff" }}>
                {FACEBOOK.card.value.headline}
              </p>
            </div>
          </div>

          {/* Reaction summary */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="flex items-center gap-1.5">
              <ReactionPills show={reacted} reduce={reduce} />
              <span className="tabular-nums" style={{ fontSize: 13, color: MUTED }}>
                {ILLUSTRATIVE_COUNTS.facebookReactions}
              </span>
            </span>
            <span className="tabular-nums" style={{ fontSize: 13, color: MUTED }}>
              {ILLUSTRATIVE_COUNTS.facebookComments} comments · {ILLUSTRATIVE_COUNTS.facebookShares} shares
            </span>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-around py-1.5 mx-3" style={{ borderTop: "1px solid #ced0d4" }}>
            {[
              { icon: ThumbsUp, label: "Like" },
              { icon: MessageCircle, label: "Comment" },
              { icon: Share2, label: "Share" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 py-1.5">
                <Icon size={17} color={MUTED} strokeWidth={2} aria-hidden="true" />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: MUTED }}>{label}</span>
              </span>
            ))}
          </div>

          {/* Comment preview — the proposal has no comment copy. */}
          <div className="flex items-center gap-2 px-3 pb-3 pt-1" style={{ borderTop: "1px solid #ced0d4" }}>
            <span className="grid place-items-center rounded-full shrink-0" style={{ width: 26, height: 26, background: "#e4e6eb" }} />
            <span className="min-w-0">
              <Slot field={FACEBOOK.commentPreview} />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 flex items-center justify-around bg-white pt-2 pb-1" style={{ borderTop: "1px solid #dadde1" }}>
        <Home size={22} color={BLUE} strokeWidth={2.2} aria-hidden="true" />
        <Users size={22} color={MUTED} strokeWidth={2} aria-hidden="true" />
        <Bell size={22} color={MUTED} strokeWidth={2} aria-hidden="true" />
        <MoreHorizontal size={22} color={MUTED} strokeWidth={2} aria-hidden="true" />
      </div>
    </ScreenShell>
  );
}
