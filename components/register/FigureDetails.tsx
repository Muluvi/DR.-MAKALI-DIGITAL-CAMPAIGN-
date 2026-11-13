"use client";

import { createContext, useCallback, useContext, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { FoldBody } from "../markdown/FoldBody";

/**
 * Figure slimming (brief 2026-10 declutter, section 7, as the owner widened it on 2026-10-29), revised
 * by the visual-first pass (October 2026): a figure shows its finding, its takeaway, its marks, any
 * conflict flag and its tier badges; the question it answers, its notes, each item's body text, the
 * source names and the data table sit behind one "Show the details" control. Every piece behind it is a FoldBody, so it is in the HTML, found by find
 * in page (which opens the whole figure), opened by a deep link, printed, and shown with scripts off.
 */
const Ctx = createContext<{ open: boolean; reveal: () => void; toggle: () => void; id: string } | null>(null);

export function FigureDetails({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reveal = useCallback(() => setOpen(true), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  return <Ctx.Provider value={{ open, reveal, toggle, id }}>{children}</Ctx.Provider>;
}

/**
 * The one control that opens a figure's details: its question and notes, its sources and its data.
 * `badges` are the figure's tier badges, shown beside the control, so a figure's tiers stay in view
 * while its source names sit behind it (brief section 2, rule 5).
 */
export function FigureDetailsToggle({ badges }: { badges?: ReactNode }) {
  const ctx = useContext(Ctx);
  if (!ctx) return null;
  return (
    <button type="button" className="rf-more" aria-expanded={ctx.open} aria-controls={`${ctx.id}-notes`} onClick={ctx.toggle}>
      <span>{ctx.open ? "Hide the details" : "Show the details"}</span>
      <ChevronDown size={14} aria-hidden="true" className="rf-more__chev" data-open={ctx.open ? "true" : "false"} />
      {badges ? <span className="rf-more__tiers">{badges}</span> : null}
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
