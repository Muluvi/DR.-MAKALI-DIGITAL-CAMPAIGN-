"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";
import { LazyMount } from "../LazyMount";
import { SourceLine } from "./SourceLine";
import type { WaterfallStep } from "../charts/ResourceEnvelopeChart";
import { FIGURES } from "../../lib/data/figures";
import { formatFigure } from "../../lib/data/format";

// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const ResourceEnvelopeChart = dynamic(() => import("../charts/ResourceEnvelopeChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

// Section 2.5, from the data layer: the CFSP FY2026/27 envelope and its three parts. The parts sum to
// KSh 0.01bn more than the published total; that rounding gap is shown, not absorbed.
const bn = (id: string) => (FIGURES[id].value ?? 0) / 1e9;
const EQUITABLE = bn("budget.equitable");
const OWN_SOURCE = bn("budget.osr");
const GRANTS = bn("budget.grants");
const COMPONENT_SUM = EQUITABLE + OWN_SOURCE + GRANTS;
const STATED_TOTAL = bn("budget.total");

const DATA: WaterfallStep[] = [
  { name: "Equitable share", base: 0, value: EQUITABLE, display: `KSh${formatFigure(FIGURES["budget.equitable"], "bn")}bn (${formatFigure(FIGURES["budget.equitable.share"])}%)`, color: "#0056a8" },
  { name: "Own-source revenue", base: EQUITABLE, value: OWN_SOURCE, display: `KSh${formatFigure(FIGURES["budget.osr"], "bn")}bn in the Paper; KSh${formatFigure(FIGURES["budget.osr.revised"], "bn")}bn as revised by the Assembly`, color: "#338dfd" },
  { name: "Grants", base: EQUITABLE + OWN_SOURCE, value: GRANTS, display: `KSh${formatFigure(FIGURES["budget.grants"], "bn")}bn (${formatFigure(FIGURES["budget.grants.share"])}%)`, color: "#e31d2b" },
  { name: "Published total", base: 0, value: STATED_TOTAL, display: `KSh${formatFigure(FIGURES["budget.total"], "bn")}bn, as published`, color: "#0b1a30", isTotal: true },
];

export function ResourceEnvelopeBlock() {
  return (
    <div className="not-prose bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">FY2026/27 Resource Envelope — KSh{formatFigure(FIGURES["budget.total"], "bn")}bn</h4>
      </div>
      <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
        Split into its three published components, as the Fiscal Strategy Paper states them.
      </p>
      <div className="h-64 w-full t-micro">
        <LazyMount minHeight={256} className="h-full">
          <ResourceEnvelopeChart data={DATA} />
        </LazyMount>
      </div>
      <p className="t-label text-muted/80 leading-normal mt-3 italic border-t border-line/40 pt-2 font-medium">
        The three components sum to KSh{COMPONENT_SUM.toFixed(2)}bn, KSh{(COMPONENT_SUM - STATED_TOTAL).toFixed(2)}bn above the published
        KSh{STATED_TOTAL.toFixed(2)}bn total. That gap is rounding in the source document, shown here rather than reconciled.
      </p>
      <SourceLine sources={["Kitui County Fiscal Strategy Paper, FY2026/27"]} />
    </div>
  );
}
