import Image from "next/image";

/**
 * Firefly Management's official logo, in the two versions Firefly supplied (November 2026):
 *   public/brand/firefly-logo-light.webp  for light surfaces (the transparent original)
 *   public/brand/firefly-logo-dark.webp   for dark surfaces (the black-ground original, with the
 *                                         black taken out so the glow sits on any dark colour)
 *
 * `surface` says what the logo sits on in the light theme. "page" follows the page: light logo
 * in the light theme, dark logo under `.dark`. "inverse" is for panels painted in var(--ink),
 * which are dark in the light theme and light in the dark theme, so the swap runs the other way.
 *
 * Used only where the site credits Firefly as builder and operator; the campaign's own identity
 * stays Dr. Mulu's.
 */
const W = 640;
const H = 818;

export function FireflyLogo({ width = 96, surface = "page", className = "" }: { width?: number; surface?: "page" | "inverse"; className?: string }) {
  const height = Math.round((width * H) / W);
  const onLight = surface === "page" ? "dark:hidden" : "hidden dark:block";
  const onDark = surface === "page" ? "hidden dark:block" : "dark:hidden";
  const common = { width, height, sizes: `${width}px` } as const;
  return (
    <span className={`inline-block shrink-0 ${className}`} style={{ width, height }}>
      <Image {...common} src="/brand/firefly-logo-light.webp" alt="Firefly Management" className={onLight} />
      <Image {...common} src="/brand/firefly-logo-dark.webp" alt="Firefly Management" className={onDark} />
    </span>
  );
}
