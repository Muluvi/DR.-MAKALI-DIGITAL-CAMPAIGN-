"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  CHANNEL_LABELS,
  CHANNEL_ORDER,
  CHANNEL_SUMMARY,
  DEFAULT_CHANNEL,
  DISCLOSURE,
  WHATSAPP_VIEWS,
  type ChannelId,
  type WhatsAppView,
} from "../../lib/phone-showcase";
import { DURATION, EASE_ENTRANCE } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import { useMotionPreset } from "../../hooks/useMotionPreset";
import { BODY_H, BODY_W } from "./device";
import { ChannelMark } from "./marks";
import { PhoneFrame } from "./PhoneFrame";
import { FacebookScreen } from "./screens/FacebookScreen";
import { InstagramScreen } from "./screens/InstagramScreen";
import { TikTokScreen } from "./screens/TikTokScreen";
import { UssdScreen } from "./screens/UssdScreen";
import { WhatsAppScreen } from "./screens/WhatsAppScreen";
import { XScreen } from "./screens/XScreen";
import { YouTubeScreen } from "./screens/YouTubeScreen";
import { LockScreen, WhatsAppChannelScreen, WhatsAppStatusScreen } from "./screens/WhatsAppViews";
import { IllustrativeTag } from "../premium/IllustrativeTag";

/**
 * Seven channels, one phone.
 *
 * §3.6 splits the electorate into a connected minority and an offline majority and argues the
 * campaign has to run on both. This is that argument as an object you can turn over: the same
 * handset, the campaign already on every screen the county actually uses — ending on the USSD
 * dialog, which reaches more voters than all six apps put together.
 *
 * The device never re-animates on switch. Only the screen changes, the way it does when you
 * switch apps.
 */

const SCREENS: Record<ChannelId, React.ComponentType> = {
  whatsapp: WhatsAppScreen,
  facebook: FacebookScreen,
  instagram: InstagramScreen,
  tiktok: TikTokScreen,
  youtube: YouTubeScreen,
  x: XScreen,
  ussd: UssdScreen,
};

/** WhatsApp's own views (visual upgrade, A6 and A8). The chat is the default. */
const WHATSAPP_SCREENS: Record<WhatsAppView, React.ComponentType> = {
  lock: LockScreen,
  chat: WhatsAppScreen,
  status: WhatsAppStatusScreen,
  channel: WhatsAppChannelScreen,
};

const SWIPE_THRESHOLD = 56;

export function PhoneShowcase() {
  const reduce = useReducedMotionSafe();
  const { enter } = useMotionPreset();
  const [channel, setChannel] = useState<ChannelId>(DEFAULT_CHANNEL);
  const [waView, setWaView] = useState<WhatsAppView>("chat");
  const tabRefs = useRef<Partial<Record<ChannelId, HTMLButtonElement | null>>>({});

  // The device is drawn once at true phone size and scaled as a single transform, so nothing
  // inside it ever reflows. The outer box reserves the scaled height via aspect-ratio, which is
  // what keeps cumulative layout shift at zero.
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / BODY_W));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const index = CHANNEL_ORDER.indexOf(channel);

  const move = useCallback(
    (delta: number) => {
      const next = CHANNEL_ORDER[(index + delta + CHANNEL_ORDER.length) % CHANNEL_ORDER.length];
      setChannel(next);
      tabRefs.current[next]?.focus();
    },
    [index]
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
        setChannel(CHANNEL_ORDER[0]);
        tabRefs.current[CHANNEL_ORDER[0]]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const last = CHANNEL_ORDER[CHANNEL_ORDER.length - 1];
        setChannel(last);
        tabRefs.current[last]?.focus();
      }
    },
    [move]
  );

  const Screen = channel === "whatsapp" ? WHATSAPP_SCREENS[waView] : SCREENS[channel];
  const screenKey = channel === "whatsapp" ? `whatsapp-${waView}` : channel;
  const summary = channel === "whatsapp" ? WHATSAPP_VIEWS.find((v) => v.id === waView)!.summary : CHANNEL_SUMMARY[channel];

  return (
    <div className="not-prose my-6 sm:my-8 print-avoid-break">
      <IllustrativeTag />
      {/* Selector. A real tab pattern: roving tabindex, arrow keys, aria-selected. */}
      <div
        role="tablist"
        aria-label="Campaign channel"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1 sm:justify-center sm:overflow-visible"
        style={{ scrollbarWidth: "none" }}
      >
        {CHANNEL_ORDER.map((id) => {
          const selected = id === channel;
          return (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[id] = el;
              }}
              role="tab"
              id={`phone-tab-${id}`}
              aria-selected={selected}
              aria-controls="phone-screen-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setChannel(id)}
              className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
 selected ? "border-accent-solid bg-accent-solid text-on-accent" : "border-line bg-card text-muted hover:text-ink"
              }`}
            >
              <ChannelMark id={id} />
              <span className="t-micro font-bold whitespace-nowrap">{CHANNEL_LABELS[id]}</span>
            </button>
          );
        })}
      </div>

      {/* WhatsApp's own views: the lock screen, the chat, a Status and a Channel. */}
      {channel === "whatsapp" ? (
        <div className="mt-1 flex justify-center">
          <div role="group" aria-label="WhatsApp view" className="inline-flex gap-1 rounded-full border border-line bg-paper p-0.5">
            {WHATSAPP_VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={waView === v.id}
                onClick={() => setWaView(v.id)}
                className={`min-h-[2.75rem] rounded-full px-3 t-micro font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  waView === v.id ? "bg-ink text-paper" : "text-muted hover:text-ink"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Stage */}
      <div className="flex justify-center mt-4">
        <div
          ref={stageRef}
          className="w-full overflow-hidden"
          style={{ maxWidth: BODY_W, aspectRatio: `${BODY_W} / ${BODY_H}` }}
        >
          <motion.div
            style={{ width: BODY_W, height: BODY_H, transformOrigin: "top left", scale }}
            drag={reduce ? false : "x"}
            dragDirectionLock
            dragElastic={0.08}
            dragMomentum={false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) move(1);
              else if (info.offset.x > SWIPE_THRESHOLD) move(-1);
            }}
          >
            <PhoneFrame label={summary}>
              {/* The screen switch reads like an OS launching an app: the outgoing screen
                  recedes and fades, the incoming one comes up from just under full size. */}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={screenKey}
                  id="phone-screen-panel"
                  role="tabpanel"
                  aria-labelledby={`phone-tab-${channel}`}
                  className="absolute inset-0"
                  initial={enter({ opacity: 0, scale: 0.94 })}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: reduce ? DURATION.instant : DURATION.base,
                    ease: EASE_ENTRANCE,
                  }}
                >
                  <Screen />
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </motion.div>
        </div>
      </div>

      {/* Where in the seven this is (visual upgrade, A2). Swipe the phone, or tap a dot. */}
      <div className="mt-3 flex items-center justify-center gap-1" role="group" aria-label="Channel position">
        {CHANNEL_ORDER.map((id, i) => (
          <button
            key={id}
            type="button"
            onClick={() => setChannel(id)}
            aria-label={`${CHANNEL_LABELS[id]}, ${i + 1} of ${CHANNEL_ORDER.length}`}
            aria-current={id === channel ? "true" : undefined}
            className="phone-dot"
          >
            <span data-on={id === channel ? "true" : "false"} />
          </button>
        ))}
      </div>

      {/* What this screen is — visible caption, and the assistive-tech description of the frame. */}
      <p className="mt-3 text-center t-label text-muted leading-relaxed max-w-md mx-auto">
        {summary}
      </p>
      <p className="mt-2 text-center t-micro text-muted/75 leading-relaxed max-w-lg mx-auto">
        {DISCLOSURE}
      </p>
    </div>
  );
}
