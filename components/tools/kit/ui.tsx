"use client";

import type { ReactNode } from "react";

/** Shared pieces for the planning tools: inputs, numbers, tables and bars in the platform's style. */
export const n0 = (v: number) => Math.round(v).toLocaleString("en-KE");
export const n1 = (v: number) => v.toLocaleString("en-KE", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
export const pct = (v: number, d = 1) => `${v.toLocaleString("en-KE", { maximumFractionDigits: d, minimumFractionDigits: d })}%`;
export const ksh = (v: number) => (Math.abs(v) >= 1e9 ? `KSh ${(v / 1e9).toLocaleString("en-KE", { maximumFractionDigits: 2 })}bn` : Math.abs(v) >= 1e6 ? `KSh ${(v / 1e6).toLocaleString("en-KE", { maximumFractionDigits: 1 })}m` : `KSh ${n0(v)}`);

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`plat-card p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function Slider({ label, value, onChange, min, max, step = 1, suffix = "", hint }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; suffix?: string; hint?: string }) {
  return (
    <label className="plat-label block">
      <span className="flex items-baseline justify-between gap-3"><span>{label}</span><strong className="font-mono text-ink tabular-nums">{Number.isInteger(step) ? n0(value) : n1(value)}{suffix}</strong></span>
      <input className="mt-2 w-full accent-[var(--accent-solid)]" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {hint && <span className="plat-hint mt-1 block">{hint}</span>}
    </label>
  );
}

export function NumberField({ label, value, onChange, min, step = 1, hint }: { label: string; value: number; onChange: (v: number) => void; min?: number; step?: number; hint?: string }) {
  return (
    <label className="plat-label block">{label}
      <input className="plat-input mt-1 block w-full" type="number" inputMode="decimal" min={min} step={step} value={Number.isFinite(value) ? value : ""} onChange={(e) => onChange(Number(e.target.value))} />
      {hint && <span className="plat-hint mt-1 block">{hint}</span>}
    </label>
  );
}

export function Select<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <label className="plat-label block">{label}
      <select className="plat-input mt-1 block w-full" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function Stat({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: "good" | "warn" }) {
  return (
    <div className="plat-card p-3">
      <p className="text-[0.75rem] uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className={`mt-1 font-mono text-[1.45rem] leading-tight tabular-nums ${tone === "good" ? "text-accent" : tone === "warn" ? "text-gold" : "text-ink"}`}>{value}</p>
      {note && <p className="mt-1 text-[0.78rem] leading-snug text-muted">{note}</p>}
    </div>
  );
}

export function Stats({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{children}</div>;
}

/** A horizontal bar, 0 to max, with an optional mark. */
export function Bar({ value, max, mark, tone = "accent" }: { value: number; max: number; mark?: number; tone?: "accent" | "gold" | "muted" }) {
  const w = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const m = mark !== undefined && max > 0 ? Math.max(0, Math.min(100, (mark / max) * 100)) : null;
  const fill = tone === "gold" ? "bg-gold-solid" : tone === "muted" ? "bg-line" : "bg-accent-solid";
  return (
    <span className="relative block h-2.5 w-full overflow-hidden rounded-full bg-paper ring-1 ring-line" aria-hidden="true">
      <span className={`absolute inset-y-0 left-0 rounded-full ${fill}`} style={{ width: `${w}%` }} />
      {m !== null && <span className="absolute inset-y-[-2px] w-0.5 bg-ink" style={{ left: `${m}%` }} />}
    </span>
  );
}

export type Col<R> = { key: string; label: string; num?: boolean; render: (r: R) => ReactNode };
export function Table<R>({ rows, cols, caption, rowKey }: { rows: R[]; cols: Col<R>[]; caption?: string; rowKey: (r: R, i: number) => string }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[30rem] text-left text-[0.86rem]">
        {caption && <caption className="mb-2 text-left text-[0.8rem] text-muted">{caption}</caption>}
        <thead className="text-muted"><tr>{cols.map((c) => <th key={c.key} scope="col" className={`py-2 pr-3 font-semibold ${c.num ? "text-right" : ""}`}>{c.label}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={rowKey(r, i)} className="border-t border-line text-ink">{cols.map((c) => <td key={c.key} className={`py-2 pr-3 align-top ${c.num ? "text-right font-mono tabular-nums" : ""}`}>{c.render(r)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="plat-hint mt-3" role="note">{children}</p>;
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "accent" | "gold" }) {
  const c = tone === "accent" ? "bg-accent-solid text-on-accent" : tone === "gold" ? "bg-gold-solid text-on-gold" : "bg-paper text-muted ring-1 ring-line";
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${c}`}>{children}</span>;
}

export const tierText = (tier: string | number | null) => (tier === null || tier === undefined ? "target" : `Tier ${String(tier).replace(/^T/, "")}`);
