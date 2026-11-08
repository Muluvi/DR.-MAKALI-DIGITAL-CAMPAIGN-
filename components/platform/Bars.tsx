/**
 * A horizontal bar chart drawn in HTML, so it reads at phone width, prints cleanly and needs no
 * client script. Values are printed beside each bar: the chart is never the only place a number is.
 */
export interface Bar {
  label: string;
  value: number;
  /** A second value drawn as a marker on the same row (a target). */
  mark?: number | null;
  note?: string;
}

export function Bars({ title, caption, bars, unit = "", empty = "Nothing entered yet.", source }: { title: string; caption?: string; bars: Bar[]; unit?: string; empty?: string; source?: string }) {
  const max = Math.max(1, ...bars.map((b) => Math.max(b.value, b.mark ?? 0)));
  const fmt = (n: number) => `${n.toLocaleString("en-KE", { maximumFractionDigits: 1 })}${unit}`;
  return (
    <figure className="pf-card break-inside-avoid p-4 sm:p-5">
      <figcaption>
        <p className="font-serif text-[1.1rem] leading-snug text-ink">{title}</p>
        {caption && <p className="mt-1 text-[0.8rem] text-muted">{caption}</p>}
      </figcaption>
      {bars.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-line p-4 text-center text-[0.85rem] text-muted">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {bars.map((b) => (
            <li key={b.label}>
              <div className="flex items-baseline justify-between gap-3 text-[0.82rem]">
                <span className="min-w-0 truncate text-ink">{b.label}</span>
                <span className="flex-none tabular-nums text-ink">{fmt(b.value)}{b.mark !== undefined && b.mark !== null ? <span className="text-muted"> / {fmt(b.mark)}</span> : null}</span>
              </div>
              <div className="relative mt-1 h-2.5 rounded-full bg-line/50">
                <div className="h-full rounded-full bg-accent-solid" style={{ width: `${(b.value / max) * 100}%` }} />
                {b.mark !== undefined && b.mark !== null && <span className="absolute -top-1 h-4.5 w-0.5 rounded bg-ink" style={{ left: `calc(${(b.mark / max) * 100}% - 1px)` }} aria-hidden />}
              </div>
              {b.note && <p className="mt-0.5 text-[0.72rem] text-muted">{b.note}</p>}
            </li>
          ))}
        </ul>
      )}
      {source && <p className="mt-3 text-[0.72rem] text-muted">{source}</p>}
    </figure>
  );
}
