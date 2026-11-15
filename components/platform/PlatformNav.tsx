"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, PenLine } from "lucide-react";

import { TOOL_BY_SLUG } from "@/lib/tools/meta";
import { RECORD_HOMES } from "@/lib/story/embeds";
import { SECTIONS } from "@/lib/heading-slug";

/**
 * The full-page views (a tool on its own page, a record, the explorer, the change history, the
 * dashboards) are expansions of the story, not a second site (flow pass, WP8). So instead of an
 * eight-item menu, each page offers one way back: to the heading in the story where the item lives,
 * or to the top of the story for the pages that belong to no single chapter. Signed-in team members
 * keep "Edit data".
 */
const recordHome = (id: string): string | null => Object.entries(RECORD_HOMES).find(([, ids]) => ids.includes(id))?.[0] ?? null;

/** The story heading a full-page view returns to, or null for the top of the story. */
export function storyHomeOf(path: string): string | null {
  const [, root, slug] = path.split("/");
  if (root === "tools" && slug) return TOOL_BY_SLUG[slug]?.home ?? null;
  if (root === "workspace" && slug) return recordHome(decodeURIComponent(slug));
  if (root === "progress") return recordHome("implementation");
  return null;
}

const CHAPTER_LABEL: Record<string, string> = Object.fromEntries(SECTIONS.map((s) => [s.id, s.label]));

export function PlatformNav({ signedIn }: { signedIn: boolean }) {
  const path = usePathname() ?? "/";
  const home = storyHomeOf(path);
  const chapter = home ? CHAPTER_LABEL[home.split("-sec-")[0]] : null;
  return (
    <nav aria-label="Back to the story" className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2 text-[0.85rem] sm:px-6">
      <Link href={home ? `/#${home}` : "/"} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-ink hover:bg-card">
        <ArrowLeft size={15} aria-hidden="true" />
        {chapter ? `Back to ${chapter}` : "Back to the story"}
      </Link>
      {signedIn && (
        <Link href="/team/data" aria-current={path.startsWith("/team/data") ? "page" : undefined} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-ink hover:bg-card">
          <PenLine size={15} aria-hidden="true" /> Edit data
        </Link>
      )}
    </nav>
  );
}
