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
