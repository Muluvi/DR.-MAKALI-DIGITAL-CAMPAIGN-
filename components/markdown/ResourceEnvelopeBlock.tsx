"use client";

import { LazyMount } from "../LazyMount";
import { SourceLine } from "./SourceLine";
import ResourceEnvelopeChart, { type WaterfallStep } from "../charts/ResourceEnvelopeChart";

// Section 4.4: "a total resource envelope of KSh13.79 billion, comprising roughly KSh11.64
// billion in equitable share (approximately 84.5% of revenue), around KSh1.03 billion in
// grants, and own-source revenue revised upward to KSh1.339 billion." All three components are
// stated as approximate ("roughly" / "around") — their sum (14.009bn) doesn't exactly match the
// stated 13.79bn total, and that gap is left visible rather than silently reconciled.
const EQUITABLE = 11.64;
const GRANTS = 1.03;
const OWN_SOURCE = 1.339;
const COMPONENT_SUM = EQUITABLE + GRANTS + OWN_SOURCE;
const STATED_TOTAL = 13.79;

const DATA: WaterfallStep[] = [
  { name: "Equitable share", base: 0, value: EQUITABLE, display: "≈ KSh11.64bn (≈84.5% of revenue)", color: "#0056a8" },
  { name: "Grants", base: EQUITABLE, value: GRANTS, display: "≈ KSh1.03bn", color: "#338dfd" },
  { name: "Own-source revenue", base: EQUITABLE + GRANTS, value: OWN_SOURCE, display: "KSh1.339bn (revised upward)", color: "#e31d2b" },
  { name: "Stated total", base: 0, value: STATED_TOTAL, display: "KSh13.79bn — as stated in Section 4.4", color: "#0b1a30", isTotal: true },
];

export function ResourceEnvelopeBlock() {
  return (
    <div className="not-prose bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">FY2026/27 Resource Envelope — KSh13.79bn</h4>
      </div>
      <p className="text-[11px] text-muted mb-3 leading-relaxed pl-3.5">
        Split into its three stated components, each carried at the approximate figure the proposal itself gives.
      </p>
      <div className="h-64 w-full text-[9px]">
        <LazyMount minHeight={256} className="h-full">
          <ResourceEnvelopeChart data={DATA} />
        </LazyMount>
      </div>
      <p className="text-[10px] text-muted/80 leading-normal mt-3 italic border-t border-line/40 pt-2 font-medium">
        The three components are each stated as approximate figures ({"“"}roughly{"”"}, {"“"}around{"”"}) and sum to{" "}
        ≈KSh{COMPONENT_SUM.toFixed(2)}bn — about KSh{(COMPONENT_SUM - STATED_TOTAL).toFixed(2)}bn above the stated KSh{STATED_TOTAL}bn total.
        That gap is rounding in the source document, shown here rather than reconciled.
      </p>
      <SourceLine sources={["Kitui County Fiscal Strategy Paper, FY2026/27"]} />
    </div>
  );
}
