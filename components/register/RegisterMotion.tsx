"use client";

import { useEffect } from "react";

/**
 * The register's motion, and nothing else (brief §I). Every figure is complete in the HTML; this
 * only decides whether a reader sees it arrive.
 *
 *   Tier 1, still: scripts off, a low-end device (four cores or fewer, 2 GB or less), or Save-Data
 *              on. No class is set, so nothing moves.
 *   Tier 2, draw-in: bars below the fold grow once as they enter view. Reduced motion substitutes
 *              a short fade for the growth rather than dropping the cue (app/register.css).
 *   Numbers: headline values roll to their place in <Roll> (components/premium/Roll.tsx), and
 *              bar values count in <CountUp>; both keep the final value in the HTML.
 *
 * No loop, no scroll-jacking; print draws everything at once.
 */
export function RegisterMotion() {
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowEnd = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 2 || nav.connection?.saveData === true;
    if (lowEnd || typeof IntersectionObserver === "undefined") return;

    const root = document.documentElement;
    root.classList.add("motion-ok");

    const seen = new WeakSet<HTMLElement>();
    const figures: HTMLElement[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.replace("is-pending", "is-drawn");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    const arm = (f: HTMLElement) => {
      if (seen.has(f)) return;
      seen.add(f);
      figures.push(f);
      // A figure already on screen stays as it is: animating what the reader is looking at would
      // redraw it under their eyes.
      if (f.getBoundingClientRect().top < window.innerHeight) return;
      f.classList.add("is-pending");
      io.observe(f);
    };
    document.querySelectorAll<HTMLElement>(".rf").forEach(arm);

    // Most sections stream in as the reader approaches them (components/flow/StreamedSection.tsx),
    // so their figures arrive after this first pass. They are armed as they arrive, on the same
    // rule: below the fold, pending; anything else, as it is.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches(".rf")) arm(n);
          n.querySelectorAll<HTMLElement>(".rf").forEach(arm);
        });
      }
    });
    mo.observe(document.getElementById("content-area") ?? document.body, { childList: true, subtree: true });

    const drawAll = () => figures.forEach((f) => f.classList.replace("is-pending", "is-drawn"));
    window.addEventListener("beforeprint", drawAll);
    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("beforeprint", drawAll);
    };
  }, []);
  return null;
}
