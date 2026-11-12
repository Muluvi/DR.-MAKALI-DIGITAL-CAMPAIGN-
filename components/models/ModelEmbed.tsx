"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { MODELS } from "@/lib/models/catalogue";

const EmbeddedModel = dynamic(() => import("./EmbeddedModel"), { ssr: false, loading: () => <p className="plat-hint p-4">Loading the model…</p> });

/**
 * A model inside a chapter of the story: written in the markdown as
 * <model-embed slug="ward-priority"></model-embed>. Closed, it is one line: the model's question
 * and a way in. Opened, the live model runs here, and the full page is one link away.
 */
export function ModelEmbed({ slug }: { slug?: string }) {
  const m = MODELS.find((x) => x.slug === slug);
  const [open, setOpen] = useState(false);
  if (!m) return null;
  return (
    <details className="plat-card model-embed my-6 not-prose" onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 p-4">
        <span>
          <span className="plat-kicker block">Try the model</span>
          <span className="mt-1 block font-serif text-lg text-ink">{m.name}: {m.question}</span>
          <span className="mt-1 block text-[0.85rem] text-muted">You set {m.inputs.charAt(0).toLowerCase() + m.inputs.slice(1)}.</span>
        </span>
        <span className="plat-btn plat-btn-sm" aria-hidden="true">{open ? "Close" : "Open"}</span>
      </summary>
      {open && (
        <div className="border-t border-line p-4">
          <EmbeddedModel slug={m.slug} />
          <p className="mt-4 text-[0.85rem]"><Link className="underline" href={`/models/${m.slug}`}>Open {m.name.toLowerCase()} on its own page</Link>, with its method, limits and sources, and a link you can share.</p>
        </div>
      )}
    </details>
  );
}
