import Link from "next/link";
import { PageHead } from "@/components/platform/PageHead";

export const metadata = { title: "Privacy | Kitui 2027", robots: { index: false, follow: false } };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="plat-card mt-4 p-4 text-[0.95rem] leading-relaxed sm:p-5">
    <h2 className="font-serif text-xl text-ink">{title}</h2>
    <div className="mt-2 space-y-2 text-muted">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <>
      <PageHead kicker="Privacy" title="What this site holds, and about whom" lead="The site is open to anyone with the link. That is why it is built to hold almost nothing about people: counts, not names." />

      <Section title="Visitors">
        <p>Reading the site needs no account. The site sets no advertising or tracking cookies and runs no analytics service. Your browser keeps two preferences on your own device, the colour theme and the reading mode, and they never leave it.</p>
        <p>The models run in your browser. What you set or type in them is not sent to the site or stored; a model&apos;s settings go into the page address only so you can share them, and the send check never puts its message text there.</p>
      </Section>

      <Section title="People who add or change records">
        <p>There are no accounts and no sign-in, so the platform holds nothing about who edits: no name, no email address, no password. Every change is logged with the time and what changed, attributed only to &quot;anyone with the link&quot;, and the change history is open to everyone like the rest of the site.</p>
        <p>To stop one visitor flooding the records, the server counts each connection&apos;s saves for a short while, in memory only; nothing about the connection is written down. Nothing is deleted from the platform: a mistaken or unwanted change is put back, and that is logged too.</p>
      </Section>

      <Section title="People the campaign works with">
        <p>No supporter, voter, volunteer or agent is named on the platform. The workspace forms refuse a phone number, an ID number or an email address typed into any free-text field, and the training says why. Supporter and voter records stay in the campaign&apos;s own systems, which this platform does not reach.</p>
      </Section>

      <Section title="The models' instruction boxes">
        <p>What you type into a model&apos;s instruction box is read on your own device, by rule. It is not sent to Firefly or to any AI service, and it is not stored; leaving or reloading the page clears it. No AI service is used anywhere on the site.</p>
      </Section>

      <p className="mt-6 text-[0.9rem] text-muted">Questions about the platform go to Firefly; questions about the campaign&apos;s own data go to the campaign&apos;s data-protection lead. <Link className="underline" href="/help">Help and role guides</Link> · <Link className="underline" href="/status">Platform status</Link></p>
    </>
  );
}
