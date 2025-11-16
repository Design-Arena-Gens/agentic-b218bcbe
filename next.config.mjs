/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverActions: {
      allowedOrigins: ["https://agentic-b218bcbe.vercel.app"]
    }
  }
};

export default nextConfig;
