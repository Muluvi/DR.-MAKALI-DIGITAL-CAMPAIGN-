/**
 * The figure register (brief §N), in document order. Each id is the DOM id, the CSV filename
 * (public/data/<id>.csv, written by scripts/build-csv.ts) and the table-of-figures entry.
 */
import type { FigureSpec } from "../types.ts";
import { S0 } from "./s0-cover.ts";
import { S1 } from "./s1-objectives.ts";
import { S2 } from "./s2-data.ts";
import { S3 } from "./s3-analysis.ts";

export const REGISTER_ORDER: FigureSpec[] = [...S0, ...S1, ...S2, ...S3];

export const REGISTER: Record<string, FigureSpec> = Object.fromEntries(REGISTER_ORDER.map((s) => [s.id, s]));
