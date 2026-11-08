"use client";

import Link from "next/link";
import { useState } from "react";
import type { PublicWard } from "@/lib/public-data";

const n = (v: number) => v.toLocaleString("en-KE");

export function WardFinder({ wards }: { wards: PublicWard[] }) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const list = wards.filter((w) => `${w.name} ${w.constituency}`.toLowerCase().includes(term));
  const names = [...new Set(list.map((w) => w.constituency))];
  return (
    <div>
      <label className="plat-label block">Find a ward or constituency
        <input className="plat-input mt-1 block w-full" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a name" />
      </label>
      <p className="plat-hint mt-2" role="status">{list.length} of {wards.length} wards</p>
      {names.map((c) => (
        <section key={c} className="mt-5">
          <h3 className="font-serif text-lg text-ink">{c}</h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {list.filter((w) => w.constituency === c).map((w) => (
              <li key={w.code}><Link href={`/tools/ward-dossier/${w.code}`} className="plat-card block p-3 text-ink">
                <span className="font-semibold">{w.name}</span>
                <span className="mt-1 block text-[0.82rem] text-muted">{n(w.voters)} voters · {n(w.stations)} stations</span>
              </Link></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
