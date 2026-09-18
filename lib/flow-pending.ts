/**
 * How many sections of the flow are still fetching their prose.
 *
 * Landing on a deep link is a race against the page's own height. Sections stream in around the
 * landing point, each one replacing a reserved height with its real one, and every replacement
 * moves the target. The scroll helper can correct for that — but only if it knows when to stop,
 * and "the document height has stopped changing" is the wrong answer, because a height holds
 * perfectly still while a fetch is in flight and then jumps when it lands.
 *
 * So the sections say so themselves. One integer, read by lib/scroll-to-section.ts, written by
 * components/flow/StreamedSection.tsx. No React state: this is read inside a timer, sixty
 * thousand times a page would be absurd, and nothing renders from it.
 */
let pending = 0;

export function markSectionPending(): () => void {
  pending += 1;
  let done = false;
  return () => {
    if (done) return;
    done = true;
    pending = Math.max(0, pending - 1);
  };
}

export function sectionsPending(): number {
  return pending;
}
