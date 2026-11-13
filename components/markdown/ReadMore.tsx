"use client";

import { useCallback, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { FoldBody } from "./FoldBody";

/**
 * "Read the full text (N words)": the one fold type on the site (brief 2026-10 declutter, 5.0).
 *
 * It replaces the two folds of the retired two-version reading mode. What it keeps
 * from them: the body is rendered with the rest of the section and stays in the DOM, so print, find
 * in page and a deep link all reach it. Closed by default, for every reader.
 */
export function ReadMore({
  words,
  children,
  label = "Read the full text",
  hideLabel = "Hide the full text",
}: {
  /** How much is behind the control. A reader deciding whether to tap deserves to know. */
  words: number;
  children: ReactNode;
  label?: string;
  hideLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reveal = useCallback(() => setOpen(true), []);

  return (
    <div className="pf-more not-prose" data-fold>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="pf-more__btn"
      >
        <span className="pf-more__label">
          {open ? hideLabel : label}
          {!open && words > 0 && (
            <span className="pf-more__words"> ({words.toLocaleString("en-KE")} words)</span>
          )}
        </span>
        <ChevronDown size={16} aria-hidden="true" className="pf-more__chev" data-open={open ? "true" : "false"} />
      </button>
      <FoldBody id={id} open={open} onReveal={reveal} className="pf-more__body">
        <div className="prose max-w-none pt-3">{children}</div>
      </FoldBody>
    </div>
  );
}
