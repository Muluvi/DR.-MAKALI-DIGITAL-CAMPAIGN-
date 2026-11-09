import { redirect } from "next/navigation";
import { network } from "@/lib/network/server";
import { canManageFlags } from "@/lib/network/policy";
import { WARD_BY_CODE } from "@/lib/network/reference";
import { PageHead } from "@/components/platform/PageHead";
import { FlagForm, FlagManage } from "@/components/network/tool";

/**
 * Skip-level: misconduct, a safety threat, or a coordinator who is not responding goes straight to
 * Campaign Command, whoever the sender reports to. Command names an owner and closes it.
 */
export default async function Flags() {
  const { svc, actor } = await network();
  if (actor.kind !== "person") redirect("/network/sign-in");
  const command = canManageFlags(actor);
  const flags = await svc.flags();
  const members = command ? (await svc.people()).filter((p) => p.roles.some((r) => r.active && r.kind === "command_member")).map((p) => ({ id: p.person.id, name: p.person.name })) : [];
  return (
    <>
      <PageHead kicker={command ? "Urgent flags" : "Report misconduct"} title={command ? "Flags sent straight to Command" : "Tell Campaign Command directly"} lead="Money or goods to voters, collecting voter cards or IDs, intimidation, ethnic messaging, a threat to someone's safety, or a coordinator who has stopped responding. It skips your coordinator." />
      <div className="plat-card p-5"><FlagForm /></div>
      <ul className="nw-list mt-8">
        {flags.map((f) => (
          <li key={f.id} className="nw-row">
            <header><b>{f.kind === "unresponsive" ? "Coordinator not responding" : f.kind === "safety" ? "Safety" : "Misconduct"}</b><small>{f.state} · {f.created_at.slice(0, 10)}{f.ward_code ? ` · ${WARD_BY_CODE.get(f.ward_code)?.ward} ward` : ""}{f.owner_person_id ? " · owner named" : " · no owner yet"}</small></header>
            <p>{f.details}</p>
            {f.resolution && <small>Resolved: {f.resolution}</small>}
            {command && <FlagManage id={f.id} owner={f.owner_person_id} state={f.state} members={members} />}
          </li>
        ))}
        {!flags.length && <li className="text-muted">No flags.</li>}
      </ul>
    </>
  );
}
