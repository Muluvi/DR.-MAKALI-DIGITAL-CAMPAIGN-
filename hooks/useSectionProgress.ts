"use client";

import { useState, useEffect } from "react";

export interface SectionProgressState {
  activeSectionId: string;
  activeSectionTitle: string;
  sectionProgress: number; // 0 to 1
  overallProgress: number; // 0 to 1
}

/**
 * Hook to track scroll reading progress through major document sections.
 */
export function useSectionProgress(sectionIds: string[] = []): SectionProgressState {
  const sectionIdsKey = sectionIds.join(",");

  const [state, setState] = useState<SectionProgressState>({
    activeSectionId: sectionIds[0] || "",
    activeSectionTitle: "",
    sectionProgress: 0,
    overallProgress: 0,
  });

  useEffect(() => {
    let ticking = false;
    const ids = sectionIdsKey ? sectionIdsKey.split(",") : [];

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const scrollY = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const overallProgress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

        if (ids.length === 0) {
          setState((prev) => ({ ...prev, overallProgress }));
          return;
        }

        let currentSectionId = ids[0];
        let currentSectionTitle = "";
        let currentSectionProgress = 0;

        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          const el = document.getElementById(id);
          if (!el) continue;

          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollY;
          const height = el.offsetHeight;

          // If current scroll position has entered this section with an offset
          if (scrollY >= top - 200) {
            currentSectionId = id;
            const heading = el.querySelector("h1, h2, [data-section-title]");
            currentSectionTitle = heading?.textContent || id;

            const progressInside = height > 0 ? Math.min(Math.max((scrollY - top + 200) / height, 0), 1) : 0;
            currentSectionProgress = progressInside;
          }
        }

        setState({
          activeSectionId: currentSectionId,
          activeSectionTitle: currentSectionTitle,
          sectionProgress: currentSectionProgress,
          overallProgress,
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIdsKey]);

  return state;
}
