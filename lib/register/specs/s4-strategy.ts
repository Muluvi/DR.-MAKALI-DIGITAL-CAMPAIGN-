/**
 * Section 4, The Strategy: the position, the effort, the segments, the message by region, the
 * calendar, the channel shift, the six fixes and the decision rules.
 */
import { RADIO_STATIONS } from "../../../data/media-ownership.ts";
import type { FigureSpec } from "../types.ts";
import { fmt, num, src } from "./_util.ts";

const T_FIREFLY = { name: "Firefly's weighting, this proposal", tier: null, state: "target" as const };

/* ------------------------------------------------------------------ fig-4-1-message-house */

export const FIG_4_1: FigureSpec = {
  id: "fig-4-1-message-house",
  section: "4.1",
  title: "One position, four pillars that argue it, and a record that holds it up",
  question: "What is the position, and what holds it up?",
  takeaway: "Every message rests on something already on the public record; none rests on a promise alone.",
  sources: [src("record.bursary.recipients"), { name: "Parliament of Kenya record; NG-CDF Board evaluation FY2014/15; Ministry of Finance designation", tier: "T1" }],
  chart: {
    type: "house",
    roof: "Dr. Makali Mulu is the Economist Governor Kitui needs: an expert who shows his working and enforces accountability.",
    pillars: [
      { title: "Fiscal accountability and devolution", body: `How the county's KSh ${fmt("budget.total", "bn")}bn should be allocated and audited, ward by ward.` },
      { title: "Data-driven civic engagement", body: "His record made visible: projects, maps, before and after." },
      { title: "Policy, translated", body: "Water, farming and devolution made local, in Kikamba and Kiswahili." },
      { title: "Verification and follow-through", body: "Publish what was promised, then publish whether it happened." },
    ],
    foundation: [
      "PhD in Economics, Kenyatta University",
      "Budget and Appropriations Committee",
      `KSh ${fmt("record.bursary.ksh", "m")}m in bursaries to ${fmt("record.bursary.recipients")} students`,
      "Best-evaluated constituency, Eastern region, FY2014/15",
      "M&E Champion, Ministry of Finance; Evaluation Society of Kenya",
      "Thirteen years as MP for Kitui Central",
    ],
  },
  columns: [{ key: "level", label: "Level" }, { key: "text", label: "Content" }],
  rows: [
    { cells: { level: "Roof: the position", text: "The Economist Governor Kitui needs" } },
    { cells: { level: "Pillar", text: "Fiscal accountability and devolution" } },
    { cells: { level: "Pillar", text: "Data-driven civic engagement" } },
    { cells: { level: "Pillar", text: "Policy, translated into what it changes" } },
    { cells: { level: "Pillar", text: "Verification and follow-through" } },
    { cells: { level: "Foundation", text: "PhD in Economics (T1)" } },
    { cells: { level: "Foundation", text: "Budget and Appropriations Committee (T1)" } },
    { cells: { level: "Foundation", text: `Bursaries: ${fmt("record.bursary.recipients")} students, KSh ${fmt("record.bursary.ksh", "m")}m (T1)` } },
    { cells: { level: "Foundation", text: "Best-evaluated constituency, Eastern region, FY2014/15 (T1)" } },
    { cells: { level: "Foundation", text: "M&E Champion; Evaluation Society of Kenya (T1)" } },
  ],
};

/* ------------------------------------------------------------------ fig-4-2-effort */

const ZONE_ROWS = [["anchor", "Anchor (Central/West)"], ["mwingi", "Mwingi block"], ["arid", "Arid and resource belt"], ["rotating", "Rotating / testing"]] as const;
const PHASES = [["p-1", "Phase −1 (nomination)"], ["p12", "Phases 1–2"], ["p3", "Phase 3 (GOTV)"]] as const;

export const FIG_4_2: FigureSpec = {
  id: "fig-4-2-effort",
  section: "4.2",
  title: `In Phase −1, ${num("effort.p-1.mwingi") + num("effort.p-1.arid")}% of the effort goes to Mwingi and the arid belt, well above their share of residents`,
  question: "Where does the effort go in Phase −1?",
  takeaway: `The weighting over-indexes on the pool on the working hypothesis that his gap there is one of recognition; ${fmt("effort.digital.pool")}% of digital reach effort is geofenced to it.`,
  sources: [T_FIREFLY, src("zone.mwingi.share")],
  chart: {
    type: "composite",
    parts: [
      { heading: "Phase −1 effort, ward by ward", chart: { type: "tilemap", layers: ["effort"], initial: "effort" } },
      {
        heading: "Share of effort by zone and phase, %",
        chart: {
          type: "heatmap",
          rowLabels: ZONE_ROWS.map(([, l]) => l),
          colLabels: PHASES.map(([, l]) => l),
          values: ZONE_ROWS.map(([z]) => PHASES.map(([p]) => num(`effort.${p}.${z}`))),
          unit: "%",
          state: "target",
        },
      },
    ],
  },
  notes: ["Firefly's weighting, not a measurement: every cell is a target, reviewed monthly against the reach data in Section 5.6."],
  columns: [{ key: "zone", label: "Zone" }, { key: "pop", label: "Share of residents, %", numeric: true }, ...PHASES.map(([p, l]) => ({ key: p, label: `${l}, %`, numeric: true }))],
  rows: ZONE_ROWS.map(([z, l]) => ({ cells: { zone: l, pop: z === "rotating" ? "—" : Math.round(num(`zone.${z}.share`) * 10) / 10, ...Object.fromEntries(PHASES.map(([p]) => [p, num(`effort.${p}.${z}`)])) }, state: "target" as const })),
};

/* ------------------------------------------------------------------ fig-4-3-segments */

const SEGMENTS = [
  { name: "Rural agrarian and smallholder baseline", size: "segment.rural.voters", pillar: "P2", lang: "Kikamba on voice; Kiswahili on SMS", channel: "WhatsApp voice note, SMS" },
  { name: "Agro-pastoralist and arid-zone livestock keepers", size: null, context: () => `${fmt("livestock.households")} livestock-farming households (2019 Census, T1); households, not voters`, closes: "voters by livelihood; not published", pillar: "P1", lang: "Kikamba on radio and USSD; Kiswahili on SMS", channel: "SMS, USSD, radio" },
  { name: "Youth, 18–35", size: "segment.youth.voters", pillar: "P3", lang: "Kiswahili and Sheng, Kikamba hooks", channel: "TikTok, Facebook" },
  { name: "Urban and peri-urban informal sector", size: "segment.urban.voters", pillar: "P3", lang: "Kiswahili", channel: "Facebook, WhatsApp" },
  { name: "Formal-sector professionals and educators", size: null, context: () => `Health workers: ${fmt("health.density.core")} core staff per 10,000 people (Countdown 2030, T2); headcounts not published`, closes: "TSC establishment for Kitui; County Public Service Board staff return", pillar: "P1", lang: "English, Kiswahili", channel: "Facebook, X, YouTube" },
  { name: "Out-of-county Kamba diaspora", size: null, context: () => `Net recent migration ${fmt("migration.net")} (2019, T1): context, not a voter count`, closes: "IEBC register by polling station, set against the migration tables", pillar: "P3", lang: "English, Kikamba", channel: "Facebook, YouTube, WhatsApp" },
];

export const FIG_4_3: FigureSpec = {
  id: "fig-4-3-segments",
  section: "4.3",
  title: "Six segments, three sized in voters from the census and three with context but no published voter count",
  question: "Who are we trying to move, and how much do they matter?",
  takeaway: "Sizes overlap and are not additive; where no source publishes a voter count, none is given.",
  sources: [src("census.rural.share"), { name: "Segment sizes: census shares applied to the 2022 register, derived", tier: "T1", state: "modelled" }],
  chart: {
    type: "matrix",
    header: ["Segment", "Size (registered voters)", "Pillar", "Language", "Lead channel"],
    rows: SEGMENTS.map((g) => ({ head: g.name, cells: [g.size ? `≈${fmt(g.size)} (modelled)` : `${g.context ? `${g.context()}. ` : ""}Voters: not published`, g.pillar, g.lang, g.channel] })),
  },
  notes: ["Priority among segments is set by the Week 1 audit (Section 5.3) and re-set at each monthly review, not chosen in advance."],
  columns: [{ key: "segment", label: "Segment" }, { key: "size", label: "Size, registered voters", numeric: true }, { key: "pillar", label: "Pillar" }, { key: "lang", label: "Language" }, { key: "channel", label: "Lead channel" }],
  rows: SEGMENTS.map((g) => ({ cells: { segment: g.name, size: g.size ? num(g.size) : "Not published", pillar: g.pillar, lang: g.lang, channel: g.channel }, state: g.size ? ("modelled" as const) : undefined })),
};

/* ------------------------------------------------------------------ fig-4-4-message-region */

export const FIG_4_4: FigureSpec = {
  id: "fig-4-4-message-region",
  section: "4.4",
  title: "Each region hears a different case for the same candidate, and Kikamba travels by voice, never by bulk SMS",
  question: "What do we say where, and in which language?",
  takeaway: "The anchor hears his record, Mwingi hears a published allocation method, the arid belt hears infrastructure; the language follows the channel.",
  sources: [{ name: "This proposal, Sections 3.7 and 4.4; political-messaging rules (Section 5.2.3.3)", tier: null, state: "target" }],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "Region by message",
        chart: {
          type: "matrix",
          header: ["Region", "Lead message", "Why it fits", "Language"],
          rows: [
            { head: "Urban and central anchor", cells: ["Track record, professional competence, national reputation", "The only zone where he starts with a structural advantage", "English and Kiswahili; Kikamba by voice"] },
            { head: "Northern block (Mwingi)", cells: ["Devolved funds distributed equitably per ward, with the allocation method published", "Where a Kitui Central MP is least known", "Kikamba on voice and radio; Kiswahili on SMS"] },
            { head: "Arid and resource belt", cells: ["Water, roads, and mineral wealth managed for local benefit", "Where the connectivity gap bites hardest", "Kikamba on radio and USSD; Kiswahili on SMS"] },
          ],
        },
      },
      {
        heading: "Language rules",
        chart: {
          type: "cards",
          columns: 2,
          cards: [
            { kicker: "Rule 1", title: "Bulk political SMS in English or Kiswahili only", body: "Kikamba travels by voice note and radio." },
            { kicker: "Rule 2", title: "No machine translation", body: "Not for Kikamba, not for Kiswahili: native-speaker review signs off every public line." },
            { kicker: "Rule 3", title: "Pan-Kamba vocabulary", body: "Natural to both Mwingi and Kitui South listeners." },
            { kicker: "Rule 4", title: "Bilingual print", body: "Kikamba on the primary spread, Kiswahili or English on the reverse." },
          ],
        },
      },
    ],
  },
  columns: [{ key: "region", label: "Region" }, { key: "message", label: "Lead message" }, { key: "language", label: "Language" }],
  rows: [
    { cells: { region: "Urban and central anchor", message: "Track record and competence", language: "English, Kiswahili; Kikamba by voice" } },
    { cells: { region: "Northern block (Mwingi)", message: "Equitable per-ward distribution, method published", language: "Kikamba by voice and radio; Kiswahili on SMS" } },
    { cells: { region: "Arid and resource belt", message: "Water, roads, mineral wealth for local benefit", language: "Kikamba by radio and USSD; Kiswahili on SMS" } },
    { cells: { region: "Rule", message: "Bulk political SMS in English or Kiswahili only", language: "—" } },
  ],
};

/* ------------------------------------------------------------------ fig-4-5-calendar */

const PILLARS = ["Where the money went", "One household", "The economist explains", "He came, and said"];
const WEEK: { day: string; pillar: 1 | 2 | 3 | 4 | null; after: string; now: string }[] = [
  { day: "Mon", pillar: 2, after: "Same photos; Kikamba caption on one family's poultry income; one figure.", now: "Church, Kitui Central; English caption." },
  { day: "Tue", pillar: 3, after: "45-second vertical clip: what the delegation asked for. Kiswahili.", now: "Delegation meeting; group photo." },
  { day: "Wed", pillar: 1, after: "What the committee released to Kitui this quarter, and whether it arrived. Kikamba voice note.", now: "Budget Committee photo." },
  { day: "Thu", pillar: 4, after: "Same photos, plus the ward, one commitment and one date; to that ward's WhatsApp and SMS list.", now: "Road inspection photos." },
  { day: "Fri", pillar: null, after: "Unchanged: not every post is a campaign asset.", now: "Funeral attendance." },
  { day: "Sat", pillar: 2, after: "One household, one income stream, one number. Kikamba.", now: "Harambee photos." },
  { day: "Sun", pillar: 1, after: "A twelve-week-old Thursday commitment, revisited: delivered, delayed or not done.", now: "Church photos." },
];

export const FIG_4_5: FigureSpec = {
  id: "fig-4-5-calendar",
  section: "4.5",
  title: "The same seven days become six briefed posts across four pillars, and Thursday's commitment returns as a Sunday check",
  question: "What gets published, and when?",
  takeaway: "Two fields on a Thursday post and a language rule change the week; who takes the photograph and who presses publish do not.",
  sources: [{ name: "His public page, as observed; checked against his actual week in Week 1", tier: "T3" }, { name: "The briefed week: this proposal", tier: null, state: "target" }],
  chart: { type: "calendar", days: WEEK, pillars: PILLARS },
  notes: ["Two rules on top: at least two of the seven originate in a pool ward, and at least four are Kikamba-first."],
  columns: [{ key: "day", label: "Day" }, { key: "pillar", label: "Pillar" }, { key: "after", label: "After" }, { key: "now", label: "Now" }],
  rows: WEEK.map((d) => ({ cells: { day: d.day, pillar: d.pillar ? `P${d.pillar} · ${PILLARS[d.pillar - 1]}` : "Unchanged", after: d.after, now: d.now } })),
};

/* ------------------------------------------------------------------ fig-4-6-channel-shift */

const CHANNELS = [["radio", "Vernacular radio"], ["sms", "SMS and USSD"], ["markets", "Caravans and barazas"], ["digital", "Digital and social"], ["church", "Church and community"]] as const;
const POSTURE = RADIO_STATIONS.map((s) => ({ name: s.name, posture: /^Priority/.test(s.posture) ? "Place" : /^Secondary/.test(s.posture) ? "Secondary" : "Monitor" }));

export const FIG_4_6: FigureSpec = {
  id: "fig-4-6-channel-shift",
  section: "4.6",
  title: `Radio's share of effort nearly doubles and digital's falls to ${fmt("channel.digital.rebalanced")}%, because digital cannot reach the number`,
  question: "How does effort move between channels?",
  takeaway: `${fmt("channel.offline.rebalanced")}% of effort goes offline; radio placement goes only to the stations Section 2.7 marks for placement.`,
  sources: [T_FIREFLY, src("reach.smartphone")],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "Share of communications effort, %",
        chart: {
          type: "slope",
          left: "Conventional pitch",
          right: "Rebalanced",
          unit: "%",
          lines: CHANNELS.map(([id, label]) => ({ label, a: num(`channel.${id}.conventional`), b: num(`channel.${id}.rebalanced`), tone: id === "radio" ? ("accent" as const) : ("neutral" as const) })),
        },
      },
      {
        heading: "Station posture, carried from Section 2.7",
        chart: { type: "matrix", header: ["Station", "Posture"], rows: POSTURE.map((p) => ({ head: p.name, cells: [p.posture] })) },
      },
    ],
  },
  notes: ["Shares of effort (production time, attention, output), not money. The conventional pitch is Firefly's characterisation, not a measured campaign."],
  columns: [{ key: "channel", label: "Channel" }, { key: "from", label: "Conventional, %", numeric: true }, { key: "to", label: "Rebalanced, %", numeric: true }],
  rows: CHANNELS.map(([id, label]) => ({ cells: { channel: label, from: num(`channel.${id}.conventional`), to: num(`channel.${id}.rebalanced`) }, state: "target" as const })),
};

/* ------------------------------------------------------------------ fig-4-7-profile-fixes */

const FIXES = [
  { order: 1, finding: 5, before: "Education lists Kenyatta University, but not the PhD", after: "Add the PhD in Economics (Kenyatta University, 2009–2014)" },
  { order: 2, finding: 1, before: "MP start date “Aug 2012”", after: "Correct to 2013" },
  { order: 3, finding: 2, before: "“Programmer Officer — CDTF”", after: "M&E Officer, CDTF, 1997–2004" },
  { order: 4, finding: 3, before: "“Forms of government — Economist”", after: "Economist, Ministry of Planning & Finance, 1991–1997" },
  { order: 5, finding: 4, before: "Current city: Nairobi", after: "Consider showing Kitui" },
  { order: 6, finding: 6, before: "Bio: “Incoming Governor Kitui County 2027”", after: "A deliberate messaging choice to review" },
];

export const FIG_4_7: FigureSpec = {
  id: "fig-4-7-profile-fixes",
  section: "4.7",
  title: "Six profile corrections, each minutes of work, and the missing PhD comes first",
  question: "What gets fixed first?",
  takeaway: "The doctorate is the differentiator no rival holds, and it is absent from the one field a voter checks.",
  sources: [{ name: "His public profile, as displayed; Parliament of Kenya record", tier: "T1" }],
  chart: {
    type: "cards",
    columns: 2,
    cards: FIXES.map((f) => ({ kicker: `${f.order} · finding #${f.finding} (Section 3.9)`, title: f.after, body: `Before: ${f.before}`, tone: f.order === 1 ? ("accent" as const) : undefined })),
  },
  columns: [{ key: "order", label: "Order", numeric: true }, { key: "finding", label: "Finding" }, { key: "before", label: "Before" }, { key: "after", label: "After" }],
  rows: FIXES.map((f) => ({ cells: { order: f.order, finding: `#${f.finding}`, before: f.before, after: f.after } })),
};

/* ------------------------------------------------------------------ fig-4-8-decision-rules */

const RULES = [
  { if: "follower and reach geography concentrates in Kitui Central and Nairobi", then: "the recognition thesis is confirmed; output weight shifts to Mwingi and the arid belt, headline indicator R-02" },
  { if: "reach in Mwingi is material but engagement there is flat", then: "the problem is message, not reach: the weekly creative test cycle re-cuts the message rather than buying more geofenced reach; the Section 4.2 weighting is revised" },
  { if: "Kikamba posts out-engage English by a wide margin", then: "language becomes a rule in the weekly brief" },
  { if: "video watch time collapses before ten seconds", then: "short vertical and Kikamba voice notes replace long video; the Section 5.5.3 cadence is re-cut" },
  { if: "most engagement comes from a few hundred repeat accounts", then: "priority moves from page growth to consented WhatsApp and SMS lists" },
  { if: "rivals run Meta ads while he does not", then: "part of the gap is bought reach; the ad-account question becomes urgent" },
  { if: "the presence is a personal profile, not a Page", then: "nothing can be directed against it until it migrates: settled in the first hour" },
];

export const FIG_4_8: FigureSpec = {
  id: "fig-4-8-decision-rules",
  section: "4.8",
  title: "Seven findings the Week 1 audit could return, each with the change it triggers, fixed in advance",
  question: "When does the plan change?",
  takeaway: "Stating the rules before the audit means the data cannot be read backwards into whatever was already planned.",
  sources: [{ name: "This proposal; the test runs on the Week 1 export", tier: null, state: "target" }],
  chart: { type: "decision", question: "If the Week 1 audit finds…", rules: RULES },
  columns: [{ key: "if", label: "If the audit finds" }, { key: "then", label: "The strategy changes to" }],
  rows: RULES.map((r) => ({ cells: { if: r.if, then: r.then } })),
};

export const S4: FigureSpec[] = [FIG_4_1, FIG_4_2, FIG_4_3, FIG_4_4, FIG_4_5, FIG_4_6, FIG_4_7, FIG_4_8];
