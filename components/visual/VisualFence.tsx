"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { TIER_META, type Tier } from "../../data/types";
import { numberOf, type Field, type Item, type Side, type VisualSpec } from "../../lib/visual";
import { FoldBody } from "../markdown/FoldBody";
import { ConflictMark } from "../markdown/InlineMarks";

/**
 * The renderer for a ```visual fence (lib/visual.ts holds the shapes and what each shows on load).
 *
 * Every string is the document's own markdown, drawn through the same components as the prose
 * around it (`md`), so a token, a cross-reference or a tier badge reads the same in a card as in a
 * paragraph. Every disclosure keeps its words in the DOM (lib/fold.ts): find in page, a deep link,
 * print and a reader with scripts off all reach them.
 *
 * The frame follows the FigureFrame contract (components/figures/FigureFrame.tsx): the title states
 * the finding, and a visual that carries numbers says where they come from.
 */

type Md = (text: string, inline?: boolean) => ReactNode;

const labelOf = (it: Item) => it.title ?? it.label ?? it.day ?? "";

function TierTag({ tier }: { tier: Item["tier"] }) {
  if (tier === undefined || tier === null || tier === "") return null;
  if (typeof tier === "number" && TIER_META[tier as Tier]) {
    return <span className={`vz-tier vz-tier--${tier}`}>{TIER_META[tier as Tier].short}</span>;
  }
  return <span className="vz-tier vz-tier--note">{String(tier)}</span>;
}

/** A labelled disclosure inside a visual: a card's details, a step's body. */
function More({ label = "Details", children }: { label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reveal = useCallback(() => setOpen(true), []);
  return (
    <div className="vz-more" data-open={open ? "true" : "false"}>
      <button type="button" className="vz-more__btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span>{open ? "Hide" : label}</span>
        <ChevronDown size={14} aria-hidden="true" className="vz-more__chev" />
      </button>
      <FoldBody id={id} open={open} onReveal={reveal} className="vz-more__body">
        {children}
      </FoldBody>
    </div>
  );
}

function Fields({ fields, md }: { fields: Field[]; md: Md }) {
  return (
    <dl className="vz-fields">
      {fields.map((f, i) => (
        <div key={i} className="vz-fields__row">
          <dt>{f.label}</dt>
          <dd>{md(f.text)}</dd>
        </div>
      ))}
    </dl>
  );
}

/** What an item keeps behind its disclosure: its remaining fields and its body, verbatim. */
function ItemDetails({ it, md, label }: { it: Item; md: Md; label?: string }) {
  if (!it.fields?.length && !it.body) return null;
  return (
    <More label={label}>
      {it.fields?.length ? <Fields fields={it.fields} md={md} /> : null}
      {it.body ? <div className="vz-body prose max-w-none">{md(it.body)}</div> : null}
    </More>
  );
}

function Chips({ chips }: { chips?: string[] }) {
  if (!chips?.length) return null;
  return (
    <ul className="vz-chips" aria-label="Tags">
      {chips.map((c) => (
        <li key={c} className="vz-chip">{c}</li>
      ))}
    </ul>
  );
}

/** The parts of an item a reader sees on load, after its label. */
function ItemFace({ it, md }: { it: Item; md: Md }) {
  return (
    <>
      {it.head ? (
        <p className="vz-head">
          <span className="vz-head__label">{it.head.label}</span> {md(it.head.text, true)}
        </p>
      ) : null}
      {it.text ? <p className="vz-text">{md(it.text, true)}</p> : null}
      <Chips chips={it.chips} />
      {it.conflict ? (
        <p className="vz-text">
          <ConflictMark conflict={it.conflict} />
        </p>
      ) : null}
    </>
  );
}

/**
 * A row that is its own disclosure: the label and short text are the button, the details open
 * beneath. Saves the separate "Details" line a card needs, on lists of ten rows.
 */
function ToggleRow({ it, md, children }: { it: Item; md: Md; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reveal = useCallback(() => setOpen(true), []);
  const hasMore = Boolean(it.fields?.length || it.body);
  if (!hasMore) return <>{children}</>;
  return (
    <>
      <button type="button" className="vz-row__btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span className="vz-row__face">{children}</span>
        <ChevronDown size={16} aria-hidden="true" className="vz-row__chev" data-open={open ? "true" : "false"} />
      </button>
      <FoldBody id={id} open={open} onReveal={reveal} className="vz-row__more">
        {it.fields?.length ? <Fields fields={it.fields} md={md} /> : null}
        {it.body ? <div className="vz-body prose max-w-none">{md(it.body)}</div> : null}
      </FoldBody>
    </>
  );
}

/** The visible face of a row: label and short text, inline, so it can sit inside a button. */
function RowFace({ it, md }: { it: Item; md: Md }) {
  return (
    <>
      {it.when ? <span className="vz-seq__when">{it.when}</span> : null}
      <span className="vz-row__label">{md(labelOf(it), true)}</span> <TierTag tier={it.tier} />
      {it.head ? (
        <span className="vz-row__text">
          <span className="vz-head__label">{it.head.label}</span> {md(it.head.text, true)}
        </span>
      ) : null}
      {it.text ? <span className="vz-row__text">{md(it.text, true)}</span> : null}
    </>
  );
}

/* --------------------------------------------------------------------- kinds */

function Stats({ items, md }: { items: Item[]; md: Md }) {
  return (
    <ul className="vz-stats" style={{ "--vz-n": Math.min(items.length, 3) } as React.CSSProperties}>
      {items.map((it, i) => (
        <li key={i} className="vz-stat">
          <span className="vz-stat__value">{md(it.value ?? "", true)}</span>
          <span className="vz-stat__label">
            {md(labelOf(it), true)} <TierTag tier={it.tier} />
          </span>
          {it.caption ? <span className="vz-stat__cap">{md(it.caption, true)}</span> : null}
          {it.conflict ? <ConflictMark conflict={it.conflict} /> : null}
          <ItemDetails it={it} md={md} />
        </li>
      ))}
    </ul>
  );
}

function Cards({ items, md, preset }: { items: Item[]; md: Md; preset?: string }) {
  return (
    <ul className={`vz-cards ${preset ? `vz-cards--${preset}` : ""}`} data-count={items.length}>
      {items.map((it, i) => (
        <li key={i} className="vz-card">
          <div className="vz-card__top">
            {it.badge ? <span className="vz-badge">{it.badge}</span> : null}
            <TierTag tier={it.tier} />
          </div>
          {labelOf(it) ? <h5 className="vz-card__title">{md(labelOf(it), true)}</h5> : null}
          {it.value ? <p className="vz-card__value">{md(it.value, true)}</p> : null}
          <ItemFace it={it} md={md} />
          <ItemDetails it={it} md={md} />
        </li>
      ))}
    </ul>
  );
}

/**
 * One panel at a time, with the ARIA tabs pattern. Every panel is rendered: a panel that is not
 * showing is a closed fold (find in page selects it), and print and scripts-off show every panel.
 */
function Tabs({ items, md }: { items: Item[]; md: Md }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const last = items.length - 1;
    const to = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (to === null) return;
    e.preventDefault();
    setActive(to);
    refs.current[to]?.focus();
  };
  return (
    <div className="vz-tabs">
      <div role="tablist" className="vz-tabs__list" aria-orientation="horizontal">
        {items.map((it, i) => (
          <button
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-t${i}`}
            aria-selected={active === i}
            aria-controls={`${base}-p${i}`}
            tabIndex={active === i ? 0 : -1}
            className="vz-tabs__tab"
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {labelOf(it)}
          </button>
        ))}
      </div>
      {items.map((it, i) => (
        <FoldBody
          key={i}
          as="section"
          id={`${base}-p${i}`}
          role="tabpanel"
          labelledBy={`${base}-t${i}`}
          open={active === i}
          onReveal={() => setActive(i)}
          className="vz-tabs__panel"
        >
          <h5 className="vz-tabs__heading">{md(labelOf(it), true)} <TierTag tier={it.tier} /></h5>
          <ItemFace it={it} md={md} />
          {it.fields?.length ? <Fields fields={it.fields} md={md} /> : null}
          {it.body ? <div className="vz-body prose max-w-none">{md(it.body)}</div> : null}
        </FoldBody>
      ))}
    </div>
  );
}

function Sequence({ items, md, kind }: { items: Item[]; md: Md; kind: "timeline" | "stepper" | "checklist" }) {
  const Tag = kind === "checklist" ? "ul" : "ol";
  return (
    <Tag className={`vz-seq vz-seq--${kind}`}>
      {items.map((it, i) => (
        <li key={i} className="vz-seq__item">
          <span className="vz-seq__mark" aria-hidden="true">
            {kind === "stepper" ? i + 1 : kind === "checklist" ? <svg viewBox="0 0 16 16"><path d="M2 8.4l4 4L14 4" /></svg> : null}
          </span>
          <div className="vz-seq__text">
            <ToggleRow it={it} md={md}>
              <RowFace it={it} md={md} />
            </ToggleRow>
            <Chips chips={it.chips} />
            {it.conflict ? <ConflictMark conflict={it.conflict} /> : null}
          </div>
        </li>
      ))}
    </Tag>
  );
}

function Column({ title, items, md, tone }: { title: string; items: Item[]; md: Md; tone: string }) {
  return (
    <div className={`vz-col vz-col--${tone}`}>
      <h5 className="vz-col__title">{title}</h5>
      <ul className="vz-col__list">
        {items.map((it, i) => (
          <li key={i} className="vz-col__item">
            <ToggleRow it={it} md={md}>
              <RowFace it={it} md={md} />
            </ToggleRow>
            <Chips chips={it.chips} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Panels({ panels, md }: { panels: [string, string | undefined][]; md: Md }) {
  return (
    <div className="vz-panels" data-count={panels.filter(([, t]) => t).length}>
      {panels
        .filter(([, t]) => t)
        .map(([title, text]) => (
          <div key={title} className="vz-panel">
            <h5 className="vz-panel__title">{title}</h5>
            <div className="vz-panel__text">{md(text!)}</div>
          </div>
        ))}
    </div>
  );
}

function Table({ spec, md }: { spec: VisualSpec; md: Md }) {
  const columns = spec.columns ?? [];
  return (
    <div className="vz-table-wrap" tabIndex={0} role="region" aria-label={spec.title ? `Table: ${spec.title}` : "Table"}>
      <table className="vz-table">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} scope="col">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(spec.rows ?? []).map((r, i) => (
            <tr key={i}>
              {r.cells.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row">{md(c, true)}{r.body ? <More>{md(r.body)}</More> : null}</th>
                ) : (
                  <td key={j} data-col={columns[j]}>{md(c, true)}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Nested({ items, md }: { items: Item[]; md: Md }) {
  return (
    <ul className="vz-nested">
      {items.map((it, i) => (
        <li key={i} className="vz-nested__set">
          <span className="vz-nested__label">{md(labelOf(it), true)}</span>
          <ItemFace it={it} md={md} />
          {it.items?.length ? <Nested items={it.items} md={md} /> : null}
          <ItemDetails it={it} md={md} />
        </li>
      ))}
    </ul>
  );
}

function Week({ items, md }: { items: Item[]; md: Md }) {
  return (
    <ol className="vz-week" data-count={items.length}>
      {items.map((d, i) => (
        <li key={i} className="vz-week__day">
          <span className="vz-week__name">{labelOf(d)}</span>
          {d.text ? <p className="vz-text">{md(d.text, true)}</p> : null}
          {d.items?.length ? (
            <ul className="vz-week__items">
              {d.items.map((x, j) => (
                <li key={j}>
                  <span className="vz-week__label">{md(labelOf(x), true)}</span>
                  {x.text ? <> {md(x.text, true)}</> : null}
                  <ItemDetails it={x} md={md} />
                </li>
              ))}
            </ul>
          ) : null}
          <ItemDetails it={d} md={md} />
        </li>
      ))}
    </ol>
  );
}

function Bars({ items, md }: { items: Item[]; md: Md }) {
  const max = Math.max(...items.map((it) => Math.abs(numberOf(it.value))));
  return (
    <ul className="vz-bars">
      {items.map((it, i) => {
        const v = Math.abs(numberOf(it.value));
        return (
          <li key={i} className="vz-bars__row">
            <span className="vz-bars__label">{md(labelOf(it), true)} <TierTag tier={it.tier} /></span>
            <span className="vz-bars__track" aria-hidden="true">
              <span className="vz-bars__fill" style={{ width: `${max ? Math.max(2, (v / max) * 100) : 0}%` }} />
            </span>
            <span className="vz-bars__value">{md(it.value ?? "", true)}</span>
            {it.caption ? <span className="vz-bars__cap">{md(it.caption, true)}</span> : null}
            <ItemDetails it={it} md={md} />
          </li>
        );
      })}
    </ul>
  );
}

const DONUT_TONES = ["var(--pf-accent-solid)", "var(--pf-earth-solid)", "var(--pf-sisal)", "var(--pf-t1)", "var(--pf-neutral-tile)", "var(--pf-rival-solid)"];

function Donut({ items, md }: { items: Item[]; md: Md }) {
  const values = items.map((it) => Math.max(0, numberOf(it.value)));
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const R = 15.9155;
  // Each segment starts where the ones before it end: 25 puts the first at twelve o'clock.
  const offsets = values.map((_, i) => 25 - values.slice(0, i).reduce((a, b) => a + (b / total) * 100, 0));
  return (
    <div className="vz-donut">
      <svg viewBox="0 0 42 42" className="vz-donut__svg" aria-hidden="true">
        <circle cx="21" cy="21" r={R} fill="none" stroke="var(--pf-line)" strokeWidth="6" />
        {values.map((v, i) => {
          const pct = (v / total) * 100;
          return (
            <circle
              key={i}
              cx="21"
              cy="21"
              r={R}
              fill="none"
              stroke={DONUT_TONES[i % DONUT_TONES.length]}
              strokeWidth="6"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={offsets[i]}
            />
          );
        })}
      </svg>
      <ul className="vz-donut__legend">
        {items.map((it, i) => (
          <li key={i}>
            <span className="vz-donut__swatch" style={{ background: DONUT_TONES[i % DONUT_TONES.length] }} aria-hidden="true" />
            <span className="vz-donut__value">{md(it.value ?? "", true)}</span> {md(labelOf(it), true)} <TierTag tier={it.tier} />
            {it.conflict ? <> <ConflictMark conflict={it.conflict} /></> : null}
            <ItemDetails it={it} md={md} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function sideItems(side?: Side): Item[] {
  return side?.items ?? [];
}

function Body({ spec, md }: { spec: VisualSpec; md: Md }) {
  const items = spec.items ?? [];
  switch (spec.kind) {
    case "stats": return <Stats items={items} md={md} />;
    case "cards": return <Cards items={items} md={md} preset={spec.preset} />;
    case "tabs": return <Tabs items={items} md={md} />;
    case "timeline":
    case "stepper":
    case "checklist": return <Sequence items={items} md={md} kind={spec.kind} />;
    case "inout":
      return (
        <div className="vz-cols">
          {spec.in?.length ? <Column title="In this engagement" items={spec.in} md={md} tone="in" /> : null}
          {spec.out?.length ? <Column title="Outside it" items={spec.out} md={md} tone="out" /> : null}
        </div>
      );
    case "contrast":
      return (
        <div className="vz-cols">
          <Column title={spec.left?.title ?? ""} items={sideItems(spec.left)} md={md} tone="left" />
          <Column title={spec.right?.title ?? ""} items={sideItems(spec.right)} md={md} tone="right" />
        </div>
      );
    case "hypothesis":
      return <Panels md={md} panels={[["Hypothesis", spec.hypothesis], ["Evidence for", spec.for], ["Evidence against", spec.against], ["The test", spec.test]]} />;
    case "qa":
      return <Panels md={md} panels={[["The attack", spec.attack], ["The answer", spec.answer]]} />;
    case "crosswalk":
    case "matrix": return <Table spec={spec} md={md} />;
    case "nested": return <Nested items={items} md={md} />;
    case "week": return <Week items={items} md={md} />;
    case "bars": return <Bars items={items} md={md} />;
    case "donut": return <Donut items={items} md={md} />;
  }
}

export function VisualFence({ json, md }: { json: string; md: Md }) {
  let spec: VisualSpec | null = null;
  try {
    spec = JSON.parse(json) as VisualSpec;
  } catch {
    spec = null;
  }
  if (!spec || !spec.kind) {
    return (
      <p className="not-prose my-4 rounded-lg border border-dashed border-gold/60 bg-gold/[0.06] px-3 py-2 t-micro text-ink">
        <strong className="font-bold text-gold">Malformed visual fence.</strong> Run <code>npm run content</code>; the build names the line.
      </p>
    );
  }
  return (
    <figure className={`vz not-prose vz--${spec.kind}`} id={spec.id} data-visual={spec.kind} role="group" aria-label={spec.title ?? undefined}>
      {spec.title || spec.note ? (
        <figcaption className="vz__cap">
          {spec.title ? <h4 className="vz__title">{md(spec.title, true)}</h4> : null}
          {spec.note ? <p className="vz__note">{md(spec.note, true)}</p> : null}
        </figcaption>
      ) : null}
      <div className="vz__body">
        <Body spec={spec} md={md} />
      </div>
      {spec.source ? <p className="vz__source">{md(spec.source, true)}</p> : null}
      {spec.body ? (
        <More label="Read the full text">
          <div className="vz-body prose max-w-none">{md(spec.body)}</div>
        </More>
      ) : null}
    </figure>
  );
}
