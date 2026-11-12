import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTION_BY_ID } from "@/lib/platform/collections";
import { editingAvailable, readStore } from "@/lib/platform/auth";
import { resolveOptions } from "@/lib/platform/options";
import { PageHead } from "@/components/platform/PageHead";
import { WorkspaceCollection } from "@/components/platform/WorkspaceCollection";
import { recordRows } from "@/components/platform/rows";

export function generateMetadata() {
  return { robots: { index: false, follow: false } };
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const c = COLLECTION_BY_ID[collection];
  if (!c) notFound();
  const store = readStore();
  const records = store ? await store.list(c.id).catch(() => []) : [];
  const { columns, rows } = recordRows(c, records);
  const data = Object.fromEntries(records.map((r) => [r.id, r.data]));
  return (
    <>
      <p className="mb-2 text-[0.85rem]"><Link href="/workspace" className="text-accent">Workspace</Link></p>
      <PageHead kicker={c.group} title={c.label} lead={c.purpose} />
      <WorkspaceCollection collectionId={c.id} label={c.label} columns={columns} rows={rows} data={data} options={resolveOptions()} canEdit={editingAvailable()} editable={!!store} />
    </>
  );
}

