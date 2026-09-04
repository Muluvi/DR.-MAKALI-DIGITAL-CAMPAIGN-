/**
 * Every word, handle and number that appears on the seven phone screens.
 *
 * The campaign team must be able to rewrite any screen without opening a component, so nothing
 * displayable lives in JSX. Three rules govern what may go in here:
 *
 * 1. ON-SCREEN TEXT COMES FROM THE PROPOSAL. Each entry carries a `source` naming the section it
 *    was drawn from. Reshaping for the medium is expected — a narrative statement cut to caption
 *    length, a menu tree rendered as a menu. Writing new campaign messaging is not.
 * 2. WHAT THE PROPOSAL DOES NOT SAY STAYS EMPTY. A slot with no copy behind it is `null` and
 *    renders as the site's standard placeholder chip, exactly like the `[Insert …]` markers in
 *    the document. It is not filled with something plausible.
 * 3. NUMBERS AN INTERFACE STRUCTURALLY NEEDS ARE ILLUSTRATIVE AND REGISTERED. Engagement counts,
 *    subscriber counts and view counts are not campaign performance data and must never be read
 *    as such. They live in ILLUSTRATIVE_COUNTS below, and scripts/verify-figures.mjs fails the
 *    build if a number appears anywhere else in this file without tracing to the proposal.
 */

export type ChannelId = "whatsapp" | "facebook" | "instagram" | "tiktok" | "youtube" | "x" | "ussd";

/**
 * Rail order. Descending in-county reach per §3.1.1 — WhatsApp 65–80k down to X 8–12k — with USSD
 * last, because it reaches ~250,000 (§3.1.2) and is the point the whole module is making.
 */
export const CHANNEL_ORDER: ChannelId[] = [
  "whatsapp",
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "ussd",
];

/** Opens on WhatsApp: the most recognisable screen, so the device reads as a real phone at once. */
export const DEFAULT_CHANNEL: ChannelId = "whatsapp";

export const CHANNEL_LABELS: Record<ChannelId, string> = {
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  ussd: "USSD",
};

// ---------------------------------------------------------------------------
// Campaign identity
// ---------------------------------------------------------------------------

/**
 * Derived from the candidate's name and office as the proposal states them
 * ("Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS, Member of Parliament, Kitui Central").
 * Identity, not a claim — no account is asserted to exist.
 */
export const IDENTITY = {
  displayName: "Dr. Makali Mulu",
  fullName: "Hon. Dr. Benson Makali Mulu",
  office: "MP, Kitui Central",
  handle: "@MakaliMulu",
  pageName: "Dr. Makali Mulu — Kitui 2027",
  channelName: "Dr. Makali Mulu",
  initials: "MM",
  /** §2.7.3 radio script, the campaign's only slogan line. */
  slogan: "The Proven Economist, The Trusted Leader",
  sloganKikamba: "Muvisi Mũlũngalu, Mwĩkĩi wa Wathi",
} as const;

// ---------------------------------------------------------------------------
// Illustrative counts — NOT campaign performance data
// ---------------------------------------------------------------------------

/**
 * Interface chrome needs numbers to look like an interface. None of these describe anything the
 * campaign has achieved, because the campaign has not launched: the proposal deliberately
 * makes no performance claims, and §3.1.1 gives platform
 * reach as ranges, never as account metrics.
 *
 * They are held as strings so they can never be read back as data, kept deliberately small and
 * unremarkable, and every one of them is listed here. The module carries a visible line saying
 * the screens are illustrative.
 */
export const ILLUSTRATIVE_COUNTS = {
  xReplies: "18",
  xReposts: "64",
  xLikes: "212",
  xViews: "9,481",
  facebookReactions: "137",
  facebookComments: "22",
  facebookShares: "41",
  instagramLikes: "486",
  tiktokLikes: "1,204",
  tiktokComments: "87",
  tiktokShares: "310",
  youtubeViews: "3,912",
  youtubeSubscribers: "1,860",
  youtubeLikes: "204",
  /** Chrome only — a plausible clock, not a scheduling claim. */
  statusBarTime: "9:41",
} as const;

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------

export interface Sourced<T> {
  value: T;
  /** Where in the proposal this came from, for review. */
  source: string;
}

/** A slot the proposal does not supply. Renders as the site's placeholder chip. */
export type Gap = { gap: string };
export type Fillable<T> = Sourced<T> | Gap;

export function isGap<T>(v: Fillable<T>): v is Gap {
  return "gap" in v;
}

export interface WhatsAppMessage {
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
  /**
   * §4.1.2's four-hour loop describes exactly this dispatch: a localized pledge, then a 45-second
   * audio note voiced by Dr. Mulu, pushed to Ward Captains for peer forwarding. The resident's
   * reply is the single character the SMS sample itself asks for.
   */
  thread: [
    {
      from: "campaign",
      kind: "text",
      text: "Kitui Rural / Mbitini: Dr. Makali Mulu guarantees Ksh 100M Ward Fund to pipe clean solar water to Mbitini Market & expand youth loans. Reply 1 to join. STOP=22340",
      time: "07:12",
      source: "§2.7.3 — Direct 2G Bulk SMS copy sample, verbatim",
    },
    {
      from: "resident",
      kind: "text",
      text: "1",
      time: "07:14",
      source: "§2.7.3 — the reply the message itself asks for",
    },
    {
      from: "campaign",
      kind: "voice",
      duration: "0:45",
      time: "07:15",
      source: "§4.1.2 — 45-second audio note voiced by Dr. Mulu, pushed via WhatsApp",
    },
  ] satisfies WhatsAppMessage[],
  composerPlaceholder: "Message",
} as const;

export const FACEBOOK = {
  audience: "Public",
  timestamp: "2h",
  /** §2.6.1 Pillar 3, narrative statement, cut to post length. */
  body: {
    value:
      "Development in Kitui must no longer depend on which ward voted for the Governor. Dr. Mulu guarantees an institutionalized Ward Development Equalization Fund of Ksh 100 Million per ward, every year.",
    source: "§2.6.1 Pillar 3 — Devolution Equity, narrative statement",
  } as Sourced<string>,
  /** §2.6.1 Pillar 3, Tier 1 proof point — the card under the post. */
  card: {
    value: {
      kicker: "CIDP III — Tier 1",
      headline: "Over 61% of rural Kitui households still walk more than 5 km for water in dry seasons",
    },
    source: "§2.6.1 Pillar 3 — Kitui County Integrated Development Plan proof point",
  } as Sourced<{ kicker: string; headline: string }>,
  /** No comment copy exists anywhere in the proposal. */
  commentPreview: { gap: "Comment preview" } as Fillable<string>,
} as const;

export const X_POST = {
  timestamp: "4h",
  /** §2.6.1 Pillar 1, evidence lines, cut to post length. */
  body: {
    value:
      "Kitui Central NG-CDF: unqualified clean audit opinions, 2013–2025 (Auditor-General).\n\nKitui County government accounts over the same period: more than Ksh 2.4 Billion in contested pending bills.\n\nThe difference is not luck. It is method.",
    source: "§2.6.1 Pillar 1 — Fiscal Integrity, Tier 1 proof point and Tier 1 contrast",
  } as Sourced<string>,
  mediaLabel: {
    value: "Auditor-General — Kitui Central NG-CDF audit opinions, 2013–2025",
    source: "§2.6.1 Pillar 1 — Tier 1 proof point",
  } as Sourced<string>,
} as const;

export const INSTAGRAM = {
  /**
   * §2.6.2 specifies "1080x1080 square carousel cards" for social; it does not specify Reels or
   * Stories, and a Reel here would only duplicate the TikTok screen. So: a square feed carousel.
   */
  location: "Kitui County",
  timestamp: "6 hours ago",
  slideCount: 3,
  /** §2.7.1 Pillar B, core theme, cut to caption length. */
  caption: {
    value:
      "Ksh 85 per kilo floor price for ndengu. County aggregation cold-storage hubs. Solar borehole irrigation. Livestock feed reserves.",
    source: "§2.7.1 Pillar B — The Agrarian & Household Wealth Engine, core theme",
  } as Sourced<string>,
  captionTitle: {
    value: "Ũtonga wa Mĩsyĩ na Mĩũnda",
    source: "§2.7.1 Pillar B — Kikamba pillar name, verbatim",
  } as Sourced<string>,
  cardHeadline: {
    value: "Ksh 85 / kg",
    source: "§2.7.1 Pillar B — guaranteed minimum floor price for ndengu",
  } as Sourced<string>,
  cardSub: {
    value: "Guaranteed ndengu floor price",
    source: "§2.7.1 Pillar B — core theme",
  } as Sourced<string>,
} as const;

export const TIKTOK = {
  tabs: ["Following", "For You"],
  activeTab: "For You",
  /** §2.7.1 Pillar D, core theme, cut to caption length. */
  caption: {
    value:
      "Zero-interest equipment loans. Fee waivers for artisan TVET courses. Boda boda dignity.",
    source: "§2.7.1 Pillar D — The Youth Enterprise & TVET Frontier, core theme",
  } as Sourced<string>,
  overlayTitle: {
    value: "Mwanya wa Mwanake na Wathi",
    source: "§2.7.1 Pillar D — Kikamba pillar name, verbatim",
  } as Sourced<string>,
  /** A hashtag is new coinage, not a reshaping of existing copy. None exist in the proposal. */
  hashtags: { gap: "Hashtags" } as Fillable<string[]>,
  /** No audio track, jingle title or sound name is named anywhere. */
  audioTrack: { gap: "Audio track name" } as Fillable<string>,
} as const;

export const YOUTUBE = {
  /** §2.7.1 Pillar A, core theme, pulled into a title. */
  title: {
    value:
      "The Integrity & Stewardship Ledger: 13 years of Kitui Central NG-CDF audits, opened up",
    source: "§2.7.1 Pillar A — core theme and primary formats (documentary video case studies)",
  } as Sourced<string>,
  /** §3.1.1 — YouTube's stated role in the channel mix. */
  descriptionLine: {
    value: "Long-form debates, church sermons and rally livestreams.",
    source: "§3.1.1 — YouTube strategic role",
  } as Sourced<string>,
  duration: "18:24",
  publishedAgo: "2 days ago",
  subscribeLabel: "Subscribe",
  thumbnailKicker: {
    value: "Zero Auditor-General queries",
    source: "§2.7.1 Pillar A — core theme",
  } as Sourced<string>,
} as const;

export interface UssdMenuItem {
  key: string;
  label: string;
}

/**
 * §2.7.3 carries this menu as a literal tree, including the short code. Nothing here is
 * reshaped — it is the proposal's own USSD structure rendered as a USSD dialog.
 *
 * NOTE FOR THE CAMPAIGN: the short code is written `*483*77#` in §2.7.3 but `*483*XX#` in both
 * §3.1.2.2 and §2.6.2, and the SMS opt-out is `STOP=22340` in §2.7.3 but `STOP to 22XXX` in §2.6.2.
 * The concrete forms are used here because they are the only non-placeholder ones in the
 * document. Confirm both before anything is printed or dialled.
 */
export const USSD = {
  shortCode: "*483*77#",
  gatewayLabel: "Zero-Rated Gateway",
  networkLabel: "USSD",
  dialingMessage: "Sending…",
  responseHeader: "Dr. Makali Mulu — Kitui 2027",
  menu: [
    { key: "1", label: "Manifesto Summary" },
    { key: "2", label: "Ward Development Tracker" },
    { key: "3", label: "Volunteer as a Village Captain" },
    { key: "4", label: "Privacy Policy & Data Opt-Out" },
  ] satisfies UssdMenuItem[],
  submenu: [
    { key: "1", label: "Ksh 100M Ward Equalization Fund" },
    { key: "2", label: "Ksh 85/kg Ndengu Floor Price & Cold Hubs" },
    { key: "3", label: "Free Boda Boda Licenses & TVET Bursaries" },
  ] satisfies UssdMenuItem[],
  inputPlaceholder: "Reply",
  cancelLabel: "Cancel",
  sendLabel: "Send",
  source: "§2.7.3 — USSD Interactive Menu Tree Structure, verbatim",
} as const;

/** The one quiet line the module carries. */
export const DISCLOSURE =
  "Illustrative mockups of proposed campaign content. No account, post or engagement figure shown here exists yet.";

/** What each screen is, for assistive technology and for the caption under the rail. */
export const CHANNEL_SUMMARY: Record<ChannelId, string> = {
  whatsapp:
    "A WhatsApp thread to the Mbitini ward captains carrying the ward pledge message and a voice note from Dr. Mulu.",
  facebook:
    "A Facebook page post on the Ward Development Equalization Fund, with the water-access proof point beneath it.",
  instagram:
    "An Instagram carousel card on the guaranteed ndengu floor price, from the agrarian content pillar.",
  tiktok:
    "A vertical TikTok clip on youth enterprise and TVET, from the youth content pillar.",
  youtube:
    "A YouTube feature on the Kitui Central NG-CDF audit record, from the integrity content pillar.",
  x: "An X post contrasting the Kitui Central NG-CDF audit record with county pending bills.",
  ussd:
    "The zero-rated USSD menu on a feature phone — the channel that reaches the offline majority.",
};
