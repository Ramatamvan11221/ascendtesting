import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "better-auth"],

  // Bypass TypeScript errors pas build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Matiin dev indicators
  devIndicators: false,
};

export default nextConfig;