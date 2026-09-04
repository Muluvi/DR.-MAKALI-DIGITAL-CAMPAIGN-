"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A long unbroken run of prose, folded after its opening paragraph.
 *
 * Some of the heaviest blocks in this proposal have no sub-headings to collapse on — the ethics
 * charter runs 64 consecutive lines. The opening paragraph always stays, so the block still says
 * what it is and never becomes a lone button; everything after it is one tap away.
 *
 * The body is rendered on the server and passed in, so no markdown or parser reaches the client
 * bundle for it.
 */
export function ProseFold({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="not-prose my-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 text-left px-4 py-3 rounded-xl border border-line/70 bg-card/40 text-muted hover:text-ink hover:border-accent/40 transition-colors cursor-pointer min-h-[48px]"
      >
        <span className="text-xs sm:text-sm font-semibold flex-1">
          {open ? "Hide the rest of" : "Read the rest of"} {label}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>
      {open && <div className="prose max-w-none pt-4">{children}</div>}
    </div>
  );
}
