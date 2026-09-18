"use client";

/**
 * The desktop edge rail: one tick per section, the current one lit.
 *
 * It is an orientation device, not a menu — the ticks are 2px wide and carry no labels until
 * hovered. Measured at 1440px, it occupies the gutter the reading column does not use, so it
 * covers nothing: the floating capsule it replaced sat over the document and, at that width, over
 * the ward register's own figures. A reader on a wide screen gets the shape of the document and how far down it they are
 * without anything competing with the reading column. It is absent on phones, where the flow
 * capsule already answers the same question in the space available.
 */
export function FlowRail({
  items,
  activeIndex,
  onSelect,
}: {
  items: { id: string; number: string; label: string }[];
  activeIndex: number;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="flow-rail print:hidden" aria-label="Sections">
      <ul>
        {items.map((it, i) => (
          <li key={it.id}>
            <button
              type="button"
              data-active={i === activeIndex}
              data-passed={i < activeIndex}
              onClick={() => onSelect(it.id)}
              aria-current={i === activeIndex ? "true" : undefined}
            >
              <span className="flow-rail__tick" aria-hidden="true" />
              <span className="flow-rail__name">
                <b>{it.number}</b> {it.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
