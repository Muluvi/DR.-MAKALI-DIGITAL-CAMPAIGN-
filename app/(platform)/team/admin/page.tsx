import { notFound, redirect } from "next/navigation";
import { teamLoginEnabled } from "@/lib/platform/config";
import { getSession, readStore } from "@/lib/platform/auth";
import { PageHead } from "@/components/platform/PageHead";
import { MemberAdmin } from "@/components/platform/MemberAdmin";

export const metadata = { title: "Team accounts | Kitui 2027", robots: { index: false, follow: false } };

export default async function Admin() {
  // Sign-in is switched off: the site is open to view, and the team pages are not served.
  if (!teamLoginEnabled()) notFound();
  const session = await getSession().catch(() => null);
  if (!session) redirect("/team/login");
  if (session.role !== "firefly") redirect("/workspace");
  const members = (await readStore()!.members()).map(({ email, name, role, active, addedAt }) => ({ email, name, role, active, addedAt }));
  return (
    <>
      <PageHead kicker="Firefly · platform owner" title="Team accounts" lead="Add the people on Dr. Mulu's team who edit the platform, and remove anyone who should no longer. A removed account loses edit access on its next request. Viewing never needs an account." />
      <MemberAdmin members={members} self={session.email} />
    </>
  );
}
