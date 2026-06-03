import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  allowedDevOrigins: ['devforge.local', '192.168.0.*'],
};

export default nextConfig;
