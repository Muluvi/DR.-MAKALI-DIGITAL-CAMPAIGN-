"use client";

import Link from "next/link";
import { useState } from "react";
import { saveRecord } from "@/app/(platform)/actions";

/**
 * Keeps the model's current settings in the workspace's Saved scenarios, so a brief or a meeting can
 * point to them. The page's address already carries every setting, so the link is the scenario.
 * Anyone with the link can save; the saved scenario is public, like every record.
 */
export function SaveScenario({ modelName }: { modelName: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const r = await saveRecord("scenarios", null, { model: modelName, title, link: window.location.href, note });
    setBusy(false);
    if (r.ok) {
      setMsg({ ok: true, text: "Saved. Anyone with the link can open it from Saved scenarios." });
      setTitle("");
      setNote("");
      setOpen(false);
    } else {
      setMsg({ ok: false, text: Object.values(r.errors).join(" ") });
    }
  };

  return (
    <div className="mb-4 print:hidden">
      {!open ? (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="plat-btn plat-btn-sm" onClick={() => { setOpen(true); setMsg(null); }}>Save this scenario</button>
          <Link href="/workspace/scenarios" className="text-[0.85rem] underline">Saved scenarios</Link>
          {msg && <span className={`text-[0.85rem] ${msg.ok ? "text-ink" : "plat-error"}`} role="status">{msg.text}</span>}
        </div>
      ) : (
        <form onSubmit={save} className="plat-card grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:items-end">
          <label className="plat-label">What it shows
            <input className="plat-input mt-1" required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Turnout 70% in the pool" />
          </label>
          <label className="plat-label">Note (optional)
            <input className="plat-input mt-1" maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="For Thursday's brief" />
          </label>
          <div className="flex gap-2">
            <button type="submit" className="plat-btn plat-btn-sm plat-btn-solid" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            <button type="button" className="plat-btn plat-btn-sm" onClick={() => setOpen(false)}>Cancel</button>
          </div>
          {msg && !msg.ok && <p className="plat-error sm:col-span-3" role="alert">{msg.text}</p>}
          <p className="plat-hint sm:col-span-3">The current settings are saved as a link, open to anyone with the site&apos;s link, like every record. Do not name or identify anyone.</p>
        </form>
      )}
    </div>
  );
}
