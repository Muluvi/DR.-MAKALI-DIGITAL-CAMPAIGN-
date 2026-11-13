"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { Cell, Column } from "@/lib/story/datasets";

/**
 * One table for every dataset: search, filter by the fields the data actually has, sort by any
 * column, and download the view as CSV. On a phone each row is a card; from tablet width it is a
 * table that scrolls inside its frame. The view lives in this component only.
 */
const show = (v: Cell) => (v === null || v === "" ? "—" : typeof v === "number" ? v.toLocaleString("en-KE", { maximumFractionDigits: 2 }) : v);
const csvCell = (v: Cell) => {
  const s = v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function download(filename: string, columns: Column[], rows: Record<string, Cell>[]) {
  const text = [columns.map((c) => csvCell(c.label)).join(","), ...rows.map((r) => columns.map((c) => csvCell(r[c.key])).join(","))].join("\n") + "\n";
  const url = URL.createObjectURL(new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable({ columns, rows, filename, pageSize = 20 }: { columns: Column[]; rows: Record<string, Cell>[]; filename: string; pageSize?: number }) {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState("");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [limit, setLimit] = useState(pageSize);
  const query = useDeferredValue(q);

  const view = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
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
  }, [rows, columns, query, filters, sort, dir]);

  const filterable = columns.filter((c) => c.values && c.values.length > 1);
  const shown = view.slice(0, limit);
  const toggleSort = (key: string) => {
    if (sort !== key) { setSort(key); setDir("asc"); } else if (dir === "asc") setDir("desc"); else { setSort(""); setDir("asc"); }
  };

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="field min-w-0 flex-1 basis-56">Search<input className="input" type="search" value={q} onChange={(e) => { setQ(e.target.value); setLimit(pageSize); }} /></label>
        <button type="button" className="btn btn-sm no-print" onClick={() => download(filename, columns, view)}>Download CSV</button>
      </div>
      {filterable.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filters">
          {filterable.map((c) => (
            <label key={c.key} className="field" style={{ fontWeight: 500 }}>
              <span className="sr-only">{c.label}</span>
              <select className="input" value={filters[c.key] ?? ""} onChange={(e) => { setFilters((f) => ({ ...f, [c.key]: e.target.value })); setLimit(pageSize); }}>
                <option value="">{c.label}: all</option>
                {c.values!.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
          ))}
        </div>
      )}
      <p className="m-0 small muted" aria-live="polite">
        {view.length === rows.length ? `${rows.length.toLocaleString("en-KE")} rows` : `${view.length.toLocaleString("en-KE")} of ${rows.length.toLocaleString("en-KE")} rows`}
        {sort ? ` · sorted by ${columns.find((c) => c.key === sort)?.label.toLowerCase()}, ${dir === "asc" ? "ascending" : "descending"}` : ""}
      </p>
      {view.length === 0 ? (
        <p className="m-0 muted">Nothing matches.</p>
      ) : (
        <>
          <ul className="grid gap-2 p-0 sm:hidden" style={{ listStyle: "none" }}>
            {shown.map((r, i) => (
              <li key={i} className="panel small">
                <p className="m-0 font-bold">{show(r[columns[0].key])}</p>
                <dl className="m-0 mt-2 grid grid-cols-[minmax(0,40%)_1fr] gap-x-3 gap-y-1">
                  {columns.slice(1).map((c) => (r[c.key] === null || r[c.key] === "" ? null : (
                    <div key={c.key} className="contents"><dt className="muted">{c.label}</dt><dd className={`m-0 min-w-0 break-words ${c.numeric ? "num" : ""}`}>{show(r[c.key])}</dd></div>
                  )))}
                </dl>
              </li>
            ))}
          </ul>
          <div className="table-wrap m-0 hidden sm:block" tabIndex={0} role="region" aria-label="Dataset" style={{ maxHeight: "40rem" }}>
            <table>
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} scope="col" aria-sort={sort === c.key ? (dir === "asc" ? "ascending" : "descending") : undefined}>
                      <button type="button" className="font-bold" onClick={() => toggleSort(c.key)}>{c.label}{sort === c.key ? (dir === "asc" ? " ▲" : " ▼") : ""}</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((r, i) => <tr key={i}>{columns.map((c) => <td key={c.key} className={c.numeric ? "num" : undefined}>{show(r[c.key])}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
          {view.length > shown.length && <button type="button" className="btn justify-self-center" onClick={() => setLimit((n) => n + pageSize * 2)}>Show more ({(view.length - shown.length).toLocaleString("en-KE")} left)</button>}
        </>
      )}
    </div>
  );
}
