"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveMember } from "@/app/(platform)/actions";

type M = { email: string; name: string; role: "team" | "firefly"; active: boolean; addedAt: string };

export function MemberAdmin({ members, self }: { members: M[]; self: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", name: "", role: "team" as "team" | "firefly" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const run = (input: Parameters<typeof saveMember>[0], clear = false) =>
    start(async () => {
      const r = await saveMember(input);
      setMsg(r.ok ? { ok: true, text: r.message } : { ok: false, text: Object.values(r.errors).join(" ") });
      if (r.ok && clear) setForm({ email: "", name: "", role: "team" });
      router.refresh();
    });
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <form className="pf-card space-y-4 p-4 sm:p-5" onSubmit={(e) => { e.preventDefault(); run({ ...form, active: true }, true); }}>
        <h2 className="font-serif text-xl">Add a team member</h2>
        <label className="block"><span className="pf-label">Name</span><input className="pf-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="block"><span className="pf-label">Email</span><input className="pf-input" type="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block"><span className="pf-label">Role</span>
          <select className="pf-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as M["role"] })}>
            <option value="team">Campaign team: edits records and data</option>
            <option value="firefly">Firefly: also manages accounts</option>
          </select>
        </label>
        {msg && <p role={msg.ok ? "status" : "alert"} className={`text-[0.9rem] ${msg.ok ? "" : "text-danger"}`}>{msg.text}</p>}
        <button className="pf-btn pf-btn-solid" disabled={pending} type="submit">Add and send sign-in invitation</button>
      </form>
      <ul className="space-y-2">
        {members.length === 0 && <li className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">No team accounts yet.</li>}
        {members.map((m) => (
          <li key={m.email} className={`pf-card flex flex-wrap items-center justify-between gap-3 p-4 ${m.active ? "" : "opacity-60"}`}>
            <div className="min-w-0">
              <p className="font-semibold text-ink">{m.name} <span className="pf-chip ml-1">{m.role === "firefly" ? "Firefly" : "Team"}</span>{!m.active && <span className="pf-chip ml-1">Removed</span>}</p>
              <p className="truncate text-[0.82rem] text-muted">{m.email}</p>
            </div>
            {m.email !== self && (
              <button type="button" className="pf-btn pf-btn-sm" disabled={pending} onClick={() => { if (m.active && !window.confirm(`Remove ${m.name}? They lose edit access at once. Their past changes stay in the history.`)) return; run({ email: m.email, name: m.name, role: m.role, active: !m.active, invite: false }); }}>
                {m.active ? "Remove" : "Restore"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
