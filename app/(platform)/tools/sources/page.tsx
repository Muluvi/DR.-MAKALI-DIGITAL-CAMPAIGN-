import { PageHead } from "@/components/platform/PageHead";
import { PUBLIC_RETRIEVED, PUBLIC_SOURCES } from "@/lib/public-data";

export const metadata = { title: "Sources and data gaps | Kitui 2027", robots: { index: false, follow: false } };

const GAPS = [
  ["Ward and station-level election results", "Not held. Request from the IEBC Kitui office or use the campaign's 2022 agent copies."],
  ["2013 and 2017 Kitui results by office", "Not collected from a primary source."],
  ["Agents allowed per polling station", "Unconfirmed. Check the current Elections (General) Regulations."],
  ["Governor nomination paperwork and qualifications", "Unconfirmed. Check current regulations and IEBC guidance."],
  ["Wiper's 2027 nomination rules", "Not found publicly. Obtain from the party or the Registrar of Political Parties."],
  ["Ward-level register after 2022", "Not published. All ward voter figures are from 2022."],
  ["Political SMS guidelines", "The 2017 text is the latest found. Confirm it is current with the Communications Authority."],
];

export default function Page() {
  return <>
    <PageHead kicker="Reference" title="Sources and data gaps" lead="Where the planning tools' official figures come from, and what is still missing." />
    <p className="text-[0.9rem] text-muted">Official data pack retrieved <time dateTime={PUBLIC_RETRIEVED}>{PUBLIC_RETRIEVED}</time>.</p>
    <section className="mt-6"><h2 className="font-serif text-2xl text-ink">Sources</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-ink">{Object.values(PUBLIC_SOURCES).map((s) => <li key={s.href}><a className="underline" href={s.href} rel="noreferrer" target="_blank">{s.label}</a></li>)}</ul></section>
    <section className="mt-8"><h2 className="font-serif text-2xl text-ink">Open gaps</h2><ul className="mt-3 space-y-2">{GAPS.map(([g, d]) => <li key={g} className="plat-card p-3"><p className="font-semibold text-ink">{g}</p><p className="mt-1 text-[0.88rem] text-muted">{d}</p></li>)}</ul></section>
  </>;
}
