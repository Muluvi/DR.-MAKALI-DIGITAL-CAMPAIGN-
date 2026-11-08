"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { DataTable } from "./DataTable";
import { RecordForm } from "./RecordForm";
import type { Cell, Column } from "@/lib/platform/catalogue";
import type { Options } from "@/lib/platform/validate";

export function WorkspaceCollection({ collectionId, label, columns, rows, data, options, canEdit, editable }: {
  collectionId: string; label: string; columns: Column[]; rows: Record<string, Cell>[]; data: Record<string, Record<string, unknown>>; options: Options; canEdit: boolean; editable: boolean;
}) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const list = columns.filter((c) => c.key !== "_id");
  return (
    <div>
      {notice && editing === null && <p role="status" className="mb-4 rounded-xl border border-line bg-card p-3 text-[0.9rem] text-ink print:hidden">{notice}</p>}
      {canEdit && editing === null && (
        <button type="button" className="pf-btn pf-btn-solid mb-4 print:hidden" onClick={() => { setNotice(null); setEditing("new"); }}><Plus size={16} /> Add to {label.toLowerCase()}</button>
      )}
      {canEdit && editing !== null && (
        <section className="pf-card mb-6 p-4 sm:p-6 print:hidden" aria-label={editing === "new" ? "New record" : "Edit record"}>
          <h2 className="mb-4 font-serif text-xl">{editing === "new" ? `New: ${label}` : `Edit: ${label}`}</h2>
          <RecordForm key={editing} collectionId={collectionId} options={options} initial={editing === "new" ? undefined : data[editing]} recordId={editing === "new" ? undefined : editing} onDone={(m) => { setEditing(null); setNotice(m ?? null); }} />
        </section>
      )}
      {!editable && <p className="mb-4 rounded-xl border border-line bg-card p-3 text-[0.85rem] text-muted">The platform&apos;s database is not connected yet, so nothing has been entered here. Everything in the data pack is still on the site.</p>}
      <DataTable
        columns={list}
        rows={rows}
        filename={`${collectionId}.csv`}
        empty={canEdit ? "Nothing entered yet. Add the first one." : "Nothing entered yet."}
        rowAction={canEdit ? (r) => <button type="button" className="pf-btn pf-btn-sm" onClick={() => { setEditing(String(r._id)); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Pencil size={14} /> Edit</button> : undefined}
      />
    </div>
  );
}
