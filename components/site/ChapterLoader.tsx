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

async function reveal(hash: string) {
  if (!hash || document.getElementById(hash)) return;
  const id = chapterFor(hash);
  if (!id) return;
  await loaders.get(id)!();
  document.getElementById(hash)?.scrollIntoView({ block: "start" });
}

let listening = false;
function listen() {
  if (listening) return;
  listening = true;
  document.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
    if (!a) return;
    const hash = decodeURIComponent(a.getAttribute("href")!.slice(1));
    if (!hash || document.getElementById(hash)) return;
    e.preventDefault();
    history.pushState(null, "", `#${hash}`);
    void reveal(hash);
  });
  window.addEventListener("hashchange", () => void reveal(decodeURIComponent(location.hash.slice(1))));
  // A shared link that lands inside a chapter.
  setTimeout(() => void reveal(decodeURIComponent(location.hash.slice(1))), 0);
}

export function ChapterLoader({ id, est, ids = [] }: { id: string; est: number; ids?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const el = ref.current!;
    let pending: Promise<void> | null = null;
    const load = () =>
      (pending ??= (async () => {
        setState("loading");
        try {
          const res = await fetch(`/c/${id}.html`);
          if (!res.ok) throw new Error(String(res.status));
          await insert(el, await res.text());
          setState("ready");
        } catch {
          pending = null;
          setState("error");
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
