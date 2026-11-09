import { redirect } from "next/navigation";
import { network } from "@/lib/network/server";
import { canBroadcast } from "@/lib/network/policy";
import { PageHead } from "@/components/platform/PageHead";
import { BroadcastForm, ReplyForm } from "@/components/network/tool";

/** Broadcasts down; replies up to the sender's ward coordinator, never to Dr. Makali's queue. */
export default async function Messages() {
  const { svc, actor } = await network();
  if (actor.kind !== "person") redirect("/network/sign-in");
  const inbox = await svc.inbox();
  return (
    <>
      <PageHead kicker="Messages" title={canBroadcast(actor) ? "Broadcast and replies" : "Messages"} lead="A reply goes to your ward coordinator, or the next seat up your line." />
      {canBroadcast(actor) && <div className="plat-card p-5"><BroadcastForm /></div>}
      <ul className="nw-list mt-8">
        {inbox.map((m) => (
          <li key={m.id} className="nw-row">
            <header><b>{m.kind === "reply" ? "Reply" : m.voice === "candidate" ? "From Dr. Makali" : "From Campaign Command"}</b><small>{m.created_at.slice(0, 16).replace("T", " ")}</small></header>
            <p>{m.body}</p>
            {m.kind === "broadcast" && m.from_person_id !== actor.person.id && <ReplyForm messageId={m.id} />}
          </li>
        ))}
        {!inbox.length && <li className="text-muted">No messages.</li>}
      </ul>
    </>
  );
}
