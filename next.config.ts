import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/artigos/novo",
        destination: "/admin/artigos/novo",
        permanent: false,
      },
      {
        source: "/artigos/:id",
        destination: "/admin/artigos/:id",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [{ source: "/", destination: "/index.html" }];
  },
};

export default nextConfig;
