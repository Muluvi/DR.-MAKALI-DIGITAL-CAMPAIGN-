"use client";

import { useEffect } from "react";

/**
 * Keeps the heading outline from skipping a level (WCAG 1.3.1; Lighthouse "heading-order").
 *
 * A figure, card or panel titles itself with an h4 or h5 wherever it is mounted, so under an h2 the
 * outline jumps two levels. Its right level depends on where it lands, which the component cannot
 * know. So, in document order, any heading deeper than one below the heading before it is given
 * `aria-level` one below that heading. Section headings (h2, h3) are never deeper than that, so
 * they keep their own level, and every id, class and style stays as it is.
 */
const MARK = "data-outline-level";

function normalise(root: ParentNode) {
  let previous = 1;
  for (const h of root.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")) {
    if (h.closest("[hidden]")) continue;
    const native = Number(h.tagName[1]);
    if (native > previous + 1) {
      const level = previous + 1;
      h.setAttribute("aria-level", String(level));
      h.setAttribute(MARK, "");
      previous = level;
    } else {
      if (h.hasAttribute(MARK)) {
        h.removeAttribute("aria-level");
        h.removeAttribute(MARK);
      }
      previous = native;
    }
  }
}

export function HeadingOutline() {
  useEffect(() => {
    // The whole page: the cover hero sits above <main>.
    const root = document.body;
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        normalise(root);
      });
    };
    schedule();
    // Sections stream in and folds open; both change which headings are in the outline.
    const mo = new MutationObserver(schedule);
    mo.observe(root, { childList: true, subtree: true, attributeFilter: ["hidden"] });
    return () => {
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
