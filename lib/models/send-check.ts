/**
 * Send check: would a planned send on the offline layer pass the dispatch rules? Pure arithmetic
 * on the four rules for political SMS (Communications Authority guidelines, July 2017), so the
 * page and the tests run the same functions.
 */

export type SendInputs = { rail: string; language: string; date: string; sendTime: string; lodgedOn: string; message: string };
export type SendResult = { allowed: boolean; refusals: string[]; ruled: boolean };

export const RAIL_OPTIONS: readonly string[] = ["SMS", "USSD", "WhatsApp", "Voice"];
export const LANGUAGE_OPTIONS: readonly string[] = ["Kikamba", "Kiswahili", "English"];

/** Only SMS carries rules of its own; the other rails still follow the campaign's opt-in rules. */
const RULED_RAILS = new Set(["SMS"]);

export const SMS_LIMIT = 160;

const daysBetween = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86_400_000;

const RULES: ((r: SendInputs) => string | null)[] = [
  (r) =>
    r.rail === "SMS" && r.language === "Kikamba"
      ? "Bulk political SMS cannot be sent in Kikamba: the CA/NCIC guidelines restrict political SMS to English or Kiswahili. Use the WhatsApp line or a voice note for Kikamba."
      : null,
  (r) => {
    const time = r.sendTime.trim();
    if (r.rail !== "SMS" || !time) return null;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return "Enter the send time as 24-hour HH:MM, for example 09:30.";
    return time < "08:00" || time > "17:00" ? "Political SMS may only go out between 08:00 and 17:00." : null;
  },
  (r) => (r.rail === "SMS" && r.message.length > SMS_LIMIT ? `The SMS is ${r.message.length} characters. It must be ${SMS_LIMIT} or fewer.` : null),
  (r) => {
    if (r.rail !== "SMS") return null;
    if (!r.lodgedOn) return "Political SMS must be lodged with the mobile operator first. Enter the date it was lodged.";
    return daysBetween(r.lodgedOn, r.date) < 2 ? "Political SMS must be lodged with the operator at least 48 hours before the send date." : null;
  },
];

/**
 * Personal data in the message text: a Kenyan phone number, an ID-like run of seven to nine
 * digits, or an email address. Supporter contact details belong in the campaign's own systems.
 */
const SEP = "[\\s.-]?";
const PHONE = new RegExp(`(?<![\\d+])(?:\\+?254${SEP}|0)(?:\\d${SEP}){8}\\d(?!\\d)`);
const ID = /(?<![\d,.])\d{7,9}(?![\d,.]?\d)/;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

function findPersonalData(text: string): "phone" | "id" | "email" | null {
  if (PHONE.test(text)) return "phone";
  if (EMAIL.test(text)) return "email";
  if (ID.test(text)) return "id";
  return null;
}

const WHAT = { phone: "a phone number", id: "what looks like an ID number", email: "an email address" } as const;

export function checkSend(i: SendInputs): SendResult {
  const refusals = RULES.map((r) => r(i)).filter((m): m is string => !!m);
  const personal = findPersonalData(i.message);
  if (personal) refusals.push(`The message contains ${WHAT[personal]}. Keep contact details and ID numbers in the campaign's own systems, not in a broadcast.`);
  return { allowed: refusals.length === 0, refusals, ruled: RULED_RAILS.has(i.rail) };
}
