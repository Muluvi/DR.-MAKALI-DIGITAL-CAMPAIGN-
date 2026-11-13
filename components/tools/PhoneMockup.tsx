"use client";

import { useEffect, useRef, useState } from "react";
import { WHATSAPP } from "@/lib/phone-showcase";
import { PLAN_ITEMS, SMS_LIMIT, SMS_SPECIMENS, USSD_HEADER, USSD_MENU, USSD_SHORTCODE_PLACEHOLDER } from "@/data/ussd-specimen";
import { ToolShell } from "./ToolShell";

type Tab = "whatsapp" | "ussd" | "sms";
const TABS: { id: Tab; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "ussd", label: "USSD" },
  { id: "sms", label: "SMS" },
];

/** A plain phone frame: CSS only, sized to fit a 360px screen with room around it. */
function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div role="img" aria-label={label} style={{ width: "min(100%, 300px)", margin: "0 auto", padding: 10, borderRadius: 36, background: "oklch(0.2 0.02 262)", boxShadow: "var(--shadow)" }}>
      <div style={{ height: 520, borderRadius: 28, overflow: "hidden", display: "flex", flexDirection: "column", background: "oklch(0.97 0.01 85)", color: "oklch(0.22 0.03 262)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 18px 4px", fontSize: 12, fontWeight: 600 }}><span>09:41</span><span>2G ▮▮▯</span></div>
        {children}
      </div>
    </div>
  );
}

function WhatsApp() {
  return (
    <Frame label={`A WhatsApp thread with ${WHATSAPP.contactName}`}>
      <div style={{ padding: "10px 14px", background: "oklch(0.42 0.09 165)", color: "white" }}>
        <p className="m-0 font-bold" style={{ fontSize: 15 }}>{WHATSAPP.contactName}</p>
        <p className="m-0" style={{ fontSize: 12, opacity: 0.85 }}>{WHATSAPP.contactStatus}</p>
      </div>
      <div style={{ flex: 1, padding: 12, display: "grid", alignContent: "start", gap: 8, background: "oklch(0.93 0.02 85)", fontSize: 14 }}>
        <p className="m-0" style={{ justifySelf: "center", fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "white" }}>{WHATSAPP.dateDivider}</p>
        {WHATSAPP.thread.map((m, i) => {
          const mine = m.from === "resident";
          return (
            <div key={i} style={{ justifySelf: mine ? "end" : "start", maxWidth: "85%", padding: "8px 10px", borderRadius: 10, background: mine ? "oklch(0.92 0.08 150)" : "white" }}>
              {m.kind === "voice" ? <span>▶ Voice note from Dr. Mulu · {"duration" in m ? m.duration : ""}</span> : <span>{"text" in m ? m.text : ""}</span>}
              <span style={{ display: "block", textAlign: "right", fontSize: 10, opacity: 0.6 }}>{m.time}</span>
            </div>
          );
        })}
      </div>
      <div style={{ padding: 10, background: "oklch(0.93 0.02 85)" }}><div style={{ padding: "8px 14px", borderRadius: 20, background: "white", fontSize: 13, opacity: 0.6 }}>{WHATSAPP.composerPlaceholder}</div></div>
    </Frame>
  );
}

type Screen = { kind: "dial" } | { kind: "sending" } | { kind: "menu" } | { kind: "option"; key: string };

function Ussd() {
  const [lang, setLang] = useState<"kikamba" | "english">("kikamba");
  const [screen, setScreen] = useState<Screen>({ kind: "dial" });
  const [reply, setReply] = useState("");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const go = (next: Screen) => {
    setScreen({ kind: "sending" });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setScreen(next), 600);
  };
  const choose = (key: string) => {
    setReply("");
    if (key === "6") { setLang((l) => (l === "kikamba" ? "english" : "kikamba")); go({ kind: "menu" }); return; }
    if (USSD_MENU.some((o) => o.key === key)) go({ kind: "option", key });
  };
  const line = (o: (typeof USSD_MENU)[number]) => (lang === "kikamba" && o.kikamba ? o.kikamba : o.english);
  const opt = screen.kind === "option" ? USSD_MENU.find((o) => o.key === screen.key) : null;
  return (
    <Frame label="A USSD menu on a basic phone">
      <div style={{ flex: 1, display: "grid", alignContent: "center", padding: 14, fontFamily: "ui-monospace, monospace", fontSize: 14 }}>
        {screen.kind === "dial" && (
          <div style={{ textAlign: "center" }}>
            <p className="m-0" style={{ fontSize: 13, opacity: 0.7 }}>Dial {USSD_SHORTCODE_PLACEHOLDER}</p>
            <button type="button" className="btn btn-solid" style={{ marginTop: 14 }} onClick={() => go({ kind: "menu" })}>Call</button>
          </div>
        )}
        {screen.kind === "sending" && <p className="m-0" style={{ textAlign: "center" }} role="status">Sending…</p>}
        {(screen.kind === "menu" || screen.kind === "option") && (
          <div style={{ padding: 12, borderRadius: 8, background: "white", boxShadow: "0 1px 4px rgb(0 0 0 / 0.15)" }}>
            <p className="m-0 font-bold">{USSD_HEADER}</p>
            {screen.kind === "menu" ? (
              <ol className="m-0 p-0" style={{ listStyle: "none", marginTop: 6 }}>
                {USSD_MENU.map((o) => <li key={o.key}><button type="button" style={{ textAlign: "left", minHeight: 32, width: "100%" }} onClick={() => choose(o.key)}>{o.key}. {line(o)}</button></li>)}
              </ol>
            ) : opt ? (
              <div style={{ marginTop: 6 }}>
                <p className="m-0">{line(opt)}</p>
                {opt.key === "1" ? <ol className="m-0" style={{ paddingLeft: 18, marginTop: 4 }}>{PLAN_ITEMS.map((p) => <li key={p}>{p}</li>)}</ol> : <p className="m-0" style={{ marginTop: 4, opacity: 0.8 }}>{opt.does}</p>}
                <p className="m-0" style={{ marginTop: 6 }}>0. Back</p>
              </div>
            ) : null}
            <form style={{ display: "flex", gap: 6, marginTop: 10 }} onSubmit={(e) => { e.preventDefault(); if (reply.trim() === "0") go({ kind: "menu" }); else choose(reply.trim()); }}>
              <label className="sr-only" htmlFor="ussd-reply">Reply</label>
              <input id="ussd-reply" className="input" style={{ minHeight: 36, padding: "4px 8px", fontFamily: "inherit" }} inputMode="numeric" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply" />
              <button type="submit" className="btn btn-sm">Send</button>
              <button type="button" className="btn btn-sm" onClick={() => { setScreen({ kind: "dial" }); setReply(""); }}>Cancel</button>
            </form>
          </div>
        )}
      </div>
      <p className="m-0" style={{ padding: "8px 14px", fontSize: 12, opacity: 0.7 }}>Menu language: {lang === "kikamba" ? "Kikamba" : "English"} (option 6 switches it)</p>
    </Frame>
  );
}

function Sms() {
  const [i, setI] = useState(0);
  const s = SMS_SPECIMENS[i];
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Message type">
        {SMS_SPECIMENS.map((x, n) => <button key={x.type} type="button" className="btn btn-sm" aria-pressed={i === n} onClick={() => setI(n)}>{x.type}</button>)}
      </div>
      <Frame label={`An SMS: ${s.type}`}>
        <div style={{ flex: 1, padding: 14, display: "grid", alignContent: "start", gap: 8, fontSize: 14 }}>
          <p className="m-0 font-bold" style={{ fontSize: 13 }}>KITUI NA MULU</p>
          <div style={{ padding: "8px 10px", borderRadius: 12, background: "white", boxShadow: "0 1px 3px rgb(0 0 0 / 0.12)" }}>{s.english}</div>
          <p className="m-0" style={{ fontSize: 12, opacity: 0.7 }}>{s.english.length} of {SMS_LIMIT} characters · {s.frequency}</p>
        </div>
      </Frame>
      <p className="m-0 small muted">{s.structure}. Kikamba and Kiswahili versions are written and reverse-checked by named speakers before release.</p>
    </div>
  );
}

function Phones() {
  const [tab, setTab] = useState<Tab>("whatsapp");
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Channel">
        {TABS.map((t) => <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className="btn btn-sm" onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      <div role="tabpanel" aria-label={TABS.find((t) => t.id === tab)!.label}>
        {tab === "whatsapp" ? <WhatsApp /> : tab === "ussd" ? <Ussd /> : <Sms />}
      </div>
    </div>
  );
}

export default function PhoneMockup() {
  return (
    <ToolShell kicker="Channels" title="The offline layer on one phone" question="What a resident sees on WhatsApp, on a USSD menu and by SMS. Tap through the USSD menu as a basic-phone user would." source="Source: the campaign's SMS copy samples and USSD menu tree.">
      <Phones />
    </ToolShell>
  );
}
