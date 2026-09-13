"use client";

import React from "react";
import {
  ArrowRight,
  Database,
  Radio,
  ShieldCheck,
  Signal,
  Smartphone,
  Target,
  TrendingDown,
} from "lucide-react";

import "../look.css";

import { Rise } from "@/components/look/Rise";
import { CountTo } from "@/components/look/CountTo";
import { COUNTY_TOTAL_WARDS, CONSTITUENCIES_BY_SIZE, TOTAL_WARDS } from "@/data/ward-register";

/**
 * LOOK TEST — not the site. One screen to react to.
 *
 * Derived from six reference sites rather than from taste. The vocabulary five of the six
 * share is: rounded cards in a bento grid, a device mockup as the centrepiece, pill badges,
 * consistent line icons, soft diffused shadows, scroll fade-ins, generous whitespace and hover
 * microinteractions. Light ground, because four of the six are light.
 *
 * Disko supplies the one dark section — monospace labels, dense rows, small sharp radii — which
 * is where the ward data belongs. Kurosawa supplies the slash markers and the narrow reading
 * column, and the slash is what replaces "3.4.5" without bringing numbering back.
 *
 * The content here is real and sourced, but it is placeholder in the sense that none of it is
 * the rewritten proposal. This route exists to settle the look. It is deleted or replaced
 * once that is settled.
 */

const NAV = ["terrain", "arithmetic", "reach", "terms"];

export default function LookTest() {
  const top = CONSTITUENCIES_BY_SIZE.slice(0, 6);
  const maxVoters = top[0].voters;

  return (
    <div className="look min-h-screen">
      {/* Linearity's sticky blurred nav. */}
      <header className="look-nav">
        <div className="look-wrap flex items-center justify-between h-16">
          <span className="font-bold tracking-[-0.02em]" style={{ color: "var(--ink-1)" }}>
            Firefly<span style={{ color: "var(--brand)" }}>.</span>
          </span>
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              <a key={n} href={`#${n}`} className="look-slash transition-colors hover:opacity-70">
                {n}
              </a>
            ))}
          </nav>
          <a href="#terms" className="look-cta text-[0.875rem]">
            The ask <ArrowRight size={15} />
          </a>
        </div>
      </header>

      {/* ── Hero. Subscrr's centred, benefit-led hero with a pill above the headline. ───────── */}
      <section className="look-wrap pt-16 pb-14 md:pt-28 md:pb-20 text-center">
        <Rise>
          <span className="look-pill">
            <ShieldCheck size={12} /> Confidential · Prepared for Hon. Dr. B. M. Mulu
          </span>
        </Rise>
        <Rise delay={0.06}>
          <h1 className="look-h1 mt-7 mx-auto max-w-4xl">
            Two hundred thousand votes, and four fifths of them are offline.
          </h1>
        </Rise>
        <Rise delay={0.12}>
          <p className="look-lede mt-6 mx-auto max-w-2xl">
            A digital campaign for Kitui that starts by admitting what digital cannot do — then
            builds the machine that reaches everyone it misses.
          </p>
        </Rise>
        <Rise delay={0.18}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#terrain" className="look-cta">
              Read the terrain <ArrowRight size={16} />
            </a>
            <a href="#arithmetic" className="look-cta-ghost">
              See the arithmetic
            </a>
          </div>
        </Rise>
      </section>

      {/* ── Bento. Linearity + Subscrr: mixed card sizes, rounded, soft shadow, hover lift. ── */}
      <section id="terrain" className="look-wrap pb-16 md:pb-24">
        <Rise className="mb-6">
          <span className="look-slash">terrain</span>
        </Rise>

        <div className="grid gap-4 md:grid-cols-6">
          <Rise className="md:col-span-4">
            <div className="look-card p-7 md:p-9 h-full">
              <Target size={20} style={{ color: "var(--brand)" }} />
              <p className="look-num mt-5">
                <CountTo value={COUNTY_TOTAL_WARDS} />
              </p>
              <p className="mt-2 font-semibold" style={{ color: "var(--ink-1)" }}>
                Registered voters, across {TOTAL_WARDS} wards
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed" style={{ color: "var(--ink-3)" }}>
                Eight constituencies, 1,578 polling stations, and a seat that costs roughly
                200,000 votes — three in every five that get cast.
              </p>
            </div>
          </Rise>

          <Rise delay={0.06} className="md:col-span-2">
            <div className="look-card p-7 h-full flex flex-col justify-between">
              <TrendingDown size={20} style={{ color: "var(--ember)" }} />
              <div className="mt-5">
                <p className="look-num" style={{ color: "var(--ember)" }}>
                  <CountTo value={15.3} decimals={1} />
                </p>
                <p className="mt-2 font-semibold" style={{ color: "var(--ink-1)" }}>
                  Points behind
                </p>
                <p className="mt-2 text-[0.875rem] leading-relaxed" style={{ color: "var(--ink-3)" }}>
                  37.4% to 22.1%, August 2026. Two rounds is not a trend — it is the starting
                  position.
                </p>
              </div>
            </div>
          </Rise>

          <Rise delay={0.1} className="md:col-span-2">
            <div className="look-card p-7 h-full">
              <Signal size={20} style={{ color: "var(--brand)" }} />
              <p className="look-num mt-5">
                <CountTo value={13.6} decimals={1} suffix="%" />
              </p>
              <p className="mt-2 font-semibold" style={{ color: "var(--ink-1)" }}>
                Use the internet
              </p>
              <p className="mt-2 text-[0.875rem] leading-relaxed" style={{ color: "var(--ink-3)" }}>
                Which caps every screen in the county at about 72,000 reachable voters.
              </p>
            </div>
          </Rise>

          <Rise delay={0.14} className="md:col-span-4">
            <div className="look-card p-7 md:p-9 h-full">
              <Radio size={20} style={{ color: "var(--brand)" }} />
              <p className="look-num mt-5">
                <CountTo value={420000} />
              </p>
              <p className="mt-2 font-semibold" style={{ color: "var(--ink-1)" }}>
                Reached by Kikamba radio
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed" style={{ color: "var(--ink-3)" }}>
                Five times what every digital platform in Kitui reaches put together. It is why
                82% of the communications weight goes offline, and why a digital consultancy is
                the one telling you so.
              </p>
            </div>
          </Rise>
        </div>
      </section>

      {/* ── Disko's band. Dark, dense, monospace, sharp radii, live count. ─────────────────── */}
      <section id="arithmetic" className="look-wrap pb-16 md:pb-24">
        <Rise>
          <div className="look-dark p-6 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div>
                <span className="look-mono" style={{ color: "var(--dark-accent)" }}>
                  /register
                </span>
                <h2
                  className="mt-2 font-bold tracking-[-0.025em]"
                  style={{ color: "var(--dark-ink)", fontSize: "clamp(1.35rem, 1.1rem + 1.1vw, 1.9rem)" }}
                >
                  Where the votes actually are
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="look-chip">IEBC 2022</span>
                <span className="look-chip">TIER 1 · OFFICIAL</span>
                <span className="look-chip">{TOTAL_WARDS} WARDS</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {top.map((c, i) => (
                <div
                  key={c.id}
                  className="grid grid-cols-[1.6rem_1fr_auto] md:grid-cols-[2rem_11rem_1fr_auto] items-center gap-3 md:gap-4 py-2 border-b"
                  style={{ borderColor: "var(--dark-line)" }}
                >
                  <span className="look-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className="text-[0.875rem] font-semibold truncate"
                    style={{ color: "var(--dark-ink)" }}
                  >
                    {c.name}
                  </span>
                  <span className="hidden md:block h-1.5 rounded-sm" style={{ background: "var(--dark-line)" }}>
                    <span
                      className="block h-1.5 rounded-sm"
                      style={{
                        width: `${(c.voters / maxVoters) * 100}%`,
                        background: "var(--dark-accent)",
                      }}
                    />
                  </span>
                  <span
                    className="look-mono text-right"
                    style={{ color: "var(--dark-ink)", fontVariantNumeric: "tabular-nums" }}
                  >
                    {c.voters.toLocaleString("en-KE")}
                  </span>
                </div>
              ))}
            </div>

            <p className="look-mono mt-6">
              Top six of eight · the four largest hold 296,196 voters, 55.6% of the county
            </p>
          </div>
        </Rise>
      </section>

      {/* ── Device mockup. Subscrr's realistic frame with the actual interface inside. ─────── */}
      <section id="reach" className="look-wrap pb-16 md:pb-24">
        <div className="grid gap-10 md:gap-14 md:grid-cols-2 items-center">
          <Rise>
            <span className="look-slash">reach</span>
            <h2 className="look-h2 mt-4">The interface that reaches the other 86.4%</h2>
            <p className="look-lede mt-5">
              A zero-rated USSD line the voter dials for free, on the feature phone they already
              own. No app, no data bundle, no smartphone. It reaches roughly 250,000 registered
              voters that nothing on a screen can.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["No data cost", "Works on 2G", "Kikamba first", "Any handset"].map((t) => (
                <span key={t} className="look-pill">
                  {t}
                </span>
              ))}
            </div>
          </Rise>

          <Rise delay={0.08}>
            <div className="mx-auto w-full max-w-[17rem]">
              <div
                className="rounded-[2rem] p-3"
                style={{ background: "var(--dark-0)", boxShadow: "var(--shadow-lift)" }}
              >
                <div
                  className="rounded-[1.4rem] p-5 min-h-[22rem] flex flex-col"
                  style={{ background: "oklch(0.13 0.02 260)" }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <Smartphone size={13} style={{ color: "var(--dark-meta)" }} />
                    <span className="look-mono">USSD</span>
                  </div>
                  <p className="look-mono mb-3" style={{ color: "var(--dark-accent)" }}>
                    *[shortcode]#
                  </p>
                  <div className="space-y-2.5 flex-1">
                    {[
                      "1. Mawoni ma Dr. Mulu",
                      "2. Mituki ya kisio kyaku",
                      "3. Ithyoka ta muteti",
                      "4. Kwona Ward Captain",
                      "5. Kiswahili / English",
                    ].map((l) => (
                      <p
                        key={l}
                        className="text-[0.8125rem] leading-snug"
                        style={{ color: "var(--dark-ink)", fontFamily: "var(--font-mono)" }}
                      >
                        {l}
                      </p>
                    ))}
                  </div>
                  <div className="pt-4 mt-4 border-t" style={{ borderColor: "var(--dark-line)" }}>
                    <span className="look-chip">SHORTCODE PENDING ALLOCATION</span>
                  </div>
                </div>
              </div>
            </div>
          </Rise>
        </div>
      </section>

      {/* ── Kurosawa's reading column. Where the prose lives. ──────────────────────────────── */}
      <section id="terms" className="pb-20 md:pb-28">
        <div className="look-narrow">
          <Rise>
            <span className="look-slash">terms</span>
            <div className="look-read mt-6">
              <p>
                This is the one place on the page where the text is allowed to just be text.
                Narrow measure, serif, generous leading — the reading column from Kurosawa,
                which is the only one of the six references built for prose rather than product.
              </p>
              <p>
                Everything above it is interface. Everything in it is argument. That split is the
                proposal: <strong>the numbers are shown, the reasoning is read</strong>, and
                neither one has to pretend to be the other. No section numbering, no
                cross-references — the slash markers carry section identity instead.
              </p>
            </div>
          </Rise>

          <Rise delay={0.08}>
            <div className="look-card mt-10 p-7 flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <Database size={18} style={{ color: "var(--brand)" }} />
                <div>
                  <p className="text-[0.9375rem] font-semibold" style={{ color: "var(--ink-1)" }}>
                    Every figure carries its source
                  </p>
                  <p className="text-[0.8125rem]" style={{ color: "var(--ink-3)" }}>
                    IEBC · KNBS · Auditor-General · Mizani Africa
                  </p>
                </div>
              </div>
              <a href="#terrain" className="look-cta-ghost">
                Back to the top
              </a>
            </div>
          </Rise>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: "var(--line-1)" }}>
        <div className="look-wrap py-10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.8125rem]" style={{ color: "var(--ink-3)" }}>
            Firefly Management · Strategic Communications &amp; Digital Campaign Consultancy
          </p>
          <p className="look-slash">look test · not the site</p>
        </div>
      </footer>
    </div>
  );
}
