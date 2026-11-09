/**
 * The five objectives, read from the site's own content (lib/register/specs/s1-objectives.ts), so a
 * task links to an objective the site already states and never restates or rewrites one.
 */
import { OBJECTIVES } from "../register/specs/s1-objectives.ts";

export interface ObjectiveRef {
  n: string;
  title: string;
  target: string;
}

export const SITE_OBJECTIVES: ObjectiveRef[] = OBJECTIVES.map((o) => ({ n: o.n, title: o.title, target: o.target }));
export const OBJECTIVE_BY_N: Record<string, ObjectiveRef> = Object.fromEntries(SITE_OBJECTIVES.map((o) => [o.n, o]));
export const objectiveLabel = (n: string): string => (OBJECTIVE_BY_N[n] ? `Objective ${n}: ${OBJECTIVE_BY_N[n].title}` : `Objective ${n}`);
