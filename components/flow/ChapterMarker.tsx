"use client";

import { useInView } from "../../hooks/use-in-view";
import { PartDots } from "./PartDots";

/**
 * Where one section ends and the next begins, on a page with no tabs to tell you.
 *
 * It answers "where am I?" in words, once: the part this section belongs to, six dots for the six
 * parts, the section's name and what it is for. There is no section number and no "3 of 36"
 * position: a website is navigated by name, and two counters that disagree only confuse.
 *
 * The section number still exists as the anchor id, so every shared link keeps working.
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

  return (
    <header ref={ref} data-in-view={inView ? "true" : "false"} className="flow-chap">
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
