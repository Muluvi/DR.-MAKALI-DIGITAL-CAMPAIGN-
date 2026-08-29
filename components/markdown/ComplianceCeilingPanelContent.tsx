"use client";

import dynamic from "next/dynamic";
import { LazyMount } from "../LazyMount";
import { ProvenanceLine } from "./ProvenanceLine";
import { TierBadge } from "./TierBadge";
import {
  KITUI_SPENDING_CEILING,
  SINGLE_SOURCE_CONTRIBUTION_CAP_PCT,
  AUDITED_REPORT_THRESHOLD,
  PENALTY_MAX_FINE,
  PENALTY_MAX_PRISON_YEARS,
  EXPENDITURE_WINDOW,
  COMPLIANCE_REQUIREMENTS,
} from "../../data/spending-ceiling";
import type { TierBand } from "../charts/SpendingCeilingChart";

const SpendingCeilingChart = dynamic(() => import("../charts/SpendingCeilingChart"), { ssr: false });

const CEILING = KITUI_SPENDING_CEILING.value;

// Tier ad-spend ranges as recommended in Section 8B.5 (Lean 15–20%, Standard 30–40%, Premium
// 45–55% of the ceiling) — this proposal's own recommended structure, not an external source,
// so these percentages are not separately tiered; the ceiling they are plotted against is.
const TIER_RANGES: { name: string; lowPct: number; highPct: number; color: string }[] = [
  { name: "Lean", lowPct: 15, highPct: 20, color: "#8295a9" },
  { name: "Standard (recommended)", lowPct: 30, highPct: 40, color: "#0056a8" },
  { name: "Premium", lowPct: 45, highPct: 55, color: "#e31d2b" },
];

const CHART_DATA: TierBand[] = TIER_RANGES.map((t) => {
  const low = (CEILING * t.lowPct) / 100;
  const high = (CEILING * t.highPct) / 100;
  return {
    name: t.name,
    base: low,
    value: high - low,
    display: `KSh${(low / 1_000_000).toFixed(1)}m–${(high / 1_000_000).toFixed(1)}m (${t.lowPct}–${t.highPct}% of ceiling)`,
    color: t.color,
  };
});

/**
 * Compliance and spending-ceiling panel (Section 8B.7 / Phase 6e). Resolves the previous
 * `[Insert verified Kitui County expenditure ceiling]` placeholder with the verified figure and
 * turns the regulatory constraints into an operational checklist, since this is the campaign's
 * binding budget constraint, not background reading.
 */
export function ComplianceCeilingPanelContent() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Compliance and Spending-Ceiling Panel</h4>
      </div>
      <p className="text-[11px] text-muted mb-1 leading-relaxed pl-3.5">
        The verified Kitui county-seat ceiling — shared by the Governor, Senator and Woman Representative races.
      </p>
      <div className="pl-3.5 mb-4">
        <span className="font-serif text-2xl font-black text-ink">KSh{(CEILING / 1_000_000).toFixed(2)}m</span>
        <TierBadge tier={KITUI_SPENDING_CEILING.provenance.source.tier} compact />
      </div>

      <div className="h-64 w-full text-[9px] mb-4">
        <LazyMount minHeight={256} className="h-full">
          <SpendingCeilingChart data={CHART_DATA} ceiling={CEILING} />
        </LazyMount>
      </div>

      {/* Accessible table equivalent of the chart above */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-left text-[11px]">
          <caption className="sr-only">Recommended ad-spend range by tier, against the KSh97.56m statutory ceiling</caption>
          <thead>
            <tr className="text-[9px] uppercase tracking-wider font-bold text-muted">
              <th className="py-1 pr-3">Tier</th>
              <th className="py-1 pr-3">Range</th>
              <th className="py-1">% of ceiling</th>
            </tr>
          </thead>
          <tbody>
            {TIER_RANGES.map((t, i) => (
              <tr key={i} className="border-t border-line/40">
                <td className="py-1.5 pr-3 font-bold text-ink">{t.name}</td>
                <td className="py-1.5 pr-3 text-ink/80">{CHART_DATA[i].display.split(" (")[0]}</td>
                <td className="py-1.5 text-ink/80">
                  {t.lowPct}–{t.highPct}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-line/60 bg-paper p-3">
          <div className="text-[9px] uppercase tracking-wider font-bold text-muted mb-1">{SINGLE_SOURCE_CONTRIBUTION_CAP_PCT.label}</div>
          <div className="font-serif text-sm font-black text-ink">{SINGLE_SOURCE_CONTRIBUTION_CAP_PCT.value}{SINGLE_SOURCE_CONTRIBUTION_CAP_PCT.unit.replace("% of the total ceiling", "% of ceiling")}</div>
        </div>
        <div className="rounded-xl border border-line/60 bg-paper p-3">
          <div className="text-[9px] uppercase tracking-wider font-bold text-muted mb-1">{AUDITED_REPORT_THRESHOLD.label}</div>
          <div className="font-serif text-sm font-black text-ink">KSh{(AUDITED_REPORT_THRESHOLD.value / 1_000_000).toFixed(0)}m+</div>
        </div>
        <div className="rounded-xl border border-line/60 bg-paper p-3">
          <div className="text-[9px] uppercase tracking-wider font-bold text-muted mb-1">Regulated expenditure window</div>
          <div className="text-xs font-bold text-ink">{EXPENDITURE_WINDOW.start} → {EXPENDITURE_WINDOW.end}</div>
        </div>
        <div className="rounded-xl border border-danger/40 bg-paper p-3">
          <div className="text-[9px] uppercase tracking-wider font-bold text-danger mb-1">Penalty exposure</div>
          <div className="font-serif text-sm font-black text-ink">
            Up to KSh{(PENALTY_MAX_FINE.value / 1_000_000).toFixed(0)}m and/or {PENALTY_MAX_PRISON_YEARS.value} years
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line/60 bg-paper p-3">
        <div className="text-[9px] uppercase tracking-wider font-black text-ink mb-1.5">Operational requirements</div>
        <ul className="space-y-1.5">
          {COMPLIANCE_REQUIREMENTS.map((req, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-ink/80 leading-relaxed">
              <span className="text-accent mt-0.5 shrink-0">›</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <ProvenanceLine provenance={KITUI_SPENDING_CEILING.provenance} />
    </div>
  );
}
