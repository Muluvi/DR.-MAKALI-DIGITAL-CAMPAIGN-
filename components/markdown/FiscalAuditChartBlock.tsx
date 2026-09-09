"use client";

import dynamic from "next/dynamic";

import { ChartFallback } from "../ChartFallback";
import { LazyMount } from "../LazyMount";
import { RESOURCE_ENVELOPE_FY2026_27, AUDIT_QUERIES_FY2023_24, PENDING_BILLS_FY2020_21 } from "../../data/fiscal-audit";
import type { FiscalBar } from "../charts/FiscalAuditChart";
import { FigureBlock } from "./FigureBlock";
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

export function FiscalAuditChartBlock() {
  return (
    <FigureBlock
      title="Resource Envelope Against Audit Exposure"
      subtitle={
        <>
          Audit queries and pending bills together are <strong className="text-ink">{fmt(EXPOSURE_TOTAL)}</strong> — about{" "}
          <strong className="text-ink">{((EXPOSURE_TOTAL / RESOURCE_ENVELOPE_FY2026_27.value) * 100).toFixed(0)}%</strong> of
          the annual resource envelope. That comparison is this chart&apos;s only computation: a sum of figures already
          stated above and in Section 1.2.4, not a new estimate.
        </>
      }
      provenance={[RESOURCE_ENVELOPE_FY2026_27.provenance, PENDING_BILLS_FY2020_21.provenance, ...AUDIT_QUERIES_FY2023_24.map((q) => q.provenance)]}
    >

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

    </FigureBlock>
  );
}
