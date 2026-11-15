import type { PortraitId } from "../../components/Portrait";

/**
 * One portrait per act, rotating the four supplied portraits across the five stages after the
 * Welcome and the evidence shelf (flow pass, November 2026). The hero keeps the clasped-hands
 * portrait. The act openers and the index both read this, by the act's position in FLOW_ACTS.
 */
export const ACT_PORTRAITS: PortraitId[] = [
  "seated-grey-cropped",
  "three-piece-formal",
  "gesture-explaining",
  "hero-clasped-hands",
  "seated-grey-cropped",
  "three-piece-formal",
];

/** One numeral per act, for code that keys on act order. Never shown on screen (D4: no visible numbering). */
export const ACT_ROMAN = ["I", "II", "III", "IV", "V", "VI"];
