"use client";

import React, { createContext, useContext } from "react";
import type { SectionItem } from "../../lib/section-index";

/**
 * The generated section index, for surfaces that index the site itself.
 *
 * This file used to carry a second map as well: printed section number ("6.5.4") to the
 * deep-link id it lived at. It existed to resolve 173 in-prose "Section N.N" cross-references.
 * Both the numbers and the references are gone — a reader should be shown the data where it is
 * relevant, not told that it is somewhere else — so only the index remains.
 */
const SectionIndexContext = createContext<readonly SectionItem[]>([]);

export function SectionNumberMapProvider({
  sections,
  children,
}: {
  sections: readonly SectionItem[];
  children: React.ReactNode;
}) {
  return <SectionIndexContext.Provider value={sections}>{children}</SectionIndexContext.Provider>;
}

/** The generated section index, for surfaces that index the site itself. */
export function useSectionIndex(): readonly SectionItem[] {
  return useContext(SectionIndexContext);
}
