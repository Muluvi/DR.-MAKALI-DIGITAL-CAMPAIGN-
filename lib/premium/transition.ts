/**
 * Shared-element transitions for in-page jumps (brief G-11).
 *
 * On the flow every destination is already on the page, so going to a section is a scroll, not
 * a navigation, and the cross-document @view-transition never fires. A jump across a
 * 200,000-pixel page is better as a cut than as a long smooth scroll, so where the browser has
 * the View Transitions API the jump runs inside `document.startViewTransition`: the page
 * crossfades, and the section's title and act numeral carry across — from the index row, spine
 * tick or dock label the reader pressed, to the chapter heading they land on.
 *
 * Nothing here changes where the reader lands or what is on the page: without the API, or under
 * reduced motion, the jump is the plain smooth scroll it always was.
 */
import { flushSync } from "react-dom";

type VTDocument = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };

const TITLE = "pf-section-title";
const NUMERAL = "pf-section-numeral";

function name(el: HTMLElement | null | undefined, n: string) {
  if (el) el.style.setProperty("view-transition-name", n);
}
function clear(...els: (HTMLElement | null | undefined)[]) {
  for (const el of els) el?.style.removeProperty("view-transition-name");
}

/** The element the reader pressed, if it names a section; otherwise the dock's own label. */
function sourceOf(): { title: HTMLElement | null; numeral: HTMLElement | null } {
  const active = document.activeElement as HTMLElement | null;
  const pressed = active?.closest<HTMLElement>("[data-vt-source]");
  if (pressed) {
    return {
      title: pressed.querySelector<HTMLElement>("[data-vt-title]") ?? pressed,
      numeral: pressed.querySelector<HTMLElement>("[data-vt-numeral]"),
    };
  }
  return { title: document.querySelector<HTMLElement>(".pf-dock__label"), numeral: document.querySelector<HTMLElement>(".pf-dock__numeral") };
}

/**
 * `during` is whatever else the jump changes (closing the index): it runs inside the transition's
 * update, flushed synchronously, so the pressed row is still on screen when the old state is
 * captured and gone from the new one.
 */
export function jumpTo(target: HTMLElement, top: number, during?: () => void) {
  const doc = document as VTDocument;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) {
    during?.();
    window.scrollTo({ top, behavior: "smooth" });
    return;
  }
  const from = sourceOf();
  const toTitle = target.querySelector<HTMLElement>(".flow-chap__label");
  const toNumeral = target.querySelector<HTMLElement>(".flow-chap__num");
  name(from.title, TITLE);
  name(from.numeral, NUMERAL);
  const t = doc.startViewTransition(() => {
    if (during) flushSync(during);
    clear(from.title, from.numeral);
    name(toTitle, TITLE);
    name(toNumeral, NUMERAL);
    window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
  });
  t.finished.finally(() => clear(toTitle, toNumeral));
}
