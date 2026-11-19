import type { SVGProps } from "react";

/**
 * The Kitui icon set: the concepts the county's story keeps returning to that Lucide does not draw
 * (a goat, a jerrycan, a matatu, a borehole, a maize cob, a basic keypad phone).
 *
 * Drawn on Lucide's own grid so the two sets sit together without a seam (MOTION-SYSTEM.md, Icons):
 * a 24-unit viewBox, a 1.5 stroke (2 at 16px), round caps and joins, `currentColor`, no fills on
 * the outline icons. Everything else on the site stays Lucide.
 *
 * Each icon is decorative by default (`aria-hidden`). Pass `title` where the icon carries meaning
 * that the text beside it does not.
 *
 * The `Pictogram*` shapes are different: they are filled silhouettes of equal area, for icon
 * arrays where each mark counts as one unit. Their area is what the reader compares, so they are
 * drawn once and only ever scaled as a whole.
 */

export type KituiIconName =
  | "goat" | "jerrycan" | "matatu" | "radio" | "ballot-box" | "borehole" | "maize" | "school"
  | "clinic" | "road" | "phone" | "feature-phone" | "person" | "coin" | "church" | "market";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: 16 | 20 | 24 | 32 | 48; title?: string };

/** Each icon's strokes, on the 24-unit grid. */
const PATHS: Record<KituiIconName, React.ReactNode> = {
  goat: (
    <>
      <path d="M6 10.5h9.5a3 3 0 0 1 3 3V15" />
      <path d="M6 10.5a2.5 2.5 0 0 0-2.5 2.5v2" />
      <path d="M7 15.5V20M10 15.5V20M15 15.5V20M18 15V20" />
      <path d="M6 15.5h12" />
      <path d="M15.5 10.5 17 7.5h2.5L21 9.5l-1.5 1.5H18" />
      <path d="M17 7.5c-.4-1.8.4-3.2 2-4M19.5 7.5c.6-1.6 1.6-2.4 3-2.6" />
      <path d="M20.5 11 21 13" />
    </>
  ),
  jerrycan: (
    <>
      <path d="M6 7h10l3 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
      <path d="M8 7V4.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V7" />
      <path d="M10 4v3M12 4v3" />
      <path d="M16 7l2-3h1.5" />
      <path d="M8 12.5l8 5M16 12.5l-8 5" />
    </>
  ),
  matatu: (
    <>
      <path d="M2.5 16V9.5A2.5 2.5 0 0 1 5 7h11.5l3.5 4.5h1a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1h-1" />
      <path d="M2.5 16a1 1 0 0 0 1 1h1M9.5 17h5" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M5 10h3.5v2.5H5zM10.5 10H14v2.5h-3.5zM16 10h2l1.5 2.5H16z" />
    </>
  ),
  radio: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M7 8 17 3.5" />
      <circle cx="9" cy="14" r="3" />
      <path d="M15 12h3M15 14h3M15 16h3" />
    </>
  ),
  "ballot-box": (
    <>
      <path d="M3.5 11h17v9a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-9Z" />
      <path d="M3.5 11 6 8h12l2.5 3" />
      <path d="M9 11h6" />
      <path d="M10 8V3.5h4.5V8" />
      <path d="M11.5 5.5l1 1 1.5-1.5" />
      <path d="M9 16h6" />
    </>
  ),
  borehole: (
    <>
      <path d="M8 21V9.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 14 9.5V21" />
      <path d="M5.5 21h11" />
      <path d="M14 11h2.5a1.5 1.5 0 0 1 1.5 1.5V14" />
      <path d="M11 8V5l7.5-2" />
      <path d="M18 17.5c0 1-.7 1.7-1.5 1.7S15 18.5 15 17.5c0-.8 1.5-2.5 1.5-2.5S18 16.7 18 17.5Z" />
    </>
  ),
  maize: (
    <>
      <path d="M12 3c2.2 2 3 4.6 3 7.6 0 3.6-1.4 6.6-3 8.4-1.6-1.8-3-4.8-3-8.4C9 7.6 9.8 5 12 3Z" />
      <path d="M10 8.5h4M9.3 11.5h5.4M9.8 14.5h4.4" />
      <path d="M12 19v2.5" />
      <path d="M12 19c-3.5-.5-6-2.8-7-6.5 2.6.6 4.5 1.8 5.6 3.6" />
      <path d="M12 19c3.5-.5 6-2.8 7-6.5-2.6.6-4.5 1.8-5.6 3.6" />
    </>
  ),
  school: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V11l7-4 7 4v10" />
      <path d="M12 7V3l3.5 1.25L12 5.5" />
      <path d="M10 21v-4.5h4V21" />
      <path d="M8 12.5h1.5M14.5 12.5H16" />
    </>
  ),
  clinic: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V8a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13" />
      <path d="M12 9.5v5M9.5 12h5" />
      <path d="M10 21v-3h4v3" />
      <path d="M9 7V4.5h6V7" />
    </>
  ),
  road: (
    <>
      <path d="M9 3 4 21M15 3l5 18" />
      <path d="M12 4v2.5M12 10v3M12 16.5V20" />
    </>
  ),
  phone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 5.5h3" />
      <path d="M11 18.5h2" />
    </>
  ),
  "feature-phone": (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
      <rect x="8.5" y="4.5" width="7" height="5.5" rx=".5" />
      <path d="M9 13h.01M12 13h.01M15 13h.01M9 15.5h.01M12 15.5h.01M15 15.5h.01M9 18h.01M12 18h.01M15 18h.01" strokeWidth="2.4" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="6" r="3" />
      <path d="M6.5 21v-5.5A4.5 4.5 0 0 1 11 11h2a4.5 4.5 0 0 1 4.5 4.5V21" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2-.4-2.5-1.2" />
      <path d="M12 6.5V8M12 16v1.5" />
    </>
  ),
  church: (
    <>
      <path d="M3 21h18" />
      <path d="M6 21v-8l6-4 6 4v8" />
      <path d="M12 9V2.5M10 4.5h4" />
      <path d="M10.5 21v-3.5a1.5 1.5 0 0 1 3 0V21" />
    </>
  ),
  market: (
    <>
      <path d="M3 10.5 5 4h14l2 6.5" />
      <path d="M3 10.5c0 1.4 1.1 2.5 2.5 2.5S8 11.9 8 10.5c0 1.4 1.1 2.5 2.5 2.5S13 11.9 13 10.5c0 1.4 1.1 2.5 2.5 2.5S18 11.9 18 10.5c0 1.4 1.1 2.5 2.5 2.5" />
      <path d="M5 13v8h14v-8" />
      <path d="M9.5 21v-4.5h5V21" />
    </>
  ),
};

/** One icon from the Kitui set, on Lucide's grid and stroke. */
export function KituiIcon({ name, size = 24, title, strokeWidth, ...rest }: IconProps & { name: KituiIconName }) {
  const stroke = strokeWidth ?? (size === 16 ? 2 : 1.5);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------------------- pictograms */

/**
 * Filled silhouettes for icon arrays, each on a 24 × 24 box. A pictogram counts units, so every
 * mark in one array is the same shape at the same size; only its fill state differs.
 */
export const PICTOGRAM_PATHS = {
  person: "M12 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM10.5 11h3A5.5 5.5 0 0 1 19 16.5V22a.5.5 0 0 1-.5.5h-13A.5.5 0 0 1 5 22v-5.5A5.5 5.5 0 0 1 10.5 11Z",
  jerrycan: "M8.5 2.5h6a1 1 0 0 1 1 1V6h.6l3.1 3.1a1 1 0 0 1 .3.7V21.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2V3.5a1 1 0 0 1 1-1Zm1 1.5V6h4V4h-4Z",
  goat: "M5 9.5h10.2l1.6-3.3c-.6-2 .2-3.6 1.9-4.4.4-.2.8.2.6.6-.7 1.2-.8 2.2-.5 3.1h1.1c.8-1.4 1.8-2.1 3.2-2.3.4 0 .6.4.4.7-.8.8-1.2 1.6-1.3 2.5l1.3 1.6a1 1 0 0 1-.1 1.3L21 10.6l.4 2a.5.5 0 0 1-1 .2l-.4-1.8h-1.3v8.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-3.4H8.4v3.4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-3.6A3 3 0 0 1 4 12.9v-.1H3.3a.5.5 0 0 1-.4-.8L5 9.5Z",
  "ballot": "M4 10h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10Zm6.5-8h5a.5.5 0 0 1 .5.5V9H10V2.5a.5.5 0 0 1 .5-.5Z",
} as const;

export type PictogramName = keyof typeof PICTOGRAM_PATHS;
