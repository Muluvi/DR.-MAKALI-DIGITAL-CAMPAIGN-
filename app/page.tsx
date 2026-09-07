import fs from "fs/promises";
import path from "path";
import { ClientPage } from "@/components/ClientPage";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { SECTIONS, type TabId } from "@/lib/heading-slug";
import { buildSectionIndex } from "@/lib/section-index";

// One file per top-level section, named so the directory listing reads as the offer itself.
const FILES: Record<TabId, string> = {
  overview: "0-overview.md",
  decision: "1-decision.md",
  evidence: "2-evidence.md",
  strategy: "3-strategy.md",
  publishing: "4a-publishing.md",
  ground: "4b-ground.md",
  defence: "4c-defence.md",
  technology: "4d-technology.md",
  team: "4e-team.md",
  delivery: "5-delivery.md",
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
