/**
 * Land on a section, and stay on it while the page around it is still arriving.
 *
 * Scrolling to an anchor is only simple on a page that is already its final height. This one is
 * not: the flow streams its sections in as the reader approaches them, and a deep link into §13
 * scrolls past twenty-five sections whose heights are reserved from an estimate. Every one that
 * resolves into real prose moves the target — measured, a link to §13.0 first landed 25,576px
 * short of it.
 *
 * So this does not scroll once and hope. It scrolls, then re-seats the target every tenth of a
 * second until the target itself has held still for four checks running. The target is what is
 * measured, deliberately: an earlier version watched the document's height instead, which holds
 * perfectly still while a fetch is in flight and therefore read as settled seconds before the
 * prose landed.
 *
 * A reader who scrolls owns the viewport from that moment. Nothing here fights them for it.
 */
export function scrollToSectionWhenReady(id: string, behavior: ScrollBehavior = "smooth", maxAttempts = 60) {
  let attempts = 0;

  /**
   * Get into the right neighbourhood first.
   *
   * A link to §11.1 names a heading inside a section that has not streamed in yet, so the element
   * does not exist for the first few seconds and the reader sits at the top of the document
   * watching nothing happen. The section CONTAINER always exists — it is in the server HTML with
   * its measured height — so the page travels there immediately and the polling below only has to
   * cover the last screen or two once the prose lands.
   */
  const container = document.getElementById(`section-${id.split("-sec-")[0]}`);
  if (container && !document.getElementById(id)) {
    container.scrollIntoView({ behavior: "instant", block: "start", inline: "nearest" });
  }

  const start = () => {
    const el = document.getElementById(id);
    if (!el) {
      attempts += 1;
      if (attempts < maxAttempts) setTimeout(start, 50);
      return;
    }
    /**
     * Animate a short hop; teleport a long one.
     *
     * This document is 480,000px tall. A smooth scroll from the executive summary to Annex E is
     * forty seconds of scenery at the browser's animation rate, during which the reader cannot
     * read anything and every section in between streams in and is thrown away. Past three
     * screens the honest behaviour is to arrive.
     */
    const distance = Math.abs(el.getBoundingClientRect().top);
    const far = distance > window.innerHeight * 3;
    el.scrollIntoView({ behavior: far || behavior === "auto" ? "instant" : behavior, block: "start", inline: "nearest" });
    if (`#${id}` !== window.location.hash) history.pushState(null, "", `#${id}`);
    hold(id);
  };

  requestAnimationFrame(start);
}

import { sectionsPending } from "./flow-pending";

/** How long the target is re-seated for after the first scroll, at most. */
const HOLD_MS = 12000;
/** Consecutive checks with the target in place before the hold lets go. */
const STABLE_TICKS = 4;
/**
 * The reader's gesture wins, immediately and permanently. `wheel` and `touchstart` fire before
 * the scroll they cause, so the hold releases before its next correction rather than after it.
 */
const USER_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

function hold(id: string) {
  const deadline = Date.now() + HOLD_MS;
  let stable = 0;
  let timer = 0;
  let released = false;

  const release = () => {
    if (released) return;
    released = true;
    window.clearInterval(timer);
    for (const type of USER_EVENTS) window.removeEventListener(type, release);
  };

  for (const type of USER_EVENTS) window.addEventListener(type, release, { passive: true, once: true });

  timer = window.setInterval(() => {
    const el = document.getElementById(id);
    if (!el || Date.now() > deadline) {
      release();
      return;
    }
    const top = el.getBoundingClientRect().top;
    // Within a heading's height of where it belongs, and staying there — and no section still
    // fetching. A section mid-fetch holds the page's height perfectly still and then moves it by
    // thirty thousand pixels, so "nothing is moving" is not the same as "nothing is coming".
    if (Math.abs(top) < 120) {
      stable = sectionsPending() > 0 ? 0 : stable + 1;
      if (stable >= STABLE_TICKS) release();
      return;
    }
    stable = 0;
    el.scrollIntoView({ behavior: "instant", block: "start", inline: "nearest" });
  }, 110);
}
