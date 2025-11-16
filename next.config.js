// 📁 next.config.js 파일 내용 (최종 수정)

/** @type {import('next').NextConfig} */ 
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
    
    // ⭐️ [신규 추가]: Mongoose 관련 빌드 충돌 및 경고를 해결하기 위한 조치
    transpilePackages: ['mongoose'], 
};

module.exports = nextConfig;