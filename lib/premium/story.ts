import { FIG_3_1, FIG_3_2, FIG_3_3, FIG_3_4 } from "../register/specs/s3-analysis";

/**
 * The four figures the §3 story carries inside its steps (brief G-4). Each is drawn once, in the
 * story; where §3.1–§3.4 would have drawn it, the section shows a pointer back up to the step.
 */
export const STORY_STEPS = [FIG_3_1, FIG_3_2, FIG_3_3, FIG_3_4];
export const STORY_FIGURES = new Set(STORY_STEPS.map((f) => f.id));
