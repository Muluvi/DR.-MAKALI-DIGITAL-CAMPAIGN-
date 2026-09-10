import { TAB_LABELS, type TabId } from "../../lib/heading-slug";

/** Closing banner for a major section, quoting a line already in that section's own text
 * (never new copy) as the section's key takeaway. */
export function KeyTakeawayBanner({ tabId, children }: { tabId: TabId; children: React.ReactNode }) {
  return (
    <span className="key-takeaway-banner not-prose block my-6 sm:my-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-accent/[0.06] to-gold/[0.06] border border-accent/20 print-avoid-break">
      <span className="block t-micro font-black text-accent mb-2">
        Key takeaway — {TAB_LABELS[tabId]}
      </span>
      <span className="block font-serif text-sm sm:text-base font-bold text-ink leading-snug text-balance">{children}</span>
    </span>
  );
}
