"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  CHANNEL_LABELS,
  CHANNEL_ORDER,
  CHANNEL_SUMMARY,
  DEFAULT_CHANNEL,
  DISCLOSURE,
  type ChannelId,
} from "../../lib/phone-showcase";
import { DURATION, EASE_ENTRANCE } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
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

/**
 * Seven channels, one phone.
 *
 * §9 splits the electorate into a connected minority and an offline majority and argues the
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

const SWIPE_THRESHOLD = 56;

export function PhoneShowcase() {
  const reduce = useReducedMotionSafe();
  const [channel, setChannel] = useState<ChannelId>(DEFAULT_CHANNEL);
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

  const Screen = SCREENS[channel];

  return (
    <div className="not-prose my-8 print-avoid-break">
      {/* Selector. A real tab pattern: roving tabindex, arrow keys, aria-selected. */}
      <div
        role="tablist"
        aria-label="Campaign channel"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 sm:justify-center sm:overflow-visible"
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
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                selected ? "border-accent bg-accent text-white" : "border-line bg-card text-muted hover:text-ink"
              }`}
            >
              <ChannelMark id={id} />
              <span className="text-[11.5px] font-bold whitespace-nowrap">{CHANNEL_LABELS[id]}</span>
            </button>
          );
        })}
      </div>

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
            <PhoneFrame label={CHANNEL_SUMMARY[channel]}>
              {/* The screen switch reads like an OS launching an app: the outgoing screen
                  recedes and fades, the incoming one comes up from just under full size. */}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={channel}
                  id="phone-screen-panel"
                  role="tabpanel"
                  aria-labelledby={`phone-tab-${channel}`}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: reduce ? DURATION.micro : DURATION.entrance,
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

      {/* What this screen is — visible caption, and the assistive-tech description of the frame. */}
      <p className="mt-4 text-center text-[12px] text-muted leading-relaxed max-w-md mx-auto">
        {CHANNEL_SUMMARY[channel]}
      </p>
      <p className="mt-2 text-center text-[10.5px] text-muted/75 leading-relaxed max-w-lg mx-auto">
        {DISCLOSURE}
      </p>
    </div>
  );
}
