import type { Cell, Column } from "@/lib/platform/catalogue";
import { columnsOf } from "@/lib/platform/catalogue";
import type { Collection } from "@/lib/platform/collections";
import type { StoredRecord } from "@/lib/platform/store/types";

/** Working records as table rows: the collection's fields, then who changed it and when. */
export function recordRows(c: Collection, records: StoredRecord[]): { columns: Column[]; rows: Record<string, Cell>[] } {
  const rows = records.map((r) => {
    const row: Record<string, Cell> = { _id: r.id };
    for (const f of c.fields) {
      const v = r.data[f.key];
      row[f.key] = v === null || v === undefined ? null : Array.isArray(v) ? v.join(", ") : typeof v === "boolean" ? (v ? "Yes" : "No") : (v as Cell);
    }
    row.updated = r.updatedAt.slice(0, 10);
    row.updatedBy = r.updatedBy;
    return row;
  });
  const labels = Object.fromEntries(c.fields.map((f) => [f.key, f.label])) as Record<string, string>;
  const order = [...c.fields.map((f) => f.key), "updated", "updatedBy"];
  const cols = columnsOf(rows.length ? rows : [Object.fromEntries(order.map((k) => [k, null]))], { ...labels, updated: "Updated", updatedBy: "By" }, order);
  // Fixed choices are always filters, even before there are enough rows to show them.
  return {
    rows,
    columns: cols.map((col) => {
      const f = c.fields.find((x) => x.key === col.key);
      return f?.options && f.type === "select" ? { ...col, numeric: false, values: [...f.options] } : col;
    }),
  };
}
