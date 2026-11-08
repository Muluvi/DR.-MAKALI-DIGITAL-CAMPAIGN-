import { PageHead } from "@/components/platform/PageHead";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { WardFinder } from "@/components/tools/public/WardFinder";
import { COUNTY_LIMITS, countyTotals, PUBLIC_CONSTITUENCIES, PUBLIC_SOURCES, PUBLIC_WARDS } from "@/lib/public-data";

export const metadata = { title: "Ward dossier | Kitui 2027", robots: { index: false, follow: false } };
const n = (v: number) => v.toLocaleString("en-KE");

export default function Page() {
  const stats = [["Wards", PUBLIC_WARDS.length], ["Polling stations", countyTotals.stations], ["Registration centres", countyTotals.centres], ["Registered voters", countyTotals.voters]] as const;
  return <>
    <PageHead kicker="Reference" title="Kitui county and ward dossier" lead="Official register and spending-limit figures for the county, its constituencies and every ward." />
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(([l, v]) => <div key={l} className="plat-card p-4"><p className="text-[0.8rem] text-muted">{l}</p><p className="mt-1 font-mono text-2xl text-ink">{n(v)}</p></div>)}</div>
    <section className="mt-8"><h2 className="font-serif text-2xl text-ink">Spending limits, 2027 General Election</h2>
      <ul className="mt-2 space-y-1 text-ink">{COUNTY_LIMITS.map((l) => <li key={l.office}>{l.office}: <span className="font-mono">KSh {n(l.limit)}</span></li>)}</ul>
    </section>
    <section className="mt-8"><h2 className="font-serif text-2xl text-ink">Constituencies</h2>
      <div className="mt-2 overflow-x-auto"><table className="w-full min-w-[34rem] text-left text-[0.88rem]"><thead className="text-muted"><tr><th className="py-2 pr-3">Constituency</th><th className="py-2 pr-3 text-right">Wards</th><th className="py-2 pr-3 text-right">Stations</th><th className="py-2 pr-3 text-right">Voters 2022</th><th className="py-2 text-right">MP limit (KSh)</th></tr></thead><tbody>{PUBLIC_CONSTITUENCIES.map((c) => <tr key={c.code} className="border-t border-line text-ink"><td className="py-2 pr-3">{c.name}</td><td className="py-2 pr-3 text-right font-mono">{c.wards}</td><td className="py-2 pr-3 text-right font-mono">{n(c.stations)}</td><td className="py-2 pr-3 text-right font-mono">{n(c.voters)}</td><td className="py-2 text-right font-mono">{n(c.mpLimit)}</td></tr>)}</tbody></table></div>
    </section>
    <section className="mt-8"><h2 className="mb-3 font-serif text-2xl text-ink">Wards</h2><WardFinder wards={PUBLIC_WARDS} /></section>
    <ToolLimits does="Station, centre and voter counts come from the IEBC 2022 register. Population, area and limits come from the August 2026 Gazette." doesNot={["It does not show a register newer than 2022 at ward level.", "It holds no ward or station-level election results.", "It holds no personal data."]} sources={[PUBLIC_SOURCES.stations, PUBLIC_SOURCES.wards, PUBLIC_SOURCES.limits]} />
  </>;
}
