"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { applyPrefs, FX_EVENT, motionOk, readPrefs, type FxPrefs } from "../../lib/fx/prefs";
import { startReveal } from "../../lib/fx/reveal";
import { loadingBar, startScroll } from "../../lib/fx/scroll";
import { startPointer } from "../../lib/fx/pointer";
import { FxPanel } from "./FxPanel";

/**
 * The site-wide effects layer, mounted once in the root layout so that every route — the flow,
 * /full, each section route, the tools and the campaign platform — gets the same treatment.
 *
 * Three engines start here (lib/fx): reveal, scroll and pointer. Each returns its own cleanup.
 * `html.fx-on` is what the CSS keys every armed state from: without script it is never set, and
 * under reduced motion it is never set, so in both cases every element is simply where it ends.
 */
export function FxRoot() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    applyPrefs(readPrefs());
    const motion = motionOk();
    root.classList.toggle("fx-on", motion);
    root.classList.add("fx-js");

    const stops: Array<() => void> = [];
    stops.push(startScroll());
    stops.push(startPointer(motion));
    if (motion) stops.push(startReveal());

    const onPrefs = (e: Event) => applyPrefs((e as CustomEvent<FxPrefs>).detail);
    window.addEventListener(FX_EVENT, onPrefs);

    // Pause every CSS loop while the tab is hidden: nothing should animate for no one.
    const onVis = () => root.toggleAttribute("data-fx-hidden", document.hidden);
    document.addEventListener("visibilitychange", onVis);

    // The loading bar for an internal navigation: on as the link is followed, off when the
    // route has changed (below).
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      loadingBar(true);
      root.setAttribute("data-fx-leaving", "");
    };
    document.addEventListener("click", onClick);

    // A reduced-motion preference changed mid-visit: honour it at once.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => root.classList.toggle("fx-on", !mq.matches);
    mq.addEventListener?.("change", onMq);

    return () => {
      stops.forEach((s) => s());
      window.removeEventListener(FX_EVENT, onPrefs);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("click", onClick);
      mq.removeEventListener?.("change", onMq);
      root.classList.remove("fx-on", "fx-js");
    };
  }, []);

  // The page transition: the new route's content enters; the loading bar completes.
  useEffect(() => {
    const root = document.documentElement;
    loadingBar(false);
    root.removeAttribute("data-fx-leaving");
    if (first.current) {
      first.current = false;
      return;
    }
    root.setAttribute("data-fx-route", "");
    const t = window.setTimeout(() => root.removeAttribute("data-fx-route"), 700);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <>
      <div className="fx-aurora print:hidden" aria-hidden="true">
        <span className="fx-aurora__a" />
        <span className="fx-aurora__b" />
        <span className="fx-aurora__c" />
      </div>
      <div className="fx-loadbar print:hidden" aria-hidden="true" />
      <FxPanel />
    </>
  );
}
