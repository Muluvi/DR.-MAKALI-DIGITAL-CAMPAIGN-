"use client";

import { ScatterQuadrant, type QuadrantMark } from "./primitives";

export interface QuadrantPoint {
  name: string;
  preference: number; // measured, Mizani Africa 7 August 2026 (%)
  credibility: number; // 1-3 qualitative scale, NOT measured data
  credibilityLabel: string;
  note: string;
  color: string;
}

/**
 * The field, the field he is running against section. Was a Recharts ScatterChart.
 *
 * One axis is measured and one is a judgement, and the axis labels say so — the x axis carries
 * its source and its date, the y axis carries the word "qualitative". That distinction was in the
 * original chart's labels and it survives the conversion intact, because it is the part an
 * economist checks first.
 */
export default function CompetitiveQuadrantChart({ data }: { data: QuadrantPoint[] }) {
  const marks: QuadrantMark[] = data.map((d) => ({
    id: d.name,
    label: d.name,
    value: d.preference,
    display: `${d.preference}% measured preference`,
    x: d.preference,
    y: d.credibility,
    yLabel: `${d.credibilityLabel} perceived fiscal credibility`,
    color: d.color,
    note: d.note,
  }));

  return (
    <ScatterQuadrant
      marks={marks}
      domainX={[0, 45]}
      domainY={[0, 4]}
      xTicks={[0, 15, 30, 45]}
      yTicks={[1, 2, 3]}
      formatX={(v) => `${v}%`}
      formatY={(v) => (v === 1 ? "Low" : v === 2 ? "Medium" : v === 3 ? "High" : "")}
      divider={{ x: 26, y: 2 }}
      xLabel="Measured preference (Mizani Africa, 7 Aug 2026) →"
      yLabel="Perceived fiscal credibility (qualitative) ↑"
    />
  );
}
