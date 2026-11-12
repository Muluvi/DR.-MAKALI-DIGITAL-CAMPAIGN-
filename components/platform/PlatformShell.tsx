import Link from "next/link";
import { PlatformNav } from "@/components/platform/PlatformNav";
import { PUBLIC_RETRIEVED } from "@/lib/public-data";

/**
 * The platform around the story. Everything here is open to anyone with the link, and anyone with
 * the link can edit: there is no sign-in. Firefly runs the platform; Dr. Mulu's team runs the
 * campaign through it.
 *
 * The platform layout wraps its pages in this, and so does /tools, whose page sits outside the
 * route group because the file is protected (scripts/check-preservation.js).
 */
export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="plat-chrome sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 pt-3 sm:px-6">
          <Link href="/" prefetch={false} className="font-serif text-lg leading-none text-ink">Kitui 2027</Link>
          <span className="hidden text-[0.75rem] text-muted sm:inline">The campaign platform</span>
        </div>
        <PlatformNav />
      </header>
      <main className="plat-page mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6">{children}</main>
      <footer className="plat-chrome mx-auto max-w-6xl px-4 pb-10 text-[0.78rem] text-muted sm:px-6">
        Open to everyone: anyone with the link sees everything and can add to it, with no account. Every change is in the change history and can be put back. Firefly built, owns and runs the platform; the campaign owns its content and data.
        <p className="mt-1">Official election data last verified <time dateTime={PUBLIC_RETRIEVED}>{new Date(`${PUBLIC_RETRIEVED}T00:00:00+03:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" })}</time>. <Link className="underline" href="/tools/sources">Sources and gaps</Link></p>
        <p className="mt-1 print:hidden"><Link className="underline" href="/help">Help</Link> · <Link className="underline" href="/status">Status</Link> · <Link className="underline" href="/privacy">Privacy</Link></p>
      </footer>
    </div>
  );
}
