import { REGISTER } from "@/lib/register/specs";
import type { Cell } from "@/lib/register/types";

/** Each figure's data table as a CSV, built once at deploy from the same rows the figure draws. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(REGISTER).map((id) => ({ id: `${id}.csv` }));
}

const quote = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
const cell = (v: Cell) => (v === null ? "" : String(v));

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const spec = REGISTER[id.replace(/\.csv$/, "")];
  if (!spec) return new Response("Not found", { status: 404 });
  const columns = spec.columns.filter((c) => !/^(tier|state|basis|reliability|confidence)$/.test(c.key));
  const lines = [columns.map((c) => quote(c.label)).join(","), ...spec.rows.map((r) => columns.map((c) => quote(cell(c.key in r.cells ? r.cells[c.key] : ""))).join(","))];
  return new Response(`${lines.join("\n")}\n`, { headers: { "content-type": "text/csv; charset=utf-8" } });
}
