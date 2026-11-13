/**
 * The WhatsApp thread the phone mockup shows (components/tools/PhoneMockup.tsx). Every line comes
 * from the campaign's own copy: the ward SMS sample, the reply it asks for, and the 45-second voice
 * note from the field-to-digital loop. Edit the words here, not in the component.
 */
interface WhatsAppMessage {
  from: "campaign" | "resident";
  /** Text bubble, or a voice note of the given duration. */
  kind: "text" | "voice";
  text?: string;
  duration?: string;
  time: string;
  source: string;
}

export const WHATSAPP = {
  contactName: "Mbitini Ward Captains",
  contactStatus: "40 Ward Captains",
  dateDivider: "TODAY",
  thread: [
    {
      from: "campaign",
      kind: "text",
      text: "Kitui Rural / Mbitini: Dr. Mulu will fund wards by need, on one published formula. Solar water to Mbitini Market first. Reply 1 to join, STOP to opt out.",
      time: "07:12",
      source: "The ward SMS copy sample, verbatim",
    },
    {
      from: "resident",
      kind: "text",
      text: "1",
      time: "07:14",
      source: "The reply the message itself asks for",
    },
    {
      from: "campaign",
      kind: "voice",
      duration: "0:45",
      time: "07:15",
      source: "The 45-second voice note from Dr. Mulu in the field-to-digital loop, pushed via WhatsApp",
    },
  ] satisfies WhatsAppMessage[],
  composerPlaceholder: "Message",
} as const;
