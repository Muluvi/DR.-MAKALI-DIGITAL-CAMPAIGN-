import { redirect } from "next/navigation";
import { network } from "@/lib/network/server";
import { scopeFor, seatLabel } from "@/lib/network/scope";
import { VILLAGES, WARD_BY_CODE } from "@/lib/network/reference";
import { PageHead } from "@/components/platform/PageHead";
import { FieldSignal } from "@/components/network/FieldSignal";
import { ReportForm } from "@/components/network/tool";

/** The phone-first field report, and the reports and summaries the person's seats may read. */
export default async function Report() {
  const { svc, actor } = await network();
  if (actor.kind !== "person") redirect("/network/sign-in");
  const seats = actor.roles.filter((r) => r.active && r.kind !== "candidate");
  const scope = scopeFor(actor);
  const [mine, reports, rollup] = await Promise.all([svc.myAssignments(), svc.reports(), svc.rollup()]);
  const wards = new Set([...seats.map((r) => r.ward_code).filter(Boolean), ...scope.wards]);
  const villages = VILLAGES.filter((v) => wards.has(v.ward_code)).map((v) => ({ code: v.village_code, name: `${v.village_name}, ${v.ward}` }));
  return (
    <>
      <PageHead kicker="Field report" title="What did you do today?" lead="It goes to your ward coordinator, up your own line.">
        <p className="mt-2"><FieldSignal /> <span className="text-[0.8rem] text-muted">Reports are field signals: what campaigners saw and heard. Never opinion research, vote estimates or official data.</span></p>
      </PageHead>
      {seats.length > 0 && (
        <div className="plat-card p-5">
          <ReportForm roles={seats.map((r) => ({ id: r.id, label: seatLabel(r) }))} tasks={mine.filter((x) => x.assignment.state !== "Done").map((x) => ({ id: x.task.id, title: x.task.title }))} villages={villages} />
        </div>
      )}
      {rollup.wards.length > 0 && (
        <section className="mt-8" aria-labelledby="rollup">
          <h2 id="rollup" className="font-serif text-[1.4rem] text-ink">Summaries you can see</h2>
          <div className="nw-matrix-wrap mt-3" tabIndex={0} role="region" aria-label="Field signal summaries by ward">
            <table className="nw-matrix">
              <thead><tr><th scope="col">Ward</th><th scope="col">Reports</th><th scope="col">People reached</th><th scope="col">Follow-ups</th><th scope="col">Issues raised</th></tr></thead>
              <tbody>
                {rollup.wards.map((w) => (
                  <tr key={w.key}><th scope="row">{WARD_BY_CODE.get(Number(w.key))?.ward}</th><td className="num">{w.reports}</td><td className="num">{w.people_reached}</td><td className="num">{w.follow_ups}</td><td>{Object.entries(w.issues).map(([k, n]) => `${k} ${n}`).join(", ") || "—"}</td></tr>
                ))}
                <tr><th scope="row">Total</th><td className="num">{rollup.county.reports}</td><td className="num">{rollup.county.people_reached}</td><td className="num">{rollup.county.follow_ups}</td><td>{Object.entries(rollup.county.issues).map(([k, n]) => `${k} ${n}`).join(", ") || "—"}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section className="mt-8" aria-labelledby="reports">
        <h2 id="reports" className="font-serif text-[1.4rem] text-ink">Reports</h2>
        <ul className="nw-list mt-3">
          {reports.slice(0, 100).map((r) => (
            <li key={r.id} className="nw-row">
              <header><span><FieldSignal /> <b>{WARD_BY_CODE.get(r.ward_code)?.ward}</b></span><small>{r.created_at.slice(0, 16).replace("T", " ")} · {r.channel}</small></header>
              <p>{r.activity}</p>
              <small>{r.people_reached} people reached{r.issue_category ? ` · ${r.issue_category}` : ""}{r.issue_text ? `: ${r.issue_text}` : ""}{r.follow_up ? ` · follow-up: ${r.follow_up_note ?? "needed"}` : ""}</small>
              {r.photo_path && <a className="underline text-[0.8rem]" href={`/api/network/photo?report=${r.id}`} target="_blank" rel="noreferrer">View photo</a>}
            </li>
          ))}
          {!reports.length && <li className="text-muted">No reports yet.</li>}
        </ul>
      </section>
    </>
  );
}
