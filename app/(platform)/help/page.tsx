import Link from "next/link";
import { PageHead } from "@/components/platform/PageHead";
import { GUIDES, SW_REVIEWED } from "@/lib/platform/help";
import { teamLoginEnabled } from "@/lib/platform/config";

export const metadata = { title: "Help | Kitui 2027", robots: { index: false, follow: false } };

export default async function HelpPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const sw = lang === "sw";
  const login = teamLoginEnabled();
  return (
    <>
      <PageHead
        kicker={sw ? "Msaada" : "Help"}
        title={sw ? "Mwongozo kwa kila jukumu" : "A guide for each role"}
        lead={sw ? "Kila mtu hujifunza kazi ya jukumu lake, kwenye simu atakayoitumia. Mafunzo hukamilika pale unapofanya kazi hiyo mwenyewe kwenye jukwaa." : "Each person learns the job their role does, on the phone they will use. Training is complete when you have done that job on the platform yourself."}
      >
        <p className="mt-4 flex gap-2 print:hidden" role="group" aria-label={sw ? "Lugha" : "Language"}>
          <Link href="/help" aria-current={!sw ? "page" : undefined} className={`plat-btn plat-btn-sm ${!sw ? "plat-btn-solid" : ""}`}>English</Link>
          <Link href="/help?lang=sw" aria-current={sw ? "page" : undefined} className={`plat-btn plat-btn-sm ${sw ? "plat-btn-solid" : ""}`} lang="sw">Kiswahili</Link>
        </p>
      </PageHead>

      {sw && !SW_REVIEWED && (
        <p className="mb-4 rounded-xl border border-line p-3 text-[0.88rem] text-ink" lang="en">This Kiswahili is a draft by Firefly, not yet reviewed by a native speaker. Use the English where they differ.</p>
      )}
      {!login && (
        <p className="mb-4 rounded-xl border border-line p-3 text-[0.88rem] text-muted">{sw ? "Kuingia kwa timu bado kumezimwa. Hatua zinazohitaji akaunti zitafanya kazi kitakapowashwa mwanzoni mwa ushirikiano." : "Team sign-in is switched off for now. Steps that need an account work once it is switched on at the start of the engagement."}</p>
      )}

      <nav aria-label={sw ? "Majukumu" : "Roles"} className="mb-6 flex flex-wrap gap-2 print:hidden">
        {GUIDES.map((g) => <a key={g.id} href={`#${g.id}`} className="plat-chip hover:border-accent">{sw ? g.sw : g.en}</a>)}
      </nav>

      <div className="grid gap-4 lg:grid-cols-2">
        {GUIDES.map((g) => (
          <section key={g.id} id={g.id} className="plat-card scroll-mt-28 p-4 sm:p-5" lang={sw ? "sw" : "en"}>
            <h2 className="font-serif text-xl text-ink">{sw ? g.sw : g.en}</h2>
            <p className="mt-1 text-[0.8rem] text-muted">{g.needsAccount ? (sw ? "Inahitaji akaunti ya timu" : "Needs a team account") : (sw ? "Hakuna akaunti inayohitajika" : "No account needed")}</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[0.93rem] text-ink">
              {g.steps.map((s) => <li key={s.en}>{sw ? s.sw : s.en} <Link className="whitespace-nowrap text-[0.85rem] underline" href={s.href}>{sw ? "Fungua" : "Open"}</Link></li>)}
            </ol>
          </section>
        ))}
      </div>

      <section className="plat-card mt-6 p-4 text-[0.93rem] sm:p-5">
        <h2 className="font-serif text-xl text-ink">{sw ? "Kitu kikiharibika" : "When something goes wrong"}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
          <li>{sw ? "Mabadiliko yenye kosa: yarudishe kutoka" : "A wrong change: revert it from the"} <Link className="underline" href="/history">{sw ? "historia ya mabadiliko" : "change history"}</Link>.</li>
          <li>{sw ? "Tovuti haipatikani: endelea kusoma kurasa ulizofungua awali, na umpe mratibu wako ripoti kwa simu. Angalia" : "The site is down: keep reading the pages you opened before, and give your report to your coordinator by phone. Check"} <Link className="underline" href="/status">{sw ? "hali ya jukwaa" : "platform status"}</Link>.</li>
          <li>{sw ? "Jina au namba ya simu imeandikwa mahali isipostahili: mjulishe Firefly mara moja." : "A name or phone number got onto the platform: tell Firefly at once."} <Link className="underline" href="/privacy">{sw ? "Faragha" : "Privacy"}</Link></li>
        </ul>
      </section>
    </>
  );
}
