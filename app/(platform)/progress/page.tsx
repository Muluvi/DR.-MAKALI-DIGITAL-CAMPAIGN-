import { Suspense } from "react";
import Link from "next/link";
import { COLLECTION_BY_ID } from "@/lib/platform/collections";
import { getSession, readStore } from "@/lib/platform/auth";
import { strategyChoices } from "@/lib/platform/library";
import { PageHead } from "@/components/platform/PageHead";
import { DataTable } from "@/components/platform/DataTable";
import { recordRows } from "@/components/platform/rows";

export const metadata = { title: "Implementation | Kitui 2027", robots: { index: false, follow: false } };

const STATUS = ["Planned", "In progress", "Live", "Paused", "Done"] as const;
const TONE: Record<string, string> = { Planned: "var(--line)", "In progress": "oklch(0.72 0.13 75)", Live: "var(--accent-solid)", Paused: "var(--danger)", Done: "oklch(0.55 0.13 150)" };

export default async function Implementation() {
  const c = COLLECTION_BY_ID.implementation;
  const store = readStore();
  const [session, records] = await Promise.all([getSession().catch(() => null), store ? store.list(c.id).catch(() => []) : []]);
  const strategies = strategyChoices();
  const by = new Map<string, typeof records>();
  for (const r of records) by.set(String(r.data.strategy), [...(by.get(String(r.data.strategy)) ?? []), r]);
  const counts = Object.fromEntries(STATUS.map((s) => [s, records.filter((r) => r.data.status === s).length]));
  const untouched = strategies.filter((s) => !by.has(s)).length;
  const { columns, rows } = recordRows(c, records);
  return (
    <>
      <PageHead kicker="Implementation" title="How each strategy is being carried out" lead="Owner, channel and status for every action, as Dr. Mulu's team enters them. Updated the moment the team saves.">
        {session && <Link href="/workspace/implementation" className="pf-btn pf-btn-solid mt-4">Update implementation</Link>}
      </PageHead>

      <section aria-label="Status overview" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {STATUS.map((s) => (
          <div key={s} className="pf-card p-3">
            <span className="block h-1.5 w-8 rounded-full" style={{ background: TONE[s] }} />
            <p className="mt-2 text-[1.6rem] font-semibold leading-none tabular-nums">{counts[s]}</p>
            <p className="mt-1 text-[0.75rem] text-muted">{s}</p>
          </div>
        ))}
        <div className="pf-card p-3">
          <span className="block h-1.5 w-8 rounded-full border border-dashed border-muted" />
          <p className="mt-2 text-[1.6rem] font-semibold leading-none tabular-nums">{untouched}</p>
          <p className="mt-1 text-[0.75rem] text-muted">Strategies with no action yet</p>
        </div>
      </section>

      <section aria-labelledby="by-strategy" className="mt-8">
        <h2 id="by-strategy" className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">By strategy</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {strategies.map((s) => {
            const list = by.get(s) ?? [];
            const [kind, ...rest] = s.split(": ");
            return (
              <li key={s} className="pf-card p-3">
                <p className="text-[0.7rem] uppercase tracking-[0.12em] text-muted">{kind}</p>
                <p className="mt-0.5 font-serif text-[1.02rem] leading-snug">{rest.join(": ")}</p>
                {list.length ? (
                  <>
                    <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-line/50" aria-hidden>
                      {STATUS.map((st) => {
                        const n = list.filter((r) => r.data.status === st).length;
                        return n ? <span key={st} style={{ width: `${(n / list.length) * 100}%`, background: TONE[st] }} /> : null;
                      })}
                    </div>
                    <ul className="mt-2 space-y-1 text-[0.82rem]">
                      {list.slice(0, 4).map((r) => (
                        <li key={r.id} className="flex gap-2"><span className="pf-chip flex-none">{String(r.data.status)}</span><span className="min-w-0">{String(r.data.action)} <span className="text-muted">· {String(r.data.owner)}{r.data.channel ? ` · ${String(r.data.channel)}` : ""}</span></span></li>
                      ))}
                      {list.length > 4 && <li className="text-muted">and {list.length - 4} more below</li>}
                    </ul>
                  </>
                ) : (
                  <p className="mt-2 text-[0.82rem] text-muted">No action entered yet.</p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="all-actions" className="mt-10">
        <h2 id="all-actions" className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">Every action</h2>
        <Suspense>
          <DataTable columns={columns.filter((x) => x.key !== "_id")} rows={rows} filename="implementation.csv" empty="No action has been entered yet." />
        </Suspense>
      </section>
    </>
  );
}
