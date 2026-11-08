"use client";

/**
 * The form for one working record. It checks the record as the team types (the same validator the
 * server runs), so a mistake is explained before anything is sent; the server checks it again and
 * is the check that counts. Built for a phone: one column, large targets, native date and number
 * keyboards.
 */
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { COLLECTION_BY_ID, type Field } from "@/lib/platform/collections";
import { validateRecord, type Options } from "@/lib/platform/validate";
import { saveRecord } from "@/app/(platform)/actions";

export function RecordForm({ collectionId, options, initial, recordId, onDone }: { collectionId: string; options: Options; initial?: Record<string, unknown>; recordId?: string; onDone?: () => void }) {
  const c = COLLECTION_BY_ID[collectionId];
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...(initial ?? {}) }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const live = useMemo(() => (touched ? validateRecord(c, values, options) : null), [c, values, options, touched]);
  const shown = { ...(live && !live.ok ? live.errors : {}), ...errors };

  const set = (k: string, v: unknown) => { setValues((x) => ({ ...x, [k]: v })); setErrors({}); setMessage(null); };

  const labelOf = (f: Field) => {
    const m = /^pillar(\d)$/.exec(f.key);
    return m && options.pillars?.[Number(m[1]) - 1] ? `Weight: ${options.pillars[Number(m[1]) - 1]} (%)` : f.label;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const v = validateRecord(c, values, options);
    if (!v.ok) { setErrors(v.errors); return; }
    start(async () => {
      const r = await saveRecord(c.id, recordId ?? null, values);
      if (!r.ok) { setErrors(r.errors); return; }
      setMessage(r.message);
      router.refresh();
      if (!recordId) setValues({});
      setTouched(false);
      onDone?.();
    });
  };

  const input = (f: Field) => {
    const id = `f-${c.id}-${f.key}`;
    const v = values[f.key];
    const invalid = shown[f.key] ? true : undefined;
    const choices = f.options ? [...f.options] : f.source ? options[f.source] ?? [] : [];
    switch (f.type) {
      case "longtext":
        return <textarea id={id} className="pf-input min-h-28" value={String(v ?? "")} maxLength={f.maxLength} onChange={(e) => set(f.key, e.target.value)} aria-invalid={invalid} />;
      case "number":
        return <input id={id} className="pf-input" inputMode="decimal" value={v === null || v === undefined ? "" : String(v)} onChange={(e) => set(f.key, e.target.value === "" ? null : e.target.value)} aria-invalid={invalid} />;
      case "date":
        return <input id={id} type="date" className="pf-input" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} aria-invalid={invalid} />;
      case "select":
        return (
          <select id={id} className="pf-input" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} aria-invalid={invalid}>
            <option value="">Choose…</option>
            {choices.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        );
      case "multiselect": {
        const list = Array.isArray(v) ? (v as string[]) : [];
        return (
          <div id={id} className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto rounded-2xl border border-line bg-card p-2" role="group" aria-label={f.label}>
            {choices.map((o) => {
              const on = list.includes(o);
              return (
                <button key={o} type="button" aria-pressed={on} onClick={() => set(f.key, on ? list.filter((x) => x !== o) : [...list, o])} className={`rounded-full border px-2.5 py-1 text-[0.8rem] ${on ? "border-accent bg-accent-solid text-on-accent" : "border-line text-ink"}`}>
                  {o}
                </button>
              );
            })}
          </div>
        );
      }
      case "boolean":
        return (
          <label className="flex items-center gap-3 text-[0.95rem]">
            <input id={id} type="checkbox" className="h-5 w-5 accent-[var(--accent)]" checked={v === true} onChange={(e) => set(f.key, e.target.checked)} />
            {labelOf(f)}
          </label>
        );
      default:
        return <input id={id} type={f.type === "url" ? "url" : "text"} inputMode={f.type === "url" ? "url" : undefined} className="pf-input" value={String(v ?? "")} maxLength={f.maxLength} onChange={(e) => set(f.key, e.target.value)} aria-invalid={invalid} />;
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {c.fields.map((f) => (
        <div key={f.key}>
          {f.type !== "boolean" && <label htmlFor={`f-${c.id}-${f.key}`} className="pf-label">{labelOf(f)}{f.required ? "" : <span className="font-normal text-muted"> (optional)</span>}</label>}
          {input(f)}
          {f.hint && !shown[f.key] && <p className="pf-hint">{f.hint}</p>}
          {shown[f.key] && <p className="pf-error" role="alert">{shown[f.key]}</p>}
        </div>
      ))}
      {shown._ && <p className="rounded-xl border border-danger/40 bg-danger/5 p-3 text-[0.9rem] text-danger" role="alert">{shown._}</p>}
      {message && <p className="rounded-xl border border-line bg-paper p-3 text-[0.9rem] text-ink" role="status">{message}</p>}
      <div className="flex gap-2">
        <button type="submit" className="pf-btn pf-btn-solid" disabled={pending}>{pending ? "Saving…" : recordId ? "Save changes" : "Save"}</button>
        {onDone && <button type="button" className="pf-btn" onClick={onDone}>Cancel</button>}
      </div>
    </form>
  );
}
