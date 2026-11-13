"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { WifiOff, Wifi } from "lucide-react";

import { useMotionPreset } from "../../hooks/useMotionPreset";
import { AnimatedNumber } from "../visual/AnimatedNumber";
import { FIGURES } from "../../lib/data/figures";
import { formatFigure } from "../../lib/data/format";

/**
 * 73.8% offline, drawn to scale.
 *
 * This is the most strategically important number in the proposal and it is routinely drawn as a
 * donut, where 86% and 14% are two arcs of the same ring and the eye reads them as two options.
 * They are not two options. One is nearly the whole county and the other is a sliver, and the
 * campaign's entire digital plan has to be built for the sliver's opposite.
 *
 * So: a waterline. The connected 26.2% is the band of air at the top; everything beneath the
 * line is the 73.8% the internet does not reach. The submerged mass fills as the reader arrives,
 * and it keeps filling past the fold — you cannot see the bottom of it in one screen, which is
 * the argument made as a physical fact rather than as a percentage.
 *
 * Both figures are the current CA/KNBS 2023/24 rates (Tier 1), read from the figure registry.
 * The 2019 census rate (13.6%, 143,340 people) is kept as the comparison, not drawn as current.
 *
 * Motion contract: the water is `scaleY` from a bottom origin — composited, no layout. Under
 * reduced motion it renders at full depth immediately, because a half-filled tank would state a
 * proportion nobody measured.
 */

const OFFLINE = Number(formatFigure(FIGURES["ict.offline"]));
const ONLINE = Number(formatFigure(FIGURES["ict.internet"]));
const ONLINE_2019 = Number(formatFigure(FIGURES["ict.internet.2019"]));
const USERS_2019 = FIGURES["ict.internet.2019.people"].value as number;

export function OfflineWaterline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const { reduce, spring, enter } = useMotionPreset();
  const filled = reduce || inView;

  return (
    <section
      ref={ref}
      className="not-prose my-7 rounded-2xl border border-line bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-labelledby="waterline-title"
    >
      <div className="p-4 sm:p-5 pb-3">
        <p className="eyebrow-label">Connectivity, to scale</p>
        <h4 id="waterline-title" className="font-serif t-figure font-black text-ink leading-none mt-1">
          <AnimatedNumber value={OFFLINE} decimals={1} suffix="%" className="text-accent" />{" "}
          <span className="t-label font-bold text-ink align-middle">are offline</span>
        </h4>
        <p className="t-small text-muted leading-relaxed mt-2">
          {ONLINE}% of residents use the internet (CA/KNBS 2023/24, Tier 1), up from{" "}
          {ONLINE_2019}% in the 2019 census.
        </p>
      </div>

      {/* The tank. aria-hidden: the figures are in the heading and the list below. */}
      <div aria-hidden="true" className="relative mx-4 sm:mx-5 mb-4 h-64 sm:h-80 rounded-xl overflow-hidden bg-paper border border-line/60">
        {/* The connected band — a real share of the height, not a legend swatch. */}
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 px-3 border-b border-dashed border-accent/50"
          style={{ height: `${ONLINE}%` }}
        >
          <span className="inline-flex items-center gap-1.5 t-micro font-black text-accent">
            <Wifi size={12} aria-hidden="true" />
            {ONLINE}% online
          </span>
          <span className="t-micro text-muted">CA/KNBS 2023/24</span>
        </div>

        {/* The submerged majority. */}
        <motion.div
          className="absolute inset-x-0 bottom-0 origin-bottom"
          style={{ height: `${OFFLINE}%` }}
          initial={enter({ scaleY: 0 })}
          animate={filled ? { scaleY: 1 } : { scaleY: 0 }}
          transition={spring("heavy")}
        >
          {/* --waterline-fill is defined with the palette, not here: see globals.css for why the
              stops are fixed rather than derived from the theme's ink and dark tokens. */}
          <div className="absolute inset-0" style={{ background: "var(--waterline-fill)" }} />
          <div className="absolute inset-0 fx-pattern-diagonal opacity-[0.08]" />
          {/* The surface itself, so the line between the two states is a thing you can see. */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-accent/70" />
        </motion.div>

        {/* The label rides on the water rather than floating over it. */}
        <motion.div
          className="absolute inset-x-0 px-3"
          style={{ top: `${ONLINE}%` }}
          initial={enter({ opacity: 0, y: -6 })}
          animate={filled ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
          transition={{ delay: reduce ? 0 : 0.4 }}
        >
          <div className="pt-3 flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 t-micro font-black text-on-accent">
              <WifiOff size={12} aria-hidden="true" />
              {OFFLINE}% offline
            </span>
          </div>
          <p className="mt-1 t-small font-semibold text-on-accent max-w-[26ch] leading-snug">
            The campaign has to reach these voters without the internet.
          </p>
        </motion.div>
      </div>

      {/* The accessible equivalent. */}
      <dl className="px-4 sm:px-5 pb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line/60 bg-paper p-3">
          <dt className="t-micro font-black text-accent">Active internet use</dt>
          <dd className="t-label font-black text-ink tabular-nums mt-0.5">{ONLINE}%</dd>
          <dd className="t-micro text-muted">up from {ONLINE_2019}% ({USERS_2019.toLocaleString()} people) in 2019</dd>
        </div>
        <div className="rounded-xl border border-line/60 bg-paper p-3">
          <dt className="t-micro font-black text-muted">Offline majority</dt>
          <dd className="t-label font-black text-ink tabular-nums mt-0.5">{OFFLINE}%</dd>
          <dd className="t-micro text-muted">of residents, CA/KNBS 2023/24</dd>
        </div>
      </dl>
    </section>
  );
}
