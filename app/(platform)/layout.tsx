import Link from "next/link";
import "../platform.css";
import { PlatformNav } from "@/components/platform/PlatformNav";
import { PUBLIC_RETRIEVED } from "@/lib/public-data";

export const dynamic = "force-dynamic";

/**
 * The platform around the story. Everything here is open to anyone with the link, and read-only:
 * there is no sign-in and no editing on the site. Firefly runs the platform; Dr. Mulu's team runs
 * the campaign through it.
 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="plat-chrome sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 pt-3 sm:px-6">
          <Link href="/" className="font-serif text-lg leading-none text-ink">Kitui 2027</Link>
          <span className="hidden text-[0.75rem] text-muted sm:inline">The campaign platform</span>
        </div>
        <PlatformNav />
      </header>
      <main className="plat-page mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6">{children}</main>
      <footer className="plat-chrome mx-auto max-w-6xl px-4 pb-10 text-[0.78rem] text-muted sm:px-6">
        Open to view: anyone with the link sees everything. Firefly built, owns and runs the platform; the campaign owns its content and data.
        <p className="mt-1">Official election data last verified <time dateTime={PUBLIC_RETRIEVED}>{new Date(`${PUBLIC_RETRIEVED}T00:00:00+03:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" })}</time>. <Link className="underline" href="/tools/sources">Sources and gaps</Link></p>
      </footer>
    </div>
  );
}
