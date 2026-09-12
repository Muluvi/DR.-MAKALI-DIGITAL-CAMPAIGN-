import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";

import { ClientPage } from "@/components/ClientPage";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { SECTIONS, type TabId } from "@/lib/heading-slug";
import { buildSectionIndex } from "@/lib/section-index";

// One file per route, named for the section it serves.
const FILES: Record<TabId, string> = {
  situation: "situation.md",
  objectives: "objectives.md",
  audiences: "audiences.md",
  approach: "approach.md",
  messaging: "messaging.md",
  "scope-platforms": "scope-platforms.md",
  "scope-media": "scope-media.md",
  "scope-ground": "scope-ground.md",
  "scope-data": "scope-data.md",
  roadmap: "roadmap.md",
  deliverables: "deliverables.md",
  measurement: "measurement.md",
  governance: "governance.md",
  risk: "risk.md",
  structure: "structure.md",
  assumptions: "assumptions.md",
  nextsteps: "nextsteps.md",
};

const TAB_IDS = SECTIONS.map((s) => s.id) as TabId[];

/** The whole document on one page, for Expand All and for print. */
const FULL = "full";

/** The route served at "/" — the proposal's cover. */
const LANDING = "cover";

/**
 * One route per section, and why.
 *
 * This was a single route that rendered every section on the server and handed them to a
 * client component as props. React Server Components serialise everything crossing that
 * boundary, so the browser downloaded every section and displayed one: measured, 2.05 MB of the
 * 2.49 MB response was payload for the sections the reader was not looking at, and the
 * response was the largest asset on the page — heavier than every script put together. First
 * Contentful Paint was transfer-bound at 3.0s on a throttled mobile connection, against a
 * proposal whose own the digital infrastructure, brand and civic content section calls 3G loading non-negotiable.
 *
 * Now each section is its own statically generated route carrying its own content and nothing
 * else. The section INDEX is still built from every file, because it is only headings and it
 * has to be complete for the navigator to work — but it costs a few kilobytes rather than a
 * megabyte.
 *
 * `/full` keeps the behaviour Expand All and the print path depend on: the entire document, in
 * order, on one page. It is the expensive route by design, and it is the only one that pays for
 * all of them.
 *
 * Deep links are unaffected. Every id is "<tab>-sec-<slug>", so the tab is recoverable from the
 * fragment alone, and ClientPage routes to the right section on arrival. Every legacy id
 * still resolves through LEGACY_IDS exactly as before; scripts/verify-deep-links.mjs proves it.
 */
export function generateStaticParams() {
  return [{ slug: [] as string[] }, ...TAB_IDS.map((id) => ({ slug: [id] })), { slug: [FULL] }];
}

async function readAll(): Promise<Record<TabId, string>> {
  const contentDir = path.join(process.cwd(), "public", "content");
  const entries = await Promise.all(
    SECTIONS.map(async (section) => {
      const raw = await fs
        .readFile(path.join(contentDir, FILES[section.id]), "utf-8")
        .catch(() => "");
      return [section.id, raw] as const;
    })
  );
  return Object.fromEntries(entries) as Record<TabId, string>;
}

const countWords = (raw: string) => raw.split(/\s+/).filter(Boolean).length;

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;

  if (slug && slug.length > 1) notFound();
  const requested = slug?.[0] ?? LANDING;
  const expanded = requested === FULL;
  if (!expanded && !TAB_IDS.includes(requested as TabId)) notFound();

  const activeTab = (expanded ? LANDING : requested) as TabId;
  const documents = await readAll();

  // Derived from the same markdown, here on the server, so the table of contents can never
  // disagree with the document it indexes. Headings only — this stays cheap.
  const sections = buildSectionIndex(documents);

  // Reading time needs every section's length even when only one section's prose is served.
  // One integer per route, rather than a rendered tree per route.
  const wordCounts = Object.fromEntries(
    SECTIONS.map((s) => [s.id, countWords(documents[s.id])])
  ) as Record<TabId, number>;

  // Markdown parsing happens here, on the server, so react-markdown and its remark/rehype
  // plugins never ship to the client bundle. Only the section this route serves is rendered.
  const served = expanded ? TAB_IDS : [activeTab];
  const rendered = Object.fromEntries(
    served.map((id) => [id, <MarkdownViewer key={id} content={documents[id]} tabId={id} />])
  ) as Partial<Record<TabId, React.ReactNode>>;

  return (
    <ClientPage
      sections={sections}
      documents={rendered}
      wordCounts={wordCounts}
      activeTab={activeTab}
      expanded={expanded}
    />
  );
}
