"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X } from "lucide-react";
import mirrors from "@/lib/story/mirrors.generated.json";

const DEFINITION: Record<string, string> = Object.fromEntries(mirrors.terms.map((t) => [t.term.toLowerCase(), t.text]));

/**
 * A term from the Fine print glossary (H.1), dotted-underlined where the chapter first uses it.
 * A tap opens its definition in place; the glossary is one more tap away.
 */
export function GlossTerm({ term, children }: { term: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; up: boolean } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  const text = DEFINITION[term.toLowerCase()];

  useEffect(() => {
    if (!open) return;
    const place = () => {
      const r = btn.current?.getBoundingClientRect();
      if (!r) return;
      const w = Math.min(300, window.innerWidth - 24);
      const up = r.bottom + 180 > window.innerHeight;
      setPos({ top: up ? r.top - 8 : r.bottom + 8, left: Math.max(12, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 12)), up });
    };
    place();
    const y0 = window.scrollY;
    const close = (e: Event) => {
      if (e.type === "keydown" && (e as KeyboardEvent).key !== "Escape") return;
      if (e.type === "scroll" && Math.abs(window.scrollY - y0) < 60) return;
      setOpen(false);
    };
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", place);
    window.addEventListener("keydown", close);
    return () => { window.removeEventListener("scroll", close); window.removeEventListener("resize", place); window.removeEventListener("keydown", close); };
  }, [open]);

  if (!text) return <>{children}</>;
  return (
    <>
      <button ref={btn} type="button" className="sx-term" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>{children}</button>
      {open && pos && createPortal(
        <span id={id} role="dialog" aria-label={`${term}: definition`} className="sx-term-pop" data-up={pos.up ? "true" : "false"} style={{ top: pos.top, left: pos.left }}>
          <span className="sx-term-pop__head"><b>{term}</b><button type="button" onClick={() => setOpen(false)} aria-label="Close"><X size={14} aria-hidden="true" /></button></span>
          <span className="sx-term-pop__text">{text}</span>
          <a className="sx-term-pop__all" href="#annex-terms-sec-h-1" onClick={() => setOpen(false)}><BookOpen size={12} aria-hidden="true" /> Every term, in the Fine print</a>
        </span>,
        document.body,
      )}
    </>
  );
}
