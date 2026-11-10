"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/(platform)/actions";
import { confetti, sound } from "@/lib/fx/feedback";

/**
 * Team sign-in.
 *
 * The form's motion (app/fx-suite.css, "Form"): labels float above a field once it is focused or
 * filled; a focused field glows; a field that fails validation on leaving it says why beneath it;
 * a rejected sign-in shakes the form and slides its message in; and the submit button morphs from
 * idle to a spinner to a drawn checkmark. Every state is also stated in words, in a live region.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm({ passwordFirst }: { passwordFirst: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(passwordFirst);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [touched, setTouched] = useState(false);
  const [shake, setShake] = useState(0);
  const [pending, start] = useTransition();
  const emailBad = touched && email.length > 0 && !EMAIL.test(email);
  const state = pending ? "loading" : msg?.ok ? "success" : "idle";

  useEffect(() => {
    if (!shake) return;
    const t = window.setTimeout(() => setShake(0), 600);
    return () => window.clearTimeout(t);
  }, [shake]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!EMAIL.test(email)) {
      setShake((n) => n + 1);
      sound("error");
      return;
    }
    start(async () => {
      const r = await signIn({ email, password: usePassword ? password : undefined, magic: !usePassword });
      if (!r.ok) {
        setMsg({ ok: false, text: Object.values(r.errors)[0] });
        setShake((n) => n + 1);
        sound("error");
        return;
      }
      setMsg({ ok: true, text: r.message });
      sound("success");
      const b = document.querySelector<HTMLElement>(".fx-submit");
      const rect = b?.getBoundingClientRect();
      confetti(rect ? rect.left + rect.width / 2 : undefined, rect ? rect.top : undefined, 60);
      if (usePassword) {
        router.push("/workspace");
        router.refresh();
      }
    });
  };
  return (
    <form onSubmit={submit} noValidate className="plat-card fx-form space-y-4 p-5" data-shake={shake ? "true" : undefined}>
      <div className="fx-field" data-filled={email ? "true" : "false"} data-invalid={emailBad ? "true" : undefined}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          className="plat-input fx-field__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder=" "
          aria-invalid={emailBad || undefined}
          aria-describedby={emailBad ? "email-err" : undefined}
          required
        />
        <label htmlFor="email" className="plat-label fx-field__label">Email</label>
        {email && (
          <button
            type="button"
            className="fx-field__clear"
            aria-label="Clear the email"
            onClick={() => {
              setEmail("");
              setTouched(false);
              document.getElementById("email")?.focus();
            }}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {emailBad && (
          <p id="email-err" className="fx-field__err">
            That doesn&rsquo;t look like an email address.
          </p>
        )}
      </div>
      {usePassword && (
        <div className="fx-field" data-filled={password ? "true" : "false"}>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="plat-input fx-field__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="password" className="plat-label fx-field__label">Password</label>
        </div>
      )}
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`fx-msg text-[0.9rem] ${msg.ok ? "text-ink" : "text-danger"}`} data-ok={msg.ok ? "true" : "false"}>
          {msg.text}
        </p>
      )}
      <button type="submit" className="plat-btn plat-btn-solid fx-submit w-full justify-center" data-state={state} disabled={pending} aria-busy={pending || undefined}>
        <span className="fx-submit__label">{usePassword ? "Sign in" : "Email me a sign-in link"}</span>
        <span className="fx-submit__spin" aria-hidden="true" />
        <svg className="fx-submit__check" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
        </svg>
        {pending && <span className="sr-only">Signing in…</span>}
      </button>
      <button
        type="button"
        className="fx-link w-full text-center text-[0.85rem] text-accent"
        onClick={() => {
          setUsePassword(!usePassword);
          setMsg(null);
        }}
      >
        {usePassword ? "Use a sign-in link instead" : "Use a password instead"}
      </button>
    </form>
  );
}
