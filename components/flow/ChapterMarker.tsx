"use client";

import { useInView } from "../../hooks/use-in-view";

/**
 * Where one section ends and the next begins, on a page with no tabs to tell you.
 *
 * It carries the four things a reader arriving by scroll needs and cannot otherwise get: the
 * section's number (the document's own addressing system, which every cross-reference uses), its
 * name, what it is for, and how far through the document this is. The last of those is the one
 * the old tab bar gave away for free and a continuous scroll does not.
 *
 * The progress hairline under it is the whole "where am I" answer in one element.
 */
export function ChapterMarker({
  number,
  label,
  blurb,
  position,
  total,
  minutes,
  asTitle = false,
}: {
  number: string;
  label: string;
  blurb: string;
  position: number;
  total: number;
  minutes: number;
  /** On a single-section route there is no hero, so the section's name is the page's one H1. */
  asTitle?: boolean;
}) {
  const Heading = asTitle ? "h1" : "h2";
  const [ref, inView] = useInView<HTMLElement>({ amount: 0.3, margin: "-8% 0px" });
  const pct = Math.round(((position + 1) / total) * 100);

  return (
    <header ref={ref} data-in-view={inView ? "true" : "false"} className="flow-chap">
      <div className="flow-chap__top">
        <span className="flow-chap__num">{number}</span>
        <span className="flow-chap__meta">
          <span className="flow-chap__pos">{position + 1} of {total}</span>
          <span className="flow-chap__dot" aria-hidden="true" />
          <span className="flow-chap__time">{minutes} min</span>
        </span>
      </div>
      <Heading className="flow-chap__label">{label}</Heading>
      <p className="flow-chap__blurb">{blurb}</p>
      <span className="flow-chap__rail" aria-hidden="true">
        <span className="flow-chap__railfill" style={{ "--flow-pct": `${pct}%` } as React.CSSProperties} />
      </span>
    </header>
  );
}
