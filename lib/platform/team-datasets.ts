/** The team's working records, as explorer datasets. Server only. */
import { COLLECTIONS } from "./collections";
import { readStore } from "./store";
import { recordRows } from "@/components/platform/rows";
import type { Dataset } from "./catalogue";

export async function teamDatasets(): Promise<Dataset[]> {
  const store = readStore();
  const all = store ? await store.listAll().catch(() => []) : [];
  return COLLECTIONS.map((c) => {
    const { columns, rows } = recordRows(c, all.filter((r) => r.collection === c.id));
    return { id: `team-${c.id}`, label: c.label, group: "Team records" as const, description: c.purpose, columns: columns.filter((x) => x.key !== "_id"), rows };
  });
}
