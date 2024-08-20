/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mrwallpaper.com",
      },
    ],
  },
};

export default nextConfig;
