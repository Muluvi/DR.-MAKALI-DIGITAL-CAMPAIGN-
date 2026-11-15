"use client";

import { useEffect, useRef, useState } from "react";

import measured from "../../data/section-heights.json";

import { useChromeVisible } from "../../hooks/use-chrome-visible";
import { FLOW_ACTS, FLOW_ORDER, actOf } from "../../lib/flow";
import { type TabId } from "../../lib/heading-slug";
import { StageBar } from "../flow/PartDots";

/**
 * The navigation chrome (brief G-7): the dock and the kiondo progress spine.
 *
 * DOCK. One slim glass pill. The page RESERVES its space (bottom padding equal to its height plus
 * the safe-area inset, in app/premium.css), so the end of the document is never read through it,
 * and it steps away on the way down and returns on the way up, so the middle never is either
 * (D-07). What it names is decided by ClientPage's probe, not by an observer's last event (D-08).
 *
 * SPINE. One segment per act (the five stages after the Welcome, and the evidence shelf) on the
 * right edge of a wide screen, each as long as that act is on the page, measured from the act
 * openers themselves on every scroll frame, filling with the weave as the reader moves through
 * them. Every segment is a labelled button (hover and focus). Phones get the same targets in the
 * index instead.
 */
export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function actNumeral(tab: TabId): string {
  return ROMAN[FLOW_ACTS.indexOf(actOf(tab))] ?? "";
}

/**
 * One control per job (flow pass, WP7): the stage bar and the chapter's name open the index and
 * search; the chart icon opens every tool and record. The theme switch lives in the index sheet.
 */
export function Dock({
  label,
  number,
  tab,
  onOpenIndex,
}: {
  label: string;
  number: string;
  tab: TabId;
  onOpenIndex: () => void;
}) {
  const visible = useChromeVisible();

  return (
    <nav className="pf-dock print:hidden" data-hidden={visible ? "false" : "true"} aria-label="Document">
      <div className="pf-dock__pill">
        {/* Named by its visible text plus a hidden clause, so the name a voice user speaks is the one
            they see (WCAG 2.5.3; Lighthouse "label-content-name-mismatch"). */}
        <button type="button" className="pf-dock__where" onClick={onOpenIndex}>
          <span className="pf-dock__numeral" aria-hidden="true"><StageBar tab={tab} /></span>
          <span className="pf-dock__label">
            {number && <b className="pf-dock__num">{number} ·</b>} {label}
          </span>
          <span className="sr-only">. Open the chapters and search.</span>
        </button>
        {/* Every tool and live record, each in its chapter (story integration, November 2026). */}
        <button type="button" className="pf-dock__icon" data-tour="tools" onClick={() => window.dispatchEvent(new Event("story:open-tools"))} aria-label="Open every tool and record">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M2.5 13.5V8.5M6.2 13.5V4.5M9.8 13.5V7M13.5 13.5V2.5" />
          </svg>
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
    <nav ref={ref} className="pf-spine print:hidden" aria-label="Parts">
      <ol>
        {FLOW_ACTS.map((a, i) => {
          return (
            <li key={a.id} style={{ flexGrow: Math.max(1, ACT_WEIGHTS[i]) }}>
              <button
                type="button"
                onClick={() => onSelect(a.opensOn)}
                aria-current={i === active ? "true" : undefined}
                aria-label={a.label}
                data-vt-source=""
              >
                <span className="pf-spine__track" aria-hidden="true">
                  <span className="pf-spine__fill" style={{ "--fill": `var(--fill-${i}, 0)` } as React.CSSProperties} />
                </span>
                <span className="pf-spine__name" aria-hidden="true">
                  <span data-vt-title="">{a.label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
