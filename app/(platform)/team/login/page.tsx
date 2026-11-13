import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/platform/auth";
import { platformMode, teamLoginEnabled } from "@/lib/platform/config";
import { PageHead } from "@/components/platform/PageHead";
import { LoginForm } from "@/components/platform/LoginForm";

export const metadata = { title: "Team sign-in | Kitui 2027", robots: { index: false, follow: false } };

export default async function Login() {
  // Sign-in is switched off: the site is open to view, and the team pages are not served.
  if (!teamLoginEnabled()) notFound();
  if (await getSession().catch(() => null)) redirect("/workspace");
  const mode = platformMode();
  return (
    <div className="mx-auto max-w-md">
      <PageHead kicker="Dr. Mulu's team" title="Sign in to edit" lead="You do not need an account to view anything on this site. Sign in only to add or change records and data." />
      {mode === "off" ? (
        <p className="plat-card p-4 text-muted">Team sign-in is not switched on yet. Firefly connects it when the platform&apos;s database is set up.</p>
      ) : (
        <LoginForm passwordFirst={mode === "local"} />
      )}
    </div>
  );
}
