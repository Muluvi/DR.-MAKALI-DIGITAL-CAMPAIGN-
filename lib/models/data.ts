/**
 * The data the models read, joined once from the files the site already holds. Nothing here is
 * typed by hand: every count comes from the public data pack, the ward register or the analysis
 * exports, and models.test.ts checks the join against the registry.
 *
 * Wards are joined by name (slugged as the registry slugs them), not by code: the IEBC ward codes in
 * the public pack and the boundary file's codes number Chuluni and Nzambani the other way round.
 */
import projectsByWard from "../../data/analysis/projects-by-ward.json" with { type: "json" };
import register from "../../data/ward-register.json" with { type: "json" };
import summary from "../../data/kitui-public.generated.json" with { type: "json" };
import { buildPriorityWards, type ProjectValue, type PublicWardRow, type RegisterShape } from "./join.ts";

export const PRIORITY_WARDS = buildPriorityWards(summary.wards as PublicWardRow[], register as RegisterShape, projectsByWard.values as ProjectValue[]);
