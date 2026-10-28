"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { REVEAL_EVENT } from "../../lib/fold";

/**
 * The body of a fold: in the HTML whether open or closed, and reachable by find, by a deep link and
 * by print (lib/fold.ts says how).
 *
 * The component owns only the attribute. Whether it is open is the caller's state; `onReveal` is
 * how the browser or a deep link asks the caller to open it.
 */
export function FoldBody({
  open,
  onReveal,
  id,
  className = "",
  children,
  as: Tag = "div",
  role,
  labelledBy,
}: {
  open: boolean;
  onReveal: () => void;
  id?: string;
  className?: string;
  children: ReactNode;
  as?: "div" | "section" | "span";
  role?: string;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reveal = useRef(onReveal);
  useEffect(() => {
    reveal.current = onReveal;
  }, [onReveal]);

  // `hidden="until-found"` cannot be rendered by React (it drops the value), so it is set here.
  // The server's markup is closed by CSS until then, so this changes nothing a reader sees.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) el.removeAttribute("hidden");
    else el.setAttribute("hidden", "until-found");
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => reveal.current();
    el.addEventListener("beforematch", handle);
    el.addEventListener(REVEAL_EVENT, handle);
    return () => {
      el.removeEventListener("beforematch", handle);
      el.removeEventListener(REVEAL_EVENT, handle);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLSpanElement>}
      id={id}
      role={role}
      aria-labelledby={labelledBy}
      data-fold-body={open ? "open" : "closed"}
      className={className}
    >
      {children}
    </Tag>
  );
}
