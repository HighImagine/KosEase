import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tbgvoahqynwsiqfrqkem.supabase.co",
        pathname: "/storage/v1/avatars/**",
      },
      {
        protocol: "https",
        hostname: "tbgvoahqynwsiqfrqkem.supabase.co",
        pathname: "/storage/v1/object/public/kos-foto/**",
      },
    ],
  },
};

export default nextConfig;
