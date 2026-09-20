import { ChevronDown, CornerDownRight } from "lucide-react";

/**
 * A paragraph the reader has already read, arriving as one line instead of as itself.
 *
 * RULE 1b IN ONE COMPONENT. The brief's four ways of making the site shorter include "duplicates
 * are collapsed, not deleted — they become links until Firefly approves removal". This is the
 * link. The repeated paragraph is still in the markdown, still in the DOM, still in the printed
 * kit; what it costs a reader is one line and a tap rather than a second reading.
 *
 * IT SHIPS OPEN AND IS CLOSED BY SCRIPT, which is the opposite of how a disclosure is usually
 * built and the only arrangement that survives the tests.
 *
 * Two mechanisms were tried and measured before this one. The grid-rows 0fr→1fr technique with a
 * print override computed correctly — `grid-template-rows` really did resolve to `1fr` under
 * `@media print` — and the element still measured zero, so the paragraph did not print. A plain
 * closed `<details>` fared no better: globals.css already carries
 * `details:not([open]) > *:not(summary) { display: revert }` for print, and measured under print
 * emulation the disclosure was 39px tall against a 37px summary — the body absent. Chrome hides a
 * closed `details`'s contents through content-visibility on a UA slot, which no author CSS reaches.
 *
 * A collapsed duplicate that vanishes from the PDF is a deletion Firefly never approved. So the
 * SERVER-RENDERED state is the complete one — `open`, the whole paragraph, no JavaScript needed —
 * and `CrossRefCollapse` closes them once on mount and reopens them for `beforeprint`. With
 * JavaScript off, or in any printing path that does not run scripts, the document is whole.
 *
 * TWO THINGS IT DELIBERATELY DOES NOT DO:
 *
 *   1. It does not summarise. The closed line says where the paragraph was said first and how
 *      long it is, and nothing about its content — a summary would be a fifth version of a thing
 *      the document already says twice.
 *   2. It does not move the paragraph. The text stays exactly where the author put it, in its
 *      own section, in reading order.
 */
export function CrossRef({
  section,
  href,
  words,
  verbatim,
  children,
}: {
  section: string;
  href: string;
  words: number;
  /** Word-for-word identical, rather than the same point in different words. */
  verbatim: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open
      className="crossref not-prose group my-4 rounded-xl border border-line bg-paper/60"
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
        <CornerDownRight size={13} className="shrink-0 text-muted" aria-hidden="true" />
        <span className="t-micro leading-snug text-muted">
          {verbatim ? "Repeats" : "Restates"}{" "}
          {/* A real anchor: it works with JavaScript off, and it is the point of the control. */}
          <a href={href} className="font-semibold text-accent underline underline-offset-2">
            {section}
          </a>{" "}
          <span className="tabular-nums">· {words} words</span>
        </span>
        <span className="crossref-toggle ml-auto inline-flex items-center gap-1 t-micro font-bold text-muted group-hover:text-ink">
          <span className="group-open:hidden">Read it here</span>
          <span className="hidden group-open:inline">Hide</span>
          <ChevronDown
            size={12}
            className="shrink-0 transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </span>
      </summary>
      <div className="border-t border-line/60 px-3 py-2.5 text-ink">{children}</div>
    </details>
  );
}
