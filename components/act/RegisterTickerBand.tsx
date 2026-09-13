"use client";

import React from "react";

import { WardRegisterTicker } from "../charts/WardRegisterTicker";

/**
 * The forty wards, moving.
 *
 * A full-bleed band between two scenes, carrying the register itself past the reader on a
 * loop. It is a divider that happens to be made of data: after a scene arguing that twelve
 * wards hold 37.78% of the electorate, the forty of them streaming by at their real sizes is
 * the cheapest possible proof.
 *
 * The ticker's own marquee handles the loop and pauses on hover; it holds a second,
 * aria-hidden copy of the strip because a seamless loop needs one, so the band is announced
 * once and read once.
 */
export function RegisterTickerBand() {
  return (
    <div
      className="relative py-10 md:py-14 overflow-hidden"
      style={{
        background: "var(--act-void)",
        borderTop: "1px solid var(--act-hair)",
        borderBottom: "1px solid var(--act-hair)",
      }}
    >
      <p className="act-kicker px-[var(--act-gutter)] mb-5">All forty wards, by register</p>
      <WardRegisterTicker />
      {/* Edge fades, so the strip reads as continuous rather than as something that stops. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-16 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--act-void), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-16 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--act-void), transparent)" }}
      />
    </div>
  );
}
