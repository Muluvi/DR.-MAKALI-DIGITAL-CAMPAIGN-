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
      className="section-anchor-btn inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md border border-line/60 text-muted hover:text-accent hover:border-accent/50 transition-colors align-middle shrink-0 no-underline print:hidden"
    >
      {copied ? <Check size={11} className="text-accent" /> : <Link2 size={11} />}
    </a>
  );
}

export function SectionHeading({
  id,
  level,
  children,
}: {
  id: string | null;
  level: 2 | 3;
  children: React.ReactNode;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  const baseClass =
    level === 2
      ? "font-serif text-base sm:text-lg font-black text-ink mt-8 mb-4 border-l-3 border-gold pl-3 leading-none uppercase tracking-wide text-balance"
      : "font-serif text-xs sm:text-sm font-extrabold text-ink mt-6 mb-2 text-accent uppercase tracking-wider text-balance";

  return (
    <Tag id={id ?? undefined} className={`${baseClass} group scroll-mt-28 flex items-center gap-2`}>
      <span>{children}</span>
      {id && <CopyLinkButton id={id} />}
    </Tag>
  );
}
