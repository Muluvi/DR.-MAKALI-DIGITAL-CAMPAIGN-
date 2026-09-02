"use client";

import { LazyMount } from "../LazyMount";
import { ProvenanceLine } from "./ProvenanceLine";
import { RESOURCE_ENVELOPE_FY2026_27, AUDIT_QUERIES_FY2023_24, PENDING_BILLS_FY2020_21 } from "../../data/fiscal-audit";
import FiscalAuditChart, { type FiscalBar } from "../charts/FiscalAuditChart";

const AUDIT_TOTAL = AUDIT_QUERIES_FY2023_24.reduce((sum, q) => sum + q.value, 0);
const EXPOSURE_TOTAL = AUDIT_TOTAL + PENDING_BILLS_FY2020_21.value;

function fmt(v: number): string {
  return `KSh${(v / 1_000_000_000).toFixed(2)}bn`;
}

const DATA: FiscalBar[] = [
  { name: "Resource envelope (FY2026/27)", value: RESOURCE_ENVELOPE_FY2026_27.value, display: `${fmt(RESOURCE_ENVELOPE_FY2026_27.value)} — Section 4.4`, color: "#0056a8" },
  { name: "Audit queries (FY2023/24)", value: AUDIT_TOTAL, display: `${fmt(AUDIT_TOTAL)} — sum of the four Auditor-General queries above`, color: "#e31d2b" },
  { name: "Pending bills (FY2020/21)", value: PENDING_BILLS_FY2020_21.value, display: `${fmt(PENDING_BILLS_FY2020_21.value)} (approx.)`, color: "#b45309" },
];

export function FiscalAuditChartBlockContent() {
  return (
    <div className="not-prose bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Resource Envelope Against Audit Exposure</h4>
      </div>
      <p className="t-small text-muted mb-3 leading-relaxed pl-3.5">
        Audit queries and pending bills together are <strong className="text-ink">{fmt(EXPOSURE_TOTAL)}</strong> — about{" "}
        <strong className="text-ink">{((EXPOSURE_TOTAL / RESOURCE_ENVELOPE_FY2026_27.value) * 100).toFixed(0)}%</strong> of
        the annual resource envelope. That comparison is this chart&apos;s only computation: a sum of figures already
        stated above and in Section 4.4, not a new estimate.
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

      <ProvenanceLine
        provenance={[RESOURCE_ENVELOPE_FY2026_27.provenance, PENDING_BILLS_FY2020_21.provenance, ...AUDIT_QUERIES_FY2023_24.map((q) => q.provenance)]}
      />
    </div>
  );
}
