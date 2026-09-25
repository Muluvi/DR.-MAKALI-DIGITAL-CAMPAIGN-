import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";

import { ClientPage } from "@/components/ClientPage";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { SECTIONS, type TabId } from "@/lib/heading-slug";
import { FLOW_ORDER } from "@/lib/flow";
import { CONTENT_FILES } from "@/lib/content-files";
import { buildSectionIndex } from "@/lib/section-index";
import { segmentContent, textVersionWords } from "@/lib/collapse-groups";

const TAB_IDS = SECTIONS.map((s) => s.id) as TabId[];

/**
 * The whole document on one page.
 *
 * It used to be the exception — the route Expand All and the print path led to, described in this
 * file as "the expensive route by design". It is now what "/" serves, because a proposal read on
 * a phone is read by scrolling and a reader should never have to choose a destination before
 * they have seen the argument. "/full" is kept as an alias so every existing link to it lands in
 * the same place.
 */
const FULL = "full";

/** The route "/" serves: the same document, streamed a section at a time. */
const FLOW = "flow";

/**
 * How many sections of the flow are rendered into the HTML before streaming takes over.
 *
 * It was two, when the flow opened with the ask (1,053 words) and the executive summary (1,283).
 * The restructure put Objectives and The Data in those slots — 5,024 words between them — and the
 * first paint went from 41 kB gzipped to 69. One section is now the same bargain two used to be:
 * §1 is the whole of what this engagement is for, so the page is complete and useful the moment it
 * paints, and at a measured 10,547px it is three phone screens of runway before §2 is needed.
 */
const PRERENDERED = 1;

/**
 * The route served at "/".
 *
 * It was the cover. A cover page states who a document is for and on what terms, which is the
 * right content for a printed front matter and the wrong content for the one screen every reader
 * reaches. The proposal's ask — approve the Phase −1 sprint, meet inside fourteen days — sat at
 * the far end of nineteen routes and roughly four hours of reading, where a decision-maker
 * scanning on a phone would never reach it.
 *
 * So "/" is now the decision. The cover keeps its own route, its own section number and every
 * link into it; it is simply no longer the thing standing in the doorway.
 */
// The flow's first section, kept as the name the rest of this file used for "where the reader
// starts". It is §0, the ask — unchanged — but reaching it is now scrolling to the top rather
// than choosing a route.

/**
 * One route per section, and why.
 *
 * This was a single route that rendered every section on the server and handed them to a
 * client component as props. React Server Components serialise everything crossing that
 * boundary, so the browser downloaded every section and displayed one: measured, 2.05 MB of the
 * 2.49 MB response was payload for the sections the reader was not looking at, and the
 * response was the largest asset on the page — heavier than every script put together. First
 * Contentful Paint was transfer-bound at 3.0s on a throttled mobile connection, against a
 * proposal whose own §8.1.1 calls 3G loading non-negotiable.
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
/**
 * Only the routes generated below exist. Any other slug was already a 404 (notFound() below);
 * declaring it lets a sibling static route (app/style-frames) take its own path rather than being
 * resolved through this catch-all.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: [] as string[] }, ...TAB_IDS.map((id) => ({ slug: [id] })), { slug: [FULL] }];
}

async function readAll(): Promise<Record<TabId, string>> {
  const contentDir = path.join(process.cwd(), "public", "content");
  const entries = await Promise.all(
    SECTIONS.map(async (section) => {
      const raw = await fs
        .readFile(path.join(contentDir, CONTENT_FILES[section.id]), "utf-8")
        .catch(() => "");
      return [section.id, raw] as const;
    })
  );
  return Object.fromEntries(entries) as Record<TabId, string>;
}

const countWords = (raw: string) => raw.split(/\s+/).filter(Boolean).length;

/**
 * How much of a chapter Brief mode actually shows.
 *
 * Computed here, on the server, from the same segmentation the renderer uses — so the hero's
 * "Brief: ~N min" is a measurement of what the reader will see rather than a guess typed into a
 * string. If the folding rules change, this number changes with them.
 *
 * Everything a fold hides is subtracted: the Brief disclosures, the long-prose folds, and every
 * panel of a disclosure group except the one that opens.
 */
function briefWords(raw: string, isClosingSection: boolean): number {
  let hidden = 0;
  for (const segment of segmentContent(raw, { isClosingSection })) {
    if (segment.kind === "brief") hidden += segment.hiddenWords;
    else if (segment.kind === "fold") hidden += countWords(segment.text);
    else if (segment.kind === "group") {
      // DisclosureGroup opens its first panel, so only the rest is hidden; a text version inside
      // the open panel is closed in Brief.
      hidden += segment.panels.slice(1).reduce((n, panel) => n + countWords(panel.text), 0);
      hidden += textVersionWords(segment.panels[0]?.text ?? "");
    } else {
      // Shown text: a text version in it sits closed under its figure (brief §12).
      hidden += textVersionWords(segment.text);
    }
  }
  return Math.max(0, countWords(raw) - hidden);
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;

  if (slug && slug.length > 1) notFound();
  // "/" is the flow: the whole document, in reading order, in one scroll. A bare section route
  // still serves that section alone — it is what a shared deep link lands on, and it stays the
  // cheap way to read one part — but nothing in the interface navigates to one any more.
  const requested = slug?.[0] ?? FLOW;
  const expanded = requested === FLOW || requested === FULL;
  if (!expanded && !TAB_IDS.includes(requested as TabId)) notFound();
  // "/full" is the same document with every section rendered on the server: it is what print,
  // Save as PDF and a reader with JavaScript off get. "/" is the same order, streamed.
  const streamed = requested === FLOW;

  const activeTab = (expanded ? FLOW_ORDER[0] : requested) as TabId;
  const documents = await readAll();

  // Derived from the same markdown, here on the server, so the table of contents can never
  // disagree with the document it indexes. Headings only — this stays cheap.
  const sections = buildSectionIndex(documents);

  // Reading time needs every section's length even when only one section's prose is served.
  // One integer per route, rather than a rendered tree per route.
  const wordCounts = Object.fromEntries(
    SECTIONS.map((s) => [s.id, countWords(documents[s.id])])
  ) as Record<TabId, number>;

  // The same figure for Brief mode, so the hero can offer the reader a real choice between two
  // measured reading times rather than one number and a promise.
  const briefWordCounts = Object.fromEntries(
    SECTIONS.map((s) => [s.id, briefWords(documents[s.id], s.id === "nextsteps")])
  ) as Record<TabId, number>;

  /**
   * What this route renders on the server.
   *
   * The flow renders its opening sections and lets the rest arrive as the reader reaches them
   * (components/flow/StreamedSection.tsx). Rendering all thirty produced a 4.9 MB page — 660 KB
   * on the wire — which is the wrong bill to hand a reader who has not yet read a sentence. Two
   * sections is the ask and the executive summary: enough that the page is complete and useful
   * the moment it paints, and enough runway for the third to arrive before it is scrolled to.
   *
   * /full still renders all thirty, because print does not scroll.
   */
  const served = expanded ? (streamed ? FLOW_ORDER.slice(0, PRERENDERED) : FLOW_ORDER) : [activeTab];
  const rendered = Object.fromEntries(
    served.map((id) => [id, <MarkdownViewer key={id} content={documents[id]} tabId={id} />])
  ) as Partial<Record<TabId, React.ReactNode>>;

  return (
    <ClientPage
      sections={sections}
      documents={rendered}
      wordCounts={wordCounts}
      briefWordCounts={briefWordCounts}
      activeTab={activeTab}
      expanded={expanded}
      streamed={streamed}
    />
  );
}
