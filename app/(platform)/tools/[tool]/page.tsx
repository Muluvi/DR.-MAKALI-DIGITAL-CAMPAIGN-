import { notFound } from "next/navigation";
import { PageHead } from "@/components/platform/PageHead";
import { ToolLimits } from "@/components/tools/public/ToolLimits";
import { TOOLS } from "@/lib/tools/catalog";

/** The 29 tools added in November 2026, one full page each. The story opens the same tools in place. */
const TOOL_SLUGS = Object.keys(TOOLS);
export function generateStaticParams() {
  return TOOL_SLUGS.map((tool) => ({ tool }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  return { title: `${TOOLS[tool]?.title ?? "Tool"} | Kitui 2027`, robots: { index: false, follow: false } };
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
