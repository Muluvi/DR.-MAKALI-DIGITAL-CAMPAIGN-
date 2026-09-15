import React from "react";
import { Clock } from "lucide-react";

import { PlatformTile, PLATFORM_BRAND } from "../brand/PlatformLogos";
import { PLATFORM_STACK } from "../../data/platform-stack";
import { SourceLine } from "./SourceLine";
import { TierBadge } from "./TierBadge";

/**
 * §8.1.1 — the six platforms under daily management, each shown at the in-county size §3.6.1
 * gives it.
 *
 * The sentence this replaces is a list: "Daily management of Facebook, X, Instagram, TikTok,
 * YouTube and WhatsApp." Read as a list, six platforms look like six equivalent commitments.
 * They are not: §3.6.1 sizes WhatsApp at up to 80,000 in-county users and X at up to 12,000, so
 * one of these is the organising backbone and another is a room of roughly a hundred and fifty
 * journalists and county elites. The bar is drawn to make that ratio visible at a glance, which
 * is the only thing a logo row on its own would fail to say.
 *
 * Deliberately static: no state, no client bundle, no entrance animation. §3.6 puts the reader
 * on mobile data, and lib/motion.ts forbids generic entrance reveals on ordinary panels.
 */

const MAX_REACH = Math.max(...PLATFORM_STACK.map((p) => p.upper));

export function PlatformStackBlock() {
  return (
    <div className="not-prose my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden print-avoid-break">
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
          <span className="t-label font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded">
            Owned platforms
          </span>
          <TierBadge tier={2} />
        </div>
        <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-1.5 pl-3.5">
          Six platforms under daily management, at their real in-county size
        </h4>
        <p className="t-small text-muted leading-relaxed mt-1 pl-3.5">
          Bars are scaled against WhatsApp, the largest. Every range is the §3.6.1 sizing matrix
          verbatim — reachable accounts, not votes.
        </p>
      </div>

      <ul className="divide-y divide-line/60">
        {PLATFORM_STACK.map((p) => (
          <li key={p.id} className="flex items-start gap-3 p-4 sm:px-5">
            <PlatformTile id={p.id} size={32} className="shrink-0 mt-0.5" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h5 className="text-sm font-bold text-ink">{PLATFORM_BRAND[p.id].label}</h5>
                <span className="t-small font-mono font-bold text-accent">{p.reach}</span>
                <span className="t-label text-muted font-medium">
                  {p.share} of the register
                  {p.shared && <span className="text-muted/70"> · combined Meta figure</span>}
                </span>
              </div>

              {/* Proportional to the upper bound of each stated range, so no platform is drawn
                  smaller than its own evidence allows. */}
              <div
                className="mt-2 h-1.5 rounded-full bg-line/70 overflow-hidden"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-accent-solid"
                  style={{ width: `${(p.upper / MAX_REACH) * 100}%` }}
                />
              </div>

              <p className="t-label text-ink/90 leading-relaxed mt-2">{p.role}</p>

              {p.format && (
                <p className="t-micro font-mono font-semibold text-muted mt-1.5">
                  §8.3.2 format — {p.format}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="p-3.5 sm:px-5 bg-paper/60 border-t border-line space-y-2">
        <p className="t-label text-ink flex items-start gap-2 font-medium">
          <Clock size={14} className="shrink-0 mt-0.5 text-accent" aria-hidden="true" />
          <span>
            <strong className="font-bold">Community management standard:</strong> responses to
            comments, DMs and mentions within <strong className="font-bold">2 hours</strong> during
            peak periods, across all six.
          </span>
        </p>
        <p className="t-label text-muted leading-relaxed">
          <span className="italic">Two notes on the figures.</span> §3.6.1 sizes Facebook and
          Instagram as a single {"“"}Meta (FB/IG){"”"} line, so both carry the same combined range
          rather than an invented split. And every bar here sits inside the §3.6 ceiling: the whole
          connected tier is about 72,000 reachable voters against a 198,004-vote benchmark, which is
          why §8.10 and not this panel is where the election is won.
        </p>
        <SourceLine sources={["KNBS 2019 Census", "Meta Audience Insights"]} />
      </div>
    </div>
  );
}
