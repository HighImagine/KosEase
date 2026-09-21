import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tbgvoahqynwsiqfrqkem.supabase.co",
        pathname: "/storage/v1/avatars/**",
      },
    ],
  },
};

export default nextConfig;
