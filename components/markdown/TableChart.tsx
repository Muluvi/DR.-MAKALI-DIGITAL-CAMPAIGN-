"use client";

import { ChartComponent } from "../ChartComponent";

interface TableChartDatum {
  name: string;
  value: number;
  formatted: string;
}

export default function TableChart({ chartData, statsLabel }: { chartData: TableChartDatum[]; statsLabel?: string }) {
  return (
    <ChartComponent
      data={chartData}
      statsLabel={statsLabel || "Value"}
      height={260}
      className="my-3 border-0 shadow-none p-2 bg-transparent"
    />
  );
}

