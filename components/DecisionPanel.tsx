"use client";

import React from "react";
import { UserCheck, Clock, Camera, Scale, FileText, MapPin, Briefcase, CheckCircle2 } from "lucide-react";

import { ClaimBadge } from "./markdown/ClaimBadge";

/**
 * M5 — the ask.
 *
 * A proposal that ends without stating its ask is a report. This is a vendor pitch to one
 * decision-maker, and it previously trailed off into 329 words of conclusion prose with no
 * closing component of any kind.
 *
 * DELIBERATELY UNANIMATED. After 55,000 words and every animated surface before it, stillness is
 * the strongest effect left. The ask should not perform.
 *
 * Content is §21.5 (what Firefly needs), §8B.6 (the tier recommendation) and Appendix A's owner
 * column. Nothing here is new.
 */

/** §21.5, verbatim. The `owner` field is from Appendix A's register. */
const DEPENDENCIES: { icon: typeof UserCheck; text: string; longLead?: boolean }[] = [
  { icon: UserCheck, text: "One named counterpart with authority to approve content" },
  {
    icon: Clock,
    text: "Candidate time: approximately 3 hours per week — one Facebook Live, one voice-note recording session, one interview or content block",
  },
  { icon: Camera, text: "Ground team asset uploads: daily photographs and video from the trail" },
  {
    icon: Scale,
    text: "Appointment of the compliance reviewer (§16.5) — the long-lead item, needed in Phase −1",
    longLead: true,
  },
  { icon: FileText, text: "The verified expenditure ceiling from the gazette schedule" },
  { icon: MapPin, text: "Current ward-level registration data from the IEBC published file" },
  { icon: Briefcase, text: "Access to the existing NG-CDF project record for verified proof points" },
  { icon: CheckCircle2, text: "Sign-off on the budget tier so the team can be assembled" },
];

export function DecisionPanel() {
  return (
    <section
      aria-labelledby="decision-panel-heading"
      // Rendered inside the document's prose container now, so it opts out of the document
      // element styles the way every other card component does.
      className="not-prose my-12 border-t-2 border-ink pt-8 print:break-inside-avoid"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-8 lg:gap-12">
        <div>
          <h2
            id="decision-panel-heading"
            className="font-serif text-2xl sm:text-3xl font-semibold text-ink leading-tight tracking-tight"
          >
            What we are asking for
          </h2>

          <div className="mt-5 p-4 bg-card border border-accent/30 rounded-2xl">
            <div className="t-label font-black uppercase tracking-wider text-accent">The recommendation</div>
            <div className="font-serif text-xl font-bold text-ink mt-1">Tier 2 — Standard</div>
            <p className="text-xs text-muted leading-relaxed mt-2">
              Tier 1 concentrates spend where Dr. Mulu is already strong and leaves the recognition
              deficit untouched. Tier 3 is defensible but presses against a statutory ceiling that must
              also cover transport, venues and personnel across 30,430 square kilometres.
            </p>
          </div>

          <p className="text-sm text-muted leading-relaxed mt-5">
            Firefly is proposed as the campaign&apos;s outsourced digital function, not a single
            communications hire. The proposal deliberately claims no named clients or case studies;
            its proof is the specificity of the operating model and the deliverables set out above.
          </p>

          <p className="text-sm text-ink font-semibold leading-relaxed mt-4">
            The nomination is decided by opinion poll, and the window closes in September 2026.
            Every dependency below sits on that clock.
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <h3 className="t-label font-black uppercase tracking-wider text-muted">
              What Firefly needs from the campaign
            </h3>
            <span className="t-label text-muted font-mono">§21.5</span>
          </div>

          <ol className="space-y-2.5">
            {DEPENDENCIES.map((d, i) => {
              const Icon = d.icon;
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    d.longLead ? "border-gold/40 bg-gold/[0.05]" : "border-line bg-card"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      d.longLead ? "bg-gold/15 text-gold" : "bg-accent/10 text-accent"
                    }`}
                  >
                    <Icon size={14} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-ink leading-relaxed">{d.text}</p>
                    {d.longLead && (
                      <div className="mt-1.5">
                        <ClaimBadge status="awaiting" compact />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="t-small text-muted leading-relaxed mt-4 pt-4 border-t border-line/60">
            Items 4, 5 and 6 are the ones that gate everything else. The compliance reviewer is the
            long-lead appointment; the ceiling and the ward register are the two figures this
            document leaves open, and both are the campaign&apos;s to supply.
          </p>
        </div>
      </div>
    </section>
  );
}
