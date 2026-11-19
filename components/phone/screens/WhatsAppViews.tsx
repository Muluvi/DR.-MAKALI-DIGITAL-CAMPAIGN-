"use client";

import { motion } from "motion/react";
import { ArrowLeft, BellRing, Eye, MessageSquare, MoreVertical, Smile, ThumbsUp } from "lucide-react";

import { FACEBOOK, ILLUSTRATIVE_COUNTS, LOCK_SCREEN, WHATSAPP_CHANNEL, WHATSAPP_STATUS } from "../../../lib/phone-showcase";
import { DURATION, EASE_ENTRANCE } from "../../../lib/motion";
import { usePlayOnce } from "../../../hooks/use-play-once";
import { CountUp } from "../../premium/CountUp";
import { Avatar, HomeIndicator, ScreenShell, StatusBar } from "../primitives";

/**
 * Three more WhatsApp views (visual upgrade, A6 and A8): what a ward captain's lock screen shows,
 * a Status, and a Channel post. Every line is copy the other screens already carry (see
 * LOCK_SCREEN, WHATSAPP_STATUS and WHATSAPP_CHANNEL in lib/phone-showcase.ts); only the counts are
 * illustrative, and they are registered there as such.
 */

const GREEN = "#008069";

/* ------------------------------------------------------------------------------- lock screen */

/** The alerts stack onto the lock screen once, newest on top, as they would arrive. */
export function LockScreen() {
  const { ref, armed, playing } = usePlayOnce<HTMLDivElement>();
  const items = LOCK_SCREEN.notifications;
  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: "radial-gradient(120% 80% at 30% 10%, #2c4a7a 0%, #14213d 45%, #0b1220 100%)", fontSize: "16px" }}
    >
      <StatusBar tone="light" />
      <div className="text-center text-white mt-6 shrink-0">
        <p style={{ fontSize: "0.9375em", opacity: 0.85 }}>{LOCK_SCREEN.weekday}</p>
        <p className="font-semibold tabular-nums" style={{ fontSize: "4.75em", lineHeight: 1, letterSpacing: "-0.02em" }}>
          {ILLUSTRATIVE_COUNTS.statusBarTime}
        </p>
      </div>
      <div ref={ref} className="flex-1 min-h-0 flex flex-col justify-end gap-2 px-3 pb-3">
        {items.map((n, i) => (
          <motion.div
            key={n.title}
            className="rounded-2xl px-3 py-2.5 text-white"
            style={{ background: "rgba(255,255,255,0.16)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
            initial={false}
            animate={armed && !playing ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_ENTRANCE, delay: playing ? 0.25 + (items.length - 1 - i) * 0.55 : 0 }}
          >
            <div className="flex items-center gap-1.5" style={{ fontSize: "0.6875em", opacity: 0.8 }}>
              {n.app === "WhatsApp" ? (
                <span className="grid place-items-center rounded-[5px]" style={{ width: 16, height: 16, background: "#25d366" }}>
                  <MessageSquare size={10} color="#fff" aria-hidden="true" />
                </span>
              ) : (
                <span className="grid place-items-center rounded-[5px]" style={{ width: 16, height: 16, background: "#34c759" }}>
                  <MessageSquare size={10} color="#fff" aria-hidden="true" />
                </span>
              )}
              <span className="uppercase tracking-wide">{n.app}</span>
              <span className="ml-auto">{n.ago}</span>
            </div>
            <p className="font-semibold mt-1 truncate" style={{ fontSize: "0.875em" }}>{n.title}</p>
            <p className="line-clamp-2" style={{ fontSize: "0.8125em", lineHeight: 1.35, opacity: 0.92 }}>{n.body}</p>
          </motion.div>
        ))}
      </div>
      <HomeIndicator tone="light" />
    </div>
  );
}

/* ------------------------------------------------------------------------------- status */

/** A Status: the slogan in English and Kikamba, on the campaign's colour. The bar is static. */
export function WhatsAppStatusScreen() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden text-white" style={{ background: "linear-gradient(160deg,#00209f 0%,#0b1a30 100%)", fontSize: "16px" }}>
      <StatusBar tone="light" />
      <div className="px-3 shrink-0">
        <div className="flex gap-1" aria-hidden="true">
          <span className="h-[3px] flex-1 rounded-full bg-white" />
          <span className="h-[3px] flex-1 rounded-full bg-white/35" />
          <span className="h-[3px] flex-1 rounded-full bg-white/35" />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <ArrowLeft size={20} aria-hidden="true" />
          <Avatar size={34} />
          <span className="flex-1 min-w-0">
            <span className="block font-semibold truncate" style={{ fontSize: "0.9375em" }}>Dr. Makali Mulu</span>
            <span className="block opacity-80" style={{ fontSize: "0.75em" }}>{WHATSAPP_STATUS.posted}</span>
          </span>
          <MoreVertical size={20} aria-hidden="true" />
        </div>
      </div>
      <div className="flex-1 grid place-items-center px-8 text-center">
        <div>
          <p className="font-bold" style={{ fontSize: "1.75em", lineHeight: 1.2, textWrap: "balance" }}>{WHATSAPP_STATUS.lines[0]}</p>
          <p className="mt-4 italic opacity-90" style={{ fontSize: "1.125em", lineHeight: 1.3 }}>{WHATSAPP_STATUS.lines[1]}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 pb-2 opacity-90 shrink-0" style={{ fontSize: "0.8125em" }}>
        <Eye size={16} aria-hidden="true" /> <CountUp text={ILLUSTRATIVE_COUNTS.statusViews} />
      </div>
      <div className="mx-3 mb-2 flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 shrink-0" style={{ fontSize: "0.875em" }}>
        <Smile size={18} aria-hidden="true" /> <span className="opacity-80">Reply</span>
      </div>
      <HomeIndicator tone="light" />
    </div>
  );
}

/* ------------------------------------------------------------------------------- channel */

/** A Channel post: the Facebook post's pillar statement and proof card, broadcast one-to-many. */
export function WhatsAppChannelScreen() {
  const card = FACEBOOK.card.value;
  return (
    <ScreenShell tone="light" background="#efe7de" showHome={false} statusBarBackground={GREEN}>
      <div className="shrink-0 flex items-center gap-2 px-3 pb-3 pt-0.5" style={{ background: GREEN }}>
        <ArrowLeft size={22} color="#fff" strokeWidth={2.2} aria-hidden="true" />
        <Avatar size={38} />
        <span className="flex-1 min-w-0">
          <span className="block text-white font-semibold truncate" style={{ fontSize: "0.9375em" }}>{WHATSAPP_CHANNEL.name}</span>
          <span className="block text-white/90 truncate" style={{ fontSize: "0.75em" }}>
            Channel · <CountUp text={ILLUSTRATIVE_COUNTS.channelFollowers} /> followers
          </span>
        </span>
        <BellRing size={19} color="#fff" aria-hidden="true" />
      </div>
      <div className="flex-1 min-h-0 flex flex-col justify-end gap-2 px-3 py-3 overflow-hidden">
        <span className="self-center rounded-md px-3 py-1 font-medium" style={{ fontSize: "0.6875em", background: "#e2f2ff", color: "#5a6873" }}>
          {WHATSAPP_CHANNEL.posted}
        </span>
        <div className="self-start max-w-[92%] rounded-lg bg-white overflow-hidden" style={{ boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}>
          <div className="px-3 pt-3 pb-2" style={{ background: "#0b1a30", color: "#fff" }}>
            <p className="font-bold uppercase tracking-wide" style={{ fontSize: "0.625em", opacity: 0.8 }}>{card.kicker}</p>
            <p className="font-semibold mt-1" style={{ fontSize: "0.9375em", lineHeight: 1.3 }}>{card.headline}</p>
          </div>
          <p className="px-3 pt-2" style={{ fontSize: "0.875em", lineHeight: 1.4, color: "#111b21" }}>{FACEBOOK.body.value}</p>
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <span className="rounded-full px-2 py-0.5" style={{ fontSize: "0.75em", background: "#f0f2f5", color: "#3b4a54" }}>
              <ThumbsUp size={12} className="inline -mt-0.5" aria-hidden="true" /> <CountUp text={ILLUSTRATIVE_COUNTS.channelReactions} />
            </span>
            <span className="tabular-nums" style={{ fontSize: "0.6875em", color: "#667781" }}>{WHATSAPP_CHANNEL.time}</span>
          </div>
        </div>
      </div>
      <div className="shrink-0 mx-3 mb-1 rounded-full bg-white px-4 py-2 text-center" style={{ fontSize: "0.8125em", color: "#54656f" }}>
        Only admins can send messages
      </div>
      <HomeIndicator tone="dark" />
    </ScreenShell>
  );
}
