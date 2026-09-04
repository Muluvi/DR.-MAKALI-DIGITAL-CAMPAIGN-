"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Compact bar naming where the reader currently is: the top-level section they are in, and the
 * sub-section in view. Both the "have we scrolled past the toolbar" state and the "which heading
 * is current" state are derived from IntersectionObserver entries — no scroll listener.
 *
 * The section name is always shown once the bar appears, so current position never depends on
 * having scrolled a heading into view.
 */
export function SectionStickyBar({ sectionLabel }: { sectionLabel?: string }) {
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

  const showBar = stuck && Boolean(headingText || sectionLabel);

  return (
    <>
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      <div
        className={`section-sticky-bar sticky top-12 sm:top-14 z-40 -mt-px print:hidden pointer-events-none transition-all duration-300 ${
          showBar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        {(headingText || sectionLabel) && (
          <div className="pointer-events-auto px-2 sm:px-0">
            <div className="inline-flex items-center gap-2 max-w-full bg-card/95 backdrop-blur-md border border-line/60 shadow-md rounded-full pl-2.5 pr-3.5 py-1.5 sm:px-4 sm:py-2">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
              {sectionLabel && (
                <span className="text-xs font-semibold text-accent shrink-0 max-w-[38vw] sm:max-w-none truncate">
                  {sectionLabel}
                </span>
              )}
              {sectionLabel && headingText && (
                <span className="w-px h-3 bg-line shrink-0" aria-hidden="true" />
              )}
              {headingText && (
                <span className="text-xs font-medium text-muted truncate max-w-[42vw] sm:max-w-md">{headingText}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
