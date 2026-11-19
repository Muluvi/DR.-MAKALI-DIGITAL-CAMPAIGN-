"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Phone, PhoneOff } from "lucide-react";

import {
  PLAN_ITEMS, USSD_HEADER, USSD_LATENCY_MS, USSD_MENU, USSD_SHORTCODE_PLACEHOLDER, type SpecimenLanguage,
} from "../../data/ussd-specimen";
import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";
import { FeaturePhoneFrame } from "./FeaturePhoneFrame";
import { TapHint, useTapHint } from "./TapHint";

/**
 * The campaign's USSD menu, on a keypad phone the reader drives (visual upgrade, A7).
 *
 * Every line is the menu as the site defines it once (data/ussd-specimen.ts, the same menu the
 * USSD Flow Builder starts from). Nothing is written for it: where the next screen of an option has
 * not been written yet, the handset says so rather than inventing one.
 *
 * A USSD screen carries at most USSD_SCREEN_LIMIT characters. Every screen is counted, and a screen
 * that runs over is shown cut where the network would cut it, with the count beside the handset.
 */

/** The longest single USSD screen the networks deliver, as the USSD Flow Builder counts it. */
export const USSD_SCREEN_LIMIT = 182;

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"] as const;

type Screen =
  | { kind: "idle"; typed: string }
  | { kind: "dialling" }
  | { kind: "menu" }
  | { kind: "option"; key: string }
  | { kind: "ended" };

/** The lines a screen shows, in a language. Kiswahili has no approved copy yet. */
function linesOf(screen: Screen, lang: SpecimenLanguage): string[] {
  const pick = (o: (typeof USSD_MENU)[number]) => (lang === "kikamba" ? o.kikamba ?? o.english : o.english);
  switch (screen.kind) {
    case "idle":
      return [screen.typed || "Dial the campaign code", "", "then press Call"];
    case "dialling":
      return [USSD_SHORTCODE_PLACEHOLDER, "", "Sending…"];
    case "ended":
      return ["Session ended.", "", "Dial again to start over."];
    case "menu":
      return [USSD_HEADER, ...USSD_MENU.map((o) => `${o.key}. ${pick(o)}`)];
    case "option": {
      const o = USSD_MENU.find((m) => m.key === screen.key);
      if (!o) return ["Invalid choice.", "", "0. Back"];
      if (o.key === "1") return [pick(o), ...PLAN_ITEMS.map((p, i) => `${i + 1}. ${p}`), "0. Back"];
      return [pick(o), "", "Next screen not yet written.", "0. Back"];
    }
  }
}

export function UssdHandset({ lang, onDescribe }: { lang: SpecimenLanguage; onDescribe?: (text: string) => void }) {
  const reduce = useReducedMotionSafe();
  const [screen, setScreen] = useState<Screen>({ kind: "idle", typed: "" });
  const [down, setDown] = useState<string | null>(null);
  // Option 6 can switch the menu's language on the handset; a new language chosen above the
  // handset starts it over in that language.
  const [switched, setSwitched] = useState<{ under: SpecimenLanguage; to: SpecimenLanguage } | null>(null);
  const menuLang = switched && switched.under === lang ? switched.to : lang;
  const timer = useRef<number | undefined>(undefined);
  const hint = useTapHint("ussd-call");

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (k: string) => {
    setDown(k);
    window.setTimeout(() => setDown((d) => (d === k ? null : d)), 140);
  };

  const call = useCallback(() => {
    hint.used();
    flash("call");
    if (screen.kind === "menu" || screen.kind === "option" || screen.kind === "dialling") return;
    if (reduce) {
      setScreen({ kind: "menu" });
      return;
    }
    setScreen({ kind: "dialling" });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setScreen({ kind: "menu" }), USSD_LATENCY_MS);
  }, [hint, reduce, screen.kind]);

  const end = useCallback(() => {
    flash("end");
    window.clearTimeout(timer.current);
    setScreen((s) => (s.kind === "idle" ? { kind: "idle", typed: "" } : { kind: "ended" }));
  }, []);

  const press = useCallback(
    (k: string) => {
      flash(k);
      const s = screen;
      if (s.kind === "idle") setScreen({ kind: "idle", typed: (s.typed + k).slice(-12) });
      else if (s.kind === "ended") setScreen({ kind: "idle", typed: k });
      else if (s.kind === "menu") {
        // Option 6 switches the menu language. Kiswahili has no approved copy, so it toggles
        // between the two the menu is written in.
        if (k === "6") setSwitched({ under: lang, to: menuLang === "kikamba" ? "english" : "kikamba" });
        else if (USSD_MENU.some((o) => o.key === k)) setScreen({ kind: "option", key: k });
      } else if (s.kind === "option" && k === "0") setScreen({ kind: "menu" });
    },
    [screen, lang, menuLang],
  );

  // A physical keyboard drives it too, once the handset has focus.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (/^[0-9*#]$/.test(e.key)) { e.preventDefault(); press(e.key); }
    else if (e.key === "Enter") { e.preventDefault(); call(); }
    else if (e.key === "Escape" || e.key === "Backspace") { e.preventDefault(); end(); }
  };

  const untranslated = menuLang === "kiswahili" && (screen.kind === "menu" || screen.kind === "option");
  const lines = untranslated ? ["Translation needed.", "", "No Kiswahili menu has", "been approved yet."] : linesOf(screen, menuLang);
  const text = lines.join("\n");
  const count = text.length;
  const over = count > USSD_SCREEN_LIMIT;
  const shown = over ? text.slice(0, USSD_SCREEN_LIMIT) : text;
  const counts = screen.kind === "menu" || screen.kind === "option";
  const option = screen.kind === "option" ? USSD_MENU.find((o) => o.key === screen.key) : undefined;

  useEffect(() => {
    onDescribe?.(option ? option.does : "");
  }, [option, onDescribe]);

  return (
    <div className="ussd-hs" onKeyDown={onKeyDown}>
      <FeaturePhoneFrame
        label={`USSD screen: ${text.replace(/\n+/g, ". ")}`}
        screen={
          <pre className="kp__text" aria-live="polite" data-screen={screen.kind}>
            {shown}
            {over ? <span className="kp__cut">…</span> : null}
          </pre>
        }
        keypad={
          <>
            <div className="kp__calls">
              <button type="button" className={`kp__key kp__key--call ${down === "call" ? "is-down" : ""}`} onClick={call} aria-label="Call: send the code">
                <Phone size={18} aria-hidden="true" />
                <TapHint show={hint.show} />
              </button>
              <button type="button" className={`kp__key kp__key--end ${down === "end" ? "is-down" : ""}`} onClick={end} aria-label="End the session">
                <PhoneOff size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="kp__keys">
              {KEYS.map((k) => (
                <button key={k} type="button" className={`kp__key ${down === k ? "is-down" : ""}`} onClick={() => press(k)} aria-label={`Key ${k}`}>
                  {k}
                </button>
              ))}
            </div>
          </>
        }
      />
      <p className={`ussd-hs__count ${counts && over ? "is-over" : ""}`} aria-live="polite">
        {counts ? (
          <>
            This screen: <strong>{count}</strong> of {USSD_SCREEN_LIMIT} characters
            {over ? ". The network cuts it here, so the menu must be shortened." : "."}
          </>
        ) : (
          <>Press Call, then a number. 0 goes back.</>
        )}
      </p>
    </div>
  );
}
