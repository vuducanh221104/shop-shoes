import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ['./src/styles'],
    images: {
      domains: [
        "https://images.unsplash.com",

      ],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.unsplash.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "fonts.googleapis.com",
          pathname: "/**",
        },
      ],
    },
  },
};

export default nextConfig;
