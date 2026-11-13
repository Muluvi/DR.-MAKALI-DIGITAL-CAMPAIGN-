"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A chapter's body, fetched as static HTML (app/c/[id]/route.ts) when the reader nears it. The
 * space it will take is reserved beforehand (--est), so nothing jumps while it loads.
 *
 * In-page links can point into a chapter that has not loaded yet. Every heading id starts with its
 * chapter's id, so a link is resolved by loading the chapter whose id prefixes the target, then
 * scrolling to it.
 */
const loaders = new Map<string, () => Promise<void>>();

/**
 * Resolves once the reader engages (first scroll, tap or key) or a few seconds after load, so the
 * first screen finishes before any chapter is fetched.
 */
let engaged: Promise<void> | null = null;
export function whenEngaged(): Promise<void> {
  return (engaged ??= new Promise<void>((resolve) => {
    const go = () => {
      for (const ev of ["scroll", "pointerdown", "keydown", "hashchange"]) removeEventListener(ev, go);
      resolve();
    };
    for (const ev of ["scroll", "pointerdown", "keydown", "hashchange"]) addEventListener(ev, go, { passive: true, once: true });
    setTimeout(go, 3500);
  }));
}

const idle = () => new Promise<void>((r) => ("requestIdleCallback" in window ? requestIdleCallback(() => r(), { timeout: 400 }) : setTimeout(r, 1)));
const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Put a chapter's HTML into the page without freezing a scroll: parse it when the main thread is
 * idle, then move its blocks in a few at a time, one batch per frame.
 */
async function insert(el: HTMLElement, html: string) {
  await idle();
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const root = tpl.content.firstElementChild as HTMLElement | null;
  if (!root) return;
  const shell = root.cloneNode(false) as HTMLElement;
  const blocks = [...root.childNodes];
  el.replaceChildren(shell);
  for (let i = 0; i < blocks.length; i += 12) {
    shell.append(...blocks.slice(i, i + 12));
    if (i + 12 < blocks.length) await frame();
  }
}
/** Ids inside a chapter that do not start with the chapter's id (its figures). */
const owners = new Map<string, string>();

function chapterFor(hash: string): string | null {
  const owner = owners.get(hash);
  if (owner) return owner;
  let best: string | null = null;
  for (const id of loaders.keys()) if ((hash === id || hash.startsWith(`${id}-`)) && (!best || id.length > best.length)) best = id;
  return best;
}

/** Chapters being fetched or inserted right now; a landing waits for them to finish. */
let inFlight = 0;

/**
 * Bring a target to the top and hold it there while the content around it settles. A smooth scroll
 * aims at where the target was when the link was pressed; chapters, tools and deferred blocks that
 * render on the way are taller than the space held for them, so the target moves away. Jumping
 * straight there and re-aligning each frame until nothing moves (or the reader takes over) lands it.
 */
let landing = 0;
function land(hash: string) {
  const token = ++landing;
  const el = document.getElementById(hash);
  if (!el) return;
  if (!el.matches("a, button, input, select, textarea, [tabindex]")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  const takeOver = () => {
    if (token === landing) landing++;
  };
  const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  for (const ev of inputs) addEventListener(ev, takeOver, { passive: true, once: true });
  const done = () => {
    for (const ev of inputs) removeEventListener(ev, takeOver);
  };
  const start = performance.now();
  let still = 0;
  const step = () => {
    const target = document.getElementById(hash);
    if (token !== landing || !target) return done();
    const before = target.getBoundingClientRect().top;
    target.scrollIntoView({ block: "start", behavior: "instant" });
    const moved = Math.abs(target.getBoundingClientRect().top - before) > 1;
    still = moved || inFlight > 0 ? 0 : still + 1;
    // Settled for half a second, or a ceiling so a slow connection never pins the page.
    if (still >= 30 || performance.now() - start > 6000) return done();
    requestAnimationFrame(step);
  };
  step();
}

async function reveal(hash: string) {
  if (!hash) return;
  if (!document.getElementById(hash)) {
    const id = chapterFor(hash);
    if (!id) return;
    await loaders.get(id)!();
  }
  land(hash);
}

let listening = false;
function listen() {
  if (listening) return;
  listening = true;
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
    if (!a) return;
    const hash = decodeURIComponent(a.getAttribute("href")!.slice(1));
    if (!hash || (!document.getElementById(hash) && !chapterFor(hash))) return;
    e.preventDefault();
    if (location.hash !== `#${hash}`) history.pushState(null, "", `#${hash}`);
    void reveal(hash);
  });
  // Back and forward between in-page links.
  window.addEventListener("popstate", () => void reveal(decodeURIComponent(location.hash.slice(1))));
  // A shared link that lands inside a chapter, or on a section below chapters that are still loading.
  setTimeout(() => void reveal(decodeURIComponent(location.hash.slice(1))), 0);
}

/** One empty list for every chapter without figures, so the effect below does not re-run on each render. */
const NO_IDS: string[] = [];

export function ChapterLoader({ id, est, ids = NO_IDS }: { id: string; est: number; ids?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const el = ref.current!;
    let pending: Promise<void> | null = null;
    const load = () =>
      (pending ??= (async () => {
        setState("loading");
        inFlight++;
        try {
          const res = await fetch(`/c/${id}.html`);
          if (!res.ok) throw new Error(String(res.status));
          await insert(el, await res.text());
          setState("ready");
        } catch {
          pending = null;
          setState("error");
        } finally {
          inFlight--;
        }
      })());
    loaders.set(id, load);
    for (const x of ids) owners.set(x, id);
    listen();
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && (io.disconnect(), void load()), { rootMargin: "800px 0px" });
    let live = true;
    void whenEngaged().then(() => live && io.observe(el));
    return () => {
      live = false;
      io.disconnect();
      loaders.delete(id);
    };
  }, [id, ids]);

  return (
    <>
      <div ref={ref} className="chapter-body" data-state={state} style={{ "--est": `${est}px` } as React.CSSProperties} suppressHydrationWarning />
      {state === "error" && (
        <p className="placeholder" role="status">
          This chapter did not load. Check the connection and <button type="button" className="btn btn-sm" onClick={() => location.reload()}>try again</button>
        </p>
      )}
    </>
  );
}
