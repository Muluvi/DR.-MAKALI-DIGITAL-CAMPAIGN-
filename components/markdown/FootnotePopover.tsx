"use client";

import React, { useState, useRef, useEffect } from "react";

interface FootnotePopoverProps {
  id: string;
  number: number | string;
  source: string;
  details?: string;
}

export function FootnotePopover({ id, number, source, details }: FootnotePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <span className="relative inline-block not-prose align-baseline ml-0.5">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label={`Source citation ${number}: ${source}`}
        className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-mono font-bold text-accent hover:text-ink bg-accent/10 hover:bg-accent/20 rounded-full transition-colors cursor-pointer"
      >
        {number}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-xl bg-card border border-line shadow-lg z-50 text-left animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <span className="t-micro font-bold uppercase tracking-wider text-muted font-mono">
              Source [{number}]
            </span>
            <span className="t-micro px-1.5 py-0.2 rounded bg-accent/10 text-accent font-semibold">
              Verified
            </span>
          </div>
          <p className="t-small font-serif font-semibold text-ink leading-snug">
            {source}
          </p>
          {details && (
            <p className="t-micro text-muted mt-1 leading-relaxed">
              {details}
            </p>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-card" />
        </div>
      )}
    </span>
  );
}
