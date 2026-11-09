/**
 * The task templates Command starts from. Editable: these are defaults, and the team's edited
 * copies live in the database (net_templates). Each links to one of the five objectives already on
 * the site, by number; the objectives themselves are read from lib/register/specs/s1-objectives.ts
 * and never restated here.
 */
import type { Template } from "./types.ts";

type Default = Omit<Template, "updated_at">;

export const DEFAULT_TEMPLATES: Default[] = [
  {
    id: "household-visits",
    name: "Household visits",
    title: "Household visits in your village",
    instructions: "Visit households in your village. Introduce yourself as a volunteer for Dr. Makali, listen to what matters to each household, and leave the ward brief where it is welcome. Leave any home that asks you to.",
    evidence: "Number of households visited, and the main issue raised.",
    objective: "1",
  },
  {
    id: "event-mobilisation",
    name: "Event mobilisation",
    title: "Tell your village about the meeting",
    instructions: "Share the date, time and place of the public meeting with households and groups in your village. Arrange to walk with anyone who needs help reaching it.",
    evidence: "Number of people told, and how many say they will attend.",
    objective: "2",
  },
  {
    id: "community-issue",
    name: "Community issue report",
    title: "Report the issue your village raises most",
    instructions: "Record the issue people in your village raise most this week, in their words, and where it is felt most.",
    evidence: "The issue, its category, and the place.",
    objective: "4",
  },
  {
    id: "registration-awareness",
    name: "Voter-registration awareness",
    title: "Share where and when to register",
    instructions: "Tell eligible adults in your village where and when IEBC registration runs, and what they need to bring. Point them to IEBC; do not handle anyone's documents.",
    evidence: "Number of people told.",
    objective: "3",
  },
  {
    id: "volunteer-recruitment",
    name: "Volunteer recruitment",
    title: "Find a second campaigner for your village",
    instructions: "Find someone in your village willing to serve as a campaigner. Explain the role and the declaration, and pass their interest to your ward coordinator, who registers them with their consent.",
    evidence: "Name of the person interested, passed to your ward coordinator.",
    objective: "1",
  },
  {
    id: "rumour-report",
    name: "Rumour report",
    title: "Report a rumour about Dr. Makali",
    instructions: "When you hear a rumour or false claim about Dr. Makali, report what was said, where, and how widely it is repeated. Do not argue it in public; the campaign answers through its own channels.",
    evidence: "What was said, where, and how widely.",
    objective: "5",
  },
  {
    id: "agent-identification",
    name: "Polling-day agent identification",
    title: "Identify people willing to serve as agents",
    instructions: "Identify trusted people in your village who are willing to be trained as polling-day agents. Pass their interest to your ward coordinator; agents are appointed and trained by Command under IEBC rules.",
    evidence: "Number of people willing, passed to your ward coordinator.",
    objective: "5",
  },
];
