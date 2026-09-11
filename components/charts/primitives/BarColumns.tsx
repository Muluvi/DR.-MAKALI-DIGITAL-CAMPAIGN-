"use client";

import { useState } from "react";
import { useInView } from "../../../hooks/use-in-view";
import { InspectPanel, MarkList } from "./InspectPanel";
import type { Mark } from "./types";

/**
 * Vertical columns, with a value axis on the left and category labels beneath.
 *
 * Same reasoning as BarRows: flex and divs, so the axis ticks and category labels are real text
 * that stays legible at 320px. The columns grow from the baseline, which is the honest origin for
 * a magnitude — zero — and the direction `MOTION-SYSTEM.md` rule 2 requires.
 */
export function BarColumns({
  marks,
  max,
  ticks,
  formatTick = (v) => v.toLocaleString(),
  abbreviate,
  height = 180,
  onSelect,
  selectedId,
  listCaption,
  emptyHint,
  /** A horizontal rule across the plot — a target, a threshold, a mean. */
  reference,
}: {
  marks: Mark[];
  max?: number;
  ticks?: number[];
  formatTick?: (v: number) => string;
  abbreviate?: (label: string) => string;
  height?: number;
  onSelect?: (id: string) => void;
  selectedId?: string;
  listCaption?: string;
  emptyHint?: string;
  reference?: { value: number; label: string; color?: string };
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.25 });
  const [picked, setPicked] = useState<string | null>(null);

  const ceiling = max ?? Math.max(...marks.map((m) => m.value), reference?.value ?? 0, 1);
  const axis = ticks ?? [0, ceiling / 2, ceiling];
  const active = selectedId ?? picked;
  const activeMark = marks.find((m) => m.id === active) ?? null;

  const choose = (id: string) => {
    setPicked(id);
    onSelect?.(id);
  };

  return (
    <div ref={ref}>
      <div className="flex gap-2">
        {/* Value axis. Rendered as text, not as SVG type, so it does not shrink with the plot. */}
        <div
          className="flex flex-col-reverse justify-between shrink-0 t-micro text-muted font-semibold tabular-nums"
          style={{ height }}
          aria-hidden="true"
        >
          {axis.map((t) => (
            <span key={t} className="leading-none">{formatTick(t)}</span>
          ))}
        </div>

        <div className="relative flex-1 min-w-0">
          {/* Gridlines, one per axis tick. */}
          <div className="absolute inset-0 flex flex-col-reverse justify-between pointer-events-none" aria-hidden="true">
            {axis.map((t) => (
              <span key={t} className="block border-t border-line/50" />
            ))}
          </div>

          {reference ? (
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed pointer-events-none z-10"
              style={{
                bottom: `${(reference.value / ceiling) * 100}%`,
                borderColor: reference.color ?? "var(--color-danger)",
              }}
              aria-hidden="true"
            >
              <span
                className="absolute -top-4 left-0 t-micro font-extrabold"
                style={{ color: reference.color ?? "var(--color-danger)" }}
              >
                {reference.label}
              </span>
            </div>
          ) : null}

          <div className="relative flex items-end gap-1" style={{ height }}>
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
                  aria-label={`${m.label}: ${m.display ?? m.value.toLocaleString()}`}
                  className="fx-focus group flex-1 min-w-0 h-full flex items-end"
                >
                  {/* Final height is the default; see the note in BarRows. */}
                  <span
                    className={`w-full rounded-t ${inView ? "fx-bar-v" : ""}`}
                    style={{
                      height: `${pct}%`,
                      background: m.color ?? "var(--color-accent-solid)",
                      opacity: active && !isActive ? 0.4 : 1,
                      transition: "opacity 180ms",
                      "--fx-delay": `${i * 40}ms`,
                    } as React.CSSProperties}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category axis, aligned to the columns. */}
      <div className="flex gap-1 mt-1 pl-[calc(2.5rem+0.5rem)]" aria-hidden="true">
        {marks.map((m) => (
          <span
            key={m.id}
            className="flex-1 min-w-0 t-micro font-bold text-muted text-center truncate"
            title={m.label}
          >
            {abbreviate ? abbreviate(m.label) : m.label}
          </span>
        ))}
      </div>

      <InspectPanel mark={activeMark} empty={emptyHint} />
      <MarkList marks={marks} caption={listCaption} />
    </div>
  );
}
