import fs from "node:fs";
import path from "node:path";
import { FIGURES } from "@/lib/data/figures";
import { CONSTITUENCIES } from "@/data/ward-register";
import { packMode } from "@/lib/platform/config";
import { ANALYSIS_FIELDS, EDITABLE_LISTS, FIGURE_FIELDS, analysisFiles, listFields } from "@/lib/platform/pack";
import { PageHead } from "@/components/platform/PageHead";
import { PackEditor, type PackEditorData } from "@/components/platform/PackEditor";

export const metadata = { title: "Edit data | Kitui 2027", robots: { index: false, follow: false } };

export default async function EditData() {
  const data: PackEditorData = {
    mode: packMode(),
    figures: Object.values(FIGURES).map((f) => ({ ...Object.fromEntries(FIGURE_FIELDS.map((k) => [k, (f as unknown as Record<string, unknown>)[k] ?? null])), id: f.id, unit: f.unit, decimals: f.decimals ?? null, alt: f.alt ?? null } as PackEditorData["figures"][number])),
    register: CONSTITUENCIES.map((c) => ({ name: c.name, voters: c.voters, wards: c.wards.map((w) => ({ name: w.name, voters: w.voters })) })),
    lists: EDITABLE_LISTS.map((l) => ({
      id: l.id, label: l.label, key: l.key, fields: listFields(l), choices: l.choices ?? {},
      records: l.records().map((r) => Object.fromEntries([[l.key, r[l.key]], ...listFields(l).map((f) => [f.key, r[f.key] ?? null])])),
    })),
    analysis: analysisFiles().map((file) => {
      const d = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "analysis", file), "utf8")) as { title: string; values: Record<string, unknown>[] };
      return { file, title: d.title, rows: d.values.map((v, i) => ({ index: i, label: String(v.label), ...Object.fromEntries(ANALYSIS_FIELDS.map((k) => [k, v[k] ?? null])) })) };
    }),
  };
  return (
    <>
      <PageHead kicker="Data editor" title="Update the data" lead="Anyone with the link can change a figure, a ward's register, a strategy list or an analysis value. Each edit is checked by the same rules the site's data checks use; if it would break them, it is refused with the reason, and nothing changes. Every edit is in the change history and can be put back." />
      <PackEditor data={data} />
    </>
  );
}
