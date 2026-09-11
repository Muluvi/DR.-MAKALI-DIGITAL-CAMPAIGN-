"use client";

import { useEffect, useState } from "react";

/**
 * Page chrome that only exists once the reader has started reading: the scroll-spy dots.
 *
 * A custom cursor — a dot with a lagging ring, driven by a `pointermove` rAF loop — used to live
 * here too. It was removed under docs/TRIAGE.md §5.3: it is on the pre-judged reject list twice
 * over, it never appeared for a reader on a phone, and a trailing cursor is the wrong register
 * for a document whose subject is fiscal discipline.
 *
 * A back-to-top button belongs on this list and is deliberately not here: QuickNavCapsule already
 * renders one, in the same corner. Two would have collided, and the brief's "back-to-top reveal"
 * is better served by giving the existing control the reveal than by adding a second control.
 *
 * The dots are strictly additive. Nothing in the document depends on them, they do not trap
 * focus, and they never mount below xl.
 */

interface NavDotsProps {
  sections: { id: string; label: string }[];
  onSelect: (id: string) => void;
}

/**
 * Scroll-spy dots down the right edge.
 *
 * The active section is resolved by an IntersectionObserver over the real section elements rather
 * than by comparing scroll offsets, so it stays correct when a lazy section changes height
 * underneath the reader — which, in a document that mounts fifty figures on demand, it does.
 */
export function NavDots({ sections, onSelect }: NavDotsProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        // The section closest to the top of the band wins, so a tall section does not keep the
        // marker while a short one scrolls past inside it.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace(/^section-/, ""));
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    const els = sections
      .map((s) => document.getElementById(`section-${s.id}`))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav
      className="fixed right-3 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-2.5 print:hidden"
      aria-label="Section progress"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-current={isActive ? "true" : undefined}
            aria-label={s.label}
            title={s.label}
            className={`fx-navdot fx-focus rounded-full ${
 isActive ? "w-2.5 h-6 bg-accent" : "w-2.5 h-2.5 bg-line hover:bg-accent/60"
            }`}
          />
        );
      })}
    </nav>
  );
}
