"use client";

import { useId, useState, type ReactNode } from "react";
import { Eye } from "lucide-react";

/**
 * "Did you know?" (visual upgrade, C26): the question first, the answer on a tap. The answer is in
 * the HTML from the start (a closed fold), so find-in-page, print and a reader without script all
 * reach it; the tap only decides when a sighted reader sees it.
 */
export function RevealCard({ question, answer, aside }: { question: ReactNode; answer: ReactNode; aside?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="rv" data-open={open ? "true" : "false"}>
      <p className="rv__k">Did you know?</p>
      <p className="rv__q">{question}</p>
      <button type="button" className="rv__btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <Eye size={16} aria-hidden="true" /> {open ? "Hide the answer" : "Show the answer"}
      </button>
      <div id={id} className="rv__a" hidden={!open}>
        {answer}
        {aside}
      </div>
    </div>
  );
}
