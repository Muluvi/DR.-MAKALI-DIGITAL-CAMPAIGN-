"use client";

import { BarRows, type Mark } from "./primitives";

export interface PlatformDatum {
  name: string;
  value: number; // millions — upper bound where the source gives a range
  display: string;
  note: string;
  color: string;
}

/**
 * Platform reach, the workstream 5 — Platform tactics and paid media section. Was a Recharts horizontal BarChart with a hover tooltip.
 *
 * The tooltip is now the stable inspect panel beneath the chart (F-17), bound to click and focus,
 * so the note behind each platform is reachable by tap and by keyboard rather than by hover — and
 * the same notes render as a list underneath for a reader whose device never runs the chart.
 */
export default function PlatformSizingChart({ data }: { data: PlatformDatum[] }) {
  const marks: Mark[] = data.map((d) => ({
    id: d.name,
    label: d.name,
    value: d.value,
    display: d.display,
    color: d.color,
    note: d.note,
  }));
  return <BarRows marks={marks} listCaption="All platforms, with their sourced figures" />;
}
