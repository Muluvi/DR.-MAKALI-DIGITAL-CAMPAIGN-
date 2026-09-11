

declare global {
  interface Window {
    /** Installed by ClientPage. Jumps to a heading even when it lives in another section. */
    __navigateToSection?: (id: string) => void;
  }
}

// Scrolls to a section heading once it actually exists in the DOM. Content mounts
// asynchronously (tab switch, lazy sections) and content-visibility:auto ancestors can still
// shift layout as they're revealed, so this retries until the element appears and then makes
// one corrective pass shortly after, rather than assuming a fixed number of frames is enough.
export function scrollToSectionWhenReady(id: string, behavior: ScrollBehavior = "smooth", maxAttempts = 40) {
  let attempts = 0;

  // Landing on a section is a two-stage problem, and one corrective pass was not enough once
  // each section became its own route. The element can exist before the lazy sections above it
  // have mounted and before `content-visibility: auto` ancestors have been measured, so its
  // position keeps moving for up to a second or so after the first scroll. These passes re-seat
  // it, and stop as soon as it is settled near the top rather than fighting a reader who has
  // started scrolling themselves.
  const SETTLE_DELAYS = [120, 320, 700, 1200];

  const settle = () => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    // Within a heading's height of where it belongs, or the reader has taken over. Either way,
    // leave it alone.
    if (Math.abs(top) < 8 || top < -200) return;
    el.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior, block: "start" });
      if (`#${id}` !== window.location.hash) {
        history.pushState(null, "", `#${id}`);
      }
      for (const delay of SETTLE_DELAYS) setTimeout(settle, delay);
      return;
    }
    attempts += 1;
    if (attempts < maxAttempts) {
      setTimeout(tryScroll, 50);
    }
  };

  requestAnimationFrame(tryScroll);
}
