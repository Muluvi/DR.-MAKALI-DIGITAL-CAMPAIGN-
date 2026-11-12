/**
 * The ward join behind the ward-priority model, as a pure function so the tests can hand it the
 * same JSON the site reads (lib/models/data.ts binds it to the real files).
 */
import type { PriorityWard } from "./ward-priority.ts";

export type PublicWardRow = { code: string; name: string; constituency: string; stations: number; voters: number };
export type RegisterShape = { constituencies: { id: string; name: string; wards: { name: string; voters: number }[] }[] };
export type ProjectValue = { value: number; dims: { ward?: string; measure?: string } };

/**
 * The four constituencies where he has never held office, as the registry's `pool` figure defines
 * them (lib/data/figures.ts). models.test.ts fails if the two ever stop agreeing.
 */
export const POOL_CONSTITUENCIES: readonly string[] = ["mwingi-north", "mwingi-west", "mwingi-central", "kitui-south"];

export const slug = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function buildPriorityWards(pub: PublicWardRow[], register: RegisterShape, projects: ProjectValue[]): PriorityWard[] {
  const constituencyOf = new Map<string, string>();
  for (const c of register.constituencies) for (const w of c.wards) constituencyOf.set(slug(w.name), c.id);
  const projectCount = new Map<string, number>();
  for (const p of projects) if (p.dims.measure === "projects" && p.dims.ward) projectCount.set(p.dims.ward, p.value);

  return pub.map((w) => {
    const s = slug(w.name);
    const constituencyId = constituencyOf.get(s);
    if (!constituencyId) throw new Error(`models: ward ${w.name} is not in the ward register`);
    return {
      code: w.code,
      name: w.name,
      slug: s,
      constituency: w.constituency,
      constituencyId,
      voters: w.voters,
      stations: w.stations,
      projects: projectCount.get(s) ?? 0,
      pool: POOL_CONSTITUENCIES.includes(constituencyId) ? 1 : 0,
    };
  });
}
