"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import type { FlowAct } from "../../lib/flow";
import { Portrait, type PortraitId } from "../Portrait";
import { CountyStatic } from "./CountyStatic";

/**
 * An act opener (brief G-3): a full-viewport chapter seam, replacing the thin ActMarker line.
 *
 * Back to front: the kiondo weave field, the county (quiet, static SVG: one WebGL context per
 * page is the budget, and the hero owns it), the act numeral in the display face, the portrait
 * cut-out, and the copy. On scroll the layers move at different rates, gently, and the title
 * gains weight as it settles (the variable axis doing work). Reduced motion: every layer still,
 * the title at its final weight.
 *
 * Every word comes from lib/flow.ts: the act's label and blurb. Nothing is written for it.
 */
export function ActOpener({ act, index, total, portrait, id }: { act: FlowAct; index: number; total: number; portrait: PortraitId; id: string }) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false);
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII"][index] ?? String(index + 1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) return;
    // Arm the reveal only for an opener still below the fold: the server HTML shows it complete,
    // and a reader who arrives on it (or has no script) never sees it hidden.
    if (el.getBoundingClientRect().top > window.innerHeight * 0.6) setArmed(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.35 });
    io.observe(el);
    let frame = 0;
    const read = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      // -1 as the opener enters from below, 0 when it fills the screen, 1 as it leaves above.
      const t = Math.max(-1, Math.min(1, -r.top / window.innerHeight));
      el.style.setProperty("--t", t.toFixed(4));
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", on);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  const answers = act.blurb.charAt(0).toLowerCase() + act.blurb.slice(1);

  return (
    <section ref={ref} className="pf-act print:break-before-page" data-armed={armed ? "true" : undefined} data-in-view={inView ? "true" : undefined} aria-labelledby={`${id}-title`}>
      <div className="pf-act__weave" aria-hidden="true" />
      <div className="pf-act__county" aria-hidden="true">
        <CountyStatic id={`${id}-county`} quiet />
      </div>
      <span className="pf-act__numeral" aria-hidden="true">{roman}</span>
      <div className="pf-act__portrait">
        <Portrait id={portrait} sizes="(min-width: 1024px) 40vw, 86vw" />
      </div>
      <div className="pf-act__copy">
        <p className="pf-act__count">
          Act {roman} <span aria-hidden="true">·</span> {index + 1} of {total}
        </p>
        <h2 id={`${id}-title`} className="pf-act__title">
          <span className="pf-line"><span>{act.label}</span></span>
        </h2>
        <p className="pf-act__answers">
          <span className="pf-act__answers-k">This act answers</span>
          <span className="pf-line"><span>{answers}.</span></span>
        </p>
      </div>
    </section>
  );
}
