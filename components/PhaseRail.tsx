"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Flag, Vote } from "lucide-react";

import { PHASES } from "../lib/phases";
import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";

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

/** Quoted from §8.3. */
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

  return (
    <div ref={ref} className="my-10 not-prose">
      <div className="flex items-baseline justify-between gap-3 mb-6 flex-wrap">
        <div>
          <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
            Phased plan
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink mt-2 tracking-tight">
            August 2026 to August 2027
          </h3>
        </div>
        <span className="t-small text-muted font-mono">5 phases · 12 months</span>
      </div>

      <div className="relative pl-8 sm:pl-10">
        {/* The rail. A static track with a fill that advances on scroll — scaleY, not height. */}
        <div className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-0.5 bg-line" aria-hidden="true" />
        <motion.div
          className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-0.5 bg-accent origin-top"
          style={{ scaleY: reduce ? 1 : fillScale }}
          aria-hidden="true"
        />

        <ol className="space-y-6">
          {PHASES.map((phase, i) => {
            const detail = DETAIL[phase.id];
            const anchor = ANCHORS.find((a) => Math.round(a.at * (PHASES.length - 1)) === i);
            return (
              <li key={phase.id} className="relative">
                {/* Node. Fills with the phase's own colour, which the section headings share. */}
                <span
                  className="absolute -left-8 sm:-left-10 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 bg-paper flex items-center justify-center font-mono t-micro sm:t-label font-black"
                  style={{ borderColor: `var(${phase.colorVar})`, color: `var(${phase.colorVar})` }}
                  aria-hidden="true"
                >
                  {phase.id === "neg1" ? "−1" : phase.id}
                </span>

                <div className="bg-card border border-line rounded-2xl p-4 sm:p-5">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                    <h4 className="font-serif text-base font-bold text-ink">{phase.label}</h4>
                    <span
                      className="t-label font-black uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{
                        color: `var(${phase.colorVar})`,
                        backgroundColor: `color-mix(in srgb, var(${phase.colorVar}) 12%, transparent)`,
                      }}
                    >
                      {phase.window.split(" · ")[0]}
                    </span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed font-medium">{detail?.objective}</p>
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
      </div>
    </div>
  );
}
