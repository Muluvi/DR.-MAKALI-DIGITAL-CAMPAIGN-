"use client";

import { useEffect, useRef, useState } from "react";

import measured from "../../data/section-heights.json";
import { FLOW_ACTS, FLOW_ORDER, actOf } from "../../lib/flow";
import { useFrames } from "./FramesShell";

/**
 * The navigation chrome, v2 (brief G-7): the dock and the kiondo progress spine.
 *
 * DOCK. One slim glass pill. It RESERVES its space: the page's bottom padding is the dock's height
 * plus the safe-area inset, so nothing is ever read through it (D-07). It hides on the way down and
 * returns on the way up. Its label comes from a probe, not from an observer's last event: on every
 * scroll frame it asks which section contains a line 30% down the viewport, and above the first
 * section the answer is the first section. That is the D-08 fix — the old observer only updated
 * when a section crossed its band, so after a jump it kept the jump's label forever at the top.
 *
 * SPINE. Seven act segments on the right edge (desktop), each as long as that act is on the page
 * (data/section-heights.json, measured at 390 px), filling with the weave as you read. Every
 * segment is a button, labelled on hover and focus. On phones it is absent; the menu carries a
 * tap target per act instead.
 *
 * On this review page the dock reads the frames, and the spine maps this page's scroll across the
 * seven acts, so both can be judged in motion. The live page wires both to the document itself.
 */
const HEIGHTS = measured as Record<string, number>;

const ACT_WEIGHTS = FLOW_ACTS.map((a) =>
  FLOW_ORDER.filter((id) => actOf(id).id === a.id).reduce((n, id) => n + (HEIGHTS[id] ?? 0), 0)
);
const TOTAL = ACT_WEIGHTS.reduce((a, b) => a + b, 0) || 1;
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
/** Each act's share of the page, as a [from, to] fraction of the scroll. */
const BOUNDS = ACT_WEIGHTS.map((w, i) => {
  const before = ACT_WEIGHTS.slice(0, i).reduce((a, b) => a + b, 0);
  return { from: before / TOTAL, to: (before + w) / TOTAL };
});

export function Dock({ sections }: { sections: { id: string; label: string; numeral?: string }[] }) {
  const { theme, setTheme } = useFrames();
  const [current, setCurrent] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [mode, setMode] = useState<"brief" | "full">("brief");
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const probe = window.innerHeight * 0.3;
      let idx = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= probe) idx = i;
      });
      setCurrent(idx);
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (Math.abs(dy) > 6) setHidden(dy > 0 && y > 200);
      lastY.current = y;
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  const s = sections[current];
  return (
    <nav className="pf-dock" data-hidden={hidden ? "true" : "false"} aria-label="Document">
      <div className="pf-dock__pill">
        <a className="pf-dock__where" href={`#${s.id}`}>
          {s.numeral && <span className="pf-dock__numeral" aria-hidden="true">{s.numeral}</span>}
          <span className="pf-dock__label">{s.label}</span>
        </a>
        <span className="pf-dock__rule" aria-hidden="true" />
        <div className="pf-dock__mode" role="group" aria-label="Reading mode">
          {(["brief", "full"] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m === "brief" ? "Brief" : "Full"}
            </button>
          ))}
          <span className="pf-dock__thumb" data-at={mode} aria-hidden="true" />
        </div>
        <button type="button" className="pf-dock__icon" aria-label="Open the index">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M2 4h12M2 8h12M2 12h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <button type="button" className="pf-dock__icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Switch between light and dark">
          {theme === "dark" ? (
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

export function Spine() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const bounds = BOUNDS;

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, d.scrollTop / max)) : 0;
      ref.current?.style.setProperty("--spine-p", p.toFixed(4));
      setActive(Math.max(0, bounds.findIndex((b) => p >= b.from && p <= b.to)));
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [bounds]);

  const jump = (i: number) => {
    const d = document.documentElement;
    window.scrollTo({ top: bounds[i].from * (d.scrollHeight - d.clientHeight) + 2, behavior: "smooth" });
  };

  return (
    <nav ref={ref} className="pf-spine" aria-label="Acts">
      <ol>
        {FLOW_ACTS.map((a, i) => {
          const b = bounds[i];
          return (
            <li key={a.id} style={{ flexGrow: ACT_WEIGHTS[i] / TOTAL, "--from": b.from, "--to": b.to } as React.CSSProperties}>
              <button type="button" onClick={() => jump(i)} aria-current={i === active ? "true" : undefined} data-passed={i < active ? "true" : "false"}>
                <span className="pf-spine__track" aria-hidden="true">
                  <span className="pf-spine__fill" />
                </span>
                <span className="pf-spine__name">
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
