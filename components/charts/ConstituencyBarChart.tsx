"use client";

import { BarColumns, type Mark } from "./primitives";

interface ConstituencyChartDatum {
  id: string;
  name: string;
  voters: number;
  share: string;
}

const ABBR: Record<string, string> = {
  "Mwingi North": "Mw.N",
  "Mwingi West": "Mw.W",
  "Mwingi Central": "Mw.C",
  "Kitui West": "Kt.W",
  "Kitui Rural": "Kt.R",
  "Kitui Central": "Kt.C",
  "Kitui East": "Kt.E",
  "Kitui South": "Kt.S",
};

/**
 * The eight constituencies by register size, the 2022 baseline, ward by ward section. Was a Recharts BarChart.
 *
 * Selection is driven from outside as before, so this stays the control for the map beside it —
 * but the columns are now buttons, which means the keyboard can drive that selection too.
 */
export default function ConstituencyBarChart({
  chartData,
  selectedID,
  onSelect,
}: {
  chartData: ConstituencyChartDatum[];
  selectedID: string;
  onSelect: (id: string) => void;
}) {
  const max = Math.max(...chartData.map((d) => d.voters), 1);
  const marks: Mark[] = chartData.map((d) => ({
    id: d.id,
    label: d.name,
    value: d.voters,
    display: d.voters.toLocaleString(),
    sub: `${d.share} of the county register`,
    color: "var(--color-accent-solid)",
  }));

  return (
    <BarColumns
      marks={marks}
      max={max}
      ticks={[0, max / 2, max]}
      formatTick={(v) => `${(v / 1000).toFixed(0)}k`}
      abbreviate={(name) => ABBR[name] || (name.length > 5 ? name.slice(0, 4) + "." : name)}
      selectedId={selectedID}
      onSelect={onSelect}
      listCaption="All eight constituencies, with registered voters"
      emptyHint="Select a constituency to see its share of the register."
    />
  );
}
