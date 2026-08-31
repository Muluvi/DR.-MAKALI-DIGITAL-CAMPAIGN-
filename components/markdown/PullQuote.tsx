import { Quote } from "lucide-react";

/** Visually distinct pull quote — larger and more prominent than a regular blockquote, used
 * only for the handful of lines the proposal itself treats as its central claims. */
export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="pull-quote not-prose relative my-8 py-2 pl-6 sm:pl-8 border-l-4 border-gold print-avoid-break">
      <Quote size={28} className="absolute -left-1 -top-1 text-gold/20 -scale-x-100" aria-hidden="true" />
      {/* A <div>, not a <p> — children is blockquote content already wrapped in its own <p>
          by the markdown pipeline, and nested <p> tags are invalid HTML (silent hydration
          mismatch: the browser auto-closes the outer one during SSR parsing). */}
      <div className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-ink leading-snug text-balance [&_p]:m-0">{children}</div>
    </div>
  );
}
