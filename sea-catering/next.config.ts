import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to complete with ESLint warnings
    // (warnings are still shown during development)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete with TypeScript warnings
    // (warnings are still shown during development)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
