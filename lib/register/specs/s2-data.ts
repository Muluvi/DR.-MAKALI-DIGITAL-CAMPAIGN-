/**
 * Section 2, The Data: the figure register's nine records of what the official sources show.
 */
import register from "../../../data/ward-register.json" with { type: "json" };
import { RADIO_STATIONS } from "../../../data/media-ownership.ts";
import type { FigureSpec } from "../types.ts";
import { bar, byValue, F, fmt, num, src, stateOf } from "./_util.ts";

const CONS = register.constituencies as { id: string; name: string }[];

/* ------------------------------------------------------------------ fig-2-1-register (pilot) */

const W22 = "IEBC ward register, 2022 (T1)";
const ECVR = "IEBC ECVR county annex, July 2026 (T1)";
const REPORTED_2026 = "Venas News, July 2026 (T3, unconfirmed)";

const conBars = byValue(CONS.map((c) => bar(`con.${c.id}`, c.name)));

export const FIG_2_1: FigureSpec = {
  id: "fig-2-1-register",
  section: "2.1",
  title: `The register grew by ${fmt("register.2026.growth")} voters since 2022, most of them in one thirty-day drive`,
  question: "How big is the register, and how did it get there?",
  takeaway: `Kitui has ${fmt("register.2026")} registered voters as of July 2026; the 2022 split by constituency is the latest published, because the 2026 register is not yet out by ward.`,
  sources: [src("register.2022"), src("register.2026"), { name: "Continuous registration: the growth less the drive, derived", tier: F("register.2026.continuous").tier, state: "modelled" }],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "From 2022 to July 2026: the running total",
        chart: {
          type: "waterfall",
          steps: [
            { label: "Registered, 2022", value: num("register.2022"), kind: "start", state: stateOf("register.2022") },
            { label: "ECVR Phase 1, to 28 April 2026", value: num("register.2026.ecvr-drive"), kind: "delta", state: stateOf("register.2026.ecvr-drive") },
            { label: "Continuous registration outside the drive", value: num("register.2026.continuous"), kind: "delta", state: stateOf("register.2026.continuous") },
            { label: "Registered, July 2026", value: num("register.2026"), kind: "total", state: stateOf("register.2026") },
          ],
        },
      },
      {
        heading: "By constituency, 2022 register",
        chart: { type: "bars", bars: conBars, unit: "" },
      },
    ],
  },
  notes: [
    `The 2022 figure counts ward-registered voters; ${fmt("register.2022.prisons")} prison-registered voters bring it to ${fmt("register.2022.with-prisons")}. Continuous registration is derived as the difference, so it absorbs them.`,
  ],
  columns: [
    { key: "item", label: "Item" },
    { key: "voters", label: "Registered voters", numeric: true },
    { key: "source", label: "Source" },
  ],
  rows: [
    { cells: { item: "Registered, 2022 (ward-registered)", voters: num("register.2022"), source: W22 } },
    { cells: { item: "ECVR Phase 1, to 28 April 2026", voters: num("register.2026.ecvr-drive"), source: ECVR } },
    { cells: { item: "Continuous registration outside the drive", voters: num("register.2026.continuous"), source: "Derived: July 2026 less 2022 less the drive" }, state: "modelled" },
    { cells: { item: "Registered, July 2026", voters: num("register.2026"), source: REPORTED_2026 } },
    ...conBars.map((b) => ({ cells: { item: `${b.label}, 2022`, voters: b.value, source: W22 } })),
  ],
};

/* ------------------------------------------------------------------ fig-2-2-results */

const WIN = { value: num("result.2022.gov.malombe"), label: `${fmt("result.2022.gov.malombe")}, the 2022 governor's winning total` };
const PANELS = [
  { title: "Governor, 2017 (T1, Court of Appeal)", bars: [bar("result.2017.gov.ngilu", "Charity Ngilu, winner"), bar("result.2017.gov.musila", "David Musila"), bar("result.2017.gov.malombe", "Julius Malombe")] },
  { title: "Governor, 2022 (T1, Form 37C)", bars: [bar("result.2022.gov.malombe", "Julius Malombe, winner"), bar("result.2022.gov.musila", "David Musila", { note: `The Star's early total was ${fmt("result.2022.gov.musila.media")}; the certified share matches ${fmt("result.2022.gov.musila")}.` }), bar("result.2022.gov.mueke", "Jonathan Mueke")] },
  { title: "Senator, 2022 (T2)", bars: [bar("result.2022.senate.wambua", "Enoch Wambua, winner")] },
  { title: "Woman Representative, 2022 (T2)", bars: [bar("result.2022.womanrep.kasalu", "Irene Kasalu, winner")] },
  { title: "Kitui Central MP, 2022 (T1)", bars: [bar("result.2022.mp.mulu", "Dr. Mulu, winner", { tone: "accent" }), bar("result.2022.mp.musambi", "Boniface Musambi")] },
];
const RESULT_ROWS = PANELS.flatMap((p) => p.bars.map((b) => ({ cells: { race: p.title.replace(/ \(.*\)$/, ""), candidate: b.label, votes: b.value }, state: b.state, closesWith: b.state === "needed" ? F("result.2022.mp.mulu").closesWith : undefined })));

export const FIG_2_2: FigureSpec = {
  id: "fig-2-2-results",
  section: "2.2",
  title: `Every countywide seat in 2022 was won with about ${fmt("benchmark")} votes, and one winner beat the governor's total`,
  question: "What does it take to win a countywide seat in Kitui?",
  takeaway: `The ${fmt("result.2022.gov.malombe")} line is the working bar: the Woman Representative cleared it, the Senator came within ${fmt("gap.wambua-to-benchmark-2022")}, and both are Wiper rivals for the ticket.`,
  sources: [src("result.2017.gov.ngilu"), src("result.2022.gov.malombe"), src("result.2022.mp.mulu"), { name: "Senator and Woman Representative 2022: media reporting of the IEBC declaration", tier: "T2" }],
  chart: { type: "multiples", panels: PANELS, max: Math.max(...PANELS.flatMap((p) => p.bars.map((b) => b.value ?? 0))), ref: WIN },
  notes: ["One scale for all five panels, so bar lengths compare across races. The vertical line is the same value in every panel."],
  columns: [{ key: "race", label: "Race" }, { key: "candidate", label: "Candidate" }, { key: "votes", label: "Votes", numeric: true }],
  rows: RESULT_ROWS,
};

/* ------------------------------------------------------------------ fig-2-3-nomination */

export const FIG_2_3: FigureSpec = {
  id: "fig-2-3-nomination",
  section: "2.3",
  title: "The nomination method is reported, not confirmed, and two documents would settle it",
  question: "What is the nomination method, and how confident are we?",
  takeaway: "Until the party's resolution or its 2027 nomination rules are in hand, every phase that leans on the reported selection method is a plan against a Tier 3 report.",
  sources: [{ name: "Nomination method and window: single-source campaign report", tier: "T3" }, { name: "Party name change: Office of the Registrar of Political Parties (August 2025)", tier: "T1" }],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "Status: reported, not confirmed",
        chart: {
          type: "cards",
          columns: 2,
          cards: [
            { kicker: "Method · T3", title: "A party-run countywide selection, not a competitive primary", body: "Single-sourced campaign report; not confirmed by party officials.", tone: "outside" },
            { kicker: "Window · T3", title: "Late October to November 2026", body: "Reported for the Wiper Patriotic Front's selection; no party calendar published.", tone: "outside" },
            { kicker: "Constitution · T1", title: "Article 180(7) and the incumbent", body: "Whether the two-term limit bars Governor Malombe is unsettled; carried as a risk with two branches in Section 5.8.15." },
            { kicker: "Party · T1", title: "Wiper Democratic Movement is now Wiper Patriotic Front", body: "Certificate of change of name issued by the Registrar, August 2025." },
          ],
        },
      },
      {
        heading: "What would confirm it",
        chart: {
          type: "matrix",
          header: ["Document", "Holder", "Status"],
          rows: [
            { head: "Signed resolution of the Wiper National Executive Council", cells: ["Wiper NEC", "Not in hand"] },
            { head: "The party's 2027 nomination rules and timetable, as filed with the IEBC and the Registrar of Political Parties", cells: ["Wiper, via the campaign", "Not in hand: the obtainable test"] },
          ],
        },
      },
    ],
  },
  columns: [{ key: "item", label: "Item" }, { key: "status", label: "Status" }, { key: "holder", label: "Holder" }],
  rows: [
    { cells: { item: "Nomination method: party-run countywide selection", status: "Reported, not confirmed (T3)", holder: "—" } },
    { cells: { item: "Nomination window: late October to November 2026", status: "Reported, not confirmed (T3)", holder: "—" } },
    { cells: { item: "Wiper NEC signed resolution", status: "Not in hand", holder: "Wiper NEC" } },
    { cells: { item: "Party nomination rules and timetable, 2027", status: "Not in hand", holder: "Wiper, via the campaign" } },
  ],
};

/* ------------------------------------------------------------------ fig-2-4-people */

const LIVESTOCK = byValue([bar("livestock.poultry", "Poultry"), bar("livestock.goats", "Goats"), bar("livestock.cattle", "Cattle"), bar("livestock.donkeys", "Donkeys")]);

export const FIG_2_4: FigureSpec = {
  id: "fig-2-4-people",
  section: "2.4",
  title: `Kitui is ${fmt("census.rural.share")}% rural, and more than half its residents are poor`,
  question: "Who lives in Kitui?",
  takeaway: `A county of ${fmt("census.population")} people across ${fmt("census.area")} km², with livestock at the centre of its economy, and at Alert Phase in the NDMA's January 2026 drought bulletin.`,
  sources: [src("census.rural.share"), src("poverty.2021"), src("livestock.goats"), { name: "NDMA drought bulletin, January 2026", tier: "T1" }],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "Out of every 100 residents",
        chart: {
          type: "icons",
          items: [
            { label: "Live in rural areas (KNBS 2019)", share: num("census.rural.share"), state: "sourced" },
            { label: "In poverty, KNBS 2021", share: num("poverty.2021"), state: "sourced" },
          ],
        },
      },
      { heading: "Livestock, head count", chart: { type: "bars", bars: LIVESTOCK } },
      {
        heading: "Drought and food security",
        chart: {
          type: "cards",
          columns: 2,
          cards: [
            { kicker: "NDMA · January 2026 bulletin", title: "Drought status: Alert Phase", body: "The county's early-warning designation after a year of chronic drought pressure." },
            { kicker: "IPC · September 2025", title: "Food security: Phase 2, Stressed", body: "Followed by the March 2026 national flooding (Tier 2)." },
          ],
        },
      },
    ],
  },
  notes: ["The two poverty rates disagree and both are shown. The KNBS Poverty Report is the later primary source and is the one this proposal uses."],
  columns: [{ key: "measure", label: "Measure" }, { key: "value", label: "Value", numeric: true }, { key: "unit", label: "Unit" }, { key: "source", label: "Source" }],
  rows: [
    { cells: { measure: "Population (2019)", value: num("census.population"), unit: "people", source: "KNBS 2019 Census (T1)" } },
    { cells: { measure: "Rural share", value: num("census.rural.share"), unit: "%", source: "KNBS 2019 Census (T1)" } },
    { cells: { measure: "Poverty rate (2021)", value: num("poverty.2021"), unit: "%", source: "KNBS Kenya Poverty Report 2021 (T1)" } },
    ...LIVESTOCK.map((b) => ({ cells: { measure: b.label, value: b.value, unit: "head", source: `${F("livestock.goats").source} (T1)` } })),
    { cells: { measure: "Drought status, January 2026", value: "Alert Phase", unit: "—", source: "NDMA bulletin (T1)" } },
    { cells: { measure: "Food security, September 2025", value: "IPC Phase 2", unit: "—", source: "IPC (T1)" } },
  ],
};

/* ------------------------------------------------------------------ fig-2-5-budget */

const bn = (id: string) => `KSh ${fmt(id, "bn")}bn`;
const BUDGET = [
  bar("budget.equitable", "Equitable share", { display: bn("budget.equitable"), tone: "accent" }),
  bar("budget.osr", "Own-source revenue", { display: `${bn("budget.osr")} (Assembly: ${bn("budget.osr.revised")})` }),
  bar("budget.grants", "Conditional grants", { display: bn("budget.grants") }),
  bar("budget.rounding", "Rounding in the source", { display: `KSh ${fmt("budget.rounding", "bn")}bn`, tone: "neg" }),
];

export const FIG_2_5: FigureSpec = {
  id: "fig-2-5-budget",
  section: "2.5",
  title: `The next governor runs a ${bn("budget.total")} envelope, and ${fmt("budget.equitable.share")}% of it arrives from the national government`,
  question: "What does the next governor actually control?",
  takeaway: `Own-source revenue is the one part the county raises itself: ${bn("budget.osr")} in the Fiscal Strategy Paper, ${bn("budget.osr.revised")} after the Assembly's revision, until the final approved budget settles it.`,
  sources: [
    { name: "Kitui County Fiscal Strategy Paper FY2026/27: equitable share and conditional grants", tier: "T1" },
    { name: "The same Paper, via secondary reporting: the total and own-source revenue", tier: "T3" },
    { name: "County Assembly revision of the Paper: own-source revenue", tier: "T3" },
  ],
  chart: { type: "stack", segments: BUDGET, total: num("budget.total"), totalLabel: `Total envelope, FY2026/27: ${bn("budget.total")} (T3, secondary reporting of the Paper)` },
  notes: [
    "The three parts sum to KSh 0.01bn more than the published total; the difference is drawn as its own segment rather than absorbed.",
  ],
  columns: [{ key: "part", label: "Part" }, { key: "ksh", label: "KSh", numeric: true }, { key: "share", label: "Share of envelope, %", numeric: true }, { key: "tier", label: "Tier" }],
  rows: [
    { cells: { part: "Equitable share", ksh: num("budget.equitable"), share: num("budget.equitable.share"), tier: "T1" } },
    { cells: { part: "Own-source revenue, Fiscal Strategy Paper", ksh: num("budget.osr"), share: num("budget.osr.share"), tier: "T3" } },
    { cells: { part: "Own-source revenue, as revised by the Assembly", ksh: num("budget.osr.revised"), share: "—", tier: "T3" } },
    { cells: { part: "Conditional grants", ksh: num("budget.grants"), share: num("budget.grants.share"), tier: "T1" } },
    { cells: { part: "Rounding in the source", ksh: num("budget.rounding"), share: "—", tier: "—" }, state: "modelled" },
    { cells: { part: "Total envelope", ksh: num("budget.total"), share: 100, tier: "T3" } },
  ],
};

/* ------------------------------------------------------------------ fig-2-6-connectivity */

export const FIG_2_6: FigureSpec = {
  id: "fig-2-6-connectivity",
  section: "2.6",
  title: "Internet use nearly doubled since 2019, while phone ownership barely moved",
  question: "How do people get online, and has that changed?",
  takeaway: `Even after the rise, ${fmt("ict.offline")}% of Kitui is offline, and fewer than half of residents own a phone.`,
  sources: [{ name: "KNBS, 2019 Kenya Population and Housing Census", tier: F("ict.internet.2019").tier }, { name: F("ict.internet").source ?? "", tier: F("ict.internet").tier }],
  chart: {
    type: "slope",
    left: "2019",
    right: "2023/24",
    unit: "%",
    lines: [
      { label: "own a phone", a: num("ict.phone.2019"), b: num("ict.phone"), tone: "neutral" },
      { label: "use the internet", a: num("ict.internet.2019"), b: num("ict.internet"), tone: "accent" },
    ],
  },
  columns: [{ key: "measure", label: "Share of residents" }, { key: "y2019", label: "2019, %", numeric: true }, { key: "y2023", label: "2023/24, %", numeric: true }],
  rows: [
    { cells: { measure: "Own a mobile phone", y2019: num("ict.phone.2019"), y2023: num("ict.phone") } },
    { cells: { measure: "Use the internet", y2019: num("ict.internet.2019"), y2023: num("ict.internet") } },
  ],
};

/* ------------------------------------------------------------------ fig-2-7-media */

const OWNER_OF = (alignment: string): { id: string; name: string } => {
  if (/Ngilu/.test(alignment)) return { id: "ngilu", name: "Charity Ngilu (rival)" };
  if (/Kalonzo/.test(alignment)) return { id: "kalonzo", name: "Kalonzo Musyoka (Wiper)" };
  if (/Royal Media/.test(alignment)) return { id: "rms", name: "Royal Media Services" };
  if (/Adventist/.test(alignment)) return { id: "sda", name: "SDA Church, Kitui" };
  if (/State-owned/.test(alignment)) return { id: "kbc", name: "KBC (state)" };
  return { id: "ind", name: "Independent owners" };
};
const postureOf = (p: string): "placement" | "secondary" | "monitoring" => (/^Priority/.test(p) ? "placement" : /^Secondary/.test(p) ? "secondary" : "monitoring");
const STATIONS = [...RADIO_STATIONS].sort((a, b) => OWNER_OF(a.alignment).id.localeCompare(OWNER_OF(b.alignment).id));
const OWNERS = [...new Map(STATIONS.map((s) => [OWNER_OF(s.alignment).id, OWNER_OF(s.alignment)])).values()];

export const FIG_2_7: FigureSpec = {
  id: "fig-2-7-media",
  section: "2.7",
  title: "Three of the Kikamba stations are tied to political figures, so placement goes to the independents",
  question: "Who owns the airwaves, and where do we place vs monitor?",
  takeaway: "Musyi, County FM and Wikwatyo carry the campaign's placements; the Ngilu-linked stations and the party leader's station are watched, not relied on.",
  sources: [{ name: "Local media ownership reporting (publicly reported, not certified)", tier: "T3" }, { name: "Corporate and denominational ownership records", tier: "T2" }, src("radio.musyi")],
  chart: {
    type: "composite",
    parts: [
      { heading: "Owners, stations and posture", chart: { type: "network", owners: OWNERS, stations: STATIONS.map((s) => ({ name: s.name, owner: OWNER_OF(s.alignment).id, posture: postureOf(s.posture) })) } },
      {
        heading: "Share of listeners, Lower Eastern (Kitui, Machakos, Makueni), earlier measurement",
        chart: {
          type: "bars",
          unit: "%",
          bars: byValue([
            bar("radio.musyi", "Musyi FM · place", { display: `${fmt("radio.musyi")}%` }),
            bar("radio.citizen", "Citizen Radio · Kiswahili, national", { display: `${fmt("radio.citizen")}%` }),
            bar("radio.athiani", "Athiani FM · monitor", { display: `${fmt("radio.athiani")}%` }),
            bar("radio.mbaitu", "Mbaitu FM · monitor", { display: `${fmt("radio.mbaitu")}%` }),
            bar("radio.county", "County FM · place", { display: `${fmt("radio.county")}%` }),
            bar("radio.mwatu", "KBC Mwatu FM · secondary", { display: `${fmt("radio.mwatu")}%` }),
          ]),
        },
      },
    ],
  },
  notes: [
    "Solid link: placement or secondary placement. Dashed link and outline: monitoring only.",
    "Listener shares are for Lower Eastern as a whole and from an earlier measurement: they rank the stations and do not size Kitui's audience. Syokimau, Wikwatyo and Akamba FM are not reported in it.",
  ],
  columns: [{ key: "station", label: "Station" }, { key: "owner", label: "Owner or association" }, { key: "posture", label: "Posture" }, { key: "share", label: "Lower Eastern share, %", numeric: true }, { key: "frequency", label: "Frequency" }],
  rows: STATIONS.map((s) => {
    const key = ({ "Musyi FM": "radio.musyi", "Athiani FM": "radio.athiani", "Mbaitu FM": "radio.mbaitu", "County FM": "radio.county", "KBC Mwatu FM": "radio.mwatu" } as Record<string, string>)[s.name];
    return { cells: { station: s.name, owner: s.alignment, posture: s.posture, share: key ? num(key) : "Not reported", frequency: s.frequency ?? "Not published" } };
  }),
};

/* ------------------------------------------------------------------ fig-2-8-record */

export const FIG_2_8: FigureSpec = {
  id: "fig-2-8-record",
  section: "2.8",
  title: `Thirteen years as MP have left a checkable record: ${fmt("record.bursary.recipients")} bursaries and the best-evaluated constituency in the Eastern region`,
  question: "What has he actually done?",
  takeaway: "His distinguishing proof is delivery on the record, and most of it is already published on the constituency's own NG-CDF site.",
  sources: [src("record.bursary.recipients"), { name: "Parliament of Kenya record; NG-CDF Board evaluation, FY2014/15", tier: "T1" }, src("record.cdf.boreholes")],
  chart: {
    type: "composite",
    parts: [
      {
        heading: "Career",
        chart: {
          type: "timeline",
          from: "2012-01-01",
          to: "2027-08-31",
          events: [
            { date: "2013-03", label: "Elected MP, Kitui Central", state: "sourced", whenText: "2013" },
            { date: "2015-06", label: "Best-evaluated constituency, Eastern region", state: "sourced", whenText: "FY2014/15", note: "First of 71 constituencies in its national peer group." },
            { date: "2017-08", label: "Re-elected MP", state: "sourced", whenText: "2017" },
            { date: "2022-08", label: "Re-elected MP", state: "sourced", whenText: "2022", note: `${fmt("result.2022.mp.mulu")} votes, against ${fmt("result.2022.mp.musambi")} for the runner-up (IEBC, T1).` },
          ],
        },
      },
      {
        heading: "Proof",
        chart: {
          type: "stats",
          items: [
            { value: fmt("record.bursary.recipients"), label: `bursary recipients, KSh ${fmt("record.bursary.ksh", "m")}m allocated (T1)`, state: "sourced" },
            { value: "1st of 71", label: "best-evaluated constituency, Eastern region, FY2014/15 (T1)", state: "sourced" },
            { value: fmt("record.cdf.boreholes"), label: "boreholes in the NG-CDF project inventory (T3, awaiting verification)", state: "sourced" },
            { value: fmt("record.cdf.school-water"), label: "school water projects in the same inventory (T3)", state: "sourced" },
          ],
        },
      },
    ],
  },
  notes: [`The NG-CDF record is drawn as counts; the FY2026/27 allocation is KSh ${fmt("ngcdf.allocation.2026")} (T1).`],
  columns: [{ key: "item", label: "Item" }, { key: "value", label: "Value" }, { key: "tier", label: "Tier" }],
  rows: [
    { cells: { item: "Elected MP, Kitui Central", value: "2013; re-elected 2017 and 2022", tier: "T1" } },
    { cells: { item: "Bursary recipients", value: num("record.bursary.recipients"), tier: "T1" } },
    { cells: { item: "Bursaries allocated, KSh", value: num("record.bursary.ksh"), tier: "T1" } },
    { cells: { item: "Constituency evaluation, FY2014/15", value: "Best in the Eastern region; first of 71 in its peer group", tier: "T1" } },
    { cells: { item: "Boreholes, NG-CDF inventory", value: num("record.cdf.boreholes"), tier: "T3" } },
    { cells: { item: "School water projects, NG-CDF inventory", value: num("record.cdf.school-water"), tier: "T3" } },
    { cells: { item: "NG-CDF allocation, FY2026/27, KSh", value: num("ngcdf.allocation.2026"), tier: "T1" } },
  ],
};

/* ------------------------------------------------------------------ fig-2-9-channels */

export const FIG_2_9: FigureSpec = {
  id: "fig-2-9-channels",
  section: "2.9",
  title: "His presence is one Facebook page, a quiet X account and a constituency site that already holds his record",
  question: "What does his presence look like against the field?",
  takeaway: "The NG-CDF site is the most under-used asset here; the comparison with the field is drawn in the Week 1 audit.",
  sources: [src("channel.fb.followers"), src("channel.x.followers")],
  chart: {
    type: "matrix",
    header: ["Channel", "Status", "Tier"],
    rows: [
      { head: "Facebook, verified", cells: [`About ${fmt("channel.fb.followers")} followers, ${fmt("channel.fb.posts")} posts; page-or-profile status settled in Week 1`, "T3"] },
      { head: "X, @MakaliMulu", cells: [`Live; bio still frames him as MP. About ${fmt("channel.x.followers")} followers, September 2026 snapshot`, "T3"] },
      { head: "kituicentralcdf.co.ke", cells: ["Constituency-run, active in 2026: a ready proof-point library", "T1"] },
      { head: "NG-CDF Board constituency page", cells: ["Official", "T1"] },
      { head: "TikTok, Instagram, YouTube, WhatsApp Channel", cells: ["None verified publicly; recorded in the Week 1 audit where they exist", "—"] },
    ],
  },
  columns: [{ key: "channel", label: "Channel" }, { key: "status", label: "Status" }, { key: "tier", label: "Tier" }],
  rows: [
    { cells: { channel: "Facebook, verified", status: `About ${fmt("channel.fb.followers")} followers, ${fmt("channel.fb.posts")} posts`, tier: "T3" } },
    { cells: { channel: "X, @MakaliMulu", status: `About ${fmt("channel.x.followers")} followers, September 2026`, tier: "T3" } },
    { cells: { channel: "kituicentralcdf.co.ke", status: "Constituency-run, active in 2026", tier: "T1" } },
    { cells: { channel: "NG-CDF Board constituency page", status: "Official", tier: "T1" } },
    { cells: { channel: "TikTok, Instagram, YouTube, WhatsApp Channel", status: "None verified publicly", tier: "—" } },
  ],
};

export const S2: FigureSpec[] = [FIG_2_1, FIG_2_2, FIG_2_3, FIG_2_4, FIG_2_5, FIG_2_6, FIG_2_7, FIG_2_8, FIG_2_9];
