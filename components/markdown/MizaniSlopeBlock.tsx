"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";
import { LazyMount } from "../LazyMount";
import type { SlopeSeries } from "../charts/MizaniSlopeChart";
import { FigureBlock } from "./FigureBlock";

// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const MizaniSlopeChart = dynamic(() => import("../charts/MizaniSlopeChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

// §0.1 table. Ngilu has no June 2026 figure (she wasn't in that round), so her line
// starts null rather than an invented June value — the chart draws no segment before August.
const DATA = [
  { survey: "Mizani Africa, June 2026", kasalu: 31.3, mulu: 20.2, wambua: 16.3, ngilu: null },
  { survey: "Mizani Africa, 7 Aug 2026", kasalu: 37.4, mulu: 22.1, wambua: 14.3, ngilu: 17.0 },
];

const SERIES: SlopeSeries[] = [
  { key: "kasalu", name: "Kasalu", color: "#e31d2b" },
  { key: "mulu", name: "Mulu", color: "#0056a8" },
  { key: "wambua", name: "Wambua", color: "#8295a9" },
  { key: "ngilu", name: "Ngilu", color: "#f59e0b" },
];

export function MizaniSlopeBlock() {
  return (
    <FigureBlock
      title="Trajectory Between the Two Published Surveys"
      subtitle={
        <>
          Ngilu was not included in the June round, so her point appears only at August — with only two rounds published,
          the table above remains the exact reference.
        </>
      }
      sources={["Mizani Africa"]}
    >
      <div className="h-64 w-full t-micro">
        <LazyMount minHeight={256} className="h-full">
          <MizaniSlopeChart data={DATA} series={SERIES} />
        </LazyMount>
      </div>
    </FigureBlock>
  );
}
