"use client";

import type { ReactNode } from "react";
import { useMagnetic, usePointerGlow, useRipple, useTilt } from "../../hooks/use-pointer-fx";

/**
 * The pointer-reactive surfaces.
 *
 * Each is a thin wrapper that attaches one hook and one class. They are separate components
 * rather than one `<Interactive tilt glow magnetic>` because combining all three on a single
 * element produces a surface that lurches — the tilt, the pull and the glow all chase the same
 * pointer and the reader cannot tell which one they are driving. One effect per surface.
 */

interface BaseProps {
  children: ReactNode;
  className?: string;
}

/** A card that lifts and rotates toward the pointer. Layers inside can use .fx-z-1 … .fx-z-3. */
export function TiltCard({ children, className = "", max = 7 }: BaseProps & { max?: number }) {
  const ref = useTilt<HTMLDivElement>(max);
  return (
    <div ref={ref} className={`fx-tilt ${className}`}>
      {children}
    </div>
  );
}

/** A surface with a soft light that follows the pointer across it. */
export function SpotlightCard({ children, className = "", border = false }: BaseProps & { border?: boolean }) {
  const ref = usePointerGlow<HTMLDivElement>();
  return (
    <div ref={ref} className={`fx-spotlight ${border ? "fx-glow-border" : ""} ${className}`}>
      {children}
    </div>
  );
}

/** A control that drifts toward the pointer as it approaches. Reserved for primary actions. */
export function MagneticButton({
  children,
  className = "",
  strength = 0.28,
  ...rest
}: BaseProps & { strength?: number } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useMagnetic<HTMLButtonElement>(strength);
  const ripple = useRipple<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onPointerDown={ripple}
      className={`fx-magnetic fx-ripple-host fx-press fx-focus ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Any button, with a Material ripple from the click point. */
export function RippleButton({
  children,
  className = "",
  ...rest
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ripple = useRipple<HTMLButtonElement>();
  return (
    <button onPointerDown={ripple} className={`fx-ripple-host fx-press fx-focus ${className}`} {...rest}>
      {children}
    </button>
  );
}
