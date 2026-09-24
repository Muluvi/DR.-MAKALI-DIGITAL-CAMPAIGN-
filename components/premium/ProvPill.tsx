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

export function ProvPill({ p }: { p: Provenance }) {
  const state = p.state ?? "sourced";
  if (state === "needed") return <span className="pf-pp pf-pp--needed">Data needed</span>;
  if (state === "target") return <span className="pf-pp pf-pp--target">Target</span>;
  if (state === "modelled") return <span className="pf-pp pf-pp--modelled">Modelled{p.tier ? ` · ${p.tier}` : ""}</span>;
  if (!p.tier) return <span className="pf-pp pf-pp--needed">No tier</span>;
  return <span className={`pf-pp pf-pp--${p.tier.toLowerCase()}`}>{p.tier}</span>;
}
