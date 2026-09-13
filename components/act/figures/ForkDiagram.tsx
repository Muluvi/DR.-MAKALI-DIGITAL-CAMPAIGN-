"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { STATUS } from "../chart-tokens";
import { useChartMode } from "../useChartMode";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";

export interface Branch {
  tag: string;
  title: string;
  reading: string;
  consequences: string[];
  tone: "open" | "contested";
}

/**
 * A decision that has not been made yet, drawn as one.
 *
 * The source document renders both of this act's forks — the nomination mechanism and the
 * governor's term-limit question — as ASCII boxes with pipe characters for connectors. That
 * is a diagram someone drew because they had no drawing tool, and it is the single clearest
 * marker of a text file pretending to be a document.
 *
 * This is the same structure as real geometry: one stem, two paths, drawn by the stroke as
 * the reader arrives. The branches carry different tones because they are not equivalent
 * outcomes — one opens the seat, one defends it — and the campaign plans against both.
 */
export function ForkDiagram({
  question,
  stem,
  branches,
  footnote,
}: {
  question: string;
  stem: string;
  branches: [Branch, Branch];
  footnote?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotionSafe();
  const run = reduce || inView;
  const mode = useChartMode();
  const s = STATUS[mode];

  const toneColor = (t: Branch["tone"]) => (t === "open" ? s.good : s.critical);

  return (
    <div ref={ref} className="my-12 md:my-16">
      <div className="text-center mb-2">
        <p className="act-kicker">{question}</p>
        <p
          className="mt-3 mx-auto max-w-lg font-sans font-semibold leading-snug"
          style={{ color: "var(--act-text)", fontSize: "clamp(1rem, 0.92rem + 0.4vw, 1.2rem)" }}
        >
          {stem}
        </p>
      </div>

      {/*
        The stem and its two arms, drawn rather than typed.

        Full width with preserveAspectRatio="none", so the arms land at 25% and 75% — directly
        over the centres of the two cards below, whatever the container width. The stroke is
        non-scaling so stretching the viewBox horizontally does not thin it. The endpoint dots
        are HTML rather than SVG circles for the same reason: a circle in a non-uniformly
        scaled viewBox becomes an ellipse.

        Hidden below the two-column breakpoint. Where the cards stack, a two-armed fork drawn
        above a single column describes a layout that is not on screen.
      */}
      <div className="relative hidden md:block">
        <svg
          viewBox="0 0 320 72"
          className="w-full"
          style={{ height: 72 }}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M160 0 L160 30 M160 30 L80 30 L80 62 M160 30 L240 30 L240 62"
            fill="none"
            stroke="var(--act-hair)"
            strokeWidth={1.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0 }}
            animate={run ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </svg>

        {[0, 1].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute block rounded-full"
            style={{
              left: i === 0 ? "25%" : "75%",
              bottom: 6,
              width: 8,
              height: 8,
              marginLeft: -4,
              background: toneColor(branches[i].tone),
            }}
            initial={reduce ? false : { scale: 0 }}
            animate={run ? { scale: 1 } : undefined}
            transition={{ duration: 0.35, delay: 0.85 + i * 0.1 }}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-2">
        {branches.map((b, i) => (
          <motion.div
            key={b.tag}
            className="p-5 rounded-xl h-full"
            style={{
              background: "var(--act-raise)",
              border: "1px solid var(--act-hair)",
              borderTop: `2px solid ${toneColor(b.tone)}`,
            }}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={run ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.9 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-sans text-[0.625rem] font-bold uppercase tracking-[0.14em]"
              style={{ color: toneColor(b.tone) }}
            >
              {b.tag}
            </p>
            <h4 className="mt-2 font-sans text-base font-bold leading-snug" style={{ color: "var(--act-text)" }}>
              {b.title}
            </h4>
            <p
              className="mt-2 leading-relaxed"
              style={{ color: "var(--act-body)", fontFamily: "var(--font-serif)", fontSize: "0.9375rem" }}
            >
              {b.reading}
            </p>
            <ul className="mt-4 space-y-2 list-none p-0 m-0">
              {b.consequences.map((cq) => (
                <li
                  key={cq}
                  className="pl-4 relative font-sans text-[0.8125rem] leading-snug"
                  style={{ color: "var(--act-dim)" }}
                >
                  <span
                    className="absolute left-0 top-[0.55em] w-1.5 h-px"
                    style={{ background: toneColor(b.tone) }}
                    aria-hidden="true"
                  />
                  {cq}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {footnote ? (
        <p
          className="mt-5 text-center mx-auto max-w-xl font-sans text-[0.75rem] leading-relaxed"
          style={{ color: "var(--act-dim)" }}
        >
          {footnote}
        </p>
      ) : null}
    </div>
  );
}
