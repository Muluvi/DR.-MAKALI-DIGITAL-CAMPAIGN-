import type { TabId } from "./heading-slug";

/**
 * One markdown file per section, named for the section it serves.
 *
 * It lives here rather than in the route because the client needs it too: on the flow, sections
 * past the first two fetch their own prose from /content/<file> as the reader approaches them,
 * and both sides have to agree on the filename.
 */
export const CONTENT_FILES: Record<string, string> = {
  decision: "nextsteps.md",
  cover: "cover.md",
  presence: "presence.md",
  summary: "objectives.md",
  situation: "situation.md",
  arithmetic: "arithmetic.md",
  reach: "reach.md",
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
  structure: "delivery.md",
  assumptions: "nextsteps.md",
  nextsteps: "nextsteps.md",
  data: "data.md",
  analysis: "analysis.md",
  strategy: "strategy.md",
  implementation: "implementation.md",
  "workstreams-platforms": "workstreams-platforms.md",
  "workstreams-media": "workstreams-media.md",
  "workstreams-ground": "workstreams-ground.md",
  "workstreams-data": "workstreams-data.md",
  delivery: "delivery.md",
  "annex-evidence": "annex-evidence.md",
  "annex-county": "annex-county.md",
  "annex-polls": "annex-polls.md",
  "annex-messages": "annex-messages.md",
  "annex-cadence": "annex-cadence.md",
  "annex-runbooks": "annex-runbooks.md",
  "annex-terms": "annex-terms.md",
};

export const contentUrl = (tabId: TabId) => CONTENT_FILES[tabId] ? `/content/${CONTENT_FILES[tabId]}` : "";
