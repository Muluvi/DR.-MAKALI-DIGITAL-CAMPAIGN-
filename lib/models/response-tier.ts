/**
 * Response tier: which of the four severity tiers an incident falls in, who drafts and approves the
 * answer, and the pre-drafted holding line to start from. Pure: the tiers are passed in
 * (data/escalation.ts, SEVERITY_TIERS), and the numbers in the rules are read from the tiers' own
 * threshold text, so a changed threshold changes the model.
 *
 * The rules, highest tier first, each from a tier's threshold:
 *   Critical    a false allegation, manipulated or AI-generated media, a national TV story, a legal or
 *               regulatory threat, or a coordinated attack that is county-wide or national
 *   High        a vernacular radio mention, a rival press conference, a coordinated attack, or
 *               misinformation past the High view count
 *   Moderate    a rumour in at least the Moderate number of ward WhatsApp groups, or one market or baraza
 *   Negligible  an isolated comment or post under the Negligible view count, or a fringe or anonymous source
 * An incident the ladder does not name exactly is kept at the lower tier and flagged for the
 * communications lead to decide.
 */

export type Tier = { name: "Negligible" | "Moderate" | "High" | "Critical"; threshold: string; protocol: string; turnaround: string; draftedBy: string; approvedBy: string };

export const KINDS = [
  { key: "comment", label: "A comment or post online" },
  { key: "rumour", label: "A rumour in WhatsApp groups" },
  { key: "baraza", label: "Talk at a market or baraza" },
  { key: "radio", label: "A mention on vernacular radio" },
  { key: "press", label: "A rival press conference" },
  { key: "coordinated", label: "A coordinated attack across accounts" },
  { key: "allegation", label: "A false allegation" },
  { key: "media", label: "Manipulated or AI-generated audio, video or images" },
  { key: "tv", label: "A national TV story" },
  { key: "legal", label: "A legal or regulatory threat" },
] as const;
export type KindKey = (typeof KINDS)[number]["key"];

export const SPREADS = [
  { key: "ward", label: "One ward" },
  { key: "wards", label: "Several wards" },
  { key: "county", label: "County-wide" },
  { key: "national", label: "National" },
] as const;
export type SpreadKey = (typeof SPREADS)[number]["key"];

export type Incident = { kind: KindKey; spread: SpreadKey; views: number; wardGroups: number; fringe: boolean };
export type TierResult = { tier: Tier; rule: string; flagged: string | null };

const num = (re: RegExp, text: string, what: string): number => {
  const m = re.exec(text);
  if (!m) throw new Error(`response tier: no ${what} in the threshold "${text}"`);
  return Number(m[1].replace(/,/g, ""));
};

/** The three numbers the ladder sets, read from its threshold text. */
export function thresholds(tiers: Tier[]) {
  const t = (n: Tier["name"]) => {
    const x = tiers.find((y) => y.name === n);
    if (!x) throw new Error(`response tier: no ${n} tier`);
    return x;
  };
  return {
    negligibleViews: num(/under ([\d,]+) views/i, t("Negligible").threshold, "view count"),
    moderateGroups: num(/(\d+)\+ ward WhatsApp groups/i, t("Moderate").threshold, "group count"),
    highViews: num(/past ([\d,]+) views/i, t("High").threshold, "view count"),
    tier: t,
  };
}

export function classify(tiers: Tier[], i: Incident): TierResult {
  const th = thresholds(tiers);
  const wide = i.spread === "county" || i.spread === "national";
  const views = Number.isFinite(i.views) ? i.views : 0;
  const groups = Number.isFinite(i.wardGroups) ? i.wardGroups : 0;

  if (i.kind === "allegation" || i.kind === "media" || i.kind === "tv" || i.kind === "legal")
    return { tier: th.tier("Critical"), rule: "A false allegation, manipulated media, a national TV story or a legal threat is Critical whatever its reach.", flagged: null };
  if (i.kind === "coordinated" && wide) return { tier: th.tier("Critical"), rule: "A coordinated attack that is county-wide or national is Critical.", flagged: null };
  if (i.kind === "radio" || i.kind === "press" || i.kind === "coordinated")
    return { tier: th.tier("High"), rule: "A vernacular radio mention, a rival press conference or a coordinated attack is High.", flagged: null };
  if (views > th.highViews) return { tier: th.tier("High"), rule: `Misinformation past ${th.highViews.toLocaleString("en-KE")} views is High.`, flagged: null };
  if (i.kind === "baraza") return { tier: th.tier("Moderate"), rule: "Talk at a market centre or baraza is Moderate.", flagged: null };
  if (groups >= th.moderateGroups) return { tier: th.tier("Moderate"), rule: `A rumour active in ${th.moderateGroups} or more ward WhatsApp groups is Moderate.`, flagged: null };
  if (views < th.negligibleViews || i.fringe)
    return { tier: th.tier("Negligible"), rule: `An isolated post under ${th.negligibleViews} views, or a fringe or anonymous source, is Negligible: log it and do not amplify it.`, flagged: null };
  return {
    tier: th.tier("Negligible"),
    rule: "Kept at Negligible: watched, not answered.",
    flagged: `The ladder names no tier for ${views.toLocaleString("en-KE")} views in ${groups} ward group${groups === 1 ? "" : "s"}. The communications lead decides, and moves it up if it keeps spreading.`,
  };
}
