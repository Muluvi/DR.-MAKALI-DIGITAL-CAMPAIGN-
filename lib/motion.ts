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
 * Four rules hold everywhere:
 *
 * 1. TRANSFORM AND OPACITY ONLY. Never width, height, top or left — they force layout on every
 *    frame and the target device is a mid-range Android. Height changes use a
 *    `grid-template-rows: 0fr -> 1fr` collapse, which the compositor can handle.
 * 2. MOTION ENCODES MEANING. Counters count. Timelines draw forward. Bars grow from their
 *    baseline. Cartogram tiles travel from where the land is to where the votes are. A generic
 *    slide-up applied to a number, a map and a paragraph alike is decoration.
 * 3. NEVER ANIMATE TO THE TRUTH. Under reduced motion a bar renders at its final proportion, not
 *    at zero. A bar caught at zero is showing false data, and this document cannot afford that.
 * 4. NO CONSUMER DECIDES FOR ITSELF. Reduced motion is resolved once, in `useMotionPreset`.
 *    A component that remembers to check is a component that can forget.
 */

// ---------------------------------------------------------------------------
// Easing
// ---------------------------------------------------------------------------

/** Expo-out. The house entrance curve: fast commit, long settle. */
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
/** Standard ease-out for micro-interactions. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
/** Symmetric, for anything that travels out and back — a drawer, a sheet. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
/** Slight anticipation. Reserved for a value that lands on a threshold. */
export const EASE_EMPHATIC = [0.34, 1.4, 0.64, 1] as const;

// ---------------------------------------------------------------------------
// Duration
// ---------------------------------------------------------------------------

/**
 * The five-step scale. Everything timed picks one of these; nothing invents a number.
 *
 * The names are the brief's. `instant` and `quick` are interaction feedback, `base` is the
 * default entrance, `slow` is for a mark that carries data, and `deliberate` is reserved for the
 * two or three moments the document wants a reader to actually watch — the deficit resolving,
 * the cartogram travelling.
 */
export const DURATION = {
  instant: 0.15,
  quick: 0.25,
  base: 0.4,
  slow: 0.7,
  deliberate: 1.1,
} as const;

export type DurationKey = keyof typeof DURATION;

export const STAGGER = {
  /** Tight cascade for short sibling groups. */
  tight: 0.04,
  /** Default — the brief's 40–60ms band. */
  normal: 0.05,
  /** Long lists, or where each item deserves its own beat. */
  loose: 0.06,
  /** Forty ward tiles. Any slower and the cartogram outlasts its own argument. */
  swarm: 0.03,
} as const;

// ---------------------------------------------------------------------------
// Springs
// ---------------------------------------------------------------------------

/**
 * The four named springs. Anything the user drives directly uses one of these rather than a
 * duration, because a spring interrupted mid-flight resolves correctly and a tween does not.
 */
export const SPRING = {
  /** Toggles, segmented controls, press states. Settles fast, no overshoot worth seeing. */
  snappy: { type: "spring", stiffness: 400, damping: 28 },
  /** The default for layout and shared-element transitions. */
  gentle: { type: "spring", stiffness: 220, damping: 30 },
  /** One visible overshoot. For a value arriving at a threshold it has just crossed. */
  bouncy: { type: "spring", stiffness: 320, damping: 18 },
  /** Large surfaces with real mass — bottom sheets, the section navigator. */
  heavy: { type: "spring", stiffness: 140, damping: 26 },
} as const satisfies Record<string, Transition>;

export type SpringKey = keyof typeof SPRING;

// ---------------------------------------------------------------------------
// Viewport contracts
// ---------------------------------------------------------------------------

/** The viewport contract for scroll-triggered reveals. Fires once; never re-fires on a long read. */
export const VIEWPORT = { once: true, amount: 0.35, margin: "-10% 0px" } as const;

/** A narrower trigger for tall elements that would otherwise never reach 35% on a phone. */
export const VIEWPORT_TALL = { once: true, amount: 0.15, margin: "-5% 0px" } as const;

/** The count-up contract. Matches the brief: fire once, 80px before the element arrives. */
export const VIEWPORT_COUNT = { once: true, margin: "-80px" } as const;

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

export const entrance: Transition = { duration: DURATION.base, ease: EASE_ENTRANCE };
export const deliberate: Transition = { duration: DURATION.deliberate, ease: EASE_ENTRANCE };
export const slow: Transition = { duration: DURATION.slow, ease: EASE_ENTRANCE };
export const micro: Transition = { duration: DURATION.instant, ease: EASE_OUT };
export const crossfade: Transition = { duration: DURATION.quick, ease: "easeOut" };
export const disclosure: Transition = { duration: DURATION.quick, ease: EASE_IN_OUT };

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

/**
 * Deliberately restrained: 8px, not 24. Used where a group is genuinely enumerable.
 *
 * `fadeUp` is the brief's name for it and `riseIn` the name the existing 22 call sites use, so
 * both are exported and they are the same object — not two variants that could drift apart.
 */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: entrance },
};
export const fadeUp = riseIn;

/** Scale from 96%, never from 0 — a card that grows from nothing reads as a popup, not an entrance. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: entrance },
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
/** The brief's name, with the axis chosen by argument rather than by picking a function. */
export const slideIn = (axis: "x" | "y" = "y", distance = 12): Variants =>
  axis === "x" ? slideInX(distance) : slideInY(distance);

/** Parent for a stagger cascade. Children use `fadeUp`, `fadeIn` or `scaleIn`. */
export const staggerContainer = (gap: number = STAGGER.normal, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});
/** The name the existing call sites use. Same function, so the two cannot drift. */
export const cascade = staggerContainer;

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
 *
 * Not for an unmeasured baseline. See `unmeasuredTrack` below.
 */
export const growFromBaseline = (origin: "left" | "bottom" = "left"): Variants => ({
  hidden: { scaleX: origin === "left" ? 0 : 1, scaleY: origin === "bottom" ? 0 : 1 },
  visible: { scaleX: 1, scaleY: 1, transition: slow },
});

/**
 * The four nomination KPIs have no baseline: the document says "Not yet measured", and the Week 1
 * instrument is what will establish one. Growing a bar from zero would assert a measurement of
 * nil, which is a different and false claim.
 *
 * So an unmeasured track does not grow. Its hatching drifts, once, to show the surface is live
 * and deliberately empty — and it never acquires a fill.
 */
export const unmeasuredTrack: Variants = {
  hidden: { opacity: 0, backgroundPositionX: 0 },
  visible: {
    opacity: 1,
    backgroundPositionX: 16,
    transition: { opacity: entrance, backgroundPositionX: { duration: DURATION.deliberate, ease: EASE_OUT } },
  },
};

/** SVG path draw. Pair with `pathLength`, never with a dash-array animation. */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: slow, opacity: { duration: DURATION.instant } },
  },
};

/**
 * A wipe that uncovers rather than fades. The element is fully opaque throughout — only the mask
 * moves — so text is never caught mid-transition at an unreadable opacity.
 *
 * Needs `mask-image: linear-gradient(90deg, #000 0 var(--reveal), transparent var(--reveal))`.
 */
export const revealMask: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)", transition: slow },
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

// ---------------------------------------------------------------------------
// Ambient loops
// ---------------------------------------------------------------------------

/**
 * Repeating motion, kept off the entrance scale on purpose.
 *
 * An entrance is a one-off a reader watches; a loop is wallpaper they read over. Sharing one
 * scale between them would either make entrances languid or loops frantic. Both stop entirely
 * under reduced motion — a loop has no "finished state" to settle at, so it simply does not run.
 */
export const LOOP = {
  /** A pulse, a ring sweep, a progress arc. */
  pulse: 1.8,
  /** Slow drift: ambient fields, mesh gradients, the marquee handoff. */
  drift: 6,
} as const;
