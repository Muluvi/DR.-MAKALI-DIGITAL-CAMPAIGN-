"use client";

import { useRef, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { DataTable } from "./DataTable";
import { RecordForm } from "./RecordForm";
import type { Cell, Column } from "@/lib/platform/catalogue";
import type { Options } from "@/lib/platform/validate";

export function WorkspaceCollection({ collectionId, label, columns, rows, data, options, canEdit, editable, ns = "", startAdding = false }: {
  collectionId: string; label: string; columns: Column[]; rows: Record<string, Cell>[]; data: Record<string, Record<string, unknown>>; options: Options; canEdit: boolean; editable: boolean;
  /** A prefix for the table's address-bar keys, so several tables can share one page (the story). */
  ns?: string;
  /** Opens with the new-record form showing (the story's Add button). */
  startAdding?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<string | "new" | null>(startAdding && canEdit ? "new" : null);
  const [notice, setNotice] = useState<string | null>(null);
  const list = columns.filter((c) => c.key !== "_id");
  return (
    <div ref={root}>
      {notice && editing === null && <p role="status" className="mb-4 rounded-xl border border-line bg-card p-3 text-[0.9rem] text-ink print:hidden">{notice}</p>}
      {canEdit && editing === null && (
        <button type="button" className="plat-btn plat-btn-solid mb-4 print:hidden" onClick={() => { setNotice(null); setEditing("new"); }}><Plus size={16} /> Add to {label.toLowerCase()}</button>
      )}
      {canEdit && editing !== null && (
        <section className="plat-card mb-6 p-4 sm:p-6 print:hidden" aria-label={editing === "new" ? "New record" : "Edit record"}>
          <h2 className="mb-4 font-serif text-xl">{editing === "new" ? `New: ${label}` : `Edit: ${label}`}</h2>
          <RecordForm key={editing} collectionId={collectionId} options={options} initial={editing === "new" ? undefined : data[editing]} recordId={editing === "new" ? undefined : editing} onDone={(m) => { setEditing(null); setNotice(m ?? null); }} />
        </section>
      )}
      {!editable && <p className="mb-4 rounded-xl border border-line bg-card p-3 text-[0.85rem] text-muted">The platform&apos;s database is not connected yet, so nothing has been entered here. Everything in the data pack is still on the site.</p>}
      <DataTable
        columns={list}
        rows={rows}
        ns={ns}
        filename={`${collectionId}.csv`}
        empty={canEdit ? "Nothing entered yet. Add the first one." : "Nothing entered yet."}
        rowAction={canEdit ? (r) => <button type="button" className="plat-btn plat-btn-sm" onClick={() => { setEditing(String(r._id)); root.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}><Pencil size={14} /> Edit</button> : undefined}
      />
    </div>
  );
}
