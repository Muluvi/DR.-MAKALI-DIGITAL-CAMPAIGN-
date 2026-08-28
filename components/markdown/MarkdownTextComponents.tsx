"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { HighlightedText } from "./HighlightedText";

export function MarkdownParagraph({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-xs sm:text-sm text-ink/80 leading-relaxed my-4">
      {React.Children.map(children, (child) => {
        if (typeof child === "string") return <HighlightedText text={child} />;
        return child;
      })}
    </p>
  );
}

export function MarkdownListItem({ children }: { children?: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 my-3 text-xs sm:text-sm text-ink/90 list-none">
      <span className="mt-1 text-accent shrink-0">
        <CheckCircle size={14} className="stroke-[2.5]" />
      </span>
      <span className="leading-relaxed">
        {React.Children.map(children, (child) => {
          if (typeof child === "string") return <HighlightedText text={child} />;
          return child;
        })}
      </span>
    </li>
  );
}
