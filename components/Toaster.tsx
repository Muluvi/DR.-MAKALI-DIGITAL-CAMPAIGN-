"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";

/**
 * Feedback and navigation for a long read (visual-first pass, October 2026), in one small client
 * component with one live region:
 *
 *   - a toast confirming an action: a section link copied, a figure's CSV downloading;
 *   - "Resume where you left off": the last section read, kept in this browser only;
 *   - keyboard shortcuts on a laptop: j / k for the next and previous heading, ? for the list
 *     (/ and Cmd-K open search, in ClientPage).
 *
 * Nothing here is reachable only by keyboard or only by hover: every shortcut has a visible
 * control elsewhere on the page. Storage is wrapped, so a blocked localStorage changes nothing.
 */

const EVENT = "kitui:toast";
const LAST = "kitui2027:last-section";

/** Show a short confirmation. Safe to call from any client component. */
export function announce(message: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

type Toast = { message: string; action?: { label: string; run: () => void }; ms: number } | null;

function readLast(): string | null {
  try {
    return window.localStorage.getItem(LAST);
  } catch {
    return null;
  }
}

function writeLast(id: string) {
  try {
    window.localStorage.setItem(LAST, id);
  } catch {
    // Blocked storage: resuming is a convenience, not a requirement.
  }
}

const HEADINGS = 'h2[id*="-sec-"], h3[id*="-sec-"]';

export function Toaster({
  current,
  labelOf,
  goTo,
  resumable,
}: {
  /** The section in view. */
  current: string;
  /** "§2 How Kitui voted", for a section id. */
  labelOf: (id: string) => string | null;
  goTo: (id: string) => void;
  /** Only the flow offers to resume; a single-section page is already where its link pointed. */
  resumable: boolean;
}) {
  const reduce = useReducedMotionSafe();
  const [toast, setToast] = useState<Toast>(null);
  const [help, setHelp] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const offered = useRef(false);

  const show = useCallback((t: NonNullable<Toast>) => {
    window.clearTimeout(timer.current);
    setToast(t);
    timer.current = window.setTimeout(() => setToast(null), t.ms);
  }, []);

  // Confirmations from anywhere on the page, and every figure's CSV link.
  useEffect(() => {
    const onToast = (e: Event) => show({ message: String((e as CustomEvent).detail), ms: 2600 });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a.rf-csv, a[download]");
      if (a) show({ message: `Downloading ${a.getAttribute("download") || "the data"}`, ms: 2600 });
    };
    window.addEventListener(EVENT, onToast);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(EVENT, onToast);
      document.removeEventListener("click", onClick);
      window.clearTimeout(timer.current);
    };
  }, [show]);

  // Offer to resume once, on arrival at the top of the flow with no link target of its own.
  useEffect(() => {
    if (!resumable || offered.current) return;
    offered.current = true;
    if (window.location.hash || window.scrollY > 200) return;
    const last = readLast();
    const label = last ? labelOf(last) : null;
    if (!last || !label || last === current) return;
    // After the first paint has settled, so the offer never competes with the hero for attention.
    window.setTimeout(() => show({ message: `You were reading ${label}.`, action: { label: "Resume", run: () => goTo(last) }, ms: 9000 }), 900);
  }, [resumable, current, labelOf, goTo, show]);

  // Remember where the reader is, once the offer has had its chance.
  useEffect(() => {
    if (!resumable || !offered.current) return;
    writeLast(current);
  }, [current, resumable]);

  // j / k / ? on a laptop keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.key === "?") {
        e.preventDefault();
        setHelp((h) => !h);
        return;
      }
      if (e.key === "Escape") {
        setHelp(false);
        return;
      }
      if (e.key !== "j" && e.key !== "k") return;
      const line = 96;
      const all = [...document.querySelectorAll<HTMLElement>(HEADINGS)].filter((h) => h.offsetParent !== null);
      const next =
        e.key === "j"
          ? all.find((h) => h.getBoundingClientRect().top > line + 4)
          : [...all].reverse().find((h) => h.getBoundingClientRect().top < line - 4);
      if (!next) return;
      e.preventDefault();
      next.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      next.setAttribute("tabindex", "-1");
      next.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reduce]);

  return (
    <>
      <div className="pf-toast-region print:hidden" role="status" aria-live="polite">
        {toast ? (
          <p className="pf-toast">
            <span>{toast.message}</span>
            {toast.action ? (
              <button
                type="button"
                className="pf-toast__action"
                onClick={() => {
                  toast.action!.run();
                  setToast(null);
                }}
              >
                {toast.action.label}
              </button>
            ) : null}
            <button type="button" className="pf-toast__close" aria-label="Dismiss" onClick={() => setToast(null)}>
              ×
            </button>
          </p>
        ) : null}
      </div>
      {help ? (
        <div className="pf-keys print:hidden" role="dialog" aria-label="Keyboard shortcuts">
          <p className="pf-keys__title">Keyboard shortcuts</p>
          <dl>
            <dt><kbd>/</kbd> or <kbd>⌘</kbd><kbd>K</kbd></dt><dd>Search and contents</dd>
            <dt><kbd>j</kbd></dt><dd>Next heading</dd>
            <dt><kbd>k</kbd></dt><dd>Previous heading</dd>
            <dt><kbd>?</kbd></dt><dd>Show or hide this list</dd>
          </dl>
          <button type="button" className="pf-toast__action" onClick={() => setHelp(false)}>Close</button>
        </div>
      ) : null}
    </>
  );
}
