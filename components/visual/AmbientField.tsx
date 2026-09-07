"use client";

import { useMemo } from "react";

interface AmbientFieldProps {
  /**
   * How much field to paint.
   *   - `aurora`  drifting colour wells only
   *   - `full`    aurora + grain + a masked grid
   *   - `quiet`   grain and grid, no motion — for bands that sit behind reading matter
   */
  intensity?: "aurora" | "full" | "quiet";
  /** Number of drifting motes. Zero by default; this is a document, not a screensaver. */
  motes?: number;
  className?: string;
  /** `grid`, `dots` or `diagonal` hatching under the colour. */
  pattern?: "grid" | "dots" | "diagonal" | "none";
}

/**
 * The ambient background field: aurora wells, film grain, a masked pattern and optional motes.
 *
 * Everything is `pointer-events: none`, `contain: strict` and `aria-hidden`, and every layer is
 * transform-animated so the whole field is one composited stack the GPU owns. It is switched off
 * wholesale under `prefers-reduced-motion`, `prefers-reduced-data` and print, in visual-fx.css.
 *
 * The opacity ceiling is the design decision worth defending. This sits behind a document whose
 * argument is carried by ward tables and voter figures; a background that is noticeable while
 * you are reading a number is a background that has failed, however good it looks in isolation.
 */
export function AmbientField({ intensity = "aurora", motes = 0, className = "", pattern = "none" }: AmbientFieldProps) {
  // Positions are deterministic rather than random so server and client render identically and
  // React never reports a hydration mismatch on a decorative layer.
  const moteNodes = useMemo(
    () =>
      Array.from({ length: motes }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        size: 2 + (i % 3),
        dur: 12 + ((i * 7) % 11),
        delay: (i * 1.7) % 9,
        sway: ((i % 5) - 2) * 9,
      })),
    [motes]
  );

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${intensity === "full" ? "fx-grain" : ""} ${className}`}
    >
      {pattern !== "none" && <div className={`absolute inset-0 fx-pattern-${pattern}`} />}

      {intensity !== "quiet" && (
        <div className="fx-aurora fx-ambient-tint">
          <span />
          <span />
          <span />
        </div>
      )}

      {motes > 0 && (
        <div className="fx-motes">
          {moteNodes.map((m, i) => (
            <i
              key={i}
              style={
                {
                  left: m.left,
                  "--fx-size": `${m.size}px`,
                  "--fx-loop-dur": `${m.dur}s`,
                  "--fx-delay": `${m.delay}s`,
                  "--fx-sway": `${m.sway}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
