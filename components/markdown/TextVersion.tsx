"use client";

import { useCallback, useId, useState, type ReactNode } from "react";

import { FoldBody } from "./FoldBody";

/**
 * "Read the text version" (brief §12): the prose a visual has taken over, kept word for word
 * directly under the figure that now does its job.
 *
 * Closed by default, for every reader: the figure carries the passage, and the words are one tap
 * away. The body stays in the DOM (lib/fold.ts), so find in page, a deep link and print reach it.
 */
export function TextVersion({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reveal = useCallback(() => setOpen(true), []);
  return (
    <div className="pf-textver" data-open={open ? "true" : "false"}>
      <button type="button" className="pf-textver__summary" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span>{open ? "Hide the text version" : "Read the text version"}</span>
        <span className="pf-textver__hint">the passage this figure replaces, word for word</span>
      </button>
      <FoldBody id={id} open={open} onReveal={reveal}>
        <div className="pf-textver__body">{children}</div>
      </FoldBody>
    </div>
  );
}
