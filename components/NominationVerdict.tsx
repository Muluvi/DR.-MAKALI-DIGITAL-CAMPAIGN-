"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { TrendingDown, CalendarClock, Vote } from "lucide-react";

import { EASE_ENTRANCE, VIEWPORT } from "../lib/motion";
import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";
import { TierBadge } from "./markdown/TierBadge";

/**
 * M1 — the site's opening claim, and its one choreographed moment.
 *
 * The reason this proposal exists is that Dr. Mulu is 15.3 points behind in a contest decided by
 * opinion poll rather than by primary. That arrived as the fourth paragraph of §1.1, underneath a
 * hero of three generic stat cards whose progress bars (76% / 86% / 92%) measured nothing.
 *
 * The motion is the argument: the two poll shares separate from a shared baseline while the
 * deficit counts up to the gap between them. A deficit is something that OPENED — showing it
 * opening says more than a number sitting still does. This is the only surface on the site that
 * does this; §3's kinetic type is the only other place motion is the event.
 *
 * Every figure is from exec.md §1.1 (Mizani Africa, 7 August 2026) and §5.1.
 */

/** exec.md §1.1, the 7 August 2026 Mizani survey. */
const POLL = {
  date: "7 August 2026",
  source: "Mizani Africa",
  leader: { name: "Dr. Irene Kasalu", share: 37.4 },
  mulu: { name: "Dr. Makali Mulu", share: 22.1 },
};

/** 37.4 − 22.1. Derived, not asserted — see DerivedFigureDrawer for the same working. */
const DEFICIT = Math.round((POLL.leader.share - POLL.mulu.share) * 10) / 10;

/** The June 2026 reading, for the direction of travel. §1.1. */
const PRIOR = { leader: 31.3, mulu: 20.2, deficit: 11.1 };

const SCALE_MAX = 45;

function useCountUp(target: number, active: boolean, reduce: boolean, duration = 900) {
  const [progressed, setProgressed] = useState(0);

  useEffect(() => {
    // Under reduced motion the number is simply present — no effect, no frame loop.
    if (reduce || !active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Expo-out, matching EASE_ENTRANCE so the number settles with everything else.
      const eased = 1 - Math.pow(2, -10 * t);
      setProgressed(t < 1 ? eased : 1);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce, duration]);

  if (reduce) return target;
  return Math.round(target * progressed * 10) / 10;
}

export function NominationVerdict() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();
  const deficit = useCountUp(DEFICIT, inView, reduce);

  // The bars separate from a shared baseline. Under reduce they are simply drawn apart.
  const barTransition = reduce
    ? { duration: 0 }
    : { duration: 0.72, ease: EASE_ENTRANCE, delay: 0.18 };

  return (
    <section
      ref={ref}
      aria-labelledby="nomination-verdict-heading"
      className="relative bg-card border border-line rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="p-5 sm:p-7 lg:p-8">
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
            The immediate contest
          </span>
          <TierBadge tier={2} compact />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-7 lg:gap-10 items-start">
          {/* The number, once, at scale. */}
          <div>
            <h2 id="nomination-verdict-heading" className="sr-only">
              Dr. Mulu trails by {DEFICIT} percentage points
            </h2>
            <div className="flex items-start gap-2">
              <span className="font-serif text-[3.5rem] sm:text-[4.75rem] lg:text-[5.5rem] leading-[0.86] font-semibold text-ink tabular-nums tracking-tight">
                {reduce ? DEFICIT.toFixed(1) : deficit.toFixed(1)}
              </span>
              <span className="font-serif text-xl sm:text-2xl font-semibold text-muted mt-2">pts</span>
            </div>
            <p className="text-sm sm:text-base text-ink font-semibold mt-3 leading-snug max-w-[34ch]">
              behind in the survey that will choose the Wiper flagbearer.
            </p>
            <p className="text-xs text-muted mt-3 leading-relaxed max-w-[40ch]">
              The party is selecting by opinion poll, not by competitive primary. There is no
              delegate contest to organise — the number above <em>is</em> the ballot.
            </p>

            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-muted">
              <TrendingDown size={13} className="text-rose-500 shrink-0" aria-hidden="true" />
              <span>
                Widened from {PRIOR.deficit} points in June 2026. The trend is moving the wrong way.
              </span>
            </div>
          </div>

          {/* The two shares, separating from a shared baseline. */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted">
                {POLL.source}, {POLL.date}
              </span>
              <span className="text-[10px] text-muted">First-choice preference</span>
            </div>

            <div className="space-y-4">
              {[POLL.leader, POLL.mulu].map((c, i) => {
                const isMulu = c.name === POLL.mulu.name;
                return (
                  <div key={c.name}>
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <span className={`text-sm font-bold ${isMulu ? "text-accent" : "text-ink"}`}>{c.name}</span>
                      <span
                        className={`font-mono text-lg font-black tabular-nums ${
                          isMulu ? "text-accent" : "text-ink"
                        }`}
                      >
                        {c.share}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-line/50 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full origin-left ${isMulu ? "bg-accent" : "bg-ink/70"}`}
                        style={{ width: `${(c.share / SCALE_MAX) * 100}%` }}
                        initial={{ scaleX: reduce ? 1 : 0 }}
                        animate={inView || reduce ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ ...barTransition, delay: reduce ? 0 : 0.18 + i * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* The date rail: what has to happen, and by when. §5.1. */}
            <div className="mt-6 pt-5 border-t border-line/60 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CalendarClock size={15} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted">Nomination window</div>
                  <div className="text-xs font-bold text-ink mt-0.5">Aug–Sep 2026</div>
                  <div className="text-[10px] text-muted">Phase −1</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Vote size={15} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted">General election</div>
                  <div className="text-xs font-bold text-ink mt-0.5">10 August 2027</div>
                  <div className="text-[10px] text-muted">Threshold ≈200,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
