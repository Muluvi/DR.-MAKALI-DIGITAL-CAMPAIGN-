import { BOX, COUNTY, tileRectSvg } from "../../lib/premium/county";
import { group } from "../../lib/data/format";
import { WeaveDefs } from "./weave";

/**
 * The county as a static SVG: the same encoding the 3D scene draws, for every reader the scene
 * does not reach — reduced motion, no WebGL, JavaScript off, and print. Server-rendered, so it
 * is in the HTML.
 *
 *   held    Kitui Central, where he has held office: accent blue
 *   pool    Mwingi North, West, Central and Kitui South: laterite, woven
 *   other   neutral
 *
 * `state="tiles"` draws the same wards at their tile-map positions: the end state of the morph.
 * `quiet` drops labels and lowers contrast for use as a background layer.
 */
export function CountyStatic({
  id,
  state = "geo",
  quiet = false,
  showPool = true,
  className = "",
  label,
}: {
  id: string;
  state?: "geo" | "tiles";
  quiet?: boolean;
  showPool?: boolean;
  className?: string;
  label?: string;
}) {
  const weaveId = `${id}-weave`;
  return (
    <svg
      className={`pf-county ${quiet ? "is-quiet" : ""} ${className}`}
      viewBox={`0 0 ${BOX.w} ${BOX.h}`}
      role={quiet ? undefined : "img"}
      aria-hidden={quiet ? "true" : undefined}
      aria-label={quiet ? undefined : label}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <WeaveDefs id={weaveId} color="var(--pf-on-earth-weave)" />
      </defs>
      {COUNTY.map((w) => {
        const fill = w.role === "held" ? "var(--pf-accent-solid)" : w.role === "pool" && showPool ? "var(--pf-earth-solid)" : "var(--pf-neutral-tile)";
        const title = `${w.tile.name} (${w.tile.constituencyName}): ${group(w.tile.voters)} registered voters, 2022`;
        if (state === "tiles") {
          const r = tileRectSvg(w);
          return (
            <g key={w.tile.id}>
              {!quiet && <title>{title}</title>}
              <rect x={r.x} y={r.y} width={r.size} height={r.size} rx={6} style={{ fill }} className="pf-county__ward" />
              {w.role === "pool" && showPool && <rect x={r.x} y={r.y} width={r.size} height={r.size} rx={6} fill={`url(#${weaveId})`} />}
            </g>
          );
        }
        return (
          <g key={w.tile.id}>
            {!quiet && <title>{title}</title>}
            <path d={w.path} style={{ fill }} className="pf-county__ward" />
            {w.role === "pool" && showPool && <path d={w.path} fill={`url(#${weaveId})`} />}
          </g>
        );
      })}
    </svg>
  );
}
