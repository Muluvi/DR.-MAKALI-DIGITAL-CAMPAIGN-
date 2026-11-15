/** The two data-pack charts from the dashboards page, loaded only when a chapter draws them. */
import type { Bar } from "@/components/platform/Bars";
import { CONSTITUENCIES } from "@/data/ward-register";
import { PROJECTS } from "@/data/projects";

export const votersByConstituency = (): Bar[] => CONSTITUENCIES.map((c) => ({ label: c.name, value: c.voters })).sort((a, b) => b.value - a.value);

export function projectsBySector(): Bar[] {
  const m = new Map<string, number>();
  for (const p of PROJECTS) m.set(p.sector, (m.get(p.sector) ?? 0) + 1);
  return [...m].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
