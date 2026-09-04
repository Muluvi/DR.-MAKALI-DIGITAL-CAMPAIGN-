"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Wifi, WifiOff, Radio, MessageSquare, Smartphone, Users } from "lucide-react";

import { EASE_ENTRANCE, VIEWPORT } from "../lib/motion";
import { useReducedMotionSafe } from "../hooks/use-reduced-motion-safe";
import { TierBadge } from "./markdown/TierBadge";
import { ClaimBadge } from "./markdown/ClaimBadge";

/**
 * M3 — the county's central division, and the tool that addresses the larger side of it.
 *
 * "86.4% of your voters cannot see any of this" is the strongest argument in the document for
 * hiring a team that plans for both tiers, and it was a sentence in §4.5.
 *
 * The split is the site's ONE masked reveal: a clip-path wipe, because a wipe divides. Spending
 * it here rather than scattering masked reveals across the site is what keeps it meaningful.
 *
 * The handset below it runs the real Kikamba menu from §3.1.2 — mimesis, not effect: a feature
 * phone prints its menu line by line, so the mock does too. It is also the best proof-of-execution
 * artefact on the site, which is why the deliverable is demonstrated rather than described.
 *
 * Figures: §1.2.5 (KNBS 2019, Tier 1). Menu: §3.1.2, verbatim including the
 * unallocated shortcode.
 */

const CONNECTED = 13.6;
const OFFLINE = 86.4;
const INTERNET_USERS = 143_340;
const BASE_POPULATION = 1_053_991;

/** §3.1.2, verbatim. Kikamba first, English gloss second, exactly as written. */
const USSD_MENU = [
  "KITUI NA MULU",
  "1. Sisemo sya Mulu / Mulu's plan for my ward",
  "2. Andikithya kuvota / Voter registration info",
  "3. Ripoti wia / Report a local issue",
  "4. Kuthukuma / Volunteer",
  "5. Kwithukiisya / Get updates (opt-in)",
  "6. Kiswahili / English",
];

const CHANNELS = {
  connected: [
    { icon: Smartphone, label: "Facebook, WhatsApp, TikTok" },
    { icon: MessageSquare, label: "Targeted paid social" },
  ],
  offline: [
    { icon: Radio, label: "Kikamba vernacular radio" },
    { icon: MessageSquare, label: "Bulk SMS in Kikamba" },
    { icon: Smartphone, label: "USSD — works on any handset" },
    { icon: Users, label: "Market barazas, ward champions" },
  ],
};

/** Types the menu out one character at a time. A feature phone does exactly this. */
function useTypewriter(lines: string[], active: boolean, reduce: boolean, msPerChar = 12) {
  const [charCount, setCharCount] = useState(0);
  const full = lines.join("\n");

  useEffect(() => {
    if (reduce || !active) return;
    let raf = 0;
    const start = performance.now();
    const total = full.length * msPerChar;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      setCharCount(Math.floor(full.length * t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [full, active, reduce, msPerChar]);

  // Nobody should wait four seconds for a menu they can already read.
  if (reduce) return full;
  return full.slice(0, charCount);
}

export function ReachSplit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotionSafe();
  const typed = useTypewriter(USSD_MENU, inView, reduce);
  const [pressed, setPressed] = useState<string | null>(null);

  const wipe = reduce
    ? { duration: 0 }
    : { duration: 0.64, ease: EASE_ENTRANCE };

  return (
    <div ref={ref} className="my-10 not-prose">
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
          Channel architecture · 3.1
        </span>
        <TierBadge tier={1} compact />
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink tracking-tight mb-1">
        Most of Kitui cannot see a digital campaign
      </h3>
      <p className="text-sm text-muted leading-relaxed max-w-[62ch] mb-5">
        {INTERNET_USERS.toLocaleString()} active internet users out of a base of{" "}
        {BASE_POPULATION.toLocaleString()} aged three and above. A purely digital campaign here
        addresses roughly one in seven residents.
      </p>

      {/* The division. One wipe, left to right, splitting the county in two. */}
      <div
        className="relative h-16 sm:h-20 rounded-2xl overflow-hidden border border-line flex"
        role="img"
        aria-label={`${CONNECTED}% of Kitui is online; ${OFFLINE}% is not`}
      >
        <motion.div
          className="relative bg-accent flex items-center justify-center shrink-0"
          style={{ width: `${CONNECTED}%` }}
          initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
          animate={inView || reduce ? { clipPath: "inset(0 0% 0 0)" } : undefined}
          transition={wipe}
        >
          <Wifi size={16} className="text-white/90" aria-hidden="true" />
        </motion.div>
        <motion.div
          className="relative bg-ink/85 dark:bg-ink/20 flex items-center gap-2 px-4 flex-1"
          initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
          animate={inView || reduce ? { clipPath: "inset(0 0% 0 0)" } : undefined}
          transition={{ ...wipe, delay: reduce ? 0 : 0.12 }}
        >
          <WifiOff size={16} className="text-paper dark:text-ink shrink-0" aria-hidden="true" />
          <span className="font-serif text-lg sm:text-xl font-bold text-paper dark:text-ink tabular-nums">
            {OFFLINE}%
          </span>
          <span className="t-small sm:text-xs text-paper/80 dark:text-ink/70 font-semibold">
            offline
          </span>
        </motion.div>
      </div>
      <div className="flex justify-between mt-1.5 t-label font-mono text-muted tabular-nums">
        <span>{CONNECTED}% connected</span>
        <span>KNBS 2019</span>
      </div>

      {/* What serves each side. */}
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 mt-5">
        <div className="p-4 rounded-2xl border border-accent/30 bg-accent/[0.04]">
          <div className="t-label font-black uppercase tracking-wider text-accent mb-2.5">
            The connected minority
          </div>
          <ul className="space-y-2">
            {CHANNELS.connected.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-xs text-ink">
                <c.icon size={13} className="text-accent shrink-0" aria-hidden="true" />
                {c.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-2xl border border-line bg-card">
          <div className="t-label font-black uppercase tracking-wider text-ink mb-2.5">
            The offline majority — where the election is
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHANNELS.offline.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-xs text-ink">
                <c.icon size={13} className="text-gold shrink-0" aria-hidden="true" />
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The handset. The deliverable, demonstrated. */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] gap-5 sm:gap-7 items-start">
        <div className="mx-auto sm:mx-0 w-[248px] rounded-[1.75rem] border-[6px] border-ink/85 dark:border-line bg-ink dark:bg-black p-3 shadow-lg">
          <div className="rounded-lg bg-[#0d1a0d] px-3 py-3 min-h-[188px] font-mono t-small leading-[1.55] text-[#7dd87d] whitespace-pre-wrap">
            {typed}
            {!reduce && typed.length < USSD_MENU.join("\n").length && (
              <span className="inline-block w-[7px] h-[13px] bg-[#7dd87d] align-middle ml-0.5" />
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-3" role="group" aria-label="Keypad">
            {["1", "2", "3", "4", "5", "6", "*", "0", "#"].map((k) => (
              <button
                key={k}
                onPointerDown={() => setPressed(k)}
                onPointerUp={() => setPressed(null)}
                onPointerLeave={() => setPressed(null)}
                className={`h-8 rounded-md font-mono text-xs font-bold transition-transform ${
                  pressed === k
                    ? "scale-95 bg-accent text-white"
                    : "bg-paper/10 text-paper/80 hover:bg-paper/20"
                }`}
                style={{ transitionDuration: reduce ? "80ms" : "140ms" }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h4 className="font-serif text-base font-bold text-ink">The USSD layer</h4>
            <ClaimBadge status="awaiting" compact />
          </div>
          <p className="text-xs text-muted leading-relaxed mb-3">
            Works on every phone, requires no internet, costs the voter almost nothing. The
            shortcode is a vendor allocation pending at Phase 0, so the menu above shows the
            proposed tree rather than a live number.
          </p>
          <p className="text-xs text-ink leading-relaxed font-medium mb-3">
            Option 3 matters most. A constituent in Mutha reports a broken water point from a
            feature phone; the report enters a public register; the campaign follows up and
            publishes the outcome. That is the M&amp;E credential operating in public, before the
            election, on the cheapest possible technology.
          </p>
          <dl className="grid grid-cols-3 gap-2 t-small">
            <div className="p-2.5 rounded-lg bg-paper border border-line">
              <dt className="text-muted">Shared code</dt>
              <dd className="font-mono font-bold text-ink mt-0.5 tabular-nums">~KSh34,800</dd>
              <dd className="t-label text-muted">per network</dd>
            </div>
            <div className="p-2.5 rounded-lg bg-paper border border-line">
              <dt className="text-muted">Development</dt>
              <dd className="font-mono font-bold text-ink mt-0.5 tabular-nums">~KSh140,000</dd>
            </div>
            <div className="p-2.5 rounded-lg bg-paper border border-line">
              <dt className="text-muted">Hosting</dt>
              <dd className="font-mono font-bold text-ink mt-0.5 tabular-nums">~KSh5,000</dd>
              <dd className="t-label text-muted">per month</dd>
            </div>
          </dl>
          <p className="t-small text-muted mt-2.5">
            Set-up in 5–7 working days for a shared code; 2–4 weeks for a dedicated code pending
            operator approval.
          </p>
        </div>
      </div>
    </div>
  );
}
