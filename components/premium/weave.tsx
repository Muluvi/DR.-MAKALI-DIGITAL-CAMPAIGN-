/**
 * The kiondo weave: the site's one texture.
 *
 * The Akamba kiondo is twined sisal, and its surface reads as short strands alternating
 * direction on a diagonal. That is drawn here as a twill of two strand directions in a cell
 * rotated 45 degrees, generated in code, never an image. It does two jobs:
 *
 *   texture   3-6% opacity behind act openers and on the progress spine;
 *   meaning   the fill of "the pool" wherever the old hatch stood. It must survive greyscale,
 *             so it is a pattern of strokes, not a tint.
 */
export function WeaveDefs({ id, color = "currentColor", opacity = 1, size = 7 }: { id: string; color?: string; opacity?: number; size?: number }) {
  const s = size;
  const h = s / 2;
  const t = s * 0.36;
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={s} height={s} patternTransform="rotate(45)">
      <g fill={color} fillOpacity={opacity}>
        {/* Vertical strands in two cells, horizontal in the other two: the over-under of a twine. */}
        <rect x={h / 2 - t / 2} y={0.4} width={t} height={h - 0.8} rx={t / 2} />
        <rect x={h + h / 2 - t / 2} y={h + 0.4} width={t} height={h - 0.8} rx={t / 2} />
        <rect x={h + 0.4} y={h / 2 - t / 2} width={h - 0.8} height={t} rx={t / 2} fillOpacity={0.6} />
        <rect x={0.4} y={h + h / 2 - t / 2} width={h - 0.8} height={t} rx={t / 2} fillOpacity={0.6} />
      </g>
    </pattern>
  );
}

/** The same weave as a CSS background image, for surfaces that are not SVG. */
export function weaveDataUri(color: string, opacity: number, tile = 14): string {
  // A square cell rotated 45 degrees repeats every cell * sqrt(2) along both axes, so a cell of
  // tile / sqrt(2) makes the background tile seamless at exactly `tile` pixels.
  const s = tile / Math.SQRT2;
  const h = s / 2;
  const t = s * 0.36;
  const f = (n: number) => n.toFixed(3);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${tile}' height='${tile}'>` +
    `<defs><pattern id='w' patternUnits='userSpaceOnUse' width='${f(s)}' height='${f(s)}' patternTransform='rotate(45)'>` +
    `<g fill='${color}' fill-opacity='${opacity}'>` +
    `<rect x='${f(h / 2 - t / 2)}' y='0.3' width='${f(t)}' height='${f(h - 0.6)}' rx='${f(t / 2)}'/>` +
    `<rect x='${f(h + h / 2 - t / 2)}' y='${f(h + 0.3)}' width='${f(t)}' height='${f(h - 0.6)}' rx='${f(t / 2)}'/>` +
    `<rect x='${f(h + 0.3)}' y='${f(h / 2 - t / 2)}' width='${f(h - 0.6)}' height='${f(t)}' rx='${f(t / 2)}' fill-opacity='0.6'/>` +
    `<rect x='0.3' y='${f(h + h / 2 - t / 2)}' width='${f(h - 0.6)}' height='${f(t)}' rx='${f(t / 2)}' fill-opacity='0.6'/>` +
    `</g></pattern></defs><rect width='${tile}' height='${tile}' fill='url(%23w)'/></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/</g, "%3C").replace(/>/g, "%3E").replace(/"/g, "'")}")`;
}
