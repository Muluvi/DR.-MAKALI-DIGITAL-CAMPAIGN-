"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, Check, Clipboard, Filter, Map, MessageSquare, Radio, Search, ShieldCheck, SlidersHorizontal, Users, Wifi } from "lucide-react";
import { ELECTORAL_ARITHMETIC } from "@/data/electoral-arithmetic";

type Family = "All" | "Data & targeting" | "Messaging & channels" | "Ground & field" | "Measurement & reach";
type Tool = { id: number; name: string; slug: string; family: Exclude<Family, "All">; description: string; icon: typeof Map; freshness: "Live" | "Ready" | "Data needed" };

const tools: Tool[] = [
  ["Ward Dossier", "ward-dossier", "Data & targeting", "One-page intelligence brief for every ward.", Map, "Ready"],
  ["Kitui Map Studio", "map-studio", "Data & targeting", "Switch layers from register size to captain coverage.", Map, "Ready"],
  ["Winning-Number Simulator", "winning-number", "Data & targeting", "Test turnout and regional share scenarios.", SlidersHorizontal, "Live"],
  ["Coalition Path Builder", "coalition-path", "Data & targeting", "Build a transparent route to the benchmark.", BarChart3, "Ready"],
  ["Ward Priority Scorer", "priority-scorer", "Data & targeting", "Rank focus wards with visible weights.", Filter, "Data needed"],
  ["Presence Audit Loader", "presence-audit", "Data & targeting", "Load an aggregate social export locally.", Wifi, "Data needed"],
  ["Published Margin Tracker", "published-margins", "Data & targeting", "Keep each published round separate by source.", BarChart3, "Ready"],
  ["Assumptions Panel", "assumptions", "Data & targeting", "Inspect and locally test model constants.", SlidersHorizontal, "Live"],
  ["Sources & Data Gaps", "sources", "Data & targeting", "Search conflicts, owners and resolution paths.", ShieldCheck, "Ready"],
  ["Register Growth Tracker", "register-growth", "Data & targeting", "Track the 2022 to 2026 register change.", BarChart3, "Data needed"],
  ["Message Studio", "message-studio", "Messaging & channels", "Write once and preview across channels.", MessageSquare, "Ready"],
  ["USSD Flow Builder", "ussd", "Messaging & channels", "Prototype menus and export vendor-ready JSON.", Wifi, "Ready"],
  ["WhatsApp Template Planner", "whatsapp", "Messaging & channels", "Plan opt-in templates without sending.", MessageSquare, "Data needed"],
  ["Message Assignment Matrix", "message-matrix", "Messaging & channels", "Map message, segment, channel and language.", Filter, "Ready"],
  ["Language & Compliance", "compliance", "Messaging & channels", "Check copy length, language and rule risks.", ShieldCheck, "Live"],
  ["Weekly Content Calendar", "calendar", "Messaging & channels", "Turn pillars into a practical weekly brief.", BarChart3, "Ready"],
  ["Radio Planner", "radio", "Messaging & channels", "Plan stations, slots and monitoring posture.", Radio, "Data needed"],
  ["Rapid Response Runbook", "response", "Messaging & channels", "Follow the decision tree to a holding line.", ShieldCheck, "Ready"],
  ["Rumour Log", "rumours", "Messaging & channels", "Track claims in aggregate by channel and ward.", MessageSquare, "Data needed"],
  ["Field Network Tracker", "field-network", "Ground & field", "See assigned versus target counts by ward.", Users, "Data needed"],
  ["Market-Day Planner", "markets", "Ground & field", "Plan the weekly caravan rotation.", Map, "Ready"],
  ["Event Saturation Heatmap", "events", "Ground & field", "Find under-served and over-served wards.", BarChart3, "Data needed"],
  ["Service-Delivery Tracker", "service-delivery", "Ground & field", "Make public projects easy to verify and share.", ShieldCheck, "Data needed"],
  ["Ward Allocation Simulator", "allocation", "Ground & field", "Compare equal and needs-weighted formulas.", SlidersHorizontal, "Ready"],
  ["Data Update Wizard", "data-update", "Ground & field", "Validate files and download a clean diff.", Check, "Live"],
  ["KPI Ladder Dashboard", "kpis", "Measurement & reach", "Connect weekly indicators to the threshold.", BarChart3, "Data needed"],
  ["Rival & Ad-Library Monitor", "rivals", "Measurement & reach", "Compare public activity over one window.", BarChart3, "Data needed"],
  ["Ward Link & QR Builder", "links", "Measurement & reach", "Create traceable ward and channel links.", Wifi, "Ready"],
  ["Offline Waterline", "offline-waterline", "Measurement & reach", "Measure the field layer against the digital layer.", Radio, "Ready"],
  ["After-Action Review", "review", "Measurement & reach", "Capture learning without naming individuals.", Clipboard, "Ready"],
].map(([name, slug, family, description, icon, freshness], index) => ({ id: index + 1, name, slug, family, description, icon, freshness } as Tool));

const families: Family[] = ["All", "Data & targeting", "Messaging & channels", "Ground & field", "Measurement & reach"];

function formatNumber(value: number) { return new Intl.NumberFormat("en-KE").format(value); }

function Simulator() {
  const registerRange = ELECTORAL_ARITHMETIC;
  const [register, setRegister] = useState(registerRange.register2022Certified);
  const [turnout, setTurnout] = useState(61.7);
  const ballots = Math.round(register * turnout / 100);
  const gap = 200000 - Math.round(ballots * 0.5);
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7" aria-labelledby="simulator-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cyan-300">Live model</p><h2 id="simulator-title" className="font-serif text-2xl text-white sm:text-3xl">Winning-number simulator</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">A scenario model, not a forecast or a win probability. Change the base and turnout to see the arithmetic move.</p></div>
        <Link href="/tools/winning-number" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-300/60 hover:text-cyan-200">Open full tool <ArrowUpRight size={14} /></Link>
      </div>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
        <label className="space-y-2 text-sm text-slate-200">Register base <output className="float-right font-mono text-cyan-200">{formatNumber(register)}</output><input aria-label="Register base" type="range" min={registerRange.register2022Certified} max={registerRange.register2026ECVRReported} step="1000" value={register} onChange={(event) => setRegister(Number(event.target.value))} className="mt-3 w-full accent-cyan-300" /></label>
        <label className="space-y-2 text-sm text-slate-200">Turnout <output className="float-right font-mono text-cyan-200">{turnout.toFixed(1)}%</output><input aria-label="Turnout" type="range" min="40" max="80" step="0.1" value={turnout} onChange={(event) => setTurnout(Number(event.target.value))} className="mt-3 w-full accent-cyan-300" /></label>
        <div className="rounded-2xl bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ballots at turnout</p><p className="mt-2 font-mono text-3xl text-white">{formatNumber(ballots)}</p><p className="mt-2 text-xs text-amber-200">Gap to 200,000 at 50% share: {formatNumber(Math.max(0, gap))}</p></div>
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
      <section className="py-14 sm:py-20"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Daily operating layer</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[0.98] tracking-tight text-white sm:text-7xl">Thirty tools for a clearer route through Kitui.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Explore the data, test a scenario, prepare a message, or make the next field decision. Every number keeps its source and status visible.</p><div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-300"><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2">Data health: amber</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Open access · no accounts</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Aggregate data only</span></div></section>
      <Simulator />
      <section className="mt-16" aria-labelledby="all-tools-title"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workspace</p><h2 id="all-tools-title" className="mt-2 font-serif text-3xl text-white">All tools <span className="font-sans text-base text-slate-500">{filtered.length}/30</span></h2></div><label className="flex min-w-[min(100%,22rem)] items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-300"><Search size={16} aria-hidden="true" /><span className="sr-only">Search tools</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools" className="w-full bg-transparent outline-none placeholder:text-slate-500" /></label></div><div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Tool families">{families.map((item) => <button key={item} type="button" role="tab" aria-selected={family === item} onClick={() => setFamily(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${family === item ? "bg-cyan-300 text-slate-950" : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/40"}`}>{item}</button>)}</div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((tool) => { const Icon = tool.icon; return <a key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.07]"><div className="flex items-start justify-between gap-4"><span className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200"><Icon size={18} /></span><span className={`rounded-full px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-wider ${tool.freshness === "Live" ? "bg-emerald-300/10 text-emerald-200" : tool.freshness === "Data needed" ? "bg-amber-300/10 text-amber-200" : "bg-white/10 text-slate-300"}`}>{tool.freshness}</span></div><p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{String(tool.id).padStart(2, "0")} · {tool.family}</p><h3 className="mt-2 text-lg font-semibold text-white group-hover:text-cyan-200">{tool.name}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{tool.description}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-slate-300">Open tool <ArrowUpRight size={13} /></span></a> })}</div>{filtered.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-400">No tools match that search.</div>}</section>
    </div>
  </main>;
}
