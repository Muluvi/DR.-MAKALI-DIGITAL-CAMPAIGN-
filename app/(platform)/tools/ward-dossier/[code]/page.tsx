import Link from "next/link";
import { notFound } from "next/navigation";
import stationsByWard from "@/data/kitui-stations.generated.json";
import { PageHead } from "@/components/platform/PageHead";
import { StationDownload } from "@/components/tools/public/StationDownload";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { PUBLIC_SOURCES, PUBLIC_WARDS } from "@/lib/public-data";

export const metadata = { title: "Ward dossier | Kitui 2027", robots: { index: false, follow: false } };
const n = (v: number) => v.toLocaleString("en-KE");
type Station = { code: string; centre: string; station: string; voters: number };

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const i = PUBLIC_WARDS.findIndex((w) => w.code === code);
  if (i < 0) notFound();
  const ward = PUBLIC_WARDS[i];
  const stations = (stationsByWard as Record<string, Station[]>)[code];
  const peers = PUBLIC_WARDS.filter((w) => w.constituencyCode === ward.constituencyCode).sort((a, b) => b.voters - a.voters);
  const peerTotal = peers.reduce((a, w) => a + w.voters, 0);
  const prev = PUBLIC_WARDS[i - 1], next = PUBLIC_WARDS[i + 1];
  const stats = [["Registered voters, 2022", n(ward.voters)], ["Polling stations", n(ward.stations)], ["Registration centres", n(ward.centres)], ["Average voters per station", n(Math.round(ward.voters / ward.stations))], ["Population (Gazette)", n(ward.population)], ["Area, sq km (Gazette)", ward.areaSqKm.toLocaleString("en-KE")], ["MCA spending limit, 2027", `KSh ${n(ward.mcaLimit)}`], ["Share of constituency voters", `${((ward.voters / peerTotal) * 100).toFixed(1)}%`]];
  return <>
    <p className="mb-3 text-[0.85rem]"><Link className="underline" href="/tools/ward-dossier">All wards</Link></p>
    <PageHead kicker={`${ward.constituency} constituency`} title={`${ward.name} ward`} />
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(([l, v]) => <div key={l} className="plat-card p-4"><p className="text-[0.8rem] text-muted">{l}</p><p className="mt-1 font-mono text-xl text-ink">{v}</p></div>)}</div>
    <section className="mt-8"><h2 className="font-serif text-2xl text-ink">Compared with {ward.constituency}</h2>
      <ul className="mt-3 space-y-2">{peers.map((w) => <li key={w.code}><Link href={`/tools/ward-dossier/${w.code}`} className={`block text-[0.9rem] ${w.code === code ? "font-semibold text-ink" : "text-muted"}`}><span className="flex justify-between gap-3"><span>{w.name}</span><span className="font-mono">{n(w.voters)}</span></span><span className="mt-1 block h-2 rounded-full bg-accent-solid" style={{ width: `${(w.voters / peers[0].voters) * 100}%`, opacity: w.code === code ? 1 : 0.35 }} /></Link></li>)}</ul>
    </section>
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl text-ink">Polling stations</h2><StationDownload ward={ward.name} stations={stations} /></div>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[32rem] text-left text-[0.86rem]"><thead className="text-muted"><tr><th className="py-2 pr-3">Station</th><th className="py-2 pr-3">Code</th><th className="py-2 text-right">Voters</th></tr></thead><tbody>{stations.map((s) => <tr key={s.code} className="border-t border-line text-ink"><td className="py-2 pr-3">{s.station}</td><td className="py-2 pr-3 font-mono text-muted">{s.code}</td><td className="py-2 text-right font-mono">{n(s.voters)}</td></tr>)}</tbody></table></div>
    </section>
    <nav aria-label="Ward navigation" className="mt-8 flex justify-between gap-3 text-[0.9rem]">{prev ? <Link className="underline" href={`/tools/ward-dossier/${prev.code}`}>← {prev.name}</Link> : <span />}{next && <Link className="underline" href={`/tools/ward-dossier/${next.code}`}>{next.name} →</Link>}</nav>
    <ToolLimits does="Figures are copied from the IEBC 2022 register and the August 2026 Gazette and checked against the campaign's ward register." doesNot={["Station lists can change before 2027. Use the IEBC's next published register when it appears.", "It holds no ward or station-level election results.", "It holds no personal data."]} sources={[PUBLIC_SOURCES.stations, PUBLIC_SOURCES.limits]} />
  </>;
}
