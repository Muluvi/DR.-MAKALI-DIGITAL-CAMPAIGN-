import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://dr-makali-digital-campaign.vercel.app";
  return [
    {
      url: origin,
      lastModified: new Date("2026-11-04"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${origin}/full`,
      lastModified: new Date("2026-11-04"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
