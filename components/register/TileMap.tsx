import { LAYERS, TILES } from "../../lib/register/tilemap";
import type { TileLayerId } from "../../lib/register/types";
import { CONSTITUENCY_BLOCKS, GRID } from "../../lib/geo/wards";
import { TierPill } from "./Figure";
import { group } from "../../lib/data/format";

/**
 * The signature figure: 40 wards as equal tiles (brief §E.7). A server component.
 *
 * ONE SET OF TILES, SIX LAYERS. Each tile carries every layer's fill as a custom property; a row of
 * radio inputs above the map picks which one paints, through `:has()` in app/register.css. That
 * gives the brief's morph (the fill transitions in place, so the reader watches which wards hold
 * and which flip) with no JavaScript at all, and a reader with scripts off gets the same control.
 * Reduced motion keeps the change and drops the transition.
 *
 * Every tile prints its label in text, so no layer is read from colour alone; hatched means
 * modelled or a target, dashed means the data is not in hand. A searchable list by constituency
 * sits under the map (brief §L.2: always provide a list alternative).
 */
const T = 44; // tile size, in SVG units
const GAP = 3;
const ROW = T + 12; // room above each row for a constituency label

export function TileMap({ id, layers, initial, showWardList = false }: { id: string; layers: TileLayerId[]; initial: TileLayerId; showWardList?: boolean }) {
  const W = GRID.cols * (T + GAP);
  const H = GRID.rows * ROW + 12;
  const pos = (r: number, c: number) => ({ x: c * (T + GAP), y: r * ROW + 12 });
  const multi = layers.length > 1;
  const init = LAYERS[initial];

  return (
    <div className={`tm ${multi ? "" : ""}`}>
      {multi && (
        <fieldset className="tm-layers">
          <legend>Layer</legend>
          {layers.map((l) => (
            <label key={l}>
              <input type="radio" name={`${id}-layer`} value={l} defaultChecked={l === initial} />
              <span>{LAYERS[l].name}</span>
            </label>
          ))}
        </fieldset>
      )}

      <svg className="rf-svg mx-auto max-w-[22rem]" viewBox={`-2 0 ${W + 4} ${H}`} role="img" aria-label={`Tile map of Kitui's 40 wards, schematic, not to scale. ${init.name}: ${init.description}`}>
        <defs>
          <pattern id={`${id}-hatch`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="transparent" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--card)" strokeWidth="2.2" strokeOpacity="0.65" />
          </pattern>
        </defs>

        {Object.entries(CONSTITUENCY_BLOCKS).map(([cid, b]) => {
          const name = TILES.find((t) => t.constituency === cid)?.constituencyName ?? cid;
          const p = pos(b.row, b.col);
          return (
            <text key={cid} x={p.x + 1} y={p.y - 3} className="tm-block-label">{name}</text>
          );
        })}

        {TILES.map((t) => {
          const p = pos(t.row, t.col);
          const styles = Object.fromEntries(layers.map((l) => [l, LAYERS[l].style(t)]));
          const vars = Object.fromEntries(layers.map((l) => [`--f-${l}`, styles[l].fill]));
          const def = styles[initial];
          return (
            <g key={t.id} className="tm-tile" transform={`translate(${p.x} ${p.y})`}>
              <title>{`${t.name} (${t.constituencyName}): ${group(t.voters)} registered voters`}</title>
              <rect className="tm-fill" width={T} height={T} rx={4} style={{ ...vars, ["--f-default" as string]: def.fill } as React.CSSProperties} />
              {layers.map((l) => {
                const s = styles[l];
                const cls = l === initial ? "is-default" : "";
                return (
                  <g key={l}>
                    {s.hatch && <rect className={`tm-hatch ${cls}`} data-l={l} width={T} height={T} rx={4} fill={`url(#${id}-hatch)`} />}
                    {s.dashed && <rect className={`tm-hatch ${cls}`} data-l={l} x={1} y={1} width={T - 2} height={T - 2} rx={3.5} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="3 2.5" />}
                    <text className={`tm-lab tm-v ${cls}`} data-l={l} x={T / 2} y={T / 2 + 1} textAnchor="middle" style={{ fill: s.ink }}>{s.label}</text>
                  </g>
                );
              })}
              <text x={T / 2} y={T - 5} textAnchor="middle" style={{ fill: "var(--ink)", fontSize: 6, paintOrder: "stroke", stroke: "var(--card)", strokeWidth: 2 }}>
                {t.name.length > 11 ? `${t.name.slice(0, 10)}…` : t.name}
              </text>
            </g>
          );
        })}
      </svg>

      {layers.map((l) => {
        const L = LAYERS[l];
        return (
          <div key={l} className={`tm-panel ${l === initial ? "is-default" : ""}`} data-l={l}>
            <p className="rb-label !block"><strong>{L.name}.</strong> {L.description}</p>
            <ul className="tm-legend">
              {L.legend.map((g) => (
                <li key={g.label}>
                  <span className="tm-swatch" aria-hidden="true" style={{ background: g.fill, borderStyle: g.dashed ? "dashed" : "solid", borderColor: g.dashed ? "var(--muted)" : undefined, backgroundImage: g.hatch ? "repeating-linear-gradient(45deg, transparent 0 3px, rgba(255,255,255,0.6) 3px 4.5px)" : undefined }} />
                  {g.label}
                </li>
              ))}
            </ul>
            <p className="rb-note mt-1 flex items-center gap-1.5"><TierPill source={{ tier: L.tier, state: L.state === "sourced" ? undefined : L.state }} /> {L.source}</p>
          </div>
        );
      })}

      <p className="tm-schematic">Schematic, not to scale. Every ward is one equal tile, because Kitui&rsquo;s wards differ in area by two orders of magnitude and a true map would let the empty north outweigh the dense centre. Tile position inside a constituency carries no meaning.</p>

      {showWardList && (
        <details className="tm-wardlist">
          <summary>List every ward, by constituency</summary>
          <ul>
            {TILES.map((t) => (
              <li key={t.id}>{t.name}, {t.constituencyName}: <span className="tabular-nums">{group(t.voters)}</span></li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
