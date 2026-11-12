/**
 * The reveal engine: every section of every page, including the ones streamed in after the first
 * paint, enters through one IntersectionObserver.
 *
 * WHY DELEGATED. The flow streams ~30 chapters after hydration and the platform renders its own
 * pages; wiring a wrapper into each of ~80 content components would be fragile and would miss the
 * next one written. A MutationObserver hands every added subtree to `scan()`, which tags the
 * elements a rule names. Nothing here owns or replaces a React node: it sets data attributes and
 * one custom property, and changes the value of an existing text node only for the scramble,
 * restoring the exact original string when it finishes.
 *
 * HONESTY. An element already on screen when it is found is never hidden (no flash of a visible
 * paragraph vanishing). Only elements below the fold, or inside a closed fold, are armed. Without
 * script nothing is armed; under reduced motion the engine never starts.
 */

export type Variant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "pop"
  | "settle"
  | "blur"
  | "wipe"
  | "wipe-diag"
  | "iris"
  | "curtain"
  | "flip-x"
  | "flip-y"
  | "rotate"
  | "unfold"
  | "roll"
  | "zoom"
  | "bounce"
  | "light"
  | "split-l"
  | "split-r"
  | "skeleton";

type Rule = {
  sel: string;
  v: Variant;
  /** Siblings that arrive together are staggered by this many ms. */
  stagger?: number;
  /** Stagger outward from the middle of the batch (a ripple), rather than first to last. */
  ripple?: boolean;
  /** Re-fires on re-entry (counters, stat cards); everything else fires once. */
  refire?: boolean;
};

/**
 * The rules, most specific first; an element takes the first rule it matches. Each surface has its
 * own entrance so that two kinds of content never arrive alike.
 */
const RULES: Rule[] = [
  // The flow
  { sel: ".flow-chap", v: "wipe" },
  { sel: ".cd__lead", v: "blur" },
  { sel: ".cd__stat", v: "pop", stagger: 70, ripple: true, refire: true },
  { sel: ".cd__step", v: "left", stagger: 55 },
  { sel: ".cd__kicker, .cd__more", v: "light" },
  { sel: ".cd__open", v: "bounce" },
  { sel: ".rf", v: "zoom" },
  { sel: ".rm__head", v: "split-l" },
  { sel: ".rm__stop", v: "up", stagger: 90 },
  { sel: ".rm__shelf", v: "flip-y", stagger: 80 },
  { sel: ".pf-bn", v: "flip-x", stagger: 90, refire: true },
  { sel: ".pf-act__copy", v: "split-l" },
  { sel: ".pf-act__portrait", v: "split-r" },
  { sel: ".kx-step", v: "roll", stagger: 80 },
  { sel: ".xchip, .wchip, .tp", v: "pop", stagger: 40 },
  { sel: ".pf-story__card", v: "settle" },
  { sel: ".prose > blockquote, .flow-section blockquote", v: "curtain" },
  { sel: ".prose > table, .prose > .not-prose table", v: "unfold" },
  { sel: ".prose > h2, .prose > h3, .prose > h4, .flow-section h3", v: "right" },
  { sel: ".prose > ul > li, .prose > ol > li", v: "up", stagger: 45 },
  { sel: ".prose > p, .flow-section p.t-body", v: "up", stagger: 60 },
  { sel: ".prose > figure, .prose > pre", v: "iris" },
  { sel: ".pf-footer > *", v: "down", stagger: 80 },
  { sel: ".fx-marquee", v: "wipe-diag" },
  // The platform and the tools
  { sel: ".plat-page h1, .plat-page h2", v: "right" },
  { sel: ".plat-card", v: "pop", stagger: 60, ripple: true },
  { sel: ".plat-page tbody tr", v: "left", stagger: 25 },
  { sel: ".plat-page section, .plat-page form", v: "up", stagger: 70 },
  { sel: ".pf-skel-section, .pf-skel", v: "skeleton" },
  // Every other page (the toolkit, the tools, any page written later): structure, not class names.
  // Scoped away from the flow's own <main class="pf-main">, which the rules above cover.
  { sel: "main:not(.pf-main) :is(h1, h2)", v: "right" },
  { sel: "main:not(.pf-main) [class*='grid'] > :is(a, article, li, section, div)", v: "up", stagger: 60, ripple: true },
  { sel: "main:not(.pf-main) section", v: "zoom" },
  { sel: "main:not(.pf-main) :is(header, p)", v: "up", stagger: 50 },
];

const ALL = RULES.map((r) => r.sel).join(",");
const SCRAMBLE = ".flow-chap__num, .rm__kicker, .cd__kicker, .pf-act__answers-k, .rf-kicker";
const LAZY_IMG = "img";

/** Elements that must never be hidden: the hero is in view at load and is the LCP. */
const NEVER = ".pf-hero, .fx-splash, [data-fx-skip]";

const STAGGER_CAP = 10;

function ruleOf(el: Element): Rule | null {
  for (const r of RULES) if (el.matches(r.sel)) return r;
  return null;
}

function hiddenByFold(el: Element): boolean {
  return !!el.closest("[hidden]");
}

/** Cycles random glyphs and settles left to right on the original string. */
function scramble(el: HTMLElement) {
  if (el.dataset.fxScrambled) return;
  const node = el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE ? (el.firstChild as Text) : null;
  if (!node) return;
  const original = node.nodeValue ?? "";
  if (!original.trim() || original.length > 60) return;
  el.dataset.fxScrambled = "1";
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789§·/+";
  const total = 18;
  let frame = 0;
  el.setAttribute("aria-label", original);
  const tick = () => {
    frame++;
    const settled = Math.floor((frame / total) * original.length);
    let out = "";
    for (let i = 0; i < original.length; i++) {
      const c = original[i];
      out += i < settled || c === " " ? c : glyphs[(Math.random() * glyphs.length) | 0];
    }
    if (node.nodeValue !== null) node.nodeValue = out;
    if (frame < total) requestAnimationFrame(tick);
    else {
      node.nodeValue = original;
      el.removeAttribute("aria-label");
    }
  };
  requestAnimationFrame(tick);
}

export function startReveal(): () => void {
  const seen = new WeakSet<Element>();

  const io = new IntersectionObserver(
    (entries) => {
      // Batch by parent, so siblings arriving together stagger and strangers do not.
      const groups = new Map<Element | null, IntersectionObserverEntry[]>();
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) {
          const key = el.parentElement;
          const list = groups.get(key) ?? [];
          list.push(e);
          groups.set(key, list);
        } else if (el.dataset.fxRefire && el.hasAttribute("data-fx-in")) {
          // Out of view entirely: ready to re-enter. Fades and counters run again next time.
          el.removeAttribute("data-fx-in");
        } else if (el.hasAttribute("data-fx-in") && e.boundingClientRect.bottom < 0) {
          el.setAttribute("data-fx-out", "");
        }
      }
      for (const list of groups.values()) {
        list.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        const mid = (list.length - 1) / 2;
        list.forEach((e, i) => {
          const el = e.target as HTMLElement;
          const step = Number(el.dataset.fxStagger || 0);
          const order = el.dataset.fxRipple ? Math.abs(i - mid) : i;
          el.style.setProperty("--fx-d", `${Math.min(order, STAGGER_CAP) * step}ms`);
          el.removeAttribute("data-fx-out");
          el.setAttribute("data-fx-in", "");
          el.dispatchEvent(new CustomEvent("fx:in", { bubbles: true }));
          if (!el.dataset.fxRefire) {
            io.unobserve(el);
            // Clear the delay once arrived, so hover transitions are not delayed by it.
            window.setTimeout(() => el.style.removeProperty("--fx-d"), 1600);
          }
        });
      }
    },
    // Threshold 0 with the bottom edge pulled in: an element arrives when its top crosses 90% of
    // the viewport. A ratio threshold would never be reached by an element many screens tall
    // (the cover map figure is), which would leave it armed — and invisible — for good.
    { threshold: 0, rootMargin: "0px 0px -10% 0px" }
  );

  const scrambleIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        scramble(e.target as HTMLElement);
        scrambleIO.unobserve(e.target);
      }
    },
    { threshold: 0.6 }
  );

  const lazyImage = (img: HTMLImageElement) => {
    if (img.closest(NEVER) || img.complete) return;
    img.setAttribute("data-fx-img", "loading");
    const done = () => img.setAttribute("data-fx-img", "loaded");
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  };

  /**
   * Where each new element sits is learned from an IntersectionObserver, not by measuring it:
   * the browser reports positions as part of its normal rendering, so arming even thousands of
   * elements forces no layout. (Measuring each one, as this did before, made a long page lay
   * itself out again and again and held a mid-range phone's main thread for seconds.) An element
   * found on screen, or above it, is left exactly as it is; one below the fold or inside a closed
   * fold is armed for its entrance.
   */
  const rules = new WeakMap<Element, Rule>();
  const placer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        placer.unobserve(el);
        const rule = rules.get(el);
        if (!rule) continue;
        const r = e.boundingClientRect;
        const folded = hiddenByFold(el) || (r.width === 0 && r.height === 0);
        const onOrAbove = e.isIntersecting || r.bottom <= 0;
        if (rule.stagger) el.dataset.fxStagger = String(rule.stagger);
        if (rule.ripple) el.dataset.fxRipple = "1";
        if (rule.refire) el.dataset.fxRefire = "1";
        if (!onOrAbove || folded) {
          el.setAttribute("data-fx", rule.v);
          io.observe(el);
        } else if (rule.refire) {
          // Visible now and will re-fire later: start in the arrived state.
          el.setAttribute("data-fx", rule.v);
          el.setAttribute("data-fx-in", "");
          io.observe(el);
        }
      }
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );

  const takeAll = (els: HTMLElement[]) => {
    for (const el of els) {
      if (seen.has(el)) continue;
      seen.add(el);
      if (el.closest(NEVER)) continue;
      const rule = ruleOf(el);
      if (!rule) continue;
      rules.set(el, rule);
      placer.observe(el);
    }
  };

  const scan = (root: ParentNode) => {
    const found: HTMLElement[] = [];
    if (root instanceof HTMLElement && root.matches(ALL)) found.push(root);
    root.querySelectorAll<HTMLElement>(ALL).forEach((el) => found.push(el));
    takeAll(found);
    if (root instanceof HTMLElement && root.matches(SCRAMBLE)) scrambleIO.observe(root);
    root.querySelectorAll<HTMLElement>(SCRAMBLE).forEach((el) => {
      if (!seen.has(el)) {
        seen.add(el);
        scrambleIO.observe(el);
      }
    });
    root.querySelectorAll<HTMLImageElement>(LAZY_IMG).forEach(lazyImage);
  };

  // Batched: a streamed chapter arrives as many mutations in one task.
  let pending: Node[] = [];
  let raf = 0;
  const flush = () => {
    raf = 0;
    const nodes = pending.filter((n): n is HTMLElement => n instanceof HTMLElement && n.isConnected);
    pending = [];
    // A node inside another added node is scanned with it: scanning it again repeats the work.
    const set = new Set(nodes);
    for (const n of nodes) {
      let up = n.parentElement;
      let nested = false;
      while (up) {
        if (set.has(up)) { nested = true; break; }
        up = up.parentElement;
      }
      if (!nested) scan(n);
    }
  };
  const mo = new MutationObserver((records) => {
    for (const rec of records) rec.addedNodes.forEach((n) => n.nodeType === 1 && pending.push(n));
    if (pending.length && !raf) raf = requestAnimationFrame(flush);
  });

  scan(document.body);
  mo.observe(document.body, { childList: true, subtree: true });

  return () => {
    io.disconnect();
    placer.disconnect();
    scrambleIO.disconnect();
    mo.disconnect();
    if (raf) cancelAnimationFrame(raf);
  };
}
