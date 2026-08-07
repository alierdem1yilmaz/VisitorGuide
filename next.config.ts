import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Prisma's generator uses a custom output path (src/generated/prisma)
  // instead of the default node_modules/.prisma/client. Next.js's output
  // file tracing doesn't reliably auto-detect the native query engine
  // binary there, so it can be silently dropped from the deployed
  // serverless function bundle even though it's generated correctly at
  // build time. Force-include it explicitly.
  outputFileTracingIncludes: {
    "/**/*": ["./src/generated/prisma/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
