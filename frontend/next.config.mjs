/** @type {import('next').NextConfig} */

const isLocal = process.env.NODE_ENV === 'development'; // 로컬 환경인지 확인 (단독개발시)

const nextConfig = {
  output: 'standalone',
  async rewrites() { // 리라이트 설정 (실제 요청 주소만 변경)
    return [
      {
        // source : 프론트에서 쓰는 api 주소 형태 정의
        source: '/api/:path*',
        // destination : 실제 요청을 처리하는 백엔드 주소
        destination: isLocal
          ? 'http://localhost:8080/api/:path*'
          : 'http://backend:8080/api/:path*', // 도커 컴포즈 내 서비스명
      },
    ];
  },
};

export default nextConfig;
