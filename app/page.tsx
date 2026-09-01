import fs from "fs/promises";
import path from "path";
import { ClientPage } from "@/components/ClientPage";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import type { TabId } from "@/lib/heading-slug";
import { buildSectionIndex } from "@/lib/section-index";

function toSection(raw: string, tabId: TabId) {
  return {
    node: <MarkdownViewer content={raw} tabId={tabId} />,
    wordCount: raw.split(/\s+/).filter(Boolean).length,
  };
}

export default async function Page() {
  const contentDir = path.join(process.cwd(), "public", "content");

  // Read markdown files
  const [exec, programme, registers] = await Promise.all([
    fs.readFile(path.join(contentDir, "exec.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "programme.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "registers.md"), "utf-8").catch(() => ""),
  ]);

  // The section index is derived from the same markdown, here on the server, so the
  // table of contents can never disagree with the document it indexes.
  const sections = buildSectionIndex({ exec, programme, registers });

  // Markdown parsing happens here, on the server, so react-markdown and its
  // remark/rehype plugins never ship to the client bundle.
  return (
    <ClientPage
      sections={sections}
      exec={toSection(exec, "exec")}
      programme={toSection(programme, "programme")}
      registers={toSection(registers, "registers")}
    />
  );
}
