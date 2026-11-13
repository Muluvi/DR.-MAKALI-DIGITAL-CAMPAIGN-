"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; label: string };

/**
 * The one navigation: a link to each stage, the current one highlighted as the reader scrolls.
 * On a phone it collapses into a single menu button that names the stage in view.
 */
export function Nav({ items }: { items: Item[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((s): s is HTMLElement => !!s);
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = items.find((i) => visible.get(i.id));
        setCurrent(first ? first.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menu.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const label = items.find((i) => i.id === current)?.label ?? "Stages";
  return (
    <nav aria-label="Stages">
      <ul className="nav-list">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={current === i.id ? "true" : undefined}>{i.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-menu" ref={menu}>
        <button type="button" aria-expanded={open} aria-controls="stage-menu" onClick={() => setOpen((o) => !o)}>
          {label}
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open && (
          <ul id="stage-menu">
            {items.map((i) => (
              <li key={i.id}>
                <a href={`#${i.id}`} aria-current={current === i.id ? "true" : undefined} onClick={() => setOpen(false)}>{i.label}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
