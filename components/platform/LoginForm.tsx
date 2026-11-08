"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/(platform)/actions";

export function LoginForm({ passwordFirst }: { passwordFirst: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(passwordFirst);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await signIn({ email, password: usePassword ? password : undefined, magic: !usePassword });
      if (!r.ok) { setMsg({ ok: false, text: Object.values(r.errors)[0] }); return; }
      setMsg({ ok: true, text: r.message });
      if (usePassword) { router.push("/workspace"); router.refresh(); }
    });
  };
  return (
    <form onSubmit={submit} className="pf-card space-y-4 p-5">
      <div>
        <label htmlFor="email" className="pf-label">Email</label>
        <input id="email" type="email" autoComplete="email" inputMode="email" className="pf-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      {usePassword && (
        <div>
          <label htmlFor="password" className="pf-label">Password</label>
          <input id="password" type="password" autoComplete="current-password" className="pf-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
      )}
      {msg && <p role={msg.ok ? "status" : "alert"} className={`text-[0.9rem] ${msg.ok ? "text-ink" : "text-danger"}`}>{msg.text}</p>}
      <button type="submit" className="pf-btn pf-btn-solid w-full justify-center" disabled={pending}>{pending ? "…" : usePassword ? "Sign in" : "Email me a sign-in link"}</button>
      <button type="button" className="w-full text-center text-[0.85rem] text-accent" onClick={() => { setUsePassword(!usePassword); setMsg(null); }}>
        {usePassword ? "Use a sign-in link instead" : "Use a password instead"}
      </button>
    </form>
  );
}
