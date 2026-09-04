"use client";

import React, { useEffect, useState } from "react";

import { USSD } from "../../../lib/phone-showcase";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";
import { StatusBar } from "../primitives";

/**
 * The USSD screen. Not an app — a system dialog over whatever was on screen.
 *
 * This is the channel that reaches the ~250,000 feature-phone voters in §3.1.2, which is more than
 * the entire connected population of the county, and it is the screen this module exists to put
 * in front of the candidate. So it gets the same care as the others and none of their styling:
 * no brand colour, no icons, no rounded design language, system type. It should look like the
 * operating system, because that is what a voter on a Nokia actually sees.
 *
 * The menu is §2.7.3's tree, unchanged. The pause before the response is the point — USSD is a
 * network round trip, and a menu that appears instantly is the one detail that would give it
 * away as a mockup.
 */

/** The OS's own type stack, deliberately not the site's. */
const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const LATENCY_MS = 1400;

/** A dim, logo-free app grid standing in for whatever the phone was showing. */
function DimmedHome() {
  return (
    <div aria-hidden="true" className="absolute inset-0" style={{ background: "#12161d" }}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 80% at 50% 0%, #1d2735 0%, #0d1117 70%)" }}
      />
      <div className="absolute inset-x-0 top-[92px] px-7 grid grid-cols-4 gap-x-5 gap-y-6">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="block rounded-[14px]"
            style={{ aspectRatio: "1", background: "rgba(255,255,255,0.07)" }}
          />
        ))}
      </div>
      <div
        className="absolute inset-x-5 bottom-8 h-[76px] rounded-[26px]"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
    </div>
  );
}

export function UssdScreen() {
  const reduce = useReducedMotionSafe();
  const [responded, setResponded] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setResponded(true), LATENCY_MS);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // Reduced motion still gets the finished dialog — a permanent "Sending…" is not a
  // stripped-back version of this screen, it is a broken one.
  const sent = reduce || responded;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SYSTEM_FONT }}>
      <DimmedHome />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />

      <div className="absolute inset-0 flex flex-col">
        <StatusBar tone="light" />

        <div className="flex-1 min-h-0 flex items-center px-4">
          <div
            className="w-full overflow-hidden"
            style={{
              background: "#f1f1f1",
              borderRadius: 4,
              boxShadow: "0 12px 32px rgba(0,0,0,0.55)",
              color: "#1a1a1a",
            }}
          >
            <div className="px-5 pt-4 pb-3">
              {/* The code that was dialled. */}
              <p className="tabular-nums" style={{ fontSize: 15, color: "#5f6368", marginBottom: 12 }}>
                {USSD.shortCode}
              </p>

              {!sent ? (
                <p style={{ fontSize: 15, lineHeight: 1.5, color: "#5f6368" }}>{USSD.dialingMessage}</p>
              ) : (
                <div style={{ fontSize: 15, lineHeight: 1.45 }}>
                  <p style={{ marginBottom: 8 }}>{USSD.responseHeader}</p>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {USSD.menu.map((m) => (
                      <li key={m.key} style={{ marginBottom: 4 }}>
                        {m.key}. {m.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Reply field. A bare underline, because that is what the system dialog gives you. */}
            <div className="px-5 pb-1">
              <div
                style={{
                  borderBottom: "1.5px solid #9aa0a6",
                  paddingBottom: 5,
                  fontSize: 15,
                  color: "#9aa0a6",
                  minHeight: 26,
                }}
              >
                {USSD.inputPlaceholder}
              </div>
            </div>

            <div className="flex justify-end gap-6 px-5 py-3">
              <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "0.04em", color: "#5f6368" }}>
                {USSD.cancelLabel.toUpperCase()}
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "0.04em", color: "#1a73e8" }}>
                {USSD.sendLabel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="shrink-0 flex justify-center pt-1.5 pb-2">
          <span className="block rounded-full" style={{ width: 118, height: 5, background: "#ffffff", opacity: 0.55 }} />
        </div>
      </div>
    </div>
  );
}
