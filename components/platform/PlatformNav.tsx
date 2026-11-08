"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Story" },
  { href: "/explore", label: "Explore data" },
  { href: "/dashboards", label: "Dashboards" },
  { href: "/tools", label: "Tools" },
  { href: "/strategies", label: "Strategies" },
  { href: "/progress", label: "Implementation" },
  { href: "/workspace", label: "Workspace" },
  { href: "/history", label: "Changes" },
];

export function PlatformNav({ signedIn }: { signedIn: boolean }) {
  const path = usePathname();
  const links = signedIn ? [...LINKS, { href: "/team/data", label: "Edit data" }] : LINKS;
  return (
    <nav aria-label="Platform" className="mx-auto max-w-6xl overflow-x-auto px-2 sm:px-4">
      <ul className="flex gap-1 py-2 text-[0.85rem]">
        {links.map((l) => {
          const on = l.href === "/" ? false : path === l.href || path.startsWith(`${l.href}/`);
          return (
            <li key={l.href} className="flex-none">
              <Link href={l.href} aria-current={on ? "page" : undefined} className={`block rounded-full px-3 py-1.5 ${on ? "bg-accent-solid text-on-accent" : "text-ink hover:bg-card"}`}>
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
