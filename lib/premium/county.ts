/**
 * Kitui's 40 wards as real geography, joined to the ward register and to the tile map.
 *
 * Boundaries: Omare, B.D.A. and Omare, G.J.M. (2017), "Kenya County Assembly Boundaries",
 * digitised at 1:50,000 from the IEBC's proposed ward delimitation of 9 January 2012, CC BY 4.0
 * (github.com/benaboki/Kenya-County-Assembly-Boundaries, commit 7ee2ae5). Simplified with
 * mapshaper (22%, weighted, shapes kept) into public/geo/kitui-wards.topo.json. Provenance and
 * the spelling alias is recorded in docs/visual-premium/GEOGRAPHY.md.
 *
 * Every number drawn from this module is a ward's 2022 registered voters, read from the same
 * WARD_TILES the tile map uses (data/ward-register.json, verified by verify-ward-register). The
 * geometry carries no data of its own.
 */
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";

import topo from "../../public/geo/kitui-wards.topo.json" with { type: "json" };
import { WARD_TILES, GRID, type WardTile } from "../geo/wards.ts";

export type WardRole = "held" | "pool" | "other";

/** Constituencies where he has never held office and which together make "the pool". */
const POOL = new Set(["mwingi-north", "mwingi-west", "mwingi-central", "kitui-south"]);

export function roleOf(t: Pick<WardTile, "constituency">): WardRole {
  if (t.constituency === "kitui-central") return "held";
  return POOL.has(t.constituency) ? "pool" : "other";
}

export interface CountyWard {
  tile: WardTile;
  role: WardRole;
  /** SVG path in the static frame's coordinate box. */
  path: string;
  /** The ward's largest polygon, outer ring, in scene units (y up), counter-clockwise, unclosed. */
  ring: [number, number][];
  /** Geographic centroid, scene units. */
  centroid: [number, number];
  /** Tile centre in the same scene units, and the tile's half-size. */
  tileCentre: [number, number];
}

/** The static frame and the scene share one box so the SVG fallback and the 3D scene agree. */
export const BOX = { w: 600, h: 1000 };

type WardProps = { ward: string; constituency: string; wardcode: string };

const collection = feature(
  topo as unknown as Topology,
  (topo as unknown as Topology).objects.wards as GeometryCollection<WardProps>
) as unknown as { features: Feature<Polygon | MultiPolygon, WardProps>[] };

const projection = geoMercator().fitExtent(
  [
    [20, 20],
    [BOX.w - 20, BOX.h - 20],
  ],
  collection as unknown as GeoPermissibleObjects
);
const svgPath = geoPath(projection);

const key = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
const TILE_BY_NAME = new Map(WARD_TILES.map((t) => [key(t.name), t]));

function largestRing(g: Polygon | MultiPolygon): Position[] {
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  let best: Position[] = polys[0][0];
  let bestArea = -1;
  for (const p of polys) {
    const a = Math.abs(signedArea(p[0].map((q) => [q[0], q[1]] as [number, number])));
    if (a > bestArea) {
      bestArea = a;
      best = p[0];
    }
  }
  return best;
}

export function signedArea(r: [number, number][]): number {
  let s = 0;
  for (let i = 0; i < r.length; i++) {
    const [x1, y1] = r[i];
    const [x2, y2] = r[(i + 1) % r.length];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

/** Scene units: the SVG box, centred on the origin, y flipped so it points up. */
const toScene = ([x, y]: [number, number]): [number, number] => [x - BOX.w / 2, BOX.h / 2 - y];

/**
 * The tile map's grid, laid over the same box. Tiles keep the tile map's positions exactly
 * (lib/geo/wards.ts), so the morph ends on the honest equal-tile map the reader meets again in §3.
 */
const CELL = Math.min((BOX.w - 60) / GRID.cols, (BOX.h - 60) / GRID.rows);
export const TILE_HALF = CELL * 0.43;
function tileCentre(t: WardTile): [number, number] {
  const gx = (t.col - (GRID.cols - 1) / 2) * CELL;
  const gy = ((GRID.rows - 1) / 2 - t.row) * CELL;
  return [gx, gy];
}

export const COUNTY: CountyWard[] = collection.features.map((f) => {
  const tile = TILE_BY_NAME.get(key(f.properties.ward));
  if (!tile) throw new Error(`county: no register row for ward ${f.properties.ward}`);
  const projected = largestRing(f.geometry).map((p) => projection(p as [number, number]) as [number, number]);
  let ring = projected.map(toScene);
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] === last[0] && first[1] === last[1]) ring = ring.slice(0, -1);
  if (signedArea(ring) < 0) ring.reverse();
  const c = svgPath.centroid(f as unknown as GeoPermissibleObjects) as [number, number];
  return {
    tile,
    role: roleOf(tile),
    path: svgPath(f as unknown as GeoPermissibleObjects) ?? "",
    ring,
    centroid: toScene(c),
    tileCentre: tileCentre(tile),
  };
});

if (COUNTY.length !== WARD_TILES.length) {
  throw new Error(`county: ${COUNTY.length} boundaries for ${WARD_TILES.length} register wards`);
}

export const MAX_VOTERS = Math.max(...WARD_TILES.map((t) => t.voters));

/** Tile rectangle in the static frame's SVG coordinates (y down), for the static tile state. */
export function tileRectSvg(w: CountyWard) {
  const [cx, cy] = w.tileCentre;
  return { x: cx + BOX.w / 2 - TILE_HALF, y: BOX.h / 2 - cy - TILE_HALF, size: TILE_HALF * 2 };
}
