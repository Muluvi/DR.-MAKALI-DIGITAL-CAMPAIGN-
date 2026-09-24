"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import { ProvPill, type Provenance } from "./ProvPill";

/** The column each digit rolls through. */
const DIGITS = Array.from({ length: 10 }, (_, n) => n);

/**
 * <BigNumber> (brief G-8): display face, number morph, unit beside it, context under it,
 * provenance pill.
 *
 * NEVER ANIMATE TO THE TRUTH. The value is plain text in the server HTML and stays plain text
 * for anyone with reduced motion, JavaScript off, or a printer. The roll happens only after
 * hydration, only once, only when the number enters view: digits scroll up to their final place
 * over a column of 0-9, and the moment the roll ends the DOM goes back to the plain string, so
 * copy, find-in-page and reader mode never see a column of digits.
 */
export function BigNumber({
  value,
  unit,
  context,
  provenance,
  tone = "ink",
  size = "lg",
}: {
  /** The number exactly as printed, e.g. "605,703", "51.7%", "≈200,000–225,000", "Both". */
  value: string;
  unit?: string;
  context: string;
  provenance: Provenance;
  tone?: "ink" | "accent" | "earth";
  size?: "lg" | "md";
}) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const [rolling, setRolling] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (reduce || done.current || !/\d/.test(value)) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();
        setRolling(true);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, value]);

  useEffect(() => {
    if (!rolling) return;
    const t = window.setTimeout(() => setRolling(false), 1300);
    return () => window.clearTimeout(t);
  }, [rolling]);

  let digitIndex = 0;
  return (
    <figure ref={ref} className={`pf-bn pf-bn--${size} pf-tone-${tone}`} style={{ "--chars": Math.max(5, value.length) } as React.CSSProperties}>
      <p className="pf-bn__value">
        {rolling ? (
          <>
            <span className="sr-only">{value}</span>
            <span aria-hidden="true" className="pf-bn__roll">
              {[...value].map((ch, i) => {
                if (!/\d/.test(ch)) return <span key={i}>{ch}</span>;
                const d = Number(ch);
                const delay = digitIndex++ * 55;
                return (
                  <span key={i} className="pf-bn__col">
                    <span className="pf-bn__strip" style={{ "--d": d, animationDelay: `${delay}ms` } as React.CSSProperties}>
                      {DIGITS.map((n) => (
                        <span key={n}>{n}</span>
                      ))}
                    </span>
                    <span className="pf-bn__ghost">{ch}</span>
                  </span>
                );
              })}
            </span>
          </>
        ) : (
          value
        )}
        {unit && <span className="pf-bn__unit">{unit}</span>}
      </p>
      <figcaption className="pf-bn__context">
        <span>{context}</span>
        <ProvPill p={provenance} />
      </figcaption>
    </figure>
  );
}
