"use client";

import { useEffect, useState } from "react";
import type { Dataset, DatasetMeta } from "@/lib/story/datasets";
import { DataTable } from "./DataTable";
import { ToolShell } from "./ToolShell";

const GROUPS: DatasetMeta["group"][] = ["Figures", "Electorate", "County records", "Analysis", "Strategy lists"];

/** Every dataset behind the site, fetched one at a time as static JSON (app/datasets/[id]/route.ts). */
function Explorer() {
  const [index, setIndex] = useState<DatasetMeta[]>([]);
  const [id, setId] = useState("figures");
  const [loaded, setLoaded] = useState<Dataset | null>(null);
  const data = loaded?.id === id ? loaded : null;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/datasets/index.json").then((r) => r.json()).then(setIndex).catch(() => setFailed(true));
  }, []);
  useEffect(() => {
    let live = true;
    fetch(`/datasets/${id}.json`).then((r) => r.json()).then((d: Dataset) => live && setLoaded(d)).catch(() => live && setFailed(true));
    return () => { live = false; };
  }, [id]);

  return (
    <div className="grid gap-4">
      <label className="field" style={{ maxWidth: "36rem" }}>Dataset
        <select className="input" value={id} onChange={(e) => setId(e.target.value)}>
          {GROUPS.map((g) => (
            <optgroup key={g} label={g}>
              {index.filter((d) => d.group === g).map((d) => <option key={d.id} value={d.id}>{d.label} ({d.count.toLocaleString("en-KE")})</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      {failed && <p className="placeholder" role="status">The dataset did not load. Check the connection and try again.</p>}
      {data ? (
        <>
          <p className="m-0 muted" style={{ maxWidth: "46rem" }}>{data.description}</p>
          <DataTable key={data.id} columns={data.columns} rows={data.rows} filename={`kitui-${data.id}.csv`} />
        </>
      ) : !failed ? <p className="m-0 muted" role="status">Loading the dataset…</p> : null}
    </div>
  );
}

export default function DataExplorer() {
  return (
    <ToolShell kicker="Data" title="Data explorer" question="Pick a dataset, then search, filter, sort and download it." source="Sources are named in each dataset's own columns.">
      <Explorer />
    </ToolShell>
  );
}
