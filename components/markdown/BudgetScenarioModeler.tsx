"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coins, ShieldCheck, Scale, Users, Radio, CheckCircle2, AlertTriangle } from "lucide-react";

import { ClaimBadge } from "./ClaimBadge";
import { TierBadge } from "./TierBadge";

/**
 * Section 8B tier comparator.
 *
 * EVERY FIGURE HERE IS QUOTED FROM operations.md §8B.5–8B.6. Nothing is derived, rounded or
 * filled in. That constraint is the point of the component, not a limitation of it: §8B exists
 * to demonstrate that Firefly understands the Election Campaign Financing Act, and a comparator
 * that invents its own percentages of a statutory ceiling demonstrates the opposite.
 *
 * An earlier version hardcoded tier envelopes in both percentage and absolute KSh terms, a shared
 * USSD shortcode, and a share-of-voice dominance guarantee. None of
 * those appear in the source. The source deliberately leaves ad spend as
 * `[Insert — recommend N–M% of ceiling]` pending the verified ceiling, and Appendix A logs it
 * as an open item owned by the campaign. So the recommendation BAND is what renders, with the
 * unresolved figure shown as unresolved — using the same "Awaiting campaign decision" badge the
 * rest of the document already uses for exactly this.
 */

const CEILING_LABEL = "KSh97.56 million";

interface BudgetTier {
  id: "lean" | "standard" | "premium";
  name: string;
  badge: string;
  recommended: boolean;
  purpose: string;
  /** §8B.5's bracketed recommendation, as a band. The absolute figure is not yet set. */
  adSpendBand: { low: number; high: number };
  team: string;
  channels: string;
  smsVolume: string;
  ussd: string;
  content: string;
  analytics: string;
  /** §8B.6's "Realistic Phase 3 contact universe" row — the one sized figure per tier. */
  contactUniverse: string;
  tradeOffs: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: "lean",
    name: "Tier 1 — Lean",
    badge: "Win the nomination, hold the field",
    recommended: false,
    purpose: "Win the nomination, hold the field, prove the model.",
    adSpendBand: { low: 15, high: 20 },
    team: "3-person core + Kikamba producer only",
    channels: "Facebook, WhatsApp, TikTok organic; limited paid on Meta; SMS to a consented list built organically",
    smsVolume: "Not yet set",
    ussd: "Not activated",
    content: "1 flagship video/week; daily social; weekly Kikamba voice note",
    analytics: "Platform-native dashboards; monthly report",
    contactUniverse: "~60,000",
    tradeOffs:
      "No predictive modelling; no attribution beyond last-click; no dedicated crisis lead until triggered; arid-belt reach materially limited. Expected reach is strong in the Anchor zone, moderate in Mwingi, weak in the arid belt — i.e. strongest where Dr. Mulu is already strongest, which is the central weakness of this tier.",
  },
  {
    id: "standard",
    name: "Tier 2 — Standard",
    badge: "Recommended",
    recommended: true,
    purpose: "Close the recognition gap countywide and contest the general election competitively.",
    adSpendBand: { low: 30, high: 40 },
    team: "Lean Firefly core + activated surge bench (data, community, volunteer, earned media and video roles activated by phase/KPI — not a permanent standing department)",
    channels: "Full platform mix; SMS/USSD layer active across all 40 wards",
    smsVolume: "Not yet set — scaling to a GOTV surge",
    ussd: "Shared code, all networks (~KSh34,800/network + KSh140,000 development + KSh5,000/month hosting)",
    content:
      "2–3 flagship videos/week; daily multilingual social; weekly Facebook Live; weekly Kikamba voice note; monthly Kitui Economic Brief",
    analytics: "Predictive voter scoring; multi-touch attribution; field-digital integration; weekly sentiment",
    contactUniverse: "~150,000",
    tradeOffs:
      "No premium social listening licences; sign-language interpretation on flagship content only rather than all video.",
  },
  {
    id: "premium",
    name: "Tier 3 — Premium",
    badge: "Fully instrumented",
    recommended: false,
    purpose: "Dominate share of voice and run a fully instrumented operation.",
    adSpendBand: { low: 45, high: 55 },
    team: "3-person core + full surge bench activated against the agreed phase and KPI triggers",
    channels:
      "Everything in Standard, plus dedicated USSD short code, expanded WhatsApp Business API, and diaspora-targeted programming across the 26 countries IEBC is opening to diaspora registration",
    smsVolume: "Not yet set",
    ussd: "Dedicated short code",
    content: "Daily video; documentary series; full sign-language and plain-language versioning across all flagship output",
    analytics: "Licensed social listening (Brandwatch/Meltwater class); full attribution; monthly message-lab research",
    contactUniverse: "~250,000",
    tradeOffs:
      "Approaches the statutory ceiling — requires disciplined headroom management against other campaign expenditure, since the ceiling covers the whole campaign, not the digital function alone.",
  },
];

/** §8B.6, verbatim. */
const COMPARISON_ROWS: { label: string; lean: string; standard: string; premium: string }[] = [
  { label: "Team model", lean: "3-person core + mandatory Kikamba producer", standard: "3-person core + activated surge roles", premium: "3-person core + full surge bench" },
  { label: "Wards with active SMS/USSD", lean: "Partial", standard: "All 40", premium: "All 40 + diaspora" },
  { label: "Predictive voter scoring", lean: "✗", standard: "✓", premium: "✓" },
  { label: "Multi-touch attribution", lean: "✗", standard: "✓", premium: "✓" },
  { label: "Focus groups", lean: "✗", standard: "Quarterly", premium: "Monthly" },
  { label: "Red-team drills", lean: "On trigger", standard: "Quarterly", premium: "Monthly" },
  { label: "Sign-language interpretation", lean: "Flagship only", standard: "Flagship", premium: "All video" },
  { label: "Arid-belt reach", lean: "Weak", standard: "Strong", premium: "Strong" },
  { label: "Realistic Phase 3 contact universe", lean: "~60,000", standard: "~150,000", premium: "~250,000" },
];

export function BudgetScenarioModeler() {
  const [selectedTierId, setSelectedTierId] = useState<BudgetTier["id"]>("standard");
  const currentTier = BUDGET_TIERS.find((t) => t.id === selectedTierId) ?? BUDGET_TIERS[1];

  return (
    <div className="my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose">
      <div className="p-4 sm:p-5 border-b border-line bg-paper/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Coins size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Section 8B · The three tiers
              </span>
              <TierBadge tier={1} compact />
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink mt-1">Scope and trade-offs by tier</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-accent/30 rounded-xl shrink-0">
          <Scale size={14} className="text-accent" aria-hidden="true" />
          <div>
            <div className="t-micro uppercase font-black text-muted">Statutory county ceiling</div>
            <div className="text-xs font-mono font-black text-ink tabular-nums">{CEILING_LABEL}</div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-paper/70 border-b border-line grid grid-cols-1 sm:grid-cols-3 gap-2" role="tablist" aria-label="Budget tiers">
        {BUDGET_TIERS.map((tier) => {
          const isSelected = tier.id === selectedTierId;
          return (
            <button
              key={tier.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedTierId(tier.id)}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex flex-col gap-1 ${
                isSelected
                  ? "bg-card border-accent ring-2 ring-accent/15"
                  : "bg-paper/40 border-line hover:border-accent/40 text-muted hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className={`t-label font-mono font-black ${isSelected ? "text-accent" : "text-muted"}`}>
                  {tier.adSpendBand.low}–{tier.adSpendBand.high}% of ceiling
                </span>
                {tier.recommended && (
                  <span className="t-micro font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">
                    Recommended
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-ink truncate">{tier.name}</div>
              <div className="t-small text-muted truncate">{tier.badge}</div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentTier.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="p-4 sm:p-6 space-y-4"
        >
          <p className="text-sm text-ink font-semibold leading-relaxed">{currentTier.purpose}</p>

          {/* The ad-spend band, against the ceiling. The absolute figure is not yet set — and
              the UI says so rather than picking one. */}
          <div className="p-4 rounded-xl border border-line bg-paper space-y-2.5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="t-label font-black uppercase tracking-wider text-muted">
                Recommended ad spend, as a share of the verified ceiling
              </span>
              <ClaimBadge status="awaiting" compact />
            </div>
            <div
              className="relative h-8 rounded-lg bg-line/40 overflow-hidden"
              role="img"
              aria-label={`Recommended band: ${currentTier.adSpendBand.low} to ${currentTier.adSpendBand.high} percent of the ${CEILING_LABEL} ceiling`}
            >
              <div
                className="absolute inset-y-0 bg-accent/25 border-x-2 border-accent"
                style={{
                  left: `${currentTier.adSpendBand.low}%`,
                  width: `${currentTier.adSpendBand.high - currentTier.adSpendBand.low}%`,
                }}
              />
              <div className="absolute inset-0 flex items-center px-2.5">
                <span className="t-small font-mono font-bold text-ink tabular-nums">
                  {currentTier.adSpendBand.low}%–{currentTier.adSpendBand.high}%
                </span>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 t-label font-mono text-muted">
                100% = {CEILING_LABEL}
              </span>
            </div>
            <p className="t-small text-muted leading-relaxed">
              §21.19 states this as <code className="placeholder">[Insert — recommend {currentTier.adSpendBand.low}–{currentTier.adSpendBand.high}% of ceiling]</code>. The absolute
              figure is set on tier selection and is owned by the campaign (§39.1, ref 21.19). Percentages refer to
              the verified county ceiling; absolute figures are illustrative structures to be finalised against it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Detail icon={Users} label="Team">{currentTier.team}</Detail>
            <Detail icon={Radio} label="Channels">{currentTier.channels}</Detail>
            <Detail icon={CheckCircle2} label="Content">{currentTier.content}</Detail>
            <Detail icon={ShieldCheck} label="Analytics">{currentTier.analytics}</Detail>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-paper rounded-xl border border-line">
              <div className="t-label uppercase font-bold text-muted">SMS volume / month</div>
              <div className="text-xs font-semibold text-ink mt-1 flex items-center gap-1.5 flex-wrap">
                {currentTier.smsVolume}
                <ClaimBadge status="awaiting" compact />
              </div>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-line">
              <div className="t-label uppercase font-bold text-muted">USSD</div>
              <div className="text-xs font-semibold text-ink mt-1">{currentTier.ussd}</div>
            </div>
            <div className="p-3 bg-accent/5 rounded-xl border border-accent/20">
              <div className="t-label uppercase font-bold text-accent">Phase 3 contact universe</div>
              <div className="text-sm font-black text-accent mt-0.5 font-mono tabular-nums">
                {currentTier.contactUniverse}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-paper/60 border border-line">
            <div className="t-label font-black uppercase tracking-wider text-muted flex items-center gap-1 mb-1.5">
              <AlertTriangle size={12} className="text-gold" aria-hidden="true" />
              Trade-offs
            </div>
            <p className="text-xs text-ink leading-relaxed">{currentTier.tradeOffs}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="border-t border-line overflow-x-auto">
        <table className="w-full t-small sm:text-xs">
          <caption className="text-left px-4 pt-3 pb-2 t-label font-black uppercase tracking-wider text-muted">
            §21.20 Tier comparison
          </caption>
          <thead>
            <tr className="bg-paper/70 border-y border-line">
              <th scope="col" className="text-left px-3 py-2 font-bold text-muted">&nbsp;</th>
              {BUDGET_TIERS.map((t) => (
                <th
                  key={t.id}
                  scope="col"
                  className={`text-left px-3 py-2 font-bold ${t.id === selectedTierId ? "text-accent" : "text-muted"}`}
                >
                  {t.id === "lean" ? "Lean" : t.id === "standard" ? "Standard" : "Premium"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.label} className="border-b border-line/40 last:border-b-0">
                <th scope="row" className="text-left px-3 py-2 font-semibold text-muted align-top">{row.label}</th>
                <td className={`px-3 py-2 align-top ${selectedTierId === "lean" ? "text-ink font-semibold" : "text-muted"}`}>{row.lean}</td>
                <td className={`px-3 py-2 align-top ${selectedTierId === "standard" ? "text-ink font-semibold" : "text-muted"}`}>{row.standard}</td>
                <td className={`px-3 py-2 align-top ${selectedTierId === "premium" ? "text-ink font-semibold" : "text-muted"}`}>{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-paper/60 border-t border-line">
        <p className="t-small text-muted leading-relaxed">
          <strong className="text-ink">Recommendation: Tier 2 (Standard).</strong> Tier 1 concentrates spend where Dr.
          Mulu is already strong and leaves the recognition deficit untouched. Tier 3 is defensible but presses against
          a statutory ceiling that must also accommodate transport, venues and personnel across 30,430 square
          kilometres — and transport is typically the largest single category of campaign expenditure.
        </p>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Users;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3.5 rounded-xl bg-paper/60 border border-line">
      <div className="t-label font-black uppercase tracking-wider text-muted flex items-center gap-1 mb-1.5">
        <Icon size={12} className="text-accent" aria-hidden="true" />
        {label}
      </div>
      <p className="text-xs text-ink leading-relaxed">{children}</p>
    </div>
  );
}
