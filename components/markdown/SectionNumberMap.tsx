"use client";

import React, { createContext, useContext } from "react";

/**
 * Maps a printed section number ("6.5.4") to the deep-link id it lives at today
 * ("strategy-sec-6-5-4").
 *
 * The document's 173 in-prose "Section N.N" references were previously resolved by reading the
 * leading digit and looking up a hardcoded number -> file table. That assumed a section's number
 * implies which file it is in, which stopped being true the moment the five-part spine moved
 * §3.1 into the evidence part and §6.5 into the strategy part.
 *
 * The map is derived in ClientPage from the same generated section index the table of contents
 * uses, so it cannot disagree with the document, and it needs no maintenance when a section
 * moves again.
 */
const SectionNumberMapContext = createContext<Readonly<Record<string, string>>>({});

export function SectionNumberMapProvider({
  map,
  children,
}: {
  map: Readonly<Record<string, string>>;
  children: React.ReactNode;
}) {
  return <SectionNumberMapContext.Provider value={map}>{children}</SectionNumberMapContext.Provider>;
}

export function useSectionNumberMap(): Readonly<Record<string, string>> {
  return useContext(SectionNumberMapContext);
}
