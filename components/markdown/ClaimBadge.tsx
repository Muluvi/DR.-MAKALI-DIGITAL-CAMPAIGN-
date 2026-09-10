import { CircleCheck, TrendingUp, Clock, CircleDashed } from "lucide-react";

export type ClaimStatus = "verified" | "estimate" | "awaiting" | "unmeasured";

const STATUS_CONFIG: Record<ClaimStatus, { label: string; icon: typeof CircleCheck; className: string }> = {
  verified: { label: "Verified", icon: CircleCheck, className: "claim-badge-verified" },
  estimate: { label: "Estimate", icon: TrendingUp, className: "claim-badge-estimate" },
  awaiting: { label: "Awaiting campaign decision", icon: Clock, className: "claim-badge-awaiting" },
  // A named data gap, and a different thing from either of the two above. "Awaiting campaign
  // decision" is a choice nobody has made; "Not yet measured" is a quantity nobody has read.
  // The four nomination KPI baselines are the latter, and rendering them as anything else —
  // a zero especially — would report an unmeasured quantity as a measured one.
  unmeasured: { label: "Not yet measured", icon: CircleDashed, className: "claim-badge-unmeasured" },
};

/**
 * Four-state claim-status badge (Verified / Estimate / Awaiting campaign decision / Not yet
 * measured). Each state carries an icon and a border style as well as a colour, so the three
 * provenance states stay distinguishable without relying on colour alone. Server
 * component — no interactivity, so it stays out of the client bundle entirely.
 */
export function ClaimBadge({ status, compact = false }: { status: ClaimStatus; compact?: boolean }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span
      className={`claim-badge ${className} ${compact ? "px-1.5 py-[1px] t-micro" : "px-2 py-0.5 t-micro sm:t-label"}`}
    >
      <Icon size={compact ? 9 : 11} className="shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}
