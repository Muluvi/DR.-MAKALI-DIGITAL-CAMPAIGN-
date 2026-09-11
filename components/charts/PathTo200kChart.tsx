"use client";

import { useState } from "react";
import { useInView } from "../../hooks/use-in-view";
import { InspectPanel, PlotFrame } from "./primitives";
import type { Mark } from "./primitives";

export interface PathPoint {
  rank: number;
  ward: string;
  constituencyName: string;
  voters: number;
  cumulative: number;
  color: string;
}

/**
 * The route to the win threshold, ward by ward — §3.4.3. Was a Recharts ComposedChart.
 *
 * Two readings on one plot, and they do different jobs: the columns are each ward's own register,
 * the line is the running total, and the dashed rule is the threshold the line has to cross. The
 * crossing point is the argument, so the rule is labelled and the line draws forward into it.
 */
export default function PathTo200kChart({ data, threshold }: { data: PathPoint[]; threshold: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.2 });
  const [picked, setPicked] = useState<string | null>(null);

  const ceiling = Math.max(...data.map((d) => d.cumulative), threshold) * 1.05;
  const active = data.find((d) => String(d.rank) === picked);
  const activeMark: Mark | null = active
    ? {
        id: String(active.rank),
        label: `${active.ward} (rank ${active.rank})`,
        value: active.voters,
        display: `${active.voters.toLocaleString()} registered in this ward`,
        sub: `${active.cumulative.toLocaleString()} cumulative`,
        note: active.constituencyName,
      }
    : null;

  const step = data.length > 1 ? 100 / (data.length - 1) : 0;
  const linePath = data
    .map((d, i) => `${i ? "L" : "M"}${i * step},${100 - (d.cumulative / ceiling) * 100}`)
    .join(" ");

  return (
    <div ref={ref}>
      <div className="relative">
        <PlotFrame
          height={200}
          domain={{ x: [0, Math.max(data.length - 1, 1)], y: [0, ceiling] }}
          xTicks={[0, Math.floor((data.length - 1) / 2), data.length - 1]}
          yTicks={[0, ceiling / 2, ceiling]}
          formatX={(i) => `#${(data[i]?.rank ?? i + 1)}`}
          formatY={(v) => `${(v / 1000).toFixed(0)}k`}
          xLabel="Wards, ranked by register size ↓"
        >
          {(scale) => (
            <>
              {/* Each ward's own register, as a column from the baseline. */}
              {data.map((d, i) => {
                const h = (d.voters / ceiling) * 100;
                return (
                  <rect
                    key={d.rank}
                    x={i * step - step * 0.3}
                    width={Math.max(step * 0.6, 0.6)}
                    y={100 - h}
                    height={h}
                    fill={d.color}
                    className={inView ? "fx-bar-v" : ""}
                    style={{ transformBox: "fill-box", "--fx-delay": `${i * 12}ms` } as React.CSSProperties}
                  />
                );
              })}
              {/* The running total. */}
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                className={inView ? "fx-path" : ""}
                style={{ "--fx-path-len": 260, "--fx-delay": "200ms" } as React.CSSProperties}
              />
              <line
                x1={0}
                x2={100}
                y1={scale.y(threshold)}
                y2={scale.y(threshold)}
                stroke="var(--color-danger)"
                strokeWidth={2}
                strokeDasharray="5 3"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </PlotFrame>

        {/* One button per ward, over the plot, so the keyboard and a thumb both reach the detail. */}
        <div className="absolute left-[calc(2.5rem+0.5rem)] right-0 top-0 h-[200px] flex pointer-events-none">
          {data.map((d) => (
            <button
              key={d.rank}
              type="button"
              onClick={() => setPicked(String(d.rank))}
              onFocus={() => setPicked(String(d.rank))}
              aria-pressed={picked === String(d.rank)}
              aria-label={`Rank ${d.rank}, ${d.ward}: ${d.voters.toLocaleString()} registered, ${d.cumulative.toLocaleString()} cumulative`}
              className="fx-focus pointer-events-auto flex-1 min-w-0"
            />
          ))}
        </div>
      </div>

      <p className="t-micro font-extrabold text-danger mt-1">
        ~{(threshold / 1000).toFixed(0)}k win threshold — the dashed rule
      </p>

      <InspectPanel mark={activeMark} empty="Select a ward for its register and the running total." />

      <details className="mt-2">
        <summary className="t-micro font-bold text-muted cursor-pointer marker:text-accent">
          All {data.length} wards, ranked, with the running total
        </summary>
        <div className="overflow-x-auto mt-2">
          <table className="w-full t-micro">
            <thead>
              <tr>
                <th scope="col" className="text-left font-extrabold text-ink pb-1">#</th>
                <th scope="col" className="text-left font-extrabold text-ink pb-1">Ward</th>
                <th scope="col" className="text-right font-extrabold text-ink pb-1">Register</th>
                <th scope="col" className="text-right font-extrabold text-ink pb-1">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.rank} className="border-t border-line/60">
                  <td className="font-bold text-muted py-0.5">{d.rank}</td>
                  <td className="font-bold text-ink">{d.ward}</td>
                  <td className="text-right font-semibold text-muted tabular-nums">{d.voters.toLocaleString()}</td>
                  <td className="text-right font-semibold text-muted tabular-nums">{d.cumulative.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
