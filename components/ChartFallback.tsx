"use client";

/**
 * Reserved space for a chart block while its runtime loads (brief G-11): shaped like the figure
 * that is coming, never a generic spinner or a pulsing box.
 *
 * The height is held so the page does not shift under the reader's thumb mid-scroll. The
 * silhouette is static and faint: it says "a bar chart goes here" or "a map goes here" without
 * pretending to be data, and without a loop that implies something is live.
 */
export type SkeletonShape = "bars" | "lines" | "map" | "table" | "scatter";

const BARS = [0.92, 0.78, 0.64, 0.55, 0.41];

export function ChartFallback({ height = 320, shape = "bars" }: { height?: number; shape?: SkeletonShape }) {
  return (
    <div className="pf-skel not-prose" data-shape={shape} style={{ minHeight: height }} aria-hidden="true">
      <span className="pf-skel__title" />
      <span className="pf-skel__sub" />
      <div className="pf-skel__plot">
        {shape === "bars" &&
          BARS.map((w, i) => (
            <span key={i} className="pf-skel__bar">
              <i style={{ width: `${w * 100}%` }} />
            </span>
          ))}
        {shape === "lines" && (
          <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="pf-skel__svg">
            <path d="M0 96 L60 80 L120 84 L180 52 L240 44 L300 20" />
            <path d="M0 108 L60 102 L120 96 L180 90 L240 86 L300 76" />
          </svg>
        )}
        {shape === "map" && (
          <div className="pf-skel__tiles">
            {Array.from({ length: 40 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        )}
        {shape === "table" &&
          Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="pf-skel__row">
              <i />
              <i />
              <i />
            </span>
          ))}
        {shape === "scatter" && (
          <svg viewBox="0 0 300 160" className="pf-skel__svg">
            <line x1="150" y1="0" x2="150" y2="160" />
            <line x1="0" y1="80" x2="300" y2="80" />
            {[
              [60, 40],
              [210, 50],
              [100, 120],
              [240, 110],
              [180, 30],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
