"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

function CopyLinkButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

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
      aria-label="Copy link to this section"
      title={copied ? "Link copied" : "Copy link to this section"}
      className="section-anchor-btn inline-flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 rounded-lg sm:rounded-md border border-line/60 text-muted hover:text-accent hover:border-accent/50 transition-colors align-middle shrink-0 no-underline print:hidden cursor-pointer"
    >
      {copied ? <Check size={12} className="text-accent" /> : <Link2 size={12} />}
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

  return (
    <Tag
      id={id ?? undefined}
      className={`${baseClass} ${phaseBorder} group scroll-mt-28 flex items-center gap-2 ${level === 2 && !accentColor ? "border-gold" : ""}`}
      style={accentColor ? { borderColor: accentColor } : undefined}
    >
      <span>{children}</span>
      {id && <CopyLinkButton id={id} />}
    </Tag>
  );
}
