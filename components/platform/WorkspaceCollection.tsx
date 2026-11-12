import { DataTable } from "./DataTable";
import type { Cell, Column } from "@/lib/platform/catalogue";

/** One workspace collection, read-only: the team's records as a sortable, downloadable table. */
export function WorkspaceCollection({ collectionId, columns, rows, connected }: {
  collectionId: string; columns: Column[]; rows: Record<string, Cell>[]; connected: boolean;
}) {
  const list = columns.filter((c) => c.key !== "_id");
  return (
    <div>
      {!connected && <p className="mb-4 rounded-xl border border-line bg-card p-3 text-[0.85rem] text-muted">The platform&apos;s database is not connected yet, so nothing has been entered here. Everything in the data pack is still on the site.</p>}
      <DataTable columns={list} rows={rows} filename={`${collectionId}.csv`} empty="Nothing entered yet." />
    </div>
  );
}
