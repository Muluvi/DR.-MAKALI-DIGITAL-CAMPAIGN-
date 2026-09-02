"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

import { EASE_ENTRANCE, STAGGER, VIEWPORT } from "../../lib/motion";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * Section 4 — the campaign's core narrative, set as the section's opening statement.
 *
 * Section 4 now opens the document's argument rather than sitting fourth, and its thesis is a
 * single sentence carrying the whole positioning. In running prose that sentence reads as one
 * more bolded clause; given room and a moment of motion it reads as the claim everything after
 * it has to earn.
 *
 * The words are quoted verbatim from Section 4's own first paragraph — the same discipline
 * KeyTakeawayBanner follows. No new copy is introduced here, and nothing is paraphrased.
 */

/** Section 4, paragraph 1, verbatim. Split only so the operative phrase can carry emphasis. */
const SEGMENTS: { text: string; accent?: boolean }[] = [
  { text: "Dr. Makali Mulu is the" },
  { text: "Economist Governor", accent: true },
  { text: "Kitui needs." },
];

export function EconomistGovernorThesis() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();

  // One running index across all segments, so the stagger reads as a single line of type
  // arriving rather than three phrases arriving in parallel.
  let word = 0;

  return (
    <div
      ref={ref}
      className="not-prose my-8 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.05] to-transparent p-5 sm:p-7 print-avoid-break"
    >
      <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-3">
        The campaign&rsquo;s core narrative
      </p>

      <p className="font-serif text-lg sm:text-2xl font-bold text-ink leading-snug text-balance">
        {SEGMENTS.map((seg) => (
          <React.Fragment key={seg.text}>
            {seg.text.split(" ").map((w) => {
              const delay = reduce ? 0 : word++ * STAGGER.tight;
              return (
                <motion.span
                  key={`${seg.text}-${w}-${word}`}
                  className={`inline-block ${seg.accent ? "text-accent" : ""}`}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.52, ease: EASE_ENTRANCE, delay }}
                >
                  {w}
                  {" "}
                </motion.span>
              );
            })}
          </React.Fragment>
        ))}
      </p>

      {/* The rule lands after the last word, so the sentence finishes on a beat rather than
          simply stopping. It carries no meaning of its own and is hidden from assistive tech. */}
      <motion.span
        className="block h-px bg-accent/40 mt-4 origin-left"
        initial={reduce ? false : { scaleX: 0 }}
        animate={inView || reduce ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.62, ease: EASE_ENTRANCE, delay: reduce ? 0 : word * STAGGER.tight }}
        aria-hidden="true"
      />
    </div>
  );
}
