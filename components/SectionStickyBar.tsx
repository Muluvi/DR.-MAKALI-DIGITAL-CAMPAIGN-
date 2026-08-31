"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Compact bar that names the section currently in view. Both the "have we
 * scrolled past the toolbar" state and the "which heading is current" state
 * are derived from IntersectionObserver entries — no scroll listener.
 */
export function SectionStickyBar() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [headingText, setHeadingText] = useState<string | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const observed = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setHeadingText(visible[0].target.textContent?.trim() ?? null);
        }
      },
      { rootMargin: "-104px 0px -75% 0px", threshold: 0 }
    );

    const scan = () => {
      document.querySelectorAll("main h2[id]").forEach((heading) => {
        if (!observed.has(heading)) {
          io.observe(heading);
          observed.add(heading);
        }
      });
    };
    scan();

    const main = document.querySelector("main");
    const mo = main ? new MutationObserver(scan) : null;
    mo?.observe(main as Element, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo?.disconnect();
      observed.clear();
    };
  }, []);

  const showBar = stuck && Boolean(headingText);

  return (
    <>
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      <div
        className={`section-sticky-bar sticky top-12 sm:top-14 z-40 -mt-px print:hidden pointer-events-none transition-all duration-300 ${
          showBar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        {headingText && (
          <div className="pointer-events-auto px-2 sm:px-0">
            <div className="inline-flex items-center gap-2 max-w-full bg-card/95 backdrop-blur-md border border-line/60 shadow-md rounded-full pl-2.5 pr-3.5 py-1.5 sm:px-4 sm:py-2">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" aria-hidden="true" />
              {/* Responsive section label */}
              <span className="hidden sm:inline text-xs font-bold text-ink truncate max-w-md">{headingText}</span>
              <span className="sm:hidden text-[11px] font-bold text-ink truncate max-w-[68vw]">{headingText}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
