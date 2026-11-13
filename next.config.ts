import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const security = [
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
    ];
    // Fingerprinted build files are already cached for a year by Next. These are the static files
    // whose names do not change between deploys: short in the browser, long at the edge (Vercel
    // purges the edge on every deploy), and served stale while they refresh.
    const fresh = [{ key: "Cache-Control", value: "public, max-age=600, s-maxage=31536000, stale-while-revalidate=86400" }];
    return [
      { source: "/:path*", headers: security },
      { source: "/c/:path*", headers: fresh },
      { source: "/datasets/:path*", headers: fresh },
      { source: "/csv/:path*", headers: fresh },
      { source: "/charts.css", headers: fresh },
      { source: "/og/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ];
  },
  async redirects() {
    // Every page of the old separate section, and every old chapter route, now lives on the one
    // page. A shared link lands on the place that holds its content.
    const moved: Record<string, string> = {
      "/explore": "/#explore",
      "/dashboards": "/#dashboards",
      "/tools": "/#data",
      "/tools/race-calendar": "/#race-calendar",
      "/tools/ward-dossier": "/#ward-dossier",
      "/tools/ward-dossier/:code": "/#ward-dossier",
      "/tools/nomination-path": "/#nomination-path",
      "/tools/service-delivery": "/#projects-register",
      "/tools/sources": "/#sources",
      "/models": "/#analysis",
      "/models/:slug": "/#:slug",
      "/tools/winning-number": "/#winning-number",
      "/tools/polling-agents": "/#polling-agents",
      "/strategies": "/#strategies",
      "/progress": "/#implementation",
      "/workspace": "/#implementation",
      "/workspace/:collection": "/#implementation",
      "/history": "/",
      "/edit-data": "/",
      "/help": "/",
      "/status": "/",
      "/privacy": "/",
      "/full": "/",
      "/team/:path*": "/",
    };
    const chapters = ["kitui", "votes", "needs", "news", "race", "record", "diagnosis", "goal", "position", "message", "voters", "channels", "engagement", "timeline", "rollout", "workstreams", "success", "lawful", "response"];
    const retired: Record<string, string> = {
      cover: "top", brief: "top", platform: "implementation", receives: "implementation", ask: "objectives",
      "annex-evidence": "sources", "annex-terms": "terms",
      objectives: "objectives", data: "data", analysis: "analysis", implementation: "implementation",
      decision: "objectives", evidence: "data", strategy: "strategies", delivery: "timeline", staffing: "engagement",
      measurement: "success", risks: "response", nextsteps: "objectives", team: "engagement", commitments: "engagement",
      coalitions: "timeline", "annex-county": "votes", "annex-glossary": "terms", "annex-volunteers": "workstreams",
    };
    return [
      ...Object.entries(moved).map(([source, destination]) => ({ source, destination, permanent: false })),
      ...chapters.map((c) => ({ source: `/${c}`, destination: `/#${c}`, permanent: false })),
      ...Object.entries(retired).map(([from, to]) => ({ source: `/${from}`, destination: `/#${to}`, permanent: false })),
    ];
  },
};

export default nextConfig;
