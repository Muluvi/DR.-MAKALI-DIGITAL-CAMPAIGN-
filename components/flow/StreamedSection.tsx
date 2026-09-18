"use client";

import { useEffect, useRef, useState } from "react";

import { MarkdownViewer } from "../MarkdownViewer";
import { SectionSkeleton } from "../SectionSkeleton";
import { contentUrl } from "../../lib/content-files";
import { sectionHeight } from "../../lib/section-heights";
import { markSectionPending } from "../../lib/flow-pending";
import type { TabId } from "../../lib/heading-slug";

/**
 * A section of the flow that fetches its own prose.
 *
 * WHY THIS EXISTS. The whole document server-rendered into one page came to 4.9 MB — 2.8 MB of
 * markup and 2.0 MB of the hydration payload that repeats it — which is 660 KB on the wire and
 * about thirteen seconds on the 3G connection §8.1.1 calls non-negotiable. A reader who never
 * scrolls past the executive summary paid for all thirty sections before the first sentence
 * appeared.
 *
 * So the flow ships its opening sections rendered, and every section after them arrives as the
 * reader approaches it. The source is public/content/<section>.md — the same markdown the server
 * renders, already served as a static file, 140 KB gzipped for the entire document and fetched a
 * section at a time. Nothing is duplicated and nothing is re-authored: it is one content source
 * with two readers.
 *
 * WHAT IS PRESERVED.
 *   - The complete, server-rendered document still exists at /full. Print goes there, and so does
 *     the <noscript> path, so a printed PDF and a reader with JavaScript off are unaffected.
 *   - Each section route still serves its own section rendered on the server, so a shared deep
 *     link lands on real HTML.
 *   - `force` mounts a section immediately regardless of scroll position, which is what a deep
 *     link into the middle of the flow needs.
 *
 * The skeleton reserves the section's measured height, so arriving prose never pushes the line
 * the reader is on.
 */
export function StreamedSection({
  tabId,
  words,
  force = false,
}: {
  tabId: TabId;
  /** The section's word count, for the height the skeleton reserves. */
  words: number;
  force?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [near, setNear] = useState(false);
  const [failed, setFailed] = useState(false);

  // Without IntersectionObserver the honest answer is "fetch it", never "wait forever". Derived
  // rather than pushed into state from an effect, and window-guarded so the server's answer and
  // the first client render agree.
  const unobservable = typeof window !== "undefined" && typeof IntersectionObserver === "undefined";
  const wanted = force || near || unobservable;

  useEffect(() => {
    if (wanted) return;
    const el = ref.current;
    if (!el) return;
    // Two screens of runway. Long enough that a fast scroll rarely outruns the fetch, short
    // enough that a reader who stops at the summary has not downloaded the annexes.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "200% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [wanted]);

  useEffect(() => {
    if (!wanted || markdown !== null) return;
    let live = true;
    // Registered while the fetch is in flight, so a deep link arriving in the middle of the flow
    // knows the page is still growing under it — see lib/flow-pending.ts.
    const done = markSectionPending();
    fetch(contentUrl(tabId))
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => {
        if (live) setMarkdown(text);
      })
      .catch(() => {
        if (live) setFailed(true);
      })
      // One frame after the state change, so the section has been laid out at its real height
      // before it stops counting as pending.
      .finally(() => requestAnimationFrame(() => requestAnimationFrame(done)));
    return () => {
      live = false;
      done();
    };
  }, [wanted, markdown, tabId]);

  return (
    <div ref={ref} style={markdown === null ? { minHeight: sectionHeight(tabId, words) } : undefined}>
      {markdown !== null ? (
        <MarkdownViewer content={markdown} tabId={tabId} />
      ) : failed ? (
        <p className="t-small text-muted">
          This section could not be loaded.{" "}
          <a href={`/${tabId}`} className="text-accent font-semibold underline">
            Open it on its own page
          </a>
          .
        </p>
      ) : (
        <SectionSkeleton />
      )}
    </div>
  );
}

/*
 * The space a section holds open before its prose arrives is its own measured height — see
 * lib/section-heights.ts. Estimating it from word count was tried and came out at 24% mean
 * error, which on a 480,000px document is tens of thousands of pixels of drift under the reader.
 */
