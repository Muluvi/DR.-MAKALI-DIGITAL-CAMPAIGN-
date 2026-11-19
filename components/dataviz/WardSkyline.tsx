import { figure, fmt } from "../../lib/data/read";
import { resolveFigure } from "../../lib/card/spec";
import { TOOL_WARDS } from "../../lib/tools/dataset";
import { ExportableVisual } from "../visual/ExportableVisual";

/**
 * The 40 wards as a skyline (visual upgrade, C16): each ward a column on its tile-map square,
 * raised by its registered voters.
 *
 * ORTHOGRAPHIC, NOT PERSPECTIVE. A perspective camera makes a far column look shorter than a near
 * one of the same height, which would misstate the data. This is an isometric projection: every
 * column's height is the same number of pixels per voter wherever it stands, and heights start at
 * the ground (zero). It is server-rendered SVG, with no 3D library. The league table above gives the
 * same numbers flat, for exact reading.
 */
const TILE = 26; // half-width of a tile's diamond
const RISE = 13; // half-height of a tile's diamond
const MAX_H = 150; // the tallest ward's height in pixels

export function WardSkyline() {
  const wards = TOOL_WARDS.map((w) => ({ ...w, voters: figure(`ward.${w.id}`).value ?? 0 }));
  const max = Math.max(...wards.map((w) => w.voters));
  const rows = Math.max(...wards.map((w) => w.row)) + 1;
  const cols = Math.max(...wards.map((w) => w.col)) + 1;
  const ox = rows * TILE + 10;
  const oy = MAX_H + 24;
  const width = (rows + cols) * TILE + 20;
  const height = oy + (rows + cols) * RISE + 20;
  const iso = (col: number, row: number) => [ox + (col - row) * TILE, oy + (col + row) * RISE] as const;
  // Back to front, so nearer columns paint over farther ones.
  const order = [...wards].sort((a, b) => a.row + a.col - (b.row + b.col) || a.col - b.col);
  const tallest = [...wards].sort((a, b) => b.voters - a.voters).slice(0, 3).map((w) => w.id);
  const register = resolveFigure({ id: "register.2022", label: "registered voters" });
  const top = resolveFigure({ id: `ward.${tallest[0]}`, label: "" });

  return (
    <ExportableVisual
      id="ward-skyline"
      title="The register as a skyline: a handful of wards tower over the rest"
      note="Each ward stands on its square of the tile map, raised by its registered voters. Drawn without perspective, so equal heights are equal voters wherever they stand."
      figures={[register, top]}
      card={{ type: "ranked", params: { measure: "voters" } }}
    >
      <div className="sk-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} className="sk" role="img" aria-label={`Skyline of the 40 wards by registered voters. Tallest: ${tallest.map((id) => `${wards.find((w) => w.id === id)!.name}, ${fmt(`ward.${id}`)}`).join("; ")}.`}>
          {order.map((w, i) => {
            const h = (w.voters / max) * MAX_H;
            const [x, y] = iso(w.col, w.row);
            // The tile's diamond: top, right, bottom, left corners at ground level.
            const t = [x, y - RISE * 0.9];
            const r = [x + TILE * 0.9, y];
            const b = [x, y + RISE * 0.9];
            const l = [x - TILE * 0.9, y];
            const up = (p: number[]) => `${p[0]},${p[1] - h}`;
            const pt = (p: number[]) => `${p[0]},${p[1]}`;
            return (
              <g key={w.id} className="sk__col xv-grow-y" data-pool={w.pool ? "true" : "false"} data-zone={w.zone} style={{ "--i": Math.min(i, 30), transformOrigin: `${x}px ${y}px` } as React.CSSProperties}>
                <polygon className="sk__left" points={[pt(l), pt(b), up(b), up(l)].join(" ")} />
                <polygon className="sk__right" points={[pt(b), pt(r), up(r), up(b)].join(" ")} />
                <polygon className="sk__top" points={[up(t), up(r), up(b), up(l)].join(" ")} />
              </g>
            );
          })}
          {order.filter((w) => tallest.includes(w.id)).map((w) => {
            const [x, y] = iso(w.col, w.row);
            const h = (w.voters / max) * MAX_H;
            return (
              <g key={`l-${w.id}`} className="sk__label">
                <line x1={x} y1={y - h - RISE} x2={x} y2={y - h - RISE - 10} />
                <text x={x} y={y - h - RISE - 14} textAnchor="middle">{w.name}</text>
              </g>
            );
          })}
        </svg>
        <p className="sk__legend">
          <span className="sk__key sk__key--pool" aria-hidden="true" /> never held office <span className="sk__key" aria-hidden="true" /> other wards · tallest: {fmt(`ward.${tallest[0]}`)} voters
        </p>
      </div>
    </ExportableVisual>
  );
}
