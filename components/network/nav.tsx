"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NetworkNav({ links }: { links: { href: string; label: string }[] }) {
  const path = usePathname();
  if (!links.length) return null;
  return (
    <nav aria-label="Campaigner network" className="nw-tool-nav">
      {links.map((l) => (
        <Link key={l.href} href={l.href} aria-current={(l.href === "/network" ? path === l.href : path.startsWith(l.href)) ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
