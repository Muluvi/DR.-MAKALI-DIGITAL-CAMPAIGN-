import { BOX, COUNTY, tileRectSvg } from "../../lib/premium/county";
import { group } from "../../lib/data/format";
import { WeaveDefs } from "./weave";

/**
 * The county as an SVG, server-rendered, so it is in the HTML for every reader: reduced motion,
 * JavaScript off and print get exactly what everyone else gets. It replaced the WebGL scene
 * (visual-first pass, October 2026): WebGL is on the brief's reject list, and the scene cost
 * ≈ 300 kB of script on the first screen of a phone on slow 4G.
 *
 *   held    Kitui Central, where he has held office: accent blue
 *   pool    Mwingi North, West, Central and Kitui South: laterite, woven
 *   other   neutral
 *
 * `state="tiles"` draws the same wards at their tile-map positions: the end state of the morph.
 * `quiet` drops labels and lowers contrast for use as a background layer.
 * `lit`, when given, replaces the role colouring: the wards in it are drawn in the highlight and
 * the rest dimmed. `trap` draws the lit wards in laterite instead (a route the analysis rejects).
 * `draw` traces each ward's outline once on first paint (CSS, `.pf-county--draw`); the final
 * state is the default style, so without the animation the map is complete.
 */
export function CountyStatic({
  id,
  state = "geo",
  quiet = false,
  showPool = true,
  className = "",
  label,
  lit,
  trap = false,
  draw = false,
}: {
  id: string;
  state?: "geo" | "tiles";
  quiet?: boolean;
  showPool?: boolean;
  className?: string;
  label?: string;
  lit?: ReadonlySet<string> | null;
  trap?: boolean;
  draw?: boolean;
}) {
  const weaveId = `${id}-weave`;
  return (
    <svg
      className={`pf-county ${quiet ? "is-quiet" : ""} ${draw ? "pf-county--draw" : ""} ${className}`}
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
        const on = lit ? lit.has(w.tile.id) : false;
        const fill = lit
          ? on
            ? trap
              ? "var(--pf-earth-solid)"
              : "var(--pf-accent-solid)"
            : "var(--pf-neutral-tile)"
          : w.role === "held"
            ? "var(--pf-accent-solid)"
            : w.role === "pool" && showPool
              ? "var(--pf-earth-solid)"
              : "var(--pf-neutral-tile)";
        const weave = !lit && w.role === "pool" && showPool;
        const title = `${w.tile.name} (${w.tile.constituencyName}): ${group(w.tile.voters)} registered voters, 2022`;
        if (state === "tiles") {
          const r = tileRectSvg(w);
          return (
            <g key={w.tile.id}>
              {!quiet && <title>{title}</title>}
              <rect x={r.x} y={r.y} width={r.size} height={r.size} rx={6} style={{ fill }} className="pf-county__ward" />
              {weave && <rect x={r.x} y={r.y} width={r.size} height={r.size} rx={6} fill={`url(#${weaveId})`} />}
            </g>
          );
        }
        return (
          <g key={w.tile.id}>
            {!quiet && <title>{title}</title>}
            <path d={w.path} style={{ fill }} className="pf-county__ward" data-dim={lit && !on ? "true" : undefined} pathLength={draw ? 1 : undefined} />
            {weave && <path d={w.path} fill={`url(#${weaveId})`} />}
          </g>
        );
      })}
    </svg>
  );
}
