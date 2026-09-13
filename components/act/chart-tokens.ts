/**
 * The act's chart palette — validated, not chosen by eye.
 *
 * Every value below was run through the six checks (lightness band, chroma floor,
 * CVD separation, normal-vision floor, contrast vs surface) against the act's own
 * surfaces: #030711 dark, #f8fafd light. All pass in both modes.
 *
 * The brand accents are NOT reused directly as mark colours. The act's UI blue sits at
 * OKLCH L 0.72 and the ember at L 0.70, both above the dark band's 0.67 ceiling — fine for
 * text and rules on a near-black ground, too light to read as data marks against it. These
 * are the same two hues (258 royal blue, 40 earth red) stepped down into the band, plus two
 * further hues placed for separation rather than taste.
 *
 * Hues are assigned to entities and never cycled: Mulu is always slot 1, Kasalu always
 * slot 2. Filtering a series out never repaints the survivors.
 */

export type Mode = "dark" | "light";

/** Categorical identity. Fixed order — a fifth series folds into "other", it does not get a new hue. */
export const SERIES: Record<Mode, string[]> = {
  dark: ["#4d8dea", "#dd5e2e", "#0baa92", "#9b6bce"],
  light: ["#245fd4", "#c44402", "#008f7a", "#8048b6"],
};

/** Reserved for state — never used as "series 5". */
export const STATUS: Record<Mode, { good: string; critical: string; muted: string }> = {
  dark: { good: "#0baa92", critical: "#e04b4b", muted: "#5b6b84" },
  light: { good: "#008f7a", critical: "#c02626", muted: "#7d8ba0" },
};

/** Chart surface, for the 2px gaps and rings that separate marks. */
export const SURFACE: Record<Mode, string> = { dark: "#030711", light: "#f8fafd" };

/** The named entities this act plots, so a colour is looked up rather than remembered. */
export const ENTITY = {
  mulu: 0,
  kasalu: 1,
  wambua: 2,
  other: 3,
} as const;

export function seriesColor(mode: Mode, slot: number): string {
  return SERIES[mode][slot % SERIES[mode].length];
}
