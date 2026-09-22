import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

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

export default withNextIntl(nextConfig);
