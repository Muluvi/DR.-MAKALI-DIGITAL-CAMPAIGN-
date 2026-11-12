"use client";

import { useEffect, useMemo, useState } from "react";
import { checkSend, LANGUAGE_OPTIONS, RAIL_OPTIONS, SMS_LIMIT, type SendInputs } from "@/lib/models/send-check";
import { addDays } from "@/lib/models/rollout";
import { InstructionBox } from "./InstructionBox";
import { parseSend } from "@/lib/models/instruct/parse";
import { explainSend } from "@/lib/models/instruct/explain";

const KEYS = ["rail", "language", "date", "sendTime", "lodgedOn"] as const;

export function SendCheck({ today, initial, embedded = false }: { today: string; initial: Partial<Record<(typeof KEYS)[number], string>>; embedded?: boolean }) {
  const [v, setV] = useState<SendInputs>(() => ({
    rail: RAIL_OPTIONS.includes(initial.rail ?? "") ? initial.rail! : RAIL_OPTIONS[0],
    language: LANGUAGE_OPTIONS.includes(initial.language ?? "") ? initial.language! : "Kiswahili",
    date: initial.date ?? addDays(today, 7),
    sendTime: initial.sendTime ?? "10:00",
    lodgedOn: initial.lodgedOn ?? addDays(today, 4),
    message: "",
  }));

  // The message is never put in the link: a shared link carries the settings, not the words.
  useEffect(() => {
    if (embedded) return;
    const p = new URLSearchParams();
    for (const k of KEYS) if (v[k]) p.set(k, v[k]);
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [v, embedded]);

  const result = useMemo(() => checkSend(v), [v]);
  const set = (k: keyof SendInputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });
  const length = v.message.length;
  const sms = v.rail === "SMS";

  const instruct = (text: string) => {
    const r = parseSend(text, v, RAIL_OPTIONS, LANGUAGE_OPTIONS, today);
    setV(r.next);
    return r;
  };
  return (
    <div>
      <InstructionBox onRun={instruct} explanation={explainSend(result, v.rail)} examples={["SMS in Kiswahili at 10am on 20 March, lodged on 17 March", "SMS in Kikamba at 6pm tomorrow, not lodged", "WhatsApp in Kikamba today at 7pm"]} />
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="plat-card grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <label className="plat-label">Rail
          <select className="plat-input mt-1" value={v.rail} onChange={set("rail")}>{RAIL_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select>
        </label>
        <label className="plat-label">Language
          <select className="plat-input mt-1" value={v.language} onChange={set("language")}>{LANGUAGE_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select>
        </label>
        <label className="plat-label">Send date
          <input className="plat-input mt-1" type="date" value={v.date} onChange={set("date")} required />
        </label>
        <label className="plat-label">Send time (24-hour)
          <input className="plat-input mt-1" type="text" inputMode="numeric" placeholder="09:30" maxLength={5} value={v.sendTime} onChange={set("sendTime")} />
        </label>
        <label className="plat-label sm:col-span-2">Lodged with the operator on
          <input className="plat-input mt-1" type="date" value={v.lodgedOn} onChange={set("lodgedOn")} />
          <span className="plat-hint block">Leave empty if it has not been lodged yet.</span>
        </label>
        <label className="plat-label sm:col-span-2">Message text
          <textarea className="plat-input mt-1" rows={4} value={v.message} onChange={set("message")} aria-describedby="send-count" />
          <span id="send-count" className={`plat-hint block ${sms && length > SMS_LIMIT ? "text-[color:var(--danger)]" : ""}`}>{length} character{length === 1 ? "" : "s"}{sms ? ` of ${SMS_LIMIT}` : ""}. Do not type names or phone numbers. The text stays in your browser and is not put in the link.</span>
        </label>
      </div>

      <section className="plat-card p-4 sm:p-5" aria-live="polite" aria-labelledby="send-verdict">
        <p className="plat-kicker">Outcome</p>
        <h2 id="send-verdict" className="mt-2 font-serif text-3xl text-ink">{result.allowed ? "Allowed" : "Refused"}</h2>
        {result.allowed ? (
          result.ruled ? (
            <p className="mt-2 text-ink">The dispatch log would accept this {v.rail} send: language, send time, length and lodging date all pass its rules.</p>
          ) : (
            <p className="mt-2 text-ink">The dispatch log sets no rule for the {v.rail} rail, so nothing here refuses it. That is not clearance: the campaign&apos;s opt-in and content rules still apply.</p>
          )
        ) : (
          <>
            <p className="mt-2 text-ink">The dispatch log would refuse it, for {result.refusals.length === 1 ? "this reason" : `these ${result.refusals.length} reasons`}:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink">{result.refusals.map((r) => <li key={r}>{r}</li>)}</ul>
          </>
        )}
        <h3 className="mt-5 font-semibold text-ink">The rules it runs, for political SMS</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-[0.88rem] text-muted">
          <li>English or Kiswahili only; Kikamba goes by WhatsApp or voice note</li>
          <li>Sent between 08:00 and 17:00</li>
          <li>{SMS_LIMIT} characters or fewer</li>
          <li>Lodged with the operator at least 48 hours before the send date</li>
        </ul>
      </section>
    </div>
    </div>
  );
}
