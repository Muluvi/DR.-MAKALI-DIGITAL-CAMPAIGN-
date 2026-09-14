"use client";

import { ArrowRight } from "lucide-react";

declare global {
  interface Window {
    __navigateToSection?: (id: string) => void;
  }
}

/**
 * The one action the proposal is asking for, reachable from anywhere in it.
 *
 * A proposal is read in one pass and decided in another, and the two do not happen on the same
 * screen. Before this, a reader persuaded at Section 6 had no way to act on it: the ask lived at
 * the far end of the document, and the only route to it was the index. Conviction that has to be
 * navigated to is conviction that cools.
 *
 * So the ask travels with the reader. It is deliberately the only accent-filled control in the
 * chrome — the index, settings and back-to-top are all outline or ghost — because two competing
 * primary actions are the same as none.
 *
 * Navigation goes through `window.__navigateToSection`, which ClientPage publishes for exactly
 * this kind of out-of-tree caller; it resolves legacy ids, switches route, waits for the target
 * to mount and then scrolls. Falling back to the hash keeps the control useful if the handler
 * has not been installed yet — during hydration, or with JavaScript disabled — rather than
 * making the ask the one thing on the page that does not work.
 */
export function AskButton({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const go = () => {
    const target = "decision-sec-0-1";
    if (typeof window !== "undefined" && window.__navigateToSection) {
      window.__navigateToSection(target);
    } else if (typeof window !== "undefined") {
      window.location.hash = target;
    }
  };

  return (
    <button
      onClick={go}
      aria-label="Go to the ask: what the campaign is being asked to approve"
      title="The ask"
      className={
        `fx-press fx-focus shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl ` +
        `bg-accent-solid text-on-accent font-bold shadow-sm shadow-accent/20 transition-transform ` +
        (compact
          ? `flex h-11 w-11 `
          : `inline-flex min-h-[36px] px-3 py-1.5 t-label `) +
        className
      }
    >
      {!compact && <span>The ask</span>}
      <ArrowRight size={compact ? 17 : 14} aria-hidden="true" />
    </button>
  );
}
