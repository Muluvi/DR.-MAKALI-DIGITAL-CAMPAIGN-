import Link from "next/link";
import { PageHead } from "@/components/platform/PageHead";
import { platformMode } from "@/lib/platform/config";
import { serviceClient } from "@/lib/platform/store/supabase";
import { INCIDENTS } from "@/lib/platform/incidents";
import { PUBLIC_RETRIEVED } from "@/lib/public-data";

export const metadata = { title: "Status | Kitui 2027", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Check = { label: string; state: "ok" | "off" | "down"; detail: string };

const day = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** A live check of the workspace database: one count query, given three seconds. */
async function database(): Promise<Check> {
  const mode = platformMode();
  if (mode === "off") return { label: "Workspace database", state: "off", detail: "Not connected yet. Every public page works from the data pack; the team's working records switch on with the database." };
  if (mode === "local") return { label: "Workspace database", state: "ok", detail: "A local development store, not the live service." };
  const started = Date.now();
  try {
    const query = serviceClient().from("records").select("id", { count: "exact", head: true });
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("no answer within three seconds")), 3 * 1000));
    const { error } = await Promise.race([query, timeout]);
    if (error) return { label: "Workspace database", state: "down", detail: `Not answering correctly: ${error.message}` };
    return { label: "Workspace database", state: "ok", detail: `Answered in ${Date.now() - started} ms, checked as this page loaded.` };
  } catch (e) {
    return { label: "Workspace database", state: "down", detail: `Not reachable: ${e instanceof Error ? e.message : "unknown error"}.` };
  }
}

const TONE = { ok: "plat-status-live", off: "", down: "plat-status-paused" } as const;
const WORD = { ok: "Working", off: "Not switched on", down: "Not working" } as const;

export default async function StatusPage() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  const checks: Check[] = [
    { label: "Public site", state: "ok", detail: "This page was served, so the site is up." },
    await database(),
    { label: "Saving records", state: platformMode() === "off" ? "off" : "ok", detail: platformMode() === "off" ? "Opens once the workspace database is connected. There is no sign-in: anyone with the link will be able to add and change records." : "Open to anyone with the link, with no sign-in. Every change is in the change history and can be put back." },
    { label: "Model instructions", state: "ok", detail: "Read in each visitor's browser, by rule: nothing to go down, and nothing to pay for." },
    { label: "AI step for instructions", state: process.env.ANTHROPIC_API_KEY ? "ok" : "off", detail: process.env.ANTHROPIC_API_KEY ? "Switched on: wording the rules cannot place is reworded by Claude Haiku 5.5, within per-visitor and monthly limits." : "Switched off: no AI key is set, so it costs nothing. Every model and its instruction box work without it." },
  ];
  const open = INCIDENTS.filter((i) => !i.closed);
  return (
    <>
      <PageHead kicker="Status" title="Is the platform working?" lead="What can be checked live, the version that is running, and every incident Firefly has recorded." />

      <ul className="grid gap-3 sm:grid-cols-2">
        {checks.map((c) => (
          <li key={c.label} className="plat-card p-4">
            <div className="flex items-center justify-between gap-3"><h2 className="font-semibold text-ink">{c.label}</h2><span className={`plat-chip ${TONE[c.state]}`}>{WORD[c.state]}</span></div>
            <p className="mt-2 text-[0.88rem] text-muted">{c.detail}</p>
          </li>
        ))}
      </ul>

      <section className="plat-card mt-6 p-4 text-[0.92rem] sm:p-5">
        <h2 className="font-serif text-xl text-ink">Running now</h2>
        <dl className="mt-2 grid gap-2 sm:grid-cols-2">
          <div><dt className="text-muted">Version</dt><dd className="font-mono text-ink">{sha ? sha.slice(0, 7) : "a local build"}{process.env.VERCEL_ENV ? ` (${process.env.VERCEL_ENV})` : ""}</dd></div>
          <div><dt className="text-muted">Official election data last verified</dt><dd className="text-ink"><time dateTime={PUBLIC_RETRIEVED}>{day(PUBLIC_RETRIEVED)}</time></dd></div>
        </dl>
      </section>

      <section className="mt-6 text-[0.92rem]">
        <h2 className="font-serif text-xl text-ink">Incidents</h2>
        {INCIDENTS.length === 0 ? (
          <p className="mt-2 text-muted">None recorded.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {INCIDENTS.map((i) => (
              <li key={`${i.opened}-${i.title}`} className="plat-card p-4">
                <p className="font-semibold text-ink">{i.title} <span className={`plat-chip ml-2 ${i.closed ? "plat-status-live" : "plat-status-paused"}`}>{i.closed ? `Closed ${day(i.closed)}` : "Open"}</span></p>
                <p className="mt-1 text-muted">Opened {day(i.opened)}. {i.impact}</p>
                <p className="mt-1 text-ink">{i.done}</p>
              </li>
            ))}
          </ul>
        )}
        {open.length > 0 && <p className="mt-2 text-ink">{open.length} open.</p>}
        <p className="mt-4 max-w-2xl text-muted">Uptime history is not shown yet: monitoring with alerts is set up in the Readiness phase, and from then this page carries the month&apos;s availability against the agreed target. Until then, it shows only what can be checked as it loads. <Link className="underline" href="/help">Help</Link> · <Link className="underline" href="/privacy">Privacy</Link></p>
      </section>
    </>
  );
}
