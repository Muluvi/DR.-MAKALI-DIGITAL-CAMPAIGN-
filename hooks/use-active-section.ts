"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Which of the nine sections the reader is looking at.
 *
 * Two components resolved this independently, over the same `#section-<id>` elements, with
 * different answers: ClientPage took the last intersecting entry in callback order at
 * `-20% 0px -60%`, and NavDots took the topmost at `-20% 0px -70%`. On /full, where both run,
 * they could disagree — the dots highlighting one section while the tab state said another.
 *
 * NavDots had the better rule and it is the one kept here: the section closest to the top of the
 * band wins, so a tall section does not keep the marker while a short one scrolls past inside it.
 *
 * An IntersectionObserver rather than compared scroll offsets, because this document mounts
 * fifty figures on demand and a lazy section changes height underneath the reader.
 */
export function useActiveSection(
  ids: readonly string[],
  enabled = true,
  onChange?: (id: string) => void,
): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  // Held in a ref so a consumer can pass an inline arrow without re-creating the observer.
  // Written in an effect rather than during render: a ref is not render state.
  const notify = useRef(onChange);
  useEffect(() => {
    notify.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible[0]) return;
        const id = visible[0].target.id.replace(/^section-/, "");
        setActive(id);
        // Reported from the observer callback, not from an effect: this is an external system
        // telling React something changed, which is the one place setState belongs.
        notify.current?.(id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    for (const id of key ? key.split(",") : []) {
      const el = document.getElementById(`section-${id}`);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [key, enabled]);

  return active;
}
