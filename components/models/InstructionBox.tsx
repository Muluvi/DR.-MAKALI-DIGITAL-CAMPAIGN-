"use client";

import { useId, useState } from "react";

/**
 * Plain-language instructions for a model, and the outcome explained in words. The visitor types
 * what to try; the model's own parser (lib/models/instruct/parse.ts) sets the options, the model
 * computes, and the explanation (lib/models/instruct/explain.ts) says what came out.
 *
 * It reads by rule first, in the visitor's browser: free, offline, nothing sent. Only when part of an
 * instruction cannot be placed does it ask the optional AI step (app/api/instruct/route.ts), which
 * runs only if Firefly has set an AI key; the AI's rewrite is parsed by the same rules and shown to
 * the visitor, so nothing it does is hidden. Nothing is stored either way.
 */
export function InstructionBox({ model, examples, onRun, explanation, placeholder }: {
  model: string;
  examples: string[];
  onRun: (text: string) => { understood: string[]; unclear: string[] };
  explanation: string[];
  placeholder?: string;
}) {
  const id = useId();
  const [text, setText] = useState("");
  const [last, setLast] = useState<{ understood: string[]; unclear: string[]; aiRead?: string; aiNote?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (t: string) => {
    if (!t.trim() || busy) return;
    setText(t);
    const first = onRun(t);
    setLast(first);
    if (!first.unclear.length || (typeof navigator !== "undefined" && !navigator.onLine)) return;
    // Part of it could not be placed by rule: ask the optional AI step to rewrite it.
    setBusy(true);
    try {
      const res = await fetch("/api/instruct", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug: model, text: t }) });
      const data = (await res.json()) as { enabled?: boolean; instruction?: string | null; error?: string };
      if (!data.enabled) return;
      if (data.instruction) {
        const second = onRun(data.instruction);
        setLast({ ...second, aiRead: data.instruction });
      } else {
        setLast({ ...first, aiNote: data.error ?? "The AI could not place it either, so nothing more was changed." });
      }
    } catch {
      // Offline or the AI step is unreachable: the rule reading stands.
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="plat-card mb-4 p-4 sm:p-5" aria-labelledby={`${id}-h`}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <h2 id={`${id}-h`} className="font-serif text-xl text-ink">Tell the model what to try</h2>
          <form className="mt-2" onSubmit={(e) => { e.preventDefault(); run(text); }}>
            <label htmlFor={`${id}-t`} className="sr-only">Instruction</label>
            <textarea id={`${id}-t`} className="plat-input" rows={2} value={text} placeholder={placeholder ?? examples[0]} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); run(text); } }} />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button type="submit" className="plat-btn plat-btn-sm plat-btn-solid" disabled={busy}>{busy ? "Reading…" : "Apply"}</button>
              <span className="text-[0.8rem] text-muted">or try:</span>
              {examples.map((ex) => <button key={ex} type="button" className="plat-chip hover:border-accent" onClick={() => run(ex)}>{ex}</button>)}
            </div>
          </form>
          {last && (
            <div className="mt-3 text-[0.85rem]" role="status">
              {last.aiRead && <p className="mb-1 text-muted"><span className="font-semibold">Read by AI as:</span> &ldquo;{last.aiRead}&rdquo;</p>}
              {last.understood.length > 0 && <p className="text-ink"><span className="font-semibold">Set:</span> {last.understood.join("; ")}.</p>}
              {last.unclear.length > 0 && <p className="mt-1 text-muted"><span className="font-semibold">Not understood, so nothing changed for:</span> &ldquo;{last.unclear.join("”, “")}&rdquo;. Try the wording in the examples, or set it with the controls below.</p>}
              {last.aiNote && <p className="mt-1 text-muted">{last.aiNote}</p>}
              {!last.understood.length && !last.unclear.length && <p className="text-muted">Nothing to apply.</p>}
            </div>
          )}
          <p className="plat-hint mt-3">Read on your device, by rule, and nothing is stored. If part of it is not understood and the site&apos;s AI step is switched on, that instruction is sent to it to be reworded, and you see what it read. It only sets the options below; the model does the arithmetic, and every number comes from it.</p>
        </div>
        <div className="rounded-xl bg-paper p-3" aria-live="polite">
          <p className="plat-kicker">In plain words</p>
          <ul className="mt-2 space-y-1.5 text-[0.9rem] text-ink">{explanation.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
