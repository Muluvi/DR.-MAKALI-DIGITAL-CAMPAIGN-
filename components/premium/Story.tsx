"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import { WARD_TILES } from "../../lib/geo/wards";
import type { CountyWard } from "../../lib/premium/county";
import type { SceneTheme } from "../../lib/premium/palette";
import { FIG_3_3 } from "../../lib/register/specs/s3-analysis";
import { STORY_STEPS } from "../../lib/premium/story";
import { RegisterFigure } from "../register/Figure";
import type { SceneDriver } from "./CountyScene";
import { CountyStatic } from "./CountyStatic";

const CountyScene = dynamic(() => import("./CountyScene"), { ssr: false });

/**
 * <Story> (brief G-4): the core of the argument, §3.1–§3.4, told over one pinned county.
 *
 *   1  the winning number        the county as ground, each ward as tall as its register
 *   2  where the votes are       the twelve largest wards rise out of the rest
 *   3  the four routes           each route's wards light in turn; Path D is named the trap
 *   4  where he has held office  Kitui Central in blue, the pool in laterite, and the scene
 *                                ends on the equal-tile map the reader meets again below
 *
 * Each step card IS its figure: title, question, chart, takeaway, source with its tier pill, the
 * table in <details> and the CSV link (brief G-4, "all four figures keep their own titles, sources,
 * tables and CSVs inside the story steps"). The story adds no words of its own beyond the step
 * number and the figure's question; where §3.1–§3.4 would have drawn these figures, the section
 * points back up here (STORY_FIGURES, lib/premium/story.ts), so each id exists once.
 * Rules from the brief: one point per step, the page's own scroll (nothing hijacks its speed),
 * and under reduced motion, without WebGL or without script, the steps are simply shown in order
 * beside the static county, with no pin.
 */

const TOP12 = new Set([...WARD_TILES].sort((a, b) => b.voters - a.voters).slice(0, 12).map((t) => t.id));

/** The constituencies each route is built from, read off the paths figure's own bars. */
const NAME_TO_ID = new Map(WARD_TILES.map((t) => [t.constituencyName, t.constituency]));
const PATHS =
  FIG_3_3.chart.type === "paths"
    ? FIG_3_3.chart.groups.map((g) => ({
        title: g.title,
        trap: !!g.tag,
        constituencies: new Set(g.rows[0].segments.map((s) => NAME_TO_ID.get(s.label)).filter(Boolean) as string[]),
        top12: g.rows[0].segments.some((s) => !NAME_TO_ID.has(s.label)),
      }))
    : [];

const STEPS = STORY_STEPS;
const N = STEPS.length;

const clamp = (x: number) => Math.min(1, Math.max(0, x));

const STORY_DRIVER: SceneDriver = {
  pose: (p) => {
    const s = p * N;
    // Tilted for the first three steps, overhead for the fourth, then the tile map.
    const cam = 0.62 + 0.38 * clamp(s - 2.9);
    const morph = clamp((s - 3.35) / 0.45);
    return { cam, morph };
  },
  paint: (w, p, c, out) => {
    const s = Math.min(N - 0.0001, p * N);
    const step = Math.floor(s);
    const t = s - step;
    if (step === 0) {
      out.copy(c.other);
      return 0;
    }
    if (step === 1) {
      out.copy(TOP12.has(w.tile.id) ? c.highlight : c.dim);
      return 0;
    }
    if (step === 2) {
      const path = PATHS[Math.min(PATHS.length - 1, Math.floor(t * PATHS.length))];
      const on = path && (path.top12 ? TOP12.has(w.tile.id) : path.constituencies.has(w.tile.constituency));
      out.copy(on ? (path.trap ? c.pool : c.highlight) : c.dim);
      return 0;
    }
    const k = clamp(t * 3);
    if (w.role === "held") out.copy(c.held);
    else if (w.role === "pool") out.copy(c.dim).lerp(c.pool, k);
    else out.copy(c.dim).lerp(c.other, k);
    return w.role === "pool" ? k * 0.3 : 0;
  },
};

const noSubscribe = () => () => {};
function webgl(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Story({ theme }: { theme: SceneTheme }) {
  const reduce = useReducedMotionSafe();
  const gl = useSyncExternalStore(noSubscribe, webgl, () => false);
  const pinned = gl && !reduce;
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  const [pathIndex, setPathIndex] = useState(0);
  const [, setPicked] = useState<CountyWard | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !pinned) return;
    let frame = 0;
    // Steps now hold whole figures, so they differ in height: progress is read off the step
    // elements themselves (which one has crossed the reading line, and how far through it the
    // reader is), not off the section's height as a whole.
    const steps = [...el.querySelectorAll<HTMLElement>(".pf-story__step")];
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.62;
      let k = 0;
      let t = 0;
      steps.forEach((st, i) => {
        const r = st.getBoundingClientRect();
        if (r.top < line) {
          k = i;
          t = clamp((line - r.top) / Math.max(1, r.height));
        }
      });
      const p = clamp((k + t) / N);
      progress.current = p;
      const s = Math.min(N - 0.0001, p * N);
      setStep(Math.floor(s));
      setPathIndex(Math.min(PATHS.length - 1, Math.floor((s - 2) * PATHS.length)));
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
  }, [pinned]);

  return (
    <section ref={ref} className="pf-story not-prose" data-pinned={pinned ? "true" : "false"} aria-label="The analysis in four steps">
      <div className="pf-story__stage" aria-hidden={pinned ? "true" : undefined}>
        <div className="pf-story__county">
          <CountyStatic id="pf-story-static" className="pf-story__static" label="Kitui's 40 wards: Kitui Central, where he has held office, and the pool in Mwingi and Kitui South, where he has not" />
          {pinned && <CountyScene progress={progress} theme={theme} driver={STORY_DRIVER} onPick={setPicked} />}
        </div>
      </div>
      <ol className="pf-story__steps">
        {STEPS.map((f, i) => (
          <li key={f.id} className="pf-story__step" data-active={pinned && step === i ? "true" : undefined}>
            <div className="pf-story__card">
              <p className="pf-story__n">
                Step {i + 1} of {N} <span>§{f.section}</span>
              </p>
              {i === 2 && (
                <ul className="pf-story__paths">
                  {PATHS.map((p, k) => (
                    <li key={p.title} data-on={pinned && step === 2 && pathIndex === k ? "true" : undefined} data-trap={p.trap ? "true" : undefined}>
                      {p.title}
                      {p.trap && <em> · the trap</em>}
                    </li>
                  ))}
                </ul>
              )}
              <RegisterFigure spec={f} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
