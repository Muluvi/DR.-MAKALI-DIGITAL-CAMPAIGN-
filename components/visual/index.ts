/**
 * The visual effects layer.
 *
 * Two halves that have to be read together:
 *   - app/visual-fx.css  — the keyframes and utility classes, organised by the same section
 *                          numbers as docs/VISUAL-FEATURE-LEDGER.md
 *   - this directory     — the components and hooks that drive them
 *
 * Nothing here is imported by the markdown pipeline on the server; every module is "use client".
 */
export { Reveal, type RevealVariant } from "./Reveal";
export { SplitText, WordCycler } from "./SplitText";
export { AnimatedNumber } from "./AnimatedNumber";
export { TiltCard, SpotlightCard, MagneticButton, RippleButton } from "./Surfaces";
export { AmbientField } from "./AmbientField";
export { NavDots, CustomCursor } from "./Chrome";
