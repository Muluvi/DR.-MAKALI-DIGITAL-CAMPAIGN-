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
  children,
}: {
  labels: string[];
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
                <span className="font-serif text-sm sm:text-[15px] font-semibold leading-snug flex-1 text-balance">
                  {label}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                    isOpen ? "rotate-180 text-accent" : "text-muted"
                  }`}
                />
              </button>
            </h4>
            {isOpen && (
              <div className="prose max-w-none px-4 pb-5 pt-1 sm:px-5 border-t border-line/40">
                {children[i]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
