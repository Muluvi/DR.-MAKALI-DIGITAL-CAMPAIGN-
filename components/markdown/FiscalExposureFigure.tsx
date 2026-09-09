"use client";

import { FigureTabs } from "./FigureTabs";
import dynamic from "next/dynamic";
import type { FiscalBar } from "../charts/FiscalAuditChart";
import { AUDIT_QUERIES_FY2023_24, PENDING_BILLS_FY2020_21, STALLED_HEALTH_PROJECTS_GAP, RESOURCE_ENVELOPE_FY2026_27 } from "../../data/fiscal-audit";
import { DISPUTED_FIGURES } from "../../data/disputed-figures";
import { TierBadge } from "./TierBadge";
import { DisputedFigure } from "./DisputedFigure";
import { ChartFallback } from "../ChartFallback";
import { LazyMount } from "../LazyMount";

const absorptionDispute = DISPUTED_FIGURES.find((d) => d.id === "kitui-fy2025-26-q1-absorption")!;

function formatKSh(value: number): string {
  if (value >= 1_000_000_000) return `KSh${(value / 1_000_000_000).toFixed(2)}bn`;
  return `KSh${(value / 1_000_000).toFixed(0)}m`;
}

// Dynamic boundary: the charting runtime stays out of the first load. LazyMount below
// still gates when it mounts; this gates when it downloads.
const FiscalAuditChart = dynamic(() => import("../charts/FiscalAuditChart"), {
  ssr: false,
  loading: () => <ChartFallback />,
});

const AUDIT_TOTAL = AUDIT_QUERIES_FY2023_24.reduce((sum, q) => sum + q.value, 0);
const EXPOSURE_TOTAL = AUDIT_TOTAL + PENDING_BILLS_FY2020_21.value;

function fmt(v: number): string {
  return `KSh${(v / 1_000_000_000).toFixed(2)}bn`;
}

const DATA: FiscalBar[] = [
  { name: "Resource envelope (FY2026/27)", value: RESOURCE_ENVELOPE_FY2026_27.value, display: `${fmt(RESOURCE_ENVELOPE_FY2026_27.value)} — Section 1.2.4`, color: "#0056a8" },
  { name: "Audit queries (FY2023/24)", value: AUDIT_TOTAL, display: `${fmt(AUDIT_TOTAL)} — sum of the four Auditor-General queries above`, color: "#e31d2b" },
  { name: "Pending bills (FY2020/21)", value: PENDING_BILLS_FY2020_21.value, display: `${fmt(PENDING_BILLS_FY2020_21.value)} (approx.)`, color: "#b45309" },
];

/**
 * The county's fiscal exposure, as one figure.
 *
 * §1.2.7 mounted two cards back to back, both reading data/fiscal-audit: an itemised table of
 * the Auditor-General's FY2023/24 queries and the FY2020/21 pending bills, then a chart of the
 * same totals set against the resource envelope. Same source module, same argument, two
 * provenance footers.
 *
 * The itemised table is the first view: it is what prints, and it is the one that carries the
 * per-query tier badges and the disputed-figure note. The chart's job is the comparison — what
 * the exposure is against — which the table cannot show at a glance.
 */
export function FiscalExposureFigure() {
  return (
    <FigureTabs
      title="Auditor-General FY2023/24 Queries, Pending Bills and the Resource Envelope"
      label="Views of the fiscal exposure"
      views={[
        {
          id: "queries",
          label: "Queries and bills, itemised",
          provenance: [PENDING_BILLS_FY2020_21.provenance, ...AUDIT_QUERIES_FY2023_24.map((q) => q.provenance)],
          content: (
            <>
      <p className="t-small text-muted mb-4 leading-relaxed pl-3.5">
        These are queries flagged by the Auditor-General, not settled findings of wrongdoing — the county has a right
        of reply through the normal audit process.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left t-small">
          <thead>
            <tr className="t-micro uppercase tracking-wider font-bold text-muted">
              <th className="py-1 pr-3">Query</th>
              <th className="py-1 pr-3">Amount</th>
              <th className="py-1">Tier</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_QUERIES_FY2023_24.map((q, i) => (
              <tr key={i} className="border-t border-line/40">
                <td className="py-1.5 pr-3 font-bold text-ink">{q.label}</td>
                <td className="py-1.5 pr-3 font-black text-ink">{formatKSh(q.value)}</td>
                <td className="py-1.5">
                  <TierBadge tier={q.provenance.source.tier} compact />
                </td>
              </tr>
            ))}
            <tr className="border-t border-line/40">
              <td className="py-1.5 pr-3 font-bold text-ink">{PENDING_BILLS_FY2020_21.label}</td>
              <td className="py-1.5 pr-3 font-black text-ink">{formatKSh(PENDING_BILLS_FY2020_21.value)}</td>
              <td className="py-1.5">
                <TierBadge tier={PENDING_BILLS_FY2020_21.provenance.source.tier} compact />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted italic mt-3 leading-relaxed">{STALLED_HEALTH_PROJECTS_GAP}</p>

      <DisputedFigure entry={absorptionDispute} />

    
            </>
          ),
        },
        {
          id: "against-envelope",
          label: "Against the envelope",
          provenance: [RESOURCE_ENVELOPE_FY2026_27.provenance, PENDING_BILLS_FY2020_21.provenance, ...AUDIT_QUERIES_FY2023_24.map((q) => q.provenance)],
          content: (
            <>
              <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
          Audit queries and pending bills together are <strong className="text-ink">{fmt(EXPOSURE_TOTAL)}</strong> — about{" "}
          <strong className="text-ink">{((EXPOSURE_TOTAL / RESOURCE_ENVELOPE_FY2026_27.value) * 100).toFixed(0)}%</strong> of
          the annual resource envelope. That comparison is this chart&apos;s only computation: a sum of figures already
          stated above and in Section 1.2.4, not a new estimate.
              </p>

      <div className="w-full t-micro mb-4">
        <LazyMount minHeight={180}>
          <FiscalAuditChart data={DATA} />
        </LazyMount>
      </div>

      {/* Accessible table equivalent */}
      <div className="overflow-x-auto">
        <table className="data-table text-left t-small">
          <thead>
            <tr className="t-micro uppercase tracking-wider font-bold text-muted">
              <th className="py-1 pr-3">Category</th>
              <th className="py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((d, i) => (
              <tr key={i} className="border-t border-line/40">
                <td className="py-1.5 pr-3 font-bold text-ink">{d.name}</td>
                <td className="py-1.5 text-ink/80">{d.display}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
            </>
          ),
        },
      ]}
    />
  );
}
