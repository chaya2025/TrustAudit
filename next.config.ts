import type { NextConfig } from "next";

// Fix for corporate network SSL certificate issues in development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {};

export default nextConfig;
