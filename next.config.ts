import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load environment variables from local.env
dotenv.config({ path: "./local.env" });

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Expose the environment variables to the browser
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
};

export default nextConfig;
