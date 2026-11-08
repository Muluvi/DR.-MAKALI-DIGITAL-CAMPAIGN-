"use client";

import { useSyncExternalStore } from "react";

type Item = { id: string; label: string; detail: string };
const KEY = "kitui-nomination-path";

// Held in memory too, so ticking still works where browser storage is blocked.
let memory = "{}";
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const read = () => { try { return localStorage.getItem(KEY) ?? memory; } catch { return memory; } };
const write = (value: string) => { memory = value; try { localStorage.setItem(KEY, value); } catch { /* memory holds it */ } listeners.forEach((fn) => fn()); };

/** A tick list kept on this device only. No names, documents or personal data. */
export function NominationPath({ items }: { items: Item[] }) {
  const raw = useSyncExternalStore(subscribe, read, () => "{}");
  const done: Record<string, boolean> = JSON.parse(raw);
  const toggle = (id: string) => write(JSON.stringify({ ...done, [id]: !done[id] }));
  const count = items.filter((i) => done[i.id]).length;
  return (
    <div>
      <p className="text-ink" role="status">{count} of {items.length} complete on this device</p>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.id} className="plat-card p-3"><label className="flex cursor-pointer gap-3">
            <input type="checkbox" className="mt-1" checked={!!done[i.id]} onChange={() => toggle(i.id)} />
            <span><span className="text-ink">{i.label}</span><span className="mt-1 block text-[0.8rem] text-muted">{i.detail}</span></span>
          </label></li>
        ))}
      </ul>
      <button type="button" className="plat-btn plat-btn-sm mt-3 print:hidden" onClick={() => window.print()}>Print</button>
    </div>
  );
}
