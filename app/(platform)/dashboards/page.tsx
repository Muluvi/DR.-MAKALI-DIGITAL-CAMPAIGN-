import Link from "next/link";
import { CONSTITUENCIES } from "@/data/ward-register";
import { PROJECTS } from "@/data/projects";
import { ANALYSIS_EXPORTS } from "@/data/analysis-exports";
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS } from "@/data/kpis";
import { AnalysisFigure } from "@/components/markdown/AnalysisFigure";
import { readStore } from "@/lib/platform/auth";
import type { StoredRecord } from "@/lib/platform/store/types";
import { PageHead } from "@/components/platform/PageHead";
import { Bars, type Bar } from "@/components/platform/Bars";

export const metadata = { title: "Dashboards | Kitui 2027", robots: { index: false, follow: false } };

const countBy = (rows: StoredRecord[], key: string): Bar[] => {
  const m = new Map<string, number>();
  for (const r of rows) for (const v of [r.data[key]].flat()) if (v) m.set(String(v), (m.get(String(v)) ?? 0) + 1);
  return [...m].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};
const sumBy = (rows: StoredRecord[], key: string, val: string): Bar[] => {
  const m = new Map<string, number>();
  for (const r of rows) if (r.data[key]) m.set(String(r.data[key]), (m.get(String(r.data[key])) ?? 0) + (Number(r.data[val]) || 0));
  return [...m].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};

export default async function Dashboards() {
  const store = readStore();
  const all = store ? await store.listAll().catch(() => []) : [];
  const of = (c: string) => all.filter((r) => r.collection === c);

  // Indicators: the latest measured value of each, against its target.
  const kpis = [...NOMINATION_KPIS, ...GENERAL_ELECTION_KPIS];
  const actuals = of("kpi-actuals");
  const kpiBars: Bar[] = kpis.flatMap((k) => {
    const latest = actuals.filter((r) => String(r.data.kpi).startsWith(`${k.code} `)).sort((a, b) => String(b.data.periodEnding).localeCompare(String(a.data.periodEnding)))[0];
    return latest ? [{ label: `${k.code} ${k.title}`, value: Number(latest.data.value), mark: k.targetValue, note: `Period ending ${String(latest.data.periodEnding)}${k.targetValue === null ? "; the target depends on the Week 1 baseline" : ""}` }] : [];
  });

  const sectors = new Map<string, number>();
  for (const p of PROJECTS) sectors.set(p.sector, (sectors.get(p.sector) ?? 0) + 1);

  return (
    <>
      <PageHead kicker="Dashboards" title="The campaign at a glance" lead="Every chart is drawn from the data on the site. The team's numbers update the moment they are saved; the data pack's update when a data edit goes live." />

      <h2 className="mb-3 mt-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">The team&apos;s numbers</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Bars title="Indicators: latest value against target" caption="The bar is the latest measured value; the line is the target." bars={kpiBars} empty="No indicator has been measured yet. The team enters each in the KPI tracker." />
        <Bars title="Implementation, by status" bars={countBy(of("implementation"), "status")} empty="No action has been entered yet." />
        <Bars title="Reach on his channels, by constituency" caption="Summed across every period entered in the channel audit." bars={sumBy(of("channel-audit"), "constituency", "reach")} empty="No channel audit has been entered yet." />
        <Bars title="Offline sends, by rail" caption="Consented contacts reached, summed across sends marked sent." bars={sumBy(of("dispatch").filter((r) => r.data.status === "Sent"), "rail", "recipients")} empty="Nothing has been sent yet." />
        <Bars title="Content calendar, by channel" bars={countBy(of("calendar"), "channel")} empty="The calendar is empty." />
        <Bars title="Field reports, by ward" caption="The wards raising issues most often." bars={countBy(of("field"), "ward").slice(0, 12)} empty="No field report has been entered yet." />
        <Bars title="Field sentiment" bars={countBy(of("field"), "sentiment")} empty="No field report has been entered yet." />
        <Bars title="Rapid response, by severity" bars={countBy(of("incidents"), "severity")} empty="No incident has been logged." />
      </div>
      <p className="mt-3 text-[0.85rem]"><Link href="/workspace" className="text-accent">Enter or update these in the workspace</Link></p>

      <h2 className="mb-3 mt-10 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">The data pack</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Bars title="Registered voters, by constituency" bars={CONSTITUENCIES.map((c) => ({ label: c.name, value: c.voters })).sort((a, b) => b.value - a.value)} source="IEBC 2022 register" />
        <Bars title="County projects, by sector" caption="Itemised in the county's Three-Year Scorecard." bars={[...sectors].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)} source="County Government of Kitui scorecard" />
      </div>
      <div className="mt-2 grid gap-x-4 md:grid-cols-2">
        {Object.entries(ANALYSIS_EXPORTS).map(([id, chart]) => (
          <AnalysisFigure key={id} chart={chart} />
        ))}
      </div>
    </>
  );
}
