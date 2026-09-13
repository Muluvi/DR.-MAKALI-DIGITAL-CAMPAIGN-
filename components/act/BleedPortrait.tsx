"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * The candidate, full-bleed.
 *
 * In the document these portraits were inline section images sitting in the prose column at
 * roughly a third of the measure. Here one of them owns the viewport, because the act has to
 * make a reader who has never met Dr. Mulu feel that they have.
 *
 * The portraits are transparent-background cutouts, so a full-bleed treatment needs a ground
 * built for it: the figure sits on the act's void with the party blue pooled behind the
 * shoulders, and the caption sits in the negative space beside him rather than over him.
 *
 * `sizes` is set explicitly. Left to default, next/image assumes 100vw and serves the 1600px
 * rendition to a phone — the single most common way an optimised image pipeline still ships four
 * times the bytes it needs, and this act is being designed for that phone first.
 */
const BOTTOM_FADE =
  "linear-gradient(to bottom, #000 0%, #000 82%, rgba(0,0,0,0.55) 93%, transparent 100%)";

export function BleedPortrait({
  file,
  width,
  height,
  alt,
  kicker,
  quote,
  attribution,
  priority = false,
}: {
  file: string;
  width: number;
  height: number;
  alt: string;
  kicker: string;
  quote: string;
  attribution: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // A shallow parallax — 6% of travel. Enough to separate the figure from the ground, small
  // enough that it never reads as the image sliding inside a window.
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "var(--act-void)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(38rem 38rem at 74% 42%, color-mix(in oklch, var(--act-blue) 26%, transparent), transparent 68%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-[var(--act-gutter)] py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div style={reduce ? undefined : { y }} className="relative mx-auto w-full max-w-sm md:max-w-none">
            <Image
              src={`/portraits/${file}-1600.webp`}
              width={width}
              height={height}
              alt={alt}
              priority={priority}
              sizes="(max-width: 767px) 88vw, 44vw"
              className="w-full h-auto object-contain drop-shadow-2xl"
              style={{
                // The cutouts are trimmed to the subject, so each ends in a straight horizontal
                // cut across the jacket. Invisible on a white page; on this ground it reads as a
                // photograph someone chopped. The same mask the document portraits use.
                maskImage: BOTTOM_FADE,
                WebkitMaskImage: BOTTOM_FADE,
              }}
            />
          </motion.div>

          <div className="md:pb-10">
            <p className="act-kicker">{kicker}</p>
            <blockquote
              className="mt-6 font-serif leading-[1.35]"
              style={{
                color: "var(--act-text)",
                fontSize: "clamp(1.5rem, 1.1rem + 1.9vw, 2.5rem)",
                textWrap: "balance",
              }}
            >
              {quote}
            </blockquote>
            <p
              className="mt-6 font-sans uppercase tracking-[0.14em] text-[0.6875rem] font-bold"
              style={{ color: "var(--act-dim)" }}
            >
              {attribution}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
