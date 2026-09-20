"use client";

import { useReadingMode } from "../lib/reading-mode";

/**
 * Brief or Full, as a segmented control.
 *
 * It is a pair of real radio inputs rather than two buttons with `aria-pressed`, because that is
 * what this is: one choice with two mutually exclusive answers. A radio group gets arrow-key
 * navigation, a single tab stop and the right announcement from a screen reader for free, and
 * none of that has to be rebuilt by hand.
 *
 * It is `print:hidden` — a printed page has no mode, and the print stylesheet expands everything.
 */
export function ReadingModeToggle({ briefMinutes, fullMinutes }: { briefMinutes: number; fullMinutes: number }) {
  const { mode, setMode } = useReadingMode();

  return (
    <div className="not-prose inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 print:hidden">
      <fieldset className="inline-flex rounded-xl border border-line bg-paper/80 p-0.5">
        <legend className="sr-only">How much of each section to show</legend>
        {(
          [
            ["brief", "Brief", briefMinutes],
            ["full", "Full", fullMinutes],
          ] as const
        ).map(([value, label, minutes]) => (
          <label
            key={value}
            className={`t-micro flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-lg px-3 font-bold transition-colors ${
              mode === value
                ? "bg-accent-solid text-on-accent shadow-xs"
                : "text-muted hover:text-ink"
            }`}
          >
            <input
              type="radio"
              name="reading-mode"
              value={value}
              checked={mode === value}
              onChange={() => setMode(value)}
              className="sr-only"
            />
            <span>{label}</span>
            <span className="font-normal opacity-80">{minutes} min</span>
          </label>
        ))}
      </fieldset>

      <p className="t-micro leading-snug text-muted">
        {mode === "brief"
          ? "Each section opens on its lead, its figures and its callouts. Nothing is removed — the rest is one tap away."
          : "Every section in full, in the document's own order."}
      </p>
    </div>
  );
}
