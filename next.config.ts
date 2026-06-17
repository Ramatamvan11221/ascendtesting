import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "better-auth"],
  typescript: { ignoreBuildErrors: true },
  devIndicators: false,
};

export default nextConfig;