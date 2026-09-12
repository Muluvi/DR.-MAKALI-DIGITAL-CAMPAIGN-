"use client";

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { useInView } from "../../hooks/use-in-view";

/**
 * The entrance vocabulary, as one component.
 *
 * Every variant is a CSS keyframe in app/visual-fx.css — nothing here runs on the main thread
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

interface StaggerProps {
  children: ReactNode;
  /** Gap between siblings, in milliseconds. */
  gap?: number;
  delay?: number;
  variant?: RevealVariant;
  amount?: number;
  className?: string;
  /**
   * Delays propagate outward from a focal child rather than left-to-right. Use where the group
   * has a centre that means something — a cartogram's home ward, a matrix's diagonal.
   */
  ripple?: number;
}

/**
 * A stagger cascade over direct children.
 *
 * The index is written as `--fx-i` on each child rather than as a per-child delay string, so the
 * whole group's timing can be retuned by changing one custom property on the parent.
 */
export function Stagger({
  children,
  gap = 60,
  delay = 0,
  variant = "up",
  amount = 0.15,
  className = "",
  ripple,
}: StaggerProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ amount, margin: "0px 0px -6% 0px" });
  const items = Array.isArray(children) ? children : [children];

  return (
    <div
      ref={ref}
      className={`${ripple === undefined ? "fx-stagger" : "fx-ripple-stagger"} ${className}`}
      style={{ "--fx-stagger": `${gap}ms`, "--fx-delay": `${delay}ms` } as React.CSSProperties}
    >
      {items.map((child, i) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<{ className?: string; style?: React.CSSProperties }>;
        const distance = ripple === undefined ? i : Math.abs(i - ripple);
        return cloneElement(el, {
          key: el.key ?? i,
          className: `${el.props.className ?? ""} ${inView ? `fx-in-${variant}` : "fx-preveal"}`.trim(),
          style: {
            ...el.props.style,
            ...({ "--fx-i": i, "--fx-r": distance } as React.CSSProperties),
          },
        });
      })}
    </div>
  );
}
