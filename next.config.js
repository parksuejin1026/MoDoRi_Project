// 📁 next.config.js 파일 내용 (최종 수정)

/** @type {import('next').NextConfig} */ 
const nextConfig = {
    // ⭐️ Vercel 이미지 최적화 설정은 유지
    images: {
        remotePatterns: [
            // ... (기존 remotePatterns 내용 유지)
        ],
    },
    
    // transpilePackages: ['mongoose'], // 👈 이 설정을 제거합니다.

    // ⭐️ [신규 추가]: Mongoose를 번들링에서 제외하여 오류 해결
    webpack: (config, { isServer }) => {
        // 서버 측 빌드일 때만 적용 (Mongoose는 서버에서만 필요)
        if (isServer) {
            config.externals = {
                ...config.externals,
                'mongoose': 'mongoose', // Mongoose를 외부 모듈로 처리
                // aws4 경고도 여기서 처리 가능
                'aws4': 'aws4',
            };
        }
        return config;
    },
};

module.exports = nextConfig;