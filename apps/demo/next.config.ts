import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['config-driven-testimonials', '@config-driven-testimonials/editor', '@config-driven-testimonials/config-schema'],
};

export default nextConfig;
