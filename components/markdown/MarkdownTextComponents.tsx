"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { HighlightedText } from "./HighlightedText";
import type { TabId } from "../../lib/heading-slug";

export function MarkdownParagraph({ children, tabId }: { children?: React.ReactNode; tabId?: TabId }) {
  return (
    <p className="text-[14.5px] sm:text-[15.5px] text-ink/90 leading-[1.7] my-3 sm:my-4.5 text-pretty max-w-none lg:max-w-[72ch]">
      {React.Children.map(children, (child) => {
        if (typeof child === "string") return <HighlightedText text={child} tabId={tabId} />;
        return child;
      })}
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
  const content = React.Children.map(children, (child) => {
    if (typeof child === "string") return <HighlightedText text={child} tabId={tabId} />;
    return child;
  });

  if (emphasis) {
    return (
      <li className="pull-quote not-prose my-3.5 sm:my-4.5 list-none pl-3 sm:pl-4 py-1 border-l-4 border-gold print-avoid-break">
        <span className="block font-serif text-sm sm:text-base font-semibold text-ink leading-snug text-balance">{content}</span>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-2 my-2 sm:my-2.5 text-[14px] sm:text-[15px] text-ink/90 list-none">
      <span className="mt-1 text-accent shrink-0">
        <CheckCircle size={14} className="stroke-[2.5]" />
      </span>
      <span className="leading-relaxed text-pretty">{content}</span>
    </li>
  );
}
