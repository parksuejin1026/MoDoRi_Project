// 📁 next.config.js 파일 내용 (JavaScript로 변환)

/** @type {import('next').NextConfig} */ // ⭐️ 타입 정의 주석은 유지 가능
const nextConfig = {
  // ⭐️ Vercel 이미지 최적화를 위해 이 부분이 필요합니다.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // 다른 Next.js 설정이 있다면 여기에 추가
};

module.exports = nextConfig; // ⭐️ CommonJS 문법으로 익스포트