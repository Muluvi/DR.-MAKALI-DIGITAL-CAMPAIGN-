"use client";

import { useEffect, useState } from "react";

import { useInView } from "../../hooks/use-in-view";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import { PartDots } from "./PartDots";

/**
 * Where one section ends and the next begins, on a page with no tabs to tell you.
 *
 * It answers "where am I?" in words, once: the part this section belongs to, six dots for the six
 * parts, the section's name and what it is for. There is no section number and no "3 of 36"
 * position: a website is navigated by name, and two counters that disagree only confuse.
 *
 * The section number still exists as the anchor id, so every shared link keeps working.
 *
 * ARRIVAL. As the marker comes into view it announces itself: the part label, then the name
 * rising into place, then the rule drawing in (app/globals.css, "section arrival", which also
 * records why the head is not a scroll-snap point). The entrance is armed only for a marker still below the fold when the page mounts,
 * so the server HTML, a reader without script, a reader who lands on it from a link and a reader
 * with reduced motion all see it complete and never hidden.
 */
export function ChapterMarker({
  partLabel,
  actId,
  label,
  blurb,
  asTitle = false,
}: {
  partLabel: string | null;
  actId: string | null;
  label: string;
  blurb: string;
  /** On a single-section route there is no hero, so the section's name is the page's one H1. */
  asTitle?: boolean;
}) {
  const Heading = asTitle ? "h1" : "h2";
  const [ref, inView] = useInView<HTMLElement>({ amount: 0.3, margin: "-8% 0px" });
  const reduce = useReducedMotionSafe();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    // Arming is a one-off read of where the marker sits at mount, not state derived from props:
    // a marker already on screen (or above it) must never be hidden for an entrance.
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [ref, reduce]);

  return (
    <header
      ref={ref}
      data-in-view={inView ? "true" : "false"}
      data-armed={armed && !reduce ? "true" : undefined}
      className="flow-chap"
    >
      {partLabel ? (
        <div className="flow-chap__top">
          <span className="flow-chap__num">{partLabel}</span>
          <PartDots actId={actId} className="flow-chap__meta" />
        </div>
      ) : null}
      <Heading className="flow-chap__label">{label}</Heading>
      <p className="flow-chap__blurb">{blurb}</p>
      <span className="flow-chap__rail" aria-hidden="true">
        <span className="flow-chap__railfill" style={{ "--flow-pct": "100%" } as React.CSSProperties} />
      </span>
    </header>
  );
}
