"use client";

import { useId, useState } from "react";

/**
 * Type what to try in plain words ("turnout 70% in Mwingi North"); the model's own rules
 * (lib/models/instruct/parse.ts) set the inputs and the outcome is explained in sentences
 * (lib/models/instruct/explain.ts). Read on this device, nothing sent, nothing kept.
 */
export function InstructionBox({ examples, onRun, explanation, placeholder }: {
  examples: string[];
  onRun: (text: string) => { understood: string[]; unclear: string[] };
  explanation: string[];
  placeholder?: string;
}) {
  const id = useId();
  const [text, setText] = useState("");
  const [last, setLast] = useState<{ understood: string[]; unclear: string[] } | null>(null);
  const run = (t: string) => {
    if (!t.trim()) return;
    setText(t);
    setLast(onRun(t));
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <form className="panel" onSubmit={(e) => { e.preventDefault(); run(text); }}>
        <label htmlFor={`${id}-t`} className="field">Type what to try
          <textarea id={`${id}-t`} className="input" rows={2} value={text} placeholder={placeholder ?? examples[0]} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); run(text); } }} />
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="submit" className="btn btn-sm btn-solid">Apply</button>
          {examples.map((ex) => <button key={ex} type="button" className="btn btn-sm" onClick={() => run(ex)}>{ex}</button>)}
        </div>
        {last && (
          <div className="mt-3 small" role="status">
            {last.understood.length > 0 && <p className="m-0"><strong>Set:</strong> {last.understood.join("; ")}.</p>}
            {last.unclear.length > 0 && <p className="m-0 mt-1 muted"><strong>Not understood, so nothing changed for:</strong> &ldquo;{last.unclear.join("”, “")}&rdquo;. Use the wording in the examples, or the controls below.</p>}
            {!last.understood.length && !last.unclear.length && <p className="m-0 muted">Nothing to apply.</p>}
          </div>
        )}
      </form>
      <div className="result" aria-live="polite" style={{ marginTop: 0 }}>
        <p className="kicker" style={{ marginBottom: 6 }}>In plain words</p>
        {explanation.map((s) => <p key={s}>{s}</p>)}
      </div>
    </div>
  );
}
