import type { Tier } from "../../data/types";

/**
 * Visible source-reliability badge (Tier 1 Official / Tier 2 Reported / Tier 3 Single-source).
 * A reader must never have to guess which tier a figure comes from — this is the mechanism
 * that renders the tier, not just stores it. Server component, no interactivity.
 *
 * Deliberately icon-free (color + text only, like the eyebrow-label convention) rather than
 * pulling in another lucide-react icon per tier — this badge renders on every new figure in
 * the document, including ones mounted in the initial route bundle, so it stays as light as
 * the claim-badge pattern it extends.
 *
 * NOT SHOWN (November 2026, the campaign's direction): figures carry no status tags, no
 * "Official", "Reported", "Unconfirmed", "Modelled", "Estimate" or "Awaiting" chips. The tier and
 * state stay in the data and in each figure's source line; only the tag is not drawn. This
 * component is kept, rendering nothing, so every call site keeps compiling and the tags can be
 * restored here in one place.
 */
export function TierBadge(_props: { tier: Tier; compact?: boolean }) {
  return null;
}
