/**
 * The USSD menu for campaigners on feature phones: acknowledge a task, and send a short numeric
 * report. Gateway-neutral: `text` is the session's inputs joined by "*" (the Africa's Talking
 * convention), and the reply starts "CON" to continue or "END" to close.
 *
 * Each screen fits in 182 characters. The menu names no other person and shows no report.
 */
import { ISSUE_CATEGORIES, type TaskState } from "./types.ts";
import type { NetworkService } from "./service.ts";

const STATES: TaskState[] = ["Acknowledged", "Done", "Blocked"];
const SHORT_ISSUE = ["Water", "Food/drought", "Health", "Roads", "Jobs", "Prices", "Public money", "Security", "Other"];

export async function ussdReply(svc: NetworkService, text: string): Promise<string> {
  if (svc.actor.kind !== "person") return "END This number is not registered in the campaign network.";
  const steps = text ? text.split("*") : [];
  try {
    if (steps.length === 0) return "CON Kitui campaign network\n1. My tasks\n2. Send a report";

    if (steps[0] === "1") {
      const open = (await svc.myAssignments()).filter((x) => x.assignment.state !== "Done").slice(0, 5);
      if (!open.length) return "END You have no open tasks.";
      if (steps.length === 1) return `CON Your tasks:\n${open.map((x, i) => `${i + 1}. ${x.task.title.slice(0, 26)} (${x.task.due.slice(5)})`).join("\n")}`;
      const pick = open[Number(steps[1]) - 1];
      if (!pick) return "END That task number is not on your list.";
      if (steps.length === 2) return `CON ${pick.task.title.slice(0, 60)}\nDue ${pick.task.due}\n1. Acknowledge\n2. Done\n3. Blocked`;
      const state = STATES[Number(steps[2]) - 1];
      if (!state) return "END Choose 1, 2 or 3.";
      await svc.updateAssignment(pick.assignment.id, state, null, "ussd");
      return `END Marked ${state.toLowerCase()}. Your ward coordinator can see it.`;
    }

    if (steps[0] === "2") {
      if (steps.length === 1) return "CON How many people did you reach? Enter a number";
      const reached = Number(steps[1]);
      if (!Number.isInteger(reached) || reached < 0 || reached > 100000) return "END Enter the number of people as digits.";
      if (steps.length === 2) return `CON Main issue raised:\n${SHORT_ISSUE.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n0. None`;
      const i = Number(steps[2]);
      if (!Number.isInteger(i) || i < 0 || i > SHORT_ISSUE.length) return "END Choose an issue number.";
      if (steps.length === 3) return "CON Follow-up needed?\n1. Yes\n2. No";
      if (steps[3] !== "1" && steps[3] !== "2") return "END Choose 1 or 2.";
      await svc.submitReport({ activity: "Field report by USSD", people_reached: reached, issue_category: i ? ISSUE_CATEGORIES[i - 1] : null, follow_up: steps[3] === "1", channel: "ussd" });
      return "END Sent to your ward coordinator. Thank you.";
    }
    return "END Choose 1 or 2.";
  } catch {
    return "END Sorry, that did not go through. Nothing was saved. Try again.";
  }
}
