"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useReadingMode } from "../../lib/reading-mode";

/**
 * "Read the text version" (brief §12): the prose a visual has taken over, kept word for word
 * directly under the figure that now does its job.
 *
 * A native <details>, rendered OPEN from the server, so a reader with scripts off, a screen reader
 * and a printer all get the text in place. After hydration it follows the reading mode: closed in
 * Brief, where the figure carries the passage, and open in Full, where the reader asked for every
 * word. Print opens it whatever the mode, and restores the reader's state afterwards.
 */
export function TextVersion({ children }: { children: ReactNode }) {
  const { mode } = useReadingMode();
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.open = mode === "full";
  }, [mode]);

  useEffect(() => {
    let was = false;
    const before = () => {
      const el = ref.current;
      if (!el) return;
      was = el.open;
      el.open = true;
    };
    const after = () => {
      const el = ref.current;
      if (el) el.open = was;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return (
    <details ref={ref} open className="pf-textver">
      <summary>
        <span>Read the text version</span>
        <span className="pf-textver__hint">the passage this figure replaces, word for word</span>
      </summary>
      <div className="pf-textver__body">{children}</div>
    </details>
  );
}
