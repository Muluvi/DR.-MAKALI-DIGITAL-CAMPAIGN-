/**
 * The message architecture: one claim, three pillars, four content types. One file, read by every
 * figure that names a pillar or a content type, so a count cannot be printed two ways again.
 *
 * Where it is set out in prose: The message, "One claim, three pillars, six themes"
 * (content/message.md). Earlier drafts carried four campaign pillars; the message section folds
 * them into these three, and each pillar below names the earlier aims it now carries.
 *
 * To edit: change a title or a line here. Figures fig-4-1 (the message house), fig-4-3 (segments)
 * and fig-4-5 (the briefed week) read this file at build.
 */

export interface Pillar {
  /** Pillars carry no code: P1 to P4 name the content types. */
  title: string;
  /** How the pillar is argued, as content/message.md states it, shortened for a figure. */
  argued: string;
  /** The earlier campaign pillars this pillar now carries. */
  carries: string[];
}

export const PILLARS: Pillar[] = [
  {
    title: "Fiscal integrity and transparent public finance",
    argued: "How the county's budget should be allocated and audited, ward by ward; publish what was promised, then publish whether it happened.",
    carries: ["Fiscal accountability and devolution", "Verification and follow-through"],
  },
  {
    title: "Household economic empowerment and agricultural value",
    argued: "Dense policy, such as water and the revival of farming, made relatable in the vernacular.",
    carries: ["Policy, translated into what it changes"],
  },
  {
    title: "Fair devolution, water for all and health care",
    argued: "His record, including NG-CDF projects, shown as charts, ward maps and before-and-after comparisons.",
    carries: ["Data-driven civic engagement"],
  },
];

export interface ContentType {
  /** P1 to P4: the weekly brief's slot. */
  code: "P1" | "P2" | "P3" | "P4";
  /** The short name a calendar cell prints. */
  short: string;
  /** The full name, as content/message.md's content-type table prints it. */
  name: string;
}

export const CONTENT_TYPES: ContentType[] = [
  { code: "P1", short: "Where the money went", name: "Where the money went" },
  { code: "P2", short: "One household", name: "From poverty to wealth creation, one household" },
  { code: "P3", short: "The economist explains", name: "The economist explains" },
  { code: "P4", short: "He came, and said", name: "He came, and this is what he said he would do" },
];

