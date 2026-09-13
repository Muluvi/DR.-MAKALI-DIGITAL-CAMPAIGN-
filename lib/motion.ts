import type { Transition, Variants } from "motion/react";
import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";

/**
 * ===========================================================================
 * MOTION TOKEN LAYER — CAMPAIGN STRATEGY & DIGITAL ARCHITECTURE
 * Hon. Dr. Benson Makali Mulu, PhD | Kitui County Gubernatorial Proposal
 * Firefly Management | Presentation Layer Only
 * ===========================================================================
 *
 * THE PERFORMANCE THESIS & BUDGET:
 * 86.4% of Kitui County is offline (143,340 internet users of 1,053,991 aged 3+).
 * The reader is Dr. Mulu — an economist reviewing this on a phone over a mobile
 * data connection. Performance is the design's strongest argument, not an afterthought.
 * Motion is an information device, never an ambient effect or decorative gimmick.
 *
 * ---------------------------------------------------------------------------
 * TWO-TIER MOTION RULE:
 * ---------------------------------------------------------------------------
 * TIER 1 — STRUCTURAL, CSS-ONLY (Zero JavaScript Cost):
 *   - Scroll progress spine (CSS scroll-driven animation `animation-timeline: scroll()`).
 *   - Section position and reading indicator.
 *   - Direct state feedback: hover, press, tap, active focus indicators.
 *   - Navigation continuity and layout shifts via compositor-only transforms.
 *   - Runs exclusively on the compositor thread with 0 runtime JS execution overhead.
 *
 * TIER 2 — SIGNATURE SCRUBBED SEQUENCES (Dynamically Imported, 5–6 across document):
 *   - Strictly reserved for the five or six signature interactive moments across
 *     the entire proposal:
 *       1. The 40-Ward Cartogram / Geographic-to-Electoral Distortion (§3.4)
 *       2. The Recognition Deficit & 200,000-Vote Arithmetic Resolver (§3.4.1)
 *       3. The 4-Hour Ground-to-Digital Intel Cycle loop (§8.8.2)
 *       4. The USSD Handset Simulator interactive sequence (§8.10.3)
 *       5. The 3-Tier Campaign Governance Escalation Protocol (§12.4)
 *       6. The Candidate Positioning Tri-Partite Matrix (§7.1)
 *   - Dynamically loaded only when within viewport intersection thresholds.
 *
 * ---------------------------------------------------------------------------
 * ENTRANCE REVEAL RESTRICTION:
 * ---------------------------------------------------------------------------
 * Generic entrance reveals (such as fade-and-slide-up on every heading or section)
 * are STRICTLY FORBIDDEN. They are the signature cliché of templated AI slop and
 * violate editorial restraint. Entrance reveals are NOT applied to every section;
 * they are reserved exclusively for the few places where staged disclosure
 * directly aids quantitative comprehension (e.g., multi-variable matrixes,
 * comparative balance charts, and live scorecard comparisons).
 *
 * ---------------------------------------------------------------------------
 * THREE RIGID DURATIONS:
 * ---------------------------------------------------------------------------
 * 1. fast        ~150ms (0.15s) : Micro-interactions, press feedback, tab toggles, quick checks
 * 2. base        ~250ms (0.25s) : Standard state transitions, drawer disclosure, component swaps
 * 3. deliberate  ~400ms (0.40s) : Quantitative data disclosures, chart marks, threshold settles
 *
 * ---------------------------------------------------------------------------
 * TWO MATHEMATICAL EASING CURVES:
 * ---------------------------------------------------------------------------
 * 1. PRIMARY EASING (Expo-Out / Fast Commit, Long Settle):
 *    [0.16, 1.0, 0.3, 1.0]
 *    Delivers instant visual response within the first 16ms frame, with a natural,
 *    unrushed settling tail that anchors reader attention.
 *
 * 2. EMPHASIS EASING (Anticipatory / Threshold Landing):
 *    [0.34, 1.4, 0.64, 1.0]
 *    Slight controlled overshoot reserved exclusively for numerical targets crossing
 *    statutory victory thresholds (e.g., reaching 200,000 votes or IEBC deadlines).
 *
 * ---------------------------------------------------------------------------
 * REDUCED-MOTION STRATEGY:
 * ---------------------------------------------------------------------------
 * Every animation token resolves directly to its final, legible static end-state.
 * No content is ever motion-gated or hidden behind an unplayed animation. Under
 * prefers-reduced-motion:
 *   - Durations collapse to 0.001s (instant jump to terminal visual state).
 *   - Bars, gauges, and counters render immediately at their true audited value.
 *   - Micro-interaction feedback (focus rings, state highlights) is preserved at
 *     a crisp ~80ms to avoid breaking accessibility affordances.
 */

// ===========================================================================
// Core Easing Tokens
// ===========================================================================

/** Primary easing curve: Expo-out [0.16, 1.0, 0.3, 1.0]. Fast commit, long settle. */
export const EASE_PRIMARY = [0.16, 1.0, 0.3, 1.0] as const;

/** Emphasis easing curve: Anticipatory overshoot [0.34, 1.4, 0.64, 1.0] for threshold crossings. */
export const EASE_EMPHASIS = [0.34, 1.4, 0.64, 1.0] as const;

/** Canonical aliases ensuring zero regression across existing components */
export const EASE_ENTRANCE = EASE_PRIMARY;
export const EASE_OUT = [0.22, 1.0, 0.36, 1.0] as const;
export const EASE_IN_OUT = [0.65, 0.0, 0.35, 1.0] as const;
export const EASE_EMPHATIC = EASE_EMPHASIS;

// ===========================================================================
// Core Duration Tokens
// ===========================================================================

export const DURATION_TOKENS = {
  /** Fast interaction feedback, button taps, segmented toggles (~150ms). */
  fast: 0.15,
  /** Base state transitions, panel shifts, disclosure drawers (~250ms). */
  base: 0.25,
  /** Deliberate data comprehension, charts, threshold resolution (~400ms). */
  deliberate: 0.40,
} as const;

/**
 * Exhaustive DURATION scale maintaining complete backwards compatibility
 * across all existing UI components while locking values to the token system.
 */
export const DURATION = {
  fast: DURATION_TOKENS.fast,
  base: DURATION_TOKENS.base,
  deliberate: DURATION_TOKENS.deliberate,
  // Existing system aliases cleanly mapped to strict token boundaries:
  instant: DURATION_TOKENS.fast,      // 0.15s
  quick: DURATION_TOKENS.base,        // 0.25s
  slow: DURATION_TOKENS.deliberate,   // 0.40s
} as const;

export type DurationKey = keyof typeof DURATION;

// ===========================================================================
// Stagger & Spring Specifications
// ===========================================================================

export const STAGGER = {
  /** Tight cascade for short sibling lists (40ms). */
  tight: 0.04,
  /** Default sibling interval (50ms). */
  normal: 0.05,
  /** Loose spacing for complex cards (60ms). */
  loose: 0.06,
  /** Rapid swarm for the 40 ward tiles (30ms). */
  swarm: 0.03,
} as const;

export const SPRING = {
  /** Snappy feedback for direct touch controls and toggles. */
  snappy: { type: "spring", stiffness: 400, damping: 28 },
  /** Gentle spring for shared layout elements. */
  gentle: { type: "spring", stiffness: 220, damping: 30 },
  /** Bouncy spring for threshold markers landing at statutory targets. */
  bouncy: { type: "spring", stiffness: 320, damping: 18 },
  /** Heavy spring for large navigation drawers and bottom sheets. */
  heavy: { type: "spring", stiffness: 140, damping: 26 },
} as const satisfies Record<string, Transition>;

export type SpringKey = keyof typeof SPRING;

// ===========================================================================
// Viewport Contracts (Fire-Once, No Motion Loops)
// ===========================================================================

/** Default scroll reveal contract: fires once, never re-fires on reverse scroll. */
export const VIEWPORT = { once: true, amount: 0.35, margin: "-10% 0px" } as const;

/** Narrower viewport trigger for tall editorial tables and full-height sections. */
export const VIEWPORT_TALL = { once: true, amount: 0.15, margin: "-5% 0px" } as const;

/** Early count-up trigger firing 80px before entering viewport. */
export const VIEWPORT_COUNT = { once: true, margin: "-80px" } as const;

// ===========================================================================
// Transitions
// ===========================================================================

export const entrance: Transition = { duration: DURATION_TOKENS.deliberate, ease: EASE_PRIMARY };
export const deliberate: Transition = { duration: DURATION_TOKENS.deliberate, ease: EASE_PRIMARY };
export const slow: Transition = { duration: DURATION_TOKENS.deliberate, ease: EASE_PRIMARY };
export const micro: Transition = { duration: DURATION_TOKENS.fast, ease: EASE_OUT };
export const crossfade: Transition = { duration: DURATION_TOKENS.base, ease: "easeOut" };
export const disclosure: Transition = { duration: DURATION_TOKENS.base, ease: EASE_IN_OUT };

/** Reduced-motion transition: instant resolve (0.001s) to static end-state. */
export const reduced: Transition = { duration: 0.001 };

/** Micro interaction feedback preserved under reduced motion for visual affordance (~80ms). */
export const microReduced: Transition = { duration: 0.08, ease: EASE_OUT };

// ===========================================================================
// Variants (Degrading to Pure End-State)
// ===========================================================================

/** Static opacity floor; baseline fallback for all content. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: entrance },
};

/** Restrained vertical rise: strictly 8px (never 24px+ floating card clichés). */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: entrance },
};
export const fadeUp = riseIn;

/** Restrained scale: 96% to 100% (never pops up from nothing). */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: entrance },
};

/** Lateral panel cross-transitions. */
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

export const slideIn = (axis: "x" | "y" = "y", distance = 12): Variants =>
  axis === "x" ? slideInX(distance) : slideInY(distance);

/** Parent stagger container. */
export const staggerContainer = (gap: number = STAGGER.normal, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});
export const cascade = staggerContainer;

/** Distinct rotation axes for two-sided strategic decisions. */
export const flipInY: Variants = {
  hidden: { opacity: 0, rotateY: -14 },
  visible: { opacity: 1, rotateY: 0, transition: entrance },
};

export const flipInX: Variants = {
  hidden: { opacity: 0, rotateX: 14 },
  visible: { opacity: 1, rotateX: 0, transition: entrance },
};

/** Bar and gauge reveal originating strictly from quantitative baseline. */
export const growFromBaseline = (origin: "left" | "bottom" = "left"): Variants => ({
  hidden: { scaleX: origin === "left" ? 0 : 1, scaleY: origin === "bottom" ? 0 : 1 },
  visible: { scaleX: 1, scaleY: 1, transition: deliberate },
});

/**
 * Unmeasured metric baseline hatch drift.
 * Specifically honors "Awaiting campaign decision" and unmeasured baselines
 * by never asserting a false zero-bar.
 */
export const unmeasuredTrack: Variants = {
  hidden: { opacity: 0, backgroundPositionX: 0 },
  visible: {
    opacity: 1,
    backgroundPositionX: 16,
    transition: {
      opacity: entrance,
      backgroundPositionX: { duration: DURATION_TOKENS.deliberate, ease: EASE_OUT },
    },
  },
};

/** Inline SVG vector path draw using pathLength on compositor. */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: deliberate, opacity: { duration: DURATION_TOKENS.fast } },
  },
};

/** Clip-path mask reveal keeping typography fully opaque and legible during wipe. */
export const revealMask: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)", transition: deliberate },
};

/** Compositor-friendly height expansion using grid-template-rows (0fr -> 1fr). */
export const collapse: Variants = {
  hidden: { gridTemplateRows: "0fr", opacity: 0, transition: disclosure },
  visible: { gridTemplateRows: "1fr", opacity: 1, transition: disclosure },
};

// ===========================================================================
// Reduced Motion Strategy
// ===========================================================================

/**
 * Maps any variant object directly to its completed, fully legible end-state.
 * Ensures zero content or data is motion-gated.
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

/**
 * Selects either standard or static reduced-motion variant sets based on client preference.
 */
export function variantsFor(v: Variants, reduce: boolean): Variants {
  return reduce ? stillVariants(v) : v;
}

// ===========================================================================
// Ambient & Pulse Limits
// ===========================================================================

/**
 * Controlled duration intervals for the rare live connection indicators.
 * Under reduced motion, ambient loops are halted completely.
 */
export const LOOP = {
  /** Radio/USSD connectivity beacon pulse. */
  pulse: 1.8,
  /** Subtle cartogram territory highlight drift. */
  drift: 6.0,
} as const;
