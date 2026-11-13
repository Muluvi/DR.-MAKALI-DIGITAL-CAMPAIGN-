import { packDatasets, meta } from "@/lib/story/datasets";

/**
 * The data explorer's datasets as static JSON, built once at deploy: index.json lists them, and
 * <id>.json holds one. The explorer fetches only the one the reader opens.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: "index.json" }, ...packDatasets().map((d) => ({ id: `${d.id}.json` }))];
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = packDatasets();
  const body = id === "index.json" ? all.map(meta) : all.find((d) => `${d.id}.json` === id);
  return Response.json(body ?? null, { status: body ? 200 : 404 });
}
