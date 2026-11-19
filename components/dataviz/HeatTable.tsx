"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

export type HeatRow = { id: string; name: string; constituency: string; pool: boolean; values: Record<string, number> };

const COLUMNS = [
  { key: "voters", label: "Voters", dp: 0 },
  { key: "stations", label: "Stations", dp: 0 },
  { key: "perStation", label: "Voters per station", dp: 0 },
  { key: "density", label: "People per km²", dp: 0 },
  { key: "projects", label: "County projects", dp: 0 },
  { key: "per1k", label: "Project KSh per 1,000 voters", dp: 0 },
] as const;

type Key = (typeof COLUMNS)[number]["key"];

/**
 * The heat table's interactive part: sort by any column. Each cell is shaded by which fifth of the
 * 40 wards it falls in for its own column, and also carries its value, so the shade is a guide to
 * the number, never a replacement for it. Server-rendered sorted by voters.
 */
export function HeatTable({ rows }: { rows: HeatRow[] }) {
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: "voters", dir: -1 });

  const fifths = useMemo(() => {
    const out: Record<string, (v: number) => number> = {};
    for (const c of COLUMNS) {
      const sorted = rows.map((r) => r.values[c.key]).sort((a, b) => a - b);
      out[c.key] = (v: number) => Math.min(4, Math.floor((sorted.filter((s) => s < v).length / rows.length) * 5));
    }
    return out;
  }, [rows]);

  const sorted = useMemo(() => [...rows].sort((a, b) => (a.values[sort.key] - b.values[sort.key]) * sort.dir), [rows, sort]);

  return (
    <div className="ht-wrap" role="region" aria-label="Ward heat table" tabIndex={0}>
      <table className="ht">
        <thead>
          <tr>
            <th scope="col" className="ht__ward">Ward</th>
            {COLUMNS.map((c) => {
              const on = sort.key === c.key;
              return (
                <th key={c.key} scope="col" aria-sort={on ? (sort.dir === -1 ? "descending" : "ascending") : "none"}>
                  <button type="button" className="ht__sort" onClick={() => setSort({ key: c.key, dir: on ? (sort.dir === -1 ? 1 : -1) : -1 })}>
                    {c.label}
                    {on ? sort.dir === -1 ? <ArrowDown size={14} aria-hidden="true" /> : <ArrowUp size={14} aria-hidden="true" /> : null}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id} data-pool={r.pool ? "true" : "false"}>
              <th scope="row" className="ht__ward">
                <span className="ht__name">{r.name}</span>
                <span className="ht__con">{r.constituency}</span>
              </th>
              {COLUMNS.map((c) => (
                <td key={c.key} data-q={fifths[c.key](r.values[c.key])}>
                  {r.values[c.key].toLocaleString("en-KE", { maximumFractionDigits: c.dp })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
