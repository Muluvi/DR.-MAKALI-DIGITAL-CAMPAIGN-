"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { useInView } from "../../hooks/use-in-view";
import { useRipple } from "../../hooks/use-pointer-fx";

/**
 * Every one of the document's 262 headings renders through this component, which makes it the
 * one place where a visual decision reaches the whole proposal rather than one surface of it.
 *
 * That is also why the treatment here is restrained and *differentiated* rather than lavish and
 * uniform. Two levels, two signatures:
 *
 *   - A sub-section (h2) opens a new argument. It gets a clip wipe from the left, a left bar that
 *     is a brand gradient rather than a flat rule, and a hairline that runs out to the right
 *     margin — the visual equivalent of a new chapter heading.
 *   - A part (h3) is a step inside an argument already open. It rises a few pixels and nothing
 *     more, because 190-odd of the 262 are h3s and anything stronger would turn a long read into
 *     a strobe.
 *
 * Both are IntersectionObserver-gated and fire once, so scrolling back up a 55,000-word document
 * never replays anything.
 */

function CopyLinkButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const ripple = useRipple<HTMLAnchorElement>();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API can be denied (permissions, insecure context); the href fallback below still works.
    }
    if (window.__navigateToSection) window.__navigateToSection(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <a
      href={`#${id}`}
      onClick={handleCopy}
      onPointerDown={ripple}
      aria-label="Copy link to this section"
      title={copied ? "Link copied" : "Copy link to this section"}
      // Visibility is handled in CSS, not here: the button hides until hover ONLY where there is
      // a real hover to reveal it with. On a touch screen there is none, so it stays visible —
      // a `group-hover` utility alone would have made it permanently invisible on a phone, which
      // is the device this document is most likely to be read on.
      data-copied={copied ? "true" : undefined}
      // The target is 44×44 and the chip inside it is 28. Padding grows the box and an equal
      // negative margin gives the space back to the layout, so the heading line is unchanged
      // and the thumb still gets a full target. A ::after overlay was tried first and does not
      // work: it paints over the gap but the anchor's own box stays 28px, so neither a hit
      // test nor an audit tool sees the larger area.
      className="section-anchor-btn fx-ripple-host fx-press fx-focus inline-flex items-center justify-center p-2 -m-2 align-middle shrink-0 no-underline print:hidden cursor-pointer text-muted hover:text-accent"
    >
      {/* The tick draws itself rather than appearing, and the button pops once — the whole
          confirmation is 400ms and needs no toast. */}
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line/60 transition-colors group-hover:border-accent/50 sm:h-6 sm:w-6 sm:rounded-md">
        {copied ? <Check size={12} className="text-accent fx-badge-pop" /> : <Link2 size={12} />}
      </span>
    </a>
  );
}

export function SectionHeading({
  id,
  level,
  accentColor,
  children,
}: {
  id: string | null;
  /** 2 for a sub-section, 3 for one of its parts. */
  level: 2 | 3;
  /** Overrides the default gold left border, e.g. a campaign-phase colour. */
  accentColor?: string;
  children: React.ReactNode;
}) {
  const [ref, inView] = useInView<HTMLHeadingElement>({ amount: 0.5, margin: "0px 0px -10% 0px" });

  // A sub-section opens a new argument and carries a left bar; a part is a step inside it and
  // carries none. The running position is the sticky bar's job, not a repeated eyebrow above
  // every heading.
  //
  // Size and vertical rhythm are deliberately NOT set here. They live in app/globals.css under
  // .prose, which reaches these elements with higher specificity than a utility class and which
  // the reading-density control restates with !important — so margins set here were silently
  // discarded. One owner for spacing means the density control actually moves everything.
  const Tag = level === 2 ? "h2" : "h3";
  const baseClass =
    level === 2
      ? "font-serif font-semibold text-ink border-l-4 pl-3.5 leading-snug tracking-tight text-balance"
      : "font-serif font-semibold text-accent leading-snug tracking-normal text-balance";
  // A phase heading takes its own campaign-stage colour. This previously set a border colour on
  // an element with no border width, so it never showed; the width is now set alongside it.
  const phaseBorder = level === 3 && accentColor ? "border-l-4 pl-3" : "";

  // The entrance. h2 wipes open from the left; h3 rises. Both resolve to the finished heading
  // under reduced motion and in print — see the guards at the end of visual-fx.css.
  const entrance = inView ? (level === 2 ? "fx-in-wipe" : "fx-in-up") : "fx-preveal";

  return (
    <Tag
      ref={ref}
      id={id ?? undefined}
      className={`${baseClass} ${phaseBorder} ${entrance} group scroll-mt-28 flex items-center gap-2 ${
 level === 2 && !accentColor ? "border-gold" : ""
      }`}
      style={
        {
          ...(accentColor ? { borderColor: accentColor } : {}),
          // h3s are dense — a shorter travel and a shorter duration keep a run of five of them
          // from reading as a queue of things arriving.
          ...(level === 3 ? ({ "--fx-travel": "6px", "--fx-dur": "340ms" } as React.CSSProperties) : {}),
        } as React.CSSProperties
      }
    >
      <span className={level === 2 ? "fx-marker" : undefined}>{children}</span>
      {id && <CopyLinkButton id={id} />}
      {/* A hairline running out to the right margin, so a new sub-section reads as a rule across
          the page rather than as bolder text. h3 keeps its line clean. */}
      {level === 2 && <span aria-hidden="true" className="fx-divider-soft flex-1 min-w-4 ml-1" />}
    </Tag>
  );
}
