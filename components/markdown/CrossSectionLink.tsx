"use client";

import { useContext } from "react";

import { InertMarks } from "./InertMarks";

declare global {
  interface Window {
    __navigateToSection?: (id: string) => void;
  }
}

/** In-text cross-reference (e.g. "Section 5.2.1") that jumps to the heading even when it
 * lives in a different tab — routed through the global navigator ClientPage installs,
 * so a bare markdown-rendered link doesn't need to know about tab state. */
export function CrossSectionLink({ id, children }: { id: string; children: React.ReactNode }) {
  // Inside a row's face (a button) the reference is shown, not linked; the row's details carry no
  // second copy, so the words stay and only the jump is lost there.
  if (useContext(InertMarks)) return <span className="font-bold text-accent">{children}</span>;
  return (
    <a
      href={`#${id}`}
      onClick={(e) => {
        if (window.__navigateToSection) {
          e.preventDefault();
          window.__navigateToSection(id);
        }
      }}
      className="font-bold text-accent underline decoration-accent/40 decoration-2 underline-offset-2 hover:decoration-accent transition-colors"
    >
      {children}
    </a>
  );
}
