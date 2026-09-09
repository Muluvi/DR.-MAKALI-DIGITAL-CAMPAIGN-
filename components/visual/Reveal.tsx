"use client";

import { type ReactNode } from "react";
import { useInView } from "../../hooks/use-in-view";

/**
 * The entrance vocabulary, as one component.
 *
 * Every variant is a CSS keyframe from visual-fx.css §1 — nothing here runs on the main thread
 * after the class lands, and the reduced-motion and print paths are handled in the stylesheet
 * rather than being re-decided per call site.
 *
 * The rule the variant list is meant to enforce: pick the one whose direction of travel means
 * something on that surface. A panel that arrives from the right because the reader pressed
 * "next" is motion carrying information. Fourteen surfaces sharing `up` is decoration, and it is
 * the exact failure the previous audit of this site was written about.
 */
export type RevealVariant =
  | "fade"
  | "up"
  | "down"
  | "left"
  | "right"
  | "diagonal"
  | "pop"
  | "settle"
  | "blur"
  | "wipe"
  | "wipe-up"
  | "wipe-diag"
  | "iris"
  | "flip-x"
  | "flip-y"
  | "rotate"
  | "unfold";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** Milliseconds before the animation starts. */
  delay?: number;
  /** Milliseconds the animation runs for. */
  duration?: number;
  /** Travel distance for the sliding variants. */
  travel?: number;
  /** How much of the element must be on screen before it fires. */
  amount?: number;
  /** Re-fire each time the element re-enters the viewport. Off by default — see use-in-view. */
  repeat?: boolean;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "header" | "aside" | "figure";
}

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration,
  travel,
  amount = 0.2,
  repeat = false,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ once: !repeat, amount, margin: "0px 0px -8% 0px" });

  return (
    <Tag
      // The cast is the one unavoidable seam in a polymorphic tag: every element in the union
      // accepts a ref of its own concrete type, and TypeScript will not unify them.
      ref={ref as React.Ref<never>}
      className={`${inView ? `fx-in-${variant}` : "fx-preveal"} ${className}`}
      style={
        {
          "--fx-delay": `${delay}ms`,
          ...(duration ? { "--fx-dur": `${duration}ms` } : {}),
          ...(travel ? { "--fx-travel": `${travel}px` } : {}),
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
