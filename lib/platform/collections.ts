/**
 * The campaign's working records: what Dr. Mulu's team enters day to day to run the campaign
 * through the platform. Each collection replaces a duty the proposal used to give Firefly
 * (docs/ownership-2026-11/PHASE-1-2-REPORT.md, the task-to-function map, T1–T32).
 *
 * These live in the platform's database (Supabase), not in the data pack: they change daily and
 * appear on the public site on the next page load, with no deploy. The data pack (figures,
 * register, datasets, strategy lists) is edited separately and goes through `npm run verify`.
 *
 * Every field is a dimension the proposal already names (a ward, a pillar, a content type, a
 * segment, a severity tier, a KPI, a workstream, a phase). Option lists are read from the data
 * pack, never typed here, so a pillar renamed in the data pack is renamed in every form.
 *
 * NOTHING PERSONAL. The site is open to anyone with the link, so no collection has a field for a
 * supporter's name, phone number or ID. Supporter and voter records stay in the campaign's own
 * systems; the platform holds counts.
 *
 * This file is pure (no server code), so the forms and the server validate with the same rules.
 */

export type OptionSource =
  | "wards"
  | "constituencies"
  | "pillars"
  | "contentTypes"
  | "segments"
  | "contenders"
  | "severity"
  | "kpis"
  | "strategies"
  | "phases"
  | "meetings";

export type FieldType = "text" | "longtext" | "number" | "date" | "select" | "multiselect" | "boolean" | "url";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Fixed choices, for a dimension the proposal states in words (a status, a rail). */
  options?: readonly string[];
  /** Choices read from the data pack at request time. */
  source?: OptionSource;
  min?: number;
  max?: number;
  maxLength?: number;
  hint?: string;
  /** Shown as a column in the list view. */
  list?: boolean;
}

export interface Collection {
  id: string;
  label: string;
  /** One line: what the team uses it for. */
  purpose: string;
  /** The Firefly duty it replaces, as the task-to-function map numbers it. */
  replaces: string;
  group: "Direct the team" | "Run the channels" | "Measure" | "Protect" | "Deliver";
  fields: Field[];
  /** The field a record is titled by in lists and history. */
  titleField: string;
  /** Rules across fields. Each returns a plain-language message, or null. */
  rules?: ((r: Record<string, unknown>) => string | null)[];
}

const STATUS = ["Planned", "In progress", "Live", "Paused", "Done"] as const;
const LANGUAGES = ["Kikamba", "Kiswahili", "English"] as const;
const CHANNELS = ["Facebook", "X", "Instagram", "TikTok", "YouTube", "WhatsApp", "Radio", "SMS", "USSD", "Voice", "Ground", "Press"] as const;
const RAILS = ["SMS", "USSD", "WhatsApp", "Voice"] as const;

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const daysBetween = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86_400_000;

export const COLLECTIONS: Collection[] = [
  {
    id: "implementation",
    label: "Implementation",
    purpose: "How each strategy is being carried out: who owns it, on which channel, and where it stands.",
    replaces: "T17, T18, T24, T25, T30: targeting plans, field templates, training, the security baseline, the nomination sprint",
    group: "Deliver",
    titleField: "action",
    fields: [
      { key: "strategy", label: "Strategy", type: "select", source: "strategies", required: true, list: true },
      { key: "action", label: "What is being done", type: "text", required: true, maxLength: 160, list: true },
      { key: "owner", label: "Owner (role)", type: "text", required: true, maxLength: 80, list: true, hint: "A role, such as Content Lead. Not a supporter's name." },
      { key: "channel", label: "Channel", type: "select", options: CHANNELS, list: true },
      { key: "phase", label: "Phase", type: "select", source: "phases", list: true },
      { key: "status", label: "Status", type: "select", options: STATUS, required: true, list: true },
      { key: "due", label: "Due", type: "date" },
      { key: "notes", label: "Notes", type: "longtext", maxLength: 2000 },
    ],
  },
  {
    id: "briefs",
    label: "Weekly brief",
    purpose: "The one-page brief that directs the publishing team each week.",
    replaces: "T2, T3, T6, T16, T19, T29: deciding what to post and issuing the weekly brief",
    group: "Direct the team",
    titleField: "week",
    fields: [
      { key: "week", label: "Week starting", type: "date", required: true, list: true },
      { key: "pillar1", label: "Weight: first pillar (%)", type: "number", min: 0, max: 100, hint: "Pillar weights must add up to 100." },
      { key: "pillar2", label: "Weight: second pillar (%)", type: "number", min: 0, max: 100 },
      { key: "pillar3", label: "Weight: third pillar (%)", type: "number", min: 0, max: 100 },
      { key: "mustPost", label: "The posts that must happen, and the ward each is for", type: "longtext", required: true, maxLength: 1000 },
      { key: "wardPriority", label: "Priority wards", type: "multiselect", source: "wards", list: true },
      { key: "languageRule", label: "Language rule", type: "text", maxLength: 200, list: true },
      { key: "stopOne", label: "One thing to stop", type: "text", maxLength: 200 },
      { key: "accessibility", label: "Accessibility standard applied (captions, plain language, audio)", type: "boolean" },
      { key: "status", label: "Status", type: "select", options: ["Draft", "Issued"], required: true, list: true },
    ],
    rules: [
      (r) => {
        const w = [num(r.pillar1), num(r.pillar2), num(r.pillar3)];
        if (w.every((x) => x === null)) return null;
        const sum = w.reduce<number>((n, x) => n + (x ?? 0), 0);
        return sum === 100 ? null : `The pillar weights add up to ${sum}%. They must add up to 100%.`;
      },
    ],
  },
  {
    id: "calendar",
    label: "Content calendar",
    purpose: "Every planned post, mapped to the week's brief, assigned, approved and published.",
    replaces: "T4, T6: approving the calendar and directing the publishing team",
    group: "Direct the team",
    titleField: "item",
    fields: [
      { key: "date", label: "Publish date", type: "date", required: true, list: true },
      { key: "item", label: "Post", type: "text", required: true, maxLength: 160, list: true },
      { key: "channel", label: "Channel", type: "select", options: CHANNELS, required: true, list: true },
      { key: "pillar", label: "Pillar", type: "select", source: "pillars" },
      { key: "contentType", label: "Content type", type: "select", source: "contentTypes" },
      { key: "segment", label: "Segment", type: "select", source: "segments" },
      { key: "ward", label: "Ward it is for", type: "select", source: "wards" },
      { key: "language", label: "Language", type: "select", options: LANGUAGES, required: true, list: true },
      { key: "assignee", label: "Assigned to (role)", type: "text", maxLength: 80, list: true },
      { key: "status", label: "Status", type: "select", options: ["Draft", "Approved", "Published"], required: true, list: true },
      { key: "kikambaReviewed", label: "Reviewed by the native Kikamba speaker", type: "boolean" },
    ],
    rules: [
      (r) =>
        r.language === "Kikamba" && (r.status === "Approved" || r.status === "Published") && r.kikambaReviewed !== true
          ? "Kikamba content is approved only after the native Kikamba speaker has reviewed it. Tick the review box first."
          : null,
    ],
  },
  {
    id: "dispatch",
    label: "SMS, USSD and WhatsApp dispatch",
    purpose: "Plan and log every send on the offline layer, with the consented-list size.",
    replaces: "T7: operating the SMS, USSD and WhatsApp layer",
    group: "Run the channels",
    titleField: "purpose",
    fields: [
      { key: "date", label: "Send date", type: "date", required: true, list: true },
      { key: "sendTime", label: "Send time (24-hour, e.g. 09:30)", type: "text", maxLength: 5, hint: "Political SMS may only go out between 08:00 and 17:00 (Communications Authority guidelines, 2017)." },
      { key: "rail", label: "Rail", type: "select", options: RAILS, required: true, list: true },
      { key: "language", label: "Language", type: "select", options: LANGUAGES, required: true, list: true },
      { key: "purpose", label: "Purpose", type: "text", required: true, maxLength: 120, list: true },
      { key: "message", label: "Message text", type: "longtext", maxLength: 1000, hint: "SMS is limited to 160 characters." },
      { key: "segment", label: "Segment", type: "select", source: "segments" },
      { key: "wards", label: "Wards", type: "multiselect", source: "wards" },
      { key: "lodgedOn", label: "Lodged with the operator on", type: "date", hint: "Political SMS must be lodged at least 48 hours before sending." },
      { key: "recipients", label: "Recipients (consented contacts)", type: "number", min: 0, list: true },
      { key: "status", label: "Status", type: "select", options: ["Planned", "Sent"], required: true, list: true },
    ],
    rules: [
      (r) =>
        r.rail === "SMS" && r.language === "Kikamba"
          ? "Bulk political SMS cannot be sent in Kikamba: the CA/NCIC guidelines restrict political SMS to English or Kiswahili. Use the WhatsApp line or a voice note for Kikamba."
          : null,
      (r) => {
        const time = str(r.sendTime).trim();
        if (r.rail !== "SMS" || !time) return null;
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return "Enter the send time as 24-hour HH:MM, for example 09:30.";
        return time < "08:00" || time > "17:00" ? "Political SMS may only go out between 08:00 and 17:00." : null;
      },
      (r) => (r.rail === "SMS" && str(r.message).length > 160 ? `The SMS is ${str(r.message).length} characters. It must be 160 or fewer.` : null),
      (r) => {
        if (r.rail !== "SMS") return null;
        if (!str(r.lodgedOn)) return "Political SMS must be lodged with the mobile operator first. Enter the date it was lodged.";
        return daysBetween(str(r.lodgedOn), str(r.date)) < 2 ? "Political SMS must be lodged with the operator at least 48 hours before the send date." : null;
      },
    ],
  },
  {
    id: "kpi-actuals",
    label: "KPI tracker",
    purpose: "The measured value of each indicator, period by period, against its target.",
    replaces: "T5, T9, T10, T20, T21, T23: the mid-week number, performance reports, attribution",
    group: "Measure",
    titleField: "kpi",
    fields: [
      { key: "kpi", label: "Indicator", type: "select", source: "kpis", required: true, list: true },
      { key: "periodEnding", label: "Period ending", type: "date", required: true, list: true },
      { key: "value", label: "Measured value", type: "number", required: true, list: true },
      { key: "method", label: "Where the number came from", type: "text", required: true, maxLength: 200, hint: "The export or log it was read from, such as Meta Insights." },
      { key: "note", label: "Note", type: "longtext", maxLength: 1000 },
    ],
  },
  {
    id: "channel-audit",
    label: "Channel audit",
    purpose: "Reach on his own channels by constituency, language and format, from the platform exports.",
    replaces: "T1, T9: the channel audit and the monthly presence-audit refresh",
    group: "Measure",
    titleField: "channel",
    fields: [
      { key: "periodEnding", label: "Period ending", type: "date", required: true, list: true },
      { key: "channel", label: "Channel", type: "select", options: CHANNELS, required: true, list: true },
      { key: "constituency", label: "Constituency", type: "select", source: "constituencies", required: true, list: true },
      { key: "language", label: "Language", type: "select", options: LANGUAGES, list: true },
      { key: "format", label: "Format", type: "select", source: "contentTypes" },
      { key: "reach", label: "Reach", type: "number", min: 0, required: true, list: true },
      { key: "source", label: "Export it was read from", type: "text", required: true, maxLength: 200 },
    ],
  },
  {
    id: "tests",
    label: "Creative tests",
    purpose: "Design a test, run the variants, read the result and record the decision.",
    replaces: "T8: designing and reading the creative test cycle",
    group: "Measure",
    titleField: "name",
    fields: [
      { key: "name", label: "Test", type: "text", required: true, maxLength: 120, list: true },
      { key: "hypothesis", label: "Hypothesis", type: "longtext", required: true, maxLength: 600 },
      { key: "channel", label: "Channel", type: "select", options: CHANNELS, list: true },
      { key: "variants", label: "Variants", type: "longtext", maxLength: 1000 },
      { key: "start", label: "Start", type: "date", list: true },
      { key: "end", label: "End", type: "date" },
      { key: "result", label: "Result", type: "longtext", maxLength: 1000 },
      { key: "decision", label: "Decision taken", type: "text", maxLength: 240 },
      { key: "status", label: "Status", type: "select", options: ["Designed", "Running", "Read"], required: true, list: true },
    ],
    rules: [(r) => (str(r.start) && str(r.end) && daysBetween(str(r.start), str(r.end)) < 0 ? "The test cannot end before it starts." : null)],
  },
  {
    id: "field",
    label: "Field and sentiment",
    purpose: "What the wards are saying, from coordinators, radio call-ins and community groups.",
    replaces: "T11, T18: the sentiment report and the field-to-digital loop",
    group: "Measure",
    titleField: "issue",
    fields: [
      { key: "date", label: "Date", type: "date", required: true, list: true },
      { key: "ward", label: "Ward", type: "select", source: "wards", required: true, list: true },
      { key: "issue", label: "Issue raised", type: "text", required: true, maxLength: 160, list: true },
      { key: "reportedVia", label: "Reported via", type: "select", options: ["Ward coordinator", "Radio call-in", "WhatsApp group", "Baraza", "USSD line"], list: true },
      { key: "sentiment", label: "Sentiment", type: "select", options: ["Positive", "Mixed", "Negative"], list: true },
      { key: "note", label: "Note", type: "longtext", maxLength: 1000, hint: "Aggregate only. Do not record who said it." },
    ],
  },
  {
    id: "competitors",
    label: "Competitor watch",
    purpose: "Public activity by the other contenders, from public sources only.",
    replaces: "T12: the monthly competitive brief",
    group: "Measure",
    titleField: "activity",
    fields: [
      { key: "date", label: "Date", type: "date", required: true, list: true },
      { key: "contender", label: "Contender", type: "select", source: "contenders", required: true, list: true },
      { key: "channel", label: "Channel", type: "select", options: CHANNELS, list: true },
      { key: "activity", label: "What they did", type: "text", required: true, maxLength: 200, list: true },
      { key: "sourceLink", label: "Public source", type: "url", required: true },
      { key: "response", label: "Our response, if any", type: "longtext", maxLength: 800 },
    ],
  },
  {
    id: "incidents",
    label: "Rapid response",
    purpose: "Every attack or false claim: its severity, who drafted the response, who approved it.",
    replaces: "T13, T14: drafting rapid responses and running the red-team drill",
    group: "Protect",
    titleField: "summary",
    fields: [
      { key: "opened", label: "Opened", type: "date", required: true, list: true },
      { key: "severity", label: "Severity tier", type: "select", source: "severity", required: true, list: true },
      { key: "summary", label: "What happened", type: "text", required: true, maxLength: 200, list: true },
      { key: "draftedBy", label: "Response drafted by (role)", type: "text", maxLength: 80 },
      { key: "approvedBy", label: "Approved by (role)", type: "text", maxLength: 80 },
      { key: "status", label: "Status", type: "select", options: ["Open", "Responded", "Closed"], required: true, list: true },
      { key: "drill", label: "This is a red-team drill", type: "boolean", list: true },
      { key: "afterAction", label: "After-action note", type: "longtext", maxLength: 2000 },
    ],
    rules: [(r) => (r.status === "Responded" && !str(r.approvedBy) ? "A response is marked sent only once someone has approved it. Enter who approved it." : null)],
  },
  {
    id: "projects",
    label: "Service-delivery tracker",
    purpose: "Verification status for the county's itemised projects, ward by ward.",
    replaces: "T15: operating the service-delivery tracker",
    group: "Deliver",
    titleField: "project",
    fields: [
      { key: "project", label: "Project id (from the register)", type: "text", required: true, maxLength: 80, list: true, hint: "As shown in the data explorer, such as Agriculture-1." },
      { key: "verified", label: "Verification", type: "select", options: ["Not yet visited", "Seen complete", "Seen incomplete", "Not found"], required: true, list: true },
      { key: "visited", label: "Visited on", type: "date", list: true },
      { key: "evidence", label: "Public evidence link", type: "url" },
      { key: "note", label: "Note", type: "longtext", maxLength: 1000 },
    ],
  },
  {
    id: "cadence",
    label: "Meetings and decisions",
    purpose: "The meeting rhythm, and what each meeting decided.",
    replaces: "T26: stand-ups, the strategy sync and the monthly reviews",
    group: "Direct the team",
    titleField: "meeting",
    fields: [
      { key: "date", label: "Date", type: "date", required: true, list: true },
      { key: "meeting", label: "Meeting", type: "select", source: "meetings", required: true, list: true },
      { key: "chair", label: "Chaired by (role)", type: "text", maxLength: 80, list: true },
      { key: "decisions", label: "Decisions", type: "longtext", required: true, maxLength: 2000 },
    ],
  },
];

export const COLLECTION_BY_ID: Record<string, Collection> = Object.fromEntries(COLLECTIONS.map((c) => [c.id, c]));

export const GROUPS = ["Direct the team", "Run the channels", "Measure", "Protect", "Deliver"] as const;
