"use client";

import React from "react";

import { Bars } from "../Bars";
import { Figure } from "../Figure";
import { SERIES } from "../chart-tokens";
import { useChartMode } from "../useChartMode";

/**
 * What actually reaches the offline majority.
 *
 * One measure — voters reachable — so one colour across all six bars. A value-ramp here
 * would double-encode length as hue and burn the only free channel on information the bar
 * length already carries.
 *
 * Ranked descending, because the ranking is the finding: vernacular radio reaches more than
 * five times what every digital platform in the county reaches put together, and it sits at
 * the top of a list the conventional pitch puts at the bottom.
 */
export function ChannelReach() {
  const mode = useChartMode();
  const c = SERIES[mode];

  const data = [
    {
      label: "Kikamba vernacular radio",
      sub: "78–80% daily and weekly listenership",
      value: 420000,
      color: c[0],
      tip: "78.8% of the register — the decisive medium",
      detail: "Musyi FM, County FM and Wikwatyo FM carry the placement budget. Morning studio 06:30–08:30, Kikamba testimonials, live market outside broadcasts.",
    },
    {
      label: "Church and faith networks",
      sub: "Weekly attendance across five denominations",
      value: 350000,
      color: c[0],
      detail: "Catholic, AIC, Redeemed Gospel, Anglican and Baptist congregations, engaged through protocol-compliant clergy partnership.",
    },
    {
      label: "Direct 2G SMS",
      sub: "Basic GSM handsets, opt-in database",
      value: 320000,
      color: c[0],
      detail: "Hyper-localised Kikamba messages timed to market-day eves and election morning.",
    },
    {
      label: "Open-air market barazas",
      sub: "Fixed weekly rotation across the county",
      value: 280000,
      color: c[0],
      detail: "Nguni and Kabati Monday, Kalundu and Tseikuru Tuesday, Mbondoni and Mutomo Wednesday, Chuluni and Kyuso Thursday, Kisasi and Migwani Friday.",
    },
    {
      label: "Zero-rated USSD service",
      sub: "Feature-phone users, dialled free",
      value: 250000,
      color: c[0],
      detail: "The manifesto in Kikamba, volunteer registration and ward captain lookup, at no cost to the voter.",
    },
    {
      label: "Mobile-money agents",
      sub: "Monthly interactions at kiosks",
      value: 180000,
      color: c[0],
      detail: "Regulated financial infrastructure — any commercial arrangement needs campaign counsel before recruitment, and the kiosk counts still need a source.",
    },
  ];

  return (
    <Figure
      kicker="The offline infrastructure"
      title="Radio reaches more people than every screen in the county, five times over"
      standfirst="Maximum reachable voters per channel, against a register of 532,758. Digital's ceiling — roughly 72,000 — would not appear on this scale."
      source="GeoPoll / KARF listenership (Tier 2) · KNBS 2019 Census and CA subscriptions (Tier 1) · reach is capacity, not delivery"
      table={{
        head: ["Channel", "Reachable voters", "% of register"],
        rows: [
          ["Kikamba vernacular radio", "~420,000", "78.8%"],
          ["Church and faith networks", "~350,000", "65.7%"],
          ["Direct 2G SMS", "~320,000", "60.1%"],
          ["Open-air market barazas", "~280,000", "52.6%"],
          ["Zero-rated USSD service", "~250,000", "46.9%"],
          ["Mobile-money agents", "~180,000", "33.8%"],
          ["All digital platforms combined", "~72,000", "13.6%"],
        ],
      }}
    >
      <Bars data={data} max={460000} />
    </Figure>
  );
}
