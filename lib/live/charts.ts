/**
 * The team's charts, built from the working records. Shared by /dashboards and by the story,
 * which draws each chart inside the chapter it measures (story integration, November 2026).
 * Pure: no server code, so either side can call it.
 */
import type { Bar } from "@/components/platform/Bars";
import type { StoredRecord } from "@/lib/platform/store/types";
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS } from "@/data/kpis";

export interface TeamChart { id: string; title: string; caption?: string; bars: Bar[]; empty: string; collection: string }

export const countBy = (rows: StoredRecord[], key: string): Bar[] => {
  const m = new Map<string, number>();
  for (const r of rows) for (const v of [r.data[key]].flat()) if (v) m.set(String(v), (m.get(String(v)) ?? 0) + 1);
  return [...m].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};
export const sumBy = (rows: StoredRecord[], key: string, val: string): Bar[] => {
  const m = new Map<string, number>();
  for (const r of rows) if (r.data[key]) m.set(String(r.data[key]), (m.get(String(r.data[key])) ?? 0) + (Number(r.data[val]) || 0));
  return [...m].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};

export function teamCharts(all: StoredRecord[]): TeamChart[] {
  const of = (c: string) => all.filter((r) => r.collection === c);
  const actuals = of("kpi-actuals");
  const kpiBars: Bar[] = [...NOMINATION_KPIS, ...GENERAL_ELECTION_KPIS].flatMap((k) => {
    const latest = actuals.filter((r) => String(r.data.kpi).startsWith(`${k.code} `)).sort((a, b) => String(b.data.periodEnding).localeCompare(String(a.data.periodEnding)))[0];
    return latest ? [{ label: `${k.code} ${k.title}`, value: Number(latest.data.value), mark: k.targetValue, note: `Period ending ${String(latest.data.periodEnding)}${k.targetValue === null ? "; the target depends on the Week 1 baseline" : ""}` }] : [];
  });
  return [
    { id: "kpis", collection: "kpi-actuals", title: "Indicators: latest value against target", caption: "The bar is the latest measured value; the line is the target.", bars: kpiBars, empty: "The team enters each in the KPI tracker." },
    { id: "implementation", collection: "implementation", title: "Implementation, by status", bars: countBy(of("implementation"), "status"), empty: "No action has been entered yet." },
    { id: "reach", collection: "channel-audit", title: "Reach on his channels, by constituency", caption: "Summed across every period entered in the channel audit.", bars: sumBy(of("channel-audit"), "constituency", "reach"), empty: "No channel audit has been entered yet." },
    { id: "offline", collection: "dispatch", title: "Offline sends, by rail", caption: "Consented contacts reached, summed across sends marked sent.", bars: sumBy(of("dispatch").filter((r) => r.data.status === "Sent"), "rail", "recipients"), empty: "Nothing has been sent yet." },
    { id: "calendar", collection: "calendar", title: "Content calendar, by channel", bars: countBy(of("calendar"), "channel"), empty: "The calendar is empty." },
    { id: "field", collection: "field", title: "Field reports, by ward", caption: "The wards raising issues most often.", bars: countBy(of("field"), "ward").slice(0, 12), empty: "No field report has been entered yet." },
    { id: "sentiment", collection: "field", title: "Field sentiment", bars: countBy(of("field"), "sentiment"), empty: "No field report has been entered yet." },
  ];
}
