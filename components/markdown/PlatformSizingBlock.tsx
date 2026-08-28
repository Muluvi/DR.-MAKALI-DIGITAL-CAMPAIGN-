"use client";

import dynamic from "next/dynamic";
import { LazyMount } from "../LazyMount";
import { SourceLine } from "./SourceLine";
import type { PlatformDatum } from "../charts/PlatformSizingChart";

const PlatformSizingChart = dynamic(() => import("../charts/PlatformSizingChart"), { ssr: false });

// Section 2.5, "National platform sizing (for ad planning)". Sorted descending by audience.
// LinkedIn is a stated 6.30–7.44m range — plotted at its upper bound, with the true range kept
// in the label rather than averaged into an invented midpoint.
const DATA: PlatformDatum[] = [
  { name: "Facebook", value: 23.09, display: "23.09m (37.5% of population), May 2026", note: "Largest cohort 25–34; 55.2% male.", color: "#0056a8" },
  { name: "Messenger", value: 20.18, display: "20.18m", note: "Under-used for direct constituent contact.", color: "#338dfd" },
  { name: "TikTok", value: 18.4, display: "18.4m aged 18+, late 2025", note: "Primary first-time-voter channel.", color: "#e31d2b" },
  { name: "LinkedIn", value: 7.44, display: "6.30m–7.44m (range as stated)", note: "Professional associations, diaspora. Bar plotted at the upper bound.", color: "#8295a9" },
  { name: "Instagram", value: 5.1, display: "5.10m", note: "Largest cohort 18–24.", color: "#f59e0b" },
];

export function PlatformSizingBlock() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">National Platform Sizing (for ad planning)</h4>
      </div>
      <p className="text-[11px] text-muted mb-3 leading-relaxed pl-3.5">Kenya-wide audience figures, sorted by size.</p>
      <div className="h-56 w-full text-[9px]">
        <LazyMount minHeight={224} className="h-full">
          <PlatformSizingChart data={DATA} />
        </LazyMount>
      </div>
      <p className="text-[10px] text-muted/80 leading-normal mt-3 pt-2 border-t border-line/40 font-medium">
        <span className="italic">Not sized:</span> WhatsApp — the source describes it as {"“"}effectively universal among connected users{"”"} with no audience figure given, so it isn{"'"}t plotted here rather than assigned an invented number.
      </p>
      <SourceLine sources={["NapoleonCat, May 2026", "DataReportal Digital 2026 Kenya"]} />
    </div>
  );
}
