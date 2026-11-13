/**
 * The site's one story, in order: the opening, then five stages. Each stage holds the chapters
 * (content/<id>.md) that argue it and, between them, the tools that act on that data.
 */
type StageId = "data" | "analysis" | "objectives" | "strategies" | "implementation";

export interface Chapter {
  id: string;
  title: string;
  summary: string;
}

interface Stage {
  id: StageId;
  label: string;
  question: string;
  chapters: Chapter[];
}

export const STAGES: Stage[] = [
  {
    id: "data",
    label: "Data",
    question: "Who lives in Kitui, how they voted, what they need and how they get news.",
    chapters: [
      { id: "kitui", title: "The county in numbers", summary: "Who lives in Kitui, on what land, and how it is run." },
      { id: "votes", title: "How Kitui voted", summary: "The register, the results since 2013, and the number it takes." },
      { id: "needs", title: "What voters need", summary: "Water first, then food, health, roads, jobs, prices and public money." },
      { id: "news", title: "How voters get news", summary: "Most of Kitui is offline, so phone, radio and people carry the race." },
    ],
  },
  {
    id: "analysis",
    label: "Analysis",
    question: "Who is running, where Dr. Mulu stands, and what the gap is.",
    chapters: [
      { id: "race", title: "The race for 2027", summary: "An open seat, a two-stage contest, and the rivals within the law." },
      { id: "record", title: "His record and reach", summary: "A documented record, known mainly in Kitui Central." },
      { id: "diagnosis", title: "The diagnosis", summary: "A recognition gap outside Kitui Central, stated as a hypothesis to test." },
    ],
  },
  {
    id: "objectives",
    label: "Objectives",
    question: "What the campaign must achieve, and by when.",
    chapters: [{ id: "goal", title: "The goal", summary: "The Wiper ticket first, then the county, with five objectives." }],
  },
  {
    id: "strategies",
    label: "Strategies",
    question: "What the campaign says, to whom, on which channel and in which language.",
    chapters: [
      { id: "position", title: "The position", summary: "The Economist Governor, who can show where public money went." },
      { id: "message", title: "The message", summary: "One claim, three pillars, six themes, four content types." },
      { id: "voters", title: "The voters to win", summary: "Three universes and six segments, by interest, place and life stage." },
      { id: "channels", title: "Channels and language", summary: "Where the effort goes, on which channel, in which language." },
    ],
  },
  {
    id: "implementation",
    label: "Implementation",
    question: "Who does the work, in what order, how it is measured and kept safe.",
    chapters: [
      { id: "engagement", title: "Who does what", summary: "His team publishes, the platform carries the data, one brief a week." },
      { id: "timeline", title: "Timeline to August 2027", summary: "Five phases, dated by the electoral calendar." },
      { id: "rollout", title: "Reaching all 40 wards", summary: "The centre, two pilots, then the rest." },
      { id: "workstreams", title: "The fourteen workstreams", summary: "What each produces, who owns it, and how often it reports." },
      { id: "success", title: "Measuring success", summary: "Votes and recognition count; followers and likes do not." },
      { id: "lawful", title: "Lawful and ethical", summary: "A data-protection gate, a published charter and IEBC clearance." },
      { id: "response", title: "Risks and response", summary: "Six risks, and a rehearsed answer to attack." },
      { id: "annex-playbooks", title: "Platform playbooks", summary: "One job per platform, its formats, copy samples and volunteers." },
      { id: "annex-runbooks", title: "Runbooks", summary: "Holding lines, drills, the threat model, incidents and account security." },
      { id: "annex-technology", title: "Technology", summary: "The reference architecture and the voter-model dictionary." },
      { id: "terms", title: "Terms used", summary: "Abbreviations and terms of art, each defined once." },
    ],
  },
];

const CHAPTERS: Chapter[] = STAGES.flatMap((s) => s.chapters);
export const CHAPTER_IDS: string[] = CHAPTERS.map((c) => c.id);

/** A heading's id: its chapter, then its words. Unique on the page because headings are unique within a chapter. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
    .replace(/-$/, "");
}
