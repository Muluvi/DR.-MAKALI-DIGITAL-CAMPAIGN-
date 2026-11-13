"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "./DataTable";
import type { Dataset, DatasetMeta } from "@/lib/platform/catalogue";

const GROUP_ORDER: DatasetMeta["group"][] = ["Figures", "Electorate", "County records", "Analysis", "Strategy lists", "Team records"];

export function Explorer({ datasets, current }: { datasets: DatasetMeta[]; current: Dataset }) {
  const router = useRouter();
  const link: Record<string, (r: Record<string, string | number | null>) => string | null> =
    current.id === "figures" ? { id: (r) => `/#data-${r.id}` } : current.id === "wards" ? { figure: (r) => `/explore?ds=figures&q=${r.figure}` } : {};
  return (
    <div>
      <label className="block max-w-xl">
        <span className="plat-label">Dataset</span>
        <select className="plat-input" value={current.id} onChange={(e) => router.push(`/explore?ds=${e.target.value}`)}>
          {GROUP_ORDER.map((g) => (
            <optgroup key={g} label={g}>
              {datasets.filter((d) => d.group === g).map((d) => <option key={d.id} value={d.id}>{d.label} ({d.count})</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <p className="mt-2 max-w-2xl text-[0.88rem] text-muted">{current.description}</p>
      <div className="mt-5">
        <DataTable key={current.id} columns={current.columns} rows={current.rows} filename={`${current.id}.csv`} link={link} />
      </div>
    </div>
  );
}
