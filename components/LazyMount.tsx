"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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
 */
export function LazyMount({ children, minHeight = 260, className, rootMargin = "300px 0px" }: LazyMountProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={containerRef} className={className} style={!isVisible ? { minHeight } : undefined}>
      {isVisible ? children : null}
    </div>
  );
}
