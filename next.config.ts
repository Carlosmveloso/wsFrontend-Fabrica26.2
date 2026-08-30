import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://d15f34w2p8l1cc.cloudfront.net/**")],
  },
};

export default nextConfig;
