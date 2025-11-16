// 📁 next.config.js 파일 내용 (최종 오류 수정 버전)

/** @type {import('next').NextConfig} */ 
const nextConfig = {
    images: {
        remotePatterns: [
            // ... (기존 remotePatterns 내용 유지)
        ],
    },
    
    // ⭐️ [최종 수정]: Webpack 설정을 함수로 처리하여 Mongoose와 aws4를 명시적으로 외부 모듈 처리
    webpack: (config, { isServer }) => {
        if (isServer) {
            // config.externals가 배열이 아닐 경우, 배열로 초기화
            if (!Array.isArray(config.externals)) {
                config.externals = [];
            }
            
            // Mongoose와 aws4를 외부 모듈로 추가
            // (Next.js 빌드 시 Node.js 환경에서 찾도록 commonjs 형식 지정)
            config.externals.push({
                'mongoose': 'commonjs mongoose',
                'aws4': 'commonjs aws4',
            });
        }
        return config;
    },
};

module.exports = nextConfig;