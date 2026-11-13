/**
 * The strategy and solution library, built from the story itself. Server only (reads content/).
 *
 * Nothing here is written by hand. Objectives, strategies and solutions are the numbered headings
 * of the chapters that state them; the workstreams are the fourteen "Workstream N" headings; the
 * structured parts (pillars, content types, segments, indicators, risks, severity tiers) are the
 * data pack's own lists. Each item links back to the place in the story that argues it, and to
 * every registry figure its passage cites, so the evidence behind it is one tap away.
 */
import fs from "node:fs";
import path from "node:path";
import { displayTitle, headingSlug, sectionId, TAB_LABELS, type TabId } from "../heading-slug";
import { CONTENT_FILES } from "../content-files";
import { FIGURES } from "../data/figures";
import { PILLARS, CONTENT_TYPES } from "../../data/message-architecture";
import { SEGMENTS } from "../../data/segments";
import { GENERAL_ELECTION_KPIS, NOMINATION_KPIS, RECOGNITION_INDICATORS } from "../../data/kpis";
import { RISKS } from "../../data/risks";
import { SEVERITY_TIERS } from "../../data/escalation";

export type LibraryKind = "Objective" | "Strategy" | "Workstream" | "Pillar" | "Content type" | "Segment" | "Indicator" | "Risk" | "Response tier" | "Solution";

export interface LibraryItem {
  id: string;
  kind: LibraryKind;
  title: string;
  summary: string;
  chapter: string;
  /** Where the story argues it. */
  href: string;
  /** Registry figures its passage cites, in order of first mention. */
  figures: string[];
  /** The owner the proposal names, where it names one. */
  owner?: string;
}

const read = (tab: TabId) => fs.readFileSync(path.join(process.cwd(), "content", CONTENT_FILES[tab]), "utf8");

const TOKEN = /\{\{\s*([a-z0-9.\-]+)(?:\|[^}]*)?\}\}/gi;
function figuresIn(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(TOKEN)) if (FIGURES[m[1]] && !out.includes(m[1])) out.push(m[1]);
  return out;
}

/** Plain text of a passage, tokens shown as their printed value is not needed here: words only. */
function plain(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(TOKEN, "…")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`>#|]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
function firstSentences(text: string, max = 220): string {
  const lead = /```lead\n([\s\S]*?)```/.exec(text)?.[1];
  const t = plain(lead ?? text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const stop = cut.lastIndexOf(". ");
  return (stop > 80 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, "")) + (stop > 80 ? "" : "…");
}

interface Heading { level: number; text: string; line: number }
function headingsOf(md: string): { heads: Heading[]; lines: string[] } {
  const lines = md.split("\n");
  const heads: Heading[] = [];
  let fence = false;
  lines.forEach((l, i) => {
    if (/^\s*```/.test(l)) fence = !fence;
    if (fence) return;
    const m = /^(#{2,4}) (.+)$/.exec(l);
    if (m) heads.push({ level: m[1].length, text: m[2].trim(), line: i });
  });
  return { heads, lines };
}
function bodyOf(h: Heading, heads: Heading[], lines: string[]): string {
  const next = heads.find((x) => x.line > h.line && x.level <= h.level);
  return lines.slice(h.line + 1, next ? next.line : lines.length).join("\n");
}

function fromHeadings(tab: TabId, kind: LibraryKind, pick: (h: Heading) => boolean): LibraryItem[] {
  const { heads, lines } = headingsOf(read(tab));
  return heads.filter(pick).map((h) => {
    const slug = headingSlug(h.text);
    const body = bodyOf(h, heads, lines);
    const owner = /\*\*Owner:\s*([^*]+?)\.?\*\*/.exec(body)?.[1]?.trim();
    const id = slug ? sectionId(tab, slug) : `${tab}-${h.line}`;
    return { id, kind, title: displayTitle(h.text).replace(/^Workstream \d+ — /, ""), summary: firstSentences(body), chapter: TAB_LABELS[tab], href: `/#${id}`, figures: figuresIn(body), owner };
  });
}

const anchorOf = (tab: TabId, number: string) => `/#${sectionId(tab, number.replace(/\./g, "-").toLowerCase())}`;

let cache: LibraryItem[] | null = null;

export function library(): LibraryItem[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const items: LibraryItem[] = [
    ...fromHeadings("goal", "Objective", (h) => h.level === 3 && /^8\.2\.\d/.test(h.text)),
    ...fromHeadings("message", "Strategy", (h) => h.level === 2),
    ...fromHeadings("voters", "Strategy", (h) => h.level === 2),
    ...fromHeadings("channels", "Strategy", (h) => h.level === 2),
    ...fromHeadings("workstreams", "Workstream", (h) => /Workstream \d+/.test(h.text)),
    ...fromHeadings("response", "Solution", (h) => h.level === 2),
    ...PILLARS.map((p, i) => ({ id: `pillar-${i + 1}`, kind: "Pillar" as const, title: p.title, summary: p.argued, chapter: TAB_LABELS.message, href: anchorOf("message", "10.1"), figures: [] })),
    ...CONTENT_TYPES.map((c) => ({ id: `content-type-${c.code}`, kind: "Content type" as const, title: c.name, summary: `Weekly brief slot ${c.short}.`, chapter: TAB_LABELS.message, href: anchorOf("message", "10.1"), figures: [] })),
    ...SEGMENTS.map((s) => ({ id: `segment-${s.id}`, kind: "Segment" as const, title: s.name, summary: s.shortName, chapter: TAB_LABELS.voters, href: anchorOf("voters", "11.2"), figures: [s.size, s.share?.id].filter((x): x is string => !!x && !!FIGURES[x]) })),
    ...[...NOMINATION_KPIS, ...GENERAL_ELECTION_KPIS].map((k) => ({ id: `kpi-${k.code}`, kind: "Indicator" as const, title: `${k.title}`, summary: k.definition, chapter: TAB_LABELS.success, href: "/#success", figures: [], owner: k.owner })),
    ...RECOGNITION_INDICATORS.map((k) => ({ id: `kpi-${k.code}`, kind: "Indicator" as const, title: k.title, summary: "Recognition indicator.", chapter: TAB_LABELS.success, href: "/#success", figures: [] })),
    ...RISKS.map((r) => ({ id: `risk-${r.code}`, kind: "Risk" as const, title: r.label, summary: r.mitigation, chapter: TAB_LABELS.response, href: anchorOf("response", "20.1"), figures: [], owner: r.owner })),
    ...SEVERITY_TIERS.map((t) => ({ id: `tier-${t.name.toLowerCase()}`, kind: "Response tier" as const, title: t.name, summary: t.threshold, chapter: TAB_LABELS.response, href: anchorOf("response", "F.1"), figures: [], owner: t.approvedBy })),
  ];
  cache = items;
  return items;
}

/** Strategy choices for the implementation tracker: everything a team action can carry out. */
export function strategyChoices(): string[] {
  return library().filter((i) => i.kind === "Workstream" || i.kind === "Strategy" || i.kind === "Objective").map((i) => `${i.kind === "Workstream" ? "Workstream" : i.kind}: ${i.title}`);
}
