import { createElement } from "react";
import { CHAPTER_IDS } from "@/lib/story/stages";
import { loadChapter } from "@/lib/story/load";
import { ChapterBody } from "@/components/story/ChapterBody";
import { Dashboards } from "@/components/story/Dashboards";

/**
 * Each chapter's body as a static HTML fragment, rendered once at build. The page loads a chapter
 * only as the reader nears it (components/site/ChapterLoader.tsx), so the first screen carries the
 * opening and nothing else.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [...CHAPTER_IDS, "dashboards"].map((id) => ({ id: `${id}.html` }));
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = id.replace(/\.html$/, "");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const tree = chapter === "dashboards" ? createElement(Dashboards) : createElement(ChapterBody, { id: chapter, source: loadChapter(chapter) });
  const html = renderToStaticMarkup(tree);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
