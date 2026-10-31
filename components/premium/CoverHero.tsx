"use client";

import type { ReactNode } from "react";

import { FIGURES } from "../../lib/data/figures";
import { LAYERS } from "../../lib/register/tilemap";
import { FIG_COVER_MAP } from "../../lib/register/specs/s0-cover";
import { Portrait } from "../Portrait";
import { BigNumber } from "./BigNumber";
import { CountyStatic } from "./CountyStatic";
import { provenanceOf } from "./ProvPill";

/**
 * The cover hero (brief §10 Cover, G-2).
 *
 * One screen: the title, the portrait, and the county drawn ward by ward, with Kitui Central in
 * blue and the pool in laterite; then the four figures at their true values. It adds no claim.
 *
 * It was a pinned, three-screen WebGL scene (the county in relief, morphing into the tile map).
 * The visual-first pass removed it: WebGL is on that brief's reject list, and the scene put
 * ≈ 300 kB of script and most of the main-thread time on the first screen of a phone on slow 4G.
 * The county is now the server-rendered SVG every reader gets, its outlines traced once by CSS.
 * Under reduced motion, or with no script, it is simply drawn.
 */
const STATS = (FIG_COVER_MAP.chart.type === "composite" ? FIG_COVER_MAP.chart.parts : [])
  .map((p) => p.chart)
  .find((c) => c.type === "stats");

const STAT_PROVENANCE = [
  provenanceOf(FIGURES["register.2026"]),
  provenanceOf(FIGURES["benchmark.2026-equivalent.rounded"]),
  provenanceOf(FIGURES["pool.share"]),
  provenanceOf(FIGURES["result.2022.womanrep.kasalu"]),
];

export function CoverHero({ byline, children }: { byline?: ReactNode; children?: ReactNode }) {
  return (
    <>
      <section className="pf-hero" data-story="false" aria-labelledby="pf-hero-title">
        <div className="pf-hero__stage">
          <div className="pf-hero__glow" aria-hidden="true" />
          <div className="pf-hero__county">
            <CountyStatic id="pf-hero-static" className="pf-hero__static" draw label={`Kitui's 40 wards. ${LAYERS.footprint.description}`} />
          </div>

          <div className="pf-hero__portrait">
            <Portrait id="hero-clasped-hands" sizes="(min-width: 1024px) 34vw, 78vw" priority />
          </div>

          <div className="pf-hero__copy">
            {byline}
            <p className="pf-seal">
              <span className="pf-seal__mark" aria-hidden="true" />
              <strong>Confidential</strong> — personal, link-only.
            </p>
            <h1 id="pf-hero-title" className="pf-hero__title">
              <span className="pf-line"><span>Kitui 2027:</span></span>
              <span className="pf-line"><span>Analysis, Strategy and Direction for Dr. Mulu&rsquo;s Digital Operation</span></span>
            </h1>
            <p className="pf-hero__sub">
              Campaign strategy and digital architecture for Hon. Dr. Benson Makali Mulu, MP for Kitui Central and gubernatorial aspirant, Kitui County.
            </p>
            {children && <div className="pf-hero__controls">{children}</div>}
          </div>

        </div>
      </section>

      <section className="pf-numbers" aria-label="Four figures">
        {STATS?.type === "stats" &&
          STATS.items.map((s, i) => (
            <BigNumber
              key={s.label}
              value={s.value}
              context={s.label}
              provenance={STAT_PROVENANCE[i]}
              tone={i === 2 ? "earth" : i === 0 ? "accent" : "ink"}
            />
          ))}
      </section>
    </>
  );
}
