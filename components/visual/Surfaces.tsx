"use client";

import type { ReactNode } from "react";

/**
 * The one interactive surface wrapper that survives.
 *
 * This file used to export four: TiltCard (3D tilt toward the pointer), SpotlightCard (a glow
 * tracking the pointer), MagneticButton (a control drifting toward the pointer) and
 * RippleButton (a Material ripple from the click point).
 *
 * All four were removed under docs/TRIAGE.md §5.3. Three of them require a fine pointer, which
 * the reader this document is written for is unlikely to have — and each still shipped its
 * JavaScript, its hook and its CSS to every phone that could never run it. None of them
 * absorbed a sentence of the proposal. The fourth, the click ripple, duplicated the press
 * feedback that `.fx-press` already gives on touch, where it actually matters.
 *
 * What is left is the feedback a tap needs and the focus ring a keyboard needs, which are the
 * two things the reject list never touches.
 */

interface BaseProps {
  children: ReactNode;
  className?: string;
}

/** A button that compresses on press and shows a visible focus ring. Nothing follows a pointer. */
export function PressButton({
  children,
  className = "",
  ...rest
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`fx-press fx-focus ${className}`} {...rest}>
      {children}
    </button>
  );
}
