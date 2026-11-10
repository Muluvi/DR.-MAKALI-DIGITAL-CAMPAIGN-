import { confetti, sound } from "./feedback";

/**
 * Scroll-driven chrome, all from ONE passive scroll listener that schedules ONE animation frame.
 *
 *   progress bar      a hairline at the top, scaled on X (compositor only)
 *   back to top       appears after one screen, its ring filling with progress
 *   header state      html[data-fx-scrolled], html[data-fx-dir="up|down"] for the
 *                     transparent → glass header and the hide-on-the-way-down header
 *   velocity          --fx-vel, -1…1, decays to 0 when scrolling stops (skew and stretch)
 *   colour zones      html[data-fx-zone] from the section in view: the background tint shifts
 *   nav dots          one dot per chapter on the left edge of a wide screen, scroll-spied
 *   pinned rails      .fx-hscroll: the section pins and its track scrolls sideways
 *   favicon           the tab icon is a ring that fills as the document is read
 *   idle              html[data-fx-idle] after a quiet spell, for the attention nudge
 *   the end           a confetti burst the first time the reader reaches the footer
 *
 * The motion is read from layout once per frame and written as transforms and custom properties
 * only. Nothing here forces a style recalculation inside the scroll event itself.
 */
export function startScroll(): () => void {
  const root = document.documentElement;
  const cleanups: Array<() => void> = [];

  // ---------------------------------------------------------------- progress bar + loading bar
  const bar = document.createElement("div");
  bar.className = "fx-progress";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = '<span class="fx-progress__fill"></span>';
  document.body.appendChild(bar);
  const fill = bar.firstElementChild as HTMLElement;
  cleanups.push(() => bar.remove());

  // ---------------------------------------------------------------- back to top
  const btt = document.createElement("button");
  btt.type = "button";
  btt.className = "fx-btt";
  btt.setAttribute("aria-label", "Back to top");
  btt.setAttribute("data-fx-tip", "Back to top");
  btt.innerHTML =
    '<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="fx-btt__track" cx="24" cy="24" r="21"/><circle class="fx-btt__ring" cx="24" cy="24" r="21" pathLength="100"/></svg>' +
    '<svg class="fx-btt__arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  btt.addEventListener("click", () => {
    sound("close");
    btt.setAttribute("data-launch", "");
    window.setTimeout(() => btt.removeAttribute("data-launch"), 700);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Return focus to the top of the document for keyboard and screen-reader users.
    const target = document.getElementById("pf-hero-title") ?? document.querySelector<HTMLElement>("h1, main");
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      window.setTimeout(() => target.focus({ preventScroll: true }), 500);
    }
  });
  document.body.appendChild(btt);
  const ring = btt.querySelector<SVGCircleElement>(".fx-btt__ring")!;
  cleanups.push(() => btt.remove());

  // ---------------------------------------------------------------- nav dots
  const dots = document.createElement("nav");
  dots.className = "fx-dots";
  dots.setAttribute("aria-label", "Chapters");
  const dotList = document.createElement("ol");
  dots.appendChild(dotList);
  const indicator = document.createElement("span");
  indicator.className = "fx-dots__indicator";
  indicator.setAttribute("aria-hidden", "true");
  dots.appendChild(indicator);
  document.body.appendChild(dots);
  cleanups.push(() => dots.remove());

  let sections: HTMLElement[] = [];
  let activeIndex = -1;
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const i = sections.indexOf(e.target as HTMLElement);
        if (i < 0 || i === activeIndex) continue;
        activeIndex = i;
        root.setAttribute("data-fx-zone", String(i % 6));
        dotList.querySelectorAll("button").forEach((b, j) => {
          if (j === i) b.setAttribute("aria-current", "true");
          else b.removeAttribute("aria-current");
        });
        indicator.style.translate = `0 ${i * 18}px`;
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  cleanups.push(() => spy.disconnect());

  const buildDots = () => {
    const found = Array.from(document.querySelectorAll<HTMLElement>(".flow-section[id], .plat-page > section[id]"));
    if (found.length === sections.length && found.every((s, i) => s === sections[i])) return;
    spy.disconnect();
    sections = found;
    dotList.textContent = "";
    dots.toggleAttribute("hidden", sections.length < 3);
    sections.forEach((s, i) => {
      const label = s.querySelector(".flow-chap__label")?.textContent?.trim() || s.getAttribute("aria-label") || `Section ${i + 1}`;
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", label);
      b.setAttribute("data-fx-tip", label);
      b.style.setProperty("--i", String(i));
      b.addEventListener("click", () => {
        sound("tap");
        s.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      li.appendChild(b);
      dotList.appendChild(li);
      spy.observe(s);
    });
    activeIndex = -1;
  };
  buildDots();
  let dotsTimer = 0;
  const mo = new MutationObserver(() => {
    window.clearTimeout(dotsTimer);
    dotsTimer = window.setTimeout(buildDots, 400);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  cleanups.push(() => {
    mo.disconnect();
    window.clearTimeout(dotsTimer);
  });

  // ---------------------------------------------------------------- favicon
  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  const originalIcon = icon?.href;
  const iconCanvas = document.createElement("canvas");
  iconCanvas.width = iconCanvas.height = 64;
  let lastIconPct = -1;
  const drawIcon = (pct: number) => {
    const step = Math.round(pct * 50) / 50; // every 2%
    if (step === lastIconPct) return;
    lastIconPct = step;
    const g = iconCanvas.getContext("2d");
    if (!g) return;
    const s = getComputedStyle(root);
    const accent = s.getPropertyValue("--accent-solid").trim() || "#2546c8";
    const gold = s.getPropertyValue("--gold").trim() || "#c99a2e";
    g.clearRect(0, 0, 64, 64);
    g.lineWidth = 8;
    g.strokeStyle = "rgba(127,127,127,0.35)";
    g.beginPath();
    g.arc(32, 32, 26, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = accent;
    g.lineCap = "round";
    g.beginPath();
    g.arc(32, 32, 26, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0.02, step));
    g.stroke();
    g.fillStyle = gold;
    g.beginPath();
    g.arc(32, 32, 10, 0, Math.PI * 2);
    g.fill();
    let link = document.querySelector<HTMLLinkElement>("link[data-fx-favicon]");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.setAttribute("data-fx-favicon", "");
      document.head.appendChild(link);
    }
    try {
      link.href = iconCanvas.toDataURL("image/png");
    } catch {
      // A tainted or unsupported canvas: the static icon stays.
    }
  };
  cleanups.push(() => {
    document.querySelector("link[data-fx-favicon]")?.remove();
    if (icon && originalIcon) icon.href = originalIcon;
  });

  // ---------------------------------------------------------------- the end of the document
  const footer = document.querySelector(".pf-footer");
  if (footer) {
    const endIO = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        endIO.disconnect();
        let seen = false;
        try {
          seen = sessionStorage.getItem("kitui2027:fx-end") === "1";
          sessionStorage.setItem("kitui2027:fx-end", "1");
        } catch {
          // Celebrate anyway.
        }
        if (seen) return;
        const r = (e.target as Element).getBoundingClientRect();
        confetti(window.innerWidth / 2, Math.max(80, r.top), 120);
        sound("success");
      },
      { threshold: 0.4 }
    );
    endIO.observe(footer);
    cleanups.push(() => endIO.disconnect());
  }

  // ---------------------------------------------------------------- idle
  let idleTimer = 0;
  const wake = () => {
    root.removeAttribute("data-fx-idle");
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => root.setAttribute("data-fx-idle", ""), 7000);
  };
  wake();
  window.addEventListener("pointermove", wake, { passive: true });
  window.addEventListener("keydown", wake);
  cleanups.push(() => {
    window.clearTimeout(idleTimer);
    window.removeEventListener("pointermove", wake);
    window.removeEventListener("keydown", wake);
  });

  // ---------------------------------------------------------------- the frame
  let lastY = window.scrollY;
  let lastT = performance.now();
  let vel = 0;
  let frame = 0;
  let decay = 0;

  const read = () => {
    frame = 0;
    const y = window.scrollY;
    const t = performance.now();
    const max = Math.max(1, root.scrollHeight - root.clientHeight);
    const p = Math.min(1, Math.max(0, y / max));

    fill.style.transform = `scaleX(${p.toFixed(4)})`;
    ring.style.strokeDashoffset = String(100 - p * 100);
    btt.toggleAttribute("data-show", y > window.innerHeight * 0.9);
    root.toggleAttribute("data-fx-deep", y > window.innerHeight * 0.9);
    root.toggleAttribute("data-fx-scrolled", y > 8);
    if (Math.abs(y - lastY) > 4) root.setAttribute("data-fx-dir", y > lastY ? "down" : "up");
    root.style.setProperty("--fx-scroll", p.toFixed(4));

    // Velocity in px/ms, normalised so a brisk flick reads ~1.
    const dt = Math.max(1, t - lastT);
    const v = (y - lastY) / dt;
    vel = vel * 0.7 + Math.max(-1, Math.min(1, v / 3)) * 0.3;
    root.style.setProperty("--fx-vel", vel.toFixed(3));
    lastY = y;
    lastT = t;

    // Pinned horizontal rails.
    document.querySelectorAll<HTMLElement>(".fx-hscroll").forEach((wrap) => {
      const track = wrap.querySelector<HTMLElement>(".fx-hscroll__track");
      const pin = wrap.querySelector<HTMLElement>(".fx-hscroll__pin");
      if (!track || !pin) return;
      const r = wrap.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const prog = Math.min(1, Math.max(0, -r.top / span));
      // How far the track overflows the pinned window it travels through.
      const shift = Math.max(0, track.scrollWidth - pin.clientWidth);
      track.style.setProperty("--fx-hx", `${(-prog * shift).toFixed(1)}px`);
      wrap.style.setProperty("--fx-hp", prog.toFixed(3));
    });

    drawIcon(p);

    // Let the velocity settle to rest after the last scroll event.
    window.clearTimeout(decay);
    decay = window.setTimeout(() => {
      vel = 0;
      root.style.setProperty("--fx-vel", "0");
    }, 140);
  };
  const onScroll = () => {
    wake();
    if (!frame) frame = requestAnimationFrame(read);
  };
  read();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  cleanups.push(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (frame) cancelAnimationFrame(frame);
    window.clearTimeout(decay);
    for (const a of ["data-fx-scrolled", "data-fx-dir", "data-fx-zone", "data-fx-idle", "data-fx-deep"]) root.removeAttribute(a);
  });

  return () => cleanups.forEach((c) => c());
}

/** The top loading bar for navigations: indeterminate until the route settles. */
export function loadingBar(on: boolean) {
  document.documentElement.toggleAttribute("data-fx-loading", on);
}
