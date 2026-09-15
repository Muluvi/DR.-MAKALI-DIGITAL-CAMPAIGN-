import React from "react";
import { Search, Repeat2, AlertTriangle } from "lucide-react";

import { PlatformTile } from "../brand/PlatformLogos";
import { PAID_SURFACES } from "../../data/platform-stack";

/**
 * §8.1.2 — the five paid surfaces, and the allocation the campaign has not set yet.
 *
 * The section names five ad products in one run-on bullet. Laid out as five cards, two things
 * become legible that the sentence hides: the paid buy runs on the same platforms §8.1.1 already
 * manages organically (so the logos repeat deliberately), and Google and retargeting are ad
 * products rather than owned accounts, which is why those two carry a neutral tile instead of a
 * brand one.
 *
 * NO BUDGET FIGURES. §8.1.2 promises "a monthly allocation matrix based on ward-level
 * registration and engagement data" and the campaign has not produced one. The closing strip
 * says that in the site's own placeholder register rather than showing a pie chart of invented
 * splits — the failure the figure guard was written to prevent.
 */

const NEUTRAL_ICON = {
  "Google Search & Display": Search,
  Retargeting: Repeat2,
} as const;

export function PaidChannelStrip() {
  return (
    <div className="not-prose my-6 sm:my-8 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-gold rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Paid surfaces named in §8.1.2</h4>
      </div>
      <p className="t-small text-muted mb-3 pl-3.5 leading-relaxed">
        The same platforms as the organic stack, bought rather than posted — plus two ad products
        the campaign does not hold accounts on.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {PAID_SURFACES.map((s) => {
          const NeutralIcon = NEUTRAL_ICON[s.name as keyof typeof NEUTRAL_ICON];
          return (
            <li
              key={s.name}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-card border border-line"
            >
              {s.platform ? (
                <PlatformTile id={s.platform} size={26} className="shrink-0 mt-0.5" />
              ) : (
                <span className="shrink-0 mt-0.5 w-[26px] h-[26px] rounded-[6px] bg-paper border border-line flex items-center justify-center text-muted">
                  {NeutralIcon && <NeutralIcon size={14} aria-hidden="true" />}
                </span>
              )}
              <div className="min-w-0">
                <h5 className="t-small font-bold text-ink leading-tight">{s.name}</h5>
                <p className="t-label text-muted leading-relaxed mt-0.5">{s.basis}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="t-label text-muted leading-relaxed mt-3 pt-2 border-t border-line/50 flex items-start gap-2">
        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-gold" aria-hidden="true" />
        <span>
          <span className="italic">No split is shown because none exists.</span> §8.1.2 commits to a
          monthly allocation matrix derived from ward-level registration and engagement data; until
          that data is collected, any division of spend across these five would be invented.
        </span>
      </p>
    </div>
  );
}
