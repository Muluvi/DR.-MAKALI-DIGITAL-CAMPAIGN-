import type { EditStatus } from "@/lib/platform/github";

export interface HistoryRow {
  id: string;
  at: string;
  actor: string;
  title: string;
  where: string;
  action: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  archived: boolean;
  status: EditStatus | null;
  commitUrl: string | null;
  reverted: boolean;
}

const VERB: Record<string, string> = { create: "added", update: "changed", revert: "reverted", "pack-edit": "edited", "pack-revert": "reverted" };
const STATE: Record<EditStatus["state"], string> = { checking: "Being checked", live: "Live", rejected: "Refused by the checks", unknown: "Submitted" };
const show = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v));

function Diff({ before, after }: { before: Record<string, unknown> | null; after: Record<string, unknown> | null }) {
  const keys = [...new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])].filter((k) => show(before?.[k]) !== show(after?.[k]));
  if (!keys.length) return null;
  return (
    <dl className="mt-2 grid gap-1 text-[0.8rem]">
      {keys.slice(0, 12).map((k) => (
        <div key={k} className="grid grid-cols-[minmax(0,32%)_1fr] gap-2">
          <dt className="truncate text-muted">{k}</dt>
          <dd className="min-w-0 break-words">
            {before && k in before && <del className="text-muted">{show(before[k])}</del>}
            {before && k in before && after && k in after && " → "}
            {after && k in after && <ins className="no-underline text-ink">{show(after[k])}</ins>}
          </dd>
        </div>
      ))}
      {keys.length > 12 && <p className="text-muted">and {keys.length - 12} more fields</p>}
    </dl>
  );
}

/** The change history, read-only. */
export function HistoryList({ rows }: { rows: HistoryRow[] }) {
  if (!rows.length) return <p className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">No changes yet.</p>;
  return (
    <ol className="space-y-3">
      {rows.map((r) => (
        <li key={r.id} className="plat-card p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[0.95rem] text-ink"><strong>{r.actor}</strong> {VERB[r.action] ?? r.action} <span className="font-semibold">{r.title}</span>{r.archived ? " (hidden)" : ""}</p>
            <time dateTime={r.at} className="text-[0.75rem] tabular-nums text-muted">{r.at.slice(0, 16).replace("T", " ")}</time>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.75rem] text-muted">
            <span>{r.where}</span>
            {r.status && <span className={`plat-chip plat-status-${r.status.state}`}>{STATE[r.status.state]}</span>}
            {r.status?.url && <a className="text-accent" href={r.status.url}>Why</a>}
            {r.commitUrl && <a className="text-accent" href={r.commitUrl}>Commit</a>}
            {r.reverted && <span className="plat-chip">Reverted</span>}
          </p>
          {r.status?.detail && <p className="mt-1 text-[0.8rem] text-muted">{r.status.detail}</p>}
          <Diff before={r.before} after={r.after} />
        </li>
      ))}
    </ol>
  );
}
