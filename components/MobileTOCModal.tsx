"use client";

import React, { useState, useMemo, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, ChevronRight, Layers, Compass, Map, MessageSquare, Megaphone, Shield, Database, Target, Gauge, FileText, BookLock, ClipboardList, CalendarClock, Workflow, ListChecks, Handshake, Radio, ShieldCheck, Activity} from "lucide-react";
import { SECTIONS, PARTS, partOf, type PartId, type TabId } from "../lib/heading-slug";
import { FLOW_ACTS, FLOW_SECTIONS, actOf } from "../lib/flow";
import { ACT_PORTRAITS, ACT_ROMAN } from "../lib/premium/acts";
import { Portrait } from "./Portrait";
import { readingMinutes } from "../hooks/useReadingProgress";
import type { SectionItem } from "../lib/section-index";

const TAB_ICONS: Record<TabId, React.ComponentType<{ size?: number; className?: string }>> = {
  cover: BookLock,
  objectives: Target,
  data: Database,
  analysis: Map,
  strategy: Compass,
  implementation: ListChecks,
  "workstreams-platforms": Layers,
  "workstreams-media": Megaphone,
  "workstreams-ground": Radio,
  "workstreams-data": Workflow,
  delivery: Gauge,
  nextsteps: Handshake,
  "annex-evidence": ClipboardList,
  "annex-county": FileText,
  "annex-polls": Activity,
  "annex-messages": MessageSquare,
  "annex-cadence": CalendarClock,
  "annex-runbooks": ShieldCheck,
  "annex-terms": Shield,
};

interface MobileTOCModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectSection: (sectionId: string, tabId: TabId) => void;
  /** Derived from the markdown at build time — see lib/section-index.ts. */
  sections: SectionItem[];
  /** Every section's length, for the reading estimate on the overview strip. */
  wordCounts: Record<TabId, number>;
  /** Which sections this reader has already opened, from localStorage. */
  visited: ReadonlySet<TabId>;
  /** Jump to a top-level section rather than to one of its 262 headings. */
  onSelectTab: (tabId: TabId, during?: () => void) => void;
}

export function MobileTOCModal({
  isOpen,
  onClose,
  activeTab,
  onSelectSection,
  sections,
  wordCounts,
  visited,
  onSelectTab,
}: MobileTOCModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // Filtering is by PART, not by tab. Nine tabs is more choices than a first filter should
  // offer on a phone; the five parts are the shape of the document, and Part 4's five parallel
  // delivery tracks belong behind one choice rather than five.
  const [selectedTabFilter, setSelectedTabFilter] = useState<PartId | "all">("all");
  const titleId = useId();
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // `onClose` is passed as an inline arrow, so it is a new function on every render of the
  // page. Holding it in a ref keeps the effects below keyed on `isOpen` alone — depending on
  // the prop directly re-ran them on every render, and each re-run re-captured the focused
  // element, so by the time the sheet actually closed the "trigger" it restored to was the
  // body rather than the control the reader had opened it with.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // A sheet that covers the document has to be dismissable from the keyboard, and has to give
  // focus back to the control that opened it — otherwise closing it drops the reader at the top
  // of a 262-section document with no idea where they were.
  useEffect(() => {
    if (!isOpen) return;
    // Captured before the search field is focused below. `autoFocus` used to do that job, but
    // React applies it during commit — by the time this effect ran, the "previously focused"
    // element was already the search box, so closing the sheet restored focus to a field that
    // no longer existed and the reader was dropped on the body.
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    searchRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      // aria-modal tells a screen reader to stay inside the sheet, but it does not hold the
      // Tab key — without this, tabbing out lands on the document behind a sheet that is still
      // covering it, which is the state the attribute promises cannot happen.
      if (e.key !== "Tab" || !sheetRef.current) return;
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !sheetRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreFocusTo.current?.focus?.();
    };
  }, [isOpen]);

  const filteredSections = useMemo(() => {
    return sections.filter((item) => {
      const matchesTab = selectedTabFilter === "all" || partOf(item.tabId) === selectedTabFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTab;
      const matchesQuery =
        item.number.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.tabLabel.toLowerCase().includes(q) ||
        (item.figures ?? []).some((f) => f.title.toLowerCase().includes(q) || f.takeaway.toLowerCase().includes(q));
      return matchesTab && matchesQuery;
    });
  }, [sections, searchQuery, selectedTabFilter]);

  // Counts shown in the header/pills — derived from the live index rather than hardcoded,
  // so they never drift from the document again the way the old "26 Sections" figure did.
  const subSectionCount = useMemo(() => sections.filter((s) => s.level === 2).length, [sections]);
  const partCount = useMemo(() => sections.filter((s) => s.level === 3).length, [sections]);

  if (!isOpen) return null;

  const hereAct = actOf(activeTab as TabId).id;
  /** The five-step argument (the cover spine), in miniature: acts I to V. */
  const argument = FLOW_ACTS.slice(0, 5);

  return (
    <AnimatePresence>
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="pf-idx fixed inset-0 z-50 print:hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="pf-idx__inner"
        >
          {/* Header */}
          <header className="pf-idx__head">
            <div>
              <h2 id={titleId} className="pf-idx__title">The index</h2>
              <p className="pf-idx__meta">
                {FLOW_ACTS.length} acts · {PARTS.filter((p) => p.part > 0 && p.part < 7).length} sections, {SECTIONS.filter((s) => s.part === 7).length} annexes, {subSectionCount} sub-sections, {partCount} parts
              </p>
            </div>
            <button type="button" onClick={onClose} className="pf-idx__close" aria-label="Close the index">
              <X size={20} />
            </button>
          </header>

          <div className="pf-idx__body">
            <div className="pf-idx__col">
              {/* The seven acts (brief G-7): each with its numeral, its portrait, what it answers
                  and how long it takes; one tap to its opener, and the act's title carries across
                  to the chapter it lands on (lib/premium/transition.ts). */}
              <ol className="pf-idx__acts" aria-label="The seven acts">
                {FLOW_ACTS.map((a, i) => {
                  const mins = readingMinutes(
                    FLOW_SECTIONS.filter((s) => actOf(s.id as TabId).id === a.id).reduce((n, s) => n + (wordCounts[s.id as TabId] ?? 0), 0)
                  );
                  const here = hereAct === a.id;
                  return (
                    <li key={a.id} style={{ "--i": i } as React.CSSProperties}>
                      <button
                        type="button"
                        data-vt-source=""
                        onClick={() => onSelectTab(a.opensOn, onClose)}
                        aria-current={here ? "true" : undefined}
                        className="pf-idx__act"
                      >
                        <span className="pf-idx__img" aria-hidden="true">
                          <Portrait id={ACT_PORTRAITS[i]} sizes="96px" fade={false} />
                        </span>
                        <span className="pf-idx__n" data-vt-numeral="" aria-hidden="true">{ACT_ROMAN[i]}</span>
                        <span className="pf-idx__text">
                          <span className="pf-idx__label" data-vt-title="">{a.label}</span>
                          <span className="pf-idx__blurb">{a.blurb}</span>
                          <span className="pf-idx__min">
                            {mins} min{here ? <b> · you are here</b> : null}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              {/* The argument rail from the cover, in miniature. */}
              <nav className="pf-idx__rail" aria-label="The shape of the argument">
                <ol>
                  {argument.map((a, i) => (
                    <li key={a.id}>
                      <button type="button" data-vt-source="" onClick={() => onSelectTab(a.opensOn, onClose)} aria-current={hereAct === a.id ? "step" : undefined}>
                        <span className="pf-idx__railnode" aria-hidden="true">{i + 1}</span>
                        <span data-vt-title="">{a.label.replace(/^The /, "")}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            <div className="pf-idx__col pf-idx__col--list">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search sections (e.g., Nomination, Radio, 40 Wards, SMS)..."
                  aria-label="Search sections by number, title or part"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchRef}
                  className="w-full pl-10 pr-20 py-2 bg-card border border-line rounded-xl t-label font-semibold text-ink placeholder:text-muted focus:outline-none focus:border-accent min-h-[48px]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 t-label text-muted hover:text-ink px-2.5 py-1.5 bg-paper rounded-lg border border-line cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {searchQuery.trim()
                  ? `${filteredSections.length} ${filteredSections.length === 1 ? "section matches" : "sections match"} "${searchQuery.trim()}"`
                  : `${filteredSections.length} sections listed`}
              </p>

              {!searchQuery.trim() && (
                <div>
                  {/* IN FLOW ORDER, not file order: the page is one scroll (lib/flow.ts), and an
                      index in a different sequence would be a second, contradictory map. */}
                  <div className="pf-idx__subhead">
                    <span>In reading order</span>
                    <span className="tabular-nums">{visited.size}/{SECTIONS.length} opened</span>
                  </div>
                  <ul className="pf-idx__flow">
                    {FLOW_SECTIONS.map((s) => {
                      const Icon = TAB_ICONS[s.id] ?? Compass;
                      const isRead = visited.has(s.id);
                      const isHere = activeTab === s.id;
                      const mins = readingMinutes(wordCounts[s.id] ?? 0);
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            data-vt-source=""
                            onClick={() => onSelectTab(s.id, onClose)}
                            aria-current={isHere ? "true" : undefined}
                            className="pf-idx__row"
                          >
                            <Icon size={15} aria-hidden="true" className="pf-idx__rowicon" />
                            <span className="pf-idx__rownum">{s.number}</span>
                            <span className="pf-idx__rowlabel" data-vt-title="">{s.label}</span>
                            <span className="pf-idx__rowmin">{mins} min</span>
                            {/* State carried by a word and a mark, not by colour alone. */}
                            <span className="pf-idx__rowstate">{isHere ? "Here" : isRead ? "✓ Read" : "New"}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Filter pills */}
              <div className="pf-idx__subhead"><span>Every heading</span></div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none t-small font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedTabFilter("all")}
                  aria-pressed={selectedTabFilter === "all"}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border cursor-pointer min-h-[36px] ${
                    selectedTabFilter === "all" ? "bg-accent-solid text-on-accent border-accent-solid" : "bg-card text-muted border-line hover:text-ink"
                  }`}
                >
                  All ({sections.length})
                </button>
                {PARTS.map((part) => (
                  <button
                    type="button"
                    key={part.part}
                    onClick={() => setSelectedTabFilter(part.part)}
                    aria-pressed={selectedTabFilter === part.part}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border cursor-pointer min-h-[36px] ${
                      selectedTabFilter === part.part ? "bg-accent-solid text-on-accent border-accent-solid" : "bg-card text-muted border-line hover:text-ink"
                    }`}
                  >
                    {part.label}
                  </button>
                ))}
              </div>

              {/* Section list */}
              <div className="divide-y divide-line/40">
                {filteredSections.length > 0 ? (
                  filteredSections.map((item) => {
                    const Icon = TAB_ICONS[item.tabId] ?? Compass;
                    const isCurrentTab = activeTab === item.tabId;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => {
                          onSelectSection(item.id, item.tabId);
                          onClose();
                        }}
                        className="fx-press fx-focus w-full py-3 px-2 flex items-center justify-between text-left hover:bg-paper/70 active:bg-paper rounded-xl transition-colors group cursor-pointer min-h-[50px]"
                      >
                        <div className={`flex items-start gap-2.5 sm:gap-3 min-w-0 pr-2 ${item.level === 3 ? "pl-3 sm:pl-5" : ""}`}>
                          <span className="font-mono t-micro tabular-nums text-accent shrink-0 mt-0.5 min-w-[38px]">{item.number}</span>
                          <div className="min-w-0">
                            <span className={`block t-label text-ink group-hover:text-accent transition-colors ${item.level === 2 ? "font-bold" : "font-medium"}`}>
                              {item.title}
                            </span>
                            {searchQuery.trim() &&
                              (item.figures ?? [])
                                .filter((f) => `${f.title} ${f.takeaway}`.toLowerCase().includes(searchQuery.toLowerCase().trim()))
                                .map((f) => (
                                  <span key={f.id} className="block t-micro text-ink mt-0.5">
                                    Figure: {f.title}
                                  </span>
                                ))}
                            <div className="flex items-center gap-1.5 mt-0.5 t-micro text-muted">
                              <Icon size={11} className="shrink-0" aria-hidden="true" />
                              <span className="font-medium truncate">{item.tabLabel}</span>
                              {isCurrentTab && <span className="text-accent font-semibold">· current</span>}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-muted group-hover:text-accent" />
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center t-label text-muted space-y-2">
                    <p className="font-bold text-ink">No matching sections found</p>
                    <p>Try searching by keyword like &quot;Ward&quot;, &quot;Radio&quot;, &quot;Nomination&quot;, or &quot;Turnout&quot;.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
