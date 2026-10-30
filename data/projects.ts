// Typed view onto the county's itemised projects, mapped to wards (analysis Stage 14).
//
// Kept apart from data/analysis-exports.ts so the register's 401 rows load only on the page
// that uses them, not with every figure in the proposal. The same integrity contract is
// asserted at module load. To change anything here, re-run the pipeline:
//   cd analysis && python -m src.run_all --stage 14 && python -m src.publish --approved
import { assertExportIntegrity, type ExportChart, type ExportValue } from "./analysis-exports";
import wardKeys from "./geo/ward-keys.json";
import projectsRegister from "./analysis/projects-register.json";

/** Where a project's printed place lands (analysis/src/stage14_projects.py). */
export type ProjectLevel = "ward" | "multi_ward" | "conflict" | "constituency" | "county";

export interface ProjectRow {
  id: string;
  title: string;
  /** tender.value.amount, KES: the cost as printed. */
  amount: number;
  sector: string;
  constituency: string;
  level: ProjectLevel;
  /** Ward slugs: one for "ward" and "conflict", several for "multi_ward", none otherwise. */
  wards: string[];
  /** The scorecard's printed status, not the OCDS codelist. */
  status: string;
  page: number;
  asPrinted: string;
  /** Why the place landed where it did. */
  match: string;
  provenance: Pick<ExportValue, "source_id" | "tier" | "as_of" | "method" | "status">;
}

export const PROJECTS_EXPORT = projectsRegister as ExportChart;
assertExportIntegrity({ "projects-register": PROJECTS_EXPORT });

export const PROJECTS: ProjectRow[] = PROJECTS_EXPORT.values.map((v) => {
  const d = v.dims as Record<string, unknown>;
  return {
    id: String(d.id),
    title: v.label,
    amount: Number(v.value),
    sector: String(d.sector),
    constituency: String(d.constituency),
    level: d.level as ProjectLevel,
    wards: d.wards as string[],
    status: String(d.status),
    page: Number(d.page),
    asPrinted: String(d.as_printed),
    match: v.note,
    provenance: { source_id: v.source_id, tier: v.tier, as_of: v.as_of, method: v.method, status: v.status },
  };
});

export interface WardKey {
  slug: string;
  name: string;
  constituency: string;
}

export const WARDS: WardKey[] = wardKeys.wards.map(({ slug, name, constituency }) => ({ slug, name, constituency }));
export const WARD_NAME: Record<string, string> = Object.fromEntries(WARDS.map((w) => [w.slug, w.name]));
