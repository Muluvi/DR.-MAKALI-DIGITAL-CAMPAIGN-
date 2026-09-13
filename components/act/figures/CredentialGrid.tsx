"use client";

import React from "react";
import { motion } from "motion/react";
import { Award, BarChart3, Globe2, GraduationCap, Landmark, Timer } from "lucide-react";

import { SpotlightCard } from "../../visual/Surfaces";
import { useReducedMotionSafe } from "../../../hooks/use-reduced-motion-safe";

/**
 * The candidate's record, as a board rather than a bullet list.
 *
 * Six credentials, each with the evidence under it. In the document these were a markdown
 * table with an "Asset / Evidence / Application" header, which is the shape a consultant
 * writes and nobody reads. The claim on each card is the credential; the line beneath is what
 * makes it checkable.
 *
 * SpotlightCard gives each card a cursor-tracked highlight on pointer devices — the one
 * interaction here that is purely for pleasure, and it costs nothing on a phone, where it
 * simply does not run.
 */

const CREDENTIALS = [
  {
    icon: GraduationCap,
    title: "Macroeconomic authority",
    body: "PhD in economics, and leadership on the Budget and Appropriations Committee.",
    proof: "The spine of the platform — and what makes a weekly public-finance explainer credible in his own voice.",
  },
  {
    icon: BarChart3,
    title: "Monitoring and evaluation",
    body: "Certified M&E consultant, member of the Evaluation Society of Kenya, designated M&E Champion by the Ministry of Finance.",
    proof: "A governor who can be held to published targets is a different proposition from one who cannot.",
  },
  {
    icon: Globe2,
    title: "International standing",
    body: "United Nations project management and financial advisory roles.",
    proof: "The credential that carries furthest with professionals and the diaspora.",
  },
  {
    icon: Landmark,
    title: "Delivery on the ground",
    body: "KSh 47 million in bursaries to 12,573 constituents.",
    proof: "Kitui Central certified best-evaluated constituency in the Eastern region, FY2014/15 — first of 71 in its national peer group.",
  },
  {
    icon: Timer,
    title: "Administrative longevity",
    body: "Seventeen years in political leadership, thirteen as MP for Kitui Central.",
    proof: "Steady, low-risk leadership against a field of less-experienced executives.",
  },
  {
    icon: Award,
    title: "An asset already built",
    body: "The Kitui Central NG-CDF digital portal is live, and already his.",
    proof: "Something to build on rather than a budget line to spend twice.",
  },
];

export function CredentialGrid() {
  const reduce = useReducedMotionSafe();

  return (
    <div className="act-figure act-figure-full my-12 md:my-16">
      <p className="act-kicker mb-5">What the record holds</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CREDENTIALS.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpotlightCard>
                <div
                  className="p-5 h-full rounded-xl"
                  style={{ background: "var(--act-raise)", border: "1px solid var(--act-hair)" }}
                >
                  <span
                    className="inline-grid place-items-center w-9 h-9 rounded-lg mb-4"
                    style={{
                      background: "color-mix(in oklch, var(--act-blue) 15%, transparent)",
                      color: "var(--act-blue)",
                    }}
                  >
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <h4 className="font-sans text-[0.9375rem] font-bold leading-snug" style={{ color: "var(--act-text)" }}>
                    {c.title}
                  </h4>
                  <p
                    className="mt-2 leading-relaxed"
                    style={{ color: "var(--act-body)", fontFamily: "var(--font-serif)", fontSize: "0.9375rem" }}
                  >
                    {c.body}
                  </p>
                  <p
                    className="mt-3 pt-3 font-sans text-[0.75rem] leading-snug"
                    style={{ color: "var(--act-dim)", borderTop: "1px solid var(--act-hair)" }}
                  >
                    {c.proof}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
