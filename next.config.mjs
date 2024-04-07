/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    // remotePatterns: [
    //   {
    //     protocol: "https:",
    //     host: "res.cloudinary.com",
    //     port: "",
    //     path: "/.*",
    //   },
    // ],
  },
};

export default nextConfig;
