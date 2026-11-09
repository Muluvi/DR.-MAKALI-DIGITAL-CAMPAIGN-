import { redirect } from "next/navigation";
import { network } from "@/lib/network/server";
import { canIssueTasks, isCommand } from "@/lib/network/policy";
import { channelsFromEnv } from "@/lib/network/channels";
import { SITE_OBJECTIVES, objectiveLabel } from "@/lib/network/objectives";
import { ROLE_LABEL } from "@/lib/network/structure";
import { WARD_BY_CODE, VILLAGE_BY_CODE } from "@/lib/network/reference";
import { GROUP_TYPE_BY_ID } from "@/lib/network/groups";
import type { Target } from "@/lib/network/types";
import { PageHead } from "@/components/platform/PageHead";
import { AssignmentControls, ClashForm, TaskForm } from "@/components/network/tool";

const targetText = (t: Target) =>
  [
    t.level ? `${t.level} seats` : null,
    t.role ? ROLE_LABEL[t.role] : null,
    t.group_type ? GROUP_TYPE_BY_ID[t.group_type]?.label : null,
    t.constituency ?? null,
    t.ward_code ? `${WARD_BY_CODE.get(t.ward_code)?.ward} ward` : null,
    t.village_code ? VILLAGE_BY_CODE.get(t.village_code)?.village_name : null,
  ].filter(Boolean).join(" · ") || "Every seat";

export default async function Tasks() {
  const { svc, actor } = await network();
  if (actor.kind !== "person") redirect("/network/sign-in");
  const command = canIssueTasks(actor);
  const [mine, followed, templates, clashes] = await Promise.all([
    svc.myAssignments(),
    svc.tasks().catch(() => []),
    command ? svc.templates() : Promise.resolve([]),
    isCommand(actor) ? svc.clashes() : Promise.resolve([]),
  ]);
  const ch = channelsFromEnv();
  return (
    <>
      <PageHead kicker="Tasks" title={command ? "Allocate duties" : "Tasks"} lead={command ? "Target by level, area, role or group type. Each task names the objective it serves." : "Your tasks, and the tasks of the people in your area."}>
        <p className="mt-2 text-[0.8rem] text-muted">Channels: in the app always. WhatsApp {ch.whatsapp.configured ? "connected" : "not connected"} · USSD push {ch.ussd.configured ? "connected" : "not connected"}. Nothing is shown as sent unless the provider accepted it.</p>
      </PageHead>
      {command && <div className="plat-card p-5"><TaskForm templates={templates} objectives={SITE_OBJECTIVES} /></div>}
      {clashes.length > 0 && (
        <section className="mt-8" aria-labelledby="clashes">
          <h2 id="clashes" className="font-serif text-[1.4rem] text-ink">Clashes between group and geographic tasks</h2>
          <ul className="nw-list mt-3">
            {clashes.map((c) => (
              <li key={`${c.geo.id}-${c.group.id}`} className="nw-row">
                <p>One person has a group-chain task and a village task both due {c.due}.</p>
                <ClashForm ids={[c.geo.id, c.group.id]} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {mine.length > 0 && (
        <section className="mt-8" aria-labelledby="mine">
          <h2 id="mine" className="font-serif text-[1.4rem] text-ink">Mine</h2>
          <ul className="nw-list mt-3">
            {mine.map(({ assignment: a, task: t }) => (
              <li key={a.id} className="nw-row">
                <header><b>{t.title}</b><small>Due {t.due} · {a.state}{a.clash_decision ? ` · Command: ${a.clash_decision}` : ""}</small></header>
                <p>{t.instructions}</p>
                <small>Evidence: {t.evidence} · {objectiveLabel(t.objective)}</small>
                <AssignmentControls id={a.id} state={a.state} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="mt-8" aria-labelledby="followed">
        <h2 id="followed" className="font-serif text-[1.4rem] text-ink">{command ? "Every task" : "In your area"}</h2>
        <ul className="nw-list mt-3">
          {followed.map(({ task: t, funnel, deliveries }) => (
            <li key={t.id} className="nw-row">
              <header><b>{t.title}</b><small>Due {t.due} · {targetText(t.target)} · {t.chain === "group" ? "group chain" : "geographic chain"}</small></header>
              <small>{objectiveLabel(t.objective)}</small>
              <div className="nw-funnel" role="img" aria-label={`Assigned ${funnel.stages[0].value}, acknowledged ${funnel.stages[1].value}, done ${funnel.stages[2].value}`}>
                {funnel.stages.map((s, i) => (
                  <div key={s.label} style={{ width: `${100 - i * 20}%` }}>{s.label}<span>{s.value}</span></div>
                ))}
              </div>
              <small>{funnel["In progress"]} in progress · {funnel.Blocked} blocked · {deliveries.in_app} in the app · {deliveries.sent} accepted by WhatsApp or USSD</small>
              {deliveries.failed.length > 0 && <p className="nw-failed">{deliveries.failed.length} sends failed: {[...new Set(deliveries.failed.map((d) => d.error))].join(" ")}</p>}
            </li>
          ))}
          {!followed.length && <li className="text-muted">No tasks yet.</li>}
        </ul>
      </section>
    </>
  );
}
