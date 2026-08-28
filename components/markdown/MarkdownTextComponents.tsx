"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { HighlightedText } from "./HighlightedText";
import type { TabId } from "../../lib/heading-slug";

export function MarkdownParagraph({ children, tabId }: { children?: React.ReactNode; tabId?: TabId }) {
  return (
    <p className="text-xs sm:text-sm text-ink/80 leading-relaxed my-4 text-pretty">
      {React.Children.map(children, (child) => {
        if (typeof child === "string") return <HighlightedText text={child} tabId={tabId} />;
        return child;
      })}
    </p>
  );
}

export function MarkdownListItem({ children, tabId }: { children?: React.ReactNode; tabId?: TabId }) {
  return (
    <li className="flex items-start gap-2.5 my-3 text-xs sm:text-sm text-ink/90 list-none">
      <span className="mt-1 text-accent shrink-0">
        <CheckCircle size={14} className="stroke-[2.5]" />
      </span>
      <span className="leading-relaxed text-pretty">
        {React.Children.map(children, (child) => {
          if (typeof child === "string") return <HighlightedText text={child} tabId={tabId} />;
          return child;
        })}
      </span>
    </li>
  );
}
