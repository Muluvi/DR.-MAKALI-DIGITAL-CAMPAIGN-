"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Compass, X } from "lucide-react";

const KEY = "sx-tour-seen";
const STOPS: { sel: string; title: string; text: string }[] = [
  { sel: '[data-tour="search"]', title: "Search everything", text: "Find any chapter, heading or figure. The index also lists every chapter and how long each takes to read." },
  { sel: '[data-tour="tools"]', title: "Every tool, one tap away", text: "36 tools and the team's 10 live records, grouped by chapter. Tap one and the story opens right where it lives." },
  { sel: '[data-tour="live"]', title: "Live from the team", text: "A green dot means the team has updated something. Records and charts change inside the chapters the moment a record is saved." },
  { sel: ".pf-dock__pill", title: "Where you are", text: "The bar at the bottom shows the chapter you are in. Tap it for the index; the chart icon opens every tool." },
  { sel: "#section-votes .sx-hands", title: "Try it in this chapter", text: "Each chapter lists the tools inside it. In the chapter, look for the cards with a moving hand: something you can use, not just read." },
];

const subscribe = (l: () => void) => { window.addEventListener("storage", l); window.addEventListener("sx-tour", l); return () => { window.removeEventListener("storage", l); window.removeEventListener("sx-tour", l); }; };
const seen = () => { try { return localStorage.getItem(KEY) === "1"; } catch { return true; } };
const markSeen = () => { try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ } window.dispatchEvent(new Event("sx-tour")); };

/**
 * "Show me around": a five-stop tour of the controls that are easy to miss. Offered once, as a pill
 * above the dock; it can be run again from the welcome's Tools sheet at any time.
 */
export function Tour() {
  const done = useSyncExternalStore(subscribe, seen, () => true);
  const [step, setStep] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const measure = useCallback(function measure(i: number, tries = 0) {
    const el = document.querySelector<HTMLElement>(STOPS[i].sel);
    if (!el || el.getBoundingClientRect().height === 0) {
      // A chapter further down may not be on the page yet: bring its section in, then look again.
      setRect(null);
      const host = STOPS[i].sel.match(/^#([\w-]+)/)?.[1];
      const h = host ? document.getElementById(host) : null;
      if (h && tries < 6) { h.scrollIntoView({ block: "start" }); window.setTimeout(() => measure(i, tries + 1), 700); }
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.top < 60 && r.top > -1 && r.bottom < window.innerHeight) { setRect(r); return; }
    if (r.bottom > window.innerHeight || r.top < 0) {
      el.scrollIntoView({ block: "center" });
      window.setTimeout(() => setRect(el.getBoundingClientRect()), 120);
    } else setRect(r);
  }, []);

  useEffect(() => {
    const start = () => { setStep(0); };
    window.addEventListener("story:tour", start);
    return () => window.removeEventListener("story:tour", start);
  }, []);

  useEffect(() => {
    if (step === null) { delete document.documentElement.dataset.tour; return; }
    document.documentElement.dataset.tour = "on";
    const id = window.setTimeout(() => measure(step), 0);
    const on = () => measure(step);
    window.addEventListener("resize", on);
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setStep(null); markSeen(); } };
    window.addEventListener("keydown", key);
    return () => { window.clearTimeout(id); window.removeEventListener("resize", on); window.removeEventListener("keydown", key); };
  }, [step, measure]);

  const close = () => { setStep(null); markSeen(); };
  const next = () => { if (step === null) return; if (step < STOPS.length - 1) setStep(step + 1); else close(); };

  if (step === null) {
    if (done) return null;
    return (
      <div className="sx-tour-pill print:hidden" role="region" aria-label="A short tour">
        <Compass size={16} aria-hidden="true" /> New here?
        <button type="button" className="sx-tour-pill__go" onClick={() => setStep(0)}>Show me around</button>
        <button type="button" className="sx-tour-pill__no" onClick={markSeen} aria-label="No thanks"><X size={16} aria-hidden="true" /></button>
      </div>
    );
  }
  const pad = 6;
  const below = !rect || rect.top < window.innerHeight / 2;
  const s = STOPS[step];
  return (
    <>
      <div className="sx-tour-back" onClick={next} aria-hidden="true" />
      {rect && <div className="sx-tour-hole" style={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }} aria-hidden="true" />}
      <div className="sx-tour-tip" role="dialog" aria-modal="true" aria-labelledby="sx-tour-title" style={below ? { top: Math.min(window.innerHeight - 220, (rect?.bottom ?? 80) + 18) } : { bottom: window.innerHeight - (rect?.top ?? 0) + 18 }}>
        <h3 id="sx-tour-title">{s.title}</h3>
        <p>{s.text}</p>
        <div className="sx-tour-tip__foot">
          <div className="sx-tour-dots" aria-label={`Step ${step + 1} of ${STOPS.length}`}>{STOPS.map((x, i) => <span key={x.sel} data-on={i === step ? "true" : "false"} />)}</div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button type="button" className="sx-btn" onClick={close}>Skip</button>
            <button type="button" className="sx-btn sx-btn--solid" onClick={next} autoFocus>{step < STOPS.length - 1 ? "Next" : "Done"}</button>
          </div>
        </div>
      </div>
    </>
  );
}
