"use client";

import React from "react";

/** Line widths for one paragraph of prose, so the silhouette reads as text, not as cards. */
const PARAGRAPHS = [
  [1, 0.97, 0.94, 0.99, 0.62],
  [0.98, 1, 0.91, 0.96, 0.95, 0.4],
  [1, 0.93, 0.97, 0.7],
];

/**
 * The shape of a section that is still on its way (brief G-11): a heading, then paragraphs of
 * prose at the reading measure, then the outline of a figure frame. Static and faint; no pulse,
 * no spinner. The parent reserves the section's measured height, so nothing moves when the real
 * text arrives.
 */
export function SectionSkeleton() {
  return (
    <div className="pf-skel-section" aria-hidden="true">
      <span className="pf-skel-section__h" />
      {PARAGRAPHS.map((lines, i) => (
        <div key={i} className="pf-skel-section__p">
          {lines.map((w, j) => (
            <span key={j} style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      ))}
      <div className="pf-skel-section__fig">
        <span className="pf-skel__title" />
        <span className="pf-skel__sub" />
        <div className="pf-skel__plot">
          {[0.9, 0.72, 0.55].map((w, i) => (
            <span key={i} className="pf-skel__bar">
              <i style={{ width: `${w * 100}%` }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
