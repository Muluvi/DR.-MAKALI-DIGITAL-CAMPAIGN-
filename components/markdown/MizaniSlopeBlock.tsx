"use client";

import { LazyMount } from "../LazyMount";
import { SourceLine } from "./SourceLine";
import MizaniSlopeChart, { type SlopeSeries } from "../charts/MizaniSlopeChart";

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
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Trajectory Between the Two Published Surveys</h4>
      </div>
      <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
        Ngilu was not included in the June round, so her point appears only at August — with only two rounds published,
        the table above remains the exact reference.
      </p>
      <div className="h-64 w-full t-micro">
        <LazyMount minHeight={256} className="h-full">
          <MizaniSlopeChart data={DATA} series={SERIES} />
        </LazyMount>
      </div>
      <SourceLine sources={["Mizani Africa"]} />
    </div>
  );
}
