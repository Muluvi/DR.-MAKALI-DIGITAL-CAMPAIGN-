"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import { CountUp } from "../visual/Numerals";

/**
 * The chapter gate — the full-bleed takeover that opens an act.
 *
 * This is the seam where the cinematic treatment lives. The act announces itself, states the one
 * number the act is about, and then gets out of the way so the prose can be read at a comfortable
 * measure. Punctuation, not wallpaper: there is exactly one of these per act.
 *
 * The gate holds the viewport for one screen and releases. It never pins beyond its own height,
 * on any device, because the first thing a reader does with a new link is scroll — and a gate
 * that eats three screens of scroll before the first sentence reads as a stunt.
 */
export function ActGate({
  eyebrow,
  title,
  standfirst,
  figure,
  figureLabel,
  figurePrefix = "",
  figureSuffix = "",
}: {
  eyebrow: string;
  title: string;
  standfirst: string;
  figure: number;
  figureLabel: string;
  figurePrefix?: string;
  figureSuffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // The gate recedes as the reader leaves it rather than scrolling away flat.
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      style={{ background: "var(--act-void)" }}
    >
      {/* Two soft fields of party colour, well under the text. Not a gradient wash — two
          separated pools, so the ground has direction rather than a vignette. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(58rem 40rem at 12% 18%, color-mix(in oklch, var(--act-blue) 20%, transparent), transparent 70%), radial-gradient(46rem 34rem at 92% 88%, color-mix(in oklch, var(--act-ember) 13%, transparent), transparent 72%)",
        }}
      />

      <motion.div
        style={reduce ? undefined : { opacity, y, scale }}
        className="relative w-full px-[var(--act-gutter)] py-24"
      >
        <div className="mx-auto max-w-5xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="act-kicker"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-sans font-bold tracking-[-0.035em] leading-[0.94]"
            style={{
              color: "var(--act-text)",
              fontSize: "clamp(2.75rem, 1.4rem + 6.4vw, 7.5rem)",
              textWrap: "balance",
            }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-8 max-w-2xl leading-relaxed"
            style={{
              color: "var(--act-body)",
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.0625rem, 1rem + 0.4vw, 1.3125rem)",
              textWrap: "pretty",
            }}
          >
            {standfirst}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 flex items-end gap-5 flex-wrap"
          >
            <span
              className="font-sans font-bold tabular-nums leading-none tracking-[-0.04em]"
              style={{
                color: "var(--act-blue)",
                fontSize: "clamp(3rem, 1.8rem + 5.6vw, 6rem)",
              }}
            >
              <CountUp value={figure} prefix={figurePrefix} suffix={figureSuffix} />
            </span>
            <span
              className="font-sans uppercase tracking-[0.16em] text-[0.6875rem] font-bold pb-2 max-w-[16rem]"
              style={{ color: "var(--act-dim)" }}
            >
              {figureLabel}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
