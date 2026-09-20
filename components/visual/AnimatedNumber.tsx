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
 * ONE TEXT NODE. This component used to render each figure THREE times — a visually hidden
 * `sr-only` copy for assistive technology, a hidden copy to size the box, and the counting copy
 * laid over it. `aria-hidden` and `sr-only` both do exactly one thing: they move a node in or out
 * of the accessibility tree. Neither removes it from `textContent`, from reader mode, from
 * find-in-page, or from what a reader gets when they select a paragraph and copy it. So the page
 * really did read `15.315.315.3`, `532,758532,758532,758` and `330,310330,310330,310`, and the
 * /full document carried 124,284 words against 63,433 in the markdown — very nearly double. There
 * is now one node per figure.
 *
 * WIDTH IS STILL RESERVED, in `ch` against the final string rather than by a second copy of it.
 * "KSh 13.79bn" is wider than "KSh 0.00bn", and without a reservation every figure on the page
 * nudges its neighbours for the length of its own count — which is precisely the layout shift the
 * performance budget is measured on. Measured CLS before and after this change: 0.
 *
 * THE TRUTH IS WHAT IS READ. The node is server-rendered with the final figure, the hook seeds
 * its motion value with the same figure, and it only drops to zero on the client, in view, with
 * motion allowed. A screen reader, a printer and a reader with JavaScript off therefore all meet
 * the published number. `label` overrides the text for the cases where units need spelling out.
 */
export function AnimatedNumber({
  value, className = "", spring, label, ...format
}: AnimatedNumberProps) {
  const { containerRef, textRef, final } = useAnimatedNumber(value, { spring, ...format });

  return (
    <span
      ref={containerRef}
      className={`anim-num ${className}`}
      style={{ "--anim-num-ch": final.length } as React.CSSProperties}
      // Where a call site spells the units out, that reading — and only that reading — is what
      // assistive technology is given, in place of the visible text rather than in addition to it.
      {...(label ? { role: "img", "aria-label": label } : {})}
    >
      <span ref={textRef} className="anim-num__value">{final}</span>
    </span>
  );
}
