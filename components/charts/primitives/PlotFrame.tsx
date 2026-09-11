"use client";

import type { ReactNode } from "react";

/**
 * A plot area with HTML axes around an SVG canvas.
 *
 * The split is the whole design: the marks are SVG, because a line and a scatter genuinely need
 * one; the axis ticks, the labels and the legend are HTML, because SVG text scales with the
 * viewBox and a 10px tick becomes a 5px tick at phone width. Keeping the type outside the SVG is
 * what lets one chart serve a 320px screen and a laptop without a measurement pass.
 *
 * The SVG itself uses a 0-100 coordinate space in both axes with `preserveAspectRatio="none"`,
 * so callers position marks in percentages and the canvas stretches to whatever box it is given.
 * Nothing inside it is text, so nothing distorts.
 */
export interface Scale {
  /** Data value -> 0-100 across the plot. */
  x: (v: number) => number;
  /** Data value -> 0-100 up the plot (already flipped for SVG's downward y). */
  y: (v: number) => number;
}

export function PlotFrame({
  height = 200,
  xTicks,
  yTicks,
  formatX = (v) => String(v),
  formatY = (v) => String(v),
  xLabel,
  yLabel,
  domain,
  children,
}: {
  height?: number;
  xTicks: number[];
  yTicks: number[];
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
  xLabel?: string;
  yLabel?: string;
  domain: { x: [number, number]; y: [number, number] };
  children: (scale: Scale) => ReactNode;
}) {
  const [x0, x1] = domain.x;
  const [y0, y1] = domain.y;
  const scale: Scale = {
    x: (v) => ((v - x0) / (x1 - x0 || 1)) * 100,
    y: (v) => 100 - ((v - y0) / (y1 - y0 || 1)) * 100,
  };

  return (
    <div>
      {yLabel ? <p className="t-micro font-bold text-muted mb-1">{yLabel}</p> : null}
      <div className="flex gap-2">
        <div
          className="flex flex-col justify-between shrink-0 t-micro text-muted font-semibold tabular-nums text-right"
          style={{ height }}
          aria-hidden="true"
        >
          {[...yTicks].reverse().map((t) => (
            <span key={t} className="leading-none">{formatY(t)}</span>
          ))}
        </div>

        <div className="relative flex-1 min-w-0" style={{ height }}>
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" aria-hidden="true">
            {yTicks.map((t) => (
              <span key={t} className="block border-t border-line/50" />
            ))}
          </div>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full overflow-visible"
            aria-hidden="true"
          >
            {children(scale)}
          </svg>
        </div>
      </div>

      <div className="flex justify-between mt-1 pl-[calc(2.5rem+0.5rem)]" aria-hidden="true">
        {xTicks.map((t) => (
          <span key={t} className="t-micro font-bold text-muted">{formatX(t)}</span>
        ))}
      </div>
      {xLabel ? <p className="t-micro font-bold text-muted mt-1 text-center">{xLabel}</p> : null}
    </div>
  );
}
