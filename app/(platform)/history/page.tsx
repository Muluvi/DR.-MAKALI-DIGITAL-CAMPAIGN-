import { COLLECTION_BY_ID } from "@/lib/platform/collections";
import { readStore } from "@/lib/platform/store";
import { editStatus, type EditStatus } from "@/lib/platform/github";
import { packMode } from "@/lib/platform/config";
import { PageHead } from "@/components/platform/PageHead";
import { HistoryList, type HistoryRow } from "@/components/platform/HistoryList";

export const metadata = { title: "Changes | Kitui 2027", robots: { index: false, follow: false } };

const DATASET_LABEL: Record<string, string> = {
  figure: "Figures", "figure-add": "Figures", "figure-remove-added": "Figures", ward: "Register", "register-totals": "Register",
  list: "Strategy lists", "list-add": "Strategy lists", "list-remove-added": "Strategy lists", analysis: "Analysis",
};

export default async function History() {
  const store = readStore();
  const entries = store ? await store.audit(300).catch(() => []) : [];
  const reverted = new Set(entries.map((e) => e.revertOf).filter(Boolean));
  const github = packMode() === "github";
  const statuses = new Map<string, EditStatus>();
  await Promise.all(
    entries.filter((e) => e.layer === "pack" && e.ref?.branch && github).slice(0, 25).map(async (e) => statuses.set(e.id, await editStatus(e.ref!.branch))),
  );
  const strip = (o: Record<string, unknown> | null) => (o ? Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith("_"))) : null);
  const rows: HistoryRow[] = entries.map((e) => ({
    id: e.id,
    at: e.at,
    actor: e.actor,
    title: e.title,
    where: e.layer === "pack" ? `Data pack · ${DATASET_LABEL[e.collection] ?? e.collection}` : COLLECTION_BY_ID[e.collection]?.label ?? e.collection,
    action: e.action,
    before: strip(e.before),
    after: strip(e.after),
    archived: e.after?._archived === true,
    status: e.layer === "pack" ? statuses.get(e.id) ?? { state: github ? "unknown" : "live" } : null,
    commitUrl: e.ref?.commitUrl ?? null,
    reverted: reverted.has(e.id),
  }));
  return (
    <>
      <PageHead kicker="Change history" title="Every change, who made it, and when" lead="Every edit the team makes, to its working records and to the data pack, with what it changed from and to." />
      <HistoryList rows={rows} />
    </>
  );
}
