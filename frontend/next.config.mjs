/** @type {import('next').NextConfig} */

const isLocal = process.env.NODE_ENV === 'development'; // 로컬 환경인지 확인 (단독개발시)

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: isLocal
          ? 'http://localhost:8080/api/:path*'
          : 'http://backend:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
