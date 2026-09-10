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
        className="w-full flex items-center gap-2.5 text-left px-4 py-3 rounded-xl border border-line/70 bg-card/40 text-muted hover:text-ink hover:border-accent/40 transition-colors cursor-pointer min-h-[48px] print:hidden"
      >
        <span className="t-label sm:t-small font-semibold flex-1">
          {open ? "Hide the rest of" : "Read the rest of"} {label}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
 open ? "rotate-180 text-accent" : ""
          }`} aria-hidden="true" />
      </button>
      {/* Rendered whether or not it is open, and hidden with CSS rather than dropped from the
          tree, so the printed briefing kit carries the folded prose instead of a heading with
          nothing under it. */}
      {/* `display: none` cannot be transitioned, so the fold used to snap open. This is a
          grid-template-rows collapse from 0fr to 1fr, which the compositor interpolates — no
          height is measured or animated. Print keeps it open regardless. */}
      <div className="fx-collapse" data-open={open ? "true" : "false"}>
        {/* `inert` while closed. A 0fr grid row clips the content visually but leaves every link
            and control inside it in the tab order, so without this a reader tabbing past a
            collapsed fold would land in prose they cannot see. Print un-collapses the whole thing
            in visual-fx.css, where the rule can be stated once rather than per fold. */}
        <div inert={!open} className={`prose max-w-none ${open ? "pt-4" : ""} print:pt-4`}>
        {children}
        </div>
      </div>
    </div>
  );
}
