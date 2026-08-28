import { ShieldCheck, Newspaper, AlertTriangle } from "lucide-react";
import type { Tier } from "../../data/types";
import { TIER_META } from "../../data/types";

const TIER_ICON: Record<Tier, typeof ShieldCheck> = {
  1: ShieldCheck,
  2: Newspaper,
  3: AlertTriangle,
};

/**
 * Visible source-reliability badge (Tier 1 Official / Tier 2 Reported / Tier 3 Single-source).
 * A reader must never have to guess which tier a figure comes from — this is the mechanism
 * that renders the tier, not just stores it. Server component, no interactivity.
 */
export function TierBadge({ tier, compact = false }: { tier: Tier; compact?: boolean }) {
  const { label, short } = TIER_META[tier];
  const Icon = TIER_ICON[tier];
  return (
    <span
      className={`tier-badge tier-badge-${tier} ${compact ? "px-1.5 py-[1px] text-[8px]" : "px-2 py-0.5 text-[9px] sm:text-[10px]"}`}
      title={TIER_META[tier].description}
    >
      <Icon size={compact ? 9 : 11} className="shrink-0" aria-hidden="true" />
      {compact ? short : `Tier ${tier} — ${label}`}
    </span>
  );
}
