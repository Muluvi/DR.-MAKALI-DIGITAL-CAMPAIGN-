"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ToolActions } from "../public/ToolActions";
import type { FigureView, ToolStation, ToolWard } from "@/lib/tools/dataset";
import { Badge, Bar, Card, n0, Note, pct, Select, Slider, Stat, Stats, Table, tierText } from "./ui";

/* ------------------------------------------------------------------ USSD Flow Builder */

type Opt = { key: string; kikamba: string; english: string; does: string };

export function UssdBuilder({ header, menu }: { header: string; menu: Opt[] }) {
  const [head, setHead] = useState(header);
  const [opts, setOpts] = useState<Opt[]>(menu);
  const [lang, setLang] = useState<"both" | "kikamba" | "english">("both");
  const line = (o: Opt) => `${o.key}. ${lang === "english" || !o.kikamba ? o.english : lang === "kikamba" ? o.kikamba : `${o.kikamba} / ${o.english}`}`;
  const screen = [head, ...opts.map(line)].join("\n");
  const len = [...screen].length;
  const set = (i: number, k: keyof Opt, v: string) => setOpts(opts.map((o, j) => (j === i ? { ...o, [k]: v } : o)));
  const json = JSON.stringify({ header: head, options: opts }, null, 2);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <Card>
          <label className="plat-label block">Header<input className="plat-input mt-1 block w-full" value={head} onChange={(e) => setHead(e.target.value)} /></label>
          <div className="mt-3 space-y-3">
            {opts.map((o, i) => (
              <div key={i} className="grid grid-cols-[2.5rem_1fr_1fr_auto] items-end gap-2">
                <input aria-label="Key" className="plat-input" value={o.key} onChange={(e) => set(i, "key", e.target.value)} />
                <input aria-label="Kikamba" className="plat-input" value={o.kikamba} placeholder="Kikamba" onChange={(e) => set(i, "kikamba", e.target.value)} />
                <input aria-label="English" className="plat-input" value={o.english} placeholder="English" onChange={(e) => set(i, "english", e.target.value)} />
                <button type="button" className="plat-btn plat-btn-sm" aria-label={`Remove option ${o.key}`} onClick={() => setOpts(opts.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" className="plat-btn plat-btn-sm mt-3" onClick={() => setOpts([...opts, { key: String(opts.length + 1), kikamba: "", english: "", does: "" }])}>Add an option</button>
          <div className="mt-4"><Select label="Menu language" value={lang} onChange={setLang} options={[{ value: "both", label: "Kikamba / English" }, { value: "kikamba", label: "Kikamba" }, { value: "english", label: "English" }]} /></div>
        </Card>
        <div>
          <div className="mx-auto w-64 rounded-[2rem] bg-[#222] p-4 shadow-lg">
            <pre className="min-h-56 whitespace-pre-wrap rounded-md bg-[#cfd8c8] p-3 font-mono text-[0.72rem] leading-snug text-[#1d2a1a]">{screen}</pre>
            <p className={`mt-2 text-center font-mono text-[0.72rem] ${len > 182 ? "text-[#f2a65a]" : "text-[#bbb]"}`}>{len} / 182 characters</p>
          </div>
          {len > 182 && <p className="mt-2 text-[0.82rem] text-gold">Over 182 characters: most networks cut the screen. Shorten it, or move options to a second page.</p>}
        </div>
      </div>
      <Card>
        <p className="font-semibold text-ink">Vendor file</p>
        <pre className="mt-2 max-h-56 overflow-auto rounded-md bg-paper p-3 font-mono text-[0.75rem] text-ink ring-1 ring-line">{json}</pre>
        <button type="button" className="plat-btn plat-btn-sm mt-2" onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([json], { type: "application/json" })); a.download = "ussd-menu.json"; a.click(); }}>Download JSON</button>
      </Card>
      <Note>A prototype. Kikamba wording must pass the Kikamba reviewer before it goes to the shortcode provider, and the opt-out position is set when the shortcode is provisioned.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ Language and Compliance */

export function Compliance({ smsLimit }: { smsLimit: number }) {
  const [text, setText] = useState("");
  const [lang, setLang] = useState<"english" | "kiswahili" | "kikamba">("kiswahili");
  const [send, setSend] = useState("");
  const [lodged, setLodged] = useState("");
  const [authorised, setAuthorised] = useState(false);
  const [noAttack, setNoAttack] = useState(false);
  const sendAt = send ? new Date(send) : null;
  const lodgedAt = lodged ? new Date(lodged) : null;
  const hoursAhead = sendAt && lodgedAt ? (sendAt.getTime() - lodgedAt.getTime()) / 36e5 : null;
  const hour = sendAt ? sendAt.getHours() + sendAt.getMinutes() / 60 : null;
  const checks = [
    { ok: [...text].length > 0 && [...text].length <= smsLimit, label: `Length: ${[...text].length} of ${smsLimit} characters`, rule: "One SMS, no split messages" },
    { ok: lang !== "kikamba", label: lang === "kikamba" ? "Kikamba is not sent as SMS" : "English or Kiswahili", rule: "SMS carries English and Kiswahili; Kikamba goes by voice note and radio" },
    { ok: /\bSTOP\b/i.test(text), label: /\bSTOP\b/i.test(text) ? "Opt-out included" : "No opt-out found (add \"STOP\" and how to send it)", rule: "Every message carries a clear opt-out" },
    { ok: hoursAhead !== null && hoursAhead >= 48, label: hoursAhead === null ? "Enter the lodging and sending times" : `Lodged ${Math.floor(hoursAhead)} hours before sending`, rule: "Lodged with the operator 48 hours ahead" },
    { ok: hour !== null && hour >= 7 && hour < 19, label: hour === null ? "Enter the sending time" : `Sends at ${sendAt!.toTimeString().slice(0, 5)}`, rule: "Sending window 7am to 7pm (a 2020 draft proposed 8am to 6pm: verify which is in force)" },
    { ok: authorised, label: authorised ? "Signed authorisation attached" : "No signed authorisation yet", rule: "Verbatim text plus signed authorisation, logged against the dispatch record" },
    { ok: noAttack, label: noAttack ? "Checked: no attack on anyone" : "Not yet checked by a person", rule: "No attacks on individuals, families, ethnicity, religion or association" },
  ];
  const passed = checks.filter((c) => c.ok).length;
  return (
    <div className="space-y-4">
      <Card>
        <label className="plat-label block">Message<textarea className="plat-input mt-1 block min-h-24 w-full" value={text} onChange={(e) => setText(e.target.value)} /></label>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Select label="Language" value={lang} onChange={setLang} options={[{ value: "kiswahili", label: "Kiswahili" }, { value: "english", label: "English" }, { value: "kikamba", label: "Kikamba" }]} />
          <label className="plat-label block">Lodged with the operator<input className="plat-input mt-1 block w-full" type="datetime-local" value={lodged} onChange={(e) => setLodged(e.target.value)} /></label>
          <label className="plat-label block">Planned send<input className="plat-input mt-1 block w-full" type="datetime-local" value={send} onChange={(e) => setSend(e.target.value)} /></label>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[0.9rem]">
          <label className="flex items-center gap-2"><input type="checkbox" checked={authorised} onChange={(e) => setAuthorised(e.target.checked)} /> Signed authorisation attached</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={noAttack} onChange={(e) => setNoAttack(e.target.checked)} /> A person has read it for attacks on anyone</label>
        </div>
      </Card>
      <Card>
        <p className="font-semibold text-ink">{passed} of {checks.length} checks pass {passed === checks.length ? <Badge tone="accent">ready for the counterpart</Badge> : <Badge tone="gold">not ready</Badge>}</p>
        <ul className="mt-3 space-y-2">{checks.map((c) => <li key={c.rule} className="text-[0.9rem]"><span className={c.ok ? "text-ink" : "text-gold"}>{c.ok ? "✓" : "✕"} {c.label}</span><span className="block text-[0.78rem] text-muted">{c.rule}</span></li>)}</ul>
      </Card>
      <Note>These are the site&rsquo;s own sending rules, drawn from the Communications Authority&rsquo;s July 2017 political messaging guidelines. Have them checked against the current guidelines by the campaign&rsquo;s reviewer before relying on this for a real send. Nothing is sent from here.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ KPI Ladder */

type K = { code: string; title: string; target: string; targetValue: number | null; unit: "percent" | "count" | null; owner: string; cadence: string; scorecard: string };

export function KpiLadder({ kpis }: { kpis: K[] }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const rows = kpis.map((k) => { const raw = vals[k.code]; const v = raw === undefined || raw === "" ? null : Number(raw); return { k, v, met: v !== null && k.targetValue !== null ? v >= k.targetValue : null }; });
  const entered = rows.filter((r) => r.v !== null);
  return (
    <div className="space-y-4">
      <Stats>
        <Stat label="Indicators" value={String(kpis.length)} />
        <Stat label="Values entered" value={String(entered.length)} />
        <Stat label="At or above target" value={String(rows.filter((r) => r.met === true).length)} tone="good" />
        <Stat label="Below target" value={String(rows.filter((r) => r.met === false).length)} tone="warn" />
      </Stats>
      <div className="space-y-3">
        {rows.map((r) => (
          <Card key={r.k.code}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1"><p className="font-semibold text-ink"><span className="font-mono text-muted">{r.k.code}</span> {r.k.title}</p><p className="text-[0.82rem] text-muted">Target: {r.k.target} · {r.k.owner} · {r.k.cadence} · {r.k.scorecard}</p></div>
              <label className="plat-label w-36">Your value{r.k.unit === "percent" ? " (%)" : ""}<input className="plat-input mt-1 block w-full" type="number" inputMode="decimal" value={vals[r.k.code] ?? ""} onChange={(e) => setVals({ ...vals, [r.k.code]: e.target.value })} /></label>
            </div>
            {r.k.targetValue !== null && r.v !== null && <div className="mt-2"><Bar value={r.v} max={Math.max(r.v, r.k.targetValue) * 1.1} mark={r.k.targetValue} tone={r.met ? "accent" : "gold"} /><p className={`mt-1 text-[0.82rem] ${r.met ? "text-accent" : "text-gold"}`}>{r.met ? "At or above target" : `${r.k.unit === "percent" ? pct(r.k.targetValue - r.v) : n0(r.k.targetValue - r.v)} below target`}</p></div>}
            {r.k.targetValue === null && <p className="mt-2 text-[0.8rem] text-muted">The target depends on the Week 1 baseline, so this one cannot be scored yet.</p>}
          </Card>
        ))}
      </div>
      <ToolActions filename="kpi-ladder.csv" rows={() => [["Code", "Indicator", "Target", "Your value", "Status"], ...rows.map((r) => [r.k.code, r.k.title, r.k.target, r.v ?? "", r.met === null ? "" : r.met ? "met" : "below"])]} link={false} />
      <Note>Values typed here stay in this browser and are not saved. To record a reading for the team, enter it in the KPI tracker in the Workspace.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ Polling Station Explorer */

export function StationExplorer({ stations }: { stations: ToolStation[] }) {
  const [q, setQ] = useState("");
  const [con, setCon] = useState("all");
  const [sort, setSort] = useState<"voters" | "name">("voters");
  const cons = [...new Set(stations.map((s) => s.constituencyName))].sort();
  const list = stations.filter((s) => (con === "all" || s.constituencyName === con) && `${s.station} ${s.centre} ${s.wardName} ${s.code}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (sort === "voters" ? b.voters - a.voters : a.station.localeCompare(b.station)));
  const shown = list.slice(0, 100);
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="plat-label block">Search<input className="plat-input mt-1 block w-full" value={q} onChange={(e) => setQ(e.target.value)} placeholder="station, centre, ward or code" /></label>
          <Select label="Constituency" value={con} onChange={setCon} options={[{ value: "all", label: "All eight" }, ...cons.map((c) => ({ value: c, label: c }))]} />
          <Select label="Sort" value={sort} onChange={setSort} options={[{ value: "voters", label: "Most voters first" }, { value: "name", label: "A to Z" }]} />
        </div>
      </Card>
      <Stats>
        <Stat label="Stations found" value={n0(list.length)} />
        <Stat label="Voters at them" value={n0(list.reduce((s, x) => s + x.voters, 0))} />
        <Stat label="Average per station" value={list.length ? n0(list.reduce((s, x) => s + x.voters, 0) / list.length) : "—"} />
        <Stat label="Showing" value={`${shown.length}`} note={list.length > 100 ? "Download the CSV for all of them" : undefined} />
      </Stats>
      <Table rows={shown} rowKey={(s) => s.code} cols={[
        { key: "s", label: "Station", render: (s) => <>{s.station}<span className="block font-mono text-[0.72rem] text-muted">{s.code}</span></> },
        { key: "c", label: "Centre", render: (s) => <span className="text-muted">{s.centre}</span> },
        { key: "w", label: "Ward", render: (s) => <>{s.wardName}<span className="block text-[0.75rem] text-muted">{s.constituencyName}</span></> },
        { key: "v", label: "Voters", num: true, render: (s) => n0(s.voters) },
      ]} />
      <ToolActions filename="polling-stations.csv" rows={() => [["Code", "Station", "Centre", "Ward", "Constituency", "Voters"], ...list.map((s) => [s.code, s.station, s.centre, s.wardName, s.constituencyName, s.voters])]} link={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ Ward Link and QR Builder */

const CHANNELS = ["sms", "whatsapp", "radio", "poster", "facebook", "tiktok", "baraza"];

function Qr({ text }: { text: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => { QRCode.toString(text, { type: "svg", margin: 1, width: 160 }).then(setSvg).catch(() => setSvg("")); }, [text]);
  return <span className="block h-32 w-32 rounded-md bg-white p-1" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function LinkBuilder({ wards, base }: { wards: ToolWard[]; base: string }) {
  const [url, setUrl] = useState(base);
  const [channel, setChannel] = useState("sms");
  const [campaign, setCampaign] = useState("kitui-2027");
  const [con, setCon] = useState("all");
  const cons = [...new Set(wards.map((w) => w.constituencyName))].sort();
  const valid = /^https?:\/\/\S+$/.test(url);
  const link = (w: ToolWard) => { try { const u = new URL(url); u.searchParams.set("utm_source", channel); u.searchParams.set("utm_medium", w.id); u.searchParams.set("utm_campaign", campaign); return u.toString(); } catch { return ""; } };
  const list = wards.filter((w) => con === "all" || w.constituencyName === con).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="plat-label block">Page to link to<input className="plat-input mt-1 block w-full" value={url} onChange={(e) => setUrl(e.target.value)} /></label>
          <label className="plat-label block">Campaign tag<input className="plat-input mt-1 block w-full" value={campaign} onChange={(e) => setCampaign(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))} /></label>
          <Select label="Channel" value={channel} onChange={setChannel} options={CHANNELS.map((c) => ({ value: c, label: c }))} />
          <Select label="Wards" value={con} onChange={setCon} options={[{ value: "all", label: "All 40 wards" }, ...cons.map((c) => ({ value: c, label: c }))]} />
        </div>
        {!valid && <p className="mt-2 text-[0.85rem] text-gold">Enter a full web address, starting with https://</p>}
      </Card>
      {valid && (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((w) => (
            <Card key={w.id} className="flex items-center gap-3">
              <Qr text={link(w)} />
              <div className="min-w-0"><p className="font-semibold text-ink">{w.name}</p><p className="text-[0.78rem] text-muted">{w.constituencyName}</p><p className="mt-1 break-all font-mono text-[0.7rem] text-muted">{link(w)}</p></div>
            </Card>
          ))}
        </div>
      )}
      {valid && <ToolActions filename={`ward-links-${channel}.csv`} rows={() => [["Ward", "Constituency", "Link"], ...list.map((w) => [w.name, w.constituencyName, link(w)])]} link={false} />}
      <Note>Each link carries the channel, the ward and the campaign tag, so a visit can be counted by ward in the site&rsquo;s or a page&rsquo;s analytics. The links record nothing about the person who opens them.</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ Assumptions Panel */

export function AssumptionsPanel({ f, modelled, winnerShare }: { f: Record<string, FigureView>; modelled: FigureView[]; winnerShare: number }) {
  const v = (id: string) => f[id].value ?? 0;
  const [reg, setReg] = useState<"2022" | "2026">("2026");
  const [t, setT] = useState(v("turnout.2022"));
  const [share, setShare] = useState(winnerShare);
  const [inet, setInet] = useState(v("ict.internet"));
  const [q, setQ] = useState("");
  const register = reg === "2022" ? v("register.2022") : v("register.2026");
  const win = register * (t / 100) * (share / 100);
  const online = register * (inet / 100);
  const list = modelled.filter((m) => `${m.id} ${m.note ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Register" value={reg} onChange={setReg} options={[{ value: "2026", label: `July 2026, ${n0(v("register.2026"))} (reported, unconfirmed)` }, { value: "2022", label: `2022, ${n0(v("register.2022"))} (IEBC)` }]} />
          <Slider label="Turnout" value={t} onChange={setT} min={40} max={85} step={0.1} suffix="%" hint={`2022 certified: ${pct(v("turnout.2022"))}`} />
          <Slider label="Winner's share of valid votes" value={share} onChange={setShare} min={30} max={75} step={0.1} suffix="%" hint={`2022 winner: ${pct(winnerShare)}`} />
          <Slider label="Internet use" value={inet} onChange={setInet} min={10} max={70} step={0.1} suffix="%" hint={`CA/KNBS 2023/24: ${pct(v("ict.internet"))}`} />
        </div>
      </Card>
      <Stats>
        <Stat label="Winning number" value={n0(win)} tone="good" note={`Published: ${n0(v("benchmark.2026-equivalent"))} on the 2026 register`} />
        <Stat label="Ballots cast" value={n0(register * (t / 100))} />
        <Stat label="Reachable online" value={n0(online)} note={`Published: ${n0(v("reach.smartphone"))}`} />
        <Stat label="Online reach ÷ winning number" value={pct((online / win) * 100, 0)} />
      </Stats>
      <Card>
        <p className="font-semibold text-ink">Every calculated figure and target on the site ({modelled.length})</p>
        <input className="plat-input mt-2 block w-full" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or method" aria-label="Search the figures" />
        <ul className="mt-3 max-h-96 space-y-2 overflow-y-auto">{list.map((m) => <li key={m.id} className="border-t border-line pt-2 text-[0.85rem]"><span className="flex justify-between gap-3"><span className="font-mono text-ink">{m.id}</span><strong className="font-mono">{m.display}</strong></span><span className="block text-muted">{m.note ?? "—"} <Badge>{m.state === "target" ? "target" : `calculated, ${tierText(m.tier)} inputs`}</Badge></span></li>)}</ul>
      </Card>
      <Note>Changing a slider changes this page only. The published figures stay as they are; the team changes them in the data editor, where the site&rsquo;s checks run.</Note>
    </div>
  );
}

