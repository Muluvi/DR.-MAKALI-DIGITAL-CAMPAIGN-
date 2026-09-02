"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { SPRING_SOFT } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import {
  BEZEL,
  BODY_H,
  BODY_RADIUS,
  BODY_W,
  BUTTONS,
  CHIN,
  ISLAND,
  MAX_ROTATE_X,
  MAX_ROTATE_Y,
  PERSPECTIVE,
  SCREEN_H,
  SCREEN_RADIUS,
  SCREEN_W,
  THICKNESS,
} from "./device";

/**
 * The device. One phone, seven screens — the frame never re-animates when the screen changes,
 * because a phone that reassembles itself every time you switch apps is not a phone.
 *
 * The thickness is real: the side rails are strips rotated 90° about their own outer edge, so
 * they extend backwards in Z on the same preserve-3d plane as the body. At the rotation limits
 * you see a sliver of the left or right side, which is what you would see holding one.
 */

/** Brushed-metal rail: a dark base with a bright specular line along the lit edge. */
const RAIL_GRADIENT =
  "linear-gradient(180deg, #3d434c 0%, #6f7883 6%, #2c3138 22%, #22262c 62%, #565f6a 94%, #2a2e34 100%)";

function RailButton({ top, height, side }: { top: number; height: number; side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className="absolute rounded-[2px]"
      style={{
        top,
        height,
        width: THICKNESS - 4,
        [side === "left" ? "right" : "left"]: 2,
        background:
          "linear-gradient(180deg, #4a525c 0%, #767f8b 18%, #333940 55%, #262a30 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.45)",
      }}
    />
  );
}

export function PhoneFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  /** Describes the screen currently shown, for assistive technology. */
  label: string;
}) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const [pointerInside, setPointerInside] = useState(false);

  const rawY = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rotateY = useSpring(rawY, SPRING_SOFT);
  const rotateX = useSpring(rawX, SPRING_SOFT);

  // The sheen tracks rotation, so the glass catches the light as the device turns.
  const sheenX = useTransform(rotateY, [-MAX_ROTATE_Y, MAX_ROTATE_Y], ["18%", "82%"]);
  const sheenOpacity = useTransform(rotateY, [-MAX_ROTATE_Y, 0, MAX_ROTATE_Y], [0.1, 0.055, 0.1]);
  const sheenBackground = useTransform(
    sheenX,
    (x) =>
      `linear-gradient(118deg, transparent 0%, transparent calc(${x} - 26%), rgba(255,255,255,0.9) ${x}, transparent calc(${x} + 26%), transparent 100%)`
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
        {/* Ambient shadow — wide, soft, offset down. Separate element so it never rotates with
            the body and never reads as a glow. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-6 -bottom-2 h-16 rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(3,8,18,0.42) 0%, transparent 72%)",
            filter: "blur(18px)",
            transform: "translateZ(-40px)",
          }}
        />

        {/* Side rails, on their own planes. transform-origin at the outer edge means the strip
            hinges backwards into Z rather than sliding sideways. */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-0"
          style={{
            width: THICKNESS,
            background: RAIL_GRADIENT,
            transformOrigin: "left center",
            transform: "rotateY(-90deg)",
            borderRadius: 3,
          }}
        >
          <RailButton top={BUTTONS.volumeUp.top} height={BUTTONS.volumeUp.height} side="left" />
          <RailButton top={BUTTONS.volumeDown.top} height={BUTTONS.volumeDown.height} side="left" />
        </div>
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 right-0"
          style={{
            width: THICKNESS,
            background: RAIL_GRADIENT,
            transformOrigin: "right center",
            transform: "rotateY(90deg)",
            borderRadius: 3,
          }}
        >
          <RailButton top={BUTTONS.power.top} height={BUTTONS.power.height} side="right" />
        </div>

        {/* Body. The outer ring is the metal frame; the specular lines along the top-left and
            bottom-right edges are what make it read as a machined edge rather than a border. */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: BODY_RADIUS,
            background: RAIL_GRADIENT,
            padding: `${BEZEL}px ${BEZEL}px ${CHIN}px`,
            boxShadow: [
              "0 1px 0 rgba(255,255,255,0.30) inset",
              "0 -1px 0 rgba(0,0,0,0.55) inset",
              "0 2px 4px rgba(3,8,18,0.44)",
              "0 18px 40px -12px rgba(3,8,18,0.52)",
            ].join(", "),
          }}
        >
          {/* Screen. Radius is BODY_RADIUS - BEZEL, so the curves are concentric. */}
          <div
            className="relative overflow-hidden bg-black"
            style={{ width: SCREEN_W, height: SCREEN_H, borderRadius: SCREEN_RADIUS }}
            role="img"
            aria-label={label}
          >
            {children}

            {/* Cutout. Sits above screen content, below the glass. */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-30"
              style={{ top: ISLAND.top, width: ISLAND.width, height: ISLAND.height }}
            />

            {/* Glass. A single low-opacity diagonal band that moves with rotation — the whole
                point is that it is barely there until the device turns. */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 z-40 pointer-events-none"
              style={{
                background: sheenBackground,
                opacity: reduce ? 0.05 : sheenOpacity,
                borderRadius: SCREEN_RADIUS,
              }}
            />
          </div>
        </div>

        {/* Contact shadow — tight, directly under the device, distinct from the ambient one. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-10 -bottom-1 h-3 rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(3,8,18,0.55) 0%, transparent 70%)",
            filter: "blur(5px)",
            transform: "translateZ(-6px)",
            opacity: pointerInside ? 0.85 : 1,
          }}
        />
      </motion.div>
    </div>
  );
}
