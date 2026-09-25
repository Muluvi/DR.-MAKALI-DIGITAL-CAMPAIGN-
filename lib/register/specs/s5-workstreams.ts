/**
 * Section 5.2, the workstreams: three process figures that replace the last ASCII diagrams in the
 * content (brief §D.4). Not in the §N register; built on the same frame so they keep its table,
 * CSV and print behaviour.
 */
import type { FigureSpec } from "../types.ts";
import { fmt } from "./_util.ts";

const PROPOSAL = { name: "This proposal, Section 5.2", tier: null, state: "target" as const };

const REPORT = [
  ["Report submitted", "By USSD, SMS, WhatsApp, the web form, or in person through a ward champion."],
  ["Logged", "With ward, category, date and a reference number."],
  ["Confirmed to the reporter", "An SMS with the reference number."],
  ["Published", "To the public register, aggregated, with no personal data."],
  ["Followed up", "Raised with the relevant authority, or verified through the ward champion network."],
  ["Outcome published", "Against the original report, including when it is not resolved."],
  ["Reporter notified", "By SMS."],
];

export const FIG_TRACKER_FLOW: FigureSpec = {
  id: "fig-5-2-1-report-flow",
  section: "5.2.1.1",
  title: "Every report ends in a published outcome, and the reporter hears back twice",
  question: "What happens to a report in the service-delivery tracker?",
  takeaway: "The register shows what was reported, what was raised and what happened, failures included.",
  sources: [PROPOSAL],
  chart: { type: "steps", steps: REPORT.map(([title, body], i) => ({ when: `Step ${i + 1}`, title, body })) },
  columns: [{ key: "step", label: "Step", numeric: true }, { key: "what", label: "What happens" }, { key: "detail", label: "Detail" }],
  rows: REPORT.map(([title, body], i) => ({ cells: { step: i + 1, what: title, detail: body } })),
};

const LOOP = [
  { lane: "Field", title: "Canvass", body: "A ward champion canvasses a household: four options, under thirty seconds." },
  { lane: "Digital", title: "Log the contact", body: "Opted in, reached without opt-in, asked not to be contacted, or no one home, synced when signal returns. Never how anyone will vote." },
  { lane: "Digital", title: "Update the lists", body: "Contactability updates the SMS and routing lists (Section 5.2.4.2)." },
  { lane: "Digital", title: "Re-segment within 24 hours", body: "Ad audiences and SMS lists; households that asked not to be contacted are removed." },
  { lane: "Field", title: "Route the highest-value doors", body: "Warm leads go to the champion's phone as priority doors, with the issue each household engaged with." },
];

export const FIG_FIELD_LOOP: FigureSpec = {
  id: "fig-5-2-3-field-loop",
  section: "5.2.3.2",
  title: "The doorstep and the ad audience update each other within a day",
  question: "How do the field and digital operations learn from each other?",
  takeaway: "The opt-in rate on routed doors keeps both sides honest: if routed doors do no better than the rest, the routing is wrong.",
  sources: [PROPOSAL],
  chart: { type: "steps", horizontal: true, lanes: ["Field", "Digital"], steps: LOOP.map((l, i) => ({ ...l, when: `${i + 1}${i === LOOP.length - 1 ? " → back to 1" : ""}` })) },
  columns: [{ key: "n", label: "Step", numeric: true }, { key: "lane", label: "Side" }, { key: "what", label: "What happens" }, { key: "detail", label: "Detail" }],
  rows: LOOP.map((l, i) => ({ cells: { n: i + 1, lane: l.lane, what: l.title, detail: l.body } })),
};

const MENU = [
  { n: 1, label: "Sisemo sya Mulu", shown: "Mulu's plan for my ward", issue: "His plan, ward by ward." },
  { n: 2, label: "Andikithya kuvota", shown: "Voter registration info", issue: "Where and how to register." },
  { n: 3, label: "Ripoti wia", shown: "Report a local issue", issue: "Opens a report in the service-delivery tracker (Section 5.2.1.1): the option that matters most." },
  { n: 4, label: "Kuthukuma", shown: "Volunteer", issue: "Joins the volunteer list." },
  { n: 5, label: "Kwithukiisya", shown: "Get updates (opt-in)", issue: "Consent to the SMS list." },
  { n: 6, label: "Kiswahili / English", shown: "Language", issue: "Switches the menu language." },
];

export const FIG_USSD_MENU: FigureSpec = {
  id: "fig-5-2-3-ussd-menu",
  section: "5.2.3.3",
  title: "Six options on any phone, and the third puts the tracker in reach of a feature phone in Mutha",
  question: "What does the USSD menu offer?",
  takeaway: "Dial the shortcode, read the plan, register, report an issue, volunteer or opt in, with no internet and close to no cost.",
  sources: [PROPOSAL],
  chart: { type: "mock", header: "KITUI NA MULU · the campaign shortcode", fields: MENU },
  notes: [
    "Menu labels in Kikamba are pending the Kikamba reviewer's sign-off (Section 5.9.3).",
    "The Section 5.7.8 charter requires a data opt-out the voter can reach from the menu; its position is set when the shortcode is provisioned.",
  ],
  columns: [{ key: "n", label: "Option", numeric: true }, { key: "kikamba", label: "Kikamba" }, { key: "english", label: "English" }, { key: "does", label: "What it does" }],
  rows: MENU.map((m) => ({ cells: { n: m.n, kikamba: m.label, english: m.shown, does: m.issue } })),
};

/* ------------------------------------------------------------------ fig-5-2-4-stack */

/** Section 5.2.4.3's five components, one row each, every fact kept (brief §12). */
const STACK: [string, string, string, string, string, string][] = [
  [
    "1. SMS / USSD gateway",
    "Africa's Talking API Suite, or Safaricom Direct Enterprise SDP Gateway",
    "The offline engine (Section 5.2.3.3): opt-in bulk 2G SMS to registered voters across 40 wards, the zero-rated USSD menu (*[shortcode]#), and inbound field reports from the campaign-owned ward network (Section 5.1.3)",
    "Phone numbers (MSISDN), ward tags, USSD menu responses, delivery-receipt timestamps, opt-out logs",
    "HIGH: direct personal data (Section 5.2.3.4). Opt-in confirmation logs, STOP processed within 15 seconds, signed data processing agreements with the aggregator",
    "Vendor: Africa's Talking or Safaricom SDP Enterprise",
  ],
  [
    "2. Supporter CRM and voter database",
    "Custom PostgreSQL with a Hasura / Directus admin UI, or a CiviCRM instance",
    "The single source of truth for supporters (Section 5.2.4.1): profiles, 40-ward linkages, demographic classes, volunteer skills, delegate tracking, contact history",
    "Encrypted names, phone numbers (AES-256), constituency, ward and polling-station IDs, gender, age cohort, livelihood, consent timestamps, interaction logs",
    "CRITICAL: the core store of personal data. Row-level security, MFA for every operator, role-based access, daily encrypted off-site backups, audit log of every query",
    "Architecture: custom PostgreSQL or open-source CiviCRM",
  ],
  [
    "3. Publishing and listening suite",
    "Buffer / Hootsuite Enterprise to publish; Brand24 / Talkwalker to listen",
    "Scheduling across Facebook, X, Instagram, TikTok and YouTube; 24/7 monitoring of Kamba and national political keywords (\"Dr. Makali Mulu\", \"Kitui Governor 2027\", \"Kitui Central CDF\", \"Wiper Primaries\", \"Kalonzo Musyoka\"), flagging rumours, attacks and local issues in real time",
    "Public posts, comments, engagement metrics, sentiment scores, influencer handles, public reach",
    "LOW TO MODERATE: public posts and aggregated sentiment only; compliant with Section 5.2.3.4 provided no profile is scraped or merged into voter records without consent",
    "The software subscription",
  ],
  [
    "4. Analytics dashboard",
    "Metabase Open Source, self-hosted on private cloud, or Apache Superset",
    `Real-time dashboards for the Campaign Manager and Dr. Mulu: progress to the ${fmt("benchmark")} threshold across all 40 wards, SMS delivery rates, daily field reports, effort per ward`,
    "Aggregated, anonymised statistics: voter counts, ward completion percentages, reach cross-tabulations; no raw unencrypted personal data shown",
    "MINIMAL: aggregated, anonymised views only, restricted to authorised war-room IP addresses via VPN and MFA",
    "The hosting environment",
  ],
  [
    "5. Public service-delivery tracker",
    "Next.js web platform with an interactive GIS ward map, on Vercel / Cloudflare edge hosting",
    "The public evidence engine: 13 years of Kitui Central NG-CDF project records (schools, boreholes, dispensaries, bursary audits) and a \"Kitui Economic Blueprint\" where citizens track proposed ward investments for the 2027–2032 term",
    "Public infrastructure records, project GPS coordinates, photos and video, completion certificates, public feedback forms",
    "LOW: public government and policy data; feedback forms collect consented contact details under an explicit privacy policy",
    "Design mockups and public domain registration",
  ],
];

export const FIG_STACK: FigureSpec = {
  id: "fig-5-2-4-stack",
  section: "5.2.4.3",
  title: "Five components, and the personal data concentrates in the first two",
  question: "What does each component of the stack do, hold and risk?",
  takeaway: "The gateway and the CRM carry the high and critical data-protection exposure; the other three work on public or anonymised data, and every one awaits a campaign decision.",
  sources: [{ name: "This proposal, Section 5.2.4.3", tier: null, state: "target" }],
  chart: {
    type: "cards",
    columns: 2,
    cards: STACK.map(([component, tool, does, holds, exposure, decision]) => {
      const [level, ...rest] = exposure.split(": ");
      return {
        kicker: `DPA 2019 exposure · ${level}`,
        title: component,
        body: `Tool: ${tool}. Does: ${does}. Holds: ${holds}. Safeguards: ${rest.join(": ")}.`,
        meta: `Awaiting campaign decision: ${decision}`,
        tone: level === "HIGH" || level === "CRITICAL" ? ("accent" as const) : undefined,
      };
    }),
  },
  columns: [
    { key: "component", label: "Component" }, { key: "tool", label: "Recommended tool" }, { key: "does", label: "What it does" },
    { key: "holds", label: "Data it holds" }, { key: "exposure", label: "DPA 2019 exposure" }, { key: "decision", label: "Decision awaited" },
  ],
  rows: STACK.map(([component, tool, does, holds, exposure, decision]) => ({ cells: { component, tool, does, holds, exposure, decision } })),
};

export const S5_WS: FigureSpec[] = [FIG_TRACKER_FLOW, FIG_FIELD_LOOP, FIG_USSD_MENU, FIG_STACK];
