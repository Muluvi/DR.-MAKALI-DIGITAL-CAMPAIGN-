export type ClaimStatus = "verified" | "estimate" | "awaiting" | "unmeasured";

/**
 * Four-state claim-status badge (Verified / Estimate / Awaiting campaign decision / Not yet
 * measured). Each state carries an icon and a border style as well as a colour, so the three
 * provenance states stay distinguishable without relying on colour alone. Server
 * component — no interactivity, so it stays out of the client bundle entirely.
 *
 * NOT SHOWN (November 2026, the campaign's direction): figures carry no status tags, no
 * "Official", "Reported", "Unconfirmed", "Modelled", "Estimate" or "Awaiting" chips. The tier and
 * state stay in the data and in each figure's source line; only the tag is not drawn. This
 * component is kept, rendering nothing, so every call site keeps compiling and the tags can be
 * restored here in one place.
 */
export function ClaimBadge(_props: { status: ClaimStatus; compact?: boolean }) {
  return null;
}
