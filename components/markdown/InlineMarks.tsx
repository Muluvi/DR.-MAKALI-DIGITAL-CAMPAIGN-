"use client";

import { useCallback, useId, useState, type ReactNode } from "react";

import { TIER_META, type Tier } from "../../data/types";
import { hasHighlight } from "../../lib/highlight-patterns";
import { tokenizeInline, hasInlineMark, COUNSEL_NOTE } from "../../lib/inline-marks";
import { CrossSectionLink } from "./CrossSectionLink";
import { FoldBody } from "./FoldBody";
import { HighlightedText } from "./HighlightedText";
import { useSectionNumberMap } from "./SectionNumberMap";

/**
 * The chips a reader sees where the source carries a working mark (lib/inline-marks.ts says which
 * mark becomes which chip, and why the source itself is unchanged).
 *
 * Each chip that stands for words opens, on tap, to those words: a tier badge to the source and
 * caveat the parenthetical carried, a status chip to its note. Closed, the words are still in the
 * DOM (lib/fold.ts), so find in page, a deep link and print reach them.
 */

/** Annex A.1.2, the tier legend every badge points at. */
const TIER_LEGEND_ID = "annex-evidence-sec-a-1-2";

export function Chip({
  label,
  className,
  title,
  children,
}: {
  label: ReactNode;
  className: string;
  title?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reveal = useCallback(() => setOpen(true), []);
  return (
    <span className={`ichip ${className}`} data-open={open ? "true" : "false"}>
      <button type="button" className="ichip__btn" aria-expanded={open} aria-controls={id} title={title} onClick={() => setOpen((o) => !o)}>
        {label}
      </button>
      <FoldBody as="span" id={id} open={open} onReveal={reveal} className="ichip__more">
        {children}
      </FoldBody>
    </span>
  );
}

function plain(text: string) {
  return hasHighlight(text) ? <HighlightedText text={text} /> : text;
}

function tierBadgeText(tiers: number[], head: string): string {
  if (tiers.length === 1) {
    const extra = head.replace(/^Tier [123]\s*/, "").trim();
    return `${TIER_META[tiers[0] as Tier].short}${extra ? ` ${extra}` : ""}`;
  }
  return head.replace(/Tier ([123])/g, "T$1");
}

export function TierMark({ tiers, head, rest }: { tiers?: string; head?: string; rest?: string }) {
  const list = (tiers ?? "").split(",").filter(Boolean).map(Number);
  const first = (list[0] ?? 1) as Tier;
  return (
    <Chip
      className={`ichip--tier ichip--t${first}`}
      label={tierBadgeText(list, head ?? "")}
      title={TIER_META[first].description}
    >
      {rest ? <>{plain(rest)} · </> : <>{TIER_META[first].label}. </>}
      <CrossSectionLink id={TIER_LEGEND_ID}>What the tiers mean</CrossSectionLink>
    </Chip>
  );
}

export function ConflictMark({ conflict }: { conflict?: string }) {
  return (
    <Chip className="ichip--conflict" label="Two versions in this document — under review">
      Open item {conflict}: the proposal states this point two ways. Both versions are kept, unchanged,
      until the campaign decides between them.
    </Chip>
  );
}

/** Hidden from readers in a production build; a dashed outline in development. */
export function CheckRefMark() {
  if (process.env.NODE_ENV === "production") return null;
  return <span className="ichip-dev" title="Citation to check (docs/restructure-2026-10/OPEN-ITEMS.md)">CHECK REF</span>;
}

export function StatusMark({ status, note }: { status?: string; note?: string }) {
  const counsel = status === "counsel";
  return (
    <Chip className={counsel ? "ichip--counsel" : "ichip--pending"} label={counsel ? "Counsel review" : "Source pending"}>
      {note ? plain(note) : null}
    </Chip>
  );
}

export function XrefMark({ refs, raw }: { refs?: string; raw?: string }) {
  const map = useSectionNumberMap();
  const list = (refs ?? "").split(",").filter(Boolean);
  const resolved = list.map((n) => ({ n, id: map[n] }));
  // A reference to a number with no heading is left exactly as typed rather than drawn as a chip
  // that goes nowhere.
  if (!resolved.length || resolved.some((r) => !r.id)) return <>{raw}</>;
  return (
    <span className="xchip-row">
      {resolved.map((r) => (
        <span key={r.n} className="xchip">
          <CrossSectionLink id={r.id!}>§{r.n}</CrossSectionLink>
        </span>
      ))}
    </span>
  );
}

/** A counsel note typed as a code span, `[Confirm approach with campaign counsel — …]` (X4). */
export function counselNote(text: string): ReactNode | null {
  const m = COUNSEL_NOTE.exec(text.trim());
  return m ? <StatusMark status="counsel" note={m[1]} /> : null;
}

/**
 * The same chips in a plain string: a figure's note or takeaway, which never passes through the
 * markdown renderer.
 */
export function InlineMarks({ text }: { text: string }) {
  if (!hasInlineMark(text)) return <>{text}</>;
  return (
    <>
      {tokenizeInline(text).map((p, i) => {
        switch (p.type) {
          case "text": return <span key={i}>{p.text}</span>;
          case "tier": return <TierMark key={i} tiers={p.tiers.join(",")} head={p.head} rest={p.rest} />;
          case "conflict": return <ConflictMark key={i} conflict={p.id} />;
          case "checkref": return <CheckRefMark key={i} />;
          case "status": return <StatusMark key={i} status={p.status} note={p.note} />;
          case "xref": return <XrefMark key={i} refs={p.refs.join(",")} raw={p.raw} />;
        }
      })}
    </>
  );
}

/**
 * X7 (brief 2026-10 declutter): the nomination window, said once. Its home is 2.5, where the
 * timing, its tier and what would confirm it are set out; every other place it was restated now
 * carries this chip, which keeps the timing, the hedge and the tier in view and links home.
 */
export function WindowChip() {
  const map = useSectionNumberMap();
  const id = map["2.5.1"] ?? "evidence-sec-2-5-1";
  return (
    <span className="wchip">
      <span className="wchip__k">Wiper decision:</span> late Oct–Nov 2026 · reported · <span className="wchip__t">Tier 3</span> ·{" "}
      <CrossSectionLink id={id}>§2.5</CrossSectionLink>
    </span>
  );
}
