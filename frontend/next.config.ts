import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use current dir as Turbopack root (run `npm run dev` from frontend/ so port 3001 is used)
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
