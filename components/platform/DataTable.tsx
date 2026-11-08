"use client";

/**
 * One table for every dataset on the platform: search, filter by the fields the data actually has,
 * sort by any column, and keep all of it in the address bar, so a filtered view is a link that
 * opens exactly the same view. The CSV is the filtered, sorted view, row for row.
 *
 * On a phone each row is a card; from tablet width it is a table that scrolls inside its frame.
 */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownUp, Check, Download, Link2, Printer, Search, X } from "lucide-react";
import type { Cell, Column } from "@/lib/platform/catalogue";

export interface DataTableProps {
  columns: Column[];
  rows: Record<string, Cell>[];
  /** Prefix for this table's URL parameters, when a page holds more than one. */
  ns?: string;
  filename: string;
  /** A cell renderer override, by column key. */
  link?: Record<string, (row: Record<string, Cell>) => string | null>;
  /** Extra content per row (an edit button), rendered after the cells. */
  rowAction?: (row: Record<string, Cell>, index: number) => React.ReactNode;
  pageSize?: number;
  empty?: string;
}

const fmt = (v: Cell) => (v === null || v === "" ? "—" : typeof v === "number" ? v.toLocaleString("en-KE", { maximumFractionDigits: 2 }) : v);

export const csvCell = (v: Cell) => {
  const s = v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(columns: Column[], rows: Record<string, Cell>[]): string {
  return [columns.map((c) => csvCell(c.label)).join(","), ...rows.map((r) => columns.map((c) => csvCell(r[c.key])).join(","))].join("\n") + "\n";
}

export function downloadCsv(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function DataTable({ columns, rows, ns = "", filename, link = {}, rowAction, pageSize = 50, empty = "Nothing matches." }: DataTableProps) {
  const params = useSearchParams();
  const p = (k: string) => `${ns}${k}`;
  const [q, setQ] = useState(() => params.get(p("q")) ?? "");
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const c of columns) {
      const v = params.get(p(`f.${c.key}`));
      if (v) out[c.key] = v;
    }
    return out;
  });
  const [sort, setSort] = useState(() => params.get(p("sort")) ?? "");
  const [dir, setDir] = useState<"asc" | "desc">(() => (params.get(p("dir")) === "desc" ? "desc" : "asc"));
  const [limit, setLimit] = useState(() => Number(params.get(p("n"))) || pageSize);
  const [copied, setCopied] = useState(false);

  // The view lives in the URL. replaceState keeps Next's useSearchParams in step without a reload.
  useEffect(() => {
    const u = new URL(window.location.href);
    for (const k of [...u.searchParams.keys()]) if (k.startsWith(ns) && (k === p("q") || k === p("sort") || k === p("dir") || k === p("n") || k.startsWith(p("f.")))) u.searchParams.delete(k);
    if (q) u.searchParams.set(p("q"), q);
    for (const [k, v] of Object.entries(filters)) if (v) u.searchParams.set(p(`f.${k}`), v);
    if (sort) { u.searchParams.set(p("sort"), sort); if (dir === "desc") u.searchParams.set(p("dir"), "desc"); }
    if (limit !== pageSize) u.searchParams.set(p("n"), String(limit));
    if (u.href !== window.location.href) window.history.replaceState(null, "", u.href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, filters, sort, dir, limit]);

  const view = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    let out = rows.filter((r) => {
      for (const [k, v] of Object.entries(filters)) if (v && String(r[k] ?? "") !== v) return false;
      if (!terms.length) return true;
      const hay = columns.map((c) => String(r[c.key] ?? "")).join(" ").toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    if (sort) {
      const col = columns.find((c) => c.key === sort);
      out = [...out].sort((a, b) => {
        const x = a[sort], y = b[sort];
        if (x === null || x === "") return 1;
        if (y === null || y === "") return -1;
        const d = col?.numeric ? Number(x) - Number(y) : String(x).localeCompare(String(y), "en", { numeric: true });
        return dir === "asc" ? d : -d;
      });
    }
    return out;
  }, [rows, columns, q, filters, sort, dir]);

  const filterable = columns.filter((c) => c.values && c.values.length > 1);
  const shown = view.slice(0, limit);
  const active = Object.values(filters).filter(Boolean).length + (q ? 1 : 0);
  const primary = columns.slice(0, 1);
  const rest = columns.slice(1);

  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* the address bar still holds the link */ }
  };
  const toggleSort = (key: string) => {
    if (sort !== key) { setSort(key); setDir("asc"); } else if (dir === "asc") setDir("desc"); else { setSort(""); setDir("asc"); }
  };

  const cell = (c: Column, r: Record<string, Cell>) => {
    const href = link[c.key]?.(r);
    const v = fmt(r[c.key]);
    return href ? <a href={href} className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">{v}</a> : v;
  };

  return (
    <div className="platform-table">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <label className="relative min-w-0 flex-1 basis-56">
          <span className="sr-only">Search</span>
          <Search aria-hidden size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(pageSize); }} placeholder="Search" type="search" className="h-11 w-full rounded-full border border-line bg-card pl-9 pr-4 text-[0.95rem] text-ink outline-none focus:border-accent" />
        </label>
        <button type="button" onClick={copy} className="pf-btn" aria-label="Copy a link to this view">{copied ? <Check size={15} /> : <Link2 size={15} />}<span>{copied ? "Copied" : "Link"}</span></button>
        <button type="button" onClick={() => downloadCsv(filename, toCsv(columns, view))} className="pf-btn"><Download size={15} /><span>CSV</span></button>
        <button type="button" onClick={() => window.print()} className="pf-btn"><Printer size={15} /><span>PDF</span></button>
      </div>

      {filterable.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 print:hidden" role="group" aria-label="Filters">
          {filterable.map((c) => (
            <label key={c.key} className={`pf-filter ${filters[c.key] ? "is-on" : ""}`}>
              <span className="sr-only">{c.label}</span>
              <select value={filters[c.key] ?? ""} onChange={(e) => { setFilters((f) => ({ ...f, [c.key]: e.target.value })); setLimit(pageSize); }}>
                <option value="">{c.label}: all</option>
                {c.values!.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
          ))}
          {active > 0 && (
            <button type="button" className="pf-filter" onClick={() => { setFilters({}); setQ(""); }}><X size={14} aria-hidden /> Clear</button>
          )}
        </div>
      )}

      <p className="mt-3 text-[0.8rem] text-muted" aria-live="polite">
        {view.length === rows.length ? `${rows.length.toLocaleString("en-KE")} rows` : `${view.length.toLocaleString("en-KE")} of ${rows.length.toLocaleString("en-KE")} rows`}
        {sort ? ` · sorted by ${columns.find((c) => c.key === sort)?.label.toLowerCase()} ${dir === "asc" ? "ascending" : "descending"}` : ""}
      </p>

      {view.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-center text-muted">{empty}</p>
      ) : (
        <>
          {/* Phone: cards. */}
          <ul className="mt-3 space-y-3 sm:hidden print:hidden">
            {shown.map((r, i) => (
              <li key={i} className="rounded-2xl border border-line bg-card p-4">
                {primary.map((c) => <p key={c.key} className="font-semibold leading-snug text-ink">{cell(c, r)}</p>)}
                <dl className="mt-2 grid grid-cols-[minmax(0,40%)_1fr] gap-x-3 gap-y-1 text-[0.85rem]">
                  {rest.map((c) => r[c.key] === null || r[c.key] === "" ? null : (
                    <div key={c.key} className="contents"><dt className="text-muted">{c.label}</dt><dd className={`min-w-0 break-words text-ink ${c.numeric ? "tabular-nums" : ""}`}>{cell(c, r)}</dd></div>
                  ))}
                </dl>
                {rowAction && <div className="mt-3">{rowAction(r, rows.indexOf(r))}</div>}
              </li>
            ))}
          </ul>
          {/* Tablet and up, and print: a table. */}
          <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-line bg-card sm:block print:block">
            <table className="w-full border-collapse text-left text-[0.85rem]">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} scope="col" className="sticky top-0 whitespace-nowrap border-b border-line bg-card px-3 py-2 font-semibold text-ink">
                      <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-accent print:pointer-events-none">
                        {c.label}<ArrowDownUp aria-hidden size={12} className={`${sort === c.key ? "text-accent" : "text-muted/60"} print:hidden`} />
                      </button>
                    </th>
                  ))}
                  {rowAction && <th className="border-b border-line bg-card px-3 py-2 print:hidden"><span className="sr-only">Actions</span></th>}
                </tr>
              </thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={i} className="align-top odd:bg-paper/40">
                    {columns.map((c) => <td key={c.key} className={`max-w-[28rem] border-b border-line/60 px-3 py-2 text-ink ${c.numeric ? "whitespace-nowrap text-right tabular-nums" : ""}`}>{cell(c, r)}</td>)}
                    {rowAction && <td className="border-b border-line/60 px-3 py-2 print:hidden">{rowAction(r, rows.indexOf(r))}</td>}
                  </tr>
                ))}
                {/* Printing a view prints all of it, not only the rows on screen. */}
                {view.slice(shown.length).map((r, i) => (
                  <tr key={`p${i}`} className="hidden align-top print:table-row">
                    {columns.map((c) => <td key={c.key} className="border-b border-line/60 px-3 py-2">{fmt(r[c.key])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {view.length > shown.length && (
            <div className="mt-4 flex justify-center print:hidden">
              <button type="button" className="pf-btn" onClick={() => setLimit(view.length)}>Show all {view.length.toLocaleString("en-KE")}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
