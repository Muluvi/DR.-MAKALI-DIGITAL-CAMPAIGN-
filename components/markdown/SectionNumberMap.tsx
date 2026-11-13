"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { SectionItem } from "../../lib/section-index";
import { SECTIONS } from "../../lib/heading-slug";

/**
 * Maps a printed section number ("6.5.4") to the deep-link id it lives at today  verify-figures-ignore
 * ("delivery-sec-5-7-8").
 *
 * The document's 173 in-prose "Section N.N" references were previously resolved by reading the
 * leading digit and looking up a hardcoded number -> file table. That assumed a section's number
 * implies which file it is in, which stopped being true the moment the five-part spine moved
 * §3.6 into the evidence part and §12.5 into the strategy part.
 *
 * The map is derived in ClientPage from the same generated section index the table of contents
 * uses, so it cannot disagree with the document, and it needs no maintenance when a section
 * moves again.
 */
const SectionNumberMapContext = createContext<Readonly<Record<string, string>>>({});
const SectionIndexContext = createContext<readonly SectionItem[]>([]);
/** Printed number -> the heading's own words, so a reference reads as a name, never a number. */
const SectionTitleMapContext = createContext<Readonly<Record<string, string>>>({});

export function SectionNumberMapProvider({
  sections,
  children,
}: {
  sections: readonly SectionItem[];
  children: React.ReactNode;
}) {
  const { map, titles } = useMemo(() => {
    const map: Record<string, string> = {};
    const titles: Record<string, string> = {};
    for (const s of sections) {
      map[s.number] = s.id;
      titles[s.number] = s.title;
    }
    // A whole chapter ("Section 6") lands on its first heading and reads as the chapter's name.
    for (const sec of SECTIONS) {
      if (!sec.number || map[sec.number]) continue;
      const first = sections.find((s) => s.tabId === sec.id);
      if (!first) continue;
      map[sec.number] = first.id;
      titles[sec.number] = sec.label.replace(/^Annex [A-H] — /, "");
    }
    return { map, titles };
  }, [sections]);
  return (
    <SectionIndexContext.Provider value={sections}>
      <SectionTitleMapContext.Provider value={titles}>
        <SectionNumberMapContext.Provider value={map}>{children}</SectionNumberMapContext.Provider>
      </SectionTitleMapContext.Provider>
    </SectionIndexContext.Provider>
  );
}

export function useSectionNumberMap(): Readonly<Record<string, string>> {
  return useContext(SectionNumberMapContext);
}

export function useSectionTitleMap(): Readonly<Record<string, string>> {
  return useContext(SectionTitleMapContext);
}

/** The document's generated section index, for surfaces that index the document itself. */
export function useSectionIndex(): readonly SectionItem[] {
  return useContext(SectionIndexContext);
}
