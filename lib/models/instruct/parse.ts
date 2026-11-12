/**
 * One instruction parser per model: plain words in, the model's options out, with a note of what
 * was understood and what was not. Each starts from the options already set, so an instruction
 * changes only what it names. See ./text.ts for what this is, and is not.
 */
import { clampTo, clauses, datesIn, has, namesIn, negated, numberFor, numbersIn, only, timeIn, type Parsed } from "./text.ts";
import type { Scenario } from "../winning-number.ts";
import type { AgentInputs } from "../polling-agents.ts";
import { KEYS as PRIORITY_KEYS, type Weights } from "../ward-priority.ts";
import type { SendInputs } from "../send-check.ts";
import type { RolloutInputs } from "../rollout.ts";
import type { ChannelKey, Mix } from "../reach.ts";
import type { ContentCode } from "../brief-mix.ts";
import { KINDS, type Incident, type KindKey } from "../response-tier.ts";
import type { FinderInputs } from "../record-finder.ts";

const done = <T>(next: T, understood: string[], unclear: string[]): Parsed<T> => ({ next, understood, unclear });

/* ------------------------------------------------------------ winning number */

type Named = { code: string; name: string };
export function parseWinning(text: string, cur: { a: Scenario; b: Scenario; active: "A" | "B" }, cons: Named[]): Parsed<{ a: Scenario; b: Scenario; active: "A" | "B" }> {
  const next = { a: structuredClone(cur.a), b: structuredClone(cur.b), active: cur.active };
  const understood: string[] = [];
  const unclear: string[] = [];
  const named_ = new Set<string>();
  for (const c of clauses(text)) {
    if (/\bscenario b\b|\bin b\b|^b\b/.test(c)) next.active = "B";
    else if (/\bscenario a\b|\bin a\b|^a\b/.test(c)) next.active = "A";
    const target = next.active === "A" ? next.a : next.b;
    const named = namesIn(c, cons);
    const where = named.length ? named : cons;
    const turnout = numberFor(c, "turnout");
    const share = numberFor(c, "share|support|vote share|of the vote|of votes|win");
    if (turnout === null && share === null) {
      if (c.trim()) unclear.push(c);
      continue;
    }
    // A clause that names no constituency fills the ones this instruction has not named for that setting.
    for (const k of where) {
      const id = `${next.active}|${k.code}`;
      if (turnout !== null && (named.length || !named_.has(`${id}|turnout`))) target[k.code] = { ...target[k.code], turnout: clampTo(turnout, 0, 100) };
      if (share !== null && (named.length || !named_.has(`${id}|share`))) target[k.code] = { ...target[k.code], share: clampTo(share, 0, 100) };
      if (named.length) { if (turnout !== null) named_.add(`${id}|turnout`); if (share !== null) named_.add(`${id}|share`); }
    }
    const place = named.length ? named.map((n) => n.name).join(", ") : named_.size ? "every other constituency" : "every constituency";
    understood.push(`Scenario ${next.active}, ${place}: ${[turnout !== null ? `turnout ${clampTo(turnout, 0, 100)}%` : "", share !== null ? `share ${clampTo(share, 0, 100)}%` : ""].filter(Boolean).join(", ")}`);
  }
  return done(next, understood, unclear);
}

/* ------------------------------------------------------------ polling agents */

export function parseAgents(text: string, cur: AgentInputs): Parsed<AgentInputs> {
  const next = { ...cur };
  const understood: string[] = [];
  const unclear: string[] = [];
  for (const c of clauses(text)) {
    let hit = false;
    const reserve = numberFor(c, "reserves?|spares?|backups?");
    if (reserve !== null) { next.reservePct = clampTo(reserve, 0, 100); understood.push(`Reserve ${next.reservePct}%`); hit = true; }
    const span = /(\d+)\s*stations?\s*(?:per|each|for every|to a|to each)\s*supervisor/.exec(c)?.[1] ?? (has(c, "supervisor") ? String(numberFor(c, "supervisors? (?:for|per|every|over)|span") ?? "") : "");
    if (span) { next.perSupervisor = Math.max(1, Math.floor(Number(span))); understood.push(`One supervisor per ${next.perSupervisor} stations`); hit = true; }
    if (/\bno supervisors?\b/.test(c)) { next.perSupervisor = 0; understood.push("No supervisors"); hit = true; }
    const per = /(\d+)\s*(?:agents?)?\s*(?:per|a|each|at every|for each)\s*(?:p[o]lling\s*)?station/.exec(c)?.[1] ?? (has(c, "agents?") && !has(c, "reserve|supervisor") ? String(numbersIn(c)[0] ?? "") : "");
    if (per) { next.perStation = Math.max(1, Math.floor(Number(per))); understood.push(`${next.perStation} agent${next.perStation === 1 ? "" : "s"} per station`); hit = true; }
    if (!hit) unclear.push(c);
  }
  return done(next, understood, unclear);
}

/* ------------------------------------------------------------ ward priority */

const CRITERION_WORDS: Record<(typeof PRIORITY_KEYS)[number], string> = {
  voters: "register|voters?|size|population|big|large",
  pool: "office|not held|never held|pool|recognition|unknown|mwingi|kitui south|new ground",
  stations: "stations?|polling stations?",
  projects: "projects?|record|scorecard|delivery",
};

export function parsePriority(text: string, cur: Weights): Parsed<Weights> {
  const all = clauses(text);
  const whole = all.join(" ");
  const understood: string[] = [];
  const unclear: string[] = [];
  if (has(whole, "even|equal|same weight|balanced|reset")) {
    return done({ voters: 25, pool: 25, stations: 25, projects: 25 }, ["Even weights"], []);
  }
  const next: Weights = { ...cur };
  const named = new Set<string>();
  let any = false;
  for (const c of all) {
    let hit = false;
    for (const k of PRIORITY_KEYS) {
      const words = CRITERION_WORDS[k];
      if (!has(c, words)) continue;
      hit = any = true;
      named.add(k);
      if (negated(c, words) || has(c, `ignore\\s+(?:the\\s+)?(?:${words})`)) { next[k] = 0; understood.push(`${k === "pool" ? "Where he has not held office" : k} not counted`); continue; }
      const n = numberFor(c, words);
      if (n !== null) { next[k] = clampTo(Math.round(n / 5) * 5, 0, 100); understood.push(`${label(k)}: weight ${next[k]}`); }
      else { next[k] = Math.max(next[k], 50); understood.push(`${label(k)}: counted`); }
      if (only(c, words)) for (const o of PRIORITY_KEYS) if (o !== k) next[o] = 0;
    }
    if (!hit) unclear.push(c);
  }
  // Naming some criteria with no numbers means "these": the rest stop counting.
  if (any && !/\d/.test(whole) && !has(whole, "also|as well|add")) for (const k of PRIORITY_KEYS) if (!named.has(k)) next[k] = 0;
  return done(next, understood, unclear);
}
const label = (k: string) => ({ voters: "Register size", pool: "Where he has not held office", stations: "Polling stations", projects: "County projects" })[k] ?? k;

/* ------------------------------------------------------------ send check */

export function parseSend(text: string, cur: SendInputs, rails: readonly string[], languages: readonly string[], today: string): Parsed<SendInputs> {
  const next = { ...cur };
  const understood: string[] = [];
  const unclear: string[] = [];
  // The message itself: after "message:" or "saying", or between quotes. Taken from the raw text so its case is kept.
  const quoted = /"([^"]+)"|“([^”]+)”/.exec(text) ?? /(?:message|text|saying|says)\s*[:\-]\s*(.+)$/i.exec(text);
  const rest = quoted ? text.replace(quoted[0], " ") : text;
  if (quoted) { next.message = (quoted[1] ?? quoted[2] ?? "").trim(); understood.push(`Message of ${next.message.length} characters`); }
  for (const c of clauses(rest)) {
    let hit = false;
    for (const r of rails) if (has(c, r.toLowerCase())) { next.rail = r; understood.push(`Rail: ${r}`); hit = true; break; }
    for (const l of languages) if (has(c, l.toLowerCase())) { next.language = l; understood.push(`Language: ${l}`); hit = true; break; }
    const time = timeIn(c);
    if (time) { next.sendTime = time; understood.push(`Send time ${time}`); hit = true; }
    const dates = datesIn(c, today);
    if (dates.length) {
      if (has(c, "lodg")) {
        const lodgedAfter = /lodg\w*[^]*?$/.exec(c)?.[0] ?? c;
        const lodged = datesIn(lodgedAfter, today)[0] ?? dates[dates.length - 1];
        next.lodgedOn = lodged;
        understood.push(`Lodged on ${lodged}`);
        const send = dates.find((d) => d !== lodged);
        if (send) { next.date = send; understood.push(`Sent on ${send}`); }
      } else {
        next.date = dates[0];
        understood.push(`Sent on ${dates[0]}`);
      }
      hit = true;
    }
    if (/not (?:yet )?lodged|unlodged/.test(c)) { next.lodgedOn = ""; understood.push("Not lodged yet"); hit = true; }
    if (!hit && c.trim()) unclear.push(c);
  }
  return done(next, understood, unclear);
}

/* ------------------------------------------------------------ rollout planner */

export function parseRollout(text: string, cur: RolloutInputs, anchors: { date: string; event: string }[], today: string): Parsed<RolloutInputs> {
  const next = { ...cur };
  const understood: string[] = [];
  const unclear: string[] = [];
  const weeks: [keyof RolloutInputs, string, string][] = [
    ["discoveryWeeks", "discovery", "Discovery"],
    ["readinessWeeks", "readiness", "Readiness"],
    ["pilotWeeks", "pilot", "Pilot"],
    ["weeksPerWave", "weeks? (?:per|a|each) wave|each wave|waves? (?:of|last|lasting|take)", "Weeks per wave"],
    ["readinessBeforePollWeeks", "freeze|before p[o]lling|election-day readiness|election day", "Freeze before polling day"],
  ];
  for (const c of clauses(text)) {
    let hit = false;
    if (has(c, "start|begin|from|kick")) {
      const d = datesIn(c, today)[0];
      if (d) { next.start = d; understood.push(`Start ${d}`); hit = true; }
    }
    for (const [key, words, name] of weeks) {
      if (!has(c, words)) continue;
      const n = /constituenc/.test(c) && key === "pilotWeeks" ? null : numberFor(c, words);
      if (n !== null && /week|wk/.test(c)) { (next[key] as number) = Math.max(1, Math.floor(n)); understood.push(`${name}: ${next[key]} weeks`); hit = true; }
    }
    const pc = /(\d+)\s*(?:pilot\s*)?constituenc\w*\s*(?:in|for)?\s*(?:the\s*)?pilot|pilot\w*\s*(?:with|of|in)?\s*(\d+)\s*constituenc/.exec(c);
    if (pc) { next.pilotConstituencies = Math.floor(Number(pc[1] ?? pc[2])); understood.push(`${next.pilotConstituencies} constituencies in the pilot`); hit = true; }
    const pw = /(\d+)\s*constituenc\w*\s*(?:per|a|each|in each)\s*wave|waves?\s*of\s*(\d+)/.exec(c);
    if (pw) { next.perWave = Math.max(1, Math.floor(Number(pw[1] ?? pw[2]))); understood.push(`${next.perWave} constituencies per wave`); hit = true; }
    if (has(c, "finish|done|ready|deadline|before|by")) {
      const words = c.replace(/\b(finish|finished|done|ready|deadline|before|by|rollout|must|be|the|all|wards?|reporting)\b/g, " ").split(/\s+/).filter((w) => w.length >= 4);
      const scored = anchors.map((a) => ({ a, s: words.filter((w) => a.event.toLowerCase().includes(w)).length })).sort((x, y) => y.s - x.s);
      if (scored[0] && scored[0].s > 0) { next.deadline = scored[0].a.date; understood.push(`Finish before: ${scored[0].a.event} (${scored[0].a.date})`); hit = true; }
    }
    if (!hit && c.trim()) unclear.push(c);
  }
  return done(next, understood, unclear);
}

/* ------------------------------------------------------------ reach by channel */

const CHANNEL_WORDS: Record<ChannelKey, string> = {
  social: "social|facebook|whatsapp|tiktok|online|internet|digital|youtube|x\\b|twitter|instagram",
  sms: "sms|ussd|text messages?|texts?|bulk",
  radio: "radio|fm|broadcast",
  ground: "ground|door|barazas?|markets?|field|in person|face to face|rallies|rally|caravans?|meetings?",
};

export function parseReach(text: string, cur: Mix): Parsed<Mix> {
  const next = structuredClone(cur);
  const understood: string[] = [];
  const unclear: string[] = [];
  const keys = Object.keys(CHANNEL_WORDS) as ChannelKey[];
  for (const c of clauses(text)) {
    let hit = false;
    for (const k of keys) {
      const w = CHANNEL_WORDS[k];
      if (!has(c, w)) continue;
      hit = true;
      if (negated(c, w)) { next[k].on = false; understood.push(`${k === "sms" ? "SMS and USSD" : k} left out`); continue; }
      const n = numberFor(c, w);
      next[k] = { on: true, reach: n !== null ? clampTo(Math.round(n), 0, 100) : next[k].reach };
      understood.push(`${k === "sms" ? "SMS and USSD" : k[0].toUpperCase() + k.slice(1)} in the mix${n !== null ? `, reaching ${next[k].reach}%` : ""}`);
      if (only(c, w)) for (const o of keys) if (o !== k) next[o].on = false;
    }
    if (!hit && c.trim()) unclear.push(c);
  }
  return done(next, understood, unclear);
}

/* ------------------------------------------------------------ weekly brief mix */

export function parseBrief(text: string, cur: { shares: Record<ContentCode, number>; languages: string[]; channels: string[]; minShare: number }, types: { code: ContentCode; short: string }[], languages: string[], channels: string[]): Parsed<typeof cur> {
  const next = { shares: { ...cur.shares }, languages: [...cur.languages], channels: [...cur.channels], minShare: cur.minShare };
  const understood: string[] = [];
  const unclear: string[] = [];
  const typeWords = (t: { code: ContentCode; short: string }) => `${t.code.toLowerCase()}|${t.short.toLowerCase().replace(/[^a-z ]/g, "").split(" ").filter((w) => w.length > 3).join("|")}`;
  let sharesNamed = false;
  for (const c of clauses(text)) {
    let hit = false;
    const min = numberFor(c, "minimum|at least|threshold|counts? (?:once|from)");
    if (min !== null && has(c, "minimum|at least|threshold|counts")) { next.minShare = clampTo(Math.round(min), 0, 50); understood.push(`A content type counts from ${next.minShare}%`); hit = true; }
    for (const t of types) {
      const w = typeWords(t);
      if (!has(c, w)) continue;
      const n = negated(c, w) ? 0 : numberFor(c, w);
      if (n !== null) { next.shares[t.code] = clampTo(Math.round(n), 0, 100); sharesNamed = true; understood.push(`${t.code} · ${t.short}: ${next.shares[t.code]}%`); hit = true; }
    }
    for (const l of languages) {
      const w = l.toLowerCase();
      if (!has(c, w)) continue;
      hit = true;
      if (negated(c, w)) { next.languages = next.languages.filter((x) => x !== l); understood.push(`No ${l}`); }
      else if (!next.languages.includes(l)) { next.languages.push(l); understood.push(`${l} in the week`); }
    }
    const langOnly = languages.filter((l) => only(c, l.toLowerCase()) || (has(c, "only") && has(c, l.toLowerCase()) && !negated(c, l.toLowerCase())));
    if (langOnly.length && has(c, "only|just")) { next.languages = langOnly; understood.push(`Only ${langOnly.join(" and ")}`); }
    for (const ch of channels) {
      const w = ch.toLowerCase().replace(/[^a-z ]/g, "").trim();
      if (!w || !has(c, `${w}\\b`)) continue;
      hit = true;
      if (negated(c, w)) { next.channels = next.channels.filter((x) => x !== ch); understood.push(`No ${ch}`); }
      else if (!next.channels.includes(ch)) { next.channels.push(ch); understood.push(`${ch} in the week`); }
    }
    if (!hit && c.trim()) unclear.push(c);
  }
  // Shares named for some content types: the ones not named take nothing, so the week adds up as written.
  if (sharesNamed) {
    const said = new Set(understood.filter((u) => /^P\d/.test(u)).map((u) => u.slice(0, 2)));
    for (const t of types) if (!said.has(t.code)) next.shares[t.code] = 0;
  }
  return done(next, understood, unclear);
}

/* ------------------------------------------------------------ response tier */

const KIND_WORDS: [KindKey, string][] = [
  ["media", "deepfake|deep fake|doctored|manipulated|edited (?:video|audio|photo)|fake (?:video|audio|photo|image)|ai-generated|ai generated"],
  ["legal", "lawsuit|sued|court|legal|regulator|iebc complaint|ncic|petition"],
  ["tv", "\\btv\\b|television|citizen tv|ntv|ktn|national news"],
  ["allegation", "false allegation|accus|alleg|claims? (?:he|that he)|lie about|smear"],
  ["coordinated", "coordinated|bots?|many accounts|campaign against|network of accounts|trending"],
  ["press", "press conference|presser|press briefing"],
  ["radio", "radio|fm|on air|call-in"],
  ["baraza", "baraza|market|church|funeral|meeting"],
  ["rumour", "rumou?r|whatsapp|forwarded|going round|gossip"],
  ["comment", "comment|post|tweet|facebook|tiktok|blog"],
];

export function parseIncident(text: string, cur: Incident, lines: { question: string; attack: string }[]): Parsed<Incident & { line: number }> {
  const c = clauses(text).join(" ; ");
  const next: Incident & { line: number } = { ...cur, line: -1 };
  const understood: string[] = [];
  const kind = KIND_WORDS.find(([, w]) => has(c, w));
  if (kind) { next.kind = kind[0]; understood.push(`What happened: ${KINDS.find((k) => k.key === kind[0])!.label.toLowerCase()}`); }
  if (has(c, "county-wide|countywide|whole county|across the county|all wards|every ward")) { next.spread = "county"; understood.push("Spread: county-wide"); }
  else if (has(c, "national|nationwide|across kenya|nairobi media")) { next.spread = "national"; understood.push("Spread: national"); }
  else if (has(c, "several wards|many wards|a few wards|\\d+ wards|wards")) { next.spread = "wards"; understood.push("Spread: several wards"); }
  else if (has(c, "one ward|a ward|single ward|in [a-z]+ ward")) { next.spread = "ward"; understood.push("Spread: one ward"); }
  const views = numberFor(c, "views?|people saw|seen|shares?|listeners?|watched");
  if (views !== null) { next.views = Math.round(views * (/\d\s*k\b/.test(c) ? 1000 : 1)); understood.push(`${next.views.toLocaleString("en-KE")} views`); }
  const groups = numberFor(c, "groups?|whatsapp groups?");
  if (groups !== null) { next.wardGroups = Math.round(groups); understood.push(`${next.wardGroups} ward WhatsApp groups`); }
  if (has(c, "anonymous|fringe|blog|unknown account|no name")) { next.fringe = true; understood.push("From a fringe or anonymous source"); }
  // The line of attack: the prepared line whose words the incident shares most.
  const words = new Set(c.split(/[^a-z]+/).filter((w) => w.length >= 5));
  const scored = lines.map((l, i) => ({ i, s: [...new Set(`${l.question} ${l.attack}`.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 5))].filter((w) => words.has(w)).length })).sort((a, b) => b.s - a.s);
  if (scored[0] && scored[0].s >= 2) { next.line = scored[0].i; understood.push(`Matches the prepared line: ${lines[scored[0].i].question.replace(/^\d+\.\s*/, "")}`); }
  const unclear = understood.length ? [] : [text.trim()].filter(Boolean);
  return done(next, understood, unclear);
}

/* ------------------------------------------------------------ record finder */

export function parseRecord(text: string, cur: FinderInputs, wards: { slug: string; name: string; constituency: string }[], sectors: string[]): Parsed<FinderInputs> {
  const c = clauses(text).join(" ; ");
  const next = { ...cur };
  const understood: string[] = [];
  const ward = namesIn(c, wards)[0];
  if (ward) { next.ward = ward.slug; next.constituency = ward.constituency; understood.push(`Ward: ${ward.name}`); }
  const sector = sectors.find((s) => has(c, s.toLowerCase().replace(/[^a-z/ ]/g, "").split(/[/ ]/).filter((w) => w.length > 2).join("|")));
  if (sector) { next.sector = sector; understood.push(`Sector: ${sector}`); }
  else if (has(c, "all sectors|any sector|everything")) { next.sector = "all"; understood.push("All sectors"); }
  if (has(c, "not complete|incomplete|ongoing|unfinished|stalled|not finished")) { next.status = "other"; understood.push("Not complete, or not stated"); }
  else if (has(c, "complete|completed|finished|done")) { next.status = "complete"; understood.push("Complete"); }
  if (has(c, "constituency")) { next.includeConstituency = !negated(c, "constituency"); understood.push(next.includeConstituency ? "With constituency-level projects" : "Without constituency-level projects"); }
  const unclear = understood.length ? [] : [text.trim()].filter(Boolean);
  return done(next, understood, unclear);
}
