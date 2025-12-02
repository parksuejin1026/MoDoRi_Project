// 📁 app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'UniMate',
        short_name: 'UniMate',
        description: '대학 생활의 모든 것, 유니메이트',
        start_url: '/',
        display: 'standalone', // ⭐️ 핵심: 브라우저 UI 제거하고 앱처럼 실행
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png', // 512x512 이미지가 있다면 그걸로 설정 권장
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}