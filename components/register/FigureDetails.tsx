"use client";

import { createContext, useCallback, useContext, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { FoldBody } from "../markdown/FoldBody";

/**
 * Figure slimming (brief 2026-10 declutter, section 7): a figure shows its finding, its marks, its
 * takeaway and its source; the question it answers, its notes and each item's body text sit behind
 * one "Details and notes" control. Every piece behind it is a FoldBody, so it is in the HTML, found
 * by find in page (which opens the whole figure's details), opened by a deep link, printed, and shown
 * with scripts off.
 */
const Ctx = createContext<{ open: boolean; reveal: () => void; toggle: () => void; id: string } | null>(null);

export function FigureDetails({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reveal = useCallback(() => setOpen(true), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  return <Ctx.Provider value={{ open, reveal, toggle, id }}>{children}</Ctx.Provider>;
}

/** The one control that opens a figure's details. */
export function FigureDetailsToggle() {
  const ctx = useContext(Ctx);
  if (!ctx) return null;
  return (
    <button type="button" className="rf-more" aria-expanded={ctx.open} aria-controls={`${ctx.id}-notes`} onClick={ctx.toggle}>
      <span>{ctx.open ? "Hide details and notes" : "Details and notes"}</span>
      <ChevronDown size={14} aria-hidden="true" className="rf-more__chev" data-open={ctx.open ? "true" : "false"} />
    </button>
  );
}

/** Text that waits behind the figure's control. Outside a FigureDetails it simply renders. */
export function FigDetail({ children, as = "div", className = "", notes = false }: { children: ReactNode; as?: "div" | "span"; className?: string; notes?: boolean }) {
  const ctx = useContext(Ctx);
  if (!ctx) return as === "span" ? <span className={className}>{children}</span> : <div className={className}>{children}</div>;
  return (
    <FoldBody as={as} open={ctx.open} onReveal={ctx.reveal} id={notes ? `${ctx.id}-notes` : undefined} className={className}>
      {children}
    </FoldBody>
  );
}
