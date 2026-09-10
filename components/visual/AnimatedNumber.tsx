"use client";

import { useAnimatedNumber, type NumberFormat } from "../../hooks/useAnimatedNumber";
import type { SPRING } from "../../lib/motion";

interface AnimatedNumberProps extends NumberFormat {
  value: number;
  className?: string;
  spring?: keyof typeof SPRING;
  /**
   * Overrides the text a screen reader and a printer receive. Use it where the figure needs
   * units spelling out — "13.79 billion Kenyan shillings" rather than "KSh 13.79bn".
   */
  label?: string;
}

/**
 * A counting figure, with the two things every call site would otherwise have to remember.
 *
 * WIDTH IS RESERVED. A hidden copy of the final string sizes the box, and the counting text is
 * laid over it. "KSh 13.79bn" is wider than "KSh 0.00bn", so without this every figure on the
 * page nudges its neighbours for the length of the count — which is exactly the layout shift the
 * performance budget is measured on.
 *
 * THE TRUTH IS WHAT IS READ. The visible text is `aria-hidden` throughout, and a visually hidden
 * sibling carries the final figure from the first frame. Screen readers, print stylesheets and a
 * reader with JavaScript off all get the real number; only the pixels count up.
 */
export function AnimatedNumber({
  value, className = "", spring, label, ...format
}: AnimatedNumberProps) {
  const { containerRef, textRef, final } = useAnimatedNumber(value, { spring, ...format });

  return (
    <span ref={containerRef} className={`anim-num ${className}`}>
      <span className="sr-only">{label ?? final}</span>
      <span aria-hidden="true" className="anim-num__size">{final}</span>
      <span aria-hidden="true" ref={textRef} className="anim-num__value">{final}</span>
    </span>
  );
}
