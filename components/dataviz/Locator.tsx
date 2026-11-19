import { BOX, COUNTY } from "../../lib/premium/county";

/**
 * A locator mini-map (visual upgrade, C24): the county's real ward boundaries, with the wards a
 * visual is about filled and the rest drawn faint. Server-rendered SVG, so it costs no script and
 * reads the same in print and with JavaScript off.
 *
 * `wards` takes ward slugs ("kyuso") or tile ids ("ward.kyuso").
 */
export function WardLocator({
  wards,
  label,
  size = 96,
  tone = "accent",
  className = "",
}: {
  wards: Iterable<string>;
  /** What the highlighted wards are, for assistive technology. */
  label: string;
  size?: number;
  tone?: "accent" | "earth";
  className?: string;
}) {
  const lit = new Set([...wards].map((w) => (w.startsWith("ward.") ? w : `ward.${w}`)));
  return (
    <svg
      viewBox={`0 0 ${BOX.w} ${BOX.h}`}
      width={size * (BOX.w / BOX.h)}
      height={size}
      role="img"
      aria-label={label}
      className={`loc loc--${tone} ${className}`}
    >
      {COUNTY.map((w) => (
        <path key={w.tile.id} d={w.path} className={lit.has(w.tile.id) ? "loc__on" : "loc__off"} />
      ))}
    </svg>
  );
}
