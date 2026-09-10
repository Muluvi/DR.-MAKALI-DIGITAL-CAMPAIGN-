"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A run of comparable blocks, one open at a time.
 *
 * Used where the proposal writes a matrix as prose — six voter segments with the same seven
 * fields, five stack components each with a spec and a cost. The labels are always visible, so
 * the reader sees how many comparable things there are and what they are called before deciding
 * how deep to go; the first is open, so the section never opens on a wall of closed drawers.
 *
 * The panels are rendered on the server and passed in as children — this component only owns
 * which one is showing, so no markdown or parser reaches the client bundle for them.
 */
export function DisclosureGroup({
  labels,
  unresolved = [],
  children,
}: {
  labels: string[];
  /** Per-panel: does this panel carry a figure the campaign has not yet established? */
  unresolved?: boolean[];
  children: React.ReactNode[];
}) {
  const [open, setOpen] = useState(0);

  return (
    <div className="not-prose my-6 border border-line/70 rounded-2xl overflow-hidden bg-card/40">
      {labels.map((label, i) => {
        const isOpen = i === open;
        return (
          <div key={label} className={i > 0 ? "border-t border-line/70" : undefined}>
            <h4 className="m-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className={`w-full flex items-center gap-3 text-left px-4 py-3.5 sm:px-5 cursor-pointer transition-colors min-h-[52px] ${
 isOpen ? "bg-accent/[0.06] text-ink" : "text-muted hover:bg-ink/[0.03] hover:text-ink"
                }`}
              >
                {/* No 01/02/03 marker: several of these runs are not sequences, and the ones
                    that are already carry their own numbering in the heading text. */}
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOpen ? "bg-accent" : "bg-line"}`}
                  aria-hidden="true"
                />
                <span className="font-serif t-small font-semibold leading-snug flex-1 text-balance">
                  {label}
                </span>
                {/* The document marks what it has not yet measured, and that marking is worth
                    more to this reader than a confident-looking gap. Surfacing it on the closed
                    label means collapsing a panel never hides the fact that something in it is
                    still open. */}
                {unresolved[i] && (
                  <span
                    className="t-micro font-extrabold text-gold border border-gold/40 bg-gold/[0.08] rounded-full px-2 py-0.5 shrink-0"
                    title="Contains a figure awaiting a campaign decision or verification"
                  >
                    Awaiting
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
 isOpen ? "rotate-180 text-accent" : "text-muted"
                  }`}
                />
              </button>
            </h4>
            {/* Rendered whether or not it is open, and hidden with CSS rather than dropped from
                the tree, so the printed briefing kit carries every panel instead of a row of
                labels with nothing under them. */}
            <div
              className={`prose max-w-none px-4 pb-5 pt-1 sm:px-5 border-t border-line/40 ${
 isOpen ? "" : "hidden print:block"
              }`}
            >
              {children[i]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
