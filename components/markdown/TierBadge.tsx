import type { Tier } from "../../data/types";
import { TIER_META } from "../../data/types";

/**
 * Visible source-reliability badge (Tier 1 Official / Tier 2 Reported / Tier 3 Single-source).
 * A reader must never have to guess which tier a figure comes from — this is the mechanism
 * that renders the tier, not just stores it. Server component, no interactivity.
 *
 * Deliberately icon-free (color + text only, like the eyebrow-label convention) rather than
 * pulling in another lucide-react icon per tier — this badge renders on every new figure in
 * the document, including ones mounted in the initial route bundle, so it stays as light as
 * the claim-badge pattern it extends.
 */
export function TierBadge({ tier, compact = false }: { tier: Tier; compact?: boolean }) {
  const { label, short } = TIER_META[tier];
  return (
    <span
      className={`tier-badge tier-badge-${tier} ${compact ? "px-1.5 py-[1px] text-[8px]" : "px-2 py-0.5 text-[9px] sm:text-[10px]"}`}
      title={TIER_META[tier].description}
    >
      {compact ? short : `Tier ${tier} — ${label}`}
    </span>
  );
}
