"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, LayoutPanelTop } from "lucide-react";

import { FoldBody } from "./FoldBody";

/**
 * A mounted panel (an interactive component placed under a heading, or a bespoke figure) behind one
 * control, closed by default (the owner's instruction of 29 October 2026, to reach the phone-screen
 * target). The panel is rendered with the page and kept in the DOM as a FoldBody, so find in page
 * and a deep link open it, print shows it, and with scripts off it is shown.
 *
 * The control names the panel by its own title, read once the page has hydrated: its first heading,
 * else its caption or chart title, else its eyebrow line. A panel whose component loads later is
 * watched until its title arrives. Until then the control reads "Interactive panel"; the label is one
 * line either way, so naming it moves nothing.
 */
const TITLES = ["h2, h3, h4, h5", "figcaption, svg title, [class*='title']", ".t-micro.font-black"];

function readTitle(el: HTMLElement): string | null {
  for (const selector of TITLES) {
    const text = el.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim();
    if (!text) continue;
    // An all-capitals chart title reads as shouting in a control; set it in sentence case.
    const plain = /[a-z]/.test(text) ? text : text.charAt(0) + text.slice(1).toLowerCase();
    return plain.length > 90 ? `${plain.slice(0, 88)}…` : plain;
  }
  return null;
}

export function PanelFold({ children, label, className }: { children: ReactNode; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const id = useId();
  const body = useRef<HTMLDivElement>(null);
  const reveal = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const el = body.current;
    if (!el || label) return;
    const found = readTitle(el);
    if (found) {
      setTitle(found);
      return;
    }
    const watch = new MutationObserver(() => {
      const next = readTitle(el);
      if (next) {
        setTitle(next);
        watch.disconnect();
      }
    });
    watch.observe(el, { childList: true, subtree: true });
    return () => watch.disconnect();
  }, [label]);

  return (
    <div className={className ? `pf-panel not-prose ${className}` : "pf-panel not-prose"} data-open={open ? "true" : "false"}>
      <button type="button" className="pf-panel__btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <LayoutPanelTop size={16} aria-hidden="true" className="pf-panel__icon" />
        <span className="pf-panel__text">
          <span className="pf-panel__k">{open ? "Hide the panel" : "Show the panel"}</span>
          <span className="pf-panel__t">{label ?? title ?? "Interactive panel"}</span>
        </span>
        <ChevronDown size={16} aria-hidden="true" className="pf-panel__chev" data-open={open ? "true" : "false"} />
      </button>
      <FoldBody id={id} open={open} onReveal={reveal} className="pf-panel__body">
        <div ref={body}>{children}</div>
      </FoldBody>
    </div>
  );
}
