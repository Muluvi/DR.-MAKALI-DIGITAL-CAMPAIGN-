/**
 * Record finder: the county projects a speaker can cite in a ward, with the page of the scorecard
 * that prints each. Pure: the register is passed in (data/analysis/projects-register.json, the
 * 401 itemised projects of the county's Delivering the Kitui Promise scorecard).
 *
 * A project counts for a ward when the scorecard places it in that ward, alone or with other
 * wards. Projects the scorecard places only at constituency level can be added for the ward's
 * constituency. Every project is a claim the county printed, not evidence that it was delivered.
 */

export type Project = {
  label: string;
  value: number;
  dims: { id: string; sector: string; constituency: string; level: string; wards: string[]; status: string; page: number };
};

export type FinderInputs = { ward: string; constituency: string; sector: string; status: "all" | "complete" | "other"; includeConstituency: boolean };
/** "ward": the scorecard places it in this ward alone. "shared": it names this ward with other places, or its place is disputed. */
export type Found = { project: Project; placed: "ward" | "shared" | "constituency" };

export function findRecords(projects: Project[], i: FinderInputs): Found[] {
  const out: Found[] = [];
  for (const p of projects) {
    const d = p.dims;
    let placed: Found["placed"] | null = null;
    if (d.wards.includes(i.ward)) placed = d.level === "ward" ? "ward" : "shared";
    else if (i.includeConstituency && d.level === "constituency" && d.constituency === i.constituency) placed = "constituency";
    if (!placed) continue;
    if (i.sector !== "all" && d.sector !== i.sector) continue;
    if (i.status === "complete" && d.status !== "Complete") continue;
    if (i.status === "other" && d.status === "Complete") continue;
    out.push({ project: p, placed });
  }
  const order = { ward: 0, shared: 1, constituency: 2 } as const;
  return out.sort((a, b) => order[a.placed] - order[b.placed] || b.project.value - a.project.value);
}

export const sectorsOf = (projects: Project[]): string[] => [...new Set(projects.map((p) => p.dims.sector))].sort();
export const totalKsh = (found: Found[]): number => found.reduce((a, f) => a + f.project.value, 0);
