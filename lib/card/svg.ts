/**
 * SVG drawings for the share cards, as strings: next/og draws an <img> of an SVG data URI exactly,
 * so maps and icon arrays reach the image with their real geometry.
 */
import { BOX, COUNTY } from "../premium/county";
import { PICTOGRAM_PATHS, type PictogramName } from "../../components/icons/kitui";
import { C } from "./palette";

export const dataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

/** The county's real wards, each filled by `fill(tileId)`. */
export function countySvg(fill: (tileId: string) => string, stroke: string = C.card): string {
  const paths = COUNTY.map((w) => `<path d="${w.path}" fill="${fill(w.tile.id)}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOX.w} ${BOX.h}">${paths}</svg>`;
}
export const COUNTY_RATIO = BOX.w / BOX.h;

/** A 10 × 10 icon array: one mark per hundred, the last one filled in part. */
export function iconArraySvg(value: number, glyph: PictogramName, on: string = C.accentSolid, off: string = C.line): string {
  const whole = Math.floor(value);
  const part = value - whole;
  const marks: string[] = [];
  for (let i = 0; i < 100; i++) {
    const x = (i % 10) * 25;
    const y = Math.floor(i / 10) * 25;
    marks.push(`<path transform="translate(${x} ${y})" d="${PICTOGRAM_PATHS[glyph]}" fill="${i < whole ? on : off}"/>`);
    if (i === whole && part > 0) marks.push(`<g transform="translate(${x} ${y})"><clipPath id="p"><rect width="${24 * part}" height="24"/></clipPath><path d="${PICTOGRAM_PATHS[glyph]}" fill="${on}" clip-path="url(#p)"/></g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250">${marks.join("")}</svg>`;
}

/** One pictogram, filled, for drawing to scale. */
export function glyphSvg(glyph: PictogramName, fill: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${PICTOGRAM_PATHS[glyph]}" fill="${fill}"/></svg>`;
}

/** Weather marks for the drought forecast card, and a tick for checklists. */
export const SUN_SVG = (c: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>`;
export const CLOUD_SUN_SVG = (c: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.9 4.9l1.4 1.4M20 12h2M19.1 4.9l-1.4 1.4M15.9 13.1A4 4 0 0 0 8.4 9.4"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`;
export const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
