import type { Digest } from "@/lib/network/service";
import { group } from "@/lib/data/format";
import { FieldSignal } from "./FieldSignal";

/** Dr. Makali's one screen, with live numbers. Totals and states only: no name, no report, no queue. */
export function DigestView({ d }: { d: Digest }) {
  const atMin = d.coverage.villages["Minimum met"] + d.coverage.villages["Above minimum"];
  const flags = d.open_flags.safety + d.open_flags.misconduct + d.open_flags.unresponsive;
  return (
    <section aria-label="Digest" className="nw-digest">
      <div><h5>Seats held</h5><p className="big">{group(d.coverage.filled_to_target)}<small className="text-[0.8rem] text-muted"> / {group(d.coverage.required)}</small></p><p className="text-[0.75rem] text-muted">{d.coverage.state}</p></div>
      <div><h5>Villages at minimum</h5><p className="big">{group(atMin)}<small className="text-[0.8rem] text-muted"> / {group(d.coverage.villages_total)}</small></p><p className="text-[0.75rem] text-muted">{group(d.coverage.villages.Vacant)} vacant</p></div>
      <div><h5>People in the network</h5><p className="big">{group(d.unique_people)}</p><p className="text-[0.75rem] text-muted">each counted once{d.pending_review ? `; ${d.pending_review} awaiting Command` : ""}</p></div>
      <div><h5>Tasks</h5><p className="big">{group(d.funnel.Done)}<small className="text-[0.8rem] text-muted"> done of {group(d.funnel.stages[0].value)}</small></p><p className="text-[0.75rem] text-muted">{group(d.funnel.stages[1].value)} acknowledged · {group(d.funnel.Blocked)} blocked</p></div>
      <div className="wide">
        <h5>Constituencies</h5>
        <ul className="nw-legend">
          {d.constituencies.map((c) => (
            <li key={c.constituency}><span className="nw-state" data-s={c.state}>{c.constituency}</span>&nbsp;{group(c.filled_to_target)}/{group(c.required)} seats · {group(c.reports_7d)} {c.reports_7d === 1 ? "report" : "reports"} this week</li>
          ))}
        </ul>
      </div>
      <div className="wide">
        <h5><FieldSignal /> This week</h5>
        <p className="text-[0.9rem]">{group(d.reports_7d)} {d.reports_7d === 1 ? "report" : "reports"} · {group(d.people_reached_7d)} {d.people_reached_7d === 1 ? "person" : "people"} reached{d.top_issues_7d.length ? ` · issues raised most: ${d.top_issues_7d.map((i) => `${i.issue} (${i.count})`).join(", ")}` : ""}</p>
        <p className="text-[0.75rem] text-muted">What campaigners saw and heard. Not opinion research, not a vote estimate, not official data.</p>
      </div>
      <div className="wide">
        <h5>Open urgent flags</h5>
        <p className="text-[0.9rem]">{flags ? `${d.open_flags.safety} safety · ${d.open_flags.misconduct} misconduct · ${d.open_flags.unresponsive} unresponsive coordinator` : "None open"}</p>
        <p className="text-[0.75rem] text-muted">Women or young people hold a seat in {group(d.women_or_youth_villages.met)} of {group(d.women_or_youth_villages.of)} staffed villages (a target, not a rule).</p>
      </div>
    </section>
  );
}
