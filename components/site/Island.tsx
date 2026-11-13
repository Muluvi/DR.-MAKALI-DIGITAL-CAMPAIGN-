"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { whenEngaged } from "./ChapterLoader";

/**
 * Every tool, model, dashboard and the phone mockup is its own chunk, fetched only as the reader
 * nears it. The space is reserved first (--reserve), so the page does not jump when it arrives.
 */
const LOADERS: Record<string, () => Promise<ComponentType>> = {
  "winning-number": () => import("@/components/tools/models/WinningNumber").then((m) => m.default),
  "ward-priority": () => import("@/components/tools/models/WardPriority").then((m) => m.default),
  "polling-agents": () => import("@/components/tools/models/PollingAgents").then((m) => m.default),
  "reach-by-channel": () => import("@/components/tools/models/ReachByChannel").then((m) => m.default),
  "brief-mix": () => import("@/components/tools/models/BriefMix").then((m) => m.default),
  "send-check": () => import("@/components/tools/models/SendCheck").then((m) => m.default),
  "rollout-planner": () => import("@/components/tools/models/RolloutPlanner").then((m) => m.default),
  "response-tier": () => import("@/components/tools/models/ResponseTier").then((m) => m.default),
  "record-finder": () => import("@/components/tools/models/RecordFinder").then((m) => m.default),
  "race-calendar": () => import("@/components/tools/RaceCalendar").then((m) => m.default),
  "nomination-path": () => import("@/components/tools/NominationPath").then((m) => m.default),
  "ward-dossier": () => import("@/components/tools/WardDossier").then((m) => m.default),
  "projects-register": () => import("@/components/tools/ProjectsRegister").then((m) => m.default),
  "data-explorer": () => import("@/components/tools/DataExplorer").then((m) => m.default),
  "register-turnout": () => import("@/components/tools/RegisterTurnout").then((m) => m.default),
  "phone-mockup": () => import("@/components/tools/PhoneMockup").then((m) => m.default),
};

export type IslandName = keyof typeof LOADERS;

export function Island({ name, reserve, label }: { name: IslandName; reserve: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Comp, setComp] = useState<ComponentType | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        LOADERS[name]()
          .then((c) => setComp(() => c))
          .catch(() => setFailed(true));
      },
      { rootMargin: "600px 0px" },
    );
    let live = true;
    void whenEngaged().then(() => live && io.observe(el));
    return () => {
      live = false;
      io.disconnect();
    };
  }, [name]);

  return (
    <div ref={ref} id={name} className="island" data-ready={Comp ? "true" : undefined} style={{ "--reserve": `${reserve}px` } as React.CSSProperties} aria-busy={!Comp}>
      {Comp ? <Comp /> : failed ? <p className="placeholder" role="status">{label} did not load. Check the connection and reload the page.</p> : <span className="sr-only">Loading {label}</span>}
    </div>
  );
}
