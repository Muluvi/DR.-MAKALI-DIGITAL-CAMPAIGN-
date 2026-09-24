"use client";

import { useEffect, useRef, useState } from "react";

import { useChromeVisible } from "../../hooks/use-chrome-visible";
import { useReadingMode } from "../../lib/reading-mode";

/**
 * The only navigation chrome on the page.
 *
 * What it replaced: a nineteen-item sidebar, a five-icon dock, a floating quick-nav capsule, a
 * sticky section bar and a seven-button toolbar — five simultaneous ways to reach a section, on a
 * document that is now one scroll and does not require reaching for anything.
 *
 * What is left is one capsule: how far through you are, which section you are in, and a way into
 * the index for the reader who does want to jump. It hides on the way down and returns on the way
 * up, which is the gesture a reader already makes when they want their bearings.
 *
 * The progress arc is an SVG ring driven by a CSS custom property written from scroll, not by
 * React state — a progress indicator that re-renders a tree sixty times a second is the single
 * most expensive thing a long page can do.
 */
export function FlowChrome({
  label,
  number,
  position,
  total,
  onOpenIndex,
  onToggleTheme,
  theme,
  themeReady,
  hidden = false,
}: {
  label: string;
  number: string;
  position: number;
  total: number;
  onOpenIndex: () => void;
  onToggleTheme: () => void;
  theme: string;
  themeReady: boolean;
  hidden?: boolean;
}) {
  const visible = useChromeVisible();
  const { mode, setMode } = useReadingMode();
  const ringRef = useRef<SVGCircleElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      const el = ringRef.current;
      if (el) el.style.strokeDashoffset = String(C * (1 - next));
      setPct(Math.round(next * 100));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="flow-chrome" data-hidden={hidden || !visible ? "true" : "false"} aria-hidden={hidden ? "true" : undefined}>
      <button type="button" className="flow-chrome__pill" onClick={onOpenIndex} aria-label={`${label}. Section ${position + 1} of ${total}. Open the index.`}>
        <span className="flow-chrome__ring" aria-hidden="true">
          <svg viewBox="0 0 34 34">
            <circle cx="17" cy="17" r={R} className="flow-chrome__ring-bg" />
            <circle ref={ringRef} cx="17" cy="17" r={R} className="flow-chrome__ring-fg" style={{ strokeDasharray: C, strokeDashoffset: C }} />
          </svg>
          <span className="flow-chrome__ring-num">{pct}</span>
        </span>
        <span className="flow-chrome__text">
          <span className="flow-chrome__num">§{number}</span>
          <span className="flow-chrome__label">{label}</span>
        </span>
        <span className="flow-chrome__index" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <rect x="1" y="2.2" width="14" height="1.7" rx="0.85" />
            <rect x="1" y="7.15" width="14" height="1.7" rx="0.85" />
            <rect x="1" y="12.1" width="9" height="1.7" rx="0.85" />
          </svg>
        </span>
      </button>

      {/* Brief or Full, wherever the reader is.

          The hero carries the full segmented control with both reading times, but the hero only
          exists on "/" and "/full". A reader who followed a deep link into §F.12 lands on that
          chapter's own route, in Brief, with no way back to the whole text — so the choice lives
          here too, in the one piece of chrome that follows the reader down every page. */}
      <button
        type="button"
        className="flow-chrome__theme"
        onClick={() => setMode(mode === "brief" ? "full" : "brief")}
        aria-pressed={mode === "full"}
        aria-label={mode === "brief" ? "Show every section in full" : "Show each section in brief"}
        title={mode === "brief" ? "Reading in Brief — show full sections" : "Reading in Full — show brief sections"}
      >
        <span className="t-micro font-black leading-none" aria-hidden="true">
          {mode === "brief" ? "B" : "F"}
        </span>
      </button>

      {/* Brightness is the one control a reader reaches for mid-read — this document is read in
          daylight in Kitui and at night on a sofa. It sits beside the capsule rather than in a
          bar over the prose, which is where it used to be and where it covered the figures. */}
      <button type="button" className="flow-chrome__theme" onClick={onToggleTheme} aria-label="Switch between light and dark">
        {!themeReady ? (
          <span className="flow-chrome__theme-hold" aria-hidden="true" />
        ) : theme === "light" ? (
          <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
            <path d="M13.3 9.6A5.6 5.6 0 0 1 6.4 2.7a5.8 5.8 0 1 0 6.9 6.9z" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <circle cx="8" cy="8" r="3.1" />
            <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2L3.1 3.1" />
          </svg>
        )}
      </button>
    </div>
  );
}

const R = 15;
const C = 2 * Math.PI * R;
