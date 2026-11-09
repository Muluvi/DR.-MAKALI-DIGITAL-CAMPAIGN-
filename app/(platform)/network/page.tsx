import Link from "next/link";
import { redirect } from "next/navigation";
import { network } from "@/lib/network/server";
import { canReadDigest, isCandidate, isCommand } from "@/lib/network/policy";
import { scopeFor, seatLabel } from "@/lib/network/scope";
import { objectiveLabel } from "@/lib/network/objectives";
import { PageHead } from "@/components/platform/PageHead";
import { DigestView } from "@/components/network/DigestView";
import { AssignmentControls, RegisterForm } from "@/components/network/tool";
import { signOutNetwork } from "./actions";

export default async function NetworkHome() {
  const { svc, actor } = await network();
  if (actor.kind === "anonymous") redirect("/network/sign-in");

  if (actor.kind === "firefly") {
    return (
      <>
        <PageHead kicker="Campaigner network · Firefly" title="Appoint the first Campaign Command members" lead="As the platform's owner, Firefly can appoint Campaign Command and record Dr. Makali's seat. Nothing else: Firefly cannot read the register, tasks or reports." />
        <div className="plat-card p-5"><RegisterForm scope={scopeFor(actor)} /></div>
      </>
    );
  }

  const seats = actor.roles.filter((r) => r.active);
  const digest = canReadDigest(actor) ? await svc.digest() : null;
  const mine = await svc.myAssignments();
  const open = mine.filter((x) => x.assignment.state !== "Done");
  const onlyCandidate = isCandidate(actor) && !isCommand(actor) && seats.every((r) => r.kind === "candidate");
  return (
    <>
      <PageHead kicker="Campaigner network" title={`Welcome, ${actor.person.name.split(" ")[0]}`} lead={seats.length ? seats.map(seatLabel).join(" · ") : "Your seat is waiting for Campaign Command to clear the declaration."}>
        <form action={signOutNetwork} className="mt-3"><button className="plat-btn plat-btn-sm" type="submit">Sign out</button></form>
      </PageHead>
      {digest && <DigestView d={digest} />}
      {!onlyCandidate && (
        <section className="mt-6" aria-labelledby="my-tasks">
          <h2 id="my-tasks" className="font-serif text-[1.4rem] text-ink">My tasks</h2>
          {open.length ? (
            <ul className="nw-list mt-3">
              {open.map(({ assignment: a, task: t }) => (
                <li key={a.id} className="nw-row">
                  <header><b>{t.title}</b><small>Due {t.due} · {a.state}</small></header>
                  <p>{t.instructions}</p>
                  <small>Evidence: {t.evidence} · {objectiveLabel(t.objective)}</small>
                  <AssignmentControls id={a.id} state={a.state} />
                </li>
              ))}
            </ul>
          ) : <p className="mt-2 text-muted">No open tasks.</p>}
          <div className="nw-actions mt-4">
            <Link href="/network/report" className="plat-btn plat-btn-solid">Send a field report</Link>
            <Link href="/network/flags" className="plat-btn">Report misconduct or a safety threat</Link>
          </div>
        </section>
      )}
    </>
  );
}
