"use client";

import { useMemo, useState } from "react";
import { checkSend, LANGUAGE_OPTIONS, RAIL_OPTIONS, SMS_LIMIT, type SendInputs } from "@/lib/models/send-check";
import { addDays } from "@/lib/models/rollout";
import { nairobiToday } from "@/lib/models/rollout-defaults";
import { EXAMPLES } from "@/lib/models/instruct/examples";
import { parseSend } from "@/lib/models/instruct/parse";
import { explainSend } from "@/lib/models/instruct/explain";
import { ToolShell } from "../ToolShell";
import { InstructionBox } from "./InstructionBox";

function Model() {
  const today = useMemo(() => nairobiToday(), []);
  const [v, setV] = useState<SendInputs>(() => ({ rail: "SMS", language: "Kiswahili", date: addDays(today, 7), sendTime: "10:00", lodgedOn: addDays(today, 4), message: "" }));
  const result = useMemo(() => checkSend(v), [v]);
  const set = (k: keyof SendInputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });
  const sms = v.rail === "SMS";
  const instruct = (text: string) => {
    const r = parseSend(text, v, RAIL_OPTIONS, LANGUAGE_OPTIONS, today);
    setV(r.next);
    return r;
  };
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="panel grid gap-3 sm:grid-cols-2">
          <label className="field">Rail<select className="input" value={v.rail} onChange={set("rail")}>{RAIL_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></label>
          <label className="field">Language<select className="input" value={v.language} onChange={set("language")}>{LANGUAGE_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></label>
          <label className="field">Send date<input className="input" type="date" value={v.date} onChange={set("date")} /></label>
          <label className="field">Send time (24-hour)<input className="input" type="text" inputMode="numeric" placeholder="09:30" maxLength={5} value={v.sendTime} onChange={set("sendTime")} /></label>
          <label className="field sm:col-span-2">Lodged with the operator on<input className="input" type="date" value={v.lodgedOn} onChange={set("lodgedOn")} /><span className="hint">Leave empty if it has not been lodged yet.</span></label>
          <label className="field sm:col-span-2">Message text
            <textarea className="input" rows={4} value={v.message} onChange={set("message")} />
            <span className={`hint ${sms && v.message.length > SMS_LIMIT ? "is-bad" : ""}`}>{v.message.length} characters{sms ? ` of ${SMS_LIMIT}` : ""}. Do not type names or phone numbers.</span>
          </label>
        </div>
        <div className="result" style={{ marginTop: 0 }} aria-live="polite">
          <p className="kicker">Outcome</p>
          <p className="h3" style={{ marginTop: 6 }}>{result.allowed ? "Allowed" : "Refused"}</p>
          {result.allowed ? (
            <p>{result.ruled ? `This ${v.rail} send passes every rule: language, send time, length and lodging date.` : `No rule refuses a ${v.rail} send; the campaign's opt-in and content rules still apply.`}</p>
          ) : (
            <ul className="m-0 pl-5">{result.refusals.map((r) => <li key={r}>{r}</li>)}</ul>
          )}
          <p className="small muted" style={{ marginTop: 10 }}>The rules for political SMS: English or Kiswahili only (Kikamba goes by WhatsApp or voice note); sent between 08:00 and 17:00; {SMS_LIMIT} characters or fewer; lodged with the operator at least 48 hours before the send date.</p>
        </div>
      </div>
      <InstructionBox onRun={instruct} explanation={explainSend(result, v.rail)} examples={EXAMPLES["send-check"]} />
    </div>
  );
}

export default function SendCheck() {
  return (
    <ToolShell kicker="Tool" title="Send check" question="Would a planned SMS, USSD, WhatsApp or voice send pass the dispatch rules? Change the rail, language, time and dates to test it." source="Source: Communications Authority guidelines on political messaging, July 2017">
      <Model />
    </ToolShell>
  );
}
