"use client";

import { useEffect } from "react";

/**
 * Every disclosure that carries CONTENT ships open, is closed by this, and reopens to print.
 *
 * WHY IT EXISTS, AND WHAT IT FIXES. Three kinds of `details` in this document hold text a reader
 * of the printed kit must have: a figure's "View the data" table, the polling gauge's table
 * equivalent, and a rule 1b cross-reference. All three were believed to print open — FigureFrame
 * carried a `print:open` class and `globals.css` carried
 * `details:not([open]) > *:not(summary) { display: revert }` under `@media print`.
 *
 * NEITHER WORKS. `open` is an attribute, not a CSS property, so `print:open` compiles to a class
 * that styles nothing. And Chrome hides a closed `details`'s contents through content-visibility
 * on a UA slot that author CSS cannot reach, so `display: revert` on the children reveals nothing.
 * Measured, not argued: rendering /reach to PDF with the disclosures as they were gives 21 pages;
 * rendering the same route with every `details` opened first gives 24. Three pages of figure data
 * tables were missing from the printed proposal.
 *
 * That is the failure the retention guard's second rule exists to prevent — a figure that replaced
 * an ASCII block keeps the block's numbers in its data table, and if the table does not print, the
 * numbers left the printed document when the block did.
 *
 * SO THE COMPLETE DOCUMENT IS THE DEFAULT. Each of these renders `<details open className="print-open">`
 * from the server; this closes them once on mount, and reopens them for `beforeprint`, restoring
 * whatever the reader had chosen on `afterprint`. With JavaScript off, or in any printing path
 * that does not run scripts, every one of them is open and the document is whole.
 *
 * The overflow menu in `InteractiveTable` is deliberately NOT in this set: it holds controls, not
 * content, and `globals.css` already drops controls from the printed page.
 */
export function PrintSafeDisclosures() {
  useEffect(() => {
    const all = () => [...document.querySelectorAll<HTMLDetailsElement>("details.print-open")];

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
