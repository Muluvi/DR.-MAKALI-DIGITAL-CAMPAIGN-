import { notFound } from "next/navigation";
import { PageHead } from "@/components/platform/PageHead";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { TOOLS } from "@/lib/tools/catalog";
import { toolOgImage } from "@/lib/card/og";

/** The 29 tools added in November 2026, one full page each. The story opens the same tools in place. */
const TOOL_SLUGS = Object.keys(TOOLS);
export function generateStaticParams() {
  return TOOL_SLUGS.map((tool) => ({ tool }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const title = `${TOOLS[tool]?.title ?? "Tool"} | Kitui 2027`;
  // The pasted link shows this tool's own share card (visual upgrade, E5).
  const image = { url: toolOgImage(tool), width: 1080, height: 1080, alt: TOOLS[tool]?.lead ?? title };
  return { title, robots: { index: false, follow: false }, openGraph: { title, description: TOOLS[tool]?.lead, images: [image] }, twitter: { card: "summary_large_image", images: [image.url] } };
}

export default async function Page({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const t = TOOLS[tool];
  if (!t) notFound();
  return <>
    <PageHead kicker="Planning tool" title={t.title} lead={t.lead} />
    {t.render()}
    <ToolLimits does={t.does} doesNot={t.doesNot} sources={t.sources} />
  </>;
}
