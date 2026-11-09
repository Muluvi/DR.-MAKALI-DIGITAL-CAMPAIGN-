import { redirect } from "next/navigation";
import { network } from "@/lib/network/server";
import { canExport, canReadAudit, isCommand } from "@/lib/network/policy";
import { scopeFor } from "@/lib/network/scope";
import { SITE_OBJECTIVES } from "@/lib/network/objectives";
import { VILLAGE_BY_CODE, WARD_BY_CODE } from "@/lib/network/reference";
import { PageHead } from "@/components/platform/PageHead";
import { AliasForm, RetentionForm, TargetForm, TemplateForm } from "@/components/network/tool";

/** Targets and spellings for coordinators; templates, retention, exports, the audit log and the launch checklist for Command. */
export default async function Admin() {
  const { svc, actor } = await network();
  if (actor.kind !== "person") redirect("/network/sign-in");
  const scope = scopeFor(actor, await svc.groups());
  const command = isCommand(actor);
  const [targets, aliases, templates, settings, log] = await Promise.all([
    svc.targets(),
    svc.aliases(),
    command ? svc.templates() : Promise.resolve([]),
    svc.settings(),
    canReadAudit(actor) ? svc.auditLog(200) : Promise.resolve([]),
  ]);
  const mine = (unit: "ward" | "village", code: number) => scope.wards.includes(unit === "ward" ? code : VILLAGE_BY_CODE.get(code)?.ward_code ?? 0);
  return (
    <>
      <PageHead kicker="Settings" title={command ? "Settings, exports and audit" : "Targets and local spellings"} lead="Targets only rise above the minimum of two per village. A local spelling finds a village; it never changes its official name or code." />
      {scope.wards.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="plat-card p-5" aria-labelledby="t"><h2 id="t" className="mb-3 font-serif text-[1.2rem]">Raise a target</h2><TargetForm wards={scope.wards} />
            <ul className="mt-3 text-[0.82rem]">{targets.filter((t) => mine(t.unit, t.code)).map((t) => <li key={t.id}>{t.unit === "ward" ? `${WARD_BY_CODE.get(t.code)?.ward} ward` : VILLAGE_BY_CODE.get(t.code)?.village_name}: {t.target} per village</li>)}</ul>
          </section>
          <section className="plat-card p-5" aria-labelledby="a"><h2 id="a" className="mb-3 font-serif text-[1.2rem]">Add a local spelling</h2><AliasForm wards={scope.wards} />
            <ul className="mt-3 text-[0.82rem]">{aliases.filter((a) => mine("village", a.village_code)).map((a) => <li key={a.id}>{a.alias} → {VILLAGE_BY_CODE.get(a.village_code)?.village_name}, {VILLAGE_BY_CODE.get(a.village_code)?.ward} ward</li>)}</ul>
          </section>
        </div>
      )}
      {command && (
        <>
          <section className="mt-8" aria-labelledby="launch">
            <h2 id="launch" className="font-serif text-[1.4rem] text-ink">Launch checklist</h2>
            <ul className="nw-checklist mt-2 text-[0.9rem]">
              <li><strong>Kenyan counsel</strong> confirms the campaign&rsquo;s registration with the ODPC as a data controller, the privacy notice read at consent, the treatment of political association as sensitive data under the Data Protection Act, 2019 and current ODPC guidance, and the retention date below. Not yet confirmed until counsel says so in writing.</li>
              <li>The access checks in docs/network/README.md pass against the live database.</li>
              <li>An SMS provider is connected to Supabase Auth for one-time codes.</li>
              <li>WhatsApp and USSD credentials are set, or the tool says they are not connected (it does).</li>
            </ul>
          </section>
          <section className="mt-8 plat-card p-5" aria-labelledby="ret"><h2 id="ret" className="mb-3 font-serif text-[1.2rem]">Retention</h2><RetentionForm current={settings.retention_until} /></section>
          {canExport(actor) && (
            <section className="mt-8" aria-labelledby="exp">
              <h2 id="exp" className="font-serif text-[1.4rem] text-ink">Exports</h2>
              <p className="text-[0.85rem] text-muted">Command only. Every export is recorded in the audit log. Store the file securely and delete it when done.</p>
              <div className="nw-actions mt-2">
                {/* Plain links on purpose: a <Link> would prefetch, and a prefetch would run (and log) an export. */}
                <a className="plat-btn" href="/api/network/export?kind=people" download>People and seats (CSV)</a>
                <a className="plat-btn" href="/api/network/export?kind=reports" download>Field signals (CSV)</a>
                <a className="plat-btn" href="/api/network/export?kind=coverage" download>Coverage by village (CSV)</a>
              </div>
            </section>
          )}
          <section className="mt-8" aria-labelledby="tpl">
            <h2 id="tpl" className="font-serif text-[1.4rem] text-ink">Task templates</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">{templates.map((t) => <div key={t.id} className="plat-card p-4"><TemplateForm t={t} objectives={SITE_OBJECTIVES} /></div>)}</div>
          </section>
          <section className="mt-8" aria-labelledby="audit">
            <h2 id="audit" className="font-serif text-[1.4rem] text-ink">Audit log</h2>
            <div className="nw-matrix-wrap mt-3" tabIndex={0} role="region" aria-label="Audit log">
              <table className="nw-matrix">
                <thead><tr><th scope="col">When</th><th scope="col">Who</th><th scope="col">Action</th><th scope="col">What</th></tr></thead>
                <tbody>{log.map((l) => <tr key={l.id}><th scope="row">{l.at.slice(0, 16).replace("T", " ")}</th><td>{l.actor_label}</td><td>{l.action.replace("_", " ")}</td><td>{l.detail}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}
