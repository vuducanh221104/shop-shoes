/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'localhost', 'static.nike.com'],
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "fonts.googleapis.com",
      pathname: "/**",
    },
  ],
  sassOptions: {
    includePaths: ['./src/styles'],
  },
};

export default nextConfig; 