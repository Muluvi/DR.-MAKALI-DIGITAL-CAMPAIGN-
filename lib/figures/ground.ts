/**
 * §5.2.3.1 — the loop between what the field hears and what the campaign says back.
 *
 * WHAT THESE REPLACE. Five box-drawing blocks: a closed-loop engine diagram, a ward-coordinator
 * reporting protocol, a four-hour timeline, an empty banner, and an operating rhythm the size of a
 * page.
 *
 * THE FOUR-HOUR CYCLE IS THE CLAIM THIS CHAPTER RESTS ON, and it is the one thing the ASCII did
 * well: a running clock down the left margin, so a reader could see that the whole loop — ground
 * report, triage, three assets produced in three languages, geofenced deployment — fits inside a
 * morning. The figure keeps the clock for that reason, as a monospaced offset in front of each
 * stage rather than a label beside it.
 *
 * ONE NUMBER IN IT IS WORTH READING TWICE. The T+04:00 row pushes bulk SMS to "14,000 consented
 * voters in Tseikuru/Kyuso" — consented, at a moment when §5.6's KPI ladder is still building
 * towards 120,000 by Phase 3. It is transcribed as stated; whether the list exists yet is §5.6's
 * question, not this figure's.
 */
import type { FigureSeries } from "./types";

/* ------------------------------------------------------------------ §5.2.3.1 the loop */

export const FIELD_LOOP_TIERS = [
  {
    label: "Inbound intelligence pipeline",
    items: [
      "40 ward coordinators",
      "400 ward captains",
      "Market day pulse reports",
      "Competitor tracking logs",
    ],
  },
  {
    label: "Outbound amplification pipeline",
    items: [
      "Targeted Meta & TikTok video",
      "Kikamba radio ads and jingles",
      "Localised direct 2G SMS",
      "WhatsApp audio bulletins",
    ],
  },
  {
    label: "War room synchronisation hub",
    items: [
      "Incident classification (tiers 1–3) and narrative response",
      "Rapid-response message production and fact-checking",
      "Micro-geofenced ad deployment (under 4-hour turnaround)",
    ],
  },
  {
    label: "Physical distribution channels",
    items: [
      "1,200 bodaboda stage champions",
      "Matatu / sacco commuter routes",
      "M-Pesa kiosk economic desks",
      "Weekly open-air market caravans",
    ],
  },
];

export const FIELD_LOOP: FigureSeries = {
  id: "field-loop",
  headline: "What a ward coordinator hears at 18:00 can be answered on air the next morning",
  measure: "§5.2.3.1's closed-loop field and digital integration engine",
  points: [],
  note:
    "It is a loop, not a funnel: the inbound pipeline feeds the war room, the war room feeds the " +
    "outbound pipeline and the physical channels, and what those produce comes back as field " +
    "intelligence. The ASCII drew that with arrows; the order and this line carry it instead.",
};

/* ------------------------------------------------------------------ §5.2.3.1 what they report */

export const FIELD_REPORTS: string[][] = [
  [
    "1. Daily Ground Pulse (DGP)",
    "Daily by 18:00 EAT",
    "Encrypted SMS / USSD tree",
    "Ward ID and polling station · dominant issue or rumour · competitor activity · opt-in supporter count",
  ],
  [
    "2. Market Day Event Audit (MEA)",
    "Weekly on market day by 16:00 EAT",
    "WhatsApp field bot / voice note dispatch",
    "Crowd size estimates · audio and video clips · leaflet distribution · local leader feedback",
  ],
  [
    "3. Critical Threat Flash (CTF)",
    "Real-time, under 30 minutes",
    "Direct phone / red-alert SMS trigger",
    "Opponent disinformation · security or clash alert · local defection risk",
  ],
  [
    "4. Weekly Ward Log & Supporter Roster",
    "Weekly, Sundays by 20:00 EAT",
    "Structured web / paper sheet ingestion",
    "Polling station grid · verified sign-up logs · delegate loyalty map",
  ],
];

export const FIELD_REPORTS_SERIES: FigureSeries = {
  id: "field-reports",
  headline: "Four report types, one of which has a thirty-minute clock on it",
  measure: "§5.2.3.1's ward coordinator field reporting protocol — type, frequency, channel and fields captured",
  points: [],
  note:
    "The Critical Threat Flash is the only one with a deadline measured in minutes, and the only " +
    "one routed to a direct phone rather than a queue. The other three are daily, weekly and " +
    "weekly, and every one names the fields it captures.",
};

/* ------------------------------------------------------------------ §5.2.3.1 the four-hour cycle */

export const FOUR_HOUR_CYCLE = [
  {
    at: "T+00:00",
    title: "Ground report ingested",
    steps: ["A ward coordinator in Tseikuru logs a competitor rumour via USSD."],
  },
  {
    at: "T+01:00",
    title: "Rapid response war room triage",
    steps: [
      "The Comms Director assesses severity and verifies facts from parliamentary records — Tier 1 proof of CDF parity.",
    ],
  },
  {
    at: "T+02:30",
    title: "Content asset creation",
    steps: [
      "30-second Kikamba video for TikTok and Facebook.",
      "45-second audio note voiced by Dr. Mulu or a respected elder.",
      "160-character localised Kiswahili SMS.",
    ],
  },
  {
    at: "T+04:00",
    title: "Synchronised multi-channel deployment",
    steps: [
      "Meta and TikTok ads geofenced strictly to Mwingi North.",
      "Bulk SMS pushed to 14,000 consented voters in Tseikuru / Kyuso.",
      "Audio note pushed via WhatsApp to 40 ward captains for peer forwarding at local tea kiosks and bodaboda stages.",
      "Talking point faxed or messaged to Musyi FM morning show panellists.",
    ],
  },
];

export const CYCLE_SERIES: FigureSeries = {
  id: "four-hour-cycle",
  headline: "A rumour logged by USSD is answered in three languages across four channels inside four hours",
  measure: "§5.2.3.1's ground-to-digital cycle, on the clock",
  points: [],
  note:
    "The clock is the claim, so it runs down the margin rather than sitting in a caption. The " +
    "SMS step names 14,000 consented voters in Tseikuru and Kyuso; it is transcribed as stated, " +
    "and whether that list exists yet is §5.6's KPI ladder to answer, not this figure's.",
};

/* ------------------------------------------------------------------ §5.2.3.1 the operating rhythm */

export const OPERATING_RHYTHM: string[][] = [
  [
    "Daily · 07:00–07:30",
    "Morning radio & rapid response triage",
    "Review morning radio bulletins and overnight social trends; assign rapid responses",
    "Communications Lead",
    "Digital team, media monitor, legal advisor",
  ],
  [
    "Daily · 18:00–18:45",
    "Daily field pulse ingestion",
    "Aggregate 40 ward coordinator reports, flag hot-spots, evaluate SMS quotas",
    "Field Operations Director",
    "8 constituency coordinators, data analyst",
  ],
  [
    "Weekly · Monday 09:00–11:30",
    "Strategic command war room",
    "Review the week's KPI dashboard (Section 5.6.8), approve the weekly radio and digital ad spend, set the tour route",
    "Campaign Manager / Dr. Makali Mulu",
    "Candidate, all departmental directors",
  ],
  [
    "Weekly · Thursday 16:00–17:00",
    "Market day logistics briefing",
    "Finalise weekend caravan routes, collateral dispatch, sound truck maintenance",
    "Ground Logistics Lead",
    "Caravan teams, sound ops, security team",
  ],
  [
    "Weekly · Sunday 17:00–18:00",
    "Faith & community review",
    "Review Sunday church visits, clergy synod feedback, prayer network alignment",
    "Religious Affairs Director",
    "Church liaison officers",
  ],
  [
    "Monthly · 1st Saturday 10:00–14:00",
    "All-wards field leadership baraza",
    "In-person strategic review, voter sign-up audit, training and stipend disbursement",
    "Campaign Manager",
    "40 ward coordinators, 8 constituency leads, DPO",
  ],
  [
    "Monthly · last day of month",
    "Audited budget & provenance review",
    "Reconciliation of ad spend against voter acquisition cost; DPA compliance audit",
    "Finance Director & Analytics Director",
    "Candidate, compliance DPO",
  ],
];

export const RHYTHM_SERIES: FigureSeries = {
  id: "operating-rhythm",
  headline: "Seven standing forums, and the candidate is named in three of them",
  measure: "§5.2.3.1's campaign operational rhythm and governance cadence — time, forum, agenda, owner and participants",
  points: [],
  note:
    "The cadence is repeated on every row rather than merged down a column. A merged cell is a " +
    "thing a screen reader reads once and a stacked phone layout loses entirely, and the cost of " +
    "repeating it is two words.",
};
