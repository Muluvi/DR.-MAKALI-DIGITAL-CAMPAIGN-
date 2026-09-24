"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import { FIGURES } from "../../lib/data/figures";
import { group } from "../../lib/data/format";
import type { CountyWard } from "../../lib/premium/county";
import { LAYERS } from "../../lib/register/tilemap";
import { FIG_COVER_MAP } from "../../lib/register/specs/s0-cover";
import { Portrait } from "../Portrait";
import { BigNumber } from "./BigNumber";
import { CountyStatic } from "./CountyStatic";
import { provenanceOf } from "./ProvPill";
import type { SceneTheme } from "../../lib/premium/palette";

const CountyScene = dynamic(() => import("./CountyScene"), { ssr: false });

/**
 * The cover hero (brief §10 Cover, G-2).
 *
 * A pinned stage, three screens of scroll: the county in relief settles to top-down, morphs into
 * the tile map, and the pool resolves last. The portrait stands in front at the start and steps
 * aside as the map needs the room. Every caption is text the document already carries (the
 * tile-map layer and the cover figure's own title and takeaway): the hero adds no claim.
 *
 * Reduced motion, no WebGL, and JavaScript off all get the same composition without the pin: the
 * static county, the portrait, the title, and the four figures at their true values.
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

const SCHEMATIC =
  "Schematic, not to scale. Every ward is one equal tile, because Kitui’s wards differ in area by two orders of magnitude and a true map would let the empty north outweigh the dense centre.";

const noSubscribe = () => () => {};

let glCache: boolean | null = null;
function webglAvailable(): boolean {
  if (glCache !== null) return glCache;
  glCache = probeWebgl();
  return glCache;
}

function probeWebgl(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function CoverHero({ theme, byline, children }: { theme: SceneTheme; byline?: ReactNode; children?: ReactNode }) {
  const reduce = useReducedMotionSafe();
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  // Read once on the client; the server (and hydration) answer "no", so the HTML is the static view.
  const gl = useSyncExternalStore(noSubscribe, webglAvailable, () => false);
  const [picked, setPicked] = useState<CountyWard | null>(null);

  const story = gl && !reduce;

  // One scroll value, written to a ref for the scene and to a custom property for the CSS layers.
  useEffect(() => {
    const el = section.current;
    if (!el || !story) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      progress.current = p;
      el.style.setProperty("--p", p.toFixed(4));
      el.dataset.late = p > 0.22 ? "true" : "false";
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [story]);

  return (
    <>
      <section ref={section} className="pf-hero" data-story={story ? "true" : "false"} aria-labelledby="pf-hero-title">
        <div className="pf-hero__stage">
          <div className="pf-hero__glow" aria-hidden="true" />
          <div className="pf-hero__county">
            {/* Always in the HTML: the reduced-motion, no-WebGL, JS-off and print view. */}
            <CountyStatic id="pf-hero-static" className="pf-hero__static" label={`Kitui's 40 wards. ${LAYERS.footprint.description}`} />
            {story && <CountyScene progress={progress} theme={theme} onPick={setPicked} />}
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

          {story && (
            <ol className="pf-hero__steps" aria-hidden="true">
              <li className="pf-step pf-step--1">
                <b>{LAYERS.register.name}.</b> Registered voters per ward, 2022: the height of each ward.
              </li>
              <li className="pf-step pf-step--2">{SCHEMATIC}</li>
              <li className="pf-step pf-step--3">
                <b>{FIG_COVER_MAP.title}.</b> {FIG_COVER_MAP.takeaway}
              </li>
            </ol>
          )}

          {story && (
            <div className="pf-hero__pick" aria-live="polite">
              {picked ? (
                <p className="pf-pick">
                  <strong>{picked.tile.name}</strong>
                  <span>{picked.tile.constituencyName}</span>
                  <span className="pf-num">{group(picked.tile.voters)} registered voters, 2022</span>
                  <button type="button" onClick={() => setPicked(null)} aria-label="Close">×</button>
                </p>
              ) : (
                <p className="pf-pick pf-pick--hint">Tap a ward for its name and register. Drag sideways to turn the county.</p>
              )}
            </div>
          )}
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
