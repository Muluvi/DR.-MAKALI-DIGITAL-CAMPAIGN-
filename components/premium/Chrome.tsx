"use client";

import { useEffect, useRef, useState } from "react";

import measured from "../../data/section-heights.json";

import { useChromeVisible } from "../../hooks/use-chrome-visible";
import { FLOW_ACTS, FLOW_ORDER, actOf } from "../../lib/flow";
import type { TabId } from "../../lib/heading-slug";
import { useReadingMode } from "../../lib/reading-mode";

/**
 * The navigation chrome (brief G-7): the dock and the kiondo progress spine.
 *
 * DOCK. One slim glass pill. The page RESERVES its space (bottom padding equal to its height plus
 * the safe-area inset, in app/premium.css), so the end of the document is never read through it,
 * and it steps away on the way down and returns on the way up, so the middle never is either
 * (D-07). What it names is decided by ClientPage's probe, not by an observer's last event (D-08).
 *
 * SPINE. Seven act segments on the right edge of a wide screen, each as long as that act is on
 * the page, measured from the act openers themselves on every scroll frame, filling with the weave
 * as the reader moves through them. Every segment is a labelled button (hover and focus). Phones
 * get the same seven targets in the index instead.
 */
export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

export function actNumeral(tab: TabId): string {
  return ROMAN[FLOW_ACTS.indexOf(actOf(tab))] ?? "";
}

export function Dock({
  label,
  number,
  tab,
  onOpenIndex,
  onToggleTheme,
  theme,
  themeReady,
}: {
  label: string;
  number: string;
  tab: TabId;
  onOpenIndex: () => void;
  onToggleTheme: () => void;
  theme: string;
  themeReady: boolean;
}) {
  const visible = useChromeVisible();
  const { mode, setMode } = useReadingMode();

  return (
    <nav className="pf-dock print:hidden" data-hidden={visible ? "false" : "true"} aria-label="Document">
      <div className="pf-dock__pill">
        <button type="button" className="pf-dock__where" onClick={onOpenIndex} aria-label={`${number ? `Section ${number}, ` : ""}${label}. Open the index.`}>
          <span className="pf-dock__numeral" aria-hidden="true">{actNumeral(tab) || "·"}</span>
          <span className="pf-dock__label">
            {number && <b className="pf-dock__num">§{number}</b>} {label}
          </span>
        </button>
        <span className="pf-dock__rule" aria-hidden="true" />
        <div className="pf-dock__mode" role="group" aria-label="Reading mode">
          {(["brief", "full"] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m === "brief" ? "Brief" : "Full"}
            </button>
          ))}
          <span className="pf-dock__thumb" data-at={mode} aria-hidden="true" />
        </div>
        <button type="button" className="pf-dock__icon" onClick={onOpenIndex} aria-label="Open the index">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M2 4h12M2 8h12M2 12h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <button type="button" className="pf-dock__icon" onClick={onToggleTheme} aria-label="Switch between light and dark">
          {!themeReady ? (
            <span className="pf-dock__hold" aria-hidden="true" />
          ) : theme === "dark" ? (
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <circle cx="8" cy="8" r="3.1" />
              <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2L3.1 3.1" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M13.3 9.6A5.6 5.6 0 0 1 6.4 2.7a5.8 5.8 0 1 0 6.9 6.9z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}

/** The first section of each act, in order: what the spine measures and jumps to. */
const OPENERS = FLOW_ACTS.map((a) => a.opensOn);

/** Each segment's length: the act's measured height at 390 px (data/section-heights.json). */
const HEIGHTS = measured as Record<string, number>;
const ACT_WEIGHTS = FLOW_ACTS.map((a) =>
  FLOW_ORDER.filter((id) => actOf(id).id === a.id).reduce((n, id) => n + (HEIGHTS[id] ?? 0), 0)
);

export function Spine({ onSelect }: { onSelect: (tab: TabId) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const y = window.scrollY;
      // Each act runs from its first section's top to the next act's; the last to the end.
      const tops = OPENERS.map((id) => {
        const s = document.getElementById(`section-${id}`);
        return s ? s.getBoundingClientRect().top + y - window.innerHeight * 0.3 : NaN;
      });
      let current = 0;
      OPENERS.forEach((_, i) => {
        const from = Math.max(0, tops[i]);
        const to = i < OPENERS.length - 1 ? Math.max(from + 1, tops[i + 1]) : max + window.innerHeight;
        const fill = Number.isFinite(from) ? Math.min(1, Math.max(0, (y - from) / (to - from))) : 0;
        el.style.setProperty(`--fill-${i}`, fill.toFixed(4));
        if (Number.isFinite(from) && y >= from) current = i;
      });
      setActive(current);
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    // Streamed sections change the page's length as they arrive; re-measure when they do.
    const ro = new ResizeObserver(on);
    const body = document.getElementById("content-area");
    if (body) ro.observe(body);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav ref={ref} className="pf-spine print:hidden" aria-label="Acts">
      <ol>
        {FLOW_ACTS.map((a, i) => {
          return (
            <li key={a.id} style={{ flexGrow: Math.max(1, ACT_WEIGHTS[i]) }}>
              <button
                type="button"
                onClick={() => onSelect(a.opensOn)}
                aria-current={i === active ? "true" : undefined}
                aria-label={`Act ${ROMAN[i]}: ${a.label}`}
              >
                <span className="pf-spine__track" aria-hidden="true">
                  <span className="pf-spine__fill" style={{ "--fill": `var(--fill-${i}, 0)` } as React.CSSProperties} />
                </span>
                <span className="pf-spine__name" aria-hidden="true">
                  <b>{ROMAN[i]}</b> {a.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
