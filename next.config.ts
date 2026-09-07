import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // The portraits are the only images that ship, they are local, and they are already WebP.
    // AVIF is listed first because it is 20-30% smaller again at the same quality, which is the
    // difference that matters on the mobile data this proposal is explicitly written around.
    formats: ['image/avif', 'image/webp'],
    // Widths the layout actually requests: the hero at 1x/2x/3x, and the in-section portraits.
    // Trimming the default ladder stops the optimiser generating renditions nothing asks for.
    deviceSizes: [390, 640, 828, 1080, 1200, 1920],
    imageSizes: [128, 140, 150, 168, 196, 210, 260, 384],
    // Cutouts are transparent WebP; a year is safe because the filenames are versioned
    // by content and never change in place.
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  // Smaller client bundle: these two are import-heavy and tree-shake poorly by default.
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  transpilePackages: ['motion'],
  // The document's own deep links are URL fragments on a single route, and a browser never sends
  // a fragment to the server — those are preserved client-side by LEGACY_IDS in
  // lib/heading-slug.ts, which is the only mechanism that can work for them.
  //
  // These ten are the exception: the markdown files are real static assets under public/content,
  // so their paths are server-visible URLs, and the five-part restructure renamed every one.
  async redirects() {
    const moved: Record<string, string> = {
      '0-overview': '1-decision',
      '9-ask': '1-decision',
      '1-race': '2-evidence',
      '2-argument': '3-strategy',
      '3-channels': '4a-publishing',
      '4-ground': '4b-ground',
      '5-defence': '4c-defence',
      '6-data': '4d-technology',
      '7-team': '4e-team',
      '8-measure': '5-delivery',
    };
    return Object.entries(moved).map(([from, to]) => ({
      source: `/content/${from}.md`,
      destination: `/content/${to}.md`,
      permanent: true,
    }));
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
