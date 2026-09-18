import type { TabId } from "./heading-slug";

/**
 * One markdown file per section, named for the section it serves.
 *
 * It lives here rather than in the route because the client needs it too: on the flow, sections
 * past the first two fetch their own prose from /content/<file> as the reader approaches them,
 * and both sides have to agree on the filename.
 */
export const CONTENT_FILES: Record<TabId, string> = {
  decision: "decision.md",
  cover: "cover.md",
  presence: "presence.md",
  summary: "summary.md",
  situation: "situation.md",
  objectives: "objectives.md",
  audiences: "audiences.md",
  approach: "approach.md",
  engine: "engine.md",
  messaging: "messaging.md",
  scope: "scope.md",
  "scope-platforms": "scope-platforms.md",
  "scope-media": "scope-media.md",
  "scope-ground": "scope-ground.md",
  "scope-data": "scope-data.md",
  roadmap: "roadmap.md",
  deliverables: "deliverables.md",
  measurement: "measurement.md",
  governance: "governance.md",
  risk: "risk.md",
  structure: "structure.md",
  assumptions: "assumptions.md",
  nextsteps: "nextsteps.md",
  arithmetic: "arithmetic.md",
  reach: "reach.md",
  "annex-evidence": "annex-evidence.md",
  "annex-county": "annex-county.md",
  "annex-messages": "annex-messages.md",
  "annex-cadence": "annex-cadence.md",
  "annex-runbooks": "annex-runbooks.md",
};

export const contentUrl = (tabId: TabId) => `/content/${CONTENT_FILES[tabId]}`;
