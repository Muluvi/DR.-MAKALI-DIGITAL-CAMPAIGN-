"use client";

import { motion } from "motion/react";
import { Flag, Trophy } from "lucide-react";

import { STAGE_1_TARGETS, STAGE_2_TARGETS } from "../../data/kpis";
import { useMotionPreset } from "../../hooks/useMotionPreset";
import { STAGGER, drawPath, fadeUp, staggerContainer, VIEWPORT_TALL } from "../../lib/motion";

/**
 * §8.2.3's KPI architecture, as layout rather than as box-drawing characters.
 *
 * The source is a fenced ASCII diagram 70 characters wide. At 390px that is either a horizontal
 * scroll or type shrunk past reading, and this reader is on a phone. It is the widest instance
 * of a pattern the audit found 55 times, so it is the one worth replacing properly.
 *
 * The structure it draws is a claim: two stages, and everything in Stage 1 exists to earn the
 * right to fight Stage 2. So the connector between them is the only thing that draws itself in —
 * the nodes fade up in reading order, and the arrow is what says "and then".
 *
 * Layout is flex, not an SVG viewBox, so it reflows to one column below 640px without a second
 * set of coordinates. The connector is the only SVG, and it is a single stroked path animated on
 * `pathLength` — the one property a browser can interpolate without touching layout.
 *
 * Accessible equivalent: the whole thing is a pair of real headed lists. There is no aria-hidden
 * graphic here, because the graphic IS the list — the boxes are just where the list items sit.
 */

function Stage({
  kicker, title, sub, items, tone,
}: {
  kicker: string;
  title: string;
  sub: string;
  items: string[];
  tone: "nomination" | "general";
}) {
  const { variants, enter } = useMotionPreset();
  const accent = tone === "nomination" ? "text-accent" : "text-gold";
  const edge = tone === "nomination" ? "border-accent/35" : "border-gold/35";
  const Icon = tone === "nomination" ? Flag : Trophy;

  return (
    <motion.div
      variants={variants(staggerContainer(STAGGER.loose))}
      initial={enter("hidden")}
      whileInView="visible"
      viewport={VIEWPORT_TALL}
      className={`flex-1 min-w-0 rounded-2xl border ${edge} bg-card p-4`}
      style={{ boxShadow: "var(--shadow-2)" }}
    >
      <motion.div variants={fadeUp} className="flex items-start gap-2 mb-3">
        <Icon size={16} className={`${accent} shrink-0 mt-0.5`} aria-hidden="true" />
        <div className="min-w-0">
          <div className="t-micro font-black uppercase tracking-widest text-muted">{kicker}</div>
          <h4 className="font-serif t-label font-black text-ink leading-snug">{title}</h4>
          <div className={`t-micro font-bold ${accent} mt-0.5`}>{sub}</div>
        </div>
      </motion.div>
      <ul className="space-y-2">
        {items.map((item) => (
          <motion.li
            key={item}
            variants={fadeUp}
            className="flex items-start gap-2 t-small text-ink leading-snug"
          >
            <span
              aria-hidden="true"
              className={`mt-[0.45em] w-1.5 h-1.5 rounded-full shrink-0 ${
                tone === "nomination" ? "bg-accent" : "bg-gold"
              }`}
            />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export function KpiArchitecture() {
  const { reduce, viewportTall, variants, enter } = useMotionPreset();

  return (
    <figure className="not-prose my-7">
      <figcaption className="mb-3">
        <div className="t-micro font-black uppercase tracking-widest text-muted">
          Victory-anchored KPI monitoring architecture
        </div>
        <p className="t-small text-muted leading-relaxed mt-1">
          Every indicator is anchored to one of two statutory milestones. Stage 1 exists to win
          the right to contest Stage 2.
        </p>
      </figcaption>

      <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
        <Stage
          kicker="Stage 1"
          title="Nomination window targets"
          sub="Primary delegate / voter preference"
          items={STAGE_1_TARGETS}
          tone="nomination"
        />

        {/* The connector. Vertical below 640px, horizontal above — one path each, drawn on
            pathLength so no frame touches layout. Decorative: the sequence it expresses is
            already carried by the reading order of the two lists. */}
        <div aria-hidden="true" className="flex sm:flex-col items-center justify-center shrink-0 py-1 sm:py-0 sm:px-1">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            className="text-muted rotate-90 sm:rotate-0"
          >
            <motion.path
              d="M2 14 H20"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              variants={variants(drawPath)}
              initial={enter("hidden")}
              whileInView="visible"
              viewport={viewportTall}
            />
            <motion.path
              d="M15 8 L21 14 L15 20"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={variants(drawPath)}
              initial={enter("hidden")}
              whileInView="visible"
              viewport={viewportTall}
              transition={reduce ? undefined : { delay: 0.35 }}
            />
          </svg>
        </div>

        <Stage
          kicker="Stage 2"
          title="General election targets"
          sub="Victory threshold: ≥ 200,000 votes"
          items={STAGE_2_TARGETS}
          tone="general"
        />
      </div>
    </figure>
  );
}
