// Scrolls to a section heading once it actually exists in the DOM. Content mounts
// asynchronously (tab switch, lazy sections) and content-visibility:auto ancestors can still
// shift layout as they're revealed, so this retries until the element appears and then makes
// one corrective pass shortly after, rather than assuming a fixed number of frames is enough.
export function scrollToSectionWhenReady(id: string, behavior: ScrollBehavior = "smooth", maxAttempts = 40) {
  let attempts = 0;

  const settle = () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior, block: "start" });
      if (`#${id}` !== window.location.hash) {
        history.pushState(null, "", `#${id}`);
      }
      setTimeout(settle, 280);
      return;
    }
    attempts += 1;
    if (attempts < maxAttempts) {
      setTimeout(tryScroll, 50);
    }
  };

  requestAnimationFrame(tryScroll);
}
