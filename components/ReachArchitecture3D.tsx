"use client";

import { useEffect, useRef, useState } from "react";

import { CONSTITUENCIES } from "../data/ward-register";
import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";
import { useScrollSelector, type ScrollState } from "../hooks/use-scroll-position";

const selectY = (s: ScrollState) => s.y;

/**
 * The reachability of the county, drawn in depth.
 *
 * This is the document's central strategic claim — that a purely digital campaign addresses
 * roughly one voter in seven, and that the six it misses decide the election — so it is the
 * one place a dimensional illustration earns its keep rather than decorating.
 *
 * Three planes in real perspective: the register at the base, the offline majority above it,
 * and the connected minority as a small pane floating clear of both. The gap between the top
 * two planes is the argument. Every figure is read from the proposal (Sections 1.2.5, 3.1) or
 * from data/ward-register.ts; none is invented, and the build guard in checks/figures.mjs
 * enforces that.
 *
 * Implemented with compositor-only transforms — no WebGL, no new dependency, no measurable
 * cost on a folded Galaxy Fold.
 */

const REGISTER = CONSTITUENCIES.reduce((sum, c) => sum + c.voters, 0);
const ONLINE_PCT = 13.6;
const OFFLINE_PCT = 86.4;

export function ReachArchitecture3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(0);
  // The project's own hook, which also covers motion's pre-hydration null.
  const reduced = useReducedMotionSafe();
  const scrollY = useScrollSelector(selectY);

  // Parallax is driven by how far the illustration has travelled through the viewport.
  //
  // Measured off the shared scroll broker rather than a fifth page-level listener: what is
  // element-specific here is the measurement, not the question of whether the page moved. The
  // broker is already rAF-coalesced, so this still reads layout once per frame at most.
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const progress = 1 - (r.top + r.height / 2) / (window.innerHeight + r.height / 2);
    setDepth(Math.max(0, Math.min(1, progress)));
  }, [reduced, scrollY]);

  // t runs 0 at the edges of travel to 1 at the centre of the viewport: the planes separate as
  // the illustration arrives and settle back as it leaves.
  const t = reduced ? 1 : Math.sin(Math.PI * depth);
  const plane = (z: number, y: number) =>
    reduced ? undefined : { transform: `translate3d(0, ${y * t}px, ${z * t}px)` };

  return (
    <figure className="not-prose bleed-narrow my-8 rounded-2xl border border-line bg-card overflow-hidden">
      <figcaption className="px-4 sm:px-5 pt-4 pb-3 border-b border-line/50">
        <p className="t-label font-mono font-bold uppercase tracking-wider text-muted">
          Reachability of the register
        </p>
        <h4 className="font-serif text-base sm:text-lg font-semibold text-ink mt-1">
          Who a digital-only campaign can reach, and who decides the election
        </h4>
      </figcaption>

      <div ref={ref} className="stage-3d px-3 sm:px-8 py-7 sm:py-10">
        {/* An exploded stack rather than overlapping panes: each plane keeps its own row, so
            the drawing reads the same at 280px as at 1440px and no label can collide with the
            one above it. Depth comes from rotateX plus a z-offset per plane, not from
            overlap. */}
        <div className="mx-auto w-full max-w-[540px] flex flex-col gap-2.5 sm:gap-3">
          {/* Connected minority — smallest, nearest the reader, deliberately dwarfed. */}
          <div
            className="plane-3d relative mx-auto w-[62%] sm:w-[46%] rounded-xl border border-gold/45 bg-gold/[0.12] px-3 py-3 text-center"
            style={plane(110, -6)}
          >
            <div className="sheen-3d" />
            <div className="relative">
              <span className="font-serif text-xl sm:text-2xl font-semibold text-ink tabular-nums leading-none">
                {ONLINE_PCT}%
              </span>
              <span className="block t-micro font-semibold text-muted mt-1 leading-snug">
                reachable on any digital platform
              </span>
            </div>
          </div>

          {/* The gap between the two is the finding. */}
          <div className="plane-3d flex items-center gap-2 px-1" style={plane(70, -3)}>
            <span className="h-px flex-1 bg-gold/40" aria-hidden="true" />
            <span className="t-micro font-mono uppercase tracking-wider text-gold font-bold whitespace-nowrap">
              the gap SMS closes
            </span>
            <span className="h-px flex-1 bg-gold/40" aria-hidden="true" />
          </div>

          {/* Offline majority — the plane the campaign actually has to reach. */}
          <div
            className="plane-3d relative rounded-xl border border-accent/40 bg-accent/[0.12] px-3 py-4 sm:py-5 text-center"
            style={plane(46, 0)}
          >
            <div className="sheen-3d" />
            <div className="relative">
              <span className="font-serif text-3xl sm:text-5xl font-semibold text-ink tabular-nums leading-none">
                {OFFLINE_PCT}%
              </span>
              <span className="block t-label font-semibold text-muted mt-1.5 leading-snug">
                outside the internet-using population
              </span>
              <span className="block t-micro font-mono uppercase tracking-wider text-accent mt-2 leading-snug">
                SMS · USSD · vernacular radio
              </span>
            </div>
          </div>

          {/* Base plane — the whole register, textured with a dot field. */}
          <div
            className="plane-3d relative rounded-xl border border-line/70 bg-paper/70 overflow-hidden h-16 sm:h-20"
            style={plane(0, 4)}
          >
            <svg viewBox="0 0 240 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
              <defs>
                <pattern id="ra-grid" width="6" height="6" patternUnits="userSpaceOnUse">
                  <circle cx="1.4" cy="1.4" r="0.9" className="fill-muted/35" />
                </pattern>
              </defs>
              <rect width="240" height="40" fill="url(#ra-grid)" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="px-2.5 py-1 rounded-md bg-card/85 backdrop-blur-[2px] t-micro font-mono font-bold uppercase tracking-wider text-muted">
                register · {REGISTER.toLocaleString()} voters
              </span>
            </span>
          </div>
        </div>
      </div>

      <p className="px-4 sm:px-5 pb-4 t-small text-muted leading-relaxed">
        Internet penetration of {ONLINE_PCT}% and the resulting {OFFLINE_PCT}% offline share are
        the 2019 KNBS census figures carried in Section 1.2.5; the register total is the IEBC
        ward register in <code className="font-mono">data/ward-register.ts</code>. Reach is not
        votes — this is who can be spoken to, not who has been persuaded.
      </p>
    </figure>
  );
}
