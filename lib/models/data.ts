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
import projectsRegister from "../../data/analysis/projects-register.json" with { type: "json" };
import { SEGMENT_PLAN } from "../register/specs/s4-strategy.ts";
import { SEGMENTS, sizeText } from "../../data/segments.ts";
import { CONTENT_TYPES } from "../../data/message-architecture.ts";
import { SEVERITY_TIERS } from "../../data/escalation.ts";
import { HOLDING_POSITIONS } from "../figures/annex.ts";
import { val } from "../data/read.ts";
import { layerShares } from "./reach.ts";
import { KNOWN_LANGUAGES, toPlanRows } from "./brief-mix.ts";
import type { Project } from "./record-finder.ts";
import type { Tier } from "./response-tier.ts";

export const PRIORITY_WARDS = buildPriorityWards(summary.wards as PublicWardRow[], register as RegisterShape, projectsByWard.values as ProjectValue[]);

/** Reach by channel: the three connectivity layers, from the registry's two rates. */
export const REACH_SHARES = layerShares(val("ict.internet"), val("ict.phone"));

/** Weekly brief mix: the segment plan fig-4-3 prints, and each segment's size as it prints. */
export const BRIEF_PLAN = toPlanRows(SEGMENT_PLAN, Object.fromEntries(SEGMENTS.map((s) => [s.id, s.name])));
export const BRIEF_SIZES: Record<string, string> = Object.fromEntries(SEGMENTS.map((s) => [s.id, sizeText(s)]));
export const BRIEF_TYPES = CONTENT_TYPES.map((t) => ({ code: t.code, short: t.short }));
export const BRIEF_LANGUAGES: string[] = KNOWN_LANGUAGES.filter((l) => BRIEF_PLAN.some((r) => r.languages.includes(l)));

/** Response tier: the ladder and the pre-drafted holding positions. */
export const TIERS = SEVERITY_TIERS as Tier[];
export const HOLDING_LINES = HOLDING_POSITIONS.map((p) => ({ question: p.question, attack: p.attack, holding: p.holding, kikamba: p.kikamba, source: p.source }));

/** Record finder: the 401 itemised projects, and the wards to pick from. */
export const PROJECTS = projectsRegister.values as unknown as Project[];
export const SCORECARD_SOURCE = "County Government of Kitui, Delivering the Kitui Promise scorecard";
export const FINDER_WARDS = PRIORITY_WARDS.map((w) => ({ slug: w.slug, name: w.name, constituency: w.constituency })).sort((a, b) => a.name.localeCompare(b.name));
