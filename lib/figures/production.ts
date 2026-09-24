/**
 * §5.2.1.2 — what gets made, to what specification, on what day, and who signs it off.
 *
 * WHAT THESE REPLACE. Six box-drawing blocks: a production pipeline, a format specification by
 * channel, a USSD menu tree, a seven-day production cycle, a four-step approval gateway and an
 * asset repository tree.
 *
 * THE USSD MENU CARRIES A WARNING THAT MUST TRAVEL WITH IT. The block sits directly beneath a
 * blockquote saying the shortcode is not provisioned and that "nothing here should be printed,
 * dialled or published as a working number" (§6.1). That blockquote is untouched prose and stays
 * where it is; the figure's own note repeats the point, because a menu tree lifted out of context
 * into a slide or a screenshot is exactly how an unprovisioned shortcode gets printed on a flyer.
 * The root carries no digits, ever.
 *
 * THE FORMAT TABLE IS WHERE C-21 SHOWS ITS TEETH AGAIN, and this time the document gets it right:
 * §5.2.1.2's SMS row says "Kiswahili or English only (CA rule)" and specifies GSM-7 encoding with no
 * accented unicode — which is the same constraint from the other end, since Kikamba orthography
 * needs ĩ and ũ. Two independent reasons the bulk SMS rail cannot carry Kikamba, stated here and
 * contradicted in §4.4.8.
 */
import type { FigureSeries } from "./types";

/* ------------------------------------------------------------------ §5.2.1.2 the pipeline */

export const PRODUCTION_TIERS = [
  {
    label: "Strategic core",
    items: ["4 core content pillars, evidence-led"],
  },
  {
    label: "Offline broadcast engine",
    items: [
      "Kikamba radio audio",
      "160-character 2G bulk SMS",
      "USSD interactive menus",
      "Baraza leaflets and books",
      "Boda and market PA jingles",
    ],
  },
  {
    label: "Digital engine",
    items: ["TikTok clips", "WhatsApp infographics", "Meta video", "Web tracker"],
  },
  {
    label: "Rigid 4-step approval & DPA gateway",
    items: ["Drafter → Comms Lead → DPO → Campaign Manager sign-off"],
  },
];

export const PRODUCTION_SERIES: FigureSeries = {
  id: "production-pipeline",
  headline: "Four content pillars feed two engines, and everything leaves through one gateway",
  measure: "§5.2.1.2's 360° content production pipeline",
  points: [],
  note:
    "The gateway is the point of the diagram: both engines converge on it, so no asset reaches a " +
    "voter without the four-step sign-off §5.2.1.2 specifies. Nothing routes around it.",
};

/* ------------------------------------------------------------------ §5.2.1.2 formats by channel */

export const FORMAT_SPECS: string[][] = [
  [
    "1. Kikamba vernacular radio spots (Musyi / Mbaitu)",
    "45-second pre-recorded audio spots · 15-second sponsor time-check bumpers · 60-second studio live-read endorsements",
    "Pure Kikamba (Kitui and Mwingi dialects). Real farmer and elder voice testimonials; zero abrasive partisan attacks.",
  ],
  [
    "2. Direct 2G bulk SMS & USSD portal",
    "Single-part 160-character plain text · GSM-7 encoding, no accented unicode · USSD: 4-option menu tree (see §5.2.1.2)",
    'Kiswahili or English only (CA rule); ward name, policy pledge and a free opt-out footer ("STOP to [sender ID]").',
  ],
  [
    "3. Open-air baraza & market print",
    "A5 full-colour 4-page glossy fold-outs · A1 weatherproof PVC caravan banners · pocket-sized 12-page manifesto summary",
    "Bilingual Kikamba/Swahili; high visual density with real GPS project photos, auditor stamps and ward maps.",
  ],
  [
    "4. Market caravans & PA sound rigs",
    "High-energy 90-second studio jingles · pre-recorded 3-minute candidate address · megaphone audio clips for boda marshals",
    'Catchy traditional Kamba rhythm and benga beat; easily memorised chorus reinforcing "Dr. Makali Mulu 2027".',
  ],
  [
    "5. Digital & social media (youth / diaspora)",
    "1080x1920 vertical video (Reels/TikTok) · 1080x1080 square carousel cards · 1920x1080 horizontal YouTube features",
    "Fast-paced with a first-three-seconds hook; hard-coded captions; dynamic motion graphics; English/Sheng with Kikamba hooks.",
  ],
];

export const FORMAT_SERIES: FigureSeries = {
  id: "format-specs",
  headline: "Five channels, and only one of them may carry Kikamba text",
  measure: "§5.2.1.2's production format specifications — channel, technical specification, language and creative treatment",
  points: [],
  conflicts: ["C-21"],
  note:
    "The SMS row states the constraint twice over: “Kiswahili or English only (CA rule)”, and " +
    "GSM-7 encoding with no accented unicode — which rules out the ĩ and ũ Kikamba orthography " +
    "needs. §4.4.8 nonetheless lists 2G bulk SMS among Kikamba's channels. C-21.",
};

/* ------------------------------------------------------------------ §5.2.1.2 the USSD menu */

export const USSD_MENU = {
  root: "The campaign shortcode (zero-rated gateway)",
  nodes: [
    {
      label: "1. Dr. Makali Mulu manifesto summary",
      children: [
        "1. Ksh 100M ward equalization fund",
        "2. Ksh 85/kg ndengu floor price & cold hubs",
        "3. Free boda boda licenses & TVET bursaries",
      ],
    },
    { label: "2. Ward development tracker (enter ward name)" },
    { label: "3. Volunteer as a ward captain" },
    { label: "4. Privacy policy & data opt-out" },
  ],
};

export const USSD_SERIES: FigureSeries = {
  id: "ussd-menu",
  headline: "Four options, one of which is the way out",
  measure: "§5.2.1.2's USSD interactive menu tree",
  points: [],
  note:
    "THE SHORTCODE IS NOT PROVISIONED. §6.1 lists it as pending at contracting, and the note above " +
    "this figure says nothing here should be printed, dialled or published as a working number. " +
    "The root carries no digits " +
    "because a menu tree lifted into a slide is how an unprovisioned shortcode reaches a flyer. " +
    "Option 4 is the DPA opt-out §5.2.4.1 requires, reachable from the top menu rather than buried.",
};

/* ------------------------------------------------------------------ §5.2.1.2 the weekly cycle */

export const WEEKLY_CYCLE: string[][] = [
  [
    "Monday",
    "Strategic war room briefing and narrative theme setting · scriptwriting for radio, SMS copy and WhatsApp cards",
    "Weekly creative master brief · draft radio and video scripts",
  ],
  [
    "Tuesday",
    "Studio recording for Kikamba audio spots and jingles · graphics design for social carousels and print flyers",
    "Master audio WAVs and 2G voice clips · social static cards and baraza sheets",
  ],
  [
    "Wednesday",
    "Multi-tier approval gateway review (Comms, DPO, CM) · SMS gateway scheduling and USSD menu updates",
    "Fully signed-off creative package · Africa's Talking staging upload",
  ],
  [
    "Thursday",
    "Dispatch of physical print collateral to 8 sub-counties · early flighting of market-day radio spots (Musyi/Mbaitu)",
    "Printed packages on the morning courier · radio ads live for Friday markets",
  ],
  [
    "Friday",
    "Market day caravan deployment and live content capture · real-time SMS broadcast to Friday market wards",
    "Live field photos and raw 4K video · 100,000 ward SMS delivered",
  ],
  [
    "Saturday",
    "Major rally and baraza coverage with rapid-turnaround video · audio snippet extraction for Sunday radio morning news",
    "60-second summary reel within 3 hours · radio soundbites sent to stations",
  ],
  [
    "Sunday",
    "Church fellowship photos and message distribution · weekly analytics and reach performance audit",
    "Weekly recap carousel and podcast clip · BI dashboard weekly content report",
  ],
];

export const WEEKLY_SERIES: FigureSeries = {
  id: "weekly-cycle",
  headline: "Approval falls on Wednesday, which is what makes Friday's market broadcast possible",
  measure: "§5.2.1.2's weekly 7-day content production cycle — focus and output deliverables per day",
  points: [],
  note:
    "The week is built backwards from Friday's markets: scripts Monday, studio Tuesday, the " +
    "approval gateway Wednesday, print and radio dispatch Thursday. Friday's row states 100,000 " +
    "ward SMS delivered, which §5.6's KPI ladder is the place to check against.",
};

/* ------------------------------------------------------------------ §5.2.1.2 the gateway */

export const APPROVAL_STEPS = [
  {
    title: "Creative drafting & sourcing",
    steps: [
      "A specialist vendor or in-house creator drafts the script, video or SMS copy.",
      "Mandatory: the creator must attach a primary citation — Hansard, OAG report, KNBS.",
    ],
  },
  {
    title: "Communications & message integrity review",
    steps: [
      "The Communications Lead verifies narrative alignment, Kikamba dialect accuracy and visual brand guidelines.",
    ],
  },
  {
    title: "Legal, electoral & DPA compliance check",
    steps: [
      "The Data Protection Officer audits the audience list, verifies explicit consent tags, ensures mandatory opt-out footers and checks electoral libel laws.",
    ],
  },
  {
    title: "Executive authorisation & dispatch sign-off",
    steps: [
      "The Campaign Manager or Chief of Operations gives the final electronic signature.",
      "The release authorisation code is logged in the campaign audit register.",
    ],
  },
];

export const APPROVAL_SERIES: FigureSeries = {
  id: "approval-gateway",
  headline: "Nothing reaches a voter without a citation at the front and a logged signature at the end",
  measure: "§5.2.1.2's four-step content approval gateway, in order",
  points: [],
  note:
    "Numbered because the order is the control: a citation attached at step 1 is what steps 2 and " +
    "3 have to check, and the audit register entry at step 4 is what makes the whole chain " +
    "reviewable afterwards.",
};

/* ------------------------------------------------------------------ §5.2.1.2 the asset library */

export const ASSET_LIBRARY = {
  root: "/CAMPAIGN_ASSET_REPOSITORY_2027/",
  nodes: [
    {
      label: "01_BRAND_GUIDELINES_&_FONTS/",
      children: [
        "Typography/ (Plus_Jakarta_Sans, Playfair_Display, Inter)",
        "Color_Palettes/ (Kitui_Blue, Earth_Gold, Clean_White)",
        "Official_Candidate_Logos_&_Emblems/",
      ],
    },
    {
      label: "02_PRIMARY_EVIDENCE_VAULT/",
      children: [
        "OAG_Clean_Audit_Certificates_2013_2025/",
        "Parliamentary_Hansard_Records_Finance_Committee/",
        "KNBS_Census_&_Agricultural_Baseline_Reports/",
      ],
    },
    {
      label: "03_AUDIO_BROADCAST_VAULT/",
      children: [
        "Radio_45s_Spots_Master_WAV/ (Musyi, Mbaitu, Sang'u)",
        "Sound_Truck_Jingles_&_Benga_Anthems/",
        "Megaphone_Audio_Clips_for_Boda_Marshals/",
      ],
    },
    {
      label: "04_SMS_USSD_COPY_VAULT/",
      children: [
        "40_Ward_Localized_SMS_Pledges/",
        "Crisis_Rapid_Response_SMS_Templates/",
        "USSD_Interactive_Menu_Scripts/",
      ],
    },
    {
      label: "05_PRINT_COLLATERAL_VAULT/",
      children: [
        "A5_Baraza_4Page_Foldouts_PrintReady_PDF/",
        "12Page_Manifesto_Executive_Summary_Kikamba_Swahili/",
        "PVC_Caravan_Banners_&_Boda_Shed_Signage/",
      ],
    },
    {
      label: "06_DIGITAL_VIDEO_VAULT/",
      children: [
        "TikTok_Reels_Vertical_1080x1920/",
        "Longform_YouTube_Documentaries/",
        "WhatsApp_Status_Infographic_Cards/",
      ],
    },
    { label: "07_RAW_FIELD_FOOTAGE_ARCHIVE/ (organised by date and sub-county)" },
  ],
};

export const LIBRARY_SERIES: FigureSeries = {
  id: "asset-library",
  headline: "Seven vaults, and the second one holds the evidence every asset has to cite",
  measure: "§5.2.1.2's campaign asset repository",
  points: [],
  note:
    "02_PRIMARY_EVIDENCE_VAULT is the one that makes §5.2.1.2 step 1 workable: the OAG certificates, " +
    "the Hansard records and the KNBS baselines a drafter must attach a citation from are filed " +
    "in one place rather than looked up each time.",
};
