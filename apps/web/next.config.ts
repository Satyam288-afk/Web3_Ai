import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sentinelmesh/shared", "@sentinelmesh/web3"]
};

export default nextConfig;
