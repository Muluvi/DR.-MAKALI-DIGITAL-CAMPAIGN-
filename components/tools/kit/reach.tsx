"use client";

import { useMemo, useState } from "react";
import { ToolActions } from "../public/ToolActions";
import type { CensusRow, IssueRow, ToolWard } from "@/lib/tools/dataset";
import { Badge, Bar, Card, ksh, n0, Note, pct, Select, Slider, Stat, Stats, Table } from "./ui";

/* ------------------------------------------------------------------ Channel Mix by Sub-county */

export function ChannelMix({ rows, county, latest }: { rows: CensusRow[]; county: { phonePct: number | null; internetPct: number | null }; latest: { internet: number; phone: number } }) {
  const [basis, setBasis] = useState<"2019" | "2024">("2019");
  const ki = basis === "2024" && county.internetPct ? latest.internet / county.internetPct : 1;
  const kp = basis === "2024" && county.phonePct ? latest.phone / county.phonePct : 1;
  const mix = rows.map((r) => {
    const phone = Math.min(100, r.phonePct * kp);
    const online = Math.min(phone, r.internetPct * ki);
    return { r, online, smsOnly: phone - online, offline: 100 - phone };
  }).sort((a, b) => b.offline - a.offline);
  const tot = mix.reduce((s, m) => ({ a: s.a + m.r.adults, on: s.on + (m.r.adults * m.online) / 100, sms: s.sms + (m.r.adults * m.smsOnly) / 100, off: s.off + (m.r.adults * m.offline) / 100 }), { a: 0, on: 0, sms: 0, off: 0 });
  return (
    <div className="space-y-4">
      <Card><Select label="Rates" value={basis} onChange={setBasis} options={[{ value: "2019", label: "2019 census, by sub-county (measured)" }, { value: "2024", label: "Scaled to the 2023/24 county rates (modelled)" }]} /></Card>
      <Stats>
        <Stat label="Adults" value={n0(tot.a)} note="18 and over, 2019 census" />
        <Stat label="Online: digital and WhatsApp" value={pct((tot.on / tot.a) * 100)} />
        <Stat label="Phone, not online: SMS and USSD" value={pct((tot.sms / tot.a) * 100)} />
        <Stat label="No phone: radio and in person" value={pct((tot.off / tot.a) * 100)} tone="warn" />
      </Stats>
      <Table rows={mix} rowKey={(m) => m.r.subcounty} caption="Sorted by the share with no phone: the sub-counties where radio and the ground team carry the message." cols={[
        { key: "s", label: "Sub-county", render: (m) => m.r.subcounty },
        { key: "a", label: "Adults", num: true, render: (m) => n0(m.r.adults) },
        { key: "on", label: "Online", num: true, render: (m) => pct(m.online) },
        { key: "sms", label: "SMS/USSD only", num: true, render: (m) => pct(m.smsOnly) },
        { key: "off", label: "Radio/in person", num: true, render: (m) => pct(m.offline) },
        { key: "lead", label: "Lead channel", render: (m) => (m.offline >= Math.max(m.online, m.smsOnly) ? <Badge tone="gold">Radio, in person</Badge> : m.smsOnly >= m.online ? <Badge>SMS, USSD</Badge> : <Badge tone="accent">Digital</Badge>) },
      ]} />
      <Note>Sub-counties are KNBS administrative units and do not map one-to-one onto the eight constituencies. A share is of adults living there, not of registered voters.</Note>
      <ToolActions filename="channel-mix.csv" rows={() => [["Sub-county", "Adults", "Online %", "SMS/USSD only %", "No phone %"], ...mix.map((m) => [m.r.subcounty, m.r.adults, m.online.toFixed(1), m.smsOnly.toFixed(1), m.offline.toFixed(1)])]} link={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ Offline Waterline */

export function OfflineWaterline({ register, internet, phone, benchmark }: { register: number; internet: number; phone: number; benchmark: number }) {
  const [i, setI] = useState(internet);
  const [p, setP] = useState(phone);
  const online = register * (Math.min(i, p) / 100);
  const sms = register * ((p - Math.min(i, p)) / 100);
  const none = register - online - sms;
  const offlineNeeded = Math.max(0, benchmark - online);
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Slider label="Internet use" value={i} onChange={setI} min={10} max={70} step={0.1} suffix="%" hint={`Measured: ${pct(internet)} (CA/KNBS 2023/24)`} />
          <Slider label="Phone ownership" value={p} onChange={setP} min={30} max={90} step={0.1} suffix="%" hint={`Measured: ${pct(phone)} (CA/KNBS 2023/24)`} />
        </div>
      </Card>
      <Stats>
        <Stat label="Reachable online" value={n0(online)} />
        <Stat label="Phone, not online" value={n0(sms)} />
        <Stat label="No phone" value={n0(none)} tone="warn" />
        <Stat label="Benchmark votes beyond digital reach" value={n0(offlineNeeded)} tone={offlineNeeded > 0 ? "warn" : "good"} note={online >= benchmark ? "Digital reach alone now exceeds the benchmark (it would not all vote, or vote for him)" : "Even if every online voter voted for him"} />
      </Stats>
      <Card>
        <p className="font-semibold text-ink">The waterline</p>
        <div className="mt-3 flex h-8 w-full overflow-hidden rounded-md ring-1 ring-line" role="img" aria-label={`Online ${pct((online / register) * 100)}, phone only ${pct((sms / register) * 100)}, no phone ${pct((none / register) * 100)}`}>
          <span className="bg-accent-solid" style={{ width: `${(online / register) * 100}%` }} />
          <span className="bg-gold-solid" style={{ width: `${(sms / register) * 100}%` }} />
          <span className="bg-line" style={{ width: `${(none / register) * 100}%` }} />
        </div>
        <p className="mt-2 text-[0.82rem] text-muted">Blue: online. Laterite: phone, not online. Grey: no phone. On the July 2026 register of {n0(register)} (reported, unconfirmed).</p>
        <div className="mt-3"><Bar value={online} max={register} mark={benchmark} /><p className="mt-1 text-[0.8rem] text-muted">The line is the {n0(benchmark)}-vote benchmark.</p></div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ Message Assignment Matrix */

const LANG_BY_CHANNEL = ["Kikamba", "English or Kiswahili only (SMS cannot carry Kikamba)", "Kikamba", "English, Sheng, Kiswahili", "Kikamba, Kiswahili"];

export function MessageMatrix({ segments, channels }: { segments: string[][]; channels: string[][] }) {
  const [s, setS] = useState(0);
  const [c, setC] = useState(0);
  const seg = segments[s], ch = channels[c];
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Segment" value={String(s)} onChange={(v) => setS(Number(v))} options={segments.map((r, i) => ({ value: String(i), label: r[0].split(" — ")[0] }))} />
          <Select label="Channel" value={String(c)} onChange={(v) => setC(Number(v))} options={channels.map((r, i) => ({ value: String(i), label: r[0].split(" — ")[0].split(" (")[0] }))} />
        </div>
      </Card>
      <Card>
        <p className="plat-kicker">The assignment</p>
        <dl className="mt-2 space-y-3 text-[0.92rem]">
          <div><dt className="font-semibold text-ink">Segment</dt><dd className="text-muted">{seg[0]}</dd></div>
          <div><dt className="font-semibold text-ink">Message and Kikamba framing</dt><dd className="text-ink">{seg[1]}</dd></div>
          <div><dt className="font-semibold text-ink">Evidence behind it</dt><dd className="text-muted">{seg[2]}</dd></div>
          <div><dt className="font-semibold text-ink">Channel and reach</dt><dd className="text-muted">{ch[0]}</dd></div>
          <div><dt className="font-semibold text-ink">Format and tone on this channel</dt><dd className="text-ink">{ch[1]}</dd></div>
          <div><dt className="font-semibold text-ink">Proof points this channel carries</dt><dd className="text-muted">{ch[2]}</dd></div>
          <div><dt className="font-semibold text-ink">Language</dt><dd className="text-ink">{LANG_BY_CHANNEL[c] ?? "As the brief sets"}</dd></div>
        </dl>
      </Card>
      <ToolActions filename="message-matrix.csv" rows={() => [["Segment", "Channel", "Message", "Format", "Language", "Evidence"], ...segments.flatMap((sg) => channels.map((chn, j) => [sg[0], chn[0], sg[1], chn[1], LANG_BY_CHANNEL[j] ?? "", sg[2]]))]} link={false} />
      <Note>Messages, framings and evidence are the site&rsquo;s own message-by-segment and message-by-channel tables (Platform playbooks). Claims marked there as awaiting documents stay unpublished until they are in hand.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ Issue-to-Message Matcher */

const KEYWORDS: Record<string, string[]> = {
  "Water and drought": ["water", "borehole", "pans", "drought"],
  "County finance and accountability": ["budget", "audit", "fiscal", "debt", "salaries", "wastage"],
  "Farming and food security": ["ndengu", "farm", "harvest", "livestock", "feed", "veterinary", "storage"],
  "Household economics and poverty": ["poverty", "capital", "loans", "table-banking", "msme", "permit"],
  "How county money is split between wards": ["ward", "allocation", "formula"],
  "Youth, jobs and registration": ["youth", "boda", "licences", "tvet", "innovation"],
  "Mui Basin coal": ["coal", "mui"],
  "Record and delivery": ["cdf", "hansard", "record", "project log"],
};

export function IssueMatcher({ issues, segments, notes }: { issues: IssueRow[]; segments: string[][]; notes: string[] }) {
  const ranked = [...issues].sort((a, b) => b.score - a.score);
  const matches = useMemo(() => segments.map((sg) => {
    const text = sg.join(" ").toLowerCase();
    const hits = ranked.filter((i) => (KEYWORDS[i.issue] ?? []).some((k) => text.includes(k)));
    return { sg, lead: hits[0] ?? null, also: hits.slice(1) };
  }), [segments, ranked]);
  return (
    <div className="space-y-4">
      <Card>
        <p className="font-semibold text-ink">Issues, by the strength of the evidence behind them</p>
        <ul className="mt-3 space-y-2">{ranked.map((i) => <li key={i.issue} className="text-[0.9rem]"><span className="flex items-center justify-between gap-3"><span className="text-ink">{i.issue}</span><span className="font-mono text-muted">{i.score.toFixed(2)} · Tier {i.tier}</span></span><Bar value={i.score} max={1} /><span className="mt-1 block text-[0.78rem] text-muted">{i.note}</span></li>)}</ul>
      </Card>
      <Table rows={matches} rowKey={(m) => m.sg[0]} caption="For each segment, the strongest-evidence issue its own message already speaks to." cols={[
        { key: "s", label: "Segment", render: (m) => m.sg[0].split(" — ")[0] },
        { key: "l", label: "Lead with", render: (m) => (m.lead ? <strong>{m.lead.issue}</strong> : <span className="text-muted">No issue in the matrix matches yet</span>) },
        { key: "a", label: "Also carries", render: (m) => <span className="text-muted">{m.also.map((i) => i.issue).join("; ") || "—"}</span> },
      ]} />
      <Note>{notes.join(" ")} The match is by named keywords in each segment&rsquo;s message and evidence: {Object.entries(KEYWORDS).map(([k, v]) => `${k}: ${v.join(", ")}`).join(" · ")}.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ Ward Equity Analyzer */

export function WardEquity({ wards }: { wards: ToolWard[] }) {
  const [by, setBy] = useState<"ksh" | "count">("ksh");
  const rows = wards.map((w) => ({ w, ksh1k: (w.projectsKsh / w.voters) * 1000, p1k: (w.projects / w.voters) * 1000 }));
  const metric = (r: (typeof rows)[number]) => (by === "ksh" ? r.ksh1k : r.p1k);
  const sorted = [...rows].sort((a, b) => metric(a) - metric(b));
  const totKsh = wards.reduce((s, w) => s + w.projectsKsh, 0), totV = wards.reduce((s, w) => s + w.voters, 0), totP = wards.reduce((s, w) => s + w.projects, 0);
  const avg = by === "ksh" ? (totKsh / totV) * 1000 : (totP / totV) * 1000;
  const max = Math.max(...rows.map(metric));
  return (
    <div className="space-y-4">
      <Card><Select label="Measure" value={by} onChange={setBy} options={[{ value: "ksh", label: "Project spend per 1,000 voters" }, { value: "count", label: "Projects per 1,000 voters" }]} /></Card>
      <Stats>
        <Stat label="County average" value={by === "ksh" ? ksh(avg) : avg.toFixed(2)} note="per 1,000 registered voters" />
        <Stat label="Below average" value={`${rows.filter((r) => metric(r) < avg).length} wards`} tone="warn" />
        <Stat label="Lowest" value={sorted[0].w.name} note={by === "ksh" ? ksh(metric(sorted[0])) : metric(sorted[0]).toFixed(2)} />
        <Stat label="Highest" value={sorted[sorted.length - 1].w.name} note={by === "ksh" ? ksh(metric(sorted[sorted.length - 1])) : metric(sorted[sorted.length - 1]).toFixed(2)} />
      </Stats>
      <Table rows={sorted} rowKey={(r) => r.w.id} cols={[
        { key: "w", label: "Ward", render: (r) => <>{r.w.name} {r.w.pool && <Badge tone="gold">pool</Badge>}<span className="block text-[0.75rem] text-muted">{r.w.constituencyName}</span></> },
        { key: "v", label: by === "ksh" ? "KSh / 1,000 voters" : "Projects / 1,000", num: true, render: (r) => (by === "ksh" ? n0(r.ksh1k) : r.p1k.toFixed(2)) },
        { key: "b", label: "", render: (r) => <span className="block w-28"><Bar value={metric(r)} max={max} mark={avg} tone={metric(r) < avg ? "gold" : "accent"} /></span> },
        { key: "p", label: "Projects", num: true, render: (r) => r.w.projects },
        { key: "k", label: "Spend", num: true, render: (r) => ksh(r.w.projectsKsh) },
      ]} />
      <Note>From the county&rsquo;s Three-Year Scorecard: the 401 itemised projects placed on a ward, not the county budget. A project listed for several wards counts in each. The line in each bar is the county average.</Note>
      <ToolActions filename="ward-equity.csv" rows={() => [["Ward", "Constituency", "Voters", "Projects", "Spend KSh", "KSh per 1,000 voters", "Projects per 1,000 voters"], ...sorted.map((r) => [r.w.name, r.w.constituencyName, r.w.voters, r.w.projects, r.w.projectsKsh, Math.round(r.ksh1k), r.p1k.toFixed(2)])]} link={false} />
    </div>
  );
}
