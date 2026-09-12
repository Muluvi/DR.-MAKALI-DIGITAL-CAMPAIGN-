"use client";

import { LineSeries, type Series } from "./primitives";

export interface SlopeSeries {
  key: string;
  name: string;
  color: string;
}

/**
 * The nomination-preference trend, the polling gap, as sourced section. Was a Recharts LineChart.
 *
 * `connectNulls` was false before and the replacement keeps that behaviour deliberately: a survey
 * that did not name a contender is a gap, not a zero, and drawing through it would invent a
 * reading the source does not support.
 */
export default function MizaniSlopeChart({
  data,
  series,
}: {
  data: Record<string, string | number | null>[];
  series: SlopeSeries[];
}) {
  const categories = data.map((d) => String(d.survey ?? ""));
  const lines: Series[] = series.map((s) => ({
    key: s.key,
    name: s.name,
    color: s.color,
    points: data.map((d) => {
      const v = d[s.key];
      return typeof v === "number" ? v : null;
    }),
  }));

  return (
    <LineSeries
      categories={categories}
      series={lines}
      domainY={[0, 45]}
      yTicks={[0, 15, 30, 45]}
      formatY={(v) => `${v}%`}
    />
  );
}
