import fs from "fs/promises";
import path from "path";
import { ClientPage } from "@/components/ClientPage";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import type { TabId } from "@/lib/heading-slug";

function toSection(raw: string, tabId: TabId) {
  return {
    node: <MarkdownViewer content={raw} tabId={tabId} />,
    wordCount: raw.split(/\s+/).filter(Boolean).length,
  };
}

export default async function Page() {
  const contentDir = path.join(process.cwd(), "public", "content");

  // Read markdown files
  const [exec, strategy, operations, tactics, execution, appendix] = await Promise.all([
    fs.readFile(path.join(contentDir, "exec.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "strategy.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "operations.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "tactics.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "execution.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "appendix.md"), "utf-8").catch(() => ""),
  ]);

  // Markdown parsing happens here, on the server, so react-markdown and its
  // remark/rehype plugins never ship to the client bundle.
  return (
    <ClientPage
      exec={toSection(exec, "exec")}
      strategy={toSection(strategy, "strategy")}
      operations={toSection(operations, "operations")}
      tactics={toSection(tactics, "tactics")}
      execution={toSection(execution, "execution")}
      appendix={toSection(appendix, "appendix")}
    />
  );
}
