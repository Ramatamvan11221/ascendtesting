import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "better-auth"],
  
  // INI YANG BENER BUAT NEXT.JS 16+
  devIndicators: false,  // <-- Langsung false, bukan object!
  
  // Atau pake cara alternatif:
  // experimental: {
  //   devIndicators: false,
  // },
};

export default nextConfig;