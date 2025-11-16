// 📁 next.config.js 파일 내용 (최종 수정)

/** @type {import('next').NextConfig} */ 
const nextConfig = {
    images: {
        remotePatterns: [
            // ... (기존 remotePatterns 내용 유지)
        ],
    },
    
    // ⭐️ [최종 수정]: Webpack 설정을 함수 형태로 변경
    webpack: (config, { isServer }) => {
        // 서버 측 빌드일 때만 Mongoose와 aws4를 외부 모듈로 처리
        if (isServer) {
            // 기존 externals가 객체일 경우 스프레드 연산자로 추가
            config.externals = {
                ...(config.externals || {}), // 기존 externals를 유지하거나, 없으면 빈 객체로 시작
                'mongoose': 'commonjs mongoose', // Mongoose를 Node.js 환경에서 찾도록 commonjs 지정
                'aws4': 'commonjs aws4',        // aws4 경고 처리
            };
        }
        return config;
    },
};

module.exports = nextConfig;