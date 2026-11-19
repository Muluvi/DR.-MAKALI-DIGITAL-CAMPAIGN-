import { resolveFigure } from "../../lib/card/spec";
import { ExportableVisual } from "../visual/ExportableVisual";

/**
 * The offline-majority chapter's point, as a short WhatsApp exchange (visual upgrade, C25).
 *
 * The two people are made up, and the visual says so where the reader looks first; every number
 * they quote is a registry figure, resolved here, so the conversation can never drift from the
 * data. Nothing in it is presented as a real message.
 */
export function ChatExplainer() {
  const internet = resolveFigure({ id: "ict.internet", label: "use the internet" });
  const offline = resolveFigure({ id: "ict.offline", label: "of residents offline" });
  const phone = resolveFigure({ id: "ict.phone", label: "own a mobile phone" });
  const lines: { who: "a" | "b"; text: string }[] = [
    { who: "a", text: "Did you see Dr. Mulu's post on Facebook?" },
    { who: "b", text: `Most people here never will. Only ${internet.display} of Kitui uses the internet. ${offline.display} are offline.` },
    { who: "a", text: "So how does a message reach them?" },
    { who: "b", text: `Radio in Kikamba, and the phone. ${phone.display} own one, and a basic keypad phone is enough for an SMS or the USSD menu.` },
    { who: "a", text: "And the rest?" },
    { who: "b", text: "Market days, the church on Sunday, and the money agent's kiosk. That is where the vote is." },
  ];
  return (
    <ExportableVisual
      id="chat-explainer"
      illustrative
      title="The offline majority, in one conversation"
      note="Two made-up people, real numbers."
      figures={[internet, offline, phone]}
    >
      <div className="cx" role="log" aria-label="An illustrative conversation">
        <p className="cx__who">
          <span>A cousin in Nairobi</span>
          <span>A trader in Kitui</span>
        </p>
        <ol className="cx__thread">
          {lines.map((l, i) => (
            <li key={i} className={`cx__msg cx__msg--${l.who} xv-rise`} style={{ "--i": i } as React.CSSProperties}>
              <span className="sr-only">{l.who === "a" ? "Cousin in Nairobi: " : "Trader in Kitui: "}</span>
              {l.text}
            </li>
          ))}
        </ol>
      </div>
    </ExportableVisual>
  );
}
