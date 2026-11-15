"use client";

/**
 * The visuals added to the chapters that were mostly text (story integration, November 2026).
 * Each one draws only what its chapter already says: claims and lines are quoted from the chapter,
 * figures come from the figure registry, and the tables (RACI, deliverables, glossary, workstreams)
 * are read from the text by scripts/build-story-mirrors.mjs. Every one is a way into the chapter's
 * own sections, not a substitute for them.
 */
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BarChart3, BookOpen, Check, ChevronDown, Compass, Gauge, Languages, Layers, Mail,
  MessageCircle, MousePointerClick, Phone, Radio as RadioIcon, Send, ShieldCheck, Table2, Users, Wrench,
} from "lucide-react";
import mirrors from "@/lib/story/mirrors.generated.json";
import { FIGURES } from "@/lib/data/figures";
import { formatFigure } from "@/lib/data/format";
import { PHASES, PLANNING_SIGNATURE, ELECTION_DAY } from "@/lib/phases";
import { RACE_CALENDAR } from "@/lib/public-data";
import { TOOL_META } from "@/lib/tools/meta";
import { COLLECTIONS } from "@/lib/platform/collections";
import { SECTIONS } from "@/lib/heading-slug";
import { RECORD_HOMES as RECORD_AT } from "@/lib/story/embeds";
import { useReveal } from "./useReveal";

/* ------------------------------------------------------------------ shared */

declare global { interface Window { __jumpTo?: (id: string) => void } }

/** Opens the chapter that holds `id` if it is folded into its summary, then scrolls to it. */
export function jumpTo(id: string) {
  if (window.__jumpTo) window.__jumpTo(id);
  else window.location.hash = id;
}

const DAY = 86_400_000;
const nairobiToday = () => new Date(Date.now() + 3 * 3_600_000).toISOString().slice(0, 10);
const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const longDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Today's date in Nairobi, set after hydration so a page built earlier still counts from today. */
function useToday(): string | null {
  const [d, setD] = useState<string | null>(null);
  useEffect(() => { const id = window.setTimeout(() => setD(nairobiToday()), 0); return () => window.clearTimeout(id); }, []);
  return d;
}

const fig = (id: string) => FIGURES[id];
const figText = (id: string, mod: "" | "bn" | "m" = "") => (fig(id) ? formatFigure(fig(id), mod) : "");
/** The tier in the site's own words (lib/data/format.ts). */
const tierOf = (id: string) => (fig(id) ? formatFigure(fig(id), "tier") : "");

function Shell({ kicker, title, icon: Icon, children, tone = "accent", className = "" }: { kicker: string; title: string; icon: typeof Check; children: React.ReactNode; tone?: "accent" | "gold" | "green"; className?: string }) {
  const [ref, inView] = useReveal<HTMLElement>();
  return (
    <section ref={ref} className={`sx-vis sx-vis--${tone} ${className}`} data-in={inView ? "true" : "false"} aria-label={title}>
      <header className="sx-vis__head">
        <span className="sx-vis__icon" aria-hidden="true"><Icon size={18} /></span>
        <span>
          <span className="sx-vis__kicker">{kicker}</span>
          <span className="sx-vis__title">{title}</span>
        </span>
      </header>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ 9.1 the claim, and what proves it */

const PROOF: { step: string; text: string; to: string; where: string }[] = [
  { step: "The premise", text: "Kitui voters are ready for a leader who understands economics, respects public money, communicates with clarity and respect — and is willing to be measured.", to: "position-sec-9-1", where: "9.1" },
  { step: "What makes it his", text: "A specialist in verifying whether public expenditure delivers what it promised.", to: "record-sec-6-1", where: "6.1" },
  { step: "The gap it answers", text: "Unconfirmed balances, pending bills and low development absorption, in the county's own audit record.", to: "spend-sec-3-7", where: "3.7" },
  { step: "Made visible every day", text: "A public service-delivery tracker: a line on a CV becomes a daily, public demonstration of accountability.", to: "workstreams-sec-15-1-1", where: "15.1.1" },
];

export function ProofStack() {
  return (
    <Shell kicker="The claim, and what it rests on" title="Dr. Makali Mulu is the Economist Governor Kitui needs" icon={Layers}>
      <ol className="sx-proof">
        {PROOF.map((p, i) => (
          <li key={p.step} style={{ "--i": i } as React.CSSProperties}>
            <button type="button" onClick={() => jumpTo(p.to)}>
              <span className="sx-proof__n" aria-hidden="true">{i + 1}</span>
              <span className="sx-proof__body">
                <span className="sx-proof__step">{p.step}</span>
                <span className="sx-proof__text">{p.text}</span>
                <span className="sx-proof__go">Section {p.where} <ArrowRight size={13} aria-hidden="true" /></span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <blockquote className="sx-proof__line">
        &ldquo;Kitui has resources. What it has lacked is leadership that understands how to use them — and the discipline to prove it did.&rdquo;
        <cite>The governing line</cite>
      </blockquote>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 9.2 the resource paradox */

export function Paradox() {
  const total = fig("budget.total")?.value ?? 0;
  const gaps = [
    { id: "audit.uncollected", label: "Uncollected revenue" },
    { id: "budget.pending-bills.2021", label: "Pending bills" },
    { id: "audit.cash", label: "Unconfirmed cash balances" },
  ].map((g) => ({ ...g, f: fig(g.id) })).filter((g) => g.f?.value);
  const [tap, setTap] = useState<string | null>(null);
  return (
    <Shell kicker="The resource paradox" title="The money is there. The discipline to use it is the gap." icon={Gauge} tone="gold">
      <p className="sx-vis__lead">Kitui has ample developmental resources; what it lacks is disciplined, accountable deployment.</p>
      <div className="sx-envelope">
        <div className="sx-envelope__bar"><span>Annual envelope, FY2026/27</span><b>KSh {figText("budget.total", "bn")} bn</b></div>
        <p className="sx-envelope__tier">{tierOf("budget.total")} · County Fiscal Strategy Paper</p>
      </div>
      <p className="sx-chip-hint"><MousePointerClick size={12} aria-hidden="true" /> Tap a line for its source</p>
      <ul className="sx-gaps">
        {gaps.map((g, i) => {
          const share = total ? (g.f!.value as number) / total : 0;
          return (
            <li key={g.id} style={{ "--i": i, "--w": Math.max(share, 0.015) } as React.CSSProperties}>
              <button type="button" onClick={() => setTap(tap === g.id ? null : g.id)} aria-expanded={tap === g.id}>
                <span className="sx-gaps__label">{g.label}</span>
                <span className="sx-gaps__track"><span className="sx-gaps__fill" /></span>
                <span className="sx-gaps__value">KSh {formatFigure(g.f!, g.f!.value! >= 1e9 ? "bn" : "m")}{g.f!.value! >= 1e9 ? " bn" : " m"}</span>
              </button>
              {tap === g.id && <p className="sx-bar__note">{tierOf(g.id)}{g.f!.asOf ? ` · ${g.f!.asOf}` : ""}{g.f!.note ? ` · ${g.f!.note}` : ""}</p>}
            </li>
          );
        })}
      </ul>
      <p className="sx-vis__foot">Each line is drawn to the same scale as the envelope. The figures come from different years; tap one for its date.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 23.1 the window, and the one decision */

/** Firefly's number as the cover prints it (scripts/build-story-mirrors.mjs). */
const WHATSAPP = mirrors.contact.intl;

export function AskWindow() {
  const today = useToday();
  // The clock that sets the pace (Firefly's decision Q5): the next IEBC Gazette deadline and election
  // day, from the same deadline data the Governor Race Calendar reads, counted from today in Nairobi.
  const upcoming = today ? RACE_CALENDAR.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)) : [];
  const next = upcoming.find((e) => e.date !== ELECTION_DAY) ?? upcoming[0];
  const daysTo = (iso: string) => (today ? Math.round((t(iso) - t(today)) / DAY) : 0);
  const toElection = today ? daysTo(ELECTION_DAY) : null;
  // How far the reader is along the road from the first Gazette deadline to election day.
  const first = RACE_CALENDAR.map((e) => e.date).sort()[0];
  const at = today && first ? Math.min(1, Math.max(0, (t(today) - t(first)) / (t(ELECTION_DAY) - t(first)))) : 0;
  const [ref, inView] = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="sx-ask" data-in={inView ? "true" : "false"} aria-label="The clock and the decision">
      <div className="sx-ask__window">
        <p className="sx-vis__kicker">The clock that sets the pace · IEBC Gazette deadlines</p>
        <p className="sx-ask__big">
          {next && today ? (
            <><b>{daysTo(next.date)}</b> {daysTo(next.date) === 1 ? "day" : "days"} to the next Gazette deadline</>
          ) : (
            <>Election day, {longDate(ELECTION_DAY)}</>
          )}
        </p>
        {next && today && <p className="sx-muted">{next.event} · {longDate(next.date)}</p>}
        <div className="sx-ask__track" aria-hidden="true">
          <span className="sx-ask__fill" style={{ "--at": at } as React.CSSProperties} />
          {today && <span className="sx-ask__now" style={{ "--at": at } as React.CSSProperties}><i />Today</span>}
        </div>
        <p className="sx-ask__ends">{first && <span>{longDate(first)}</span>}<span>{toElection !== null && toElection > 0 ? `${toElection} days to election day` : ""}</span><span>{longDate(ELECTION_DAY)}</span></p>
        {next && <p className="sx-vis__foot">{next.source}.</p>}
      </div>
      <div className="sx-ask__decision">
        <p className="sx-vis__kicker"><ShieldCheck size={13} aria-hidden="true" /> One decision</p>
        <p className="sx-ask__claim">The platform is built. One decision puts it to work: choose the scope, and his team runs the campaign through it.</p>
        <ol className="sx-ask__steps">
          <li style={{ "--i": 0 } as React.CSSProperties}><button type="button" onClick={() => jumpTo("receives-sec-21-1")}><span><b>Choose the scope:</b> Firefly recommends the Standard level</span> <ArrowRight size={13} aria-hidden="true" /></button></li>
          <li style={{ "--i": 1 } as React.CSSProperties}><button type="button" onClick={() => jumpTo("timeline-sec-14-1")}><span><b>His team enters its own ninety-day export</b></span> <ArrowRight size={13} aria-hidden="true" /></button></li>
          <li style={{ "--i": 2 } as React.CSSProperties}><button type="button" onClick={() => jumpTo("timeline-sec-14-1")}><span><b>Everything after that is evidence</b> for the team to act on</span> <ArrowRight size={13} aria-hidden="true" /></button></li>
        </ol>
        <div className="sx-ask__cta">
          <a className="sx-btn sx-btn--solid sx-pulse" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Firefly, about the Kitui 2027 platform:")}`} target="_blank" rel="noreferrer"><MessageCircle size={15} aria-hidden="true" /> WhatsApp Firefly</a>
          <a className="sx-btn" href={`tel:+${WHATSAPP}`}><Phone size={15} aria-hidden="true" /> Call</a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 13.2 who does what, seen from one role */

const LETTER: Record<string, string> = { R: "Responsible", A: "Accountable", C: "Consulted", I: "Informed" };

export function RoleLens() {
  const { roles, rows } = mirrors.raci;
  const [role, setRole] = useState(1);
  const by = useMemo(() => {
    const out: Record<string, string[]> = { R: [], A: [], C: [], I: [] };
    for (const r of rows) for (const l of r.cells[role].split("/")) if (out[l]) out[l].push(r.activity);
    return out;
  }, [rows, role]);
  return (
    <Shell kicker="Who does what, from one seat" title="Pick a role to see its part" icon={Users}>
      <div className="sx-seg" role="tablist" aria-label="Role">
        {roles.map((r, i) => <button key={r} type="button" role="tab" aria-selected={i === role} onClick={() => setRole(i)}>{r}</button>)}
      </div>
      <div className="sx-raci-dots" aria-hidden="true">
        {rows.map((r, ri) => (
          <span key={r.activity} className="sx-raci-dots__row">
            {r.cells.map((c, ci) => <i key={ci} data-k={c.includes("A") ? "A" : c.includes("R") ? "R" : c === "C" ? "C" : c === "I" ? "I" : "-"} data-on={ci === role ? "true" : "false"} style={{ "--d": ri * 0.02 } as React.CSSProperties} />)}
          </span>
        ))}
      </div>
      <div className="sx-raci" key={role}>
        {(["R", "A", "C", "I"] as const).map((k, i) => (
          <div key={k} className="sx-raci__col" data-k={k} style={{ "--i": i } as React.CSSProperties}>
            <p><b>{k}</b> {LETTER[k]} <span className="sx-count">{by[k].length}</span></p>
            {by[k].length ? <ul>{by[k].map((a) => <li key={a}>{a}</li>)}</ul> : <p className="sx-muted">None</p>}
          </div>
        ))}
      </div>
      <p className="sx-vis__foot">Read from the table in this section; the table is the record.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 12.4 which language goes where */

const LANGS = [
  { id: "Kikamba", share: 50, does: "WhatsApp, TikTok, Facebook grassroots, voice notes, radio, USSD — not bulk SMS" },
  { id: "Kiswahili", share: 30, does: "General social, national reach, SMS" },
  { id: "English", share: 20, does: "Policy documents, website, X, YouTube, national media" },
];
const CHANNELS: { id: string; langs: string[]; rule?: string }[] = [
  { id: "WhatsApp", langs: ["Kikamba"] },
  { id: "Voice notes", langs: ["Kikamba"] },
  { id: "Radio", langs: ["Kikamba"] },
  { id: "USSD", langs: ["Kikamba"] },
  { id: "TikTok", langs: ["Kikamba"] },
  { id: "Facebook", langs: ["Kikamba", "Kiswahili"] },
  { id: "Bulk SMS", langs: ["Kiswahili", "English"], rule: "Bulk political SMS cannot be sent in Kikamba (Section 15.3.3)." },
  { id: "Website", langs: ["English"] },
  { id: "X", langs: ["English"] },
  { id: "YouTube", langs: ["English"] },
  { id: "National media", langs: ["English", "Kiswahili"] },
];

export function LanguagePicker() {
  const [ch, setCh] = useState("Bulk SMS");
  const c = CHANNELS.find((x) => x.id === ch)!;
  return (
    <Shell kicker="Which language, on which channel" title="Tap a channel to see what it carries" icon={Languages}>
      <div className="sx-chips" role="radiogroup" aria-label="Channel">
        {CHANNELS.map((x) => <button key={x.id} type="button" role="radio" aria-checked={x.id === ch} onClick={() => setCh(x.id)} data-warn={x.rule ? "true" : undefined}>{x.id}</button>)}
      </div>
      <ul className="sx-langs" key={ch}>
        {LANGS.map((l, i) => {
          const on = c.langs.includes(l.id);
          return (
            <li key={l.id} data-on={on ? "true" : "false"} style={{ "--i": i, "--w": l.share / 50 } as React.CSSProperties}>
              <span className="sx-langs__name">{on ? <Check size={14} aria-hidden="true" /> : <span className="sx-langs__x" aria-hidden="true">·</span>}{l.id}</span>
              <span className="sx-langs__track"><span className="sx-langs__fill" /></span>
              <span className="sx-langs__share">{l.share}%</span>
              <span className="sx-langs__does">{l.does}</span>
            </li>
          );
        })}
      </ul>
      {c.rule && <p className="sx-rule"><ShieldCheck size={14} aria-hidden="true" /> {c.rule}</p>}
      <p className="sx-vis__foot">The percentages are the content-mix target for locally facing platforms. Every Kikamba line is signed off by a native speaker before it publishes.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 21.2 the deliverables, by rhythm */

const LANES: { id: string; label: string; test: (c: string) => boolean }[] = [
  { id: "daily", label: "Every day", test: (c) => /^Daily/.test(c) },
  { id: "weekly", label: "Every week", test: (c) => /week/i.test(c) && !/fortnight/i.test(c) },
  { id: "fortnight", label: "Every fortnight", test: (c) => /fortnight/i.test(c) },
  { id: "monthly", label: "Every month", test: (c) => /^Monthly/.test(c) },
  { id: "always", label: "Always on", test: (c) => /^Continuous/.test(c) },
  { id: "once", label: "Once, then on change", test: (c) => /^Once/.test(c) },
];
const who = (by: string) => (/^Firefly/.test(by) ? "firefly" : /^Your team/.test(by) ? "team" : /ground/i.test(by) ? "ground" : "review");
const WHO_LABEL: Record<string, string> = { team: "Your team", firefly: "Firefly", ground: "Ground team", review: "Reviewer" };

export function DeliverablesMap() {
  const items = mirrors.deliverables;
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const counts = useMemo(() => items.reduce<Record<string, number>>((m, d) => { const w = who(d.by); m[w] = (m[w] ?? 0) + 1; return m; }, {}), [items]);
  return (
    <Shell kicker="The deliverables schedule, by rhythm" title={`${counts.team ?? 0} of ${items.length} are your team's own work`} icon={Send} tone="green">
      <div className="sx-chips" role="radiogroup" aria-label="Produced by">
        <button type="button" role="radio" aria-checked={filter === null} onClick={() => setFilter(null)}>Everyone</button>
        {Object.keys(WHO_LABEL).filter((k) => counts[k]).map((k) => <button key={k} type="button" role="radio" aria-checked={filter === k} data-who={k} onClick={() => setFilter(k)}>{WHO_LABEL[k]} · {counts[k]}</button>)}
      </div>
      <div className="sx-lanes">
        {LANES.map((lane, li) => {
          const here = items.filter((d) => lane.test(d.cadence));
          if (!here.length) return null;
          return (
            <div key={lane.id} className="sx-lane" style={{ "--i": li } as React.CSSProperties}>
              <p className="sx-lane__label">{lane.label}</p>
              <ul>
                {here.map((d) => {
                  const w = who(d.by);
                  const dim = filter !== null && filter !== w;
                  return (
                    <li key={d.deliverable} data-who={w} data-dim={dim ? "true" : "false"}>
                      <button type="button" aria-expanded={open === d.deliverable} onClick={() => setOpen(open === d.deliverable ? null : d.deliverable)}>{d.deliverable}</button>
                      {open === d.deliverable && (
                        <span className="sx-lane__more">
                          <span><b>Cadence:</b> {d.cadence}</span>
                          <span><b>Produced by:</b> {d.by}</span>
                          <span><b>Form:</b> {d.form}</span>
                          <button type="button" className="sx-link" onClick={() => jumpTo(`${sectionFor(d.where)}`)}>Where it is set: {d.where} <ArrowRight size={12} aria-hidden="true" /></button>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="sx-vis__foot">Read from the table in this section, at the Standard level&rsquo;s cadence. Tap one for its details.</p>
    </Shell>
  );
}

/** "15.1.2, 13.4" → the first section's live id. */
function sectionFor(where: string): string {
  const n = where.split(",")[0].trim();
  const top = Number(n.split(".")[0]);
  const chapter: Record<number, string> = { 13: "engagement", 14: "timeline", 15: "workstreams", 19: "lawful" };
  return `${chapter[top] ?? "workstreams"}-sec-${n.includes(".") ? n.replace(/\./g, "-") : `${n}-1`}`;
}

/* ------------------------------------------------------------------ 14.4 you are here, in the five phases */

export function PhaseNow() {
  const today = useToday();
  const [ref, inView] = useReveal<HTMLElement>();
  if (!today) return null;
  const sig = t(PLANNING_SIGNATURE), now = t(today), end = t(ELECTION_DAY);
  const range = (p: (typeof PHASES)[number]) => p.dates ? [t(p.dates.start), t(p.dates.end)] : [sig + (p.weeks!.from - 1) * 7 * DAY, sig + p.weeks!.to * 7 * DAY];
  // A phase counted from the go-ahead has no known dates until the go-ahead is given, so only the
  // phases the electoral calendar dates can be live or done (Firefly's decision Q5).
  const live = PHASES.filter((p) => { if (!p.dates) return false; const [a, b] = range(p); return now >= a && now <= b; });
  const at = Math.min(1, Math.max(0, (now - sig) / (end - sig)));
  const days = Math.round((end - now) / DAY);
  return (
    <section ref={ref} className="sx-now" data-in={inView ? "true" : "false"} aria-label="Where the campaign is today">
      <p className="sx-vis__kicker"><Compass size={13} aria-hidden="true" /> You are here · {longDate(today)}</p>
      <p className="sx-now__big">{live.length ? live.map((p) => p.label).join(" and ") : "Between phases"}</p>
      <p className="sx-muted">{days} days to election day · the first two phases count in weeks from the go-ahead</p>
      <div className="sx-now__rail" aria-hidden="true">
        {PHASES.map((p) => {
          const [a, b] = range(p);
          return <span key={p.id} className="sx-now__seg" data-live={live.includes(p) ? "true" : "false"} data-done={p.dates && b < now ? "true" : "false"} data-row={p.weeks ? "weeks" : "dates"} style={{ "--a": (a - sig) / (end - sig), "--b": (b - sig) / (end - sig), background: `var(${p.colorVar}, var(--accent))` } as React.CSSProperties} title={p.label} />;
        })}
        <span className="sx-now__pin" style={{ "--at": at } as React.CSSProperties}><i /></span>
      </div>
      <ul className="sx-now__legend">
        {PHASES.map((p) => { const [, b] = range(p); return <li key={p.id} data-live={live.includes(p) ? "true" : "false"} data-done={p.dates && b < now ? "true" : "false"}><i style={{ background: `var(${p.colorVar}, var(--accent))` }} />{p.label}<small>{p.window.split(" · ")[0]}</small>{p.dates && b < now && <Check size={12} aria-label="done" />}</li>; })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ the fourteen workstreams, at a glance */

export function WorkstreamMap() {
  const [open, setOpen] = useState(false);
  return (
    <section className="sx-wsmap print:hidden" aria-label="The fourteen workstreams">
      <button type="button" className="sx-wsmap__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Layers size={16} aria-hidden="true" />
        <span><b>All fourteen workstreams, at a glance</b><small>Tap one to go straight to it</small></span>
        <ChevronDown size={18} aria-hidden="true" className="sx-chev" />
      </button>
      {open && (
        <div className="sx-wsmap__grid">
          {mirrors.groups.map((g, gi) => (
            <div key={g.number} className="sx-wsmap__group" style={{ "--i": gi } as React.CSSProperties}>
              <p>{g.number} {g.title}</p>
              <ul>
                {mirrors.workstreams.filter((w) => w.group === g.number).map((w) => (
                  <li key={w.id}><button type="button" onClick={() => jumpTo(w.id)}><span className="sx-wsmap__n">{w.number}</span>{w.title}<ArrowRight size={13} aria-hidden="true" /></button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ the platform in one view */

const CHAPTER_LABEL: Record<string, string> = Object.fromEntries(SECTIONS.map((s) => [s.id, s.label]));
const chapterOf = (home: string) => home.split("-sec-")[0];
type Job = { id: string; label: string; icon: typeof Check; chapters?: string[]; group?: string; extra?: { label: string; to: string }[] };
const JOBS: Job[] = [
  { id: "analyse", label: "Analyse", icon: BarChart3, chapters: ["kitui", "needs", "news", "votes", "annex-evidence"] },
  { id: "decide", label: "Decide", icon: Compass, chapters: ["diagnosis", "goal", "message", "voters", "channels"] },
  { id: "direct", label: "Direct the team", icon: Users, group: "Direct the team" },
  { id: "run", label: "Run the channels", icon: RadioIcon, group: "Run the channels", chapters: ["lawful", "annex-playbooks", "annex-technology"] },
  { id: "measure", label: "Measure", icon: Gauge, group: "Measure", chapters: ["success"] },
  { id: "deliver", label: "Deliver", icon: Wrench, group: "Deliver", chapters: ["timeline", "workstreams"] },
];

export function PlatformMap() {
  const [job, setJob] = useState("analyse");
  const [all, setAll] = useState(false);
  const [ref, inView] = useReveal<HTMLElement>();
  const j = JOBS.find((x) => x.id === job)!;
  const tools = TOOL_META.filter((tm) => j.chapters?.includes(chapterOf(tm.home)));
  const records = j.group ? COLLECTIONS.filter((c) => c.group === j.group) : [];
  const LIMIT = 6;
  const shownTools = all ? tools : tools.slice(0, Math.max(0, LIMIT - records.length));
  const R = 38;
  return (
    <section ref={ref} className="sx-pmap print:hidden" data-in={inView ? "true" : "false"} aria-label="The platform in one view">
      <p className="sx-vis__kicker">The platform in one view</p>
      <p className="sx-vis__title">Six jobs, and where in the story the team does each</p>
      <div className="sx-pmap__hub" role="tablist" aria-label="The jobs">
        <svg viewBox="0 0 100 100" aria-hidden="true" className="sx-pmap__lines">
          {JOBS.map((x, i) => { const a = (i / JOBS.length) * Math.PI * 2 - Math.PI / 2; return <line key={x.id} x1="50" y1="50" x2={50 + R * Math.cos(a)} y2={50 + R * Math.sin(a)} data-on={x.id === job ? "true" : "false"} style={{ "--i": i } as React.CSSProperties} />; })}
        </svg>
        <span className="sx-pmap__core">Kitui 2027</span>
        {JOBS.map((x, i) => {
          const a = (i / JOBS.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <button key={x.id} type="button" role="tab" aria-selected={x.id === job} className="sx-pmap__node" style={{ left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%`, "--i": i } as React.CSSProperties} onClick={() => { setJob(x.id); setAll(false); }}>
              <x.icon size={16} aria-hidden="true" /><span>{x.label}</span>
            </button>
          );
        })}
      </div>
      <div className="sx-pmap__list" key={job}>
        {records.map((c, i) => (
          <button key={c.id} type="button" data-kind="record" style={{ "--i": i } as React.CSSProperties} onClick={() => { const home = Object.entries(RECORD_AT).find(([, ids]) => ids.includes(c.id))?.[0]; if (home) jumpTo(home); }}>
            <Table2 size={14} aria-hidden="true" /><span>{c.label}<small>Live record</small></span><ArrowRight size={13} aria-hidden="true" />
          </button>
        ))}
        {shownTools.map((tm, i) => (
          <button key={tm.slug} type="button" style={{ "--i": i + records.length } as React.CSSProperties} onClick={() => jumpTo(tm.home)}>
            <MousePointerClick size={14} aria-hidden="true" /><span>{tm.title}<small>{CHAPTER_LABEL[chapterOf(tm.home)]}</small></span><ArrowRight size={13} aria-hidden="true" />
          </button>
        ))}
        {shownTools.length < tools.length && <button type="button" className="sx-pmap__more" onClick={() => setAll(true)}>Show all {tools.length + records.length}</button>}
        {job === "analyse" && <Link href="/explore" className="sx-pmap__ext"><BookOpen size={14} aria-hidden="true" /><span>Every dataset<small>The data explorer</small></span><ArrowRight size={13} aria-hidden="true" /></Link>}
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ the cover: talk to Firefly */

export function ContactCard() {
  const [ref, inView] = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="sx-contact print:hidden" data-in={inView ? "true" : "false"} aria-label="Talk to Firefly">
      <div>
        <p className="sx-vis__kicker">Prepared by Firefly Management</p>
        <p className="sx-vis__title">Questions about anything here? Ask the people who built it.</p>
      </div>
      <div className="sx-contact__row">
        <a className="sx-btn sx-btn--solid" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Firefly, about the Kitui 2027 platform:")}`} target="_blank" rel="noreferrer"><MessageCircle size={15} aria-hidden="true" /> WhatsApp</a>
        <a className="sx-btn" href={`tel:+${WHATSAPP}`}><Phone size={15} aria-hidden="true" /> Call</a>
        <a className="sx-btn" href={`mailto:${mirrors.contact.email}`}><Mail size={15} aria-hidden="true" /> Email</a>
        <button type="button" className="sx-btn" onClick={() => jumpTo("annex-terms-sec-g-1")}><BookOpen size={15} aria-hidden="true" /> Terms of use</button>
      </div>
    </section>
  );
}

