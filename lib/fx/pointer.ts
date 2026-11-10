import { announce } from "../../components/Toaster";
import { confetti, sound } from "./feedback";
import { finePointer, readPrefs } from "./prefs";

/**
 * Pointer and cursor effects, delegated from the document so no component carries them and no
 * pointer move schedules a React render.
 *
 *   cursor     a dot and a ring that follows it on a spring (chain lag), growing over controls,
 *              showing a contextual word over figures and chapters; a fading trail on canvas
 *   spotlight  --mx / --my on the card under the pointer: a light that tracks it
 *   tilt       cards lean toward the pointer in 3D; their inner layers shift at different depths
 *   magnet     buttons lean toward a nearby pointer (in components/premium/MicroFX)
 *   ripple     a ring from the click point on every control, mouse and touch alike
 *   tooltip    icon-only controls get an animated tooltip from their accessible name
 *   copy link  hovering a heading offers its link; a copy glows, toasts and celebrates
 *   drag       wide tables and chip rails pan with the mouse, fling with momentum, and stretch
 *              like rubber at their ends before snapping back
 *
 * Every effect that follows a pointer is off on a coarse pointer and under reduced motion; the
 * tooltip and the copy link (which are not motion) stay available to keyboard users via focus.
 */

const CARDS = ".cd__stat, .rf, .pf-bn, .rm__stop, .rm__shelf, .plat-card, .pf-story__card, .kx-step, .fx-panel__swatch, main:not(.pf-main) [class*='grid'] > a";
const INTERACTIVE = "a[href], button, [role='button'], [role='tab'], summary, label, select, .fx-drag";
const TEXTY = "input, textarea, [contenteditable='true'], .prose p, .prose li, .cd__lead";
const HEADINGS = ".flow-section h2[id], .flow-section h3[id], .prose h2[id], .prose h3[id], .plat-page h2[id]";
const DRAGGABLE = ".rf-table-wrap, .xchip-row, .prose table, .fx-drag";

function contextWord(el: Element | null): string {
  if (!el) return "";
  if (el.closest(".rf")) return "Explore";
  if (el.closest(".cd__open, .cd__step, .rm__part, .rm__chip")) return "Open";
  if (el.closest(".fx-drag, .rf-table-wrap, .xchip-row")) return "Drag";
  if (el.closest("a[href^='http']")) return "Visit";
  return "";
}

export function startPointer(motion: boolean): () => void {
  const root = document.documentElement;
  const cleanups: Array<() => void> = [];
  const fine = finePointer();

  // ---------------------------------------------------------------- tooltip (all pointers, and focus)
  const tip = document.createElement("div");
  tip.className = "fx-tip";
  tip.setAttribute("role", "tooltip");
  tip.id = "fx-tip";
  document.body.appendChild(tip);
  let tipFor: HTMLElement | null = null;
  const showTip = (el: HTMLElement) => {
    const text = el.getAttribute("data-fx-tip") || el.getAttribute("aria-label") || el.getAttribute("title");
    if (!text) return;
    tipFor = el;
    tip.textContent = text;
    const r = el.getBoundingClientRect();
    tip.setAttribute("data-show", "");
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const above = r.top > th + 16;
    const x = Math.min(window.innerWidth - tw - 8, Math.max(8, r.left + r.width / 2 - tw / 2));
    const y = above ? r.top - th - 10 : r.bottom + 10;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
    tip.setAttribute("data-side", above ? "top" : "bottom");
  };
  const hideTip = () => {
    tipFor = null;
    tip.removeAttribute("data-show");
  };
  const tipTarget = (t: EventTarget | null): HTMLElement | null => {
    if (!(t instanceof Element)) return null;
    const el = t.closest<HTMLElement>("[data-fx-tip], button[aria-label], a[aria-label]");
    if (!el) return null;
    // Only where the name is not already visible: icon-only controls and explicit tips.
    if (el.hasAttribute("data-fx-tip")) return el;
    return (el.textContent ?? "").trim().length === 0 ? el : null;
  };
  const onOver = (e: PointerEvent | FocusEvent) => {
    const el = tipTarget(e.target);
    if (el && el !== tipFor) showTip(el);
    else if (!el && tipFor) hideTip();
  };
  document.addEventListener("pointerover", onOver as EventListener, { passive: true });
  document.addEventListener("focusin", onOver as EventListener);
  document.addEventListener("focusout", hideTip);
  window.addEventListener("scroll", hideTip, { passive: true });
  cleanups.push(() => {
    tip.remove();
    document.removeEventListener("pointerover", onOver as EventListener);
    document.removeEventListener("focusin", onOver as EventListener);
    document.removeEventListener("focusout", hideTip);
    window.removeEventListener("scroll", hideTip);
  });

  // ---------------------------------------------------------------- copy link on headings
  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "fx-copylink";
  copyBtn.setAttribute("aria-label", "Copy a link to this heading");
  copyBtn.setAttribute("data-fx-tip", "Copy link");
  copyBtn.innerHTML =
    '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6.5 9.5a3 3 0 0 0 4.2 0l2.1-2.1a3 3 0 0 0-4.2-4.2l-.7.7"/><path d="M9.5 6.5a3 3 0 0 0-4.2 0L3.2 8.6a3 3 0 0 0 4.2 4.2l.7-.7"/></svg>' +
    '<svg class="fx-copylink__ok" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5 6.5 12 13 4.5" pathLength="1"/></svg>';
  document.body.appendChild(copyBtn);
  let copyFor: HTMLElement | null = null;
  const placeCopy = (h: HTMLElement) => {
    copyFor = h;
    const r = h.getBoundingClientRect();
    copyBtn.style.left = `${Math.max(4, r.left - 36)}px`;
    copyBtn.style.top = `${r.top + Math.min(r.height, 40) / 2 - 15}px`;
    copyBtn.setAttribute("data-show", "");
  };
  const onHeadingOver = (e: Event) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t || t.closest(".fx-copylink")) return;
    const h = t.closest<HTMLElement>(HEADINGS);
    if (h) placeCopy(h);
    else if (copyFor && !copyBtn.matches(":hover, :focus-visible")) {
      copyFor = null;
      copyBtn.removeAttribute("data-show");
    }
  };
  copyBtn.addEventListener("click", async () => {
    if (!copyFor) return;
    const url = `${location.origin}${location.pathname}#${copyFor.id}`;
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      ok = false;
    }
    if (ok) {
      copyBtn.setAttribute("data-ok", "");
      copyFor.setAttribute("data-fx-copied", "");
      const h = copyFor;
      window.setTimeout(() => {
        copyBtn.removeAttribute("data-ok");
        h.removeAttribute("data-fx-copied");
      }, 1400);
      const r = copyBtn.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top, 36);
      sound("success");
      announce("Link copied");
    } else {
      copyBtn.setAttribute("data-err", "");
      window.setTimeout(() => copyBtn.removeAttribute("data-err"), 600);
      sound("error");
      announce("Could not copy. The link is in the address bar.");
    }
  });
  document.addEventListener("pointerover", onHeadingOver, { passive: true });
  document.addEventListener("focusin", onHeadingOver);
  window.addEventListener("scroll", () => copyBtn.removeAttribute("data-show"), { passive: true });
  cleanups.push(() => {
    copyBtn.remove();
    document.removeEventListener("pointerover", onHeadingOver);
    document.removeEventListener("focusin", onHeadingOver);
  });

  // ---------------------------------------------------------------- ripple on click (mouse and pen;
  // touch ripples are drawn by MicroFX)
  const ripples = document.createElement("div");
  ripples.className = "fx-ripples";
  ripples.setAttribute("aria-hidden", "true");
  document.body.appendChild(ripples);
  const onDown = (e: PointerEvent) => {
    const target = e.target instanceof Element ? e.target.closest<HTMLElement>(INTERACTIVE) : null;
    if (!target) return;
    if (target.closest("button, [role='button'], [role='tab']")) sound("tap");
    if (e.pointerType === "touch") return;
    const dot = document.createElement("span");
    dot.className = "fx-ripple";
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
    ripples.appendChild(dot);
    window.setTimeout(() => dot.remove(), 900);
  };
  document.addEventListener("pointerdown", onDown, { passive: true });
  cleanups.push(() => {
    ripples.remove();
    document.removeEventListener("pointerdown", onDown);
  });

  // ---------------------------------------------------------------- drag to pan, with momentum
  let drag: { el: HTMLElement; x: number; left: number; v: number; t: number; moved: boolean } | null = null;
  let fling = 0;
  const onDragStart = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.target instanceof Element ? e.target.closest<HTMLElement>(DRAGGABLE) : null;
    if (!el || el.scrollWidth <= el.clientWidth + 2) return;
    if (e.target instanceof Element && e.target.closest("button, a, input, select, textarea")) return;
    cancelAnimationFrame(fling);
    drag = { el, x: e.clientX, left: el.scrollLeft, v: 0, t: performance.now(), moved: false };
    el.setAttribute("data-fx-dragging", "");
  };
  const onDragMove = (e: PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 3) drag.moved = true;
    const max = drag.el.scrollWidth - drag.el.clientWidth;
    const want = drag.left - dx;
    // Rubber band: past either end, the content stretches at a third of the pointer's travel.
    const over = want < 0 ? want : want > max ? want - max : 0;
    drag.el.scrollLeft = Math.max(0, Math.min(max, want));
    drag.el.style.setProperty("--fx-rubber", `${(-over / 3).toFixed(1)}px`);
    const now = performance.now();
    drag.v = (drag.el.scrollLeft - (drag.el.dataset.fxLast ? Number(drag.el.dataset.fxLast) : drag.el.scrollLeft)) / Math.max(1, now - drag.t);
    drag.el.dataset.fxLast = String(drag.el.scrollLeft);
    drag.t = now;
  };
  const onDragEnd = () => {
    if (!drag) return;
    const { el } = drag;
    let v = drag.v * 16;
    el.removeAttribute("data-fx-dragging");
    el.style.setProperty("--fx-rubber", "0px"); // snap back, by CSS transition
    delete el.dataset.fxLast;
    if (drag.moved) {
      // Swallow the click that ends a drag, so a drag over a link does not follow it.
      const stop = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      el.addEventListener("click", stop, { capture: true, once: true });
      window.setTimeout(() => el.removeEventListener("click", stop, { capture: true }), 50);
    }
    drag = null;
    // Inertia: velocity decays by friction each frame until it is too small to see.
    if (!motion) v = 0;
    const glide = () => {
      if (Math.abs(v) < 0.4) return;
      el.scrollLeft += v;
      v *= 0.92;
      fling = requestAnimationFrame(glide);
    };
    fling = requestAnimationFrame(glide);
  };
  if (fine) {
    document.addEventListener("pointerdown", onDragStart);
    window.addEventListener("pointermove", onDragMove, { passive: true });
    window.addEventListener("pointerup", onDragEnd);
    cleanups.push(() => {
      document.removeEventListener("pointerdown", onDragStart);
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onDragEnd);
      cancelAnimationFrame(fling);
    });
  }

  if (!fine || !motion) {
    return () => cleanups.forEach((c) => c());
  }

  // ---------------------------------------------------------------- cursor, trail, spotlight, tilt
  const cursor = document.createElement("div");
  cursor.className = "fx-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="fx-cursor__ring"><span class="fx-cursor__word"></span></span><span class="fx-cursor__dot"></span>';
  document.body.appendChild(cursor);
  const ringEl = cursor.querySelector<HTMLElement>(".fx-cursor__ring")!;
  const dotEl = cursor.querySelector<HTMLElement>(".fx-cursor__dot")!;
  const wordEl = cursor.querySelector<HTMLElement>(".fx-cursor__word")!;

  const trail = document.createElement("canvas");
  trail.className = "fx-trail";
  trail.setAttribute("aria-hidden", "true");
  document.body.appendChild(trail);
  const tg = trail.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const size = () => {
    trail.width = window.innerWidth * dpr;
    trail.height = window.innerHeight * dpr;
    tg?.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  window.addEventListener("resize", size, { passive: true });

  const pts: { x: number; y: number; life: number }[] = [];
  let mx = -100;
  let my = -100;
  let rx = -100;
  let ry = -100;
  let rvx = 0;
  let rvy = 0;
  let raf = 0;
  let tilted: HTMLElement | null = null;
  let lastMove: PointerEvent | null = null;
  let accent = "";

  const untilt = (el: HTMLElement | null) => {
    if (!el) return;
    el.style.setProperty("--fx-rx", "0deg");
    el.style.setProperty("--fx-ry", "0deg");
    el.style.setProperty("--fx-px", "0");
    el.style.setProperty("--fx-py", "0");
    el.removeAttribute("data-fx-hover");
  };

  const loop = () => {
    raf = 0;
    const enabled = readPrefs().cursor;
    // Spring for the ring: stiffness and damping per frame (critically damped-ish, a little lag).
    const k = 0.18;
    const d = 0.62;
    rvx = (rvx + (mx - rx) * k) * d;
    rvy = (rvy + (my - ry) * k) * d;
    rx += rvx;
    ry += rvy;
    dotEl.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

    if (tg) {
      tg.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (enabled) {
        accent ||= getComputedStyle(root).getPropertyValue("--accent").trim() || "#6f8cff";
        for (let i = pts.length - 1; i >= 0; i--) {
          const p = pts[i];
          p.life -= 0.045;
          if (p.life <= 0) {
            pts.splice(i, 1);
            continue;
          }
        }
        if (pts.length > 1) {
          tg.lineCap = "round";
          tg.lineJoin = "round";
          for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1];
            const b = pts[i];
            tg.globalAlpha = b.life * 0.5;
            tg.strokeStyle = accent;
            tg.lineWidth = 1 + b.life * 5;
            tg.beginPath();
            tg.moveTo(a.x, a.y);
            tg.lineTo(b.x, b.y);
            tg.stroke();
          }
          tg.globalAlpha = 1;
        }
      } else pts.length = 0;
    }

    // Tilt and the spotlight, for the card under the pointer.
    const e = lastMove;
    if (e) {
      const t = e.target instanceof Element ? e.target : null;
      const card = t?.closest<HTMLElement>(CARDS) ?? null;
      if (card !== tilted) {
        untilt(tilted);
        tilted = card;
      }
      if (card) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.setAttribute("data-fx-hover", "");
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        const max = card.matches(".rf") ? 2.5 : 7;
        card.style.setProperty("--fx-rx", `${((0.5 - py) * max).toFixed(2)}deg`);
        card.style.setProperty("--fx-ry", `${((px - 0.5) * max).toFixed(2)}deg`);
        card.style.setProperty("--fx-px", (px - 0.5).toFixed(3));
        card.style.setProperty("--fx-py", (py - 0.5).toFixed(3));
      }
      lastMove = null;
    }

    const settling = Math.abs(mx - rx) > 0.3 || Math.abs(my - ry) > 0.3 || pts.length > 0;
    if (settling) raf = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mx = e.clientX;
    my = e.clientY;
    lastMove = e;
    pts.push({ x: mx, y: my, life: 1 });
    if (pts.length > 24) pts.shift();
    root.style.setProperty("--fx-cx", `${mx}px`);
    root.style.setProperty("--fx-cy", `${my}px`);
    const t = e.target instanceof Element ? e.target : null;
    const interactive = t?.closest(INTERACTIVE);
    const texty = t?.closest(TEXTY) && !interactive;
    cursor.setAttribute("data-state", interactive ? "link" : texty ? "text" : "idle");
    const word = contextWord(t);
    if (wordEl.textContent !== word) wordEl.textContent = word;
    cursor.toggleAttribute("data-word", !!word);
    cursor.setAttribute("data-show", "");
    kick();
  };
  const onLeave = () => {
    cursor.removeAttribute("data-show");
    untilt(tilted);
    tilted = null;
  };
  const onPress = () => cursor.setAttribute("data-press", "");
  const onRelease = () => cursor.removeAttribute("data-press");
  const onPrefs = () => {
    accent = "";
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  document.addEventListener("pointerdown", onPress, { passive: true });
  document.addEventListener("pointerup", onRelease, { passive: true });
  window.addEventListener("kitui:fx-prefs", onPrefs);
  const themeMO = new MutationObserver(onPrefs);
  themeMO.observe(root, { attributes: true, attributeFilter: ["class", "data-fx-palette"] });
  root.setAttribute("data-fx-fine", "");

  cleanups.push(() => {
    cursor.remove();
    trail.remove();
    themeMO.disconnect();
    window.removeEventListener("resize", size);
    document.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("pointerdown", onPress);
    document.removeEventListener("pointerup", onRelease);
    window.removeEventListener("kitui:fx-prefs", onPrefs);
    if (raf) cancelAnimationFrame(raf);
    untilt(tilted);
    root.removeAttribute("data-fx-fine");
  });

  return () => cleanups.forEach((c) => c());
}
