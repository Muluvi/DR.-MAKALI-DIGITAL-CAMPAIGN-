"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import { WARD_TILES } from "../../lib/geo/wards";
import { FIG_3_3 } from "../../lib/register/specs/s3-analysis";
import { STORY_STEPS } from "../../lib/premium/story";
import { RegisterFigure } from "../register/Figure";
import { CountyStatic } from "./CountyStatic";

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
 * and under reduced motion or without script the steps are simply shown in order beside the
 * county in its role colouring, with no pin. The county is the server-rendered SVG; the WebGL
 * scene it replaced is gone (visual-first pass, October 2026).
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

/**
 * The wards a step lights, or null for the role colouring (Kitui Central held, the pool woven).
 * Step 1 is the whole county, step 2 the twelve largest wards, step 3 each route in turn, step 4
 * the roles. The step card beside the map says in words what is lit, so no step is read from
 * colour alone.
 */
const ALL = new Set(WARD_TILES.map((t) => t.id));
function litFor(step: number, pathIndex: number): { lit: ReadonlySet<string> | null; trap: boolean } {
  if (step === 0) return { lit: ALL, trap: false };
  if (step === 1) return { lit: TOP12, trap: false };
  if (step === 2) {
    const path = PATHS[Math.max(0, pathIndex)];
    if (!path) return { lit: null, trap: false };
    const lit = path.top12 ? TOP12 : new Set(WARD_TILES.filter((t) => path.constituencies.has(t.constituency)).map((t) => t.id));
    return { lit, trap: path.trap };
  }
  return { lit: null, trap: false };
}

export function Story() {
  const reduce = useReducedMotionSafe();
  const pinned = !reduce;
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [pathIndex, setPathIndex] = useState(0);

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
          <CountyStatic
            id="pf-story-static"
            className="pf-story__static"
            label="Kitui's 40 wards: Kitui Central, where he has held office, and the pool in Mwingi and Kitui South, where he has not"
            {...(pinned ? litFor(step, pathIndex) : {})}
          />
        </div>
      </div>
      <ol className="pf-story__steps">
        {STEPS.map((f, i) => (
          <li key={f.id} className="pf-story__step" data-active={pinned && step === i ? "true" : undefined}>
            <div className="pf-story__card">
              <p className="pf-story__n">
                Step {i + 1} of {N}
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
