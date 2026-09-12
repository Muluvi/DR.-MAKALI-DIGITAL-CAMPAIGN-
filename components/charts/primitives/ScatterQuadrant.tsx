"use client";

import { useState } from "react";
import { useInView } from "../../../hooks/use-in-view";
import { InspectPanel } from "./InspectPanel";
import { PlotFrame } from "./PlotFrame";
import type { Mark } from "./types";

export interface QuadrantMark extends Mark {
  x: number;
  y: number;
  /** How the y position should be read back, since the y axis here is qualitative. */
  yLabel: string;
}

/**
 * A two-axis scatter with quadrant dividers.
 *
 * Points are buttons, not `<circle>` elements with hover handlers, so the keyboard reaches every
 * one of them and a tap works the same as a click. They are positioned in percentages over the
 * plot rather than drawn inside the SVG, which keeps the point label at a real font size.
 *
 * Where one axis is qualitative — as it is in the field he is running against section, where fiscal credibility is a judgement and
 * only the preference axis is measured — the axis says so in its own label. A chart that plots a
 * judgement against a measurement without saying which is which is the kind of thing an economist
 * catches, and it costs more than it buys.
 */
export function ScatterQuadrant({
  marks,
  domainX,
  domainY,
  xTicks,
  yTicks,
  formatX = (v) => `${v}%`,
  formatY = (v) => String(v),
  divider,
  xLabel,
  yLabel,
  height = 240,
}: {
  marks: QuadrantMark[];
  domainX: [number, number];
  domainY: [number, number];
  xTicks: number[];
  yTicks: number[];
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
  divider?: { x?: number; y?: number };
  xLabel?: string;
  yLabel?: string;
  height?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.25 });
  const [picked, setPicked] = useState<string | null>(null);
  const activeMark = marks.find((m) => m.id === picked) ?? null;

  const px = (v: number) => ((v - domainX[0]) / (domainX[1] - domainX[0] || 1)) * 100;
  const py = (v: number) => 100 - ((v - domainY[0]) / (domainY[1] - domainY[0] || 1)) * 100;

  return (
    <div ref={ref}>
      <div className="relative">
        <PlotFrame
          height={height}
          domain={{ x: domainX, y: domainY }}
          xTicks={xTicks}
          yTicks={yTicks}
          formatX={formatX}
          formatY={formatY}
          xLabel={xLabel}
          yLabel={yLabel}
        >
          {() => (
            <>
              {divider?.x !== undefined ? (
                <line x1={px(divider.x)} y1={0} x2={px(divider.x)} y2={100}
                      stroke="var(--color-line)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
              ) : null}
              {divider?.y !== undefined ? (
                <line x1={0} y1={py(divider.y)} x2={100} y2={py(divider.y)}
                      stroke="var(--color-line)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
              ) : null}
            </>
          )}
        </PlotFrame>

        {/* Points sit over the plot area, offset by the same axis gutter PlotFrame uses. */}
        <div
          className="absolute left-[calc(2.5rem+0.5rem)] right-0 top-0 pointer-events-none"
          style={{ height, marginTop: yLabel ? "1.35rem" : 0 }}
        >
          {marks.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPicked(m.id)}
              onFocus={() => setPicked(m.id)}
              aria-pressed={picked === m.id}
              aria-label={`${m.label}: ${m.display ?? `${m.x}`}, ${m.yLabel}`}
              className={`fx-focus pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${inView ? "fx-dot" : ""}`}
              style={{
                left: `${px(m.x)}%`,
                top: `${py(m.y)}%`,
                "--fx-delay": `${i * 70}ms`,
              } as React.CSSProperties}
            >
              <span
                className="block w-4 h-4 rounded-full border-2"
                style={{
                  background: m.color ?? "var(--color-accent-solid)",
                  borderColor: "var(--color-card)",
                  outline: picked === m.id ? "2px solid var(--color-ink)" : "none",
                  outlineOffset: 2,
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <InspectPanel mark={activeMark} empty="Select a point for the reading behind it." />

      <details className="mt-2">
        <summary className="t-micro font-bold text-muted cursor-pointer marker:text-accent">
          All {marks.length} positions, as a list
        </summary>
        <dl className="mt-2 grid gap-1">
          {marks.map((m) => (
            <div key={m.id} className="border-b border-line/60 pb-1">
              <dt className="t-micro font-bold text-ink">{m.label}</dt>
              <dd className="t-micro font-semibold text-muted">
                {m.display ?? formatX(m.x)} · {m.yLabel}
                {m.note ? <span className="block mt-0.5 leading-snug">{m.note}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
