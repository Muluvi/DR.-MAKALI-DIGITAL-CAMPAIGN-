import type { PortraitId } from "../../components/Portrait";

/**
 * One portrait per act, rotating the supplied portraits across the stages (flow pass, November
 * 2026). The act openers and the index both read this, by the act's position in FLOW_ACTS.
 *
 * Three portraits since the polish pass: the seated-grey cut-out had no original above 1600px,
 * and the site now shows only portraits sharp to 4K. The rotation is even (each twice), no two
 * neighbouring acts share a portrait, and the first act does not repeat the cover's.
 */
export const ACT_PORTRAITS: PortraitId[] = [
  "three-piece-formal",
  "gesture-explaining",
  "hero-clasped-hands",
  "three-piece-formal",
  "gesture-explaining",
  "hero-clasped-hands",
];

/** One numeral per act, for code that keys on act order. Never shown on screen (D4: no visible numbering). */
export const ACT_ROMAN = ["I", "II", "III", "IV", "V", "VI"];
