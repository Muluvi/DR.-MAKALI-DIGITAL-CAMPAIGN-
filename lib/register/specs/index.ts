/**
 * The figure register, in story order. Each id is the figure's DOM id and its CSV filename
 * (/csv/<id>.csv, app/csv/[id]/route.ts).
 */
import type { FigureSpec } from "../types.ts";
import { pageDeep } from "../../reader-text.ts";
import { S1 } from "./s1-objectives.ts";
import { S2 } from "./s2-data.ts";
import { S3 } from "./s3-analysis.ts";
import { S4 } from "./s4-strategy.ts";
import { S5 } from "./s5-implementation.ts";
import { S5_WS } from "./s5-workstreams.ts";
import { S7 } from "./s7-reference.ts";

/** The specs as written. */
const REGISTER_SOURCE: FigureSpec[] = [...S1, ...S2, ...S3, ...S4, ...S5, ...S5_WS, ...S7];

/** The specs as the reader sees them: the same figures in plain words (lib/reader-text.ts). */
const REGISTER_ORDER: FigureSpec[] = REGISTER_SOURCE.map((s) => pageDeep(s));

export const REGISTER: Record<string, FigureSpec> = Object.fromEntries(REGISTER_ORDER.map((s) => [s.id, s]));
