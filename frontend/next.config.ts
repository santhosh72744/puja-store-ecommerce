// next.config.ts
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/products/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // No turbopack flag here
};

export default nextConfig;
