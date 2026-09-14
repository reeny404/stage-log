import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@stagelog/ui", "@stagelog/analytics"],
};

export default nextConfig;
