/**
 * Folded text that a reader can still reach.
 *
 * The site has one rendering (brief 2026-10 declutter, section 5.0). What a first read does not need
 * sits in a fold: a section's full text under its lead, a card's details, a tab that is not
 * showing, a figure's text version. Every fold body is in the HTML, and three things open it
 * without a tap:
 *
 *   FIND IN PAGE. A closed body carries `hidden="until-found"`, so the browser's own find reaches
 *   the words inside it, and fires `beforematch` on the body before it reveals the match.
 *   DEEP LINKS. A link to anything inside a closed body opens every fold around it, then scrolls
 *   (revealAround, called by lib/scroll-to-section.ts).
 *   PRINT. The print stylesheet shows every body whatever its state (app/declutter.css).
 *
 * React 19 renders `hidden` as a boolean and drops the "until-found" value, so the attribute is set
 * on the element after mount (useFoldBody). Before that, the server's markup hides a closed body
 * with CSS (`data-fold-body="closed"`), which keeps the first paint the same height as the hydrated
 * page.
 */

/** The custom event every fold body listens for, alongside the browser's own `beforematch`. */
export const REVEAL_EVENT = "fold:reveal";

/**
 * Open every closed fold that contains `el`, innermost last, so the target is on screen before the
 * caller scrolls to it.
 */
export function revealAround(el: Element | null): void {
  const chain: Element[] = [];
  for (let n = el?.parentElement ?? null; n; n = n.parentElement) {
    if (n.getAttribute("data-fold-body") === "closed") chain.push(n);
  }
  for (const body of chain.reverse()) body.dispatchEvent(new Event(REVEAL_EVENT));
}

/** Words in a markdown string, counted the way the reading-time figure counts them. */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
