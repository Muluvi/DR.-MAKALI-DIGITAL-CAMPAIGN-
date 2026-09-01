import { CheckCircle2, TrendingUp, Clock } from "lucide-react";

export type ClaimStatus = "verified" | "estimate" | "awaiting";

const STATUS_CONFIG: Record<ClaimStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  verified: { label: "Verified", icon: CheckCircle2, className: "claim-badge-verified" },
  estimate: { label: "Estimate", icon: TrendingUp, className: "claim-badge-estimate" },
  awaiting: { label: "Awaiting campaign decision", icon: Clock, className: "claim-badge-awaiting" },
};

/**
 * Three-state claim-status badge (Verified / Estimate / Awaiting campaign decision). Server
 * component — no interactivity, so it stays out of the client bundle entirely.
 */
export function ClaimBadge({ status, compact = false }: { status: ClaimStatus; compact?: boolean }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span
      className={`claim-badge ${className} ${compact ? "px-1.5 py-[1px] text-[8px]" : "px-2 py-0.5 text-[9px] sm:text-[10px]"}`}
    >
      <Icon size={compact ? 9 : 11} className="shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}
