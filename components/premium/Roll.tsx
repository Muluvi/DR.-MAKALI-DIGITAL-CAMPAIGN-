"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/** The column each digit rolls through. */
const DIGITS = Array.from({ length: 10 }, (_, n) => n);

/**
 * Number morph (brief §7.6): digits roll up to their place once, when the number enters view.
 *
 * NEVER ANIMATE TO THE TRUTH. The value is plain text in the server HTML and stays plain text for
 * anyone with reduced motion, JavaScript off, or a printer. The roll happens only after hydration,
 * only once; the moment it ends the DOM goes back to the plain string, so copy, find-in-page and
 * reader mode never see a column of digits. While it runs, the true value is in an sr-only twin.
 */
export function Roll({ value, className = "" }: { value: string; className?: string }) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
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
    <span ref={ref} className={className}>
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
    </span>
  );
}
