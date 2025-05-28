/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'localhost','static.nike.com'],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
};

export default nextConfig; 