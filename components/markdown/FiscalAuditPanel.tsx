import { AUDIT_QUERIES_FY2023_24, PENDING_BILLS_FY2020_21, STALLED_HEALTH_PROJECTS_GAP } from "../../data/fiscal-audit";
import { DISPUTED_FIGURES } from "../../data/disputed-figures";
import { TierBadge } from "./TierBadge";
import { DisputedFigure } from "./DisputedFigure";
import { ProvenanceLine } from "./ProvenanceLine";

const absorptionDispute = DISPUTED_FIGURES.find((d) => d.id === "kitui-fy2025-26-q1-absorption")!;

function formatKSh(value: number): string {
  if (value >= 1_000_000_000) return `KSh${(value / 1_000_000_000).toFixed(2)}bn`;
  return `KSh${(value / 1_000_000).toFixed(0)}m`;
}

/**
 * County fiscal and audit record (Section 4.7). Server component — the chart pairing this
 * table against the resource envelope (Phase 6d) lives in FiscalAuditBlock, dynamically
 * imported alongside it.
 */
export function FiscalAuditPanel() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Auditor-General FY2023/24 Queries and Pending Bills</h4>
      </div>
      <p className="text-[11px] text-muted mb-4 leading-relaxed pl-3.5">
        These are queries flagged by the Auditor-General, not settled findings of wrongdoing — the county has a right
        of reply through the normal audit process.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-[9px] uppercase tracking-wider font-bold text-muted">
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

      <ProvenanceLine
        provenance={[PENDING_BILLS_FY2020_21.provenance, ...AUDIT_QUERIES_FY2023_24.map((q) => q.provenance)]}
      />
    </div>
  );
}
