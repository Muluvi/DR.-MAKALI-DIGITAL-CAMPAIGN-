"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotionSafe } from "./use-reduced-motion-safe";

/**
 * A sequence that plays once, the first time its element comes into view (visual upgrade, A1).
 *
 * It follows RegisterMotion's rule: only something that starts BELOW the fold is held back and
 * played. Anything already on screen when it mounts stays as it is, because redrawing what the
 * reader is looking at would make it vanish under their eyes. With reduced motion, no
 * IntersectionObserver, or before hydration, `playing` is false and `armed` is false: the caller
 * shows its final state, which is the truth.
 *
 *   armed    true while the element waits below the fold: show the start state
 *   playing  true from the moment it enters view: run the sequence
 */
export function usePlayOnce<T extends Element>(amount = 0.4) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotionSafe();
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setArmed(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setPlaying(true);
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, amount]);

  return { ref, armed: armed && !reduce, playing: playing && !reduce };
}
