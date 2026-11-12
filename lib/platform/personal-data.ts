/**
 * Personal data typed where it does not belong. The site is open to anyone with the link, so a
 * phone number, ID number or email address typed into a free-text field would be public the moment
 * it is saved. The workspace forms refuse it, in the browser and again on the server
 * (lib/platform/validate.ts), and the models warn about it.
 *
 * What is matched:
 *   phone   a Kenyan mobile or landline: +254 or 254 then nine digits, or 0 then nine digits,
 *           with spaces, dots or dashes allowed between the digits
 *   ID      a run of seven to nine digits with nothing between them: a national ID or passport
 *           number. An amount written with thousands separators (2,500,000) is not matched
 *   email   anything shaped like name@domain
 *
 * Pure: no imports, so the forms, the server and the tests share it.
 */

const SEP = "[\\s.-]?";
const PHONE = new RegExp(`(?<![\\d+])(?:\\+?254${SEP}|0)(?:\\d${SEP}){8}\\d(?!\\d)`);
const ID = /(?<![\d,.])\d{7,9}(?![\d,.]?\d)/;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

export type PersonalDataKind = "phone" | "id" | "email";

/** The first kind of personal data the text contains, or null. Phone is checked first, since a phone number also looks like an ID. */
export function findPersonalData(text: string): PersonalDataKind | null {
  if (PHONE.test(text)) return "phone";
  if (EMAIL.test(text)) return "email";
  if (ID.test(text)) return "id";
  return null;
}

const WHAT: Record<PersonalDataKind, string> = {
  phone: "a phone number",
  id: "what looks like an ID number",
  email: "an email address",
};

/** The plain-language refusal a form shows for one field. */
export function personalDataMessage(label: string, kind: PersonalDataKind): string {
  const amount = kind === "id" ? " If it is an amount, write it with commas, for example 2,500,000." : "";
  return `${label} contains ${WHAT[kind]}. Everything on the platform is open to anyone with the link, so no one's contact details or ID can be saved here; keep them in the campaign's own systems.${amount}`;
}
