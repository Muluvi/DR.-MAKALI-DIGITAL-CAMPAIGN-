import React from "react";
import { CheckCircle2 } from "lucide-react";
import { HighlightedText } from "./HighlightedText";
import { PlatformMentions } from "./PlatformMentions";
import { hasHighlight } from "../../lib/highlight-patterns";
import { hasPlatformMention } from "../../lib/platform-mentions";
import type { TabId } from "../../lib/heading-slug";

/**
 * Server components. Between them they render every paragraph and every list item in a
 * ~200-minute document, so the cost of marking them `"use client"` was paid on every one of
 * several thousand text nodes — each shipped to the browser and hydrated purely to discover it
 * had nothing to highlight. `hasHighlight` is the same pattern set the highlighter itself uses
 * (lib/highlight-patterns is the single source), so a string only crosses into the client tree
 * when there is genuinely a tooltip, cross-reference, claim badge, working drawer or key-takeaway
 * banner in it. Everything else is plain server-rendered markup.
 *
 * Platform marks are the second pass and stay on the server entirely. A string that only names
 * a platform never reaches the client tree — PlatformMentions draws SVG and nothing else. A
 * string that needs both is handed to HighlightedText, which applies the marks itself to the
 * plain runs it does not otherwise touch, so the two passes compose instead of one erasing the
 * other.
 */
function highlight(children: React.ReactNode, tabId?: TabId) {
  return React.Children.map(children, (child) => {
    if (typeof child !== "string") return child;
    if (hasHighlight(child)) return <HighlightedText text={child} tabId={tabId} />;
    if (hasPlatformMention(child)) return <PlatformMentions text={child} />;
    return child;
  });
}

export function MarkdownParagraph({ children, tabId }: { children?: React.ReactNode; tabId?: TabId }) {
  return (
    <p className="t-body sm:t-body text-ink/90 leading-[1.65] my-2.5 sm:my-3.5 text-pretty max-w-none lg:max-w-[72ch]">
      {highlight(children, tabId)}
    </p>
  );
}

export function MarkdownListItem({
  children,
  tabId,
  emphasis,
}: {
  children?: React.ReactNode;
  tabId?: TabId;
  /** Pull-quote-style emphasis for the handful of list items the proposal treats as its
   * governing claims, instead of the default plain bullet. */
  emphasis?: boolean;
}) {
  const content = highlight(children, tabId);

  if (emphasis) {
    return (
      <li className="pull-quote not-prose my-3 sm:my-4 list-none pl-3 sm:pl-4 py-1 border-l-4 border-gold print-avoid-break">
        <span className="block font-serif text-base sm:text-lg font-semibold text-ink leading-snug text-balance">{content}</span>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-2 my-1.5 sm:my-2 t-body sm:t-body text-ink/90 list-none">
      <span className="mt-1 text-accent shrink-0">
        <CheckCircle2 size={14} className="stroke-[2.5]" />
      </span>
      <span className="leading-relaxed text-pretty">{content}</span>
    </li>
  );
}
