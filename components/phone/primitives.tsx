import React from "react";

import { IDENTITY, ILLUSTRATIVE_COUNTS, isGap, type Fillable } from "../../lib/phone-showcase";

/**
 * Chrome shared by every screen, written once.
 *
 * The status bar in particular has to be identical across all seven — it is the strongest single
 * signal that this is one device showing different apps rather than seven pictures of phones.
 */

export type Tone = "dark" | "light";

/** Signal, wifi and battery, drawn at the sizes iOS actually uses. Carrier-neutral. */
export function StatusBar({ tone = "dark", className = "" }: { tone?: Tone; className?: string }) {
  const fg = tone === "dark" ? "#000000" : "#FFFFFF";
  return (
    <div
      aria-hidden="true"
      className={`relative z-20 flex items-center justify-between px-6 pt-3 pb-1 shrink-0 ${className}`}
      style={{ height: 44, color: fg }}
    >
      <span className="text-[14px] font-semibold tabular-nums tracking-tight" style={{ letterSpacing: "-0.01em" }}>
        {ILLUSTRATIVE_COUNTS.statusBarTime}
      </span>
      <span className="flex items-center gap-[5px]">
        {/* Cellular bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill={fg} aria-hidden="true">
          <rect x="0" y="7.5" width="3" height="3.5" rx="1" />
          <rect x="4.6" y="5.4" width="3" height="5.6" rx="1" />
          <rect x="9.2" y="3" width="3" height="8" rx="1" />
          <rect x="13.8" y="0.4" width="3" height="10.6" rx="1" />
        </svg>
        {/* Wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke={fg} strokeWidth="1.6" aria-hidden="true">
          <path d="M1 3.4a10.4 10.4 0 0 1 14 0" strokeLinecap="round" />
          <path d="M3.6 6a6.7 6.7 0 0 1 8.8 0" strokeLinecap="round" />
          <path d="M6.2 8.5a3 3 0 0 1 3.6 0" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
          <rect x="0.6" y="0.6" width="21" height="10.8" rx="3.1" fill="none" stroke={fg} strokeOpacity="0.4" />
          <rect x="2.2" y="2.2" width="15" height="7.6" rx="1.9" fill={fg} />
          <path d="M23.4 4.2v3.6a2 2 0 0 0 0-3.6Z" fill={fg} fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/** The home indicator every modern handset draws at the base of the screen. */
export function HomeIndicator({ tone = "dark" }: { tone?: Tone }) {
  return (
    <div aria-hidden="true" className="shrink-0 flex justify-center pt-1.5 pb-2">
      <span
        className="block rounded-full"
        style={{ width: 118, height: 5, background: tone === "dark" ? "#0f0f0f" : "#ffffff", opacity: 0.9 }}
      />
    </div>
  );
}

/**
 * The candidate's avatar. Initials on the campaign accent, not a photo — the repo ships no
 * portrait, and a stock face on a real politician's account would be worse than none.
 */
export function Avatar({ size = 40, ring = false }: { size?: number; ring?: boolean }) {
  const inner = ring ? size - 6 : size;
  const face = (
    <span
      className="grid place-items-center rounded-full font-bold text-white shrink-0"
      style={{
        width: inner,
        height: inner,
        fontSize: Math.round(inner * 0.4),
        background: "linear-gradient(145deg, #00209f 0%, #0b1a30 100%)",
        letterSpacing: "0.02em",
      }}
    >
      {IDENTITY.initials}
    </span>
  );
  if (!ring) return face;
  return (
    <span
      className="grid place-items-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        padding: 2,
        background: "linear-gradient(45deg, #F58529, #DD2A7B 55%, #8134AF 100%)",
      }}
    >
      <span className="grid place-items-center rounded-full bg-white" style={{ width: size - 4, height: size - 4, padding: 2 }}>
        {face}
      </span>
    </span>
  );
}

/**
 * A slot the proposal does not supply.
 *
 * Rendered with the same treatment the document uses for its own `[Insert …]` markers, so an
 * unfilled slot reads as the deliberate gap it is rather than as something forgotten.
 */
export function SlotGap({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <span
      className="inline-block rounded font-mono leading-none align-middle"
      style={{
        fontSize: 9.5,
        padding: "2.5px 5px",
        color: dark ? "#ff9aa2" : "#9c1c24",
        background: dark ? "rgba(227,29,43,0.16)" : "#ffebeb",
        border: `1px solid ${dark ? "rgba(227,29,43,0.42)" : "#f8b4b4"}`,
      }}
    >
      [{label} — not in proposal]
    </span>
  );
}

/** Render sourced copy, or the gap marker when the proposal has nothing for the slot. */
export function Slot({ field, dark = false }: { field: Fillable<string>; dark?: boolean }) {
  if (isGap(field)) return <SlotGap label={field.gap} dark={dark} />;
  return <>{field.value}</>;
}

/** Every screen is a column: status bar, body, home indicator. */
export function ScreenShell({
  tone,
  background,
  children,
  showHome = true,
  /** Apps that tint the notification area (WhatsApp's green) paint the strip too. */
  statusBarBackground,
}: {
  tone: Tone;
  background: string;
  children: React.ReactNode;
  showHome?: boolean;
  statusBarBackground?: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background }}>
      <div style={{ background: statusBarBackground }} className="shrink-0">
        <StatusBar tone={tone} />
      </div>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
      {showHome && <HomeIndicator tone={tone} />}
    </div>
  );
}
