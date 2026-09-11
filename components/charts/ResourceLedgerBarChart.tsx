"use client";

import { BarRows, type Mark } from "./primitives";

interface LedgerChartDatum {
  name: string;
  budget: number;
  formatted: string;
}

/**
 * County budget lines, §3.3.4. Was a Recharts horizontal BarChart.
 *
 * The formatted figure is printed against every bar rather than held in a tooltip, because the
 * figure is the point: a reader comparing allocations should not have to hover eight bars to
 * read eight numbers.
 */
export default function ResourceLedgerBarChart({
  chartData,
  colors,
}: {
  chartData: LedgerChartDatum[];
  colors: string[];
}) {
  const marks: Mark[] = chartData.map((d, i) => ({
    id: d.name,
    label: d.name,
    value: d.budget,
    display: d.formatted,
    color: colors[i % colors.length],
  }));
  return <BarRows marks={marks} listCaption="Every budget line, as a list" />;
}
