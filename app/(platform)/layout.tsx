import "../platform.css";
import { PlatformShell } from "@/components/platform/PlatformShell";

export const dynamic = "force-dynamic";

/**
 * The platform around the story. Everything here is open to anyone with the link; signing in
 * only adds the ability to edit. Firefly runs the platform; Dr. Mulu's team runs the campaign
 * through it. The header, navigation and footer are in PlatformShell, which /tools shares.
 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <PlatformShell>{children}</PlatformShell>;
}
