import "../platform.css";
import { PlatformShell } from "@/components/platform/PlatformShell";
import { ToolsIndex } from "@/components/platform/ToolsIndex";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tools | Kitui 2027",
  description: "Reference tools for Kitui 2027: the race calendar, ward dossiers, the nomination path, the service-delivery tracker and the sources behind them.",
};

/**
 * The Tools hub, in the platform's chrome. It replaced the dark-theme toolkit page
 * (components/tools/ToolsHub.tsx, kept on disk because the preservation check protects it): that
 * page listed thirty-three tools, most of them "Not built yet". The scenario tools moved to /models.
 */
export default function ToolsPage() {
  return <PlatformShell><ToolsIndex /></PlatformShell>;
}
