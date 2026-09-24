import type { PortraitId } from "../../components/Portrait";

/**
 * One portrait per act, rotating the four supplied portraits across the seven acts. The hero keeps
 * 01; Act VI (the ask) carries 03, as the brief assigns. Approved at the Phase 0 checkpoint
 * (docs/visual-premium/PHASE-0.md §7.2). The act openers and the index both read this.
 */
export const ACT_PORTRAITS: PortraitId[] = [
  "seated-grey-cropped",
  "three-piece-formal",
  "gesture-explaining",
  "hero-clasped-hands",
  "seated-grey-cropped",
  "three-piece-formal",
  "gesture-explaining",
];

export const ACT_ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
