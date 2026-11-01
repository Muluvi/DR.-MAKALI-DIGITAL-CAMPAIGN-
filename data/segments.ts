/**
 * The six voter segments, in one file. Every view that sizes a segment reads it from here, and
 * every size is a registry read (lib/data/figures.ts, segment.*), so a segment cannot be sized two
 * ways again (consolidation pass, Step 1: docs/consolidation-2026-11/DECISIONS.md D1.7).
 *
 * Read by: The voters to win (the segmentation matrix, components/markdown/AudienceSegmentationMatrix
 * .tsx), fig-4-3 (the segment matrix, The voters to win) and the segment summary in the playbooks
 * (lib/figures/annex.ts).
 *
 * Three segments are sized: the census rural and urban shares, and the census age distribution,
 * applied to the 2022 register (modelled, Tier 1 inputs). Three are NOT SIZED: no published source
 * gives their registered-voter count, and none is estimated here. Each says what is known instead.
 * The ranges earlier drafts printed for them (80,000–105,000 agro-pastoralists, 25,000–35,000
 * professionals, 150,000+ diaspora) had no source and are retired.
 *
 * To edit: change a segment's wording here. To change a size, change the registry figure it names.
 */
import { formatFigure } from "../lib/data/format.ts";
import { figure } from "../lib/data/figures.ts";

export interface Segment {
  id: "agrarian" | "pastoralist" | "youth" | "msme" | "professionals" | "diaspora";
  name: string;
  shortName: string;
  /** The registry figure that sizes it, in registered voters; null when no source publishes one. */
  size: string | null;
  /** The registry figure for its share, and what the share is of. */
  share?: { id: string; of: string };
  /** For an unsized segment: what is known instead, and the document that would size it. */
  notSized?: { context: () => string; closesWith: string };
}

const f = (id: string) => formatFigure(figure(id));

export const SEGMENTS: Segment[] = [
  { id: "agrarian", name: "Rural agrarian & smallholder baseline", shortName: "Rural agrarian", size: "segment.rural.voters", share: { id: "census.rural.share", of: "county population" } },
  {
    id: "pastoralist",
    name: "Agro-pastoralist & arid-zone livestock keepers",
    shortName: "Agro-pastoralist",
    size: null,
    notSized: {
      context: () => `${f("livestock.households")} livestock-farming households (2019 Census, Tier 1): households, not voters`,
      closesWith: "Registered voters by livelihood; not published",
    },
  },
  { id: "youth", name: "Youth cohort, ages 18–35", shortName: "Youth 18–35", size: "segment.youth.voters", share: { id: "segment.youth.share", of: "the 2022 register" } },
  { id: "msme", name: "Urban & peri-urban informal commerce", shortName: "Urban commerce", size: "segment.urban.voters", share: { id: "census.urban.share", of: "county population" } },
  {
    id: "professionals",
    name: "Formal professionals, civil servants & educators",
    shortName: "Professionals",
    size: null,
    notSized: {
      context: () => `Health workers: ${f("health.density.core")} core staff per 10,000 people (Countdown 2030, Tier 2); headcounts not published`,
      closesWith: "TSC establishment for Kitui; County Public Service Board staff return",
    },
  },
  {
    id: "diaspora",
    name: "Out-of-county Kamba diaspora",
    shortName: "Diaspora",
    size: null,
    notSized: {
      context: () => `Net recent migration ${f("migration.net")} (2019 Census, Tier 1): context, not a voter count`,
      closesWith: "IEBC register by polling station, set against the migration tables",
    },
  },
];

export const segment = (id: Segment["id"]): Segment => {
  const s = SEGMENTS.find((x) => x.id === id);
  if (!s) throw new Error(`segments: unknown id ${id}`);
  return s;
};

/** A segment's size as a cell prints it: "≈507,000 registered voters (modelled)" or "Not sized". */
export function sizeText(s: Segment): string {
  if (!s.size) return "Not sized";
  return `≈${f(s.size)} registered voters (modelled)`;
}

/** Its share, where it has one: "95.2% of county population". */
export function shareText(s: Segment): string | null {
  if (!s.share) return null;
  return `${f(s.share.id)}% of ${s.share.of}`;
}
