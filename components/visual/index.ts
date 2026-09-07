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
export { Reveal, Stagger, type RevealVariant } from "./Reveal";
export { SplitText, Typewriter, Scramble, WordCycler } from "./SplitText";
export { CountUp, Odometer, ProgressRing } from "./Numerals";
export { TiltCard, SpotlightCard, MagneticButton, RippleButton } from "./Surfaces";
export { AmbientField } from "./AmbientField";
export { BackToTop, NavDots, CustomCursor } from "./Chrome";
