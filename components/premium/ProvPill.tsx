import type { Figure, FigureState, Tier } from "../../lib/data/schema";

/**
 * The provenance pill, redrawn for the new visual language. The states differ by SHAPE and
 * LABEL before colour, so they survive greyscale and print:
 *
 *   T1        solid
 *   T2        outlined
 *   T3        dashed outline
 *   modelled  woven fill (the kiondo pattern) plus its tier
 *   target    double rule
 *   needed    dotted, empty
 */
export type Provenance = { tier: Tier | null; state?: FigureState };

export function provenanceOf(f: Pick<Figure, "tier" | "state">): Provenance {
  return { tier: f.tier, state: f.state };
}

/**
 * NOT SHOWN (November 2026, the campaign's direction): figures carry no status tags, no
 * "Official", "Reported", "Unconfirmed", "Modelled", "Estimate" or "Awaiting" chips. The tier and
 * state stay in the data and in each figure's source line; only the tag is not drawn. This
 * component is kept, rendering nothing, so every call site keeps compiling and the tags can be
 * restored here in one place.
 */
export function ProvPill(_props: { p: Provenance }) {
  return null;
}
