import { redirect } from "next/navigation";
import { network } from "@/lib/network/server";
import { canEditGroup } from "@/lib/network/policy";
import { scopeFor } from "@/lib/network/scope";
import { GROUP_TYPES, GROUP_TYPE_BY_ID } from "@/lib/network/groups";
import { WARD_BY_CODE } from "@/lib/network/reference";
import { PageHead } from "@/components/platform/PageHead";
import { GroupForm } from "@/components/network/tool";

export default async function Groups() {
  const { svc, actor } = await network();
  if (actor.kind !== "person") redirect("/network/sign-in");
  const groups = await svc.groups();
  const scope = scopeFor(actor, groups);
  const canAdd = GROUP_TYPES.some((t) => scope.wards.some((w) => canEditGroup(actor, { type: t.id, constituency: WARD_BY_CODE.get(w)!.constituency, ward_code: w, id: "" })));
  return (
    <>
      <PageHead kicker="Special groups" title="Groups in your area" lead="Boda boda stages, congregations, chamas and associations, each linked to a ward. Leaders take part as individuals who opt in." />
      {canAdd && <div className="plat-card p-5"><GroupForm wards={scope.wards} /></div>}
      <ul className="nw-list mt-8">
        {groups.map((g) => (
          <li key={g.id} className="nw-row">
            <header><b>{g.name}</b><small>{GROUP_TYPE_BY_ID[g.type]?.label} · {g.level}{g.ward_code ? ` · ${WARD_BY_CODE.get(g.ward_code)?.ward} ward` : g.constituency ? ` · ${g.constituency}` : ""}</small></header>
            <small>{g.activation}{g.approx_members !== null ? ` · about ${g.approx_members} members` : ""} · consent {g.consent_status.replace("_", " ")}{g.endorsement_confirmed_in_writing ? ` · endorsement confirmed in writing (${g.endorsement_reference})` : ""}</small>
            {g.access === "full" && g.leader_name && <small>Leader: {g.leader_name}{g.leader_phone ? `, ${g.leader_phone}` : ""}</small>}
          </li>
        ))}
        {!groups.length && <li className="text-muted">No groups recorded in your area.</li>}
      </ul>
    </>
  );
}
