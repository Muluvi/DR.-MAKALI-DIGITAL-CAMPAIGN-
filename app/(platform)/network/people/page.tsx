import { redirect } from "next/navigation";
import { network } from "@/lib/network/server";
import { canManageRole, isCommand, NotAllowed } from "@/lib/network/policy";
import { scopeFor, seatLabel } from "@/lib/network/scope";
import { PageHead } from "@/components/platform/PageHead";
import { EligibilityButtons, PersonActions, RegisterForm } from "@/components/network/tool";

/** The people in the signed-in person's area, with contacts. Viewing this list is logged. */
export default async function People() {
  const { svc, actor } = await network();
  if (actor.kind !== "person") redirect("/network/sign-in");
  const scope = scopeFor(actor, await svc.groups());
  // Dr. Makali's own view is the digest: the service refuses him the list, and he goes back to it.
  const people = await svc.people().catch((e) => {
    if (e instanceof NotAllowed) redirect("/network");
    throw e;
  });
  const command = isCommand(actor);
  const review = people.filter((p) => p.person.status === "active" && p.person.eligibility === "review");
  const active = people.filter((p) => p.person.status === "active" && p.person.eligibility === "cleared");
  return (
    <>
      <PageHead kicker="People" title="Register a campaigner" lead="Record consent and the declaration, then the seat. Never collect ID numbers, voter card numbers, or how anyone intends to vote." />
      {scope.kinds.length > 0 && <div className="plat-card p-5"><RegisterForm scope={scope} /></div>}
      {command && review.length > 0 && (
        <section className="mt-8" aria-labelledby="review">
          <h2 id="review" className="font-serif text-[1.4rem] text-ink">Awaiting Command: paid from public funds, or unsure</h2>
          <ul className="nw-list mt-3">
            {review.map((p) => (
              <li key={p.person.id} className="nw-row">
                <header><b>{p.person.name}</b><small>{p.person.public_funds_role.replace(/_/g, " ")}</small></header>
                <small>{p.roles.map(seatLabel).join(" · ")}</small>
                <EligibilityButtons personId={p.person.id} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="mt-8" aria-labelledby="register">
        <h2 id="register" className="font-serif text-[1.4rem] text-ink">In your area: {active.length} {active.length === 1 ? "person" : "people"}</h2>
        <p className="text-[0.8rem] text-muted">Your view of this list is recorded in the audit log.</p>
        <ul className="nw-list mt-3">
          {active.map((p) => (
            <li key={p.person.id} className="nw-row">
              <header><b>{p.person.name}</b><small><a href={`tel:${p.person.phone}`} className="underline">{p.person.phone}</a></small></header>
              <small>Consent {p.person.consent.collected_at.slice(0, 10)} by {p.person.consent.collected_by}, {p.person.consent.channel.replace(/_/g, " ")} · kept until {p.person.retention_until}</small>
              <PersonActions
                personId={p.person.id}
                self={p.person.id === actor.person.id}
                command={command}
                scope={scope}
                roles={p.roles.map((r) => ({ id: r.id, kind: r.kind, active: r.active, is_primary: r.is_primary, label: seatLabel(r), manage: canManageRole(actor, r) }))}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
