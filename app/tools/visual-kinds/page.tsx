import fs from "node:fs/promises";
import path from "node:path";

import { MarkdownViewer } from "@/components/MarkdownViewer";
import { compileVisuals } from "@/lib/visual-compile";

/**
 * A fixture that renders every ```visual kind, the lead fence, a fold and every inline chip
 * (brief 2026-10 declutter, Stage 2). Not linked from the proposal and not indexed.
 */
export const metadata = {
  title: "Visual kinds | Kitui 2027",
  robots: { index: false, follow: false },
};

export default async function VisualKindsPage() {
  const source = await fs.readFile(path.join(process.cwd(), "docs", "declutter", "fixture-visual-kinds.md"), "utf8");
  return (
    <main className="pf-shell mx-auto max-w-3xl px-4 py-10">
      <MarkdownViewer content={compileVisuals(source, "docs/declutter/fixture-visual-kinds.md")} tabId="annex-terms" />
    </main>
  );
}
