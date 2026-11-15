import Link from "next/link";
import { CONSTITUENCIES } from "@/data/ward-register";
import { PROJECTS } from "@/data/projects";
import { ANALYSIS_EXPORTS } from "@/data/analysis-exports";
import { AnalysisFigure } from "@/components/markdown/AnalysisFigure";
import { readStore } from "@/lib/platform/auth";
import { teamCharts } from "@/lib/live/charts";
import { PageHead } from "@/components/platform/PageHead";
import { Bars } from "@/components/platform/Bars";

export const metadata = { title: "Dashboards | Kitui 2027", robots: { index: false, follow: false } };

export default async function Dashboards() {
  const store = readStore();
  const all = store ? await store.listAll().catch(() => []) : [];
  // The team's charts, in one list, so the page can lead with the ones that have something in them.
  const team = teamCharts(all);
  const filled = team.filter((c) => c.bars.length > 0);
  const waiting = team.filter((c) => c.bars.length === 0);

  const sectors = new Map<string, number>();
  for (const p of PROJECTS) sectors.set(p.sector, (sectors.get(p.sector) ?? 0) + 1);

  return (
    <>
      <PageHead kicker="Dashboards" title="The campaign at a glance" lead="Every chart is drawn from the data on the site. The team's numbers update the moment they are saved; the data pack's update when a data edit goes live." />

      {filled.length > 0 && (
        <>
          <h2 className="mb-3 mt-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">The team&apos;s numbers</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {filled.map((c) => (
              <Bars key={c.title} title={c.title} caption={c.caption} bars={c.bars} />
            ))}
          </div>
          {waiting.length === 0 && <p className="mt-3 text-[0.85rem]"><Link href="/workspace" className="text-accent">Enter or update these in the workspace</Link></p>}
        </>
      )}

      <h2 className={`mb-3 ${filled.length > 0 ? "mt-10" : "mt-2"} text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted`}>The data pack</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Bars title="Registered voters, by constituency" bars={CONSTITUENCIES.map((c) => ({ label: c.name, value: c.voters })).sort((a, b) => b.value - a.value)} source="IEBC 2022 register" />
        <Bars title="County projects, by sector" caption="Itemised in the county's Three-Year Scorecard." bars={[...sectors].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)} source="County Government of Kitui scorecard" />
      </div>
      {/* Charts with nothing in them yet, as one list. Eight empty cards used to open this page,
          ahead of every chart that had data; the list now follows the first two that do (streamline pass, November 2026). */}
      {waiting.length > 0 && (
        <section className="plat-card my-6 p-4 sm:p-5" aria-labelledby="dash-waiting">
          <h2 id="dash-waiting" className="font-serif text-[1.1rem] leading-snug text-ink">
            {filled.length > 0 ? "Still waiting for a first entry" : "The team\u2019s numbers start with the first entry"}
          </h2>
          <p className="mt-1 text-[0.85rem] text-muted">Each of these charts draws itself the moment the team saves a record.</p>
          <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {waiting.map((c) => (
              <li key={c.title} className="flex gap-2.5 text-[0.85rem]">
                <span aria-hidden className="mt-[0.45rem] h-2 w-2 flex-none rounded-full border border-line" />
                <span>
                  <span className="text-ink">{c.title}</span>
                  <span className="block text-muted">{c.empty}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.85rem]"><Link href="/workspace" className="text-accent">Enter or update these in the workspace</Link></p>
        </section>
      )}

      <div className="mt-2 grid gap-x-4 md:grid-cols-2">
        {Object.entries(ANALYSIS_EXPORTS).map(([id, chart]) => (
          <AnalysisFigure key={id} chart={chart} />
        ))}
      </div>
    </>
  );
}
