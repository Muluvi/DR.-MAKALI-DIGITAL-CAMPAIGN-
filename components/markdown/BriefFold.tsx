"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { useReadingMode, type ReadingMode } from "../../lib/reading-mode";

/**
 * One subsection's remaining prose, behind one control.
 *
 * The mechanism is ProseFold's, deliberately: the body is rendered on the server and passed in,
 * it stays in the DOM whether open or closed, and it is clipped by a grid-row collapse rather
 * than dropped. That is what keeps the printed briefing kit complete, keeps the prose in the
 * page a reader saves, and keeps the rendering cost the same in both modes. `inert` while closed
 * keeps a tabbing reader out of prose they cannot see.
 *
 * What it adds is that the default comes from the reading mode rather than from the component:
 * Brief closes it, Full opens it, and a reader who opens one fold by hand keeps it open when the
 * mode changes around it.
 */
export function BriefFold({
  label,
  words,
  children,
}: {
  /** The subsection this belongs to, e.g. "3.4.2" — used in the control's text. */
  label: string;
  /** How much is behind the control. A reader deciding whether to tap deserves to know. */
  words: number;
  children: React.ReactNode;
}) {
  const { mode } = useReadingMode();

  // The mode sets the default; a manual tap wins until the mode changes again, which is what
  // makes "Full" mean everything — including folds the reader had closed by hand. The override
  // remembers WHICH mode it was made under, so a mode change retires it without an effect
  // reaching in to reset state after the fact.
  const [override, setOverride] = useState<{ mode: ReadingMode; open: boolean } | null>(null);
  const open = override?.mode === mode ? override.open : mode === "full";

  return (
    <div className="not-prose my-4">
      <button
        type="button"
        onClick={() => setOverride({ mode, open: !open })}
        aria-expanded={open}
        className="flex w-full min-h-[48px] cursor-pointer items-center gap-2.5 rounded-xl border border-line/70 bg-card/40 px-4 py-3 text-left text-muted transition-colors hover:border-accent/40 hover:text-ink print:hidden"
      >
        <span className="t-label sm:t-small flex-1 font-semibold">
          {open ? "Hide" : "Read"} the full section
          {label ? <span className="font-normal"> — §{label}</span> : null}
          {!open && words > 0 && (
            <span className="font-normal text-muted"> · {words.toLocaleString("en-KE")} words</span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>

      {/* Rendered whether or not it is open, and clipped rather than dropped, so the printed
          briefing kit carries the folded prose — the print stylesheet un-collapses it. `inert`
          keeps a tabbing reader out of prose they cannot see. */}
      <div className="fx-collapse" data-open={open ? "true" : "false"}>
        <div inert={!open} className={`prose max-w-none ${open ? "pt-4" : ""} print:pt-4`}>
          {children}
        </div>
      </div>
    </div>
  );
}
