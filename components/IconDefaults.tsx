"use client";

import { LucideProvider } from "lucide-react";

/**
 * One stroke weight for every icon on the site.
 *
 * The icon register asks for a 24-pixel grid at a 1.5-pixel stroke. Lucide's own default is 2,
 * and it scales the stroke with the icon, so a 10-pixel badge mark was rendering at 0.83px and a
 * 20-pixel control at 1.67px — three weights across one document, none of them the specified one.
 *
 * `absoluteStrokeWidth` holds the stroke at a true 1.5 device pixels whatever size the icon is
 * drawn at, which is what "1.5-pixel stroke" means and what keeps the small marks legible on a
 * phone. Any icon that passes its own `strokeWidth` still wins — the device mockups do, because
 * they are imitating platform chrome drawn at platform weights, not this document's icons.
 */
export function IconDefaults({ children }: { children: React.ReactNode }) {
  return (
    <LucideProvider strokeWidth={1.5} absoluteStrokeWidth>
      {children}
    </LucideProvider>
  );
}
