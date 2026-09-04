import fs from "fs/promises";
import path from "path";
import { ClientPage } from "@/components/ClientPage";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { SECTIONS, type TabId } from "@/lib/heading-slug";
import { buildSectionIndex } from "@/lib/section-index";

// One file per top-level section, named so the directory listing reads as the offer itself.
const FILES: Record<TabId, string> = {
  overview: "0-overview.md",
  race: "1-race.md",
  argument: "2-argument.md",
  channels: "3-channels.md",
  ground: "4-ground.md",
  defence: "5-defence.md",
  data: "6-data.md",
  team: "7-team.md",
  measure: "8-measure.md",
  ask: "9-ask.md",
};

export default async function Page() {
  const contentDir = path.join(process.cwd(), "public", "content");

  const entries = await Promise.all(
    SECTIONS.map(async (section) => {
      const raw = await fs
        .readFile(path.join(contentDir, FILES[section.id]), "utf-8")
        .catch(() => "");
      return [section.id, raw] as const;
    })
  );
  const documents = Object.fromEntries(entries) as Record<TabId, string>;

  // The section index is derived from the same markdown, here on the server, so the table of
  // contents can never disagree with the document it indexes.
  const sections = buildSectionIndex(documents);

  // Markdown parsing happens here, on the server, so react-markdown and its remark/rehype
  // plugins never ship to the client bundle.
  const rendered = Object.fromEntries(
    SECTIONS.map((section) => [
      section.id,
      {
        node: <MarkdownViewer content={documents[section.id]} tabId={section.id} />,
        wordCount: documents[section.id].split(/\s+/).filter(Boolean).length,
      },
    ])
  ) as Record<TabId, { node: React.ReactNode; wordCount: number }>;

  return <ClientPage sections={sections} documents={rendered} />;
}
