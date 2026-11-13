"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, Check, Clipboard, Filter, Map, MessageSquare, Radio, Search, ShieldCheck, SlidersHorizontal, Users, Wifi } from "lucide-react";
import { ELECTORAL_ARITHMETIC } from "@/data/electoral-arithmetic";
import { fmt, val } from "../../lib/data/read";

type Family = "All" | "Where the votes come from" | "Reach and persuade" | "Deadlines and readiness" | "Daily content work" | "Deeper planning" | "Context and talking points" | "Supporting utilities";
// Only these have a page. Everything else in the list is planned, and says so rather than linking to a 404.
const BUILT = new Set(["ward-dossier", "winning-number", "sources", "service-delivery", "race-calendar", "polling-agents", "nomination-path"]);

type Tool = { id: number; name: string; slug: string; family: Exclude<Family, "All">; description: string; icon: typeof Map; freshness: "Live" | "Ready" | "Data needed" };

const tools: Tool[] = [
  ["Winning-Number Simulator", "winning-number", "Where the votes come from", "How many votes win, under different turnouts.", SlidersHorizontal, "Live"],
  ["Coalition Path Builder", "coalition-path", "Where the votes come from", "Which regional shares add up to the winning number.", BarChart3, "Ready"],
  ["Ward Priority Scorer", "priority-scorer", "Where the votes come from", "Rank the 40 wards with weights you adjust.", Filter, "Ready"],
  ["Ward Dossier", "ward-dossier", "Where the votes come from", "Everything about one ward on one page.", Map, "Ready"],
  ["Kitui Map Studio", "map-studio", "Where the votes come from", "See register, population and projects on the map.", Map, "Ready"],
  ["Pareto Ward Planner", "pareto-wards", "Where the votes come from", "The fewest wards that cover most voters.", Filter, "Ready"],
  ["Register Growth Tracker", "register-growth", "Where the votes come from", "The new voters since 2022 (reported, unconfirmed) and what they do to the winning number.", BarChart3, "Data needed"],
  ["Youth & New Voter Calculator", "youth-voters", "Where the votes come from", "Youth and first-time voters under turnout scenarios (modelled from census age shares).", Users, "Data needed"],
  ["Channel Mix by Sub-county", "channel-mix", "Reach and persuade", "Radio, SMS or in-person needs for each area.", Radio, "Ready"],
  ["Offline Waterline", "offline-waterline", "Reach and persuade", "Voters online against voters reachable only offline.", Wifi, "Ready"],
  ["Message Assignment Matrix", "message-matrix", "Reach and persuade", "Which message goes to which segment, channel and language.", Filter, "Ready"],
  ["Issue-to-Message Matcher", "issue-matcher", "Reach and persuade", "The strongest-evidence issue to lead with for each segment.", MessageSquare, "Ready"],
  ["Service-Delivery Tracker", "service-delivery", "Reach and persuade", "County projects to verify and turn into proof.", ShieldCheck, "Ready"],
  ["Ward Equity Analyzer", "ward-equity", "Reach and persuade", "Project spend per 1,000 voters in each ward.", BarChart3, "Ready"],
  ["Governor Race Calendar", "race-calendar", "Deadlines and readiness", "Every Gazette deadline, passed and upcoming.", BarChart3, "Live"],
  ["Governor Nomination Path", "nomination-path", "Deadlines and readiness", "The remaining confirmations and filings.", ShieldCheck, "Live"],
  ["Polling Agent Planner", "polling-agents", "Deadlines and readiness", "Agents and reserves needed for each station.", Users, "Live"],
  ["Weekly Content Calendar", "calendar", "Daily content work", "The pillars laid out as a week of posts.", BarChart3, "Ready"],
  ["Message Studio", "message-studio", "Daily content work", "Preview one message across every channel.", MessageSquare, "Ready"],
  ["Fact Card Generator", "fact-cards", "Daily content work", "Any site figure as a ready-to-post line with its source.", Clipboard, "Ready"],
  ["Radio Planner", "radio", "Daily content work", "The eight Kikamba stations, their ownership and how to approach each.", Radio, "Ready"],
  ["Ward Comparison", "ward-compare", "Deeper planning", "Two to four wards side by side.", Map, "Ready"],
  ["Constituency Scorecard", "constituency-scorecard", "Deeper planning", "One card per constituency.", Clipboard, "Ready"],
  ["Zone Effort Planner", "zone-effort", "Deeper planning", "Split effort across the Anchor, Arid and Mwingi zones.", SlidersHorizontal, "Ready"],
  ["Voter Density Finder", "voter-density", "Deeper planning", "Where a field day reaches the most voters.", Map, "Ready"],
  ["Ward Allocation Simulator", "allocation", "Deeper planning", "Equal against needs-weighted splits between wards.", SlidersHorizontal, "Ready"],
  ["County Money Explainer", "county-money", "Context and talking points", "The budget, audit queries and pending bills.", BarChart3, "Ready"],
  ["Drought & Livelihood Watch", "drought-watch", "Context and talking points", "Drought, food, prices and livestock.", Radio, "Ready"],
  ["2017 → 2022 Swing Viewer", "swing-viewer", "Context and talking points", "How the governor vote moved, countywide (ward results for 2017 are not yet in hand).", BarChart3, "Data needed"],
  ["USSD Flow Builder", "ussd", "Supporting utilities", "Prototype the USSD menu.", Wifi, "Ready"],
  ["Language & Compliance", "compliance", "Supporting utilities", "Check copy against the SMS guidelines.", ShieldCheck, "Ready"],
  ["KPI Ladder", "kpis", "Supporting utilities", "Test indicator values against the targets.", BarChart3, "Ready"],
  ["Polling Station Explorer", "polling-stations", "Supporting utilities", "Search every 2022 polling station.", Search, "Ready"],
  ["Ward Link & QR Builder", "links", "Supporting utilities", "Trackable links for each ward.", Wifi, "Ready"],
  ["Assumptions Panel", "assumptions", "Supporting utilities", "Test the model's figures.", SlidersHorizontal, "Ready"],
  ["Sources & Data Gaps", "sources", "Supporting utilities", "Where every figure comes from.", ShieldCheck, "Ready"],
].map(([name, slug, family, description, icon, freshness], index) => ({ id: index + 1, name, slug, family, description, icon, freshness } as Tool));

const families: Family[] = ["All", "Where the votes come from", "Reach and persuade", "Deadlines and readiness", "Daily content work", "Deeper planning", "Context and talking points", "Supporting utilities"];

function formatNumber(value: number) { return new Intl.NumberFormat("en-KE").format(value); }

function Simulator() {
  const registerRange = ELECTORAL_ARITHMETIC;
  const [register, setRegister] = useState<number>(registerRange.register2022Certified);
  const [turnout, setTurnout] = useState<number>(61.7);
  const ballots = Math.round(register * turnout / 100);
  const gap = val("benchmark") - Math.round(ballots * 0.5);
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7" aria-labelledby="simulator-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-300">Live model</p><h2 id="simulator-title" className="font-serif text-2xl text-white sm:text-3xl">Winning-number simulator</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">A scenario model, not a forecast or a win probability. Change the base and turnout to see the arithmetic move.</p></div>
        <Link href="/tools/winning-number" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-300/60 hover:text-cyan-200">Open full tool <ArrowUpRight size={14} /></Link>
      </div>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
        <label className="space-y-2 text-sm text-slate-200">Register base <output className="float-right font-mono text-cyan-200">{formatNumber(register)}</output><input aria-label="Register base" type="range" min={registerRange.register2022Certified} max={registerRange.register2026ECVRReported} step="1000" value={register} onChange={(event) => setRegister(Number(event.target.value))} className="mt-3 w-full accent-cyan-300" /></label>
        <label className="space-y-2 text-sm text-slate-200">Turnout <output className="float-right font-mono text-cyan-200">{turnout.toFixed(1)}%</output><input aria-label="Turnout" type="range" min="40" max="80" step="0.1" value={turnout} onChange={(event) => setTurnout(Number(event.target.value))} className="mt-3 w-full accent-cyan-300" /></label>
        <div className="rounded-2xl bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ballots at turnout</p><p className="mt-2 font-mono text-3xl text-white">{formatNumber(ballots)}</p><p className="mt-2 text-xs text-amber-200">Gap to {fmt("benchmark")} at 50% share: {formatNumber(Math.max(0, gap))}</p></div>
      </div>
      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300" style={{ width: `${Math.min(100, ballots / 2253.22)}%` }} /></div>
    </section>
  );
}

export function ToolsHub() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<Family>("All");
  const [copied, setCopied] = useState(false);
  const filtered = useMemo(() => tools.filter((tool) => (family === "All" || tool.family === family) && `${tool.name} ${tool.description}`.toLowerCase().includes(query.toLowerCase())), [family, query]);
  const copyLink = async () => { await navigator.clipboard?.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  return <main className="min-h-screen bg-[#060d1a] text-slate-100">
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5"><Link href="/" className="font-serif text-lg text-white">Kitui 2027 <span className="font-sans text-xs text-slate-400">/ toolkit</span></Link><button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-300/50">{copied ? <Check size={14} /> : <Clipboard size={14} />} {copied ? "Copied" : "Copy link"}</button></header>
      <section className="py-14 sm:py-20"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Daily operating layer</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[0.98] tracking-tight text-white sm:text-7xl">A working toolkit for a clearer route through Kitui.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Explore the data, test a scenario, prepare a message, or make the next field decision. Every number keeps its source and status visible.</p><div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-300"><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2">Data health: amber</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Open access · no accounts</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Aggregate data only</span></div></section>
      <Simulator />
      <section className="mt-16" aria-labelledby="all-tools-title"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workspace</p><h2 id="all-tools-title" className="mt-2 font-serif text-3xl text-white">All tools <span className="font-sans text-base text-slate-500">{filtered.length}/{tools.length}</span></h2></div><label className="flex min-w-[min(100%,22rem)] items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-300"><Search size={16} aria-hidden="true" /><span className="sr-only">Search tools</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools" className="w-full bg-transparent outline-none placeholder:text-slate-500" /></label></div><div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Tool families">{families.map((item) => <button key={item} type="button" role="tab" aria-selected={family === item} onClick={() => setFamily(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${family === item ? "bg-cyan-300 text-slate-950" : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/40"}`}>{item}</button>)}</div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((tool) => { const Icon = tool.icon; const built = BUILT.has(tool.slug); const label = built ? tool.freshness : "Not built yet"; const body = <><div className="flex items-start justify-between gap-4"><span className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200"><Icon size={18} /></span><span className={`rounded-full px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-wider ${label === "Live" ? "bg-emerald-300/10 text-emerald-200" : label === "Data needed" ? "bg-amber-300/10 text-amber-200" : "bg-white/10 text-slate-300"}`}>{label}</span></div><p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{String(tool.id).padStart(2, "0")} · {tool.family}</p><h3 className={`mt-2 text-lg font-semibold text-white ${built ? "group-hover:text-cyan-200" : ""}`}>{tool.name}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{tool.description}</p>{built && <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-slate-300">Open tool <ArrowUpRight size={13} /></span>}</>; return built ? <a key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.07]">{body}</a> : <div key={tool.slug} className="rounded-2xl border border-dashed border-white/10 p-5 opacity-70">{body}</div> })}</div>{filtered.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-400">No tools match that search.</div>}</section>
    </div>
  </main>;
}
