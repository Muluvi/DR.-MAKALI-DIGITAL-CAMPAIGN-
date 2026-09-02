"use client";

import { LazyMount } from "../LazyMount";
import { SourceLine } from "./SourceLine";
import PlatformSizingChart, { type PlatformDatum } from "../charts/PlatformSizingChart";

import { PLATFORM_AUDIENCES } from "../../data/external-figures";

// National platform sizing for ad planning, sorted descending by audience. The figures live in
// data/external-figures.ts with their NapoleonCat / DataReportal citations rather than inline
// here, so they are reviewable in one place and the figure guard can tell sourced third-party
// data apart from invented numbers. LinkedIn's stated 6.30–7.44m range is plotted at its upper
// bound, with the true range kept in the label rather than averaged into an invented midpoint.
const PALETTE = ["#0056a8", "#338dfd", "#e31d2b", "#8295a9", "#f59e0b"];
const DATA: PlatformDatum[] = PLATFORM_AUDIENCES.map((p, i) => ({
  name: p.name,
  value: p.value,
  display: p.display,
  note: p.note,
  color: PALETTE[i % PALETTE.length],
}));

export function PlatformSizingBlock() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">National Platform Sizing (for ad planning)</h4>
      </div>
      <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">Kenya-wide audience figures, sorted by size.</p>
      <div className="h-56 w-full t-micro">
        <LazyMount minHeight={224} className="h-full">
          <PlatformSizingChart data={DATA} />
        </LazyMount>
      </div>
      <p className="t-label text-muted/80 leading-normal mt-3 pt-2 border-t border-line/40 font-medium">
        <span className="italic">Not sized:</span> WhatsApp — the source describes it as {"“"}effectively universal among connected users{"”"} with no audience figure given, so it isn{"'"}t plotted here rather than assigned an invented number.
      </p>
      <SourceLine sources={["NapoleonCat, May 2026", "DataReportal Digital 2026 Kenya"]} />
    </div>
  );
}
