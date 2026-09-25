"use client";

import { ProvPill, type Provenance } from "./ProvPill";
import { Roll } from "./Roll";

/**
 * <BigNumber> (brief G-8): display face, number morph, unit beside it, context under it,
 * provenance pill. The morph and its honesty rules live in <Roll>.
 */
export function BigNumber({
  value,
  unit,
  context,
  provenance,
  tone = "ink",
  size = "lg",
}: {
  /** The number exactly as printed, e.g. "605,703", "51.7%", "≈200,000–225,000", "Both". */
  value: string;
  unit?: string;
  context: string;
  provenance: Provenance;
  tone?: "ink" | "accent" | "earth";
  size?: "lg" | "md";
}) {
  return (
    <figure className={`pf-bn pf-bn--${size} pf-tone-${tone}`} style={{ "--chars": Math.max(5, value.length) } as React.CSSProperties}>
      <p className="pf-bn__value">
        <Roll value={value} />
        {unit && <span className="pf-bn__unit">{unit}</span>}
      </p>
      <figcaption className="pf-bn__context">
        <span>{context}</span>
        <ProvPill p={provenance} />
      </figcaption>
    </figure>
  );
}
