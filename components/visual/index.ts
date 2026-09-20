/**
 * The visual effects layer.
 *
 * Two halves that have to be read together:
 *   - app/visual-fx.css  — the keyframes and utility classes, organised by the same section
 *                          numbers as docs/VISUAL-FEATURE-LEDGER.md
 *   - this directory     — the components and hooks that drive them
 *
 * Nothing here is imported by the markdown pipeline on the server; every module is "use client".
 *
 * WHAT LEFT, AND WHY. SplitText, Typewriter, Scramble, WordCycler, CountUp, Odometer,
 * ProgressRing, TiltCard, SpotlightCard, MagneticButton, RippleButton, NavDots and CustomCursor
 * have all gone. Every one of them implements an effect on this audit's deny list — kinetic
 * headlines, text scramble, 3D tilt, cursor spotlight, custom cursors — and by the end of the
 * compaction pass not one of them had a single call site left. Dead code that implements a
 * forbidden effect is the easiest kind to delete and the most likely to come back if it stays.
 */
export { Reveal, Stagger, type RevealVariant } from "./Reveal";
export { AnimatedNumber } from "./AnimatedNumber";
export { AmbientField } from "./AmbientField";
