import mirrors from "@/lib/story/mirrors.generated.json";

/**
 * Firefly Management's office address, phone and email, as the cover prints them
 * (content/cover.md, read by scripts/build-story-mirrors.mjs). Change them on the cover, not here.
 */
export const FIREFLY_CONTACT = mirrors.contact;

export function FireflyContact({ className = "" }: { className?: string }) {
  const c = FIREFLY_CONTACT;
  return (
    <address className={`not-italic ${className}`}>
      <span className="block">Firefly Management · {c.address}</span>
      <span className="block">
        Phone <a className="underline" href={`tel:+${c.intl}`}>{c.phone}</a> · Email <a className="underline" href={`mailto:${c.email}`}>{c.email}</a>
      </span>
    </address>
  );
}
