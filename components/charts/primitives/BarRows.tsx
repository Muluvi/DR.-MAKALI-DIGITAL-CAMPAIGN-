"use client";

import { useId, useState } from "react";
import { useInView } from "../../../hooks/use-in-view";
import { InspectPanel, MarkList } from "./InspectPanel";
import type { Mark } from "./types";

/**
 * Horizontal bars with the category label in its own column.
 *
 * CSS grid and divs rather than SVG, and that is the point: the labels stay real text at a real
 * font size, so they reflow at 320px, stay selectable, and are found by the browser's in-page
 * search. An SVG chart scaled by viewBox shrinks its type along with everything else, which on
 * the device this document is written for is how a chart becomes a picture of a chart.
 *
 * Motion: the bar grows from its own baseline via transform, never width — `MOTION-SYSTEM.md`
 * rule 1. Under reduced motion it renders at its final proportion rather than at zero, because
 * a bar caught at zero is showing false data (rule 3).
 */
export function BarRows({
  marks,
  max,
  unit = "",
  onSelect,
  selectedId,
  listCaption,
  emptyHint,
}: {
  marks: Mark[];
  /** Upper bound of the value axis. Defaults to the largest mark. */
  max?: number;
  unit?: string;
  onSelect?: (id: string) => void;
  selectedId?: string;
  listCaption?: string;
  emptyHint?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.25 });
  const [picked, setPicked] = useState<string | null>(null);
  const uid = useId();

  const ceiling = max ?? Math.max(...marks.map((m) => m.value), 1);
  const active = selectedId ?? picked;
  const activeMark = marks.find((m) => m.id === active) ?? null;

  const choose = (id: string) => {
    setPicked(id);
    onSelect?.(id);
  };

  return (
    <div ref={ref}>
      <div className="grid gap-1.5">
        {marks.map((m, i) => {
          const pct = Math.max(0, Math.min(100, (m.value / ceiling) * 100));
          const isActive = active === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => choose(m.id)}
              onFocus={() => choose(m.id)}
              aria-pressed={isActive}
              aria-label={`${m.label}: ${m.display ?? m.value.toLocaleString()}${unit}`}
              className={`fx-focus grid grid-cols-[minmax(4.5rem,9rem)_1fr] items-center gap-2 rounded-lg px-1 py-0.5 text-left transition-colors ${
                isActive ? "bg-accent/[0.06]" : "hover:bg-line/40"
              }`}
            >
              <span className="t-micro font-bold text-ink leading-tight text-pretty">{m.label}</span>
              <span className="flex items-center gap-2 min-w-0">
                <span className="relative h-3 flex-1 rounded-full bg-line/50 overflow-hidden">
                  {/* Final width is the default; `fx-bar-h` only adds the growth animation,
                      and only once the row is on screen. With JavaScript off the class never
                      arrives and the bar is simply at its true proportion. */}
                  <span
                    className={`absolute inset-y-0 left-0 rounded-full ${inView ? "fx-bar-h" : ""}`}
                    style={{
                      width: `${pct}%`,
                      background: m.color ?? "var(--color-accent-solid)",
                      opacity: active && !isActive ? 0.45 : 1,
                      transition: "opacity 180ms",
                      "--fx-delay": `${i * 45}ms`,
                    } as React.CSSProperties}
                  />
                </span>
                <span className="t-micro font-bold text-muted tabular-nums shrink-0">
                  {m.display ?? m.value.toLocaleString()}
                  {unit}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <InspectPanel mark={activeMark} empty={emptyHint} />
      <MarkList marks={marks} caption={listCaption} />
      <span className="sr-only" id={`${uid}-hint`}>
        Each bar is a button. Select one for the detail behind it.
      </span>
    </div>
  );
}
