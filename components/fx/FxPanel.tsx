"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { sound, confetti } from "../../lib/fx/feedback";
import { deviceDefaults, FX_DEFAULTS, FX_EVENT, readPrefs, resetPrefs, seasonalPalette, writePrefs, type FxPrefs, type Palette } from "../../lib/fx/prefs";

/**
 * The effects panel: how the page looks and moves, chosen by the reader.
 *
 * A drawer that slides in from the right on a wide screen, and a bottom sheet with two detents on
 * a phone (drag the handle: up to expand, down to dismiss; it snaps to the nearest). Focus moves
 * into it on open and back to the trigger on close; Escape closes it.
 */

const PALETTES: { id: Palette; name: string; note: string }[] = [
  { id: "wiper", name: "Wiper blue", note: "The campaign's own colour" },
  { id: "jacaranda", name: "Jacaranda", note: "In bloom each October" },
  { id: "acacia", name: "Acacia", note: "The long rains" },
  { id: "rains", name: "Short rains", note: "October to December" },
  { id: "season", name: "This season", note: "Follows the calendar" },
];

const THEME_EVENT = "kitui:theme";

/** How long the reset must be held. */
const HOLD_SECONDS = 1.2;

function currentTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Switches the theme with a circular reveal from the control that was pressed. */
function switchTheme(mode: "light" | "dark", from?: { x: number; y: number }) {
  const root = document.documentElement;
  const apply = () => {
    root.classList.remove("dark", "sepia");
    if (mode === "dark") root.classList.add("dark");
    try {
      localStorage.setItem("theme", mode);
    } catch {
      // Applied for this visit only.
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: mode }));
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) {
    root.classList.add("theme-switching");
    apply();
    window.setTimeout(() => root.classList.remove("theme-switching"), 200);
    return;
  }
  const x = from?.x ?? window.innerWidth / 2;
  const y = from?.y ?? window.innerHeight / 2;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--fx-vt-x", `${x}px`);
  root.style.setProperty("--fx-vt-y", `${y}px`);
  root.style.setProperty("--fx-vt-r", `${r}px`);
  root.setAttribute("data-fx-vt", "");
  const vt = doc.startViewTransition(apply);
  vt.ready.finally(() => window.setTimeout(() => root.removeAttribute("data-fx-vt"), 700));
}

export function FxPanel() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<FxPrefs>(FX_DEFAULTS);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [preview, setPreview] = useState<Palette | null>(null);
  const [hold, setHold] = useState(0);
  const [sheetY, setSheetY] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const holdRaf = useRef(0);
  const dragStart = useRef<{ y: number; t: number } | null>(null);

  useEffect(() => {
    // Read after mount (the server has neither), in a task, as lib/useTheme.ts does.
    const init = window.setTimeout(() => {
      setPrefs(readPrefs());
      setTheme(currentTheme());
    }, 0);
    const onPrefs = (e: Event) => setPrefs((e as CustomEvent<FxPrefs>).detail);
    const onTheme = () => setTheme(currentTheme());
    window.addEventListener(FX_EVENT, onPrefs);
    window.addEventListener(THEME_EVENT, onTheme);
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.clearTimeout(init);
      window.removeEventListener(FX_EVENT, onPrefs);
      window.removeEventListener(THEME_EVENT, onTheme);
      mo.disconnect();
    };
  }, []);

  const update = useCallback((patch: Partial<FxPrefs>) => {
    const next = { ...readPrefs(), ...patch };
    writePrefs(next);
    setPrefs(next);
  }, []);

  // Live preview: hovering a swatch shows its palette; leaving restores the chosen one.
  useEffect(() => {
    const root = document.documentElement;
    if (!preview) {
      const chosen = prefs.palette === "season" ? seasonalPalette() : prefs.palette;
      if (chosen === "wiper") root.removeAttribute("data-fx-palette");
      else root.setAttribute("data-fx-palette", chosen);
      return;
    }
    const p = preview === "season" ? seasonalPalette() : preview;
    if (p === "wiper") root.removeAttribute("data-fx-palette");
    else root.setAttribute("data-fx-palette", p);
  }, [preview, prefs.palette]);

  const close = useCallback(() => {
    setOpen(false);
    setExpanded(false);
    setSheetY(0);
    setPreview(null);
    sound("close");
    window.setTimeout(() => trigger.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        // Keep focus inside the open panel.
        const items = panel.current.querySelectorAll<HTMLElement>("button, input, [tabindex='0']");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    window.setTimeout(() => panel.current?.querySelector<HTMLElement>("button")?.focus(), 60);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Hold to confirm: the reset fills over 1.2s of holding and fires only if held to the end.
  const startHold = () => {
    const t0 = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / (HOLD_SECONDS * 1000));
      setHold(p);
      if (p < 1) holdRaf.current = requestAnimationFrame(tick);
      else {
        resetPrefs();
        setPrefs(deviceDefaults());
        setHold(0);
        sound("success");
        const r = panel.current?.getBoundingClientRect();
        confetti(r ? r.left + r.width / 2 : undefined, r ? r.bottom - 60 : undefined, 50);
      }
    };
    holdRaf.current = requestAnimationFrame(tick);
  };
  const endHold = () => {
    cancelAnimationFrame(holdRaf.current);
    setHold(0);
  };

  // The sheet's drag: follow the finger, then snap to a detent or dismiss on a fling down.
  const onSheetDown = (e: React.PointerEvent) => {
    dragStart.current = { y: e.clientY, t: performance.now() };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onSheetMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dy = e.clientY - dragStart.current.y;
    setSheetY(dy < 0 ? dy / 3 : dy); // resist upward travel past the top: a rubber band
  };
  const onSheetUp = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dy = e.clientY - dragStart.current.y;
    const v = dy / Math.max(1, performance.now() - dragStart.current.t);
    dragStart.current = null;
    setSheetY(0);
    if (dy > 140 || v > 0.8) {
      if (expanded) setExpanded(false);
      else close();
    } else if (dy < -60 || v < -0.6) setExpanded(true);
  };

  const shown = preview ?? prefs.palette;

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="fx-trigger print:hidden"
        aria-label="Look and motion settings"
        data-fx-tip="Look and motion"
        aria-expanded={open}
        aria-controls="fx-panel"
        onClick={() => {
          setOpen(true);
          sound("open");
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path className="fx-trigger__spark" d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
          <circle cx="12" cy="12" r="3.2" />
        </svg>
      </button>

      <div className="fx-scrim" data-open={open ? "true" : "false"} onClick={close} aria-hidden="true" />
      <div
        ref={panel}
        id="fx-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fx-panel-title"
        className="fx-panel print:hidden"
        data-open={open ? "true" : "false"}
        data-expanded={expanded ? "true" : "false"}
        style={{ "--fx-sheet-y": `${sheetY}px` } as React.CSSProperties}
        inert={!open}
      >
        <div className="fx-panel__handle" onPointerDown={onSheetDown} onPointerMove={onSheetMove} onPointerUp={onSheetUp} onPointerCancel={onSheetUp} aria-hidden="true">
          <span />
        </div>
        <header className="fx-panel__head">
          <h2 id="fx-panel-title">Look and motion</h2>
          <button type="button" className="fx-panel__close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="fx-panel__body">
          <fieldset className="fx-panel__group">
            <legend>Theme</legend>
            <div className="fx-seg" role="radiogroup" aria-label="Theme" data-value={theme}>
              <span className="fx-seg__thumb" aria-hidden="true" />
              {(["light", "dark"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={theme === m}
                  className="fx-seg__opt"
                  onClick={(e) => {
                    if (theme === m) return;
                    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    switchTheme(m, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
                    setTheme(m);
                    sound("toggle");
                  }}
                >
                  {m === "light" ? "Light" : "Dark"}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="fx-panel__group">
            <legend>Colour</legend>
            <div className="fx-swatches" role="radiogroup" aria-label="Colour theme" onPointerLeave={() => setPreview(null)}>
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={prefs.palette === p.id}
                  className="fx-panel__swatch"
                  data-swatch={p.id === "season" ? seasonalPalette() : p.id}
                  data-previewing={shown === p.id ? "true" : undefined}
                  onPointerEnter={() => setPreview(p.id)}
                  onFocus={() => setPreview(p.id)}
                  onBlur={() => setPreview(null)}
                  onClick={() => {
                    update({ palette: p.id });
                    setPreview(null);
                    sound("toggle");
                  }}
                >
                  <span className="fx-panel__chip" aria-hidden="true" />
                  <span className="fx-panel__swatch-name">{p.name}</span>
                  <span className="fx-panel__swatch-note">{p.note}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="fx-panel__group">
            <legend>Motion and sound</legend>
            {(
              [
                ["ambient", "Ambient motion", "The hero's light, particles and drifting colour"],
                ["cursor", "Branded cursor", "A cursor and trail, on a mouse or trackpad"],
                ["sound", "Interface sounds", "Quiet clicks and chimes, made in the browser"],
              ] as const
            ).map(([key, label, note]) => (
              <label key={key} className="fx-switch">
                <span className="fx-switch__text">
                  <span>{label}</span>
                  <small>{note}</small>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  checked={prefs[key]}
                  onChange={(e) => {
                    update({ [key]: e.target.checked } as Partial<FxPrefs>);
                    if (key === "sound" && e.target.checked) window.setTimeout(() => sound("success"), 30);
                    else sound("toggle");
                  }}
                />
                <span className="fx-switch__track" aria-hidden="true">
                  <span className="fx-switch__thumb" />
                </span>
                {key === "sound" && (
                  <span className="fx-wave" data-on={prefs.sound ? "true" : "false"} aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} style={{ "--i": i } as React.CSSProperties} />
                    ))}
                  </span>
                )}
              </label>
            ))}

            <label className="fx-range">
              <span className="fx-switch__text">
                <span>Effect strength</span>
                <small>Tilt, magnetism, parallax and skew</small>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={prefs.intensity}
                style={{ "--v": `${prefs.intensity}%` } as React.CSSProperties}
                onChange={(e) => update({ intensity: Number(e.target.value) })}
                aria-valuetext={`${prefs.intensity} percent`}
              />
              <output className="fx-range__out">{prefs.intensity}%</output>
            </label>
          </fieldset>

          <button
            type="button"
            className="fx-hold"
            style={{ "--fx-hold": hold } as React.CSSProperties}
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault();
                startHold();
              }
            }}
            onKeyUp={endHold}
          >
            <span className="fx-hold__fill" aria-hidden="true" />
            <span className="fx-hold__label">{hold > 0 ? "Keep holding…" : "Hold to restore the defaults"}</span>
          </button>
          <p className="fx-panel__note">Kept in this browser only. Your device&rsquo;s reduced-motion setting always wins.</p>
        </div>
      </div>
    </>
  );
}
