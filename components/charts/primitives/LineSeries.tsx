"use client";

import { useInView } from "../../../hooks/use-in-view";
import { PlotFrame, type Scale } from "./PlotFrame";

export interface Series {
  key: string;
  name: string;
  color: string;
  /** null breaks the line — a survey that did not ask, not a zero. */
  points: (number | null)[];
}

/**
 * Multi-series line chart.
 *
 * The draw-on is `stroke-dashoffset` travelling once on entry, which is the motion that means
 * "this is a trajectory" rather than "this has appeared". Under reduced motion the path is
 * complete from the first frame and fades instead.
 *
 * `null` in a series breaks the path rather than interpolating through it. A poll that did not
 * ask a question is not a zero, and joining across it would invent a reading.
 */
export function LineSeries({
  categories,
  series,
  domainY,
  yTicks,
  formatY = (v) => `${v}%`,
  height = 200,
  yLabel,
}: {
  categories: string[];
  series: Series[];
  domainY: [number, number];
  yTicks: number[];
  formatY?: (v: number) => string;
  height?: number;
  yLabel?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.25 });

  const segments = (s: Series, scale: Scale) => {
    const out: string[] = [];
    let run: string[] = [];
    s.points.forEach((p, i) => {
      if (p === null) {
        if (run.length > 1) out.push(run.join(" "));
        run = [];
        return;
      }
      const x = categories.length > 1 ? (i / (categories.length - 1)) * 100 : 50;
      run.push(`${run.length ? "L" : "M"}${x},${scale.y(p)}`);
    });
    if (run.length > 1) out.push(run.join(" "));
    return out;
  };

  return (
    <div ref={ref}>
      <PlotFrame
        height={height}
        domain={{ x: [0, Math.max(categories.length - 1, 1)], y: domainY }}
        xTicks={categories.map((_, i) => i)}
        yTicks={yTicks}
        formatX={(i) => categories[i] ?? ""}
        formatY={formatY}
        yLabel={yLabel}
      >
        {(scale) => (
          <>
            {/* The complete path is the default. `fx-path` adds the draw-on, and only once the
                chart is on screen, so a reader with JavaScript off gets the finished line rather
                than an empty plot. */}
            {series.map((s, si) =>
              segments(s, scale).map((d, i) => (
                <path
                  key={`${s.key}-${i}`}
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2.5}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  className={inView ? "fx-path" : ""}
                  style={{ "--fx-path-len": 220, "--fx-delay": `${si * 150}ms` } as React.CSSProperties}
                />
              ))
            )}
            {series.map((s) =>
              s.points.map((p, i) =>
                p === null ? null : (
                  <circle
                    key={`${s.key}-dot-${i}`}
                    cx={categories.length > 1 ? (i / (categories.length - 1)) * 100 : 50}
                    cy={scale.y(p)}
                    r={3}
                    fill={s.color}
                    vectorEffect="non-scaling-stroke"
                    className={inView ? "fx-dot" : ""}
                    style={{ "--fx-delay": "700ms" } as React.CSSProperties}
                  />
                )
              )
            )}
          </>
        )}
      </PlotFrame>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5 t-micro font-bold text-muted">
            <span className="w-3 h-0.5 rounded-full shrink-0" style={{ background: s.color }} aria-hidden="true" />
            {s.name}
          </li>
        ))}
      </ul>

      {/* The accessible equivalent: the same readings as a table, never hidden from find or AT. */}
      <details className="mt-2">
        <summary className="t-micro font-bold text-muted cursor-pointer marker:text-accent">
          The same readings, as a table
        </summary>
        <div className="overflow-x-auto mt-2">
          <table className="w-full t-micro">
            <thead>
              <tr>
                <th scope="col" className="text-left font-extrabold text-ink pb-1">Series</th>
                {categories.map((c) => (
                  <th key={c} scope="col" className="text-right font-extrabold text-ink pb-1 px-1.5">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.key} className="border-t border-line/60">
                  <th scope="row" className="text-left font-bold text-muted py-1">{s.name}</th>
                  {s.points.map((p, i) => (
                    <td key={i} className="text-right font-semibold text-muted tabular-nums px-1.5">
                      {p === null ? "—" : formatY(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
