"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { useMediaQuery } from "../../hooks/use-media-query";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

export interface StageBeat {
  /** The claim this beat makes. Kept to a sentence — it sits beside a chart, not instead of it. */
  lead: string;
  /** The supporting line. Optional, because some beats are just the claim. */
  body?: string;
}

/**
 * A piece of evidence that takes the viewport while the argument about it scrolls past.
 *
 * Desktop: the stage pins. The chart holds still in the left two-thirds for the whole scroll
 * distance while the beats advance on the right, so the reader watches one object being
 * explained rather than scrolling away from it to read about it.
 *
 * Phone: it does not pin, and that is deliberate rather than a fallback. A pinned panel on a
 * 380px viewport is a scroll trap — the reader flicks, nothing moves, and the only way out is to
 * keep flicking through a distance they cannot see the end of. Below the breakpoint the chart
 * renders full-bleed at its natural height and the beats follow it as ordinary prose. Same
 * material, same order, no hostage-taking.
 *
 * `useMediaQuery` returns false on the server, so the markup that ships is the phone one. The
 * desktop pin is an upgrade applied after hydration, which is the right direction for a document
 * whose primary reader is on a phone.
 */
export function PinnedStage({
  kicker,
  beats,
  children,
}: {
  kicker: string;
  beats: StageBeat[];
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotionSafe();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // The last beat should hold for the tail of the scroll rather than flicking past at 100%,
    // so the progress range is divided into `beats.length` equal bands and clamped.
    const next = Math.min(beats.length - 1, Math.max(0, Math.floor(p * beats.length)));
    setActive(next);
  });

  const pinned = isDesktop && !reduce;

  if (!pinned) {
    return (
      <section className="py-14 md:py-20" style={{ background: "var(--act-void)" }}>
        <p className="act-kicker px-[var(--act-gutter)] mb-6">{kicker}</p>
        <div className="mb-10">{children}</div>
        <div className="act-prose space-y-8">
          {beats.map((beat, i) => (
            <div key={i} className="border-l-2 pl-5" style={{ borderColor: "var(--act-blue)" }}>
              <p className="!mt-0" style={{ color: "var(--act-text)", fontWeight: 600 }}>
                {beat.lead}
              </p>
              {beat.body ? <p className="!mt-2 text-[0.95em]">{beat.body}</p> : null}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      className="act-pin-track relative"
      style={{ height: `${(beats.length + 1) * 100}svh`, background: "var(--act-void)" }}
    >
      <div className="act-pin sticky top-0 h-svh flex items-center overflow-hidden">
        <div className="w-full grid grid-cols-[1.55fr_1fr] gap-10 xl:gap-16 px-10 xl:px-16 items-center">
          <div className="min-w-0">{children}</div>

          <div className="min-w-0">
            <p className="act-kicker mb-8">{kicker}</p>
            <div className="relative min-h-[15rem]">
              {beats.map((beat, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    y: i === active ? 0 : 12,
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  aria-hidden={i !== active}
                >
                  <p
                    className="font-sans text-xl xl:text-2xl leading-snug font-semibold"
                    style={{ color: "var(--act-text)" }}
                  >
                    {beat.lead}
                  </p>
                  {beat.body ? (
                    <p
                      className="mt-4 text-base leading-relaxed"
                      style={{ color: "var(--act-body)", fontFamily: "var(--font-serif)" }}
                    >
                      {beat.body}
                    </p>
                  ) : null}
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex gap-1.5" aria-hidden="true">
              {beats.map((_, i) => (
                <span
                  key={i}
                  className="h-0.5 flex-1 rounded-full transition-colors duration-300"
                  style={{
                    background: i <= active ? "var(--act-blue)" : "var(--act-hair)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
