import { notFound } from "next/navigation";
import { networkActor, networkPrivateEnabled } from "@/lib/network/server";
import { isCandidate, isCommand, type Actor } from "@/lib/network/policy";
import { NetworkNav } from "@/components/network/nav";

export const dynamic = "force-dynamic";
export const metadata = { title: "Campaigner network | Kitui 2027", robots: { index: false, follow: false }, referrer: "no-referrer" as const };

/**
 * The private Campaigner Network tool, inside the existing platform shell. Every page here reads or
 * writes personal data, so the whole tree answers 404 until NETWORK_PRIVATE=on (lib/network/server.ts).
 */
function linksFor(a: Actor): { href: string; label: string }[] {
  if (a.kind === "firefly") return [{ href: "/network", label: "Appoint Command" }];
  if (a.kind !== "person") return [];
  const command = isCommand(a);
  const onlyCandidate = isCandidate(a) && !command && a.roles.filter((r) => r.active).every((r) => r.kind === "candidate");
  if (onlyCandidate) return [{ href: "/network", label: "Digest" }, { href: "/network/messages", label: "Messages" }];
  const coordinator = command || a.roles.some((r) => r.active && /coordinator|deputy|group_(county|constituency)_lead|group_ward_rep/.test(r.kind));
  return [
    { href: "/network", label: command ? "Digest" : "My work" },
    ...(coordinator ? [{ href: "/network/coverage", label: "Coverage" }, { href: "/network/people", label: "People" }] : []),
    { href: "/network/tasks", label: "Tasks" },
    { href: "/network/report", label: "Report" },
    { href: "/network/groups", label: "Groups" },
    { href: "/network/messages", label: "Messages" },
    { href: "/network/flags", label: command ? "Urgent flags" : "Report misconduct" },
    ...(coordinator ? [{ href: "/network/admin", label: command ? "Settings and audit" : "Targets" }] : []),
  ];
}

export default async function NetworkLayout({ children }: { children: React.ReactNode }) {
  if (!networkPrivateEnabled()) notFound();
  const actor = await networkActor();
  return (
    <div>
      <NetworkNav links={linksFor(actor)} />
      {children}
    </div>
  );
}
