"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import { CountUp } from "../visual/Numerals";
import { SplitText } from "../visual/SplitText";
import { AmbientField } from "../visual/AmbientField";

/**
 * The chapter gate — the full-bleed takeover that opens an act.
 *
 * Layered, and each layer earns its place:
 *
 *   - An ambient aurora field drifting behind everything, so the ground moves slowly rather
 *     than sitting flat under a static headline.
 *   - Two pools of party colour, separated rather than washed, giving the ground direction.
 *   - The title split to words and staggered in, then the standfirst mask-revealed, then the
 *     figure counting up. One cascade, three beats, roughly a second end to end.
 *   - Parallax on exit: the whole gate recedes and scales fractionally as the reader leaves,
 *     so the act begins by moving rather than cutting.
 *
 * It holds the viewport for exactly one screen and releases. It never pins beyond its own
 * height on any device — the first thing a reader does with a new link is scroll, and a gate
 * that eats three screens before the first sentence reads as a stunt.
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

  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      style={{ background: "var(--act-void)" }}
    >
      <AmbientField intensity="aurora" pattern="grid" className="opacity-70" />

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(58rem 40rem at 12% 18%, color-mix(in oklch, var(--act-blue) 22%, transparent), transparent 70%), radial-gradient(46rem 34rem at 92% 88%, color-mix(in oklch, var(--act-ember) 14%, transparent), transparent 72%)",
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

          <SplitText
            as="h1"
            by="word"
            stagger={0.055}
            delay={0.12}
            className="act-gate-title mt-5 font-sans font-bold tracking-[-0.035em] leading-[0.94]"
          >
            {title}
          </SplitText>

          {/* Mask reveal rather than a fade: the line wipes up from behind its own baseline. */}
          <div className="mt-8 max-w-2xl overflow-hidden">
            <motion.p
              initial={reduce ? false : { y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.85, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="leading-relaxed"
              style={{
                color: "var(--act-body)",
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.0625rem, 1rem + 0.4vw, 1.3125rem)",
                textWrap: "pretty",
              }}
            >
              {standfirst}
            </motion.p>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.66 }}
            className="mt-14 flex items-end gap-5 flex-wrap"
          >
            <span
              className="act-gate-figure font-sans font-bold leading-none tracking-[-0.04em]"
              style={{ fontSize: "clamp(3rem, 1.8rem + 5.6vw, 6rem)" }}
            >
              <CountUp value={figure} prefix={figurePrefix} suffix={figureSuffix} duration={2000} />
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

      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="font-sans text-[0.5625rem] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--act-dim)" }}
        >
          Scroll
        </span>
        <ChevronDown size={16} className="act-cue" style={{ color: "var(--act-blue)" }} />
      </motion.div>
    </section>
  );
}
