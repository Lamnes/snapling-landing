import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static marketing site — no runtime backend. Railway (Nixpacks) builds with
  // `next build` and serves with `next start` on $PORT.
};

export default nextConfig;
