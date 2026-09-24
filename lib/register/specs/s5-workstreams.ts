/**
 * Section 5.2, the workstreams: three process figures that replace the last ASCII diagrams in the
 * content (brief §D.4). Not in the §N register; built on the same frame so they keep its table,
 * CSV and print behaviour.
 */
import type { FigureSpec } from "../types.ts";

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
  { lane: "Digital", title: "Log the outcome", body: "Support, undecided or oppose, synced when signal returns." },
  { lane: "Digital", title: "Update the score", body: "The voter score moves (Section 5.2.4.2)." },
  { lane: "Digital", title: "Re-segment within 24 hours", body: "Ad audiences and SMS lists; committed opponents are removed from paid targeting." },
  { lane: "Field", title: "Route the highest-value doors", body: "Warm leads go to the champion's phone as priority doors, with the issue each household engaged with." },
];

export const FIG_FIELD_LOOP: FigureSpec = {
  id: "fig-5-2-3-field-loop",
  section: "5.2.3.2",
  title: "The doorstep and the ad audience update each other within a day",
  question: "How do the field and digital operations learn from each other?",
  takeaway: "A field validation match rate of at least 85% keeps both sides honest: if the model and the doorstep disagree, the model is wrong.",
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
  sources: [PROPOSAL, { name: "Shortcode: [Insert shortcode] at contracting", tier: null, state: "needed" }],
  chart: { type: "mock", header: "KITUI NA MULU · *[shortcode]#", fields: MENU },
  notes: [
    "Menu labels in Kikamba are pending the Kikamba reviewer's sign-off (Section 5.9.3).",
    "The Section 5.7.8 charter requires a data opt-out the voter can reach from the menu; its position is set when the shortcode is provisioned.",
  ],
  columns: [{ key: "n", label: "Option", numeric: true }, { key: "kikamba", label: "Kikamba" }, { key: "english", label: "English" }, { key: "does", label: "What it does" }],
  rows: MENU.map((m) => ({ cells: { n: m.n, kikamba: m.label, english: m.shown, does: m.issue } })),
};

export const S5_WS: FigureSpec[] = [FIG_TRACKER_FLOW, FIG_FIELD_LOOP, FIG_USSD_MENU];
