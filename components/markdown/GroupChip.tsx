"use client";

import { Chip } from "./InlineMarks";

/**
 * A workstream banner's group line (X5, brief 2026-10 declutter): "Group: Ground and offline reach"
 * as a chip, with the group's one-sentence description behind it. The four descriptions are set out
 * once, in 4.5; every banner keeps the line, so nothing in it is lost.
 */
export function GroupChip({ label, detail }: { label: string; detail: string }) {
  if (!detail) {
    return (
      <p className="gchip-row not-prose">
        <span className="ichip ichip--group"><span className="ichip__btn ichip__btn--static">Group · {label}</span></span>
      </p>
    );
  }
  return (
    <p className="gchip-row not-prose">
      <Chip className="ichip--group" label={`Group · ${label}`}>
        {detail}
      </Chip>
    </p>
  );
}
