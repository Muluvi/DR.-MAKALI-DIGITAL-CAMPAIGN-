"use client";

import { useEffect } from "react";

/**
 * Closes the rule 1b cross-references once, on mount, and reopens them to print.
 *
 * WHY THE COLLAPSE IS THE ENHANCEMENT AND NOT THE DEFAULT. `CrossRef` server-renders its
 * `details` OPEN, carrying the repeated paragraph in full. That is the state a printer, a reader
 * with JavaScript off, and any scriptless PDF pipeline gets, and it is the state rule 1b requires:
 * the duplicate is collapsed, never cut, and Firefly has approved no deletion.
 *
 * Collapsing is a convenience for a reader who is scrolling, so it is a convenience that arrives
 * with the script and leaves before the page is printed. `beforeprint` reopens every one of them;
 * `afterprint` restores whatever the reader had chosen, because someone who opened a
 * cross-reference to read it should not find it shut again by the act of printing.
 *
 * One effect for all of them rather than state per instance: there are three cross-references in
 * the document, and three hydrated components with their own state would cost more than this.
 */
export function CrossRefCollapse() {
  useEffect(() => {
    const all = () => [...document.querySelectorAll<HTMLDetailsElement>("details.crossref")];

    // Closed on arrival — but only now, when there is a script to open them again.
    for (const el of all()) el.open = false;

    let reopened: HTMLDetailsElement[] = [];
    const before = () => {
      reopened = all().filter((el) => !el.open);
      for (const el of reopened) el.open = true;
    };
    const after = () => {
      for (const el of reopened) el.open = false;
      reopened = [];
    };

    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return null;
}
