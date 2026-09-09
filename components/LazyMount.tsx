"use client";

import { type ReactNode } from "react";

import { useInView } from "../hooks/use-in-view";

interface LazyMountProps {
  children: ReactNode;
  /** Placeholder height reserved before mount, to avoid layout shift. */
  minHeight?: number | string;
  className?: string;
  rootMargin?: string;
}

/**
 * Defers mounting expensive children (e.g. chart libraries) until the
 * wrapper scrolls into (or near) the viewport.
 *
 * The observer is useInView's. This file used to carry its own copy — a third implementation of
 * "is this element near the viewport", alongside the hook and LazySection in ClientPage — and
 * the copy silently lacked the hook's fallback: where IntersectionObserver is unavailable,
 * useInView reports visible, because an unsupported API must never leave content permanently
 * invisible. Here it left every chart on the page unmounted.
 */
export function LazyMount({ children, minHeight = 260, className, rootMargin = "300px 0px" }: LazyMountProps) {
  const [ref, isVisible] = useInView<HTMLDivElement>({ once: true, amount: 0.01, margin: rootMargin }); // verify-figures-ignore — observer threshold

  return (
    <div ref={ref} className={className} style={!isVisible ? { minHeight } : undefined}>
      {isVisible ? children : null}
    </div>
  );
}
