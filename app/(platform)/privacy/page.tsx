import Link from "next/link";
import { PageHead } from "@/components/platform/PageHead";
import { teamLoginEnabled } from "@/lib/platform/config";

export const metadata = { title: "Privacy | Kitui 2027", robots: { index: false, follow: false } };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="plat-card mt-4 p-4 text-[0.95rem] leading-relaxed sm:p-5">
    <h2 className="font-serif text-xl text-ink">{title}</h2>
    <div className="mt-2 space-y-2 text-muted">{children}</div>
  </section>
);

export default function PrivacyPage() {
  const login = teamLoginEnabled();
  return (
    <>
      <PageHead kicker="Privacy" title="What this site holds, and about whom" lead="The site is open to anyone with the link. That is why it is built to hold almost nothing about people: counts, not names." />

      <Section title="Visitors">
        <p>Reading the site needs no account. The site sets no advertising or tracking cookies and runs no analytics service. Your browser keeps two preferences on your own device, the colour theme and the reading mode, and they never leave it.</p>
        <p>The models run in your browser. What you set or type in them is not sent to the site or stored; a model&apos;s settings go into the page address only so you can share them, and the send check never puts its message text there.</p>
      </Section>

      <Section title="Dr. Mulu's team">
        <p>{login ? "Team sign-in is switched on." : "Team sign-in is switched off at present; when it is switched on, the following applies."} For each team member the platform holds a name, an email address, a role (team or Firefly) and whether the account is active, and keeps a sign-in session cookie on the member&apos;s own device.</p>
        <p>Every change is logged with the name of the member who made it, and the change history is open to anyone with the link, like the rest of the site. The email address is not shown. When a member leaves, their account is closed on the campaign&apos;s request; the records they made stay, because the campaign&apos;s record must stay whole.</p>
        <p>The campaign is the controller of its staff&apos;s details and Firefly holds them as processor, under the processing agreement set out in Lawful and ethical. Nothing is deleted from the platform: a mistaken change is reverted, and the revert is itself logged.</p>
      </Section>

      <Section title="People the campaign works with">
        <p>No supporter, voter, volunteer or agent is named on the platform. The workspace forms refuse a phone number, an ID number or an email address typed into any free-text field, and the training says why. Supporter and voter records stay in the campaign&apos;s own systems, which this platform does not reach.</p>
      </Section>

      <Section title="The planned AI layer">
        <p>It is not switched on. When it is, it will send a model&apos;s settings and its result to an AI service to set options from a sentence and explain an outcome, never a name or a phone number, and nothing typed will be stored unless a team member saves the scenario. It will be assessed by the campaign&apos;s data-protection reviewer before it is switched on, and this page will say which service it uses.</p>
      </Section>

      <p className="mt-6 text-[0.9rem] text-muted">Questions about the platform go to Firefly; questions about the campaign&apos;s own data go to the campaign&apos;s data-protection lead. <Link className="underline" href="/help">Help and role guides</Link> · <Link className="underline" href="/status">Platform status</Link></p>
    </>
  );
}
