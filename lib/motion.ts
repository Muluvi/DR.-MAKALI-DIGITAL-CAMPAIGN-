import type { Transition, Variants } from "motion/react";
import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";

/**
 * The site's motion system. Everything that animates imports from here.
 *
 * Before this existed there were 20 distinct durations and 4 easings scattered across 26 files,
 * and fourteen surfaces shared the same fade-and-rise — which is the failure the whole visual
 * brief was written to correct. A shared vocabulary is what lets each surface animate in a way
 * that means something, rather than in the way whoever wrote it happened to prefer.
 *
 * Three rules hold everywhere:
 *
 * 1. TRANSFORM AND OPACITY ONLY. Never width, height, top or left — they force layout on every
 *    frame and the target device is a mid-range Android. Height changes use a
 *    `grid-template-rows: 0fr -> 1fr` collapse, which the compositor can handle.
 * 2. MOTION ENCODES MEANING. Counters count. Timelines draw forward. Bars grow from their
 *    baseline. Maps fill outward. A generic slide-up applied to a number, a map and a paragraph
 *    alike is decoration.
 * 3. NEVER ANIMATE TO THE TRUTH. Under reduced motion a bar renders at its final proportion, not
 *    at zero. A bar caught at zero is showing false data, and this document cannot afford that.
 */

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

/** Expo-out. The house entrance curve: fast commit, long settle. */
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
/** Standard ease-out for micro-interactions. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  /** Hover, tap, toggle. Perceived as instant. */
  micro: 0.14,
  /** Tab and panel crossfades. */
  fast: 0.18,
  /** Disclosure, accordion, tooltip. */
  medium: 0.3,
  /** The default entrance. */
  entrance: 0.52,
  /** Charts and maps that carry a lot of marks. */
  deliberate: 0.62,
} as const;

/** Public duration scale for new surfaces. Values are seconds, matching Motion transitions. */
export const durationScale = {
  instant: 0.15,
  quick: 0.25,
  base: 0.4,
  slow: 0.7,
  deliberate: 1.1,
} as const;

export type SpringPreset = Transition & { type: "spring" };

/** Named interaction springs keep gesture feedback consistent across the document. */
export const springs = {
  snappy: { type: "spring", stiffness: 420, damping: 32, mass: 0.7 },
  gentle: { type: "spring", stiffness: 220, damping: 28, mass: 0.9 },
  bouncy: { type: "spring", stiffness: 300, damping: 18, mass: 0.8 },
  heavy: { type: "spring", stiffness: 180, damping: 30, mass: 1.2 },
} satisfies Record<"snappy" | "gentle" | "bouncy" | "heavy", SpringPreset>;

export const STAGGER = {
  /** Tight cascade for short sibling groups. */
  tight: 0.06,
  /** Default. */
  normal: 0.075,
  /** Long lists, or where each item deserves its own beat. */
  loose: 0.09,
} as const;

/** Springs for anything the user drives directly. */
export const SPRING: Transition = { type: "spring", stiffness: 300, damping: 30 };
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 220, damping: 28 };

/** The viewport contract for scroll-triggered reveals. Fires once; never re-fires on a long read. */
export const VIEWPORT = { once: true, amount: 0.35, margin: "-10% 0px" } as const;

/** A narrower trigger for tall elements that would otherwise never reach 35% on a phone. */
export const VIEWPORT_TALL = { once: true, amount: 0.15, margin: "-5% 0px" } as const;

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

export const entrance: Transition = { duration: DURATION.entrance, ease: EASE_ENTRANCE };
export const deliberate: Transition = { duration: DURATION.deliberate, ease: EASE_ENTRANCE };
export const micro: Transition = { duration: DURATION.micro, ease: EASE_OUT };
export const crossfade: Transition = { duration: DURATION.fast, ease: EASE_OUT };
export const disclosure: Transition = { duration: DURATION.medium, ease: EASE_ENTRANCE };

/** Reduced-motion replacement for any of the above: present, but without traversal. */
export const reduced: Transition = { duration: 0.001 };
/** Interaction feedback survives reduced motion — a focus ring that never appears is a bug. */
export const microReduced: Transition = { duration: 0.08, ease: EASE_OUT };

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

/** The floor, and the reduced-motion fallback for nearly everything. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: entrance },
};

/** Deliberately restrained: 8px, not 24. Used where a group is genuinely enumerable. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: entrance },
};

/** Panel changes only, on the axis of travel. Never as a generic entrance. */
export const slideInX = (distance = 12): Variants => ({
  hidden: { opacity: 0, x: distance },
  visible: { opacity: 1, x: 0, transition: crossfade },
  exit: { opacity: 0, x: -distance, transition: crossfade },
});
export const slideInY = (distance = 12): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: { opacity: 1, y: 0, transition: crossfade },
  exit: { opacity: 0, y: -distance, transition: crossfade },
});

/** Parent for a stagger cascade. Children use `riseIn` or `fadeIn`. */
export const cascade = (gap: number = STAGGER.tight, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Standard vocabulary for surfaces that enter from below or scale into focus. */
export const fadeUp: Variants = riseIn;
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: entrance },
};

export const slideIn: Variants = slideInX();

/** A configurable parent variant for direct-child stagger sequences. */
export const staggerContainer = (staggerChildren = STAGGER.normal, delayChildren = 0): Variants =>
  cascade(staggerChildren, delayChildren);

/** Mask-style reveal for headings and bounded editorial labels. */
export const revealMask: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: { opacity: 1, clipPath: "inset(0 0% 0 0)", transition: deliberate },
};

/** Two faces of one decision — the poll/primary and nomination-path cards. Each axis is a
 *  distinct signature, so §1A and §2 can both flip without reading as a repeat. */
export const flipInY: Variants = {
  hidden: { opacity: 0, rotateY: -14 },
  visible: { opacity: 1, rotateY: 0, transition: entrance },
};
export const flipInX: Variants = {
  hidden: { opacity: 0, rotateX: 14 },
  visible: { opacity: 1, rotateX: 0, transition: entrance },
};

/**
 * Bars, rings and gauges. Scales along one axis from the baseline, so the compositor handles it
 * and the origin carries the meaning — zero is the honest starting point for a poll share.
 */
export const growFromBaseline = (origin: "left" | "bottom" = "left"): Variants => ({
  hidden: { scaleX: origin === "left" ? 0 : 1, scaleY: origin === "bottom" ? 0 : 1 },
  visible: { scaleX: 1, scaleY: 1, transition: entrance },
});

/** SVG path draw. Pair with `pathLength`, never with a dash-array animation. */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: deliberate, opacity: { duration: DURATION.micro } },
  },
};

/**
 * Height changes without touching height. `grid-template-rows` interpolates between 0fr and 1fr
 * on the compositor; the child needs `overflow: hidden` and `min-height: 0`.
 */
export const collapse: Variants = {
  hidden: { gridTemplateRows: "0fr", opacity: 0, transition: disclosure },
  visible: { gridTemplateRows: "1fr", opacity: 1, transition: disclosure },
};

// ---------------------------------------------------------------------------
// Reduced motion
// ---------------------------------------------------------------------------

/**
 * Collapse any variant set to its finished state.
 *
 * The reduced path is a different finished page, not a degraded one: every element arrives at the
 * value it would have animated to. Ambient loops stop; entrances become instant; interaction
 * feedback is kept and shortened rather than removed.
 */
export function stillVariants(v: Variants): Variants {
  const out: Variants = {};
  for (const [key, value] of Object.entries(v)) {
    if (typeof value === "object" && value !== null) {
      out[key] = { ...(value as object), transition: reduced } as Variants[string];
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** Pick between the full and reduced variant set. */
export function variantsFor(v: Variants, reduce: boolean): Variants {
  return reduce ? stillVariants(v) : v;
}

/** Hook form for consumers that need the reduced-motion decision at render time. */
export function useMotionVariants(v: Variants): Variants {
  return variantsFor(v, useReducedMotionSafe());
}
