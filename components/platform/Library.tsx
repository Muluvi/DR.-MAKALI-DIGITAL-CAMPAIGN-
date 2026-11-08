"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Search } from "lucide-react";
import type { LibraryItem, LibraryKind } from "@/lib/platform/library";

const ORDER: LibraryKind[] = ["Objective", "Strategy", "Workstream", "Pillar", "Content type", "Segment", "Indicator", "Risk", "Response tier", "Solution"];

export function Library({ items }: { items: LibraryItem[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [kind, setKind] = useState(params.get("kind") ?? "");
  useEffect(() => {
    const u = new URL(window.location.href);
    if (q) u.searchParams.set("q", q); else u.searchParams.delete("q");
    if (kind) u.searchParams.set("kind", kind); else u.searchParams.delete("kind");
    window.history.replaceState(null, "", u.href);
  }, [q, kind]);
  const kinds = ORDER.filter((k) => items.some((i) => i.kind === k));
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const view = items.filter((i) => (!kind || i.kind === kind) && terms.every((x) => `${i.title} ${i.summary} ${i.chapter} ${i.owner ?? ""}`.toLowerCase().includes(x)));
  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search the library</span>
        <Search aria-hidden size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="h-11 w-full rounded-full border border-line bg-card pl-9 pr-4 outline-none focus:border-accent" />
      </label>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Kind">
        <button type="button" onClick={() => setKind("")} className={`pf-filter ${!kind ? "is-on" : ""}`}>All {items.length}</button>
        {kinds.map((k) => (
          <button key={k} type="button" onClick={() => setKind(k === kind ? "" : k)} className={`pf-filter ${kind === k ? "is-on" : ""}`}>{k} {items.filter((i) => i.kind === k).length}</button>
        ))}
      </div>
      <p className="mt-3 text-[0.8rem] text-muted" aria-live="polite">{view.length} of {items.length}</p>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {view.map((i) => (
          <li key={i.id} id={i.id} className="pf-card flex flex-col p-4">
            <p className="flex flex-wrap items-center gap-2 text-[0.72rem] text-muted"><span className="pf-chip">{i.kind}</span>{i.chapter}</p>
            <h2 className="mt-2 font-serif text-[1.15rem] leading-snug text-ink">{i.title}</h2>
            {i.summary && <p className="mt-1.5 flex-1 text-[0.88rem] leading-snug text-muted">{i.summary}</p>}
            {i.owner && <p className="mt-2 text-[0.8rem] text-ink"><span className="text-muted">Owner: </span>{i.owner}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a href={i.href} className="pf-btn pf-btn-sm">In the story <ArrowUpRight size={14} /></a>
              <a href={`/implementation?q=${encodeURIComponent(i.title)}`} className="pf-btn pf-btn-sm">Implementation</a>
              {i.figures.length > 0 && (
                <details className="w-full text-[0.8rem]">
                  <summary className="cursor-pointer text-accent">{i.figures.length} {i.figures.length === 1 ? "figure" : "figures"} behind it</summary>
                  <p className="mt-2 flex flex-wrap gap-1.5">
                    {i.figures.map((f) => <a key={f} href={`/explore?ds=figures&q=${encodeURIComponent(f)}`} className="pf-chip hover:border-accent hover:text-accent">{f}</a>)}
                  </p>
                </details>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
