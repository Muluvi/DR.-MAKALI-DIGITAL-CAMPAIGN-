/**
 * The 40 wards as tiles (brief §E.7, §O). Schematic, not to scale.
 *
 * There is no ward boundary file in the repo, so the map is a tile map: every ward the same size,
 * which is also the right choice for Kitui, where Mutha and Township differ in area by two orders
 * of magnitude and a choropleth would let the empty north outshout the dense centre.
 *
 * Constituency blocks are placed roughly as the county sits: Mwingi across the north, Kitui West,
 * Central and Rural through the middle and south-west, Kitui East as the long eastern strip, Kitui
 * South at the bottom. Ward position inside a block carries no geographic meaning: wards are laid
 * out largest first, left to right, top to bottom.
 */
import register from "../../data/ward-register.json" with { type: "json" };
import { slugOf } from "../data/figures.ts";

export type ZoneId = "anchor" | "mwingi" | "arid" | "none";

export interface WardTile {
  id: string;
  name: string;
  constituency: string;
  constituencyName: string;
  row: number;
  col: number;
  zone: ZoneId;
  voters: number;
}

/** Block origin (row, col) and width in tiles, per constituency. The grid is 6 columns by 8 rows. */
const BLOCKS: Record<string, { row: number; col: number; width: number; zone: ZoneId }> = {
  "mwingi-north": { row: 0, col: 3, width: 3, zone: "mwingi" },
  "mwingi-west": { row: 1, col: 0, width: 2, zone: "mwingi" },
  "mwingi-central": { row: 2, col: 2, width: 3, zone: "mwingi" },
  "kitui-west": { row: 4, col: 0, width: 2, zone: "anchor" },
  "kitui-central": { row: 4, col: 2, width: 3, zone: "anchor" },
  "kitui-east": { row: 3, col: 5, width: 1, zone: "arid" },
  "kitui-rural": { row: 6, col: 0, width: 2, zone: "none" },
  "kitui-south": { row: 6, col: 2, width: 3, zone: "arid" },
};

export const GRID = { cols: 6, rows: 9 };

type Constituency = { id: string; name: string; voters: number; wards: { name: string; voters: number }[] };

export const WARD_TILES: WardTile[] = (register.constituencies as Constituency[]).flatMap((c) => {
  const b = BLOCKS[c.id];
  if (!b) throw new Error(`wards: no tile block for ${c.id}`);
  return [...c.wards]
    .sort((x, y) => y.voters - x.voters)
    .map((w, i) => ({
      id: `ward.${slugOf(w.name)}`,
      name: w.name,
      constituency: c.id,
      constituencyName: c.name,
      row: b.row + Math.floor(i / b.width),
      col: b.col + (i % b.width),
      zone: b.zone,
      voters: w.voters,
    }));
});

export const CONSTITUENCY_BLOCKS = BLOCKS;

// Every tile has its own cell: a collision would hide a ward.
{
  const seen = new Set<string>();
  for (const t of WARD_TILES) {
    const key = `${t.row},${t.col}`;
    if (seen.has(key)) throw new Error(`wards: two tiles at ${key}`);
    seen.add(key);
  }
  if (WARD_TILES.length !== 40) throw new Error(`wards: expected 40 tiles, have ${WARD_TILES.length}`);
}
