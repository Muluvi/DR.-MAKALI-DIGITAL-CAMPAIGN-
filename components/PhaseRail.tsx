"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Flag, Vote } from "lucide-react";

import { PHASES } from "../lib/phases";
import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";
import { SPRING } from "../lib/motion";

/**
 * M4 — the phased plan on a real calendar, Aug 2026 to Aug 2027.
 *
 * The one surface on the site that is scroll-scrubbed, and the one place 01–05 markers are
 * earned: a campaign timeline is irreducibly sequential, so the rail advancing as the reader
 * descends is the content, not an effect. Everywhere else on the site, sequence markers would be
 * decoration on something that isn't a sequence.
 *
 * Scrubbing hijacks scroll, which is exactly what a reader with `prefers-reduced-motion` has
 * asked not to happen. Under reduce the rail is drawn complete, the sticky pin is released, and
 * all five phases are visible at once — a different finished layout, not a degraded one.
 *
 * Phase windows and colours come from lib/phases.ts, which the section headings and the
 * phase-scoped charts already share, so the rail cannot drift from them.
 */

interface PhaseDetail {
  id: string;
  objective: string;
  highlights: string[];
}

/** Quoted from §9.1. */
const DETAIL: Record<string, PhaseDetail> = {
  neg1: {
    id: "neg1",
    objective:
      "Close the measured preference deficit ahead of the Wiper flagbearer decision, which party sources indicate is intended to conclude before the final quarter of 2026.",
    highlights: [
      "Week 1 competitive digital baseline audit",
      "Message lab tests the central hypothesis before budget is committed",
      "Geofenced reach into Mwingi and the arid belt",
    ],
  },
  "0": {
    id: "0",
    objective: "Stand up the infrastructure the rest of the plan runs on.",
    highlights: [
      "Weeks 1–2: competitor analysis, structural gaps and opportunities",
      "Weeks 3–4: pages, website, analytics and donation portal live",
      "USSD shared code commissioned — 5–7 working days to set up",
    ],
  },
  "1": {
    id: "1",
    objective: "Build reach and an active community across all 40 wards.",
    highlights: [
      "Daily multilingual content on a structured calendar",
      "Weekly Facebook Live town halls, Thursdays 19:00–20:00 EAT",
      "SMS programme scales to all 40 wards",
      "Zone allocation 25% Anchor / 25% Mwingi / 30% Arid Belt / 20% rotating",
    ],
  },
  "2": {
    id: "2",
    objective: "Move preference, ward by ward, on the issues each ward actually raises.",
    highlights: [
      "Ward-specific ads — water in Ikutha, mango prices in Kitui West, market fees in Mwingi Central",
      "Disclosed partnerships with Kitui influencers and community leaders",
      "Diaspora webinars every three weeks across the 26-country footprint",
      "Vision video and digital manifesto with KSL and plain-language versions",
    ],
  },
  "3": {
    id: "3",
    objective: "Convert measured support into votes cast.",
    highlights: [
      "Digital and SMS voter registration drives; pledge-to-vote cards",
      "Ward-level WhatsApp command centres for real-time verification",
    ],
  },
};

/** Fixed calendar anchors the rail is measured against. */
const ANCHORS = [
  { at: 0.14, label: "Nomination decision", sub: "Before Q4 2026", icon: Flag },
  { at: 1, label: "General election", sub: "10 August 2027", icon: Vote },
];

export function PhaseRail() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();

  // Progress across the rail's own height, so the fill tracks the reader's position in it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"], // verify-figures-ignore — scroll offsets, not data
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Which phase the reader is standing in.
  //
  // Observed from the cards themselves rather than derived from scroll progress, because the two
  // disagree on a phone: below 768px the track lays out horizontally, so vertical progress says
  // "Phase 2" while the card on screen says "Phase −1". An IntersectionObserver rooted on the
  // track is right in both orientations — the card most in view is the phase being read.
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.querySelectorAll<HTMLLIElement>("li[data-phase-index]"));
    if (items.length === 0) return;

    const ratios = new Map<number, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.phaseIndex);
          ratios.set(i, e.intersectionRatio);
        }
        let best = 0;
        let bestRatio = -1;
        for (const [i, r] of ratios) {
          if (r > bestRatio) { bestRatio = r; best = i; }
        }
        setActive(best);
      },
      // Thresholds rather than a single one, so the winner changes as a card slides rather than
      // only when it crosses a line.
      { threshold: [0.25, 0.5, 0.75, 1] },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  // The pane's indicator travels on a spring rather than snapping, so the advance reads as
  // progress through a plan rather than as a tab changing.
  const indicator = useSpring(active, SPRING.gentle);
  const indicatorX = useTransform(indicator, (i) => `${(i / PHASES.length) * 100}%`);
  const activePhase = PHASES[active];

  return (
    <div ref={ref} className="my-10 not-prose">
      <div className="flex items-baseline justify-between gap-3 mb-6 flex-wrap">
        <div>
          <span className="t-label font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded">
            Phased plan
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink mt-2 tracking-tight">
            August 2026 to August 2027
          </h3>
        </div>
        <span className="t-small text-muted font-mono">5 phases · 12 months</span>
      </div>

      {/*
        The sticky pane. The narrative scrolls past it; it says which phase that narrative is in.
        A twelve-month plan read on a phone loses its place faster than any other content on this
        site — five phases, twenty-odd commitments, and no way to tell Phase 1 from Phase 2 once
        the heading has scrolled away. This is that heading, pinned.

        Under reduced motion it is not sticky at all: pinning a pane while the page moves beneath
        it is the class of effect the preference exists to switch off, and the phase labels are
        on every card anyway.
      */}
      <div
        className={`${reduce ? "" : "sticky top-[4.5rem] z-20"} mb-5 rounded-2xl border border-line bg-card/95 backdrop-blur-md px-4 py-3`}
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <div className="t-micro font-black text-muted">
              Now reading
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className="font-serif t-label font-black"
                style={{ color: `var(${activePhase.colorVar})` }}
              >
                {activePhase.label}
              </span>
              <span className="t-small text-muted truncate">
                {activePhase.window.split(" · ")[1]}
              </span>
            </div>
          </div>
          <span className="t-micro font-mono tabular-nums text-muted shrink-0">
            {active + 1}/{PHASES.length}
          </span>
        </div>
        {/* One indicator that travels, rather than five that light up. */}
        <div className="relative mt-2 h-1 rounded-full bg-line/50 overflow-hidden" aria-hidden="true">
          <motion.span
            className="absolute inset-y-0 rounded-full"
            style={{
              left: reduce ? 0 : indicatorX,
              width: `${100 / PHASES.length}%`,
              background: `var(${activePhase.colorVar})`,
            }}
          />
        </div>
      </div>

      {/* Below 768px the same list lays out horizontally and snaps, because a vertical rail on a
          phone is five full screens of scrolling to see five phases and no way to compare them.
          One <ol>, two layouts — not two lists, which would put every phase in the DOM twice. */}
      <div className="relative md:pl-10">
        {/* The vertical rail, desktop only. A static track with a fill that advances on scroll —
            scaleY, not height. */}
        <div className="hidden md:block absolute left-[15px] top-2 bottom-2 w-0.5 bg-line" aria-hidden="true" />
        <motion.div
          className="hidden md:block absolute left-[15px] top-2 bottom-2 w-0.5 bg-accent origin-top"
          style={{ scaleY: reduce ? 1 : fillScale }}
          aria-hidden="true"
        />

        <ol ref={trackRef} className="phase-track flex md:block gap-3 md:gap-0 md:space-y-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0">
          {PHASES.map((phase, i) => {
            const detail = DETAIL[phase.id];
            const anchor = ANCHORS.find((a) => Math.round(a.at * (PHASES.length - 1)) === i);
            return (
              <li key={phase.id} data-phase-index={i} className="relative shrink-0 w-[84%] xs:w-[78%] md:w-auto snap-center md:snap-align-none">
                {/* Node. Fills with the phase's own colour, which the section headings share. */}
                <span
                  className="hidden md:flex absolute -left-10 top-1 w-8 h-8 rounded-full border-2 bg-paper items-center justify-center font-mono t-label font-black"
                  style={{ borderColor: `var(${phase.colorVar})`, color: `var(${phase.colorVar})` }}
                  aria-hidden="true"
                >
                  {phase.id === "neg1" ? "−1" : phase.id}
                </span>

                <div className="bg-card border border-line rounded-2xl p-4 sm:p-5">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                    <h4 className="font-serif text-base font-bold text-ink">{phase.label}</h4>
                    <span
                      className="t-label font-black px-2 py-0.5 rounded"
                      style={{
                        color: `var(${phase.colorVar})`,
                        backgroundColor: `color-mix(in srgb, var(${phase.colorVar}) 12%, transparent)`,
                      }}
                    >
                      {phase.window.split(" · ")[0]}
                    </span>
                  </div>
                  <p className="t-label text-ink leading-relaxed font-medium">{detail?.objective}</p>
                  {detail && (
                    <ul className="mt-3 pt-3 border-t border-line/50 space-y-1.5">
                      {detail.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 t-small text-muted leading-relaxed">
                          <span
                            className="w-1 h-1 rounded-full shrink-0 mt-1.5"
                            style={{ backgroundColor: `var(${phase.colorVar})` }}
                            aria-hidden="true"
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {anchor && (
                  <div className="flex items-center gap-2 mt-3 ml-1 t-small">
                    <anchor.icon size={13} className="text-gold shrink-0" aria-hidden="true" />
                    <span className="font-bold text-ink">{anchor.label}</span>
                    <span className="text-muted">{anchor.sub}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* The horizontal progress rail, mobile only: where you are in five phases, at a glance,
            without having to scroll the track to find out. */}
        <div className="md:hidden mt-1 h-1 rounded-full bg-line/50 overflow-hidden" aria-hidden="true">
          <motion.div
            className="h-full rounded-full bg-accent origin-left"
            style={{ scaleX: reduce ? 1 : fillScale }}
          />
        </div>
      </div>
    </div>
  );
}
