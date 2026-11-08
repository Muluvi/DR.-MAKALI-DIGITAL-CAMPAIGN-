import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS, GROUPS } from "@/lib/platform/collections";
import { getSession, readStore } from "@/lib/platform/auth";
import { PageHead } from "@/components/platform/PageHead";

export const metadata = { title: "Workspace | Kitui 2027", robots: { index: false, follow: false } };

export default async function Workspace() {
  const store = readStore();
  const [session, all] = await Promise.all([getSession().catch(() => null), store ? store.listAll().catch(() => []) : []]);
  const count = (id: string) => all.filter((r) => r.collection === id).length;
  const latest = (id: string) => all.filter((r) => r.collection === id).map((r) => r.updatedAt).sort().pop()?.slice(0, 10);
  return (
    <>
      <PageHead kicker="Team workspace" title="Where the team runs the campaign" lead={session ? `Signed in as ${session.name}. Add and update records; everything you save is on the site at once, and in the change history.` : "The team's working records: the weekly brief, the calendar, the dispatch log, the indicators and the response desk. Anyone can read them; the team signs in to edit."} />
      <div className="space-y-8">
        {GROUPS.map((g) => (
          <section key={g} aria-labelledby={`g-${g}`}>
            <h2 id={`g-${g}`} className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">{g}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COLLECTIONS.filter((c) => c.group === g).map((c) => (
                <li key={c.id}>
                  <Link href={`/workspace/${c.id}`} className="plat-card group flex h-full flex-col p-4 transition hover:border-accent">
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-serif text-[1.2rem] leading-tight text-ink">{c.label}</span>
                      <ArrowRight size={18} className="mt-1 flex-none text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
                    </span>
                    <span className="mt-2 flex-1 text-[0.88rem] leading-snug text-muted">{c.purpose}</span>
                    <span className="mt-3 text-[0.78rem] text-muted"><strong className="text-ink tabular-nums">{count(c.id)}</strong> {count(c.id) === 1 ? "record" : "records"}{latest(c.id) ? ` · updated ${latest(c.id)}` : ""}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
