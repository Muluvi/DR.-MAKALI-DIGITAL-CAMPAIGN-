"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, Phone, Signal, BatteryMedium } from "lucide-react";

import {
  APPROVAL_CHAIN, CONSENTED_CONTACTS, SMS_COST_PER_MESSAGE, SMS_LIMIT, SMS_SPECIMENS,
  SPECIMEN_LANGUAGES, USSD_HEADER, USSD_LATENCY_MS, USSD_MENU, USSD_SHORTCODE_PLACEHOLDER,
  type SpecimenLanguage,
} from "../../data/ussd-specimen";
import { ClaimBadge } from "../markdown/ClaimBadge";
import { useMotionPreset } from "../../hooks/useMotionPreset";

/**
 * The channel that reaches the other 86.4%, as an object you can operate.
 *
 * §4.3 argues that a purely digital campaign in Kitui addresses roughly one resident in seven,
 * and that the six it misses are concentrated in exactly the wards where the recognition deficit
 * is largest. That argument is made in prose three times. It has never been made as a thing the
 * reader can hold: a 2G handset, a system dialog, six menu options in Kikamba, and a message
 * that has to say something worth saying inside 160 characters.
 *
 * WHAT IS QUOTED AND WHAT IS NOT.
 *
 * The menu is §4.3.3 verbatim, Kikamba and English, in the order the document prints them. The
 * shortcode is `*[Insert shortcode]#`, because that is what §4.3.3 says and Appendix A logs the
 * vendor allocation as an open item — a plausible-looking number here would be exactly the kind
 * of invention the provenance system exists to stop, so it carries the awaiting badge instead.
 *
 * The vernacular SMS versions are deliberately absent rather than drafted. §3.6.3 sets a
 * four-stage approval chain in which a Lead Kikamba Writer drafts, an independent reviewer
 * reverse-translates to prove no commitment was distorted, and a native Kamba elder or senior
 * vernacular broadcaster holds mandatory sign-off. §3.7 puts those appointments in Phase −1.
 * None of them exists yet, so the widget shows where the copy WOULD be and who has to sign it,
 * which is a truer demonstration of the pipeline than inventing a sentence in a language nobody
 * on this side has reviewed. A half-translated interface would demonstrate the precise
 * claim-versus-delivery gap this proposal argues against.
 *
 * MOTION. The keypad presses advance the session on a timer, because a USSD menu that appears
 * instantly is the one detail that gives a mockup away — the pause is the network. Under reduced
 * motion the session renders at its final screen immediately and the presses do not animate.
 *
 * ACCESSIBILITY. The handset is `aria-hidden`; the menu beneath it is a real ordered list with
 * both languages, and the message panel is real text with a real character count. Every control
 * is a button, reachable and operable by keyboard.
 */

type Step = "dialling" | "menu" | "submenu";

const STEP_SEQUENCE: { step: Step; hold: number }[] = [
  { step: "dialling", hold: USSD_LATENCY_MS },
  { step: "menu", hold: 3200 },
  { step: "submenu", hold: 4200 },
];

function Handset({ step, pressed }: { step: Step; pressed: string | null }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[190px] rounded-[22px] border-4 border-line bg-dark shadow-lg overflow-hidden select-none"
      style={{ background: "#171a1f" }}
    >
      {/* Earpiece */}
      <div className="h-5 flex items-center justify-center">
        <span className="w-8 h-1 rounded-full" style={{ background: "#31363f" }} />
      </div>

      {/* The screen. A 2G handset panel: small, greenish, system type, no design language. */}
      <div
        className="mx-2.5 rounded-md px-2 py-1.5 font-mono"
        style={{ background: "#c8d6b9", color: "#12210b", minHeight: 132, fontSize: 8.5, lineHeight: 1.35 }}
      >
        <div className="flex items-center justify-between opacity-70" style={{ fontSize: 7 }}>
          <span className="inline-flex items-center gap-0.5"><Signal size={7} /> 2G</span>
          <span className="inline-flex items-center gap-0.5"><BatteryMedium size={8} /></span>
        </div>

        {step === "dialling" && (
          <div className="mt-6 text-center">
            <div className="font-bold">{USSD_SHORTCODE_PLACEHOLDER}</div>
            <div className="mt-2 opacity-70">Sending…</div>
          </div>
        )}

        {step === "menu" && (
          <div className="mt-1.5">
            <div className="font-bold">{USSD_HEADER}</div>
            {USSD_MENU.map((o) => (
              <div key={o.key} className="truncate">
                {o.key}. {o.kikamba ?? o.english}
              </div>
            ))}
          </div>
        )}

        {step === "submenu" && (
          <div className="mt-1.5">
            <div className="font-bold">{USSD_MENU[0].kikamba}</div>
            <div className="mt-1 opacity-80">{USSD_MENU[0].english}</div>
            <div className="mt-2 border-t border-black/20 pt-1 opacity-70">
              Reply 0 to go back
            </div>
          </div>
        )}
      </div>

      {/* Keypad. The pressed key lifts, which is the only thing that moves. */}
      <div className="grid grid-cols-3 gap-1 p-2.5">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
          <motion.span
            key={k}
            className="rounded-[4px] text-center font-mono"
            style={{
              background: pressed === k ? "#4b5568" : "#262b33",
              color: pressed === k ? "#fff" : "#8b93a1",
              fontSize: 8,
              padding: "3px 0",
            }}
            animate={{ scale: pressed === k ? 0.9 : 1 }}
            transition={{ duration: 0.12 }}
          >
            {k}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function FeaturePhoneSpecimen() {
  const { reduce } = useMotionPreset();
  const [lang, setLang] = useState<SpecimenLanguage>("kikamba");
  const [specimenIndex, setSpecimenIndex] = useState(0);
  const [step, setStep] = useState<Step>(reduce ? "menu" : "dialling");
  const [pressed, setPressed] = useState<string | null>(null);
  const [running, setRunning] = useState(!reduce);
  const timers = useRef<number[]>([]);
  const panelId = useId();

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  // The session loop. Presses land, the network pauses, the menu answers.
  useEffect(() => {
    if (reduce || !running) return;
    let index = 0;
    const advance = () => {
      const { step: s, hold } = STEP_SEQUENCE[index];
      setStep(s);
      // The press that caused this screen: * to dial, 1 to choose the first option.
      if (s === "menu") { setPressed("*"); timers.current.push(window.setTimeout(() => setPressed(null), 260)); }
      if (s === "submenu") { setPressed("1"); timers.current.push(window.setTimeout(() => setPressed(null), 260)); }
      index = (index + 1) % STEP_SEQUENCE.length;
      timers.current.push(window.setTimeout(advance, hold));
    };
    advance();
    return clearTimers;
  }, [reduce, running, clearTimers]);

  const specimen = SMS_SPECIMENS[specimenIndex];
  const body = specimen.english;
  const chars = body.length;
  const vernacularPending = lang !== "english";
  const sendCost = (n: number) => `KSh${(CONSENTED_CONTACTS * n).toLocaleString()}`;

  return (
    <section
      className="not-prose my-7 rounded-2xl border border-line bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-3)" }}
      aria-labelledby="feature-phone-title"
    >
      <div className="p-4 sm:p-5">
        <p className="eyebrow-label">The offline layer, as an object</p>
        <h4 id="feature-phone-title" className="font-serif t-label font-black text-ink">
          What a voter without the internet actually sees
        </h4>
        <p className="t-small text-muted leading-relaxed mt-1.5">
          USSD works on every phone, needs no internet, and costs the voter almost nothing. This is
          §4.3.3&rsquo;s menu on a 2G handset, and §4.3.2&rsquo;s message beside it.
        </p>

        {/* Language, scoped to this widget. The rest of the document stays in English. */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <div role="tablist" aria-label="Specimen language" className="inline-flex gap-1 rounded-xl border border-line bg-paper p-0.5">
            {SPECIMEN_LANGUAGES.map((l) => (
              <button
                key={l.id}
                role="tab"
                aria-selected={lang === l.id}
                aria-controls={panelId}
                onClick={() => setLang(l.id)}
                title={l.note}
                className={`min-h-[44px] px-3 rounded-lg t-micro font-black fx-press fx-focus cursor-pointer transition-colors ${
                  lang === l.id ? "bg-accent-solid text-on-accent" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <span className="t-micro text-muted">This widget only — the document stays in English.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-5 pb-5">
        {/* --- The handset ------------------------------------------------------------ */}
        <div>
          <Handset step={step} pressed={pressed} />

          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={() => { if (running) { clearTimers(); } setRunning((v) => !v); }}
              className="min-h-[44px] min-w-[44px] justify-center px-3 rounded-xl border border-line bg-paper t-micro font-black text-muted hover:text-ink fx-press fx-focus cursor-pointer"
            >
              {running && !reduce ? "Pause session" : "Play session"}
            </button>
          </div>

          {/* The real menu, for everyone. */}
          <div className="mt-4 rounded-xl border border-line/60 bg-paper p-3">
            {/* Wraps rather than compressing. In a non-wrapping flex row the badge is 27
                characters of unbreakable uppercase, so it took the width and squeezed the
                shortcode into a one-character-per-line column. */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 mb-2">
              <span className="inline-flex items-center gap-1.5 shrink-0">
                <Phone size={12} className="text-accent" aria-hidden="true" />
                <span className="t-micro font-black text-muted">Dial</span>
                <code className="placeholder t-micro whitespace-nowrap">
                  {USSD_SHORTCODE_PLACEHOLDER}
                </code>
              </span>
              <ClaimBadge status="awaiting" compact />
            </div>
            <ol className="space-y-1">
              {USSD_MENU.map((o) => (
                <li key={o.key} className="t-small text-ink leading-snug flex gap-2">
                  <span className="font-mono font-bold text-accent shrink-0">{o.key}.</span>
                  <span>
                    {o.kikamba && <span className="font-semibold">{o.kikamba}</span>}
                    {o.kikamba && <span className="text-muted"> / </span>}
                    <span className={o.kikamba ? "text-muted" : "font-semibold"}>{o.english}</span>
                    {o.crossReference && (
                      <span className="t-micro text-muted"> — {o.crossReference}</span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
            <p className="t-micro text-muted mt-2 leading-snug">
              §4.3.3, quoted. The shortcode is a vendor allocation the campaign has not made yet.
            </p>
          </div>
        </div>

        {/* --- The message ------------------------------------------------------------ */}
        <div id={panelId} role="tabpanel" className="min-w-0">
          <div className="rounded-xl border border-line/60 bg-paper p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 t-micro font-black text-muted">
                <MessageSquare size={12} className="text-accent" aria-hidden="true" />
                {specimen.type}
              </span>
              <span
                className={`t-micro font-black tabular-nums px-1.5 py-0.5 rounded ${
 chars > SMS_LIMIT ? "bg-danger/15 text-danger" : "bg-accent/10 text-accent"
                }`}
              >
                {chars}/{SMS_LIMIT}
              </span>
            </div>

            {vernacularPending ? (
              // Not a translation. The stage this copy is actually at, and who has to clear it.
              <div className="rounded-lg border border-dashed border-line bg-card p-3">
                <ClaimBadge status="awaiting" compact />
                <p className="t-small text-ink leading-snug mt-2">
                  No {SPECIMEN_LANGUAGES.find((l) => l.id === lang)?.label} copy is shown, because
                  none has been through the chain that has to clear it.
                </p>
                <ol className="mt-2.5 space-y-1.5">
                  {APPROVAL_CHAIN.map((s) => (
                    <li key={s.stage} className="flex gap-2 t-micro leading-snug">
                      <span
                        className={`shrink-0 w-4 h-4 rounded-full grid place-items-center font-black ${
 s.stage === 1 ? "bg-accent-solid text-on-accent" : "bg-line text-muted"
                        }`}
                        style={{ fontSize: 8 }}
                      >
                        {s.stage}
                      </span>
                      <span className={s.stage === 1 ? "text-ink" : "text-muted"}>
                        <span className="font-bold">{s.title}</span>
                        <span className="block">{s.who}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="t-micro text-muted mt-2.5 leading-snug">
                  §3.7 places those appointments in Phase −1. Showing invented vernacular here
                  would be the claim-versus-delivery gap this proposal argues against.
                </p>
              </div>
            ) : (
              <>
                {/* The message as it arrives: no rich text, no links, one screen. */}
                <div
                  className="rounded-lg border border-line/60 p-2.5 font-mono t-small leading-snug"
                  style={{ background: "var(--code-bg)" }}
                >
                  {body}
                </div>
                <p className="t-micro text-muted mt-2 leading-snug">
                  <span className="font-bold text-ink">{specimen.structure}.</span> {specimen.frequency}.
                  §4.3.2 sets the 160-character limit; it is a billing boundary, not a style rule.
                </p>
              </>
            )}

            {/* Message type selector. */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SMS_SPECIMENS.map((s, i) => (
                <button
                  key={s.type}
                  onClick={() => setSpecimenIndex(i)}
                  aria-pressed={i === specimenIndex}
                  className={`min-h-[44px] px-2.5 rounded-lg border t-micro font-bold fx-press fx-focus cursor-pointer transition-colors ${
 i === specimenIndex
                      ? "bg-accent-solid border-accent-solid text-on-accent"
                      : "bg-card border-line text-muted hover:text-ink"
                  }`}
                >
                  {s.type}
                </button>
              ))}
            </div>
          </div>

          <p className="t-micro text-muted mt-3 leading-snug">
            At {SMS_COST_PER_MESSAGE.unit}{SMS_COST_PER_MESSAGE.from}–{SMS_COST_PER_MESSAGE.to} a
            message, one send to {CONSENTED_CONTACTS.toLocaleString()} consented contacts costs{" "}
            <span className="tabular-nums font-bold text-ink">
              {sendCost(SMS_COST_PER_MESSAGE.from)}–{sendCost(SMS_COST_PER_MESSAGE.to)}
            </span>
            . §4.3.2.
          </p>
        </div>
      </div>
    </section>
  );
}
