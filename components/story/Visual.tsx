import type { Field, Item, Side, VisualSpec } from "@/lib/visual";
import { numberOf } from "@/lib/visual";
import { Md, MdInline } from "./Md";

/**
 * A ```visual block from the chapter markdown, drawn on the server. No script: anything that does
 * not show on load sits in a native <details>, which works by keyboard and with JavaScript off.
 */
const labelOf = (it: Item) => it.title ?? it.label ?? it.day ?? "";

function Fields({ fields }: { fields?: Field[] }) {
  if (!fields?.length) return null;
  return (
    <dl className="v-fields">
      {fields.map((f, i) => (
        <div key={i}>
          <dt>{f.label ? <MdInline text={f.label} /> : null}</dt>
          <dd><MdInline text={f.text} /></dd>
        </div>
      ))}
    </dl>
  );
}

/** What an item keeps behind its disclosure: the remaining fields and the free text. */
function More({ it, label = "More" }: { it: Item; label?: string }) {
  if (!it.fields?.length && !it.body) return null;
  return (
    <details className="v-more">
      <summary>{label}</summary>
      <Fields fields={it.fields} />
      {it.body ? <div className="v-prose"><Md text={it.body} /></div> : null}
    </details>
  );
}

function Chips({ it }: { it: Item }) {
  const chips = [...(it.chips ?? []), ...(it.badge ? [it.badge] : [])];
  if (!chips.length) return null;
  return (
    <ul className="v-chips" aria-label="Tags">
      {chips.map((c) => <li key={c}><MdInline text={c} /></li>)}
    </ul>
  );
}

/** The visible face of an item: its label, short line, headline field and caption. */
function Face({ it, heading = true }: { it: Item; heading?: boolean }) {
  const label = labelOf(it);
  return (
    <>
      {heading && label ? <p className="v-label"><MdInline text={label} />{it.when ? <span className="v-when"> · {it.when}</span> : null}</p> : null}
      {it.head ? <p className="v-head"><strong><MdInline text={it.head.label} />:</strong> <MdInline text={it.head.text} /></p> : null}
      {it.text ? <div className="v-text"><MdInline text={it.text} /></div> : null}
      {it.caption ? <p className="v-caption"><MdInline text={it.caption} /></p> : null}
      <Chips it={it} />
    </>
  );
}

function Stats({ items }: { items: Item[] }) {
  return (
    <ul className="v-stats">
      {items.map((it, i) => (
        <li key={i}>
          <p className="v-stat"><MdInline text={it.value ?? ""} /></p>
          <p className="v-stat-label"><MdInline text={labelOf(it)} /></p>
          {it.caption ? <p className="v-caption"><MdInline text={it.caption} /></p> : null}
          <More it={it} label="Where this comes from" />
        </li>
      ))}
    </ul>
  );
}

function Cards({ items }: { items: Item[] }) {
  return (
    <ul className="v-cards">
      {items.map((it, i) => (
        <li key={i} className="v-card">
          <Face it={it} />
          {it.items?.length ? <Nested items={it.items} /> : null}
          <More it={it} />
        </li>
      ))}
    </ul>
  );
}

/** Tabs, drawn as stacked panels: every panel is in view, so nothing hides behind a control. */
function Tabs({ items }: { items: Item[] }) {
  return (
    <div className="v-tabs">
      {items.map((it, i) => (
        <section key={i} className="v-card">
          <h4 className="v-tab-title"><MdInline text={labelOf(it)} /></h4>
          <Face it={it} heading={false} />
          <Fields fields={it.fields} />
          {it.body ? <div className="v-prose"><Md text={it.body} /></div> : null}
        </section>
      ))}
    </div>
  );
}

function Sequence({ items, kind }: { items: Item[]; kind: "timeline" | "stepper" | "checklist" }) {
  const Tag = kind === "checklist" ? "ul" : "ol";
  return (
    <Tag className={`v-seq v-seq--${kind}`}>
      {items.map((it, i) => (
        <li key={i}>
          <span className="v-seq-mark" aria-hidden="true">{kind === "stepper" ? i + 1 : ""}</span>
          <div>
            <Face it={it} />
            <More it={it} />
          </div>
        </li>
      ))}
    </Tag>
  );
}

function Column({ title, items, tone }: { title: string; items: Item[]; tone: string }) {
  return (
    <div className={`v-col v-col--${tone}`}>
      <h4 className="v-col-title">{title}</h4>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <Face it={it} />
            <More it={it} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Panels({ panels }: { panels: [string, string | undefined][] }) {
  return (
    <div className="v-panels">
      {panels.filter(([, t]) => t).map(([title, text]) => (
        <div key={title} className="v-card">
          <h4 className="v-col-title">{title}</h4>
          <div className="v-prose"><Md text={text} /></div>
        </div>
      ))}
    </div>
  );
}

function Table({ spec }: { spec: VisualSpec }) {
  const columns = spec.columns ?? [];
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label={spec.title ? `Table: ${spec.title}` : "Table"}>
      <table>
        <thead>
          <tr>{columns.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr>
        </thead>
        <tbody>
          {(spec.rows ?? []).map((r, i) => (
            <tr key={i}>
              {r.cells.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    <MdInline text={c} />
                    {r.body ? <details className="v-more"><summary>More</summary><div className="v-prose"><Md text={r.body} /></div></details> : null}
                  </th>
                ) : (
                  <td key={j}><MdInline text={c} /></td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Nested({ items }: { items: Item[] }) {
  return (
    <ul className="v-nested">
      {items.map((it, i) => (
        <li key={i}>
          <Face it={it} />
          <Fields fields={it.fields} />
          {it.items?.length ? <Nested items={it.items} /> : null}
          {it.body ? <details className="v-more"><summary>More</summary><div className="v-prose"><Md text={it.body} /></div></details> : null}
        </li>
      ))}
    </ul>
  );
}

function Week({ items }: { items: Item[] }) {
  return (
    <ol className="v-week">
      {items.map((d, i) => (
        <li key={i} className="v-card">
          <p className="v-label">{labelOf(d)}</p>
          {d.text ? <div className="v-text"><MdInline text={d.text} /></div> : null}
          {d.items?.length ? (
            <ul className="v-week-items">
              {d.items.map((x, j) => (
                <li key={j}><strong><MdInline text={labelOf(x)} /></strong>{x.text ? <> <MdInline text={x.text} /></> : null}<More it={x} /></li>
              ))}
            </ul>
          ) : null}
          <More it={d} />
        </li>
      ))}
    </ol>
  );
}

function Bars({ items }: { items: Item[] }) {
  const max = Math.max(...items.map((it) => Math.abs(numberOf(it.value))));
  return (
    <ul className="v-bars">
      {items.map((it, i) => {
        const v = Math.abs(numberOf(it.value));
        return (
          <li key={i}>
            <span className="v-bars-label"><MdInline text={labelOf(it)} /></span>
            <span className="v-bars-value"><MdInline text={it.value ?? ""} /></span>
            <span className="v-bars-track" aria-hidden="true"><span style={{ width: `${max ? Math.max(2, (v / max) * 100) : 0}%` }} /></span>
            {it.caption ? <span className="v-caption"><MdInline text={it.caption} /></span> : null}
            <More it={it} />
          </li>
        );
      })}
    </ul>
  );
}

const DONUT = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)", "var(--c6)"];

function Donut({ items }: { items: Item[] }) {
  const values = items.map((it) => Math.max(0, numberOf(it.value)));
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const R = 15.9155;
  const offsets = values.map((_, i) => 25 - values.slice(0, i).reduce((a, b) => a + (b / total) * 100, 0));
  return (
    <div className="v-donut">
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <circle cx="21" cy="21" r={R} fill="none" stroke="var(--line)" strokeWidth="6" />
        {values.map((v, i) => {
          const pct = (v / total) * 100;
          return <circle key={i} cx="21" cy="21" r={R} fill="none" stroke={DONUT[i % DONUT.length]} strokeWidth="6" strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={offsets[i]} />;
        })}
      </svg>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <span className="v-swatch" style={{ background: DONUT[i % DONUT.length] }} aria-hidden="true" />
            <strong><MdInline text={it.value ?? ""} /></strong> <MdInline text={labelOf(it)} />
            <More it={it} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const side = (s?: Side): Item[] => s?.items ?? [];

function Body({ spec }: { spec: VisualSpec }) {
  const items = spec.items ?? [];
  switch (spec.kind) {
    case "stats": return <Stats items={items} />;
    case "cards": return <Cards items={items} />;
    case "tabs": return <Tabs items={items} />;
    case "timeline":
    case "stepper":
    case "checklist": return <Sequence items={items} kind={spec.kind} />;
    case "inout":
      return (
        <div className="v-cols">
          {spec.in?.length ? <Column title="What it covers" items={spec.in} tone="in" /> : null}
          {spec.out?.length ? <Column title="What it does not cover" items={spec.out} tone="out" /> : null}
        </div>
      );
    case "contrast":
      return (
        <div className="v-cols">
          <Column title={spec.left?.title ?? ""} items={side(spec.left)} tone="left" />
          <Column title={spec.right?.title ?? ""} items={side(spec.right)} tone="right" />
        </div>
      );
    case "hypothesis": return <Panels panels={[["Hypothesis", spec.hypothesis], ["Evidence for", spec.for], ["Evidence against", spec.against], ["The test", spec.test]]} />;
    case "qa": return <Panels panels={[["The attack", spec.attack], ["The answer", spec.answer]]} />;
    case "crosswalk":
    case "matrix": return <Table spec={spec} />;
    case "nested": return <Nested items={items} />;
    case "week": return <Week items={items} />;
    case "bars": return <Bars items={items} />;
    case "donut": return <Donut items={items} />;
  }
}

export function Visual({ json }: { json: string }) {
  const spec = JSON.parse(json) as VisualSpec;
  return (
    <figure className={`v v--${spec.kind}`} id={spec.id} aria-label={spec.title ? spec.title.replace(/[*_`]/g, "") : undefined}>
      {spec.title || spec.note ? (
        <figcaption>
          {spec.title ? <p className="v-title"><MdInline text={spec.title} /></p> : null}
          {spec.note ? <p className="v-note"><MdInline text={spec.note} /></p> : null}
        </figcaption>
      ) : null}
      <Body spec={spec} />
      {spec.source ? <p className="source"><MdInline text={spec.source} /></p> : null}
      {spec.body ? <details className="v-more"><summary>Read the full text</summary><div className="v-prose"><Md text={spec.body} /></div></details> : null}
    </figure>
  );
}
